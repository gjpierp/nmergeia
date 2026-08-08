import React, { useState } from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { useTranslation } from 'react-i18next';

// Limpiador helper para remover números de orden (ej: "1. ") y emojis incrustados duplicados del texto
const cleanNodeLabel = (label = '') => {
  if (!label) return '';
  let str = String(label);

  // 1. Remueve caracteres Emojis Unicode
  try {
    str = str.replace(/\p{Extended_Pictographic}/gu, '');
  } catch (_) {}
  str = str.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{2000}-\u{3300}]/gu, '');

  // 2. Remueve prefijos de numeración como "1. ", "1.- ", "01. ", "1) ", "N1. ", "1.0 " etc.
  str = str.replace(/^([A-Za-z0-9\_]*\d+[\.\-\_\)\:\s]*)+/gi, '');

  // 3. Remueve cualquier emoji residual
  try {
    str = str.replace(/\p{Extended_Pictographic}/gu, '');
  } catch (_) {}
  str = str.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{2000}-\u{3300}]/gu, '');

  return str.replace(/\s+/g, ' ').trim();
};

// Estructura por defecto del Menú Sentinel-NGAC
const DEFAULT_SENTINEL_MENU = import.meta.env.VITE_IS_DESKTOP === 'true' ? [
  {
    id: 112, code: 'CAT_NMERGEIA_N3_WORKSPACE', label: 'Plataforma Principal', icon: 'desktop_windows', node_type: 'CONTAINER',
    children: [
      { id: 113, code: 'MNU_NMERGEIA_MAIN', label: 'Comparador Principal', path: '/main', icon: 'grid_view', node_type: 'OBJECT' },
      { id: 115, code: 'MNU_NMERGEIA_FILTERS', label: 'Gestor de Filtros', path: '/filters', icon: 'filter_alt', node_type: 'OBJECT' },
      { id: 116, code: 'MNU_NMERGEIA_HISTORY', label: 'Historial', path: '/history', icon: 'history', node_type: 'OBJECT' },
      { id: 117, code: 'MNU_NMERGEIA_TERMINAL', label: 'Consola Integrada', path: '/terminal', icon: 'terminal', node_type: 'OBJECT' }
    ]
  }
] : [
  { id: 105, code: 'MNU_NMERGEIA_LANDING', label: 'Inicio', path: '/', icon: 'home', node_type: 'OBJECT' },
  { id: 106, code: 'MNU_NMERGEIA_FEATURES', label: 'Características', path: '/features', icon: 'star', node_type: 'OBJECT' },
  { id: 107, code: 'MNU_NMERGEIA_PRICING', label: 'Planes y Precios', path: '/pricing', icon: 'payments', disabled: true, is_enabled: false, node_type: 'OBJECT' },
  { id: 108, code: 'MNU_NMERGEIA_DOCS', label: 'Documentación', path: '/docs', icon: 'menu_book', node_type: 'OBJECT' },
  { id: 105, code: 'MNU_NMERGEIA_FAQ', label: 'Preguntas Frecuentes', path: '/faq', icon: 'help_outline', node_type: 'OBJECT' },
  {
    id: 109, code: 'CAT_NMERGEIA_N2_AUTH', label: 'Autenticación', icon: 'lock', node_type: 'CONTAINER', disabled: true, is_enabled: false,
    children: [
      { id: 110, code: 'MNU_NMERGEIA_LOGIN', label: 'Iniciar Sesión', path: '/login', icon: 'login', disabled: true, is_enabled: false, node_type: 'OBJECT' },
      { id: 111, code: 'MNU_NMERGEIA_REGISTER', label: 'Registro & Licencia', path: '/register', icon: 'person_add', disabled: true, is_enabled: false, node_type: 'OBJECT' },
      { id: 168, code: 'MNU_NMERGEIA_LICENSES', label: 'Gestión Licencias', path: '/licenses', icon: 'card_membership', disabled: true, is_enabled: false, node_type: 'OBJECT' }
    ]
  },
  {
    id: 112, code: 'CAT_NMERGEIA_N3_WORKSPACE', label: 'Plataforma Principal', icon: 'desktop_windows', node_type: 'CONTAINER',
    children: [
      { id: 113, code: 'MNU_NMERGEIA_MAIN', label: 'Comparador Principal', path: '/main', icon: 'grid_view', node_type: 'OBJECT' },
      { id: 114, code: 'MNU_NMERGEIA_DIFF', label: 'Visor Monaco Diff', path: '/diff', icon: 'difference', disabled: true, is_enabled: false, node_type: 'OBJECT' },
      { id: 115, code: 'MNU_NMERGEIA_FILTERS', label: 'Gestor de Filtros', path: '/filters', icon: 'filter_alt', node_type: 'OBJECT' },
      { id: 116, code: 'MNU_NMERGEIA_HISTORY', label: 'Historial', path: '/history', icon: 'history', node_type: 'OBJECT' },
      { id: 117, code: 'MNU_NMERGEIA_TERMINAL', label: 'Consola Integrada', path: '/terminal', icon: 'terminal', node_type: 'OBJECT' },
      { id: 169, code: 'MNU_NMERGEIA_SALES', label: 'Ventas & Cotizaciones', path: '/sales', icon: 'point_of_sale', disabled: true, is_enabled: false, node_type: 'OBJECT' }
    ]
  },
  {
    id: 118, code: 'CAT_NMERGEIA_N4_TEMAS', label: 'Biblioteca Técnica', icon: 'school', node_type: 'CONTAINER',
    children: [
      {
        id: 1180, code: 'SUB_TEMAS_DATASCIENCE', label: 'Data Science & AI Engineering', icon: 'analytics', node_type: 'CONTAINER',
        children: [
          { id: 1181, code: 'MNU_DATASCIENCE_GUIDE', label: 'Data Science & AI (Guía Completa)', path: '/temas/datascience', icon: 'analytics', node_type: 'OBJECT' },
          { id: 1253, code: 'MNU_TEMA_13', label: 'Arquitecturas LLM & RAG Vectorial', path: '/temas/tema-13-llm-rag', icon: 'psychology', node_type: 'OBJECT' },
          { id: 1254, code: 'MNU_TEMA_14', label: 'Agentes Autónomos de IA', path: '/temas/tema-14-ai-agents', icon: 'smart_toy', node_type: 'OBJECT' },
          { id: 1182, code: 'MNU_DATASCIENCE_PYSPARK', label: 'PySpark & Big Data', path: '/temas/datascience/pyspark', icon: 'dataset', node_type: 'OBJECT' },
          { id: 1183, code: 'MNU_DATASCIENCE_KAFKA', label: 'Apache Kafka Event Streaming', path: '/temas/datascience/kafka', icon: 'stream', node_type: 'OBJECT' },
          { id: 1184, code: 'MNU_DATASCIENCE_DELTALAKE', label: 'Delta Lake & Lakehouse', path: '/temas/datascience/deltalake', icon: 'layers', node_type: 'OBJECT' },
          { id: 1185, code: 'MNU_DATASCIENCE_MLOPS', label: 'MLOps & GPU vLLM Serving', path: '/temas/datascience/mlops', icon: 'memory', node_type: 'OBJECT' },
          { id: 1186, code: 'MNU_DATASCIENCE_POLARS', label: 'Polars Rust SIMD Engine', path: '/temas/datascience/polars', icon: 'bolt', node_type: 'OBJECT' }
        ]
      },
      {
        id: 119, code: 'SUB_TEMAS_BD', label: 'Base de Datos & Optimización', icon: 'storage', node_type: 'CONTAINER',
        children: [
          { id: 120, code: 'MNU_POSTGRES_GUIDE', label: 'PostgreSQL Enterprise', path: '/temas/postgres', icon: 'storage', node_type: 'OBJECT' },
          { id: 121, code: 'MNU_ORACLE_GUIDE', label: 'Oracle Enterprise', path: '/temas/oracle', icon: 'database', node_type: 'OBJECT' },
          { id: 1212, code: 'MNU_TEMA_09', label: 'Migraciones de BD (Liquibase/Flyway)', path: '/temas/tema-09-migracion-db', icon: 'published_with_changes', node_type: 'OBJECT' },
          { id: 1213, code: 'MNU_TEMA_07', label: 'Row-Level Security (RLS)', path: '/temas/tema-07-rls-gobernanza', icon: 'policy', node_type: 'OBJECT' }
        ]
      },
      {
        id: 122, code: 'SUB_TEMAS_INFRA', label: 'Contenedores e Infraestructura', icon: 'cloud', node_type: 'CONTAINER',
        children: [
          { id: 1220, code: 'MNU_DOCKER_GUIDE', label: 'Docker & Contenedores', path: '/temas/docker', icon: 'cloud', node_type: 'OBJECT' },
          { id: 1222, code: 'MNU_TEMA_04', label: 'Infrastructure as Code (Terraform)', path: '/temas/tema-04-iac-terraform', icon: 'build_circle', node_type: 'OBJECT' },
          { id: 1223, code: 'MNU_TEMA_17', label: 'Kubernetes & Orquestación', path: '/temas/tema-17-kubernetes', icon: 'hub', node_type: 'OBJECT' },
          { id: 1224, code: 'MNU_TEMA_18', label: 'Cloud Native & SRE', path: '/temas/tema-18-cloud-native', icon: 'cloud_done', node_type: 'OBJECT' },
          { id: 405, code: 'MNU_EXT_AWS', label: 'AWS Serverless', path: '/temas/ext-aws', icon: 'cloud_queue', node_type: 'OBJECT' }
        ]
      },
      {
        id: 406, code: 'SUB_EXT_SEC', label: 'Ciberseguridad & Gobernanza NGAC', icon: 'security', node_type: 'CONTAINER',
        children: [
          { id: 1230, code: 'MNU_NGAC_GUIDE', label: 'Gobernanza Sentinel-NGAC', path: '/temas/ngac', icon: 'security', node_type: 'OBJECT' },
          { id: 1231, code: 'MNU_TEMA_05', label: 'Control de Acceso RBAC/ABAC/NGAC', path: '/temas/tema-05-rbac-abac-ngac', icon: 'admin_panel_settings', node_type: 'OBJECT' },
          { id: 1232, code: 'MNU_TEMA_06', label: 'Menús Dinámicos Sentinel-NGAC', path: '/temas/tema-06-ngac-menus', icon: 'list_alt', node_type: 'OBJECT' },
          { id: 1233, code: 'MNU_TEMA_08', label: 'DevSecOps & HashiCorp Vault', path: '/temas/tema-08-devsecops-vault', icon: 'vpn_key', node_type: 'OBJECT' },
          { id: 407, code: 'MNU_EXT_PENTEST', label: 'Pentesting Web', path: '/temas/ext-pentest', icon: 'bug_report', node_type: 'OBJECT' }
        ]
      },
      {
        id: 400, code: 'SUB_EXT_FRONT', label: 'Frontend & Backend', icon: 'web', node_type: 'CONTAINER',
        children: [
          { id: 401, code: 'MNU_EXT_REACT', label: 'React Avanzado', path: '/temas/ext-react', icon: 'javascript', node_type: 'OBJECT' },
          { id: 408, code: 'MNU_EXT_VUE', label: 'Vue.js Ecosystem', path: '/temas/ext-vue', icon: 'code', node_type: 'OBJECT' },
          { id: 403, code: 'MNU_EXT_NODE', label: 'Node.js Avanzado', path: '/temas/ext-node', icon: 'terminal', node_type: 'OBJECT' },
          { id: 1243, code: 'MNU_TEMA_03', label: 'Git Avanzado & Rebase', path: '/temas/tema-03-git-avanzado', icon: 'merge_type', node_type: 'OBJECT' }
        ]
      },
      {
        id: 500, code: 'SUB_TEMAS_ARCH', label: 'Arquitectura & Patrones', icon: 'architecture', node_type: 'CONTAINER',
        children: [
          { id: 1250, code: 'MNU_TEMA_10', label: 'Patrón Saga & Distributed ETL', path: '/temas/tema-10-etl-saga', icon: 'account_tree', node_type: 'OBJECT' },
          { id: 1251, code: 'MNU_TEMA_11', label: 'SaaS Multi-tenant', path: '/temas/tema-11-saas-multitenant', icon: 'domain', node_type: 'OBJECT' },
          { id: 1252, code: 'MNU_TEMA_12', label: 'Resiliencia Backend & Circuit Breakers', path: '/temas/tema-12-resiliencia-backend', icon: 'monitor_heart', node_type: 'OBJECT' },
          { id: 1255, code: 'MNU_TEMA_15', label: 'Arquitecturas Limpias & Hexagonal', path: '/temas/tema-15-arquitecturas-software', icon: 'architecture', node_type: 'OBJECT' },
          { id: 1256, code: 'MNU_TEMA_16', label: 'DDD & Toma de Requerimientos', path: '/temas/tema-16-toma-requerimientos', icon: 'assignment', node_type: 'OBJECT' }
        ]
      }
    ]
  }
];

