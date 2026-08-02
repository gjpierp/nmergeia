import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const esDocsDir = path.join(__dirname, '../../../public/docs/es');

const files = fs.readdirSync(esDocsDir).filter(f => f.endsWith('.md'));

console.log(`🔍 Auditando ${files.length} archivos de documentación en public/docs/es/...\n`);

const findings = [];

files.forEach(file => {
  const filePath = path.join(esDocsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  const issues = [];

  // Check 1: Generic synthetic class names or placeholders
  if (content.includes('KAFKA_Manager') && !file.includes('kafka')) {
    issues.push('Menciona KAFKA_Manager erróneamente');
  }
  if (content.includes('process_data_stream(["item_1"')) {
    issues.push('Contiene código sintético genérico (process_data_stream)');
  }
  if (content.includes('subtopic.name')) {
    issues.push('Contiene variable no resuelta [subtopic.name]');
  }
  if (content.includes('Nivel (Inicial)') && !file.includes('_inicial')) {
    issues.push('Refiere a "Nivel (Inicial)" en un archivo que no es inicial');
  }
  if (content.includes('Parquet / Delta Storage Layer') && !file.includes('kafka') && !file.includes('deltalake') && !file.includes('pyspark') && !file.includes('datascience')) {
    issues.push('Diagrama genérico de Delta Storage en tema no relacionado');
  }

  if (issues.length > 0) {
    findings.push({ file, issues, lineCount: content.split('\n').length });
  }
});

console.log(`📌 RESULTADOS DEL AUDIT DE CONTENIDO (Páginas con Plantillas Sintéticas o Contexto Inválido):\n`);

if (findings.length === 0) {
  console.log('✅ Ningún archivo contiene plantillas sintéticas genéricas ni inconsistencias de contexto.');
} else {
  findings.forEach(item => {
    console.log(`❌ Archivo: ${item.file}`);
    item.issues.forEach(iss => console.log(`   - ${iss}`));
  });
}
