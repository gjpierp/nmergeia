import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../../../public/locales');

// Dictionary of ALL sidebar menu translations across all 7 languages
const menuTranslations = {
  es: {
    MNU_NMERGEIA_LOGIN: "Iniciar Sesión",
    MNU_NMERGEIA_REGISTER: "Registro & Licencia",
    MNU_NMERGEIA_LICENSES: "Gestión Licencias",
    MNU_NMERGEIA_DIFF: "Visor Monaco Diff",
    MNU_NMERGEIA_SALES: "Ventas & Cotizaciones",
    MNU_TEMA_13: "Arquitecturas LLM & RAG Vectorial",
    MNU_TEMA_14: "Agentes Autónomos de IA",
    MNU_TEMA_09: "Migraciones de BD (Liquibase/Flyway)",
    MNU_TEMA_07: "Row-Level Security (RLS)",
    MNU_TEMA_04: "Infrastructure as Code (Terraform)",
    MNU_TEMA_17: "Kubernetes & Orquestación",
    MNU_TEMA_18: "Cloud Native & SRE",
    MNU_TEMA_05: "Control de Acceso RBAC/ABAC/NGAC",
    MNU_TEMA_06: "Menús Dinámicos Sentinel-NGAC",
    MNU_TEMA_08: "DevSecOps & HashiCorp Vault",
    SUB_EXT_FRONT: "Frontend & Backend",
    MNU_TEMA_03: "Git Avanzado & Rebase",
    SUB_TEMAS_ARCH: "Arquitectura & Patrones",
    MNU_TEMA_10: "Patrón Saga & Distributed ETL",
    MNU_TEMA_11: "SaaS Multi-tenant",
    MNU_TEMA_12: "Resiliencia Backend & Circuit Breakers",
    MNU_TEMA_15: "Arquitecturas Limpias & Hexagonal",
    MNU_TEMA_16: "DDD & Toma de Requerimientos",
    SUB_TEMAS_DATASCIENCE: "Data Science & IA Engineering",
    SUB_TEMAS_BD: "Base de Datos & Optimización",
    SUB_TEMAS_INFRA: "Contenedores e Infraestructura",
    SUB_EXT_SEC: "Ciberseguridad & Gobernanza NGAC"
  },
  fr: {
    MNU_NMERGEIA_LOGIN: "Se Connecter",
    MNU_NMERGEIA_REGISTER: "Inscription & Licence",
    MNU_NMERGEIA_LICENSES: "Gestion des Licences",
    MNU_NMERGEIA_DIFF: "Visionneuse Monaco Diff",
    MNU_NMERGEIA_SALES: "Ventes & Devis",
    MNU_TEMA_13: "Architectures LLM & RAG Vectoriel",
    MNU_TEMA_14: "Agents Autonomes d'IA",
    MNU_TEMA_09: "Migrations de BD (Liquibase/Flyway)",
    MNU_TEMA_07: "Sécurité au Niveau de Ligne (RLS)",
    MNU_TEMA_04: "Infrastructure en tant que Code (Terraform)",
    MNU_TEMA_17: "Kubernetes & Orchestration",
    MNU_TEMA_18: "Cloud Native & SRE",
    MNU_TEMA_05: "Contrôle d'Accès RBAC/ABAC/NGAC",
    MNU_TEMA_06: "Menus Dynamiques Sentinel-NGAC",
    MNU_TEMA_08: "DevSecOps & HashiCorp Vault",
    SUB_EXT_FRONT: "Frontend & Backend",
    MNU_TEMA_03: "Git Avancé & Rebase",
    SUB_TEMAS_ARCH: "Architecture & Modèles",
    MNU_TEMA_10: "Modèle Saga & ETL Distribué",
    MNU_TEMA_11: "SaaS Multi-tenant",
    MNU_TEMA_12: "Résilience Backend & Circuit Breakers",
    MNU_TEMA_15: "Architectures Propres & Hexagonales",
    MNU_TEMA_16: "DDD & Analyse des Exigences",
    SUB_TEMAS_DATASCIENCE: "Data Science & Ingénierie IA",
    SUB_TEMAS_BD: "Bases de Données & Optimisation",
    SUB_TEMAS_INFRA: "Conteneurs & Infrastructure",
    SUB_EXT_SEC: "Cybersécurité & Gouvernance NGAC"
  },
  en: {
    MNU_NMERGEIA_LOGIN: "Sign In",
    MNU_NMERGEIA_REGISTER: "Register & Licensing",
    MNU_NMERGEIA_LICENSES: "License Management",
    MNU_NMERGEIA_DIFF: "Monaco Diff Viewer",
    MNU_NMERGEIA_SALES: "Sales & Quotes",
    MNU_TEMA_13: "LLM & Vector RAG Architectures",
    MNU_TEMA_14: "Autonomous AI Agents",
    MNU_TEMA_09: "Database Migrations (Liquibase/Flyway)",
    MNU_TEMA_07: "Row-Level Security (RLS)",
    MNU_TEMA_04: "Infrastructure as Code (Terraform)",
    MNU_TEMA_17: "Kubernetes & Orchestration",
    MNU_TEMA_18: "Cloud Native & SRE",
    MNU_TEMA_05: "Access Control RBAC/ABAC/NGAC",
    MNU_TEMA_06: "Sentinel-NGAC Dynamic Menus",
    MNU_TEMA_08: "DevSecOps & HashiCorp Vault",
    SUB_EXT_FRONT: "Frontend & Backend",
    MNU_TEMA_03: "Advanced Git & Rebase",
    SUB_TEMAS_ARCH: "Architecture & Design Patterns",
    MNU_TEMA_10: "Saga Pattern & Distributed ETL",
    MNU_TEMA_11: "Multi-tenant SaaS Architecture",
    MNU_TEMA_12: "Backend Resilience & Circuit Breakers",
    MNU_TEMA_15: "Clean & Hexagonal Architecture",
    MNU_TEMA_16: "DDD & Requirements Gathering",
    SUB_TEMAS_DATASCIENCE: "Data Science & AI Engineering",
    SUB_TEMAS_BD: "Databases & Performance Tuning",
    SUB_TEMAS_INFRA: "Containers & Infrastructure",
    SUB_EXT_SEC: "Cybersecurity & NGAC Governance"
  },
  de: {
    MNU_NMERGEIA_LOGIN: "Anmelden",
    MNU_NMERGEIA_REGISTER: "Registrierung & Lizenzierung",
    MNU_NMERGEIA_LICENSES: "Lizenzverwaltung",
    MNU_NMERGEIA_DIFF: "Monaco Diff Viewer",
    MNU_NMERGEIA_SALES: "Vertrieb & Angebote",
    MNU_TEMA_13: "LLM & Vektor-RAG-Architekturen",
    MNU_TEMA_14: "Autonome KI-Agenten",
    MNU_TEMA_09: "Datenbank-Migrationen (Liquibase/Flyway)",
    MNU_TEMA_07: "Row-Level Security (RLS)",
    MNU_TEMA_04: "Infrastructure as Code (Terraform)",
    MNU_TEMA_17: "Kubernetes & Orchestrierung",
    MNU_TEMA_18: "Cloud Native & SRE",
    MNU_TEMA_05: "Zugriffskontrolle RBAC/ABAC/NGAC",
    MNU_TEMA_06: "Sentinel-NGAC Dynamische Menüs",
    MNU_TEMA_08: "DevSecOps & HashiCorp Vault",
    SUB_EXT_FRONT: "Frontend & Backend",
    MNU_TEMA_03: "Erweitertes Git & Rebase",
    SUB_TEMAS_ARCH: "Architektur & Muster",
    MNU_TEMA_10: "Saga-Muster & Verteilte ETL",
    MNU_TEMA_11: "Multi-Tenant SaaS-Architektur",
    MNU_TEMA_12: "Backend-Resilienz & Circuit Breaker",
    MNU_TEMA_15: "Clean & Hexagonale Architektur",
    MNU_TEMA_16: "DDD & Anforderungsanalyse",
    SUB_TEMAS_DATASCIENCE: "Data Science & KI-Engineering",
    SUB_TEMAS_BD: "Datenbanken & Optimierung",
    SUB_TEMAS_INFRA: "Container & Infrastruktur",
    SUB_EXT_SEC: "Cybersicherheit & NGAC-Governance"
  },
  pt: {
    MNU_NMERGEIA_LOGIN: "Entrar",
    MNU_NMERGEIA_REGISTER: "Registro & Licenciamento",
    MNU_NMERGEIA_LICENSES: "Gestão de Licenças",
    MNU_NMERGEIA_DIFF: "Visualizador Monaco Diff",
    MNU_NMERGEIA_SALES: "Vendas & Cotações",
    MNU_TEMA_13: "Arquiteturas LLM & RAG Vetorial",
    MNU_TEMA_14: "Agentes Autônomos de IA",
    MNU_TEMA_09: "Migrações de BD (Liquibase/Flyway)",
    MNU_TEMA_07: "Segurança a Nível de Linha (RLS)",
    MNU_TEMA_04: "Infraestrutura como Código (Terraform)",
    MNU_TEMA_17: "Kubernetes & Orquestração",
    MNU_TEMA_18: "Cloud Native & SRE",
    MNU_TEMA_05: "Controle de Acesso RBAC/ABAC/NGAC",
    MNU_TEMA_06: "Menus Dinâmicos Sentinel-NGAC",
    MNU_TEMA_08: "DevSecOps & HashiCorp Vault",
    SUB_EXT_FRONT: "Frontend & Backend",
    MNU_TEMA_03: "Git Avançado & Rebase",
    SUB_TEMAS_ARCH: "Arquitetura & Padrões",
    MNU_TEMA_10: "Padrão Saga & ETL Distribuído",
    MNU_TEMA_11: "SaaS Multi-tenant",
    MNU_TEMA_12: "Resiliência Backend & Circuit Breakers",
    MNU_TEMA_15: "Arquiteturas Limpas & Hexagonal",
    MNU_TEMA_16: "DDD & Levantamento de Requisitos",
    SUB_TEMAS_DATASCIENCE: "Data Science & Engenharia de IA",
    SUB_TEMAS_BD: "Bancos de Dados & Otimização",
    SUB_TEMAS_INFRA: "Contêineres & Infraestrutura",
    SUB_EXT_SEC: "Cibersegurança & Governança NGAC"
  },
  zh: {
    MNU_NMERGEIA_LOGIN: "登录",
    MNU_NMERGEIA_REGISTER: "注册与许可",
    MNU_NMERGEIA_LICENSES: "许可证管理",
    MNU_NMERGEIA_DIFF: "Monaco 代码差异查看器",
    MNU_NMERGEIA_SALES: "销售与报价",
    MNU_TEMA_13: "大语言模型与向量 RAG 架构",
    MNU_TEMA_14: "自主 AI 智能体",
    MNU_TEMA_09: "数据库迁移 (Liquibase/Flyway)",
    MNU_TEMA_07: "行级安全 (RLS)",
    MNU_TEMA_04: "基础架构即代码 (Terraform)",
    MNU_TEMA_17: "Kubernetes 与容器编排",
    MNU_TEMA_18: "云原生与 SRE 运维",
    MNU_TEMA_05: "访问控制 RBAC/ABAC/NGAC",
    MNU_TEMA_06: "Sentinel-NGAC 动态菜单",
    MNU_TEMA_08: "DevSecOps 与 HashiCorp Vault",
    SUB_EXT_FRONT: "前端与后端开发",
    MNU_TEMA_03: "高级 Git 与 Rebase 变基",
    SUB_TEMAS_ARCH: "软件架构与设计模式",
    MNU_TEMA_10: "Saga 事务模式与分布式 ETL",
    MNU_TEMA_11: "多租户 SaaS 架构",
    MNU_TEMA_12: "后端弹性与熔断器",
    MNU_TEMA_15: "整洁与六边形架构",
    MNU_TEMA_16: "DDD 领域驱动设计与需求分析",
    SUB_TEMAS_DATASCIENCE: "数据科学与 AI 工程",
    SUB_TEMAS_BD: "数据库与性能优化",
    SUB_TEMAS_INFRA: "容器与基础架构",
    SUB_EXT_SEC: "网络安全与 NGAC 治理"
  },
  ja: {
    MNU_NMERGEIA_LOGIN: "ログイン",
    MNU_NMERGEIA_REGISTER: "登録とライセンス",
    MNU_NMERGEIA_LICENSES: "ライセンス管理",
    MNU_NMERGEIA_DIFF: "Monaco 差分ビューア",
    MNU_NMERGEIA_SALES: "販売と見積もり",
    MNU_TEMA_13: "LLM & ベクター RAG アーキテクチャ",
    MNU_TEMA_14: "自律型 AI エージェント",
    MNU_TEMA_09: "データベースマイグレーション (Liquibase/Flyway)",
    MNU_TEMA_07: "行レベルセキュリティ (RLS)",
    MNU_TEMA_04: "Infrastructure as Code (Terraform)",
    MNU_TEMA_17: "Kubernetes & オーケストレーション",
    MNU_TEMA_18: "クラウドネイティブ & SRE",
    MNU_TEMA_05: "アクセス制御 RBAC/ABAC/NGAC",
    MNU_TEMA_06: "Sentinel-NGAC ダイナミックメニュー",
    MNU_TEMA_08: "DevSecOps & HashiCorp Vault",
    SUB_EXT_FRONT: "フロントエンド & バックエンド",
    MNU_TEMA_03: "高度な Git & リベース",
    SUB_TEMAS_ARCH: "アーキテクチャ & デザインパターン",
    MNU_TEMA_10: "Saga パターン & 分散 ETL",
    MNU_TEMA_11: "マルチテナント SaaS アーキテクチャ",
    MNU_TEMA_12: "バックエンドレジリエンス & サーキットブレーカー",
    MNU_TEMA_15: "クリーン & ヘキサゴナルアーキテクチャ",
    MNU_TEMA_16: "DDD & 要件定義",
    SUB_TEMAS_DATASCIENCE: "データサイエンス & AI エンジニアリング",
    SUB_TEMAS_BD: "データベース & パフォーマンス最適化",
    SUB_TEMAS_INFRA: "コンテナ & インフラストラクチャ",
    SUB_EXT_SEC: "サイバーセキュリティ & NGAC ガバナンス"
  }
};

const languages = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];

languages.forEach(lang => {
  const jsonPath = path.join(localesDir, `${lang}/translation.json`);
  if (!fs.existsSync(jsonPath)) return;

  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const dict = menuTranslations[lang] || {};

  Object.keys(dict).forEach(code => {
    json[code] = dict[code];
  });

  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2), 'utf8');
  console.log(`✅ Inyectadas ${Object.keys(dict).length} traducciones de menú en [${lang.toUpperCase()}]`);
});

console.log('\n🎉 Sincronización total del menú lateral finalizada con éxito en los 7 idiomas.');
