import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../../../public/locales');
const languages = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];

const esJsonPath = path.join(localesDir, 'es/translation.json');
const esKeys = Object.keys(JSON.parse(fs.readFileSync(esJsonPath, 'utf8')));

console.log(`🌐 Auditando ${esKeys.length} llaves de traducción UI en public/locales/...\n`);

languages.forEach(lang => {
  const jsonPath = path.join(localesDir, `${lang}/translation.json`);
  if (!fs.existsSync(jsonPath)) {
    console.log(`❌ Idioma [${lang.toUpperCase()}]: Falta archivo translation.json`);
    return;
  }
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const currentKeys = Object.keys(json);
  const missingKeys = esKeys.filter(k => !(k in json));

  if (missingKeys.length === 0) {
    console.log(`✅ Idioma [${lang.toUpperCase()}]: 100% Perfecto (${currentKeys.length} llaves traducidas, 0 faltantes).`);
  } else {
    console.log(`⚠️ Idioma [${lang.toUpperCase()}]: Falta(n) ${missingKeys.length} llaves de traducción.`);
  }
});
