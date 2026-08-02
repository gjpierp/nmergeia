import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');

const DOCS_DIR = path.join(projectRoot, 'public', 'docs');
const LANGUAGES = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];

const ngacFiles = [
  'ngac_inicial.md',
  'ngac_basico.md',
  'ngac_medio.md',
  'ngac_avanzado.md',
  'ngac_experto.md',
  'ngac_maestro.md'
];

console.log("🛡️ Consolidando Gobernanza Sentinel-NGAC en una única guía sin pestañas...");

LANGUAGES.forEach(lang => {
  const langDir = path.join(DOCS_DIR, lang);
  if (!fs.existsSync(langDir)) return;

  let combinedContent = [];

  ngacFiles.forEach(file => {
    const filePath = path.join(langDir, file);
    if (fs.existsSync(filePath)) {
      let fileText = fs.readFileSync(filePath, 'utf-8').trim();
      if (fileText) {
        combinedContent.push(fileText);
      }
    }
  });

  if (combinedContent.length > 0) {
    const singleNgacFile = path.join(langDir, 'ngac.md');
    fs.writeFileSync(singleNgacFile, combinedContent.join('\n\n---\n\n'), 'utf-8');
    console.log(`  ✅ Generado [${lang}/ngac.md] consolidado`);
  }
});

console.log("🎉 Consolidación de NGAC completada exitosamente!");
