import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');

const DOCS_DIR = path.join(projectRoot, 'public', 'docs');
const LANGUAGES = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];

const topicTitleMap = {
  'tema_01_opt_postgres': 'Optimización de PostgreSQL Enterprise',
  'tema_02_docker_multistage': 'Docker Contenedores & Multi-Stage Builds',
  'tema_03_git_avanzado': 'Git Avanzado y Estrategias de Branching',
  'tema_04_iac_terraform': 'Infraestructura como Código e Inmutabilidad',
  'tema_05_rbac_abac_ngac': 'Control de Acceso RBAC, ABAC y NGAC',
  'tema_06_ngac_menus': 'Gobernanza NGAC y Menús Dinámicos',
  'tema_07_rls_gobernanza': 'Seguridad RLS y Gobernanza de Datos',
  'tema_08_devsecops_vault': 'DevSecOps y Gestión de Secretos con Vault',
  'tema_09_migracion_db': 'Migración de Bases de Datos Zero-Downtime',
  'tema_10_etl_saga': 'Pipelines ETL y Patrón Saga',
  'tema_11_saas_multitenant': 'Arquitecturas SaaS Multitenant',
  'tema_12_resiliencia_backend': 'Resiliencia y Circuit Breakers en Backend',
  'tema_13_llm_rag': 'Sistemas RAG y Integración con Modelos LLM',
  'tema_14_ai_agents': 'Agentes de IA Autónomos y Multi-Agent Swarms',
  'tema_15_arquitecturas_software': 'Patrones de Arquitectura de Software',
  'tema_16_toma_requerimientos': 'Toma de Requerimientos e Ingeniería de Software',
  'tema_17_kubernetes_orquestacion': 'Orquestación de Contenedores con Kubernetes',
  'tema_18_cloud_native_sre': 'SRE y Arquitecturas Cloud Native'
};

console.log("🛠️ Corrigiendo nombres de temas en la Sección II de todos los documentos en 7 idiomas...");

LANGUAGES.forEach(lang => {
  const langDir = path.join(DOCS_DIR, lang);
  if (!fs.existsSync(langDir)) return;

  Object.entries(topicTitleMap).forEach(([fileKey, realTopic]) => {
    const filePath = path.join(langDir, `${fileKey}.md`);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');
    const oldGeneric = "El componente de **Arquitectura de Software** abordado en este módulo";
    const newSpecific = `El componente de **${realTopic}** abordado en este módulo`;

    if (content.includes(oldGeneric)) {
      content = content.replaceAll(oldGeneric, newSpecific);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`  ✅ Actualizado [${lang}/${fileKey}.md] -> "${realTopic}"`);
    }
  });
});

console.log("🎉 ¡Corrección de nombres de temas completada con éxito!");
