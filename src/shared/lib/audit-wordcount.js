import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');
const docsEsDir = path.join(projectRoot, 'public', 'docs', 'es');

function countWords(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

if (fs.existsSync(docsEsDir)) {
  const files = fs.readdirSync(docsEsDir).filter(f => f.endsWith('.md'));
  console.log(`=== AUDITORÍA DE PALABRAS EN TEMAS TÉCNICOS EN ESPAÑOL (public/docs/es/) ===\n`);
  let totalFiles = 0;
  let passingFiles = 0;
  let failingFiles = 0;

  files.sort().forEach(f => {
    totalFiles++;
    const content = fs.readFileSync(path.join(docsEsDir, f), 'utf8');
    const words = countWords(content);
    const passed = words >= 1200;
    if (passed) passingFiles++; else failingFiles++;
    const status = passed ? '✅ OK (>1200w)' : `❌ BAJO (${words}w - FALTAN ${1200 - words}w)`;
    console.log(`${f.padEnd(35)} -> ${words} palabras [${status}]`);
  });

  console.log(`\n======================================================================`);
  console.log(`RESUMEN: ${totalFiles} temas auditados | ${passingFiles} superan 1,200 palabras | ${failingFiles} están por debajo.`);
  console.log(`======================================================================`);
} else {
  console.log(`Directorio no encontrado: ${docsEsDir}`);
}
