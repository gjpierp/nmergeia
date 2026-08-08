/**
 * =====================================================================
 * Manifiesto Unificado de Rutas y Menú Sentinel-NGAC - NMerge IA
 * Fuente Única de Verdad para Sitemap, Enrutador, Sentinel y Pre-renderizado HTML
 * =====================================================================
 */

export const MENU_TREE = [
  { id: 105, code: 'MNU_NMERGEIA_LANDING', label: 'Inicio', path: '/', icon: 'home', priority: '1.0', changefreq: 'daily' },
  { id: 106, code: 'MNU_NMERGEIA_FEATURES', label: 'Características', path: '/features', icon: 'star', priority: '0.8', changefreq: 'monthly' },
  { id: 107, code: 'MNU_NMERGEIA_PRICING', label: 'Planes y Precios', path: '/pricing', icon: 'payments', priority: '0.8', changefreq: 'monthly' },
  { id: 108, code: 'MNU_NMERGEIA_DOCS', label: 'Documentación del Sistema', path: '/docs', icon: 'menu_book', priority: '0.8', changefreq: 'weekly' },
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
      // 🧠 Data Science & AI Engineering
      { id: 1200, code: 'MNU_DATASCIENCE_GUIDE', label: 'Data Science & AI (Guía Completa)', path: '/temas/datascience', icon: 'analytics', priority: '0.9', changefreq: 'weekly' },
      { id: 1253, code: 'MNU_TEMA_13', label: 'Arquitecturas LLM & RAG Vectorial', path: '/temas/tema-13-llm-rag', icon: 'psychology', priority: '0.8', changefreq: 'monthly' },
      { id: 1254, code: 'MNU_TEMA_14', label: 'Agentes Autónomos de IA', path: '/temas/tema-14-ai-agents', icon: 'smart_toy', priority: '0.8', changefreq: 'monthly' },
      { id: 1201, code: 'MNU_DATASCIENCE_PYSPARK', label: 'PySpark & Big Data', path: '/temas/datascience/pyspark', icon: 'dataset', priority: '0.8', changefreq: 'weekly' },
      { id: 1202, code: 'MNU_DATASCIENCE_KAFKA', label: 'Apache Kafka Event Streaming', path: '/temas/datascience/kafka', icon: 'stream', priority: '0.8', changefreq: 'weekly' },
      { id: 1203, code: 'MNU_DATASCIENCE_DELTALAKE', label: 'Delta Lake & Lakehouse', path: '/temas/datascience/deltalake', icon: 'layers', priority: '0.8', changefreq: 'weekly' },
      { id: 1204, code: 'MNU_DATASCIENCE_MLOPS', label: 'MLOps & GPU vLLM Serving', path: '/temas/datascience/mlops', icon: 'memory', priority: '0.8', changefreq: 'weekly' },
      { id: 1205, code: 'MNU_DATASCIENCE_POLARS', label: 'Polars Rust SIMD Engine', path: '/temas/datascience/polars', icon: 'bolt', priority: '0.8', changefreq: 'weekly' },

      // 🐘 Base de Datos & Almacenamiento
      { id: 1210, code: 'MNU_POSTGRES_GUIDE', label: 'PostgreSQL Enterprise', path: '/temas/postgres', icon: 'storage', priority: '0.8', changefreq: 'weekly' },
      { id: 1211, code: 'MNU_ORACLE_GUIDE', label: 'Oracle Database Enterprise', path: '/temas/oracle', icon: 'database', priority: '0.8', changefreq: 'weekly' },
      { id: 1212, code: 'MNU_TEMA_09', label: 'Migraciones de BD (Liquibase/Flyway)', path: '/temas/tema-09-migracion-db', icon: 'published_with_changes', priority: '0.7', changefreq: 'monthly' },
      { id: 1213, code: 'MNU_TEMA_07', label: 'Row-Level Security (RLS)', path: '/temas/tema-07-rls-gobernanza', icon: 'policy', priority: '0.7', changefreq: 'monthly' },
      { id: 1260, code: 'MNU_NOSQL_MONGODB', label: 'MongoDB Enterprise & Sharding', path: '/temas/nosql/mongodb', icon: 'view_cozy', priority: '0.8', changefreq: 'weekly' },
      { id: 1261, code: 'MNU_NOSQL_REDIS', label: 'Redis Cluster & High Availability', path: '/temas/nosql/redis', icon: 'bolt', priority: '0.8', changefreq: 'weekly' },
      { id: 1262, code: 'MNU_NOSQL_ELASTICSEARCH', label: 'Elasticsearch & Vector Search', path: '/temas/nosql/elasticsearch', icon: 'search', priority: '0.8', changefreq: 'weekly' },
      { id: 1263, code: 'MNU_NOSQL_CLICKHOUSE', label: 'ClickHouse Analytics & Columnar Engine', path: '/temas/nosql/clickhouse', icon: 'table_rows', priority: '0.8', changefreq: 'weekly' },

      // 🐳 Contenedores & Cloud Native
      { id: 1220, code: 'MNU_DOCKER_GUIDE', label: 'Docker & Contenedores (Guía Completa)', path: '/temas/docker', icon: 'cloud', priority: '0.8', changefreq: 'weekly' },
      { id: 1221, code: 'MNU_TEMA_02', label: 'Docker Multi-stage Builds', path: '/temas/tema-02-docker-multistage', icon: 'layers', priority: '0.7', changefreq: 'monthly' },
      { id: 1222, code: 'MNU_TEMA_04', label: 'Infrastructure as Code (Terraform)', path: '/temas/tema-04-iac-terraform', icon: 'build_circle', priority: '0.7', changefreq: 'monthly' },
      { id: 1223, code: 'MNU_TEMA_17', label: 'Kubernetes & Orquestación', path: '/temas/tema-17-kubernetes', icon: 'hub', priority: '0.8', changefreq: 'monthly' },
      { id: 1224, code: 'MNU_TEMA_18', label: 'Cloud Native & SRE', path: '/temas/tema-18-cloud-native', icon: 'cloud_done', priority: '0.8', changefreq: 'monthly' },
      { id: 1225, code: 'MNU_EXT_AWS', label: 'AWS Serverless & Lambda', path: '/temas/ext-aws', icon: 'cloud_queue', priority: '0.7', changefreq: 'monthly' },

      // 🛡️ Ciberseguridad & Gobernanza NGAC
      { id: 1230, code: 'MNU_NGAC_GUIDE', label: 'Gobernanza Sentinel-NGAC', path: '/temas/ngac', icon: 'security', priority: '0.8', changefreq: 'weekly' },
      { id: 1231, code: 'MNU_TEMA_05', label: 'Control de Acceso RBAC/ABAC/NGAC', path: '/temas/tema-05-rbac-abac-ngac', icon: 'admin_panel_settings', priority: '0.7', changefreq: 'monthly' },
      { id: 1232, code: 'MNU_TEMA_06', label: 'Menús Dinámicos Sentinel-NGAC', path: '/temas/tema-06-ngac-menus', icon: 'list_alt', priority: '0.7', changefreq: 'monthly' },
      { id: 1233, code: 'MNU_TEMA_08', label: 'DevSecOps & HashiCorp Vault', path: '/temas/tema-08-devsecops-vault', icon: 'vpn_key', priority: '0.7', changefreq: 'monthly' },
      { id: 1234, code: 'MNU_EXT_PENTEST', label: 'Pentesting Web & OWASP Top 10', path: '/temas/ext-pentest', icon: 'bug_report', priority: '0.7', changefreq: 'monthly' },

      // ⚛️ Frontend & Backend Ecosystem
      { id: 1240, code: 'MNU_EXT_REACT', label: 'React Avanzado & Profiling', path: '/temas/ext-react', icon: 'javascript', priority: '0.7', changefreq: 'monthly' },
      { id: 1241, code: 'MNU_EXT_VUE', label: 'Vue.js Ecosystem & Pinia', path: '/temas/ext-vue', icon: 'code', priority: '0.7', changefreq: 'monthly' },
      { id: 1242, code: 'MNU_EXT_NODE', label: 'Node.js Enterprise Architecture', path: '/temas/ext-node', icon: 'terminal', priority: '0.7', changefreq: 'monthly' },
      { id: 1243, code: 'MNU_TEMA_03', label: 'Git Avanzado & Rebase', path: '/temas/tema-03-git-avanzado', icon: 'merge_type', priority: '0.7', changefreq: 'monthly' },

      // 🏗️ Arquitectura de Software & Patrones
      { id: 1250, code: 'MNU_TEMA_10', label: 'Patrón Saga & Distributed ETL', path: '/temas/tema-10-etl-saga', icon: 'account_tree', priority: '0.7', changefreq: 'monthly' },
      { id: 1251, code: 'MNU_TEMA_11', label: 'Arquitecturas SaaS Multi-tenant', path: '/temas/tema-11-saas-multitenant', icon: 'domain', priority: '0.7', changefreq: 'monthly' },
      { id: 1252, code: 'MNU_TEMA_12', label: 'Resiliencia Backend & Circuit Breakers', path: '/temas/tema-12-resiliencia-backend', icon: 'monitor_heart', priority: '0.7', changefreq: 'monthly' },
      { id: 1255, code: 'MNU_TEMA_15', label: 'Arquitecturas Limpias & Hexagonal', path: '/temas/tema-15-arquitecturas-software', icon: 'architecture', priority: '0.8', changefreq: 'monthly' },
      { id: 1256, code: 'MNU_TEMA_16', label: 'DDD & Toma de Requerimientos', path: '/temas/tema-16-toma-requerimientos', icon: 'assignment', priority: '0.7', changefreq: 'monthly' }
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
