import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, '../../../public/locales');
const SOURCE_LANG = 'es';
const SOURCE_FILE = path.join(LOCALES_DIR, `${SOURCE_LANG}/translation.json`);

const TARGET_LANGS = ['en', 'fr', 'pt', 'de', 'zh', 'ja'];
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = 'llama3'; // Modelo local por defecto para traducción offline

const LANGUAGE_NAMES = {
  en: 'English',
  fr: 'French',
  pt: 'Portuguese',
  de: 'German',
  zh: 'Simplified Chinese',
  ja: 'Japanese'
};

async function translateWithLocalOllama(text, targetLangName) {
  try {
    const prompt = `You are a professional software localization tool. Translate the following software user interface text from Spanish to ${targetLangName}. Keep variables like {provider} or {email} intact and unchanged in formatting. Output ONLY the raw translated text, do not add explanations, do not add quotes, do not wrap it.
Source text: "${text}"
Translation:`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // Timeout rápido de 4 segundos por clave

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: { temperature: 0.1 }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data.response ? data.response.trim().replace(/^"|"$/g, '') : null;
    }
  } catch (e) {
    // Ollama no está disponible o dio timeout, silencioso para ir al fallback de TODO
  }
  return null;
}

async function syncTranslations() {
  console.info('🔄 Iniciando Sincronizador de Traducciones Local-First...');
  
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error(`❌ Error: No se encuentra el archivo fuente de verdad en ${SOURCE_FILE}`);
    process.exit(1);
  }

  const sourceData = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf-8'));
  const sourceKeys = Object.keys(sourceData);
  console.info(`🟢 Fuente de verdad cargada (${SOURCE_LANG}.json) con ${sourceKeys.length} claves.`);

  // Verificar si Ollama local está corriendo
  let isOllamaActive = false;
  try {
    const checkRes = await fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(1000) });
    if (checkRes.ok) {
      isOllamaActive = true;
      console.info(`🤖 Ollama Local detectado activo (utilizando modelo: ${OLLAMA_MODEL})`);
    }
  } catch (e) {
    console.info('ℹ️ Ollama Local no detectado o inactivo. Se generarán prefijos "TODO:" para completado manual.');
  }

  let totalAdded = 0;

  for (const lang of TARGET_LANGS) {
    const targetFile = path.join(LOCALES_DIR, `${lang}/translation.json`);
    let targetData = {};

    if (fs.existsSync(targetFile)) {
      try {
        targetData = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
      } catch (e) {
        console.error(`⚠️ Error al leer ${lang}/translation.json, se inicializará vacío.`);
      }
    }

    const updatedData = {};
    let langAddedCount = 0;

    // Alinear claves con es.json manteniendo el orden de la fuente
    for (const key of sourceKeys) {
      if (targetData[key] !== undefined && !targetData[key].startsWith('TODO:')) {
        updatedData[key] = targetData[key];
      } else {
        // Clave faltante o marcada con TODO
        const originalText = sourceData[key];
        let translatedText = null;

        if (isOllamaActive) {
          console.info(`⚙️ Traduciendo [${key}] al ${LANGUAGE_NAMES[lang]}...`);
          translatedText = await translateWithLocalOllama(originalText, LANGUAGE_NAMES[lang]);
        }

        if (translatedText) {
          updatedData[key] = translatedText;
          console.info(`   ✔️ Traducido: "${originalText}" ➡️ "${translatedText}"`);
        } else {
          updatedData[key] = `TODO: ${originalText}`;
          console.info(`   ⚠️ Placeholder: [${key}] asignado como "TODO: ${originalText}"`);
        }

        langAddedCount++;
        totalAdded++;
      }
    }

    // Guardar el JSON alineado y ordenado
    fs.writeFileSync(targetFile, JSON.stringify(updatedData, null, 2), 'utf-8');
    if (langAddedCount > 0) {
      console.info(`💾 Guardado ${lang}/translation.json - Sincronizadas ${langAddedCount} nuevas claves.`);
    } else {
      console.info(`✨ ${lang}/translation.json ya se encuentra completamente sincronizado.`);
    }
  }

  console.info(`\n🎉 Sincronización completada. Total de claves nuevas añadidas/actualizadas: ${totalAdded}`);
  
  // Buscar si quedan pendientes
  let pendingCount = 0;
  for (const lang of TARGET_LANGS) {
    const targetFile = path.join(LOCALES_DIR, `${lang}/translation.json`);
    const data = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
    Object.entries(data).forEach(([key, val]) => {
      if (val.startsWith('TODO:')) {
        pendingCount++;
      }
    });
  }

  if (pendingCount > 0) {
    console.info(`\n⚠️ Alerta: Quedan ${pendingCount} traducciones marcadas con "TODO:" en el repositorio. Tradúcelas antes de hacer commit.`);
  } else {
    console.info('\n✅ ¡Perfecto! Todas las traducciones están al 100% completadas y no hay pendientes.');
  }
}

syncTranslations();
