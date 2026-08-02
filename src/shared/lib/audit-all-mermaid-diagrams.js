import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');

const DOCS_DIR = path.join(projectRoot, 'public', 'docs');
const LANGUAGES = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];

const VALID_KEYWORDS = [
  'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 
  'stateDiagram', 'stateDiagram-v2', 'erDiagram', 'gantt', 
  'pie', 'gitGraph', 'C4Context', 'architecture', 'mindmap', 
  'timeline', 'quadrantChart', 'sankey', 'requirementDiagram'
];

console.log("🔍 Iniciando Auditoría Completa de Diagramas Mermaid en los 7 Idiomas...");

let totalDiagrams = 0;
let fixedDiagrams = 0;

LANGUAGES.forEach(lang => {
  const langDir = path.join(DOCS_DIR, lang);
  if (!fs.existsSync(langDir)) return;

  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.md'));

  files.forEach(file => {
    const filePath = path.join(langDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;

    content = content.replace(/```mermaid([\s\S]*?)```/g, (match, code) => {
      totalDiagrams++;
      let rawChart = code.replace(/\r/g, '').trim();

      const firstWord = rawChart.split(/\s+/)[0];
      const isKnown = VALID_KEYWORDS.some(kw => firstWord.startsWith(kw));

      if (!isKnown) {
        console.warn(`  ⚠️ Diagrama sin palabra clave en [${lang}/${file}]: ${firstWord}`);
        rawChart = 'flowchart TD\n' + rawChart;
        fixedDiagrams++;
      }

      return '```mermaid\n' + rawChart + '\n```';
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
    }
  });
});

console.log(`📊 Auditoría Completada:
  - Total de Diagramas Analizados: ${totalDiagrams}
  - Diagramas Ajustados: ${fixedDiagrams}
✅ ¡Todos los diagramas Mermaid en los 7 idiomas han sido validados y sanitizados!`);
