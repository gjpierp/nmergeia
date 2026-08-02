import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');

const LOCALES_DIR = path.join(projectRoot, 'public', 'locales');
const DOCS_DIR = path.join(projectRoot, 'public', 'docs');

const LANGUAGES = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];

const MENU_TRANSLATIONS = {
  es: {
    CAT_NMERGEIA_WORKSPACE: "Plataforma Principal",
    CAT_NMERGEIA_GUIAS: "Biblioteca Técnica & Especialidades",
    CAT_NMERGEIA_LEGAL: "Centro Legal & EEAT",
    MNU_NMERGEIA_LANDING: "Inicio",
    MNU_NMERGEIA_FEATURES: "Características",
    MNU_NMERGEIA_PRICING: "Planes y Precios",
    MNU_NMERGEIA_DOCS: "Biblioteca Técnica",
    MNU_NMERGEIA_FAQ: "Preguntas Frecuentes",
    MNU_NMERGEIA_MAIN: "Comparador Principal",
    MNU_NMERGEIA_FILTERS: "Gestor de Filtros",
    MNU_NMERGEIA_HISTORY: "Historial de Análisis",
    MNU_NMERGEIA_TERMINAL: "Consola Integrada",
    MNU_NMERGEIA_ABOUT: "Sobre Nosotros (EEAT)",
    MNU_NMERGEIA_CONTACT: "Contacto y Soporte",
    MNU_NMERGEIA_PRIVACY: "Política de Privacidad",
    MNU_NMERGEIA_TERMS: "Términos y Condiciones",
    MNU_NMERGEIA_COOKIES: "Política de Cookies",
    MNU_NMERGEIA_LEGAL: "Aviso Legal",
    MNU_NMERGEIA_EULA: "Contrato EULA",
    MNU_DATASCIENCE_GUIDE: "Data Science & AI (Guía Completa)",
    MNU_DATASCIENCE_PYSPARK: "PySpark & Big Data",
    MNU_DATASCIENCE_KAFKA: "Apache Kafka Streaming",
    MNU_DATASCIENCE_DELTALAKE: "Delta Lake & Lakehouse",
    MNU_DATASCIENCE_MLOPS: "MLOps & GPU vLLM Serving",
    MNU_DATASCIENCE_POLARS: "Polars Rust SIMD Engine",
    MNU_POSTGRES_GUIDE: "PostgreSQL Enterprise",
    MNU_ORACLE_GUIDE: "Oracle Database Enterprise",
    MNU_DOCKER_GUIDE: "Docker & Contenedores",
    MNU_NGAC_GUIDE: "Gobernanza Sentinel-NGAC",
    MNU_EXT_AWS: "AWS Serverless & Lambda",
    MNU_EXT_NODE: "Node.js Enterprise Backend",
    MNU_EXT_PENTEST: "Pentesting & Ethical Hacking",
    MNU_EXT_REACT: "React 19 & Next.js Architecture",
    MNU_EXT_VUE: "Vue 3 & Nuxt Enterprise"
  },
  en: {
    CAT_NMERGEIA_WORKSPACE: "Main Platform",
    CAT_NMERGEIA_GUIAS: "Technical Library & Specialties",
    CAT_NMERGEIA_LEGAL: "Legal Center & EEAT",
    MNU_NMERGEIA_LANDING: "Home",
    MNU_NMERGEIA_FEATURES: "Features",
    MNU_NMERGEIA_PRICING: "Plans & Pricing",
    MNU_NMERGEIA_DOCS: "Technical Library",
    MNU_NMERGEIA_FAQ: "Frequently Asked Questions",
    MNU_NMERGEIA_MAIN: "Main Comparator",
    MNU_NMERGEIA_FILTERS: "Filter Manager",
    MNU_NMERGEIA_HISTORY: "Analysis History",
    MNU_NMERGEIA_TERMINAL: "Integrated Console",
    MNU_NMERGEIA_ABOUT: "About Us (EEAT)",
    MNU_NMERGEIA_CONTACT: "Contact & Support",
    MNU_NMERGEIA_PRIVACY: "Privacy Policy",
    MNU_NMERGEIA_TERMS: "Terms & Conditions",
    MNU_NMERGEIA_COOKIES: "Cookie Policy",
    MNU_NMERGEIA_LEGAL: "Legal Notice",
    MNU_NMERGEIA_EULA: "EULA Agreement",
    MNU_DATASCIENCE_GUIDE: "Data Science & AI (Full Guide)",
    MNU_DATASCIENCE_PYSPARK: "PySpark & Big Data",
    MNU_DATASCIENCE_KAFKA: "Apache Kafka Streaming",
    MNU_DATASCIENCE_DELTALAKE: "Delta Lake & Lakehouse",
    MNU_DATASCIENCE_MLOPS: "MLOps & GPU vLLM Serving",
    MNU_DATASCIENCE_POLARS: "Polars Rust SIMD Engine",
    MNU_POSTGRES_GUIDE: "PostgreSQL Enterprise",
    MNU_ORACLE_GUIDE: "Oracle Database Enterprise",
    MNU_DOCKER_GUIDE: "Docker & Containers",
    MNU_NGAC_GUIDE: "Sentinel-NGAC Governance",
    MNU_EXT_AWS: "AWS Serverless & Lambda",
    MNU_EXT_NODE: "Node.js Enterprise Backend",
    MNU_EXT_PENTEST: "Pentesting & Ethical Hacking",
    MNU_EXT_REACT: "React 19 & Next.js Architecture",
    MNU_EXT_VUE: "Vue 3 & Nuxt Enterprise"
  },
  de: {
    CAT_NMERGEIA_WORKSPACE: "Hauptplattform",
    CAT_NMERGEIA_GUIAS: "Technische Bibliothek & Spezialgebiete",
    CAT_NMERGEIA_LEGAL: "Rechtliches Zentrum & EEAT",
    MNU_NMERGEIA_LANDING: "Startseite",
    MNU_NMERGEIA_FEATURES: "Funktionen",
    MNU_NMERGEIA_PRICING: "Pläne & Preise",
    MNU_NMERGEIA_DOCS: "Technische Bibliothek",
    MNU_NMERGEIA_FAQ: "Häufig gestellte Fragen",
    MNU_NMERGEIA_MAIN: "Hauptvergleicher",
    MNU_NMERGEIA_FILTERS: "Filter-Manager",
    MNU_NMERGEIA_HISTORY: "Analyseverlauf",
    MNU_NMERGEIA_TERMINAL: "Integrierte Konsole",
    MNU_NMERGEIA_ABOUT: "Über uns (EEAT)",
    MNU_NMERGEIA_CONTACT: "Kontakt & Support",
    MNU_NMERGEIA_PRIVACY: "Datenschutz-Bestimmungen",
    MNU_NMERGEIA_TERMS: "Allgemeine Geschäftsbedingungen",
    MNU_NMERGEIA_COOKIES: "Cookie-Richtlinie",
    MNU_NMERGEIA_LEGAL: "Impressum",
    MNU_NMERGEIA_EULA: "EULA-Vereinbarung",
    MNU_DATASCIENCE_GUIDE: "Data Science & KI (Vollständiges Handbuch)",
    MNU_DATASCIENCE_PYSPARK: "PySpark & Big Data",
    MNU_DATASCIENCE_KAFKA: "Apache Kafka Streaming",
    MNU_DATASCIENCE_DELTALAKE: "Delta Lake & Lakehouse",
    MNU_DATASCIENCE_MLOPS: "MLOps & GPU vLLM Serving",
    MNU_DATASCIENCE_POLARS: "Polars Rust SIMD Engine",
    MNU_POSTGRES_GUIDE: "PostgreSQL Enterprise",
    MNU_ORACLE_GUIDE: "Oracle Database Enterprise",
    MNU_DOCKER_GUIDE: "Docker & Container",
    MNU_NGAC_GUIDE: "Sentinel-NGAC Governance",
    MNU_EXT_AWS: "AWS Serverless & Lambda",
    MNU_EXT_NODE: "Node.js Enterprise Backend",
    MNU_EXT_PENTEST: "Pentesting & Ethical Hacking",
    MNU_EXT_REACT: "React 19 & Next.js Architektur",
    MNU_EXT_VUE: "Vue 3 & Nuxt Enterprise"
  },
  fr: {
    CAT_NMERGEIA_WORKSPACE: "Plateforme Principale",
    CAT_NMERGEIA_GUIAS: "Bibliothèque Technique & Spécialités",
    CAT_NMERGEIA_LEGAL: "Centre Légal & EEAT",
    MNU_NMERGEIA_LANDING: "Accueil",
    MNU_NMERGEIA_FEATURES: "Fonctionnalités",
    MNU_NMERGEIA_PRICING: "Offres & Tarifs",
    MNU_NMERGEIA_DOCS: "Bibliothèque Technique",
    MNU_NMERGEIA_FAQ: "Foire Aux Questions",
    MNU_NMERGEIA_MAIN: "Comparateur Principal",
    MNU_NMERGEIA_FILTERS: "Gestionnaire de Filtres",
    MNU_NMERGEIA_HISTORY: "Historique des Analyses",
    MNU_NMERGEIA_TERMINAL: "Console Intégrée",
    MNU_NMERGEIA_ABOUT: "À propos de nous (EEAT)",
    MNU_NMERGEIA_CONTACT: "Contact & Support",
    MNU_NMERGEIA_PRIVACY: "Politique de Confidentialité",
    MNU_NMERGEIA_TERMS: "Conditions Générales",
    MNU_NMERGEIA_COOKIES: "Politique des Cookies",
    MNU_NMERGEIA_LEGAL: "Mentions Légales",
    MNU_NMERGEIA_EULA: "Accord EULA",
    MNU_DATASCIENCE_GUIDE: "Data Science & IA (Guide Complet)",
    MNU_DATASCIENCE_PYSPARK: "PySpark & Big Data",
    MNU_DATASCIENCE_KAFKA: "Apache Kafka Streaming",
    MNU_DATASCIENCE_DELTALAKE: "Delta Lake & Lakehouse",
    MNU_DATASCIENCE_MLOPS: "MLOps & GPU vLLM Serving",
    MNU_DATASCIENCE_POLARS: "Polars Rust SIMD Engine",
    MNU_POSTGRES_GUIDE: "PostgreSQL Enterprise",
    MNU_ORACLE_GUIDE: "Oracle Database Enterprise",
    MNU_DOCKER_GUIDE: "Docker & Conteneurs",
    MNU_NGAC_GUIDE: "Gouvernance Sentinel-NGAC",
    MNU_EXT_AWS: "AWS Serverless & Lambda",
    MNU_EXT_NODE: "Node.js Enterprise Backend",
    MNU_EXT_PENTEST: "Pentesting & Ethical Hacking",
    MNU_EXT_REACT: "React 19 & Next.js Architecture",
    MNU_EXT_VUE: "Vue 3 & Nuxt Enterprise"
  },
  pt: {
    CAT_NMERGEIA_WORKSPACE: "Plataforma Principal",
    CAT_NMERGEIA_GUIAS: "Biblioteca Técnica & Especialidades",
    CAT_NMERGEIA_LEGAL: "Centro Legal & EEAT",
    MNU_NMERGEIA_LANDING: "Início",
    MNU_NMERGEIA_FEATURES: "Recursos",
    MNU_NMERGEIA_PRICING: "Planos e Preços",
    MNU_NMERGEIA_DOCS: "Biblioteca Técnica",
    MNU_NMERGEIA_FAQ: "Perguntas Frequentes",
    MNU_NMERGEIA_MAIN: "Comparador Principal",
    MNU_NMERGEIA_FILTERS: "Gerenciador de Filtros",
    MNU_NMERGEIA_HISTORY: "Histórico de Análises",
    MNU_NMERGEIA_TERMINAL: "Console Integrado",
    MNU_NMERGEIA_ABOUT: "Sobre Nós (EEAT)",
    MNU_NMERGEIA_CONTACT: "Contato e Suporte",
    MNU_NMERGEIA_PRIVACY: "Política de Privacidade",
    MNU_NMERGEIA_TERMS: "Termos e Condições",
    MNU_NMERGEIA_COOKIES: "Política de Cookies",
    MNU_NMERGEIA_LEGAL: "Aviso Legal",
    MNU_NMERGEIA_EULA: "Contrato EULA",
    MNU_DATASCIENCE_GUIDE: "Data Science & IA (Guia Completo)",
    MNU_DATASCIENCE_PYSPARK: "PySpark & Big Data",
    MNU_DATASCIENCE_KAFKA: "Apache Kafka Streaming",
    MNU_DATASCIENCE_DELTALAKE: "Delta Lake & Lakehouse",
    MNU_DATASCIENCE_MLOPS: "MLOps & GPU vLLM Serving",
    MNU_DATASCIENCE_POLARS: "Polars Rust SIMD Engine",
    MNU_POSTGRES_GUIDE: "PostgreSQL Enterprise",
    MNU_ORACLE_GUIDE: "Oracle Database Enterprise",
    MNU_DOCKER_GUIDE: "Docker & Contêineres",
    MNU_NGAC_GUIDE: "Governança Sentinel-NGAC",
    MNU_EXT_AWS: "AWS Serverless & Lambda",
    MNU_EXT_NODE: "Node.js Enterprise Backend",
    MNU_EXT_PENTEST: "Pentesting & Ethical Hacking",
    MNU_EXT_REACT: "React 19 & Arquitetura Next.js",
    MNU_EXT_VUE: "Vue 3 & Nuxt Enterprise"
  },
  zh: {
    CAT_NMERGEIA_WORKSPACE: "主平台",
    CAT_NMERGEIA_GUIAS: "技术图解与专业指南",
    CAT_NMERGEIA_LEGAL: "法律与 EEAT 中心",
    MNU_NMERGEIA_LANDING: "首页",
    MNU_NMERGEIA_FEATURES: "核心功能",
    MNU_NMERGEIA_PRICING: "方案与定价",
    MNU_NMERGEIA_DOCS: "技术文档",
    MNU_NMERGEIA_FAQ: "常见问题",
    MNU_NMERGEIA_MAIN: "主比对器",
    MNU_NMERGEIA_FILTERS: "过滤器管理",
    MNU_NMERGEIA_HISTORY: "分析历史",
    MNU_NMERGEIA_TERMINAL: "集成控制台",
    MNU_NMERGEIA_ABOUT: "关于我们 (EEAT)",
    MNU_NMERGEIA_CONTACT: "联系与支持",
    MNU_NMERGEIA_PRIVACY: "隐私政策",
    MNU_NMERGEIA_TERMS: "条款与条件",
    MNU_NMERGEIA_COOKIES: "Cookie 政策",
    MNU_NMERGEIA_LEGAL: "法律声明",
    MNU_NMERGEIA_EULA: "EULA 协议",
    MNU_DATASCIENCE_GUIDE: "数据科学与 AI 指南",
    MNU_DATASCIENCE_PYSPARK: "PySpark 与大数据",
    MNU_DATASCIENCE_KAFKA: "Apache Kafka 流处理",
    MNU_DATASCIENCE_DELTALAKE: "Delta Lake 湖仓架构",
    MNU_DATASCIENCE_MLOPS: "MLOps 与 vLLM 部署",
    MNU_DATASCIENCE_POLARS: "Polars Rust SIMD 引擎",
    MNU_POSTGRES_GUIDE: "PostgreSQL 企业指南",
    MNU_ORACLE_GUIDE: "Oracle 数据库企业指南",
    MNU_DOCKER_GUIDE: "Docker 与容器化",
    MNU_NGAC_GUIDE: "Sentinel-NGAC 治理",
    MNU_EXT_AWS: "AWS 无服务器与 Lambda",
    MNU_EXT_NODE: "Node.js 企业后端",
    MNU_EXT_PENTEST: "渗透测试与网络安全",
    MNU_EXT_REACT: "React 19 与 Next.js 架构",
    MNU_EXT_VUE: "Vue 3 与 Nuxt 企业架构"
  },
  ja: {
    CAT_NMERGEIA_WORKSPACE: "メインプラットフォーム",
    CAT_NMERGEIA_GUIAS: "技術ライブラリ＆専門分野",
    CAT_NMERGEIA_LEGAL: "法的センター＆EEAT",
    MNU_NMERGEIA_LANDING: "ホーム",
    MNU_NMERGEIA_FEATURES: "主要機能",
    MNU_NMERGEIA_PRICING: "料金プラン",
    MNU_NMERGEIA_DOCS: "技術ドキュメント",
    MNU_NMERGEIA_FAQ: "よくある質問",
    MNU_NMERGEIA_MAIN: "メイン比較ツール",
    MNU_NMERGEIA_FILTERS: "フィルターマネージャー",
    MNU_NMERGEIA_HISTORY: "解析履歴",
    MNU_NMERGEIA_TERMINAL: "統合コンソール",
    MNU_NMERGEIA_ABOUT: "運営会社・EEAT",
    MNU_NMERGEIA_CONTACT: "お問い合わせ・サポート",
    MNU_NMERGEIA_PRIVACY: "プライバシーポリシー",
    MNU_NMERGEIA_TERMS: "利用規約",
    MNU_NMERGEIA_COOKIES: "クッキーポリシー",
    MNU_NMERGEIA_LEGAL: "法的通知",
    MNU_NMERGEIA_EULA: "EULA使用許諾契約",
    MNU_DATASCIENCE_GUIDE: "データサイエンス＆AI 完全ガイド",
    MNU_DATASCIENCE_PYSPARK: "PySpark＆ビッグデータ",
    MNU_DATASCIENCE_KAFKA: "Apache Kafka ストリーミング",
    MNU_DATASCIENCE_DELTALAKE: "Delta Lake レイクハウス",
    MNU_DATASCIENCE_MLOPS: "MLOps＆vLLM Serving",
    MNU_DATASCIENCE_POLARS: "Polars Rust SIMD エンジン",
    MNU_POSTGRES_GUIDE: "PostgreSQL エンタープライズ",
    MNU_ORACLE_GUIDE: "Oracle Database エンタープライズ",
    MNU_DOCKER_GUIDE: "Docker＆コンテナ",
    MNU_NGAC_GUIDE: "Sentinel-NGAC ガバナンス",
    MNU_EXT_AWS: "AWS サーバーレス＆Lambda",
    MNU_EXT_NODE: "Node.js エンタープライズバックエンド",
    MNU_EXT_PENTEST: "ペネトレーションテスト＆セキュリティ",
    MNU_EXT_REACT: "React 19＆Next.js アーキテクチャ",
    MNU_EXT_VUE: "Vue 3＆Nuxt エンタープライズ"
  }
};

