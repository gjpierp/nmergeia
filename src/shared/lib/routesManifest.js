/**
 // =====================================================================
 // Manifiesto Unificado de Rutas y Menú Sentinel-NGAC - NMerge IA
 // Fuente Única de Verdad para Sitemap, Enrutador y Pre-renderizado HTML
 // =====================================================================
 */

export const MENU_TREE = [
  { id: 105, code: 'MNU_NMERGEIA_LANDING', label: 'Inicio', path: '/', icon: 'home', priority: '1.0', changefreq: 'daily' },
  { id: 106, code: 'MNU_NMERGEIA_FEATURES', label: 'Características', path: '/features', icon: 'star', priority: '0.8', changefreq: 'monthly' },
  { id: 107, code: 'MNU_NMERGEIA_PRICING', label: 'Planes y Precios', path: '/pricing', icon: 'payments', priority: '0.8', changefreq: 'monthly' },
  { id: 108, code: 'MNU_NMERGEIA_DOCS', label: 'Biblioteca Técnica', path: '/docs', icon: 'menu_book', priority: '0.8', changefreq: 'weekly' },
  { id: 109, code: 'MNU_NMERGEIA_FAQ', label: 'Preguntas Frecuentes', path: '/faq', icon: 'help_outline', priority: '0.8', changefreq: 'weekly' },
  {
    id: 110, code: 'CAT_NMERGEIA_WORKSPACE', label: 'Plataforma Principal', icon: 'desktop_windows',
    children: [
      { id: 111, code: 'MNU_NMERGEIA_MAIN', label: 'Comparador Principal', path: '/main', icon: 'grid_view', priority: '0.9', changefreq: 'daily' },
      { id: 112, code: 'MNU_NMERGEIA_FILTERS', label: 'Gestor de Filtros', path: '/filters', icon: 'filter_alt', priority: '0.7', changefreq: 'monthly' },
      { id: 113, code: 'MNU_NMERGEIA_HISTORY', label: 'Historial', path: '/history', icon: 'history', priority: '0.7', changefreq: 'monthly' },
      { id: 114, code: 'MNU_NMERGEIA_TERMINAL', label: 'Consola Integrada', path: '/terminal', icon: 'terminal', priority: '0.7', changefreq: 'monthly' }
    ]
  },
  {
    id: 120, code: 'CAT_NMERGEIA_GUIAS', label: 'Guías por Tecnología y Nivel', icon: 'school',
    children: [
      {
        id: 121, code: 'SUB_POSTGRES', label: 'PostgreSQL', icon: 'storage',
        children: [
          { id: 122, code: 'MNU_POSTGRES_INICIAL', label: 'PostgreSQL (Inicial)', path: '/guias/postgres/inicial', priority: '0.7', changefreq: 'monthly' },
          { id: 123, code: 'MNU_POSTGRES_BASICO', label: 'PostgreSQL (Básico)', path: '/guias/postgres/basico', priority: '0.7', changefreq: 'monthly' },
          { id: 124, code: 'MNU_POSTGRES_MEDIO', label: 'PostgreSQL (Medio)', path: '/guias/postgres/medio', priority: '0.7', changefreq: 'monthly' },
          { id: 125, code: 'MNU_POSTGRES_AVANZADO', label: 'PostgreSQL (Avanzado)', path: '/guias/postgres/avanzado', priority: '0.7', changefreq: 'monthly' },
          { id: 126, code: 'MNU_POSTGRES_EXPERTO', label: 'PostgreSQL (Experto)', path: '/guias/postgres/experto', priority: '0.7', changefreq: 'monthly' }
        ]
      },
      {
        id: 130, code: 'SUB_DOCKER', label: 'Docker & Contenedores', icon: 'cloud',
        children: [
          { id: 131, code: 'MNU_DOCKER_INICIAL', label: 'Docker (Inicial)', path: '/guias/docker/inicial', priority: '0.7', changefreq: 'monthly' },
          { id: 132, code: 'MNU_DOCKER_BASICO', label: 'Docker (Básico)', path: '/guias/docker/basico', priority: '0.7', changefreq: 'monthly' },
          { id: 133, code: 'MNU_DOCKER_MEDIO', label: 'Docker (Medio)', path: '/guias/docker/medio', priority: '0.7', changefreq: 'monthly' },
          { id: 134, code: 'MNU_DOCKER_AVANZADO', label: 'Docker (Avanzado)', path: '/guias/docker/avanzado', priority: '0.7', changefreq: 'monthly' },
          { id: 135, code: 'MNU_DOCKER_EXPERTO', label: 'Docker (Experto)', path: '/guias/docker/experto', priority: '0.7', changefreq: 'monthly' }
        ]
      },
      {
        id: 140, code: 'SUB_NGAC', label: 'Control de Acceso NGAC', icon: 'security',
        children: [
          { id: 141, code: 'MNU_NGAC_INICIAL', label: 'NGAC (Inicial)', path: '/guias/ngac/inicial', priority: '0.7', changefreq: 'monthly' },
          { id: 142, code: 'MNU_NGAC_BASICO', label: 'NGAC (Básico)', path: '/guias/ngac/basico', priority: '0.7', changefreq: 'monthly' },
          { id: 143, code: 'MNU_NGAC_MEDIO', label: 'NGAC (Medio)', path: '/guias/ngac/medio', priority: '0.7', changefreq: 'monthly' },
          { id: 144, code: 'MNU_NGAC_AVANZADO', label: 'NGAC (Avanzado)', path: '/guias/ngac/avanzado', priority: '0.7', changefreq: 'monthly' },
          { id: 145, code: 'MNU_NGAC_EXPERTO', label: 'NGAC (Experto)', path: '/guias/ngac/experto', priority: '0.7', changefreq: 'monthly' }
        ]
      },
      {
        id: 150, code: 'SUB_ORACLE', label: 'Oracle Database', icon: 'dataset',
        children: [
          { id: 151, code: 'MNU_ORACLE_INICIAL', label: 'Oracle (Inicial)', path: '/guias/oracle/inicial', priority: '0.7', changefreq: 'monthly' },
          { id: 152, code: 'MNU_ORACLE_BASICO', label: 'Oracle (Básico)', path: '/guias/oracle/basico', priority: '0.7', changefreq: 'monthly' },
          { id: 153, code: 'MNU_ORACLE_MEDIO', label: 'Oracle (Medio)', path: '/guias/oracle/medio', priority: '0.7', changefreq: 'monthly' },
          { id: 154, code: 'MNU_ORACLE_AVANZADO', label: 'Oracle (Avanzado)', path: '/guias/oracle/avanzado', priority: '0.7', changefreq: 'monthly' },
          { id: 155, code: 'MNU_ORACLE_EXPERTO', label: 'Oracle (Experto)', path: '/guias/oracle/experto', priority: '0.7', changefreq: 'monthly' }
        ]
      }
    ]
  },
  {
    id: 160, code: 'CAT_NMERGEIA_LEGAL', label: 'Centro Legal & EEAT', icon: 'gavel',
    children: [
      { id: 161, code: 'MNU_NMERGEIA_ABOUT', label: 'Sobre Nosotros (EEAT)', path: '/about', icon: 'info', priority: '0.9', changefreq: 'monthly' },
      { id: 162, code: 'MNU_NMERGEIA_CONTACT', label: 'Contacto y Soporte', path: '/contact', icon: 'mail', priority: '0.9', changefreq: 'monthly' },
      { id: 163, code: 'MNU_NMERGEIA_PRIVACY', label: 'Política de Privacidad', path: '/privacy', icon: 'shield', priority: '0.8', changefreq: 'monthly' },
      { id: 164, code: 'MNU_NMERGEIA_TERMS', label: 'Términos y Condiciones', path: '/terms', icon: 'gavel', priority: '0.8', changefreq: 'monthly' },
      { id: 165, code: 'MNU_NMERGEIA_COOKIES', label: 'Política de Cookies', path: '/cookie-policy', icon: 'cookie', priority: '0.8', changefreq: 'monthly' },
      { id: 166, code: 'MNU_NMERGEIA_LEGAL', label: 'Aviso Legal', path: '/legal-notice', icon: 'balance', priority: '0.8', changefreq: 'monthly' },
      { id: 167, code: 'MNU_NMERGEIA_EULA', label: 'Contrato EULA', path: '/eula', icon: 'description', priority: '0.8', changefreq: 'monthly' }
    ]
  }
];

/**
 * Recorre recursivamente el árbol de menú y extrae todas las rutas u objetos finales
 */
export function flattenMenuRoutes(items = MENU_TREE) {
  let routes = [];
  for (const item of items) {
    if (item.path) {
      routes.push(item);
    }
    if (item.children && Array.isArray(item.children)) {
      routes = routes.concat(flattenMenuRoutes(item.children));
    }
  }
  return routes;
}

export const ALL_MENU_ROUTES = flattenMenuRoutes(MENU_TREE);
