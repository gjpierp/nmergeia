/**
 * @file NgacService.js
 * @description Cliente de servicio para interactuar con Sentinel-NGAC puro.
 * Permite registrar usuarios, autenticar, gestionar roles y consultar políticas usando nodos y enlaces.
 */

const DEFAULT_NGAC_URL = 'https://sentinel-ngac.herokuapp.com/api/v1/admin';

// Obtiene la URL base configurada o por defecto
const getNgacUrl = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('nmergeia_ngac_url') || DEFAULT_NGAC_URL;
  }
  return DEFAULT_NGAC_URL;
};

export const NgacService = {
  /**
   * Registra un nuevo usuario como un nodo de tipo 'u' en Sentinel-NGAC
   */
  registerUser: async (email, password) => {
    const baseUrl = getNgacUrl();
    
    // 1. Crear el nodo de usuario en Sentinel
    const userRes = await fetch(`${baseUrl}/nodos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigo: email,
        nombre: email.split('@')[0],
        tipo: 'u' // tipo de nodo User
      })
    });
    
    if (!userRes.ok) {
      const err = await userRes.text();
      throw new Error(err || 'Error al crear nodo de usuario en Sentinel-NGAC');
    }

    // 2. Asignar rol por defecto (ADMINISTRADOR si contiene admin, si no INVITADO)
    const defaultRole = email.includes('admin') ? 'ADMINISTRADOR' : 'INVITADO';
    const linkRes = await fetch(`${baseUrl}/enlaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        padre: defaultRole,
        hijo: email
      })
    });

    if (!linkRes.ok) {
      const err = await linkRes.text();
      throw new Error(err || 'Error al enlazar rol de usuario en Sentinel-NGAC');
    }
    
    return { success: true, email, role: defaultRole };
  },

  /**
   * Inicia sesión del usuario buscando su nodo y roles vinculados en Sentinel-NGAC
   */
  loginUser: async (email, password) => {
    const baseUrl = getNgacUrl();
    
    // 1. Obtener todos los nodos para validar la existencia del usuario
    const nodesRes = await fetch(`${baseUrl}/nodos`);
    if (!nodesRes.ok) throw new Error('Error al conectar con Sentinel-NGAC');
    
    const nodes = await nodesRes.json();
    const userNode = nodes.find(n => n.CODIGO === email || n.codigo === email);
    
    if (!userNode) {
      throw new Error('El usuario no existe en Sentinel-NGAC');
    }
    
    // 2. Obtener enlaces para extraer los roles (padres del nodo de usuario)
    const linksRes = await fetch(`${baseUrl}/enlaces`);
    if (!linksRes.ok) throw new Error('Error al obtener privilegios en Sentinel-NGAC');
    
    const links = await linksRes.json();
    const userRoles = links
      .filter(link => (link.HIJO === email || link.hijo === email))
      .map(link => link.PADRE || link.padre);
    
    return {
      id: email,
      email: email,
      roles: userRoles.length > 0 ? userRoles : ['INVITADO'],
      method: 'sentinel-ngac'
    };
  },

  /**
   * Consulta si una opción/recurso está disponible
   * Si las opciones están liberadas (free mode), permite el acceso a todos.
   */
  checkPermission: (optionName, userRoles = []) => {
    if (typeof window !== 'undefined') {
      const isNgacLocked = localStorage.getItem('nmergeia_ngac_locked') === 'true';
      if (!isNgacLocked) {
        // Modo liberado/abierto por defecto
        return true;
      }
    }
    
    // Si está bloqueado/premium, solo el rol ADMINISTRADOR tiene acceso a Ventas, Login y Licencia
    if (['Ventas', 'Login', 'Licencia'].includes(optionName)) {
      return userRoles.includes('ADMIN') || userRoles.includes('ADMINISTRADOR');
    }
    return true;
  },

  /**
   * Configura políticas de Sentinel-NGAC directamente en la API remota
   */
  setupNgacBasePolicies: async () => {
    const baseUrl = getNgacUrl();
    try {
      // 1. Crear Roles (como nodos User Attribute 'ua')
      await fetch(`${baseUrl}/nodos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: 'ADMINISTRADOR', nombre: 'Administrador', tipo: 'ua' })
      });
      await fetch(`${baseUrl}/nodos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: 'INVITADO', nombre: 'Invitado', tipo: 'ua' })
      });

      // 2. Crear Nodos para Opciones (como nodos Target/Object 'o')
      const options = ['Ventas', 'Login', 'Licencia'];
      for (const opt of options) {
        await fetch(`${baseUrl}/nodos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ codigo: opt, nombre: opt, tipo: 'o' })
        });
      }

      // 3. Crear Enlaces Jerárquicos / Decision Tree (Roles -> Opciones)
      for (const opt of options) {
        await fetch(`${baseUrl}/enlaces`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ padre: 'ADMINISTRADOR', hijo: opt })
        });
      }
      
      return true;
    } catch (e) {
      console.error('Error configurando políticas en Sentinel-NGAC:', e.message);
      return false;
    }
  }
};
