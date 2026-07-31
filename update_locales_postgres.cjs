const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'public', 'locales');
const newKeys = {
  es: {
    "MNU_TEMA_POSTGRES": "PostgreSQL",
  },
  en: {
    "MNU_TEMA_POSTGRES": "PostgreSQL",
  },
  fr: {
    "MNU_TEMA_POSTGRES": "PostgreSQL",
  },
  pt: {
    "MNU_TEMA_POSTGRES": "PostgreSQL",
  },
  de: {
    "MNU_TEMA_POSTGRES": "PostgreSQL",
  },
  ja: {
    "MNU_TEMA_POSTGRES": "PostgreSQL",
  },
  zh: {
    "MNU_TEMA_POSTGRES": "PostgreSQL",
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
