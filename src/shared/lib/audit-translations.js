import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const languages = ['en', 'de', 'fr', 'pt', 'zh', 'ja'];
const docsDir = path.join(__dirname, '../../../public/docs');
const esDir = path.join(docsDir, 'es');

const esFiles = fs.readdirSync(esDir).filter(f => f.endsWith('.md'));

console.log(`🌐 Auditoría Global de Traducciones sobre ${esFiles.length} archivos de referencia [es]...\n`);

const missingFiles = {};
const untranslatedFiles = {};

// Spanish indicator keywords that should NOT appear in translated files (except proper nouns/code)
const spanishKeywords = [
  "La Ciencia de Datos", "Resumen Ejecutivo", "Todos los derechos reservados",
  "Arquitectura de Memoria", "Procesos de Fondo", "Entorno de Producción",
  "Implementación Profesional", "Puntos Clave de este Nivel", "Estructura Interna"
];

languages.forEach(lang => {
  missingFiles[lang] = [];
  untranslatedFiles[lang] = [];

  const langDir = path.join(docsDir, lang);
  if (!fs.existsSync(langDir)) {
    missingFiles[lang] = [...esFiles];
    return;
  }

  const currentFiles = new Set(fs.readdirSync(langDir).filter(f => f.endsWith('.md')));

  esFiles.forEach(file => {
    if (!currentFiles.has(file)) {
      missingFiles[lang].push(file);
    } else {
      const content = fs.readFileSync(path.join(langDir, file), 'utf8');
      const hasSpanish = spanishKeywords.some(kw => content.includes(kw));
      if (hasSpanish) {
        untranslatedFiles[lang].push(file);
      }
    }
  });
});

console.log("📌 INFORME DE ARCHIVOS FALTANTES Y TEXTO NO TRADUCIDO:\n");

languages.forEach(lang => {
  console.log(`=== Idioma: [${lang.toUpperCase()}] ===`);
  console.log(`❌ Archivos Faltantes: ${missingFiles[lang].length}`);
  if (missingFiles[lang].length > 0) {
    console.log(`   - Ejemplos: ${missingFiles[lang].slice(0, 5).join(', ')}`);
  }
  console.log(`⚠️ Archivos con Texto en Español no Traducido: ${untranslatedFiles[lang].length}`);
  if (untranslatedFiles[lang].length > 0) {
    console.log(`   - Ejemplos: ${untranslatedFiles[lang].slice(0, 5).join(', ')}`);
  }
  console.log('');
});
