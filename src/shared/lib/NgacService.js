/**
 * @file NgacService.js
 * @description Cliente de servicio para interactuar con Sentinel-NGAC.
 * Permite registrar usuarios, autenticar, gestionar roles y consultar políticas.
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
   * Registra un nuevo usuario en la base de datos de SAFI/Sentinel-NGAC
   */
  registerUser: async (email, password) => {
    const baseUrl = getNgacUrl();
    const response = await fetch(`${baseUrl}/safi/procedimientos/crear-usuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        username: email.split('@')[0],
        password: password
      })
    });
    
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Error al registrar usuario en Sentinel-NGAC');
    }
    return await response.json();
  },

  /**
   * Inicia sesión del usuario
   */
  loginUser: async (email, password) => {
    const baseUrl = getNgacUrl();
    // Sentinel-NGAC valida contra su tabla de usuarios de SAFI
    const response = await fetch(`${baseUrl}/safi/usuarios`);
    if (!response.ok) throw new Error('Error al conectar con Sentinel-NGAC');
    
    const users = await response.json();
    const foundUser = users.find(u => u.EMAIL === email);
    
    if (!foundUser) {
      throw new Error('El usuario no existe en Sentinel-NGAC');
    }
    
    // Obtenemos los roles del usuario asignados en Sentinel-NGAC
    const rolesResponse = await fetch(`${baseUrl}/safi/usuarios/${foundUser.ID || foundUser.ID_USUARIO}/roles`);
    const roles = rolesResponse.ok ? await rolesResponse.json() : [];
    
    return {
      id: foundUser.ID || foundUser.ID_USUARIO,
      email: foundUser.EMAIL,
      roles: roles.map(r => r.CODIGO_ROL || r.ROLE_CODE || 'USER'),
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
    
    // Si está bloqueado/premium, solo Administrador tiene acceso a Ventas, Login y Licencia
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
      // 1. Crear Roles
      await fetch(`${baseUrl}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: 'ADMINISTRADOR', descripcion: 'Rol Administrador de NMergeIA' })
      });
      await fetch(`${baseUrl}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: 'INVITADO', descripcion: 'Rol Invitado General' })
      });

      // 2. Crear Nodos para Opciones
      const options = ['Ventas', 'Login', 'Licencia'];
      for (const opt of options) {
        await fetch(`${baseUrl}/nodos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ codigo: opt, nombre: opt, tipo: 'OPCION' })
        });
      }

      // 3. Crear Enlaces Jerárquicos / Decision Tree
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
