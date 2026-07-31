const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'public', 'locales');
const newKeys = {
  es: {
    "MNU_NMERGEIA_LANDING": "Inicio",
    "MNU_NMERGEIA_FEATURES": "Características",
    "MNU_NMERGEIA_PRICING": "Planes y Precios",
    "MNU_NMERGEIA_DOCS": "Documentación",
    "MNU_NMERGEIA_FAQ": "Preguntas Frecuentes",
    "CAT_NMERGEIA_N2_AUTH": "Autenticación",
    "CAT_NMERGEIA_N3_WORKSPACE": "Plataforma Principal",
    "CAT_NMERGEIA_N4_COURSES": "Biblioteca Técnica",
    "CAT_NMERGEIA_N5_ASSETS": "Recursos y APIs"
  },
  en: {
    "MNU_NMERGEIA_LANDING": "Home",
    "MNU_NMERGEIA_FEATURES": "Features",
    "MNU_NMERGEIA_PRICING": "Pricing",
    "MNU_NMERGEIA_DOCS": "Documentation",
    "MNU_NMERGEIA_FAQ": "FAQ",
    "CAT_NMERGEIA_N2_AUTH": "Authentication",
    "CAT_NMERGEIA_N3_WORKSPACE": "Main Platform",
    "CAT_NMERGEIA_N4_COURSES": "Technical Library",
    "CAT_NMERGEIA_N5_ASSETS": "Resources & APIs"
  },
  fr: {
    "MNU_NMERGEIA_LANDING": "Accueil",
    "MNU_NMERGEIA_FEATURES": "Fonctionnalités",
    "MNU_NMERGEIA_PRICING": "Tarifs",
    "MNU_NMERGEIA_DOCS": "Documentation",
    "MNU_NMERGEIA_FAQ": "FAQ",
    "CAT_NMERGEIA_N2_AUTH": "Authentification",
    "CAT_NMERGEIA_N3_WORKSPACE": "Plateforme Principale",
    "CAT_NMERGEIA_N4_COURSES": "Bibliothèque Technique",
    "CAT_NMERGEIA_N5_ASSETS": "Ressources et APIs"
  },
  pt: {
    "MNU_NMERGEIA_LANDING": "Início",
    "MNU_NMERGEIA_FEATURES": "Funcionalidades",
    "MNU_NMERGEIA_PRICING": "Preços",
    "MNU_NMERGEIA_DOCS": "Documentação",
    "MNU_NMERGEIA_FAQ": "Perguntas Frequentes",
    "CAT_NMERGEIA_N2_AUTH": "Autenticação",
    "CAT_NMERGEIA_N3_WORKSPACE": "Plataforma Principal",
    "CAT_NMERGEIA_N4_COURSES": "Biblioteca Técnica",
    "CAT_NMERGEIA_N5_ASSETS": "Recursos e APIs"
  },
  de: {
    "MNU_NMERGEIA_LANDING": "Startseite",
    "MNU_NMERGEIA_FEATURES": "Eigenschaften",
    "MNU_NMERGEIA_PRICING": "Preise",
    "MNU_NMERGEIA_DOCS": "Dokumentation",
    "MNU_NMERGEIA_FAQ": "FAQ",
    "CAT_NMERGEIA_N2_AUTH": "Authentifizierung",
    "CAT_NMERGEIA_N3_WORKSPACE": "Hauptplattform",
    "CAT_NMERGEIA_N4_COURSES": "Technische Bibliothek",
    "CAT_NMERGEIA_N5_ASSETS": "Ressourcen und APIs"
  },
  ja: {
    "MNU_NMERGEIA_LANDING": "ホーム",
    "MNU_NMERGEIA_FEATURES": "特徴",
    "MNU_NMERGEIA_PRICING": "価格",
    "MNU_NMERGEIA_DOCS": "ドキュメント",
    "MNU_NMERGEIA_FAQ": "よくある質問",
    "CAT_NMERGEIA_N2_AUTH": "認証",
    "CAT_NMERGEIA_N3_WORKSPACE": "メインプラットフォーム",
    "CAT_NMERGEIA_N4_COURSES": "テクニカルライブラリ",
    "CAT_NMERGEIA_N5_ASSETS": "リソースとAPI"
  },
  zh: {
    "MNU_NMERGEIA_LANDING": "首页",
    "MNU_NMERGEIA_FEATURES": "功能",
    "MNU_NMERGEIA_PRICING": "价格",
    "MNU_NMERGEIA_DOCS": "文档",
    "MNU_NMERGEIA_FAQ": "常见问题",
    "CAT_NMERGEIA_N2_AUTH": "认证",
    "CAT_NMERGEIA_N3_WORKSPACE": "主平台",
    "CAT_NMERGEIA_N4_COURSES": "技术文库",
    "CAT_NMERGEIA_N5_ASSETS": "资源与API"
  }
};

fs.readdirSync(localesPath).forEach(lang => {
  const jsonPath = path.join(localesPath, lang, 'translation.json');
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const updates = newKeys[lang];
    if (updates) {
      Object.assign(data, updates);
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Updated ${lang}/translation.json`);
    }
  }
});