const DIAGRAM_TRANSLATIONS = {
  en: [
    ['Cliente / Aplicación NMerge', 'NMerge Client / Application'],
    ['Petición de Procesamiento', 'Processing Request'],
    ['Particionado Dinámico', 'Dynamic Partitioning'],
    ['Gestor de Memoria SIMD / Buffer Directo', 'SIMD Memory Manager / Direct Buffer'],
    ['Persistencia Estructurada', 'Structured Persistence'],
    ['Auditoría de Seguridad', 'Security Audit'],
    ['Servidor de Base de Datos', 'Database Server'],
    ['Capa de Red y Proxy', 'Network & Proxy Layer'],
    ['Motor de Ejecución', 'Execution Engine'],
    ['Nivel Inicial', 'Initial Level'],
    ['Nivel Básico', 'Basic Level'],
    ['Nivel Medio', 'Intermediate Level'],
    ['Nivel Avanzado', 'Advanced Level'],
    ['Nivel Experto', 'Expert Level']
  ],
  de: [
    ['Cliente / Aplicación NMerge', 'NMerge Client / Anwendung'],
    ['Petición de Procesamiento', 'Verarbeitungsanfrage'],
    ['Particionado Dinámico', 'Dynamische Partitionierung'],
    ['Gestor de Memoria SIMD / Buffer Directo', 'SIMD-Speicher-Manager / Direkter Puffer'],
    ['Persistencia Estructurada', 'Strukturierte Persistenz'],
    ['Auditoría de Seguridad', 'Sicherheitsaudit'],
    ['Servidor de Base de Datos', 'Datenbankserver'],
    ['Capa de Red y Proxy', 'Netzwerk & Proxy-Schicht'],
    ['Motor de Ejecución', 'Ausführungs-Engine'],
    ['Nivel Inicial', 'Einführungsstufe'],
    ['Nivel Básico', 'Grundstufe'],
    ['Nivel Medio', 'Mittlere Stufe'],
    ['Nivel Avanzado', 'Fortgeschrittene Stufe'],
    ['Nivel Experto', 'Expertenstufe']
  ],
  fr: [
    ['Cliente / Aplicación NMerge', 'Client / Application NMerge'],
    ['Petición de Procesamiento', 'Demande de traitement'],
    ['Particionado Dinámico', 'Partitionnement dynamique'],
    ['Gestor de Memoria SIMD / Buffer Directo', 'Gestionnaire de mémoire SIMD / Buffer direct'],
    ['Persistencia Estructurada', 'Persistance structurée'],
    ['Auditoría de Seguridad', 'Audit de sécurité'],
    ['Servidor de Base de Datos', 'Serveur de base de données'],
    ['Capa de Red y Proxy', 'Couche réseau et proxy'],
    ['Motor de Ejecución', 'Moteur d\'exécution'],
    ['Nivel Inicial', 'Niveau Initial'],
    ['Nivel Básico', 'Niveau Basique'],
    ['Nivel Medio', 'Niveau Intermédiaire'],
    ['Nivel Avanzado', 'Niveau Avancé'],
    ['Nivel Experto', 'Niveau Expert']
  ],
  pt: [
    ['Cliente / Aplicación NMerge', 'Cliente / Aplicação NMerge'],
    ['Petición de Procesamiento', 'Solicitação de Processamento'],
    ['Particionado Dinámico', 'Particionamento Dinâmico'],
    ['Gestor de Memoria SIMD / Buffer Directo', 'Gerenciador de Memória SIMD / Buffer Direto'],
    ['Persistencia Estructurada', 'Persistência Estruturada'],
    ['Auditoría de Seguridad', 'Auditoria de Segurança'],
    ['Servidor de Base de Datos', 'Servidor de Banco de Dados'],
    ['Capa de Red y Proxy', 'Camada de Rede e Proxy'],
    ['Motor de Ejecución', 'Motor de Execução'],
    ['Nivel Inicial', 'Nível Inicial'],
    ['Nivel Básico', 'Nível Básico'],
    ['Nivel Medio', 'Nível Intermediário'],
    ['Nivel Avanzado', 'Nível Avançado'],
    ['Nivel Experto', 'Nível Especialista']
  ],
  zh: [
    ['Cliente / Aplicación NMerge', 'NMerge 客户端 / 应用'],
    ['Petición de Procesamiento', '处理请求'],
    ['Particionado Dinámico', '动态分区'],
    ['Gestor de Memoria SIMD / Buffer Directo', 'SIMD 内存管理器 / 直接缓冲区'],
    ['Persistencia Estructurada', '结构化持久化'],
    ['Auditoría de Seguridad', '安全审计'],
    ['Servidor de Base de Datos', '数据库服务器'],
    ['Capa de Red y Proxy', '网络与代理层'],
    ['Motor de Ejecución', '执行引擎'],
    ['Nivel Inicial', '入门级'],
    ['Nivel Básico', '基础级'],
    ['Nivel Medio', '中级'],
    ['Nivel Avanzado', '高级'],
    ['Nivel Experto', '专家级']
  ],
  ja: [
    ['Cliente / Aplicación NMerge', 'NMerge クライアント / アプリ'],
    ['Petición de Procesamiento', '処理リクエスト'],
    ['Particionado Dinámico', '動的パーティショニング'],
    ['Gestor de Memoria SIMD / Buffer Directo', 'SIMD メモリマネージャー / ダイレクトバッファ'],
    ['Persistencia Estructurada', '構造化永続性'],
    ['Auditoría de Seguridad', 'セキュリティ監査'],
    ['Servidor de Base de Datos', 'データベースサーバー'],
    ['Capa de Red y Proxy', 'ネットワーク＆プロキシ層'],
    ['Motor de Ejecución', '実行エンジン'],
    ['Nivel Inicial', '入門レベル'],
    ['Nivel Básico', '基本レベル'],
    ['Nivel Medio', '中级レベル'],
    ['Nivel Avanzado', '上級レベル'],
    ['Nivel Experto', 'エキスパートレベル']
  ]
};

