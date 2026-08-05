const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const releasesDir = path.join(rootDir, 'releases');
const stageDir = path.join(releasesDir, 'nmerge-standalone');
const zipPath = path.join(releasesDir, 'NMerge-Standalone-v1.2.2.zip');

console.log('[1/4] Preparando directorio de entrega releases/...');
if (fs.existsSync(stageDir)) {
  fs.rmSync(stageDir, { recursive: true, force: true });
}
fs.mkdirSync(stageDir, { recursive: true });

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('[2/4] Copiando archivos indispensables para runtime...');
// 1. dist
copyRecursive(path.join(rootDir, 'dist'), path.join(stageDir, 'dist'));
// 2. configs
if (fs.existsSync(path.join(rootDir, 'configs'))) {
  copyRecursive(path.join(rootDir, 'configs'), path.join(stageDir, 'configs'));
}
// 3. Archivos raíz esenciales
const essentialFiles = [
  'server.js',
  'package.json',
  'package-lock.json',
  'filtro.txt',
  'run-local.bat',
  'docker-compose.yml',
  'Dockerfile'
];

for (const file of essentialFiles) {
  const srcPath = path.join(rootDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(stageDir, file));
  }
}

// 4. Generar guía de inicio rápida en español
const instructions = `========================================================================
             NMERGE IA - GUÍA DE INICIO RÁPIDO (STANDALONE)
========================================================================

Esta carpeta contiene únicamente lo indispensable para ejecutar NMerge
en cualquier equipo Windows / Linux / macOS.

REQUISITO PREVIO:
  - Tener instalado Node.js (v18 o superior).

INSTRUCCIONES DE EJECUCIÓN:

Opción 1: Ejecución Automática en Windows (Recomendado)
  1. Haz doble clic en "run-local.bat".
  2. El script instalará dependencias automáticamente (si no existen),
     abrirá el navegador en http://localhost:8880 y levantará el servidor.

Opción 2: Ejecución Manual vía Terminal (Windows / Mac / Linux)
  1. Abre una terminal dentro de esta carpeta.
  2. Ejecuta:
        npm install --omit=dev
  3. Inicia el servidor con:
        npm start
  4. Abre tu navegador en:
        http://localhost:8880

Opción 3: Ejecución vía Docker
  1. Ejecuta:
        docker-compose up -d --build
  2. Abre tu navegador en http://localhost:8880.

CARACTERÍSTICAS INCLUIDAS:
  - Comparador Visual de Código y Archivos (Diff/Merge local).
  - Filtros y perfiles de exclusión (filtro.txt / configs).
  - Carga instantánea (0ms) sin dependencias de red externa.
========================================================================
`;

fs.writeFileSync(path.join(stageDir, 'INSTRUCCIONES_INICIO.txt'), instructions, 'utf8');

console.log('[3/4] Generando archivo ZIP comprimido...');
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

// Crear paquete zip con PowerShell Compress-Archive
const psCommand = `powershell -Command "Compress-Archive -Path '${stageDir}/*' -DestinationPath '${zipPath}' -Force"`;
execSync(psCommand, { stdio: 'inherit' });

console.log('[4/4] Limpiando carpeta temporal de staging...');
fs.rmSync(stageDir, { recursive: true, force: true });

const zipStats = fs.statSync(zipPath);
console.log(`✅ Archivo ZIP generado exitosamente: ${zipPath}`);
console.log(`📦 Tamaño final del paquete: ${(zipStats.size / (1024 * 1024)).toFixed(2)} MB`);
