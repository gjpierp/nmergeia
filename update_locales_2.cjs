const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'public', 'locales');
const newKeys = {
  es: {
    "MNU_TEMA_POSTGRES": "Optimización PostgreSQL",
    "MNU_TEMA_02": "Docker Multi-stage"
  },
  en: {
    "MNU_TEMA_POSTGRES": "PostgreSQL Optimization",
    "MNU_TEMA_02": "Docker Multi-stage"
  },
  fr: {
    "MNU_TEMA_POSTGRES": "Optimisation PostgreSQL",
    "MNU_TEMA_02": "Docker Multi-stage"
  },
  pt: {
    "MNU_TEMA_POSTGRES": "Otimização PostgreSQL",
    "MNU_TEMA_02": "Docker Multi-stage"
  },
  de: {
    "MNU_TEMA_POSTGRES": "PostgreSQL-Optimierung",
    "MNU_TEMA_02": "Docker Multi-stage"
  },
  ja: {
    "MNU_TEMA_POSTGRES": "PostgreSQLの最適化",
    "MNU_TEMA_02": "Docker Multi-stage"
  },
  zh: {
    "MNU_TEMA_POSTGRES": "PostgreSQL优化",
    "MNU_TEMA_02": "Docker Multi-stage"
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
