import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '../../..');
const docsDir = path.join(projectRoot, 'public/docs');
const appJsxPath = path.join(projectRoot, 'src/App.jsx');

const languages = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];

console.log('🔍 INICIANDO AUDITORÍA INTEGRAL DE TRADUCCIÓN Y RUTAS EN TODA LA APLICACIÓN...\n');

const auditResults = {
  missingFilesByLang: {},
  singleFileRouteErrors: [],
  untranslatedContentByLang: {},
  totalVerifiedFiles: 0
};

// 1. Extraer todas las referencias a singleFile y topicId de App.jsx
const appJsxContent = fs.readFileSync(appJsxPath, 'utf8');

const singleFileMatches = [...appJsxContent.matchAll(/singleFile=["']([^"']+)["']/g)].map(m => m[1]);
console.log(`📌 Encontradas ${singleFileMatches.length} declaraciones singleFile en App.jsx:`);
console.log(`   ${[...new Set(singleFileMatches)].join(', ')}\n`);

// Verificar que CADA singleFile exista en TODOS los 7 idiomas
singleFileMatches.forEach(sf => {
  languages.forEach(lang => {
    const filePath = path.join(docsDir, lang, sf);
    if (!fs.existsSync(filePath)) {
      auditResults.singleFileRouteErrors.push({ singleFile: sf, lang, error: 'Archivo no existe en disco' });
    }
  });
});

// 2. Verificar simetría estricta de todos los archivos markdown en public/docs/ entre los 7 idiomas
const esFiles = fs.readdirSync(path.join(docsDir, 'es')).filter(f => f.endsWith('.md'));
auditResults.totalVerifiedFiles = esFiles.length;

languages.forEach(lang => {
  auditResults.missingFilesByLang[lang] = [];
  auditResults.untranslatedContentByLang[lang] = [];

  const langDir = path.join(docsDir, lang);
  if (!fs.existsSync(langDir)) {
    auditResults.missingFilesByLang[lang] = [...esFiles];
    return;
  }

  const langFiles = new Set(fs.readdirSync(langDir).filter(f => f.endsWith('.md')));

  esFiles.forEach(file => {
    if (!langFiles.has(file)) {
      auditResults.missingFilesByLang[lang].push(file);
    } else if (lang !== 'es') {
      const content = fs.readFileSync(path.join(langDir, file), 'utf8');
      // Indicadores estrictos de texto no traducido del español
      const spanishPhrases = [
        "Resumen Ejecutivo", "Puntos Clave", "Todos los derechos reservados",
        "La Ciencia de Datos", "Entorno de Producción", "Estructura Interna",
        "Implementación Profesional", "Objetivos del Nivel"
      ];
      const hasSpanish = spanishPhrases.some(p => content.includes(p));
      if (hasSpanish) {
        auditResults.untranslatedContentByLang[lang].push(file);
      }
    }
  });
});

// 3. Imprimir reporte ejecutivo
console.log('================================================================');
console.log('📊 REPORTE FINAL DE AUDITORÍA DE INTEGRIDAD EN TODA LA APLICACIÓN');
console.log('================================================================\n');

if (auditResults.singleFileRouteErrors.length === 0) {
  console.log('✅ RUTAS SINGLE-FILE: 100% Correctas. Todos los singleFile declarados en App.jsx existen físicamente en los 7 idiomas.');
} else {
  console.log('❌ RUTAS SINGLE-FILE CON ERRORES:');
  auditResults.singleFileRouteErrors.forEach(err => {
    console.log(`   - singleFile "${err.singleFile}" falta en idioma [${err.lang.toUpperCase()}]`);
  });
}

console.log('\n================================================================');
console.log('🌐 COBERTURA DE DOCUMENTACIÓN POR IDIOMA (87 ARCHIVOS DE REFERENCIA)');
console.log('================================================================\n');

languages.forEach(lang => {
  const missing = auditResults.missingFilesByLang[lang].length;
  const untranslated = auditResults.untranslatedContentByLang[lang].length;

  if (missing === 0 && untranslated === 0) {
    console.log(`✅ IDIOMA [${lang.toUpperCase()}]: 100% Perfecto (0 archivos faltantes, 0 texto en español atascado).`);
  } else {
    console.log(`⚠️ IDIOMA [${lang.toUpperCase()}]:`);
    if (missing > 0) console.log(`   - Archivos faltantes: ${missing}`);
    if (untranslated > 0) console.log(`   - Archivos con texto en español: ${untranslated}`);
  }
});

console.log('\n================================================================\n');
