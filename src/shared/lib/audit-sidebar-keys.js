import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sidebarPath = path.join(__dirname, '../ui/Sidebar.jsx');
const localesDir = path.join(__dirname, '../../../public/locales');
const languages = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];

const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// Extract code and label from Sidebar.jsx
const menuNodes = [];
const codeRegex = /code:\s*['"]([^'"]+)['"],\s*label:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = codeRegex.exec(sidebarContent)) !== null) {
  menuNodes.push({ code: match[1], defaultLabel: match[2] });
}

console.log(`📌 Extraídos ${menuNodes.length} nodos del Menú Lateral desde Sidebar.jsx:\n`);

languages.forEach(lang => {
  const jsonPath = path.join(localesDir, `${lang}/translation.json`);
  if (!fs.existsSync(jsonPath)) {
    console.log(`❌ Archivo faltante: ${lang}/translation.json`);
    return;
  }
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const missingInLang = [];
  menuNodes.forEach(node => {
    if (!(node.code in json)) {
      missingInLang.push(node);
    }
  });

  if (missingInLang.length === 0) {
    console.log(`✅ Idioma [${lang.toUpperCase()}]: 100% de los ${menuNodes.length} ítems del Menú traducidos.`);
  } else {
    console.log(`⚠️ Idioma [${lang.toUpperCase()}]: Faltan ${missingInLang.length} traducciones de menú:`);
    missingInLang.forEach(m => console.log(`   - ${m.code} ("${m.defaultLabel}")`));
  }
  console.log('');
});
