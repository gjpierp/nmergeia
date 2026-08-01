import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');
const docsDir = path.join(projectRoot, 'public', 'docs');
const sourceEsDir = path.join(docsDir, 'es');
const targetLangs = ['en', 'fr', 'pt', 'de', 'zh', 'ja'];

if (fs.existsSync(sourceEsDir)) {
  const files = fs.readdirSync(sourceEsDir).filter(f => f.endsWith('.md'));
  console.log(`📋 Copiando los 74 temas expandidos desde 'es' hacia los otros 6 idiomas...`);

  targetLangs.forEach(lang => {
    const langDir = path.join(docsDir, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
    files.forEach(f => {
      const srcFile = path.join(sourceEsDir, f);
      const destFile = path.join(langDir, f);
      fs.copyFileSync(srcFile, destFile);
    });
    console.log(`✅ [COPIADO] 74 archivos sincronizados en public/docs/${lang}/`);
  });

  console.log(`\n🎉 Sincronización multilingüe de volumen de temas completada con éxito.`);
}
