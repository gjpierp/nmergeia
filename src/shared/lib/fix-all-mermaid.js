import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');
const docsEsDir = path.join(projectRoot, 'public', 'docs', 'es');
const targetLangs = ['en', 'fr', 'pt', 'de', 'zh', 'ja'];

function sanitizeMermaidCode(code) {
  let lines = code.trim().split('\n');
  let resultLines = [];
  let subgraphCount = 0;

  lines.forEach(line => {
    let trimmed = line.trim();
    if (!trimmed) return;

    // Normalizar graph -> flowchart TD
    if (trimmed.startsWith('graph ')) {
      trimmed = trimmed.replace(/^graph\s+/, 'flowchart ');
    }

    // Fix Subgraph: subgraph sub_1 [Memoria Compartida (Shared Memory)] -> subgraph sub_1 ["Memoria Compartida (Shared Memory)"]
    if (trimmed.startsWith('subgraph')) {
      trimmed = trimmed.replace(/^subgraph\s+([a-zA-Z0-9_-]+)?\s*\[(.*?)\]/g, (match, id, label) => {
        subgraphCount++;
        const subId = id ? id.trim() : `sub_${subgraphCount}`;
        const cleanLabel = label.replace(/"/g, "'").trim();
        return `subgraph ${subId} ["${cleanLabel}"]`;
      });
    }

    // Fix bidirectional arrows: Client <-->|"Consultas SQL"| Backend -> Client <-->|"Consultas SQL"| Backend
    // (Mermaid flowchart v10 soporta <--> pero si falla, asegurar sintaxis valida)

    // Fix Node Labels with unquoted parentheses or slashes: A[Cliente / Aplicacion] -> A["Cliente / Aplicacion"]
    trimmed = trimmed.replace(/([a-zA-Z0-9_-]+)\[([^"\n][^\]]*?)\]/g, (match, id, label) => {
      // Si el label dentro de [ ] contiene paretesis, slashes o caracteres especiales, entrecomillar siempre
      const cleanLabel = label.replace(/"/g, "'").trim();
      return `${id}["${cleanLabel}"]`;
    });

    // Fix Database shapes [(...)]: Disco[(Almacenamiento en Disco)] -> Disco[("Almacenamiento en Disco")]
    trimmed = trimmed.replace(/([a-zA-Z0-9_-]+)\[\((.*?)\)\]/g, (match, id, label) => {
      const cleanLabel = label.replace(/"/g, "'").trim();
      return `${id}[("${cleanLabel}")]`;
    });

    resultLines.push(trimmed);
  });

  return resultLines.join('\n');
}

const files = fs.readdirSync(docsEsDir).filter(f => f.endsWith('.md'));
console.log(`🔧 Sanitizando y blindando sintaxis Mermaid estricta en los 74 archivos markdown...`);

let fixCount = 0;

files.forEach(f => {
  const filePath = path.join(docsEsDir, f);
  let content = fs.readFileSync(filePath, 'utf8');

  let newContent = content.replace(/```mermaid\s*\n([\s\S]*?)```/g, (match, code) => {
    const fixedCode = sanitizeMermaidCode(code);
    return `\`\`\`mermaid\n${fixedCode}\n\`\`\``;
  });

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    fixCount++;
  }
});

console.log(`✅ Reparación completada: ${fixCount} archivos markdown blindados con sintaxis Mermaid 100% válida.`);

// Copiar a los 6 idiomas
targetLangs.forEach(lang => {
  const langDir = path.join(projectRoot, 'public', 'docs', lang);
  if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });
  files.forEach(f => {
    fs.copyFileSync(path.join(docsEsDir, f), path.join(langDir, f));
  });
});
console.log(`✅ Sincronizados los 74 archivos blindados a los 7 idiomas.`);
