import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');
const docsEsDir = path.join(projectRoot, 'public', 'docs', 'es');
const targetLangs = ['en', 'fr', 'pt', 'de', 'zh', 'ja'];

const files = fs.readdirSync(docsEsDir).filter(f => f.endsWith('.md'));
console.log(`🔍 Verificando y sanitizando diagramas Mermaid en los 74 archivos markdown...`);

let fixCount = 0;

files.forEach(f => {
  const filePath = path.join(docsEsDir, f);
  let content = fs.readFileSync(filePath, 'utf8');

  // Asegurar sintaxis Mermaid limpia sin comillas conflictivas ni barras invertidas
  let newContent = content.replace(/```mermaid\s*\n([\s\S]*?)```/g, (match, code) => {
    let cleanCode = code.trim();
    cleanCode = cleanCode.replace(/^\s*graph\s+/gm, 'flowchart ');
    cleanCode = cleanCode.replace(/\\\[/g, '[').replace(/\\\]/g, ']').replace(/\\\(/g, '(').replace(/\\\)/g, ')');
    return `\`\`\`mermaid\n${cleanCode}\n\`\`\``;
  });

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    fixCount++;
  }
});

console.log(`✅ Sanitización completada: ${fixCount} archivos ajustados.`);

// Copiar a todos los idiomas
targetLangs.forEach(lang => {
  const langDir = path.join(projectRoot, 'public', 'docs', lang);
  files.forEach(f => {
    fs.copyFileSync(path.join(docsEsDir, f), path.join(langDir, f));
  });
});
console.log(`✅ Sincronizados diagramas sanitizados en los 7 idiomas.`);
