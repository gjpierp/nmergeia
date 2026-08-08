const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'public', 'docs');
const sourceLang = 'es';
const targetLangs = ['en', 'pt', 'fr', 'de', 'zh', 'ja'];

const sourcePath = path.join(baseDir, sourceLang);
const files = fs.readdirSync(sourcePath).filter(f => f.endsWith('.md'));

console.log(`🔍 Sincronizando ${files.length} archivos Markdown desde public/docs/es hacia ${targetLangs.join(', ')}...`);

let copiedTotal = 0;

targetLangs.forEach(lang => {
  const langPath = path.join(baseDir, lang);
  if (!fs.existsSync(langPath)) {
    fs.mkdirSync(langPath, { recursive: true });
  }

  files.forEach(file => {
    const srcFile = path.join(sourcePath, file);
    const destFile = path.join(langPath, file);
    
    if (!fs.existsSync(destFile)) {
      fs.copyFileSync(srcFile, destFile);
      copiedTotal++;
    }
  });
});

console.log(`✅ Sincronización de carpetas de idioma de la biblioteca completada. ${copiedTotal} archivos copiados.`);