const pathToTabMap = {
  '/': 'landing',
  '/settings': 'settings',
  '/configuracion': 'settings',
  '/features': 'features',
  '/pricing': 'pricing',
  '/faq': 'faq',
  '/docs': 'docs',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/login': 'login',
  '/register': 'register',
  '/main': 'main',
  '/diff': 'diff',
  '/filters': 'filters',
  '/history': 'history',
  '/terminal': 'terminal',

  // Rutas de Especialidades
  '/temas/datascience': 'datascience',
  '/temas/datascience/pyspark': 'datascience-pyspark',
  '/temas/datascience/kafka': 'datascience-kafka',
  '/temas/datascience/deltalake': 'datascience-deltalake',
  '/temas/datascience/mlops': 'datascience-mlops',
  '/temas/datascience/polars': 'datascience-polars',

  '/temas/postgres': 'postgres',
  '/temas/oracle': 'oracle',
  '/temas/docker': 'docker',
  '/temas/ngac': 'ngac',
  '/temas/ext-react': 'ext-react',
  '/temas/ext-vue': 'ext-vue',
  '/temas/ext-node': 'ext-node',
  '/temas/ext-aws': 'ext-aws',
  '/temas/ext-pentest': 'ext-pentest',
  '/temas/nosql/mongodb': 'nosql-mongodb',
  '/temas/nosql/redis': 'nosql-redis',
  '/temas/nosql/elasticsearch': 'nosql-elasticsearch',
  '/temas/nosql/clickhouse': 'nosql-clickhouse',
  '/temas/cloud/gcp': 'cloud-gcp',
  '/temas/cloud/azure': 'cloud-azure',
  '/temas/gitops/argocd': 'gitops-argocd',
  '/temas/observability/otel': 'observability-otel',
  '/temas/crypto/pki': 'crypto-pki',
  '/temas/security/zerotrust': 'security-zerotrust',

  '/temas/tema-02-docker-multistage': 'tema-02-docker-multistage',
  '/temas/tema-03-git-avanzado': 'tema-03-git-avanzado',
  '/temas/tema-04-iac-terraform': 'tema-04-iac-terraform',
  '/temas/tema-05-rbac-abac-ngac': 'tema-05-rbac-abac-ngac',
  '/temas/tema-06-ngac-menus': 'tema-06-ngac-menus',
  '/temas/tema-07-rls-gobernanza': 'tema-07-rls-gobernanza',
  '/temas/tema-08-devsecops-vault': 'tema-08-devsecops-vault',
  '/temas/tema-09-migracion-db': 'tema-09-migracion-db',
  '/temas/tema-10-etl-saga': 'tema-10-etl-saga',
  '/temas/tema-11-saas-multitenant': 'tema-11-saas-multitenant',
  '/temas/tema-12-resiliencia-backend': 'tema-12-resiliencia-backend',
  '/temas/tema-13-llm-rag': 'tema-13-llm-rag',
  '/temas/tema-14-ai-agents': 'tema-14-ai-agents',
  '/temas/tema-15-arquitecturas-software': 'tema-15-arquitecturas-software',
  '/temas/tema-16-toma-requerimientos': 'tema-16-toma-requerimientos',
  '/temas/tema-17-kubernetes': 'tema-17-kubernetes',
  '/temas/tema-18-cloud-native': 'tema-18-cloud-native',

  // Mapeos heredados de niveles
  '/temas/tema-postgres': 'postgres',
  '/temas/tema-oracle': 'oracle',
  '/guias/postgres/inicial': 'postgres',
  '/guias/oracle/inicial': 'oracle',
  '/guias/docker/inicial': 'docker',
  '/guias/docker/basico': 'docker',
  '/guias/docker/medio': 'docker',
  '/guias/docker/avanzado': 'docker',
  '/guias/docker/experto': 'docker',
  '/temas/ext-svelte': 'ext-svelte',
  '/temas/ext-wasm': 'ext-wasm',
  '/temas/ext-spring': 'ext-spring',
  '/temas/ext-django': 'ext-django',
  '/temas/ext-fastapi': 'ext-fastapi',
  '/temas/ext-graphql': 'ext-graphql',
  '/temas/ext-azure': 'ext-azure',
  '/temas/ext-gcp': 'ext-gcp',
  '/temas/ext-cicd': 'ext-cicd',
  '/temas/ext-obs': 'ext-obs',
  '/temas/ext-malware': 'ext-malware',
  '/temas/ext-cripto': 'ext-cripto',
  '/temas/ext-harden': 'ext-harden',
  '/temas/ext-zerot': 'ext-zerot',
  '/temas/ext-prompt': 'ext-prompt',
  '/temas/ext-finetune': 'ext-finetune',
  '/temas/ext-datalake': 'ext-datalake',
  '/temas/ext-kafka': 'ext-kafka',
  '/temas/ext-spark': 'ext-spark'
};

