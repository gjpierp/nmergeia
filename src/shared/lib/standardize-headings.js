import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const languages = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];
const docsDir = path.join(__dirname, '../../../public/docs');

console.log('🧹 Estandarizando encabezados en todas las guías de documentación (removiendo "Resumen Ejecutivo:" de títulos)...');

let totalModified = 0;

languages.forEach(lang => {
  const langDir = path.join(docsDir, lang);
  if (!fs.existsSync(langDir)) return;

  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.md'));

  files.forEach(file => {
    const filePath = path.join(langDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Pattern replacements for heading 1 / 2 containing Executive Summary / Resumen Ejecutivo
    content = content.replace(/^##\s*🎯\s*1\.\s*(?:Resumen Ejecutivo|Executive Summary|Executive summary|Résumé exécutif|Resumo Executivo|Executive Summary:)\s*:\s*/gm, '## 🎯 1. ');
    content = content.replace(/^##\s*🎯\s*1\.\s*(?:Resumen Ejecutivo|Executive Summary|Executive summary|Résumé exécutif|Resumo Executivo|Executive Summary:)\s+-\s+/gm, '## 🎯 1. ');
    content = content.replace(/^##\s*🎯\s*1\.\s*(?:Resumen Ejecutivo|Executive Summary|Executive summary|Résumé exécutif|Resumo Executivo|Executive Summary:)\s*/gm, '## 🎯 1. ');

    content = content.replace(/^#\s*(?:Resumen Ejecutivo|Executive Summary|Executive summary|Résumé exécutif|Resumo Executivo)\s*:\s*/gm, '# ');
    content = content.replace(/^##\s*(?:Resumen Ejecutivo|Executive Summary|Executive summary|Résumé exécutif|Resumo Executivo)\s*:\s*/gm, '## ');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      totalModified++;
    }
  });
});

console.log(`✅ Estandarización completada. Archivos actualizados: ${totalModified}`);
