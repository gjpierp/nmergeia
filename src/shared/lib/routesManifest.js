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
    id: 120, code: 'CAT_NMERGEIA_GUIAS', label: 'Biblioteca Técnica & Especialidades', icon: 'school',
    children: [
      { id: 120, code: 'MNU_DATASCIENCE_GUIDE', label: 'Data Science & AI (Guía Completa & Niveles)', path: '/temas/datascience', icon: 'analytics', priority: '0.9', changefreq: 'weekly' },
      { id: 121, code: 'MNU_POSTGRES_GUIDE', label: 'PostgreSQL (Guía Completa & Niveles)', path: '/temas/postgres', icon: 'storage', priority: '0.8', changefreq: 'weekly' },
      { id: 122, code: 'MNU_ORACLE_GUIDE', label: 'Oracle Database Enterprise', path: '/temas/oracle', icon: 'database', priority: '0.8', changefreq: 'weekly' },
      { id: 130, code: 'MNU_DOCKER_GUIDE', label: 'Docker & Contenedores (Guía Completa & Niveles)', path: '/temas/docker', icon: 'cloud', priority: '0.8', changefreq: 'weekly' },
      { id: 140, code: 'MNU_NGAC_GUIDE', label: 'Control de Acceso NGAC (Guía Completa & Niveles)', path: '/temas/ngac', icon: 'security', priority: '0.8', changefreq: 'weekly' },
      { id: 151, code: 'MNU_EXT_REACT', label: 'React Avanzado', path: '/temas/ext-react', icon: 'javascript', priority: '0.7', changefreq: 'monthly' },
      { id: 152, code: 'MNU_EXT_VUE', label: 'Vue.js Ecosystem', path: '/temas/ext-vue', icon: 'code', priority: '0.7', changefreq: 'monthly' },
      { id: 153, code: 'MNU_EXT_NODE', label: 'Node.js Avanzado', path: '/temas/ext-node', icon: 'terminal', priority: '0.7', changefreq: 'monthly' },
      { id: 154, code: 'MNU_EXT_AWS', label: 'AWS Serverless', path: '/temas/ext-aws', icon: 'cloud_queue', priority: '0.7', changefreq: 'monthly' },
      { id: 155, code: 'MNU_EXT_PENTEST', label: 'Pentesting Web', path: '/temas/ext-pentest', icon: 'bug_report', priority: '0.7', changefreq: 'monthly' }
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