const codeToTabMap = {
  'mnu_nmergeia_landing': 'landing',
  'mnu_nmergeia_main': 'main',
  'mnu_nmergeia_features': 'features',
  'mnu_nmergeia_pricing': 'pricing',
  'mnu_nmergeia_docs': 'docs',
  'mnu_nmergeia_login': 'login',
  'mnu_nmergeia_register': 'register',
  'mnu_nmergeia_diff': 'diff',
  'mnu_nmergeia_filters': 'filters',
  'mnu_nmergeia_history': 'history',
  'mnu_nmergeia_terminal': 'terminal',
  'mnu_nmergeia_settings': 'settings',
  'mnu_nmergeia_configuracion': 'settings',
  'mnu_tema_01': 'tema-01-opt-postgres',
  'mnu_tema_02': 'tema-02-docker-multistage',
  'mnu_tema_03': 'git-avanzado',
  'mnu_tema_04': 'tema-04-iac-terraform',
  'mnu_tema_05': 'auth-avanzado',
  'mnu_tema_06': 'auth-experto',
  'mnu_tema_07': 'cripto-avanzado',
  'mnu_tema_08': 'devsecops-avanzado',
  'mnu_tema_09': 'tema-09-migracion-db',
  'mnu_tema_10': 'dwh-avanzado',
  'mnu_tema_11': 'arq-avanzado',
  'mnu_tema_12': 'arq-experto',
  'mnu_tema_13': 'ia-avanzado',
  'mnu_tema_14': 'ia-experto',
  'mnu_tema_15': 'cleancode-avanzado',
  'mnu_tema_16': 'req-avanzado',
  'mnu_tema_17': 'kubernetes-avanzado',
  'mnu_tema_18': 'cloud-avanzado',
  'mnu_ext_react': 'ext-react',
  'mnu_ext_vue': 'ext-vue',
  'mnu_ext_angular': 'ext-angular',
  'mnu_ext_svelte': 'ext-svelte',
  'mnu_ext_wasm': 'ext-wasm',
  'mnu_ext_node': 'ext-node',
  'mnu_ext_spring': 'ext-spring',
  'mnu_ext_django': 'ext-django',
  'mnu_ext_fastapi': 'ext-fastapi',
  'mnu_ext_graphql': 'ext-graphql',
  'mnu_ext_aws': 'ext-aws',
  'mnu_ext_azure': 'ext-azure',
  'mnu_ext_gcp': 'ext-gcp',
  'mnu_ext_cicd': 'ext-cicd',
  'mnu_ext_obs': 'ext-obs',
  'mnu_ext_pentest': 'ext-pentest',
  'mnu_ext_malware': 'ext-malware',
  'mnu_ext_cripto': 'ext-cripto',
  'mnu_ext_harden': 'ext-harden',
  'mnu_ext_zerot': 'ext-zerot',
  'mnu_ext_prompt': 'ext-prompt',
  'mnu_ext_finetune': 'ext-finetune',
  'mnu_ext_datalake': 'ext-datalake',
  'mnu_ext_kafka': 'ext-kafka',
  'mnu_ext_spark': 'ext-spark'
};

