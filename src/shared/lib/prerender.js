import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');
const distDir = path.join(projectRoot, 'dist');

const routes = [
  { path: '/features', dirName: 'features' },
  { path: '/pricing', dirName: 'pricing' },
  { path: '/faq', dirName: 'faq' },
  { path: '/about', dirName: 'about' },
  { path: '/contact', dirName: 'contact' },
  { path: '/privacy', dirName: 'privacy' },
  { path: '/terms', dirName: 'terms' },
  { path: '/cookie-policy', dirName: 'cookie-policy' },
  { path: '/legal-notice', dirName: 'legal-notice' },
  { path: '/eula', dirName: 'eula' },
  { path: '/docs', dirName: 'docs' },
  
  // Guías y Temas de Especialidades
  { path: '/temas/datascience', dirName: path.join('temas', 'datascience') },
  { path: '/temas/datascience/pyspark', dirName: path.join('temas', 'datascience', 'pyspark') },
  { path: '/temas/datascience/kafka', dirName: path.join('temas', 'datascience', 'kafka') },
  { path: '/temas/datascience/deltalake', dirName: path.join('temas', 'datascience', 'deltalake') },
  { path: '/temas/datascience/mlops', dirName: path.join('temas', 'datascience', 'mlops') },
  { path: '/temas/datascience/polars', dirName: path.join('temas', 'datascience', 'polars') },

  { path: '/temas/postgres', dirName: path.join('temas', 'postgres') },
  { path: '/temas/oracle', dirName: path.join('temas', 'oracle') },
  { path: '/temas/docker', dirName: path.join('temas', 'docker') },
  { path: '/temas/ngac', dirName: path.join('temas', 'ngac') },
  { path: '/temas/ext-react', dirName: path.join('temas', 'ext-react') },
  { path: '/temas/ext-vue', dirName: path.join('temas', 'ext-vue') },
  { path: '/temas/ext-node', dirName: path.join('temas', 'ext-node') },
  { path: '/temas/ext-aws', dirName: path.join('temas', 'ext-aws') },
  { path: '/temas/ext-pentest', dirName: path.join('temas', 'ext-pentest') },

  { path: '/temas/tema-02-docker-multistage', dirName: path.join('temas', 'tema-02-docker-multistage') },
  { path: '/temas/tema-03-git-avanzado', dirName: path.join('temas', 'tema-03-git-avanzado') },
  { path: '/temas/tema-04-iac-terraform', dirName: path.join('temas', 'tema-04-iac-terraform') },
  { path: '/temas/tema-05-rbac-abac-ngac', dirName: path.join('temas', 'tema-05-rbac-abac-ngac') },
  { path: '/temas/tema-06-ngac-menus', dirName: path.join('temas', 'tema-06-ngac-menus') },
  { path: '/temas/tema-07-rls-gobernanza', dirName: path.join('temas', 'tema-07-rls-gobernanza') },
  { path: '/temas/tema-08-devsecops-vault', dirName: path.join('temas', 'tema-08-devsecops-vault') },
  { path: '/temas/tema-09-migracion-db', dirName: path.join('temas', 'tema-09-migracion-db') },
  { path: '/temas/tema-10-etl-saga', dirName: path.join('temas', 'tema-10-etl-saga') },
  { path: '/temas/tema-11-saas-multitenant', dirName: path.join('temas', 'tema-11-saas-multitenant') },
  { path: '/temas/tema-12-resiliencia-backend', dirName: path.join('temas', 'tema-12-resiliencia-backend') },
  { path: '/temas/tema-13-llm-rag', dirName: path.join('temas', 'tema-13-llm-rag') },
  { path: '/temas/tema-14-ai-agents', dirName: path.join('temas', 'tema-14-ai-agents') },
  { path: '/temas/tema-15-arquitecturas-software', dirName: path.join('temas', 'tema-15-arquitecturas-software') },
  { path: '/temas/tema-16-toma-requerimientos', dirName: path.join('temas', 'tema-16-toma-requerimientos') },
  { path: '/temas/tema-17-kubernetes', dirName: path.join('temas', 'tema-17-kubernetes') },
  { path: '/temas/tema-18-cloud-native', dirName: path.join('temas', 'tema-18-cloud-native') }
];

console.log(`🚀 Iniciando Pre-renderizado Nativo de ${routes.length} Páginas HTML Físicas...`);

const indexHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.error("❌ Error: dist/index.html no existe. Ejecuta 'vite build' primero.");
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

routes.forEach(({ path: routePath, dirName }) => {
  const targetDir = path.join(distDir, dirName);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, baseHtml, 'utf8');
});

console.log(`✅ Pre-renderizado Nativo Completado Exitosamente: Generados ${routes.length} archivos HTML estáticos independientes en dist/!`);