console.log("🌐 Sincronizando traducciones i18n y diagramas Mermaid en los 7 idiomas...");

// 1. Actualizar translation.json para todos los idiomas
LANGUAGES.forEach(lang => {
  const jsonPath = path.join(LOCALES_DIR, lang, 'translation.json');
  if (!fs.existsSync(jsonPath)) return;

  try {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(raw);

    const additions = MENU_TRANSLATIONS[lang] || {};
    Object.assign(data, additions);

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`  ✅ Actualizadas claves de menú i18n en [${lang}] (${Object.keys(additions).length} claves)`);
  } catch (err) {
    console.error(`  ❌ Error procesando ${jsonPath}:`, err.message);
  }
});

// 2. Traducir etiquetas Mermaid y contenido en los documentos markdown
const esDocsDir = path.join(DOCS_DIR, 'es');
const esFiles = fs.readdirSync(esDocsDir).filter(f => f.endsWith('.md'));

LANGUAGES.filter(l => l !== 'es').forEach(lang => {
  const targetDir = path.join(DOCS_DIR, lang);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const replacements = DIAGRAM_TRANSLATIONS[lang] || [];

  esFiles.forEach(fileName => {
    const esPath = path.join(esDocsDir, fileName);
    const targetPath = path.join(targetDir, fileName);

    let content = fs.readFileSync(esPath, 'utf-8');

    // Reemplazar etiquetas dentro de diagramas Mermaid
    replacements.forEach(([from, to]) => {
      content = content.replaceAll(from, to);
    });

    fs.writeFileSync(targetPath, content, 'utf-8');
  });

  console.log(`  ✅ Copiados y traducidos diagramas Mermaid para [${lang}] (${esFiles.length} archivos)`);
});

console.log("🎉 ¡Sincronización completa de i18n y diagramas Mermaid finalizada!");
