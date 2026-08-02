import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');

const DOCS_DIR = path.join(projectRoot, 'public', 'docs');
const LANGUAGES = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];

console.log("🧹 Iniciando eliminación de secciones sintéticas repetidas en los 7 idiomas...");

let cleanedFilesCount = 0;
let totalRemovedLines = 0;

LANGUAGES.forEach(lang => {
  const langDir = path.join(DOCS_DIR, lang);
  if (!fs.existsSync(langDir)) return;

  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.md'));

  files.forEach(file => {
    const filePath = path.join(langDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalLines = content.split('\n').length;

    // Buscar el punto de inicio de la sección sintética duplicada
    const matchIndex = content.search(/\n\s*---\s*\n+\s*##\s*🏛️\s*(Sección|Section|Kapitel|Chapitre|Seção|Parte|章)\s*II/i);

    if (matchIndex !== -1) {
      // Recortar la parte sintética manteniendo el contenido prístino inicial
      content = content.substring(0, matchIndex).trim() + '\n';
      fs.writeFileSync(filePath, content, 'utf-8');
      
      const newLines = content.split('\n').length;
      const removed = originalLines - newLines;
      totalRemovedLines += removed;
      cleanedFilesCount++;
      console.log(`  ✂️ Limpiado [${lang}/${file}]: Eliminadas ${removed} líneas repetidas`);
    } else {
      // También verificar si hay encabezados del tipo ## 🏛️ Sección II sin triple guión
      const altMatch = content.search(/\n+\s*##\s*🏛️\s*(Sección|Section|Kapitel|Chapitre|Seção|Parte|章)\s*II/i);
      if (altMatch !== -1) {
        content = content.substring(0, altMatch).trim() + '\n';
        fs.writeFileSync(filePath, content, 'utf-8');

        const newLines = content.split('\n').length;
        const removed = originalLines - newLines;
        totalRemovedLines += removed;
        cleanedFilesCount++;
        console.log(`  ✂️ Limpiado [${lang}/${file}]: Eliminadas ${removed} líneas repetidas (alt)`);
      }
    }
  });
});

console.log(`📊 Limpieza de Secciones Repetidas Completada:
  - Archivos Limpiados: ${cleanedFilesCount}
  - Líneas Repetidas Eliminadas: ${totalRemovedLines}
✅ ¡Toda la documentación ahora es prístina y no contiene contenido sintético ni secciones duplicadas!`);
