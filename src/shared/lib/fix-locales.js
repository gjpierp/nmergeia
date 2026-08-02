import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../../../public/locales');
const languages = ['de', 'fr', 'pt', 'zh', 'ja'];

const esJsonPath = path.join(localesDir, 'es/translation.json');
const esJson = JSON.parse(fs.readFileSync(esJsonPath, 'utf8'));

languages.forEach(lang => {
  const jsonPath = path.join(localesDir, `${lang}/translation.json`);
  if (!fs.existsSync(jsonPath)) return;

  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  Object.keys(esJson).forEach(key => {
    if (!(key in json)) {
      json[key] = esJson[key];
      console.log(`➕ Agregada llave faltante [${key}] en [${lang}]`);
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2), 'utf8');
});

console.log('✅ Archivos de traducción UI igualados al 100%.');
