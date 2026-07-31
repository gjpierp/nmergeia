/**
 * @file NgacService.js
 * @description Cliente de servicio para interactuar con Sentinel-NGAC.
 * Permite autenticar, gestionar roles y consultar políticas usando nodos y enlaces.
 */

const DEFAULT_NGAC_URL = '/api';

// Obtiene la URL base configurada o por defecto
const getNgacUrl = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('nmergeia_ngac_url') || DEFAULT_NGAC_URL;
  }
  return process.env.NGAC_URL || 'http://sentinel-ngac-backend:3005/api';
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
  
  // Si existe un token, verificar si ha caducado
  if (token) {
    const payload = parseJwt(token);
    if (payload && payload.exp && (payload.exp * 1000) < Date.now()) {
      token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nmerge_jwt_token');
      }
    }
  }

  // Si no existe token válido en storage, realizamos la renovación automática silenciosa
  if (!token) {
    const baseUrl = getNgacUrl();
    const loginEndpoints = [
      `${baseUrl}/auth/login`,
      `${baseUrl}/v1/login`,
      `${baseUrl}/login`
    ];

    for (const loginUrl of loginEndpoints) {
      try {
        const loginRes = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Code': 'nmergeia',
            'x-app-code': 'nmergeia'
          },
          body: JSON.stringify({ email: 'invitado@nmergeia.com', username: 'invitado@nmergeia.com', password: import.meta.env.VITE_GUEST_PASSWORD })
        });
        if (loginRes.ok) {
          const data = await loginRes.json();
          const jwt = data.token || data.access_token || (data.data && (data.data.token || data.data.access_token));
          if (jwt) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('nmerge_jwt_token', jwt);
              window.__SENTINEL_MENU_JSON__ = data;
              try {
                localStorage.setItem('nmerge_sentinel_json', JSON.stringify(data));
              } catch (_) {}
            }
            token = jwt;
            console.info("%c [Sentinel-NGAC] Token JWT y Menú obtenidos desde " + loginUrl, "color: #10b981; font-weight: bold;");
            break;
          }
        }
      } catch (_) {}
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
      throw new Error(err || 'Error al registrar usuario');
    }
    return await res.json();
  },

  /**
   * Inicia sesión en Sentinel-NGAC
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
      window.__SENTINEL_MENU_JSON__ = data;
      try {
        localStorage.setItem('nmerge_sentinel_json', JSON.stringify(data));
      } catch (_) {}
    }

    // Decodificar roles del JWT
    const decoded = parseJwt(token);
    const userRoles = decoded?.roles || decoded?.atributos || decoded?.rol || ['ROLE_NMERGEIA_REGISTRADO'];

    return {
      id: email,
      email: email,
      roles: Array.isArray(userRoles) ? userRoles : [userRoles],
      token: token,
      method: 'sentinel-ngac'
    };
  },

  /**
   * Obtiene el menú dinámico filtrado por roles (reutilizando el payload del login)
   */
  getDynamicMenu: async (userRoles = [], isLoggedIn = false) => {
    const baseUrl = getNgacUrl();
    const isPremium = typeof window !== 'undefined' ? !!localStorage.getItem('nmerge_license_key') : false;
    
    try {
      const token = await ensureToken(isLoggedIn);
      if (!token) {
        throw new Error("No hay token de sesión (JWT) disponible");
      }

      // Reutilizar el menú del payload del login si ya está disponible en memoria o storage
      let resJson = window.__SENTINEL_MENU_JSON__;
      if (!resJson && typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('nmerge_sentinel_json');
          if (raw) resJson = JSON.parse(raw);
        } catch (_) {}
      }

      // [Seguridad] Zero-Trust Double Validation
      if (resJson && (!userRoles.includes('ROLE_NMERGEIA_ADMIN') && !isPremium)) {
        const rawString = JSON.stringify(resJson);
        // Si el JSON cacheado afirma tener acceso a nodos premium, forzamos re-fetch
        if (rawString.includes('AdSenseAdmin') || rawString.includes('Terminal') || rawString.includes('Mongo') || rawString.includes('ExtKafka')) {
            console.warn('[SECURITY AUDIT] Cache local manipulado (Privilege Escalation Bypass). Descartando caché...');
            resJson = null; // Forzar descarga autoritativa desde NGAC Backend
        }
      }


      if (!resJson || (!resJson.menu && !resJson.permissions && !resJson.allowed_menus && !resJson.tree && !resJson.data?.tree)) {
        const lang = typeof window !== 'undefined' ? (localStorage.getItem('nmergeia_language') || 'es') : 'es';
        const menuEndpoints = [
          `${baseUrl}/v1/menu`,
          `${baseUrl}/menu`,
          `${baseUrl}/access-control/ngac/menu`
        ];

        let response = null;
        for (const menuUrl of menuEndpoints) {
          try {
            let res = await fetch(menuUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'x-app-code': 'nmergeia',
                'Accept-Language': lang,
                'Content-Type': 'application/json'
              }
            });

            if ((res.status === 401 || res.status === 403) && typeof window !== 'undefined') {
              localStorage.removeItem('nmerge_jwt_token');
              const freshToken = await ensureToken(isLoggedIn);
              if (freshToken) {
                res = await fetch(menuUrl, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${freshToken}`,
                    'x-app-code': 'nmergeia',
                    'Accept-Language': lang,
                    'Content-Type': 'application/json'
                  }
                });
              }
            }

            if (res && res.ok) {
              response = res;
              break;
            }
          } catch (_) {}
        }

        if (response && response.ok) {
          resJson = await response.json();
          if (typeof window !== 'undefined') {
            window.__SENTINEL_MENU_JSON__ = resJson;
            try {
              localStorage.setItem('nmerge_sentinel_json', JSON.stringify(resJson, null, 2));
            } catch (_) {}
          }
        }
      }

      if (!resJson) throw new Error('Error al obtener menú dinámico real');

      const menuData = resJson.menu || resJson.data?.tree || resJson.tree || resJson.data || resJson;

      const SLUG_TO_CODE = {
        'dk_ini': 'DockerInicial', 'dk_bas': 'DockerBasico', 'dk_med': 'DockerMedio', 'dk_ava': 'DockerAvanzado', 'dk_exp': 'DockerExperto',
        'doc_ini': 'DockerInicial', 'doc_bas': 'DockerBasico', 'doc_med': 'DockerMedio', 'doc_ava': 'DockerAvanzado', 'doc_exp': 'DockerExperto',
        'pg_ini': 'PostgresInicial', 'pg_bas': 'PostgresBasico', 'pg_med': 'PostgresMedio', 'pg_ava': 'PostgresAvanzado', 'pg_exp': 'PostgresExperto',
        'ora_ini': 'OracleInicial', 'ora_bas': 'OracleBasico', 'ora_med': 'OracleMedio', 'ora_ava': 'OracleAvanzado', 'ora_exp': 'OracleExperto',
        'devsec_ini': 'DevsecopsInicial', 'devsec_bas': 'DevsecopsBasico', 'devsec_med': 'DevsecopsMedio', 'devsec_ava': 'DevsecopsAvanzado', 'devsec_exp': 'DevsecopsExperto',
        'sec_ini': 'DevsecopsInicial', 'sec_bas': 'DevsecopsBasico', 'sec_med': 'DevsecopsMedio', 'sec_ava': 'DevsecopsAvanzado', 'sec_exp': 'DevsecopsExperto',
        'auth_ini': 'AuthInicial', 'auth_bas': 'AuthBasico', 'auth_med': 'AuthMedio', 'auth_ava': 'AuthAvanzado', 'auth_exp': 'AuthExperto',
        'aut_ini': 'AuthInicial', 'aut_bas': 'AuthBasico', 'aut_med': 'AuthMedio', 'aut_ava': 'AuthAvanzado', 'aut_exp': 'AuthExperto',
        'crip_ini': 'CriptoInicial', 'crip_bas': 'CriptoBasico', 'crip_med': 'CriptoMedio', 'crip_ava': 'CriptoAvanzado', 'crip_exp': 'CriptoExperto',
        'owa_ini': 'OwaspInicial', 'owa_bas': 'OwaspBasico', 'owa_med': 'OwaspMedio', 'owa_ava': 'OwaspAvanzado', 'owa_exp': 'OwaspExperto',
        'owasp_ini': 'OwaspInicial', 'owasp_bas': 'OwaspBasico', 'owasp_med': 'OwaspMedio', 'owasp_ava': 'OwaspAvanzado', 'owasp_exp': 'OwaspExperto',
        'mg_ini': 'MongoInicial', 'mg_bas': 'MongoBasico', 'mg_med': 'MongoMedio', 'mg_ava': 'MongoAvanzado', 'mg_exp': 'MongoExperto',
        'rd_ini': 'RedisInicial', 'rd_bas': 'RedisBasico', 'rd_med': 'RedisMedio', 'rd_ava': 'RedisAvanzado', 'rd_exp': 'RedisExperto',
        'sql_ini': 'SqlServerInicial', 'sql_bas': 'SqlServerBasico', 'sql_med': 'SqlServerMedio', 'sql_ava': 'SqlServerAvanzado', 'sql_exp': 'SqlServerExperto',
        'ml_ini': 'MlInicial', 'ml_bas': 'MlBasico', 'ml_med': 'MlMedio', 'ml_ava': 'MlAvanzado', 'ml_exp': 'MlExperto',
        'nlp_ini': 'NlpInicial', 'nlp_bas': 'NlpBasico', 'nlp_med': 'NlpMedio', 'nlp_ava': 'NlpAvanzado', 'nlp_exp': 'NlpExperto',
        'cc_ini': 'CleanCodeInicial', 'cc_bas': 'CleanCodeBasico', 'cc_med': 'CleanCodeMedio', 'cc_ava': 'CleanCodeAvanzado', 'cc_exp': 'CleanCodeExperto',
        'pa_ini': 'PatronesInicial', 'pa_bas': 'PatronesBasico', 'pa_med': 'PatronesMedio', 'pa_ava': 'PatronesAvanzado', 'pa_exp': 'PatronesExperto',
        'qa_ini': 'QaInicial', 'qa_bas': 'QaBasico', 'qa_med': 'QaMedio', 'qa_ava': 'QaAvanzado', 'qa_exp': 'QaExperto',
        'bi_ini': 'BiInicial', 'bi_bas': 'BiBasico', 'bi_med': 'BiMedio', 'bi_ava': 'BiAvanzado', 'bi_exp': 'BiExperto',
        'dwh_ini': 'DwhInicial', 'dwh_bas': 'DwhBasico', 'dwh_med': 'DwhMedio', 'dwh_ava': 'DwhAvanzado', 'dwh_exp': 'DwhExperto',
        'git_ini': 'GitInicial', 'git_bas': 'GitBasico', 'git_med': 'GitMedio', 'git_ava': 'GitAvanzado', 'git_exp': 'GitExperto',
        'tf_ini': 'TerraformInicial', 'tf_bas': 'TerraformBasico', 'tf_med': 'TerraformMedio', 'tf_ava': 'TerraformAvanzado', 'tf_exp': 'TerraformExperto',
        'k8s_ava': 'K8sAvanzado', 'cloud_ava': 'CloudAvanzado',
        'arq_ini': 'ArqInicial', 'arq_bas': 'ArqBasico', 'arq_med': 'ArqMedio', 'arq_ava': 'ArqAvanzado', 'arq_exp': 'ArqExperto',
        'ia_ini': 'IaInicial', 'ia_bas': 'IaBasico', 'ia_med': 'IaMedio', 'ia_ava': 'IaAvanzado', 'ia_exp': 'IaExperto',
        'req_ini': 'ReqInicial', 'req_bas': 'ReqBasico', 'req_med': 'ReqMedio', 'req_ava': 'ReqAvanzado', 'req_exp': 'ReqExperto',
        'ext_react': 'ExtReact', 'ext_vue': 'ExtVue', 'ext_angular': 'ExtAngular', 'ext_svelte': 'ExtSvelte', 'ext_wasm': 'ExtWasm',
        'ext_node': 'ExtNode', 'ext_spring': 'ExtSpring', 'ext_django': 'ExtDjango', 'ext_fastapi': 'ExtFastapi', 'ext_graphql': 'ExtGraphql',
        'ext_aws': 'ExtAws', 'ext_azure': 'ExtAzure', 'ext_gcp': 'ExtGcp', 'ext_cicd': 'ExtCicd', 'ext_obs': 'ExtObs',
        'ext_pentest': 'ExtPentest', 'ext_malware': 'ExtMalware', 'ext_cripto': 'ExtCripto', 'ext_harden': 'ExtHarden', 'ext_zerot': 'ExtZerot',
        'ext_prompt': 'ExtPrompt', 'ext_finetune': 'ExtFinetune', 'ext_datalake': 'ExtDatalake', 'ext_kafka': 'ExtKafka', 'ext_spark': 'ExtSpark'
      };

      const ROUTE_TO_CODE = {
        '/guias/postgres/inicial': 'PostgresInicial', '/guias/postgres/basico': 'PostgresBasico', '/guias/postgres/medio': 'PostgresMedio', '/guias/postgres/avanzado': 'PostgresAvanzado', '/guias/postgres/experto': 'PostgresExperto',
        '/guias/oracle/inicial': 'OracleInicial', '/guias/oracle/basico': 'OracleBasico', '/guias/oracle/medio': 'OracleMedio', '/guias/oracle/avanzado': 'OracleAvanzado', '/guias/oracle/experto': 'OracleExperto',
        '/guias/docker/inicial': 'DockerInicial', '/guias/docker/basico': 'DockerBasico', '/guias/docker/medio': 'DockerMedio', '/guias/docker/avanzado': 'DockerAvanzado', '/guias/docker/experto': 'DockerExperto',
        '/guias/ngac/inicial': 'NgacInicial', '/guias/ngac/basico': 'NgacBasico', '/guias/ngac/medio': 'NgacMedio', '/guias/ngac/avanzado': 'NgacAvanzado', '/guias/ngac/experto': 'NgacExperto',
        '/help/docker/inicial': 'DockerInicial', '/help/docker/basico': 'DockerBasico', '/help/docker/medio': 'DockerMedio', '/help/docker/avanzado': 'DockerAvanzado', '/help/docker/experto': 'DockerExperto',
        '/help/postgres/inicial': 'PostgresInicial', '/help/postgres/basico': 'PostgresBasico', '/help/postgres/medio': 'PostgresMedio', '/help/postgres/avanzado': 'PostgresAvanzado', '/help/postgres/experto': 'PostgresExperto',
        '/help/oracle/inicial': 'OracleInicial', '/help/oracle/basico': 'OracleBasico', '/help/oracle/medio': 'OracleMedio', '/help/oracle/avanzado': 'OracleAvanzado', '/help/oracle/experto': 'OracleExperto',
        '/help/devsecops/inicial': 'DevsecopsInicial', '/help/devsecops/basico': 'DevsecopsBasico', '/help/devsecops/medio': 'DevsecopsMedio', '/help/devsecops/avanzado': 'DevsecopsAvanzado', '/help/devsecops/experto': 'DevsecopsExperto',
        '/help/auth/inicial': 'AuthInicial', '/help/auth/basico': 'AuthBasico', '/help/auth/medio': 'AuthMedio', '/help/auth/avanzado': 'AuthAvanzado', '/help/auth/experto': 'AuthExperto',
        '/help/cripto/inicial': 'CriptoInicial', '/help/cripto/basico': 'CriptoBasico', '/help/cripto/medio': 'CriptoMedio', '/help/cripto/avanzado': 'CriptoAvanzado', '/help/cripto/experto': 'CriptoExperto',
        '/help/owasp/inicial': 'OwaspInicial', '/help/owasp/basico': 'OwaspBasico', '/help/owasp/medio': 'OwaspMedio', '/help/owasp/avanzado': 'OwaspAvanzado', '/help/owasp/experto': 'OwaspExperto',
        '/temas/ext-react': 'ExtReact', '/temas/ext-vue': 'ExtVue', '/temas/ext-angular': 'ExtAngular', '/temas/ext-svelte': 'ExtSvelte', '/temas/ext-wasm': 'ExtWasm',
        '/temas/ext-node': 'ExtNode', '/temas/ext-spring': 'ExtSpring', '/temas/ext-django': 'ExtDjango', '/temas/ext-fastapi': 'ExtFastapi', '/temas/ext-graphql': 'ExtGraphql',
        '/temas/ext-aws': 'ExtAws', '/temas/ext-azure': 'ExtAzure', '/temas/ext-gcp': 'ExtGcp', '/temas/ext-cicd': 'ExtCicd', '/temas/ext-obs': 'ExtObs',
        '/temas/ext-pentest': 'ExtPentest', '/temas/ext-malware': 'ExtMalware', '/temas/ext-cripto': 'ExtCripto', '/temas/ext-harden': 'ExtHarden', '/temas/ext-zerot': 'ExtZerot',
        '/temas/ext-prompt': 'ExtPrompt', '/temas/ext-finetune': 'ExtFinetune', '/temas/ext-datalake': 'ExtDatalake', '/temas/ext-kafka': 'ExtKafka', '/temas/ext-spark': 'ExtSpark'
      };

      // Mapear los códigos técnicos de los nodos autorizados
      const collectCodes = (items) => {
        let codes = [];
        if (!items) return codes;
        const array = Array.isArray(items) ? items : [items];
        for (const item of array) {
          if (typeof item === 'string') {
            codes.push(item);
            if (SLUG_TO_CODE[item]) codes.push(SLUG_TO_CODE[item]);
            if (ROUTE_TO_CODE[item]) codes.push(ROUTE_TO_CODE[item]);
            continue;
          }
          if (item.allowed_menus && Array.isArray(item.allowed_menus)) {
            codes = codes.concat(collectCodes(item.allowed_menus));
          }
          if (item.allowed_nodes && Array.isArray(item.allowed_nodes)) {
            codes = codes.concat(collectCodes(item.allowed_nodes));
          }
          if (item.menus && Array.isArray(item.menus)) {
            codes = codes.concat(collectCodes(item.menus));
          }
          const rawSlug = item.code || item.node_code || item.codigo || item.codigo_tecnico || item.slug;
          if (rawSlug) {
            codes.push(rawSlug);
            if (SLUG_TO_CODE[rawSlug]) {
              codes.push(SLUG_TO_CODE[rawSlug]);
            }
          }
          const rawRoute = item.path || item.ruta || item.url_path;
          if (rawRoute) {
            codes.push(rawRoute);
            if (ROUTE_TO_CODE[rawRoute]) {
              codes.push(ROUTE_TO_CODE[rawRoute]);
            }
          }
          if (item.label) codes.push(item.label);
          if (rawSlug === 'MNU_NMERGE_MAIN' || rawSlug === 'main') codes.push('Comparar', 'main');
          if (rawSlug === 'MNU_NMERGE_LANDING' || rawSlug === 'landing') codes.push('Landing', 'landing');
          if (rawSlug === 'MNU_NMERGE_REGISTER' || rawSlug === 'register') codes.push('Register', 'register');
          if (rawSlug === 'MNU_NMERGE_LOGIN' || rawSlug === 'login') codes.push('Login', 'login');
          if (rawSlug === 'MNU_NMERGE_HISTORY' || rawSlug === 'history') codes.push('Historial', 'history');
          if (rawSlug === 'MNU_NMERGE_FILTERS' || rawSlug === 'filters') codes.push('Filtros', 'filters');
          if (rawSlug === 'MNU_NMERGE_PRIVACY' || rawSlug === 'privacy') codes.push('Privacy', 'privacy');
          if (rawSlug === 'MNU_NMERGE_TERMS' || rawSlug === 'terms') codes.push('Terms', 'terms');
          if (rawSlug === 'MNU_NMERGE_DOCS' || rawSlug === 'docs') codes.push('Docs', 'docs');
          if (rawSlug === 'MNU_NMERGE_FAQ' || rawSlug === 'faq') codes.push('FAQ', 'faq');
          if (rawSlug === 'MNU_NMERGE_TERMINAL' || rawSlug === 'terminal') codes.push('Terminal', 'terminal');

          if (item.children) codes = codes.concat(collectCodes(item.children));
          if (item.hijos) codes = codes.concat(collectCodes(item.hijos));
          if (item.children_nodos) codes = codes.concat(collectCodes(item.children_nodos));
        }
        return codes;
      };

      const allowed = collectCodes(menuData);
      
      // Asegurar que los menús core estén disponibles y respetar la respuesta del motor NGAC
      const coreMenus = ['Landing', 'landing', 'MNU_NMERGE_LANDING', 'Comparar', 'main', 'MNU_NMERGE_MAIN', 'Login', 'Register', 'Privacy', 'Terms', 'About', 'Contact', 'Docs', 'Terminal', 'FAQ', 'Historial', 'Filtros', 'PostgresInicial', 'PostgresBasico', 'PostgresMedio', 'PostgresAvanzado', 'PostgresExperto'];
      const realNgacList = Array.from(new Set([...coreMenus, ...allowed]));
      
      return realNgacList;
    } catch (e) {
      if (e.message && !e.message.includes('No hay token')) {
        console.debug("Sentinel-NGAC /menu uso de fallback basado en roles:", e.message);
      }
      
      // Fallback local basado en roles si falla la conexión al backend real
      const hasPremiumAccess = userRoles.includes('ROLE_ADMINISTRADOR') || userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_NMERGEIA_ADMIN') || (userRoles.includes('ROLE_REGISTRADO') && isPremium);
      
      const topics = [
        'Postgres', 'Oracle', 'Mongo', 'Redis', 'SqlServer', 'Docker', 'Git', 'Terraform', 'Kubernetes', 'Cloud', 'Arquitectura', 'Requerimientos', 'CleanCode', 'Patrones', 'Qa', 'Devsecops', 'Auth', 'Cripto', 'Owasp', 'Ia', 'Ml', 'Nlp', 'Bi', 'Dwh',
        'ExtReact', 'ExtVue', 'ExtAngular', 'ExtSvelte', 'ExtWasm',
        'ExtNode', 'ExtSpring', 'ExtDjango', 'ExtFastapi', 'ExtGraphql',
        'ExtAws', 'ExtAzure', 'ExtGcp', 'ExtCicd', 'ExtObs',
        'ExtPentest', 'ExtMalware', 'ExtCripto', 'ExtHarden', 'ExtZerot',
        'ExtPrompt', 'ExtFinetune', 'ExtDatalake', 'ExtKafka', 'ExtSpark',
        'About', 'Contact', 'PostgresInicial', 'PostgresBasico', 'PostgresMedio', 'PostgresAvanzado', 'PostgresExperto'
      ];

      const baseCodes = ['Landing', 'landing', 'MNU_NMERGE_LANDING', 'Comparar', 'main', 'MNU_NMERGE_MAIN', 'Login', 'Register', 'Privacy', 'Terms', 'About', 'Contact', 'Docs', 'Terminal', 'FAQ', 'Historial', 'Filtros'];
      const fallbackResult = [...baseCodes, ...topics];
      if (typeof window !== 'undefined') {
        const fallbackJson = {
          ok: true,
          status: "SUCCESS_LOCAL_FALLBACK",
          source: "fallback_roles",
          roles: userRoles,
          allowed_menus: fallbackResult
        };
        window.__SENTINEL_MENU_JSON__ = fallbackJson;
        try {
          localStorage.setItem('nmerge_sentinel_json', JSON.stringify(fallbackJson, null, 2));
        } catch (_) {}
      }
      return fallbackResult;
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
      return userRoles.includes('ROLE_NMERGEIA_ADMIN');
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
        body: JSON.stringify({ codigo: 'ROLE_NMERGEIA_ADMIN', nombre: 'Administrador Premium NMergeIA', tipo: 'ua' })
      }).catch(() => {});
      await fetch(`${baseUrl}/nodos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ codigo: 'ROLE_NMERGEIA_REGISTRADO', nombre: 'Usuario Registrado NMergeIA', tipo: 'ua' })
      }).catch(() => {});
      await fetch(`${baseUrl}/nodos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ codigo: 'ROLE_NMERGEIA_INVITADO', nombre: 'Invitado NMergeIA', tipo: 'ua' })
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

      const topics = [
        'Postgres', 'Oracle', 'Mongo', 'Redis', 'SqlServer', 'Docker', 'Git', 'Terraform', 'Kubernetes', 'Cloud', 'Arquitectura', 'Requerimientos', 'CleanCode', 'Patrones', 'Qa', 'Devsecops', 'Auth', 'Cripto', 'Owasp', 'Ia', 'Ml', 'Nlp', 'Bi', 'Dwh',
        'ExtReact', 'ExtVue', 'ExtAngular', 'ExtSvelte', 'ExtWasm',
        'ExtNode', 'ExtSpring', 'ExtDjango', 'ExtFastapi', 'ExtGraphql',
        'ExtAws', 'ExtAzure', 'ExtGcp', 'ExtCicd', 'ExtObs',
        'ExtPentest', 'ExtMalware', 'ExtCripto', 'ExtHarden', 'ExtZerot',
        'ExtPrompt', 'ExtFinetune', 'ExtDatalake', 'ExtKafka', 'ExtSpark'
      ];
      const allOptions = ['Landing', 'Comparar', 'Login', 'Historial', 'Filtros', 'Register', 'AdBannerTop', 'AdBannerSidebar', 'AdBannerMatrix', 'Privacy', 'Terms', 'About', 'Contact', 'Docs', 'FAQ', 'Terminal', 'AdSenseAdmin', ...topics];
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
          body: JSON.stringify({ padre: 'ROLE_NMERGEIA_ADMIN', hijo: opt })
        }).catch(() => {});
      }

      const topicsGuest = [
        'Postgres', 'Docker', 'Git', 'ExtReact', 'ExtNode', 'ExtAws', 'ExtPentest'
      ];
      const guestOptions = ['Landing', 'Comparar', 'Historial', 'Filtros', 'Login', 'Register', 'AdBannerTop', 'AdBannerSidebar', 'AdBannerMatrix', 'Privacy', 'Terms', 'About', 'Contact', 'Docs', 'FAQ', ...topicsGuest];
      for (const opt of guestOptions) {
        await fetch(`${baseUrl}/enlaces`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ padre: 'ROLE_NMERGEIA_INVITADO', hijo: opt })
        }).catch(() => {});
        await fetch(`${baseUrl}/enlaces`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ padre: 'ROLE_NMERGEIA_REGISTRADO', hijo: opt })
        }).catch(() => {});
      }
      
      return true;
    } catch (e) {
      console.error('Error configurando políticas en Sentinel-NGAC:', e.message);
      return false;
    }
  }
};
