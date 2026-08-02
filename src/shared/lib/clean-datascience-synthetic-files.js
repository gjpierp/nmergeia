import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');

const LANGUAGES = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];
const SUBTOPICS = ['pyspark', 'kafka', 'deltalake', 'mlops', 'polars'];
const SUFFIXES = ['inicial', 'basico', 'medio', 'avanzado', 'experto', 'optimizaciones'];

console.log("🧹 Eliminando archivos de niveles sintéticos duplicados de Data Science...");

let removedCount = 0;

LANGUAGES.forEach(lang => {
  const langDir = path.join(projectRoot, 'public', 'docs', lang);
  if (!fs.existsSync(langDir)) return;

  SUBTOPICS.forEach(sub => {
    SUFFIXES.forEach(suf => {
      const fileName = `datascience_${sub}_${suf}.md`;
      const filePath = path.join(langDir, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        removedCount++;
      }
    });
  });

  // También limpiar datascience_inicial.md, etc. si fueron sintetizados sin contenido diferenciado
  SUFFIXES.forEach(suf => {
    const fileName = `datascience_${suf}.md`;
    const filePath = path.join(langDir, fileName);
    if (fs.existsSync(filePath)) {
      // Si datascience.md existe y es el archivo principal de Data Science, eliminamos los niveles repetidos
      if (fs.existsSync(path.join(langDir, 'datascience.md'))) {
        fs.unlinkSync(filePath);
        removedCount++;
      }
    }
  });
});

console.log(`✅ ¡Eliminados exitosamente ${removedCount} archivos sintéticos duplicados de la Biblioteca Técnica!`);
