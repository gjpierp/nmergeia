import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../../../public/docs');
const SOURCE_LANG = 'es';
const SOURCE_DOCS_DIR = path.join(DOCS_DIR, SOURCE_LANG);

const TARGET_LANGS = ['en', 'fr', 'pt', 'de', 'zh', 'ja'];
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = 'llama3'; // Modelo local por defecto

const LANGUAGE_NAMES = {
  en: 'English',
  fr: 'French',
  pt: 'Portuguese',
  de: 'German',
  zh: 'Simplified Chinese',
  ja: 'Japanese'
};

async function translateMarkdownWithOllama(text, targetLangName) {
  try {
    const prompt = `You are a professional software localization tool. Translate the following Markdown document from Spanish to ${targetLangName}. Preserve all Markdown formatting, bold text, lists, links, code blocks, and structure exactly as they are. Output ONLY the raw translated Markdown text, without any introductory or concluding remarks.
Source Markdown:
${text}
Translation:`;

    // Aumentamos el timeout porque los archivos markdown son grandes
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutos

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
      return data.response ? data.response.trim() : null;
    }
  } catch (e) {
    console.error("Error connecting to Ollama:", e.message);
  }
  return null;
}

async function syncDocs() {
  console.info('🔄 Iniciando Sincronizador de Documentación Local-First...');
  
  if (!fs.existsSync(SOURCE_DOCS_DIR)) {
    console.error(`❌ Error: No se encuentra el directorio fuente en ${SOURCE_DOCS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(SOURCE_DOCS_DIR).filter(f => f.endsWith('.md'));
  console.info(`🟢 Encontrados ${files.length} archivos Markdown en ${SOURCE_LANG}.`);

  let isOllamaActive = false;
  try {
    const checkRes = await fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(1000) });
    if (checkRes.ok) {
      isOllamaActive = true;
      console.info(`🤖 Ollama Local detectado activo (modelo: ${OLLAMA_MODEL})`);
    }
  } catch (e) {
    console.info('ℹ️ Ollama Local no detectado o inactivo. No se traducirán nuevos documentos.');
  }

  for (const lang of TARGET_LANGS) {
    const targetLangDir = path.join(DOCS_DIR, lang);
    if (!fs.existsSync(targetLangDir)) {
      fs.mkdirSync(targetLangDir, { recursive: true });
    }

    let filesAdded = 0;

    for (const file of files) {
      const sourceFile = path.join(SOURCE_DOCS_DIR, file);
      const targetFile = path.join(targetLangDir, file);

      if (!fs.existsSync(targetFile)) {
        const sourceText = fs.readFileSync(sourceFile, 'utf-8');
        let translatedText = null;

        if (isOllamaActive) {
          console.info(`⚙️ Traduciendo [${file}] al ${LANGUAGE_NAMES[lang]} (esto puede tardar)...`);
          translatedText = await translateMarkdownWithOllama(sourceText, LANGUAGE_NAMES[lang]);
        }

        if (translatedText) {
          fs.writeFileSync(targetFile, translatedText, 'utf-8');
          console.info(`   ✔️ Traducido y guardado: ${file}`);
          filesAdded++;
        } else {
          console.info(`   ⚠️ No se pudo traducir [${file}] al ${lang}`);
        }
      }
    }

    if (filesAdded > 0) {
      console.info(`💾 Guardados ${filesAdded} nuevos documentos en ${lang}/`);
    } else {
      console.info(`✨ Documentos de ${lang} ya están completamente sincronizados.`);
    }
  }

  console.info(`\n🎉 Sincronización de documentación completada.`);
}

syncDocs();
