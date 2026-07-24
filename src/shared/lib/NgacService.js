/**
 * @file NgacService.js
 * @description Cliente de servicio para interactuar con Sentinel-NGAC.
 * Permite autenticar, gestionar roles y consultar políticas usando nodos y enlaces.
 */

const DEFAULT_NGAC_URL = 'https://sentinel-ngac.local/api';

// Obtiene la URL base configurada o por defecto
const getNgacUrl = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('nmergeia_ngac_url') || DEFAULT_NGAC_URL;
  }
  return DEFAULT_NGAC_URL;
};

// Decodifica carga útil de JWT de forma simple en frontend
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Asegura obtener un token JWT activo (del usuario actual o invitado mediante login silencioso)
const ensureToken = async (isLoggedIn) => {
  let token = typeof window !== 'undefined' ? localStorage.getItem('nmerge_jwt_token') : null;
  
  // Si no está isLoggedIn o no hay token en storage, forzamos login silencioso del invitado
  if (!isLoggedIn || !token) {
    try {
      const baseUrl = getNgacUrl();
      const loginRes = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-code': 'nmergeia'
        },
        body: JSON.stringify({ usuario: 'invitado@nmergeia.com', contrasena: 'G3rC4t_01_##' })
      });
      if (loginRes.ok) {
        const data = await loginRes.json();
        const jwt = data.token || (data.data && data.data.token);
        if (jwt) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('nmerge_jwt_token', jwt);
          }
          token = jwt;
        }
      }
    } catch (e) {
      console.warn("Error en login silencioso de invitado en Sentinel-NGAC:", e);
    }
  }
  return token;
};

