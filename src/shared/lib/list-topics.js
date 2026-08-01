import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');
const docsEsDir = path.join(projectRoot, 'public', 'docs', 'es');

const files = fs.readdirSync(docsEsDir).filter(f => f.endsWith('.md')).sort();

files.forEach((f, idx) => {
  const content = fs.readFileSync(path.join(docsEsDir, f), 'utf8');
  const match = content.match(/^#\s+(.+)$/m);
  const title = match ? match[1].replace(/^[^\wáéíóúñÁÉÍÓÚÑ]+/, '').trim() : f;
  console.log(`${(idx + 1).toString().padStart(2, '0')}. ${title} [File: ${f}]`);
});
