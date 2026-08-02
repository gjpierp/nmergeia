import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const languages = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];
const docsDir = path.join(__dirname, '../../../public/docs');

console.log('🔍 Auditando y corrigiendo sintaxis de diagramas Mermaid en todas las guías...\n');

let fixedCount = 0;

languages.forEach(lang => {
  const langDir = path.join(docsDir, lang);
  if (!fs.existsSync(langDir)) return;

  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.md'));

  files.forEach(file => {
    const filePath = path.join(langDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Fix parentheses inside edge link labels: e.g. -->|5. Collect()| -> -->|5. Ejecución Collect|
    content = content.replace(/-->\|([^|]*?)\((.*?)\)([^|]*?)\|/g, (match, p1, p2, p3) => {
      const cleanInside = p2 ? ` ${p2} ` : '';
      return `-->|${p1.trim()}${cleanInside}${p3.trim()}|`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`🛠️ Corregido Mermaid en [${lang}/${file}]`);
      fixedCount++;
    }
  });
});

console.log(`\n🎉 Corrección de diagramas Mermaid completada. Archivos corregidos: ${fixedCount}`);
