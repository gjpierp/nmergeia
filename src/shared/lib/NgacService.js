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

    // 2. Asignar rol por defecto (ROLE_ADMINISTRADOR si contiene admin, si no ROLE_INVITADO)
    const defaultRole = email.includes('admin') ? 'ROLE_ADMINISTRADOR' : 'ROLE_INVITADO';
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
      roles: userRoles.length > 0 ? userRoles : ['ROLE_INVITADO'],
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
    
    // Si está bloqueado/premium, solo el rol ROLE_ADMINISTRADOR/ROLE_ADMIN tiene acceso a Ventas, Login y Licencia
    if (['Ventas', 'Login', 'Licencia'].includes(optionName)) {
      return userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_ADMINISTRADOR');
    }
    return true;
  },

  /**
   * Configura políticas de Sentinel-NGAC directamente en la API remota
   */
  setupNgacBasePolicies: async () => {
    const baseUrl = getNgacUrl();
    try {
      // 1. Crear Roles (como nodos User Attribute 'ua' con prefijo ROLE_)
      await fetch(`${baseUrl}/nodos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: 'ROLE_ADMINISTRADOR', nombre: 'Administrador', tipo: 'ua' })
      });
      await fetch(`${baseUrl}/nodos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: 'ROLE_INVITADO', nombre: 'Invitado', tipo: 'ua' })
      });

      // 2. Crear Nodo Política y Nodo Raíz del dominio NMergeIA
      await fetch(`${baseUrl}/nodos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: 'POLITICA_NMERGEIA', nombre: 'Politica NMergeIA', tipo: 'p' })
      });
      await fetch(`${baseUrl}/nodos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: 'NMERGEIA_ROOT', nombre: 'NMergeIA Root', tipo: 'o' })
      });

      // Enlazar Política a Nodo Raíz
      await fetch(`${baseUrl}/enlaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ padre: 'POLITICA_NMERGEIA', hijo: 'NMERGEIA_ROOT' })
      });

      // 3. Crear Nodos para Opciones (como nodos Target/Object 'o')
      const options = ['Ventas', 'Login', 'Licencia'];
      for (const opt of options) {
        await fetch(`${baseUrl}/nodos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ codigo: opt, nombre: opt, tipo: 'o' })
        });
      }

      // Enlazar Nodo Raíz a Opciones del Dominio
      for (const opt of options) {
        await fetch(`${baseUrl}/enlaces`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ padre: 'NMERGEIA_ROOT', hijo: opt })
        });
      }

      // 4. Crear Enlaces Jerárquicos de Acceso (Roles -> Opciones)
      for (const opt of options) {
        await fetch(`${baseUrl}/enlaces`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ padre: 'ROLE_ADMINISTRADOR', hijo: opt })
        });
      }
      
      return true;
    } catch (e) {
      console.error('Error configurando políticas en Sentinel-NGAC:', e.message);
      return false;
    }
  }
};