export const NgacService = {
  /**
   * Registra un nuevo usuario en el sistema
   */
  registerUser: async (email, password) => {
    const baseUrl = getNgacUrl();
    const res = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-code': 'nmergeia'
      },
      body: JSON.stringify({ email: email, password: password })
    });
    
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Error al registrar usuario en Sentinel-NGAC');
    }
    
    return { success: true, email };
  },

  /**
   * Inicia sesión del usuario conectándose al endpoint real del backend de Sentinel-NGAC
   */
  loginUser: async (email, password) => {
    const baseUrl = getNgacUrl();
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-code': 'nmergeia'
      },
      body: JSON.stringify({ email: email, password: password })
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(errMsg || 'Error en las credenciales de inicio de sesión');
    }

    const data = await response.json();
    const token = data.token || data.access_token || (data.data && data.data.token);

    if (!token) {
      throw new Error('No se recibió un token JWT válido del servidor');
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('nmerge_jwt_token', token);
    }

    // Decodificar roles del JWT
    const decoded = parseJwt(token);
    const userRoles = decoded?.roles || decoded?.atributos || decoded?.rol || ['ROLE_REGISTRADO'];

    return {
      id: email,
      email: email,
      roles: Array.isArray(userRoles) ? userRoles : [userRoles],
      token: token,
      method: 'sentinel-ngac'
    };
  },

  /**
   * Obtiene el menú dinámico filtrado por roles consultando el endpoint /access-control/ngac/menu
   */
  getDynamicMenu: async (userRoles = [], isLoggedIn = false) => {
    const baseUrl = getNgacUrl();
    const isPremium = typeof window !== 'undefined' ? !!localStorage.getItem('nmerge_license_key') : false;
    
    try {
      const token = await ensureToken(isLoggedIn);
      if (!token) {
        throw new Error("No hay token de sesión (JWT) disponible");
      }

      const lang = typeof window !== 'undefined' ? (localStorage.getItem('nmergeia_language') || 'es') : 'es';

      const response = await fetch(menuUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-app-code': 'nmergeia',
          'Accept-Language': lang,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contexto: 'nmergeia' })
      });

      if (!response.ok) throw new Error('Error al obtener menú dinámico real');
      const resJson = await response.json();
      const menuData = resJson.data?.tree || resJson.tree || resJson.data || resJson;

      // Mapear los códigos técnicos de los nodos autorizados
      const collectCodes = (items) => {
        let codes = [];
        if (!items) return codes;
        const array = Array.isArray(items) ? items : [items];
        for (const item of array) {
          const code = item.codigo_tecnico || item.codigo || item.CODIGO_TECNICO || item.CODIGO;
          if (code) codes.push(code);
          if (item.children) codes = codes.concat(collectCodes(item.children));
          if (item.children_nodos) codes = codes.concat(collectCodes(item.children_nodos));
        }
        return codes;
      };

      const allowed = collectCodes(menuData);
      
      // Aseguramos que las vistas esenciales estén disponibles siempre
      if (!allowed.includes('Landing')) allowed.push('Landing');
      if (!allowed.includes('Login')) allowed.push('Login');
      if (!allowed.includes('Register')) allowed.push('Register');
      if (!allowed.includes('Privacy')) allowed.push('Privacy');
      if (!allowed.includes('Terms')) allowed.push('Terms');
      if (!allowed.includes('Docs')) allowed.push('Docs');
      if (!allowed.includes('FAQ')) allowed.push('FAQ');
      if (!allowed.includes('PostgresInicial')) allowed.push('PostgresInicial');
      if (!allowed.includes('PostgresBasico')) allowed.push('PostgresBasico');
      if (!allowed.includes('PostgresMedio')) allowed.push('PostgresMedio');
      if (!allowed.includes('PostgresAvanzado')) allowed.push('PostgresAvanzado');
      if (!allowed.includes('PostgresExperto')) allowed.push('PostgresExperto');
      if (!allowed.includes('Terminal')) allowed.push('Terminal');
      
      return allowed;
    } catch (e) {
      console.warn("Sentinel-NGAC real /menu falló, usando fallback local basado en roles:", e.message);
      
      // Fallback local basado en roles si falla la conexión al backend real
      const hasPremiumAccess = userRoles.includes('ROLE_ADMINISTRADOR') || userRoles.includes('ROLE_ADMIN') || (userRoles.includes('ROLE_REGISTRADO') && isPremium);
      if (isLoggedIn && hasPremiumAccess) {
        return ['Landing', 'Comparar', 'Login', 'Historial', 'Filtros', 'Register', 'Privacy', 'Terms', 'Docs', 'Terminal', 'FAQ', 'PostgresInicial', 'PostgresBasico', 'PostgresMedio', 'PostgresAvanzado', 'PostgresExperto'];
      }
      return ['Landing', 'Comparar', 'Historial', 'Filtros', 'Login', 'Register', 'Privacy', 'Terms', 'Docs', 'Terminal', 'FAQ', 'PostgresInicial', 'PostgresBasico', 'PostgresMedio', 'PostgresAvanzado', 'PostgresExperto'];
    }
  },

  /**
   * Consulta si una opción/recurso está disponible
   */
  checkPermission: (optionName, userRoles = []) => {
    if (typeof window !== 'undefined') {
      const isNgacLocked = localStorage.getItem('nmergeia_ngac_locked') === 'true';
      if (!isNgacLocked) {
        return true;
      }
    }
    if (['Ventas', 'Login', 'Licencia'].includes(optionName)) {
      return userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_ADMINISTRADOR');
    }
    return true;
  },

  /**
   * Configura políticas de Sentinel-NGAC directamente en la API remota (para fines de inicialización si es requerido)
   */
  setupNgacBasePolicies: async () => {
    const baseUrl = getNgacUrl();
    try {
      // Mandar cabeceras unificadas
      const headers = { 
        'Content-Type': 'application/json',
        'x-app-code': 'nmergeia'
      };
      
      await fetch(`${baseUrl}/nodos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ codigo: 'ROLE_ADMINISTRADOR', nombre: 'Administrador Premium', tipo: 'ua' })
      }).catch(() => {});
      await fetch(`${baseUrl}/nodos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ codigo: 'ROLE_REGISTRADO', nombre: 'Usuario Registrado No-Premium', tipo: 'ua' })
      }).catch(() => {});
      await fetch(`${baseUrl}/nodos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ codigo: 'ROLE_INVITADO', nombre: 'Invitado', tipo: 'ua' })
      }).catch(() => {});

      await fetch(`${baseUrl}/nodos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ codigo: 'POLITICA_NMERGEIA', nombre: 'Politica NMergeIA', tipo: 'p' })
      }).catch(() => {});
      await fetch(`${baseUrl}/nodos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ codigo: 'NMERGEIA_ROOT', nombre: 'NMergeIA Root', tipo: 'o' })
      }).catch(() => {});

      await fetch(`${baseUrl}/enlaces`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ padre: 'POLITICA_NMERGEIA', hijo: 'NMERGEIA_ROOT' })
      }).catch(() => {});

      const allOptions = ['Landing', 'Comparar', 'Login', 'Historial', 'Filtros', 'Register', 'AdBannerTop', 'AdBannerSidebar', 'AdBannerMatrix', 'Privacy', 'Terms', 'Docs', 'FAQ', 'PostgresInicial', 'PostgresBasico', 'PostgresMedio', 'PostgresAvanzado', 'PostgresExperto'];
      for (const opt of allOptions) {
        await fetch(`${baseUrl}/nodos`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ codigo: opt, nombre: opt, tipo: 'o' })
        }).catch(() => {});
      }

      for (const opt of allOptions) {
        await fetch(`${baseUrl}/enlaces`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ padre: 'NMERGEIA_ROOT', hijo: opt })
        }).catch(() => {});
      }

      for (const opt of allOptions) {
        await fetch(`${baseUrl}/enlaces`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ padre: 'ROLE_ADMINISTRADOR', hijo: opt })
        }).catch(() => {});
      }

      const guestOptions = ['Landing', 'Comparar', 'Historial', 'Filtros', 'Login', 'Register', 'AdBannerTop', 'AdBannerSidebar', 'AdBannerMatrix', 'Privacy', 'Terms', 'Docs', 'FAQ', 'PostgresInicial', 'PostgresBasico', 'PostgresMedio', 'PostgresAvanzado', 'PostgresExperto'];
      for (const opt of guestOptions) {
        await fetch(`${baseUrl}/enlaces`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ padre: 'ROLE_INVITADO', hijo: opt })
        }).catch(() => {});
        await fetch(`${baseUrl}/enlaces`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ padre: 'ROLE_REGISTRADO', hijo: opt })
        }).catch(() => {});
      }
      
      return true;
    } catch (e) {
      console.error('Error configurando políticas en Sentinel-NGAC:', e.message);
      return false;
    }
  }
};