export const Sidebar = ({ mobileOpen, onMobileClose, isCollapsed }) => {
  const { activeTab, setActiveTab, selectedDiffContent, sentinelMenuTree } = useAppStore();
  const { t } = useTranslation();

  const [expandedCategories, setExpandedCategories] = useState({});

  const findPath = (nodes, targetCode, currentPath = []) => {
    for (const node of nodes) {
      const code = node.code || node.id;
      if (code === targetCode) return [...currentPath, code];
      if (node.children) {
        const path = findPath(node.children, targetCode, [...currentPath, code]);
        if (path) return path;
      }
    }
    return null;
  };

  const toggleCategory = (catCode) => {
    setExpandedCategories(prev => {
      // Si ya estaba expandido manualmente, lo quitamos
      if (prev[catCode]) {
        const next = { ...prev };
        delete next[catCode];
        return next;
      }
      
      // Si se está abriendo, calculamos su ruta (para no cerrar a sus padres)
      // y limpiamos el resto de carpetas abiertas manualmente.
      const path = findPath(menuItems, catCode) || [catCode];
      const next = {};
      path.forEach(code => { next[code] = true; });
      return next;
    });
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (onMobileClose) onMobileClose();
  };

  const menuItems = sentinelMenuTree || DEFAULT_SENTINEL_MENU;

  const getNodeTargetTab = (node) => {
    const route = (node.visible_route_url || node.path || '').toLowerCase();
    if (pathToTabMap[route]) return pathToTabMap[route];

    const rawCode = (node.code || '').toLowerCase();
    if (codeToTabMap[rawCode]) return codeToTabMap[rawCode];

    const slug = (node.visible_slug || node.code || '').toLowerCase().replace('nmerge_', '').replace('nmergeia_', '');
    if (codeToTabMap[slug]) return codeToTabMap[slug];

    if (slug === 'home' || slug === 'start' || slug === 'inicio') return 'landing';
    if (slug === 'configuracion' || slug === 'settings' || slug === 'config') return 'settings';
    if (slug === 'main' || slug === 'comparar' || slug === 'principal') return 'main';

    if (route) {
      const cleanRoute = route.replace('/temas/', '').replace('/guias/', '').replace('/', '');
      if (cleanRoute) return cleanRoute;
    }
    return node.code?.toLowerCase() || '';
  };

  const isNodeActive = (node) => {
    if (!activeTab) return false;
    const currentTab = activeTab.toLowerCase();
    const targetTab = getNodeTargetTab(node).toLowerCase();
    
    if (currentTab === targetTab) return true;
    
    const route = (node.visible_route_url || node.path || '').toLowerCase();
    if (route === `/${currentTab}` || route.endsWith(`/${currentTab}`)) return true;

    const slug = (node.visible_slug || node.code || '').toLowerCase().replace('nmerge_', '');
    if (slug === currentTab) return true;

    return false;
  };

  const isTreeOrNodeActive = (node) => {
    if (isNodeActive(node)) return true;
    if (node.children && node.children.length > 0) {
      return node.children.some(child => isTreeOrNodeActive(child));
    }
    return false;
  };

  const renderNode = (node) => {
    let isDisabled = node.is_enabled === false || node.disabled === true || node.available === false || node.access_type === 'DISABLED';
    
    // AdSense Gate removed: Migrated to Sentinel-NGAC policies.
    // The node.is_enabled and node.available properties from the backend NGAC payload dictate access.

    if (isDisabled) return null;

    const isLeaf = node.node_type === 'OBJECT' || (!node.children || node.children.length === 0);
    const targetTab = getNodeTargetTab(node);
    const isActive = isNodeActive(node);
    const hasActive = isTreeOrNodeActive(node);
    const rawLabel = node.visible_label || node.label || node.nombre || node.title || node.code || '';
    let cleanLabel = cleanNodeLabel(rawLabel);
    
    // Aplicar traducción si existe para el código del nodo
    if (node.code && t(node.code) !== node.code) {
      cleanLabel = t(node.code);
    }

    // Cuando el sidebar está colapsado, queremos ver los iconos de los menús
    // Eliminamos el return null; que ocultaba los elementos inactivos

    if (isLeaf) {
      return (
        <button
          key={node.id || node.code}
          className={`sidebar-btn ${isActive ? 'active' : ''}`}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: isCollapsed ? '10px 0' : '8px 12px',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            fontSize: '0.85rem',
            cursor: 'pointer',
            borderRadius: '8px',
            background: isActive ? 'var(--bg-tertiary)' : 'transparent',
            color: isActive ? 'var(--accent-secondary)' : 'var(--text-primary)',
            border: 'none',
            fontWeight: isActive ? 700 : 500,
            boxSizing: 'border-box'
          }}
          data-tooltip={cleanLabel}
          onClick={() => handleNavClick(targetTab)}
        >
          <span className="material-symbols-rounded" style={{ fontSize: '1.15rem', color: isActive ? 'var(--accent-secondary)' : 'var(--accent-primary)', flexShrink: 0 }}>
            {node.icon || 'article'}
          </span>
          {!isCollapsed && (
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>
              {cleanLabel}
            </span>
          )}
        </button>
      );
    }

    // Nodos tipo CONTAINER (Secciones / Categorías)
    const validChildren = node.children ? node.children.map(child => renderNode(child)).filter(Boolean) : [];
    if (validChildren.length === 0) return null;

    const nodeCode = node.code || node.id;
    const isExpanded = expandedCategories[nodeCode] === true || hasActive;

    return (
      <div key={nodeCode} style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '2px' }}>
        <button
          onClick={() => toggleCategory(nodeCode)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            width: '100%',
            padding: '8px 12px',
            background: hasActive ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.03)',
            border: 'none',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontWeight: '700',
            fontSize: '0.82rem',
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
          data-tooltip={cleanLabel}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem', color: 'var(--accent-secondary)', flexShrink: 0 }}>
              {node.icon || 'folder'}
            </span>
            {!isCollapsed && (
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {cleanLabel}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <span className="material-symbols-rounded" style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }}>
              {isExpanded ? 'expand_less' : 'expand_more'}
            </span>
          )}
        </button>

        {isExpanded && (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingLeft: isCollapsed ? '0' : '10px', gap: '2px', marginTop: '2px' }}>
            {validChildren}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {mobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onMobileClose} 
        />
      )}
      <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>


        {/* RENDERIZADO VERTICAL DE OPCIONES (HACIA ABAJO) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', flex: 1, overflowY: 'auto' }}>
          {menuItems.map(category => renderNode(category))}
        </div>

        {/* BOTÓN DE CONFIGURACIÓN */}
        {(!isCollapsed || activeTab === 'settings') && (
          <button 
            className={`sidebar-btn ${activeTab === 'settings' ? 'active' : ''}`} 
            data-tooltip={t('nav_settings') || 'Configuración'} 
            onClick={() => handleNavClick('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              color: activeTab === 'settings' ? 'var(--accent-secondary)' : 'var(--text-primary)',
              fontWeight: activeTab === 'settings' ? 700 : 500,
              background: activeTab === 'settings' ? 'var(--bg-tertiary)' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.84rem',
              width: '100%',
              marginTop: 'auto',
              boxSizing: 'border-box'
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.15rem', color: 'var(--accent-secondary)', flexShrink: 0 }}>settings</span> 
            {!isCollapsed && <span>{t('nav_settings') || 'Configuración'}</span>}
          </button>
        )}

      </aside>
    </>
  );
};


