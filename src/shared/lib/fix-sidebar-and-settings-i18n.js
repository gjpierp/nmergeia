import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');

const LOCALES_DIR = path.join(projectRoot, 'public', 'locales');
const LANGUAGES = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];

const EXTRA_TRANSLATIONS = {
  es: {
    nav_settings: "Configuración",
    CAT_NMERGEIA_N4_TEMAS: "Biblioteca Técnica",
    CAT_NMERGEIA_GUIAS: "Biblioteca Técnica & Especialidades",
    SUB_TEMAS_DATASCIENCE: "Data Science y IA",
    SUB_TEMAS_BD: "Bases de Datos y Optimización",
    SUB_TEMAS_INFRA: "Contenedores e Infraestructura",
    SUB_EXT_SEC: "Ciberseguridad y Gobernanza NGAC"
  },
  en: {
    nav_settings: "Settings",
    CAT_NMERGEIA_N4_TEMAS: "Technical Library",
    CAT_NMERGEIA_GUIAS: "Technical Library & Specialties",
    SUB_TEMAS_DATASCIENCE: "Data Science & AI",
    SUB_TEMAS_BD: "Databases & Optimization",
    SUB_TEMAS_INFRA: "Containers & Infrastructure",
    SUB_EXT_SEC: "Cybersecurity & NGAC Governance"
  },
  de: {
    nav_settings: "Einstellungen",
    CAT_NMERGEIA_N4_TEMAS: "Technische Bibliothek",
    CAT_NMERGEIA_GUIAS: "Technische Bibliothek & Spezialgebiete",
    SUB_TEMAS_DATASCIENCE: "Data Science & KI",
    SUB_TEMAS_BD: "Datenbanken & Optimierung",
    SUB_TEMAS_INFRA: "Container & Infrastruktur",
    SUB_EXT_SEC: "Cybersicherheit & NGAC-Governance"
  },
  fr: {
    nav_settings: "Paramètres",
    CAT_NMERGEIA_N4_TEMAS: "Bibliothèque Technique",
    CAT_NMERGEIA_GUIAS: "Bibliothèque Technique & Spécialités",
    SUB_TEMAS_DATASCIENCE: "Data Science & IA",
    SUB_TEMAS_BD: "Bases de données & Optimisation",
    SUB_TEMAS_INFRA: "Conteneurs & Infrastructure",
    SUB_EXT_SEC: "Cybersécurité & Gouvernance NGAC"
  },
  pt: {
    nav_settings: "Configurações",
    CAT_NMERGEIA_N4_TEMAS: "Biblioteca Técnica",
    CAT_NMERGEIA_GUIAS: "Biblioteca Técnica & Especialidades",
    SUB_TEMAS_DATASCIENCE: "Data Science & IA",
    SUB_TEMAS_BD: "Bancos de Dados & Otimização",
    SUB_TEMAS_INFRA: "Contêineres & Infraestrutura",
    SUB_EXT_SEC: "Cibersegurança & Governança NGAC"
  },
  zh: {
    nav_settings: "设置",
    CAT_NMERGEIA_N4_TEMAS: "技术文档",
    CAT_NMERGEIA_GUIAS: "技术图解与专业指南",
    SUB_TEMAS_DATASCIENCE: "数据科学与 AI",
    SUB_TEMAS_BD: "数据库与性能优化",
    SUB_TEMAS_INFRA: "容器与基础设施",
    SUB_EXT_SEC: "网络安全与 NGAC 治理"
  },
  ja: {
    nav_settings: "設定",
    CAT_NMERGEIA_N4_TEMAS: "技術ライブラリ",
    CAT_NMERGEIA_GUIAS: "技術ライブラリ＆専門分野",
    SUB_TEMAS_DATASCIENCE: "データサイエンス＆AI",
    SUB_TEMAS_BD: "データベース＆最適化",
    SUB_TEMAS_INFRA: "コンテナ＆インフラ",
    SUB_EXT_SEC: "サイバーセキュリティ＆NGACガバナンス"
  }
};

console.log("🛠️ Inyectando claves faltantes de 'Configuración' y 'Biblioteca Técnica' en todos los idiomas...");

LANGUAGES.forEach(lang => {
  const jsonPath = path.join(LOCALES_DIR, lang, 'translation.json');
  if (!fs.existsSync(jsonPath)) return;

  try {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(raw);

    const additions = EXTRA_TRANSLATIONS[lang] || {};
    Object.assign(data, additions);

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`  ✅ [${lang}] Actualizado con nav_settings, CAT_NMERGEIA_N4_TEMAS, SUB_TEMAS_*`);
  } catch (err) {
    console.error(`  ❌ Error actualizando ${jsonPath}:`, err.message);
  }
});

console.log("✨ ¡Inyección de claves i18n para Menú y Configuración completada!");
