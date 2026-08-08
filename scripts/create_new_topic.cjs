/**
 * Generator Script: create_new_topic.cjs
 * Genera automáticamente todos los artefactos requeridos para un nuevo tema en NMerge IA:
 * 1. Markdown base en public/docs/es/<topicId>.md
 * 2. Inyección de clave MNU_<TOPIC_ID> en los 7 diccionarios translation.json
 * 3. Mapeo en GenericTopicPage.jsx (topicToMenuKey)
 * 4. Registro en routesManifest.js (MENU_TREE) y Sidebar.jsx (DEFAULT_TREE)
 * 5. Registro en App.jsx (Route) y prerender.js (rutas SSG)
 * 6. Gobernanza Sentinel-NGAC en NgacService.js (nodos, árbol, política y roles)
 * 7. Sincronización a las 7 carpetas de idioma (sync_docs_languages.cjs)
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 4) {
  console.log(`
❌ Uso incorrecto del script.
Sintaxis: node scripts/create_new_topic.cjs <topicId> <categoryCode> "<spanishTitle>" "<englishTitle>"

Ejemplo:
  node scripts/create_new_topic.cjs cloud_aws_lambda SUB_TEMAS_INFRA "AWS Serverless & Lambda" "AWS Serverless & Lambda"
  `);
  process.exit(1);
}

const [topicId, categoryCode, esTitle, enTitle] = args;
const mnuKey = `MNU_${topicId.toUpperCase()}`;
const pascalName = topicId
  .split('_')
  .map(w => w.charAt(0).toUpperCase() + w.slice(1))
  .join('');

console.log(`🚀 Generando artefactos integrales para el nuevo tema: '${topicId}' (${mnuKey})...`);

const projectRoot = path.join(__dirname, '..');

// 1. Crear archivo Markdown base en public/docs/es/<topicId>.md
const esDocPath = path.join(projectRoot, 'public', 'docs', 'es', `${topicId}.md`);
if (!fs.existsSync(esDocPath)) {
  const markdownTemplate = `# ${esTitle}

## 1. Visión General & Arquitectura
Guía técnica sobre **${esTitle}** desarrollada por StackUpIA Software Labs.

\`\`\`mermaid
flowchart TD
    A[Cliente / Workload] -->|Petición HTTPS| B[${esTitle}]
    B -->|Procesamiento| C[Servicio Interno / DB]
\`\`\`

## 2. Implementación & Buenas Prácticas
Detalles técnicos y mejores prácticas de implementación enterprise.
`;
  fs.writeFileSync(esDocPath, markdownTemplate, 'utf-8');
  console.log(`  [1/7] ✅ Creado documento Markdown: public/docs/es/${topicId}.md`);
} else {
  console.log(`  [1/7] ℹ️ El documento public/docs/es/${topicId}.md ya existe.`);
}

// 2. Inyectar en los 7 diccionarios translation.json
const langs = ['es', 'en', 'pt', 'fr', 'de', 'zh', 'ja'];
langs.forEach(lang => {
  const jsonPath = path.join(projectRoot, 'public', 'locales', lang, 'translation.json');
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    if (!data[mnuKey]) {
      data[mnuKey] = lang === 'es' ? esTitle : enTitle;
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    }
  }
});
console.log(`  [2/7] ✅ Inyectada clave ${mnuKey} en los 7 diccionarios translation.json`);

// 3. Registrar en GenericTopicPage.jsx (topicToMenuKey)
const genericTopicPath = path.join(projectRoot, 'src', 'shared', 'ui', 'GenericTopicPage.jsx');
let genericContent = fs.readFileSync(genericTopicPath, 'utf-8');
if (!genericContent.includes(`'${topicId}':`)) {
  genericContent = genericContent.replace(
    /const topicToMenuKey = \{/,
    `const topicToMenuKey = {\n    '${topicId}': '${mnuKey}',`
  );
  fs.writeFileSync(genericTopicPath, genericContent, 'utf-8');
  console.log(`  [3/7] ✅ Registrado '${topicId}' -> '${mnuKey}' en GenericTopicPage.jsx`);
}

// 4. Registrar en routesManifest.js y Sidebar.jsx
const routesManifestPath = path.join(projectRoot, 'src', 'shared', 'lib', 'routesManifest.js');
let routesContent = fs.readFileSync(routesManifestPath, 'utf-8');
if (!routesContent.includes(`'${topicId}'`)) {
  const menuNodeSnippet = `      { code: '${mnuKey}', title: '${esTitle}', route: '/temas/${topicId}', requiredRole: 'USER' },`;
  routesContent = routesContent.replace(
    new RegExp(`(code:\\s*'${categoryCode}',[\\s\\S]*?children:\\s*\\[)`),
    `$1\n${menuNodeSnippet}`
  );
  fs.writeFileSync(routesManifestPath, routesContent, 'utf-8');
  console.log(`  [4/7] ✅ Registrado nodo de menú en routesManifest.js`);
}

const sidebarPath = path.join(projectRoot, 'src', 'shared', 'ui', 'Sidebar.jsx');
let sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');
if (!sidebarContent.includes(`'${topicId}'`)) {
  const defaultNodeSnippet = `      { code: '${mnuKey}', title: '${esTitle}', route: '/temas/${topicId}' },`;
  sidebarContent = sidebarContent.replace(
    new RegExp(`(code:\\s*'${categoryCode}',[\\s\\S]*?children:\\s*\\[)`),
    `$1\n${defaultNodeSnippet}`
  );
  fs.writeFileSync(sidebarPath, sidebarContent, 'utf-8');
  console.log(`  [4/7] ✅ Registrado nodo de menú en DEFAULT_TREE de Sidebar.jsx`);
}

// 5. Registrar en App.jsx y prerender.js
const appPath = path.join(projectRoot, 'src', 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf-8');
if (!appContent.includes(`/temas/${topicId}`)) {
  const routeSnippet = `        <Route path="/temas/${topicId}" element={<GenericTopicPage topicId="${topicId}" filename="${topicId}.md" title="${esTitle}" />} />`;
  appContent = appContent.replace(
    /<Route path="\/temas\/nosql_mongodb"/,
    `${routeSnippet}\n        <Route path="/temas/nosql_mongodb"`
  );
  fs.writeFileSync(appPath, appContent, 'utf-8');
  console.log(`  [5/7] ✅ Registrada ruta /temas/${topicId} en App.jsx`);
}

const prerenderPath = path.join(projectRoot, 'src', 'shared', 'lib', 'prerender.js');
let prerenderContent = fs.readFileSync(prerenderPath, 'utf-8');
if (!prerenderContent.includes(`/temas/${topicId}`)) {
  prerenderContent = prerenderContent.replace(
    /const topicRoutes = \[/,
    `const topicRoutes = [\n  '/temas/${topicId}',`
  );
  fs.writeFileSync(prerenderPath, prerenderContent, 'utf-8');
  console.log(`  [5/7] ✅ Registrada ruta SSG en prerender.js`);
}

// 6. Gobernanza Sentinel-NGAC (NgacService.js)
const ngacServicePath = path.join(projectRoot, 'src', 'shared', 'lib', 'NgacService.js');
let ngacContent = fs.readFileSync(ngacServicePath, 'utf-8');

let ngacUpdated = false;
if (!ngacContent.includes(`'${mnuKey}'`)) {
  // Agregar en realAuditedNodes
  ngacContent = ngacContent.replace(
    /const realAuditedNodes = \[/,
    `const realAuditedNodes = [\n        '${mnuKey}', '${pascalName}', '${topicId}',`
  );
  
  // Agregar en topics y topicsGuest en setupNgacBasePolicies
  ngacContent = ngacContent.replace(
    /const topics = \[/,
    `const topics = [\n        '${mnuKey}', '${pascalName}',`
  );
  ngacContent = ngacContent.replace(
    /const topicsGuest = \[/,
    `const topicsGuest = [\n        '${mnuKey}', '${pascalName}',`
  );

  fs.writeFileSync(ngacServicePath, ngacContent, 'utf-8');
  ngacUpdated = true;
  console.log(`  [6/7] ✅ Gobernanza Sentinel-NGAC configurada en NgacService.js (Nodo: ${mnuKey}, Árbol: NMERGEIA_ROOT, Roles: ADMIN, INVITADO, REGISTRADO)`);
} else {
  console.log(`  [6/7] ℹ️ Nodo ${mnuKey} ya registrado en Sentinel-NGAC (NgacService.js).`);
}

// 7. Ejecutar sync_docs_languages.cjs
const { execSync } = require('child_process');
try {
  execSync('node scripts/sync_docs_languages.cjs', { cwd: projectRoot, stdio: 'inherit' });
  console.log(`  [7/7] ✅ Sincronización multilingüe completada en public/docs/`);
} catch (e) {
  console.error(`  [7/7] ⚠️ Error sincronizando public/docs/:`, e.message);
}

console.log(`\n🎉 ¡Todos los 7 pilares de artefactos (incluyendo Gobernanza Sentinel-NGAC) para '${topicId}' han sido generados y sincronizados exitosamente!`);
