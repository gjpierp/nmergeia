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
  { path: '/temas/tema-18-cloud-native', dirName: path.join('temas', 'tema-18-cloud-native') },

  // Ola A: NoSQL & Storage Distribuido
  { path: '/temas/nosql/mongodb', dirName: path.join('temas', 'nosql', 'mongodb') },
  { path: '/temas/nosql/redis', dirName: path.join('temas', 'nosql', 'redis') },
  { path: '/temas/nosql/elasticsearch', dirName: path.join('temas', 'nosql', 'elasticsearch') },
  { path: '/temas/nosql/clickhouse', dirName: path.join('temas', 'nosql', 'clickhouse') },

  // Ola B: Multi-Cloud, GitOps & Observabilidad
  { path: '/temas/cloud/gcp', dirName: path.join('temas', 'cloud', 'gcp') },
  { path: '/temas/cloud/azure', dirName: path.join('temas', 'cloud', 'azure') },
  { path: '/temas/gitops/argocd', dirName: path.join('temas', 'gitops', 'argocd') },
  { path: '/temas/observability/otel', dirName: path.join('temas', 'observability', 'otel') }
];

console.log(`🚀 Iniciando Pre-renderizado Nativo de ${routes.length} Páginas HTML Físicas...`);

const indexHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.error("❌ Error: dist/index.html no existe. Ejecuta 'vite build' primero.");
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const routeTitles = {
  '/features': 'Características Técnicas',
  '/pricing': 'Planes y Precios',
  '/faq': 'Preguntas Frecuentes',
  '/about': 'Sobre Nosotros (EEAT)',
  '/contact': 'Contacto y Soporte',
  '/privacy': 'Política de Privacidad',
  '/terms': 'Términos y Condiciones',
  '/cookie-policy': 'Política de Cookies',
  '/legal-notice': 'Aviso Legal',
  '/eula': 'EULA (Licencia de Software)',
  '/docs': 'Biblioteca Técnica'
};

const getBreadcrumbName = (routePath) => {
  if (routeTitles[routePath]) return routeTitles[routePath];
  const parts = routePath.split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1] || 'Documentación';
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ');
};

routes.forEach(({ path: routePath, dirName }) => {
  const targetDir = path.join(distDir, dirName);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const breadcrumbName = getBreadcrumbName(routePath);
  const fullUrl = `https://nmergeia.com${routePath}`;

  let pageHtml = baseHtml;
  
  // Replace canonical URL & OG URL for target route
  pageHtml = pageHtml.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${fullUrl}"`);
  pageHtml = pageHtml.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${fullUrl}"`);

  // Replace JSON-LD BreadcrumbList for target route
  pageHtml = pageHtml.replace(
    /"@type": "BreadcrumbList",[\s\S]*?"itemListElement": \[[\s\S]*?\]/,
    `"@type": "BreadcrumbList",\n          "itemListElement": [\n            {\n              "@type": "ListItem",\n              "position": 1,\n              "name": "Inicio",\n              "item": "https://nmergeia.com/"\n            },\n            {\n              "@type": "ListItem",\n              "position": 2,\n              "name": "${breadcrumbName}",\n              "item": "${fullUrl}"\n            }\n          ]`
  );

  // Replace DOM Microdata BreadcrumbList for target route
  pageHtml = pageHtml.replace(
    /<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/,
    `<nav aria-label="Breadcrumb" style="margin-bottom: 20px; font-size: 0.9rem;">\n          <ol itemscope itemtype="https://schema.org/BreadcrumbList" style="display: flex; gap: 8px; list-style: none; padding: 0; margin: 0; color: #64748b;">\n            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">\n              <a itemprop="item" href="https://nmergeia.com/" style="color: #2563eb; text-decoration: none;"><span itemprop="name">Inicio</span></a>\n              <meta itemprop="position" content="1" />\n            </li>\n            <li>/</li>\n            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">\n              <a itemprop="item" href="${fullUrl}" style="color: #0f172a; font-weight: 600; text-decoration: none;"><span itemprop="name">${breadcrumbName}</span></a>\n              <meta itemprop="position" content="2" />\n            </li>\n          </ol>\n        </nav>`
  );

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, pageHtml, 'utf8');
});

console.log(`✅ Pre-renderizado Nativo Completado Exitosamente: Generados ${routes.length} archivos HTML estáticos independientes con migas de pan Schema.org específicas en dist/!`);
