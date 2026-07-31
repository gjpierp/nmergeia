import fs from 'fs';
import path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';

console.log('🔒 Iniciando proceso de ofuscación de código...');

const obfuscateOptionsFrontend = {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: false,
  simplify: true,
  splitStrings: false,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.5,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
  target: 'browser'
};

const obfuscateOptionsNode = {
  ...obfuscateOptionsFrontend,
  target: 'node'
};

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.js') || file.endsWith('.cjs') || file.endsWith('.mjs')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

async function runObfuscation() {
  // 1. Ofuscar todo el bundle JS en dist/assets y dist/
  const distFiles = getAllFiles(path.resolve('dist'));
  let count = 0;

  console.log(`  ⏳ Procesando ${distFiles.length} archivos en paralelo (Frontend)...`);

  await Promise.all(distFiles.map(async (filePath) => {
    try {
      const code = await fs.promises.readFile(filePath, 'utf8');
      const obfuscatedResult = JavaScriptObfuscator.obfuscate(code, obfuscateOptionsFrontend);
      await fs.promises.writeFile(filePath, obfuscatedResult.getObfuscatedCode(), 'utf8');
      count++;
      console.log(`  ✓ Ofuscado: ${path.relative(process.cwd(), filePath)}`);
    } catch (err) {
      console.error(`  ❌ Error ofuscando ${filePath}:`, err.message);
    }
  }));

  // 2. Crear copia ofuscada de scripts de entrada backend/electron si aplica
  const entryFiles = ['server.js', 'electron-main.cjs', 'preload.cjs'];
  let entryCount = 0;
  
  console.log(`  ⏳ Procesando archivos principales en paralelo (Node)...`);

  await Promise.all(entryFiles.map(async (file) => {
    const filePath = path.resolve(file);
    if (fs.existsSync(filePath)) {
      try {
        const code = await fs.promises.readFile(filePath, 'utf8');
        const obfuscatedResult = JavaScriptObfuscator.obfuscate(code, obfuscateOptionsNode);
        // Escribir versión ofuscada en dist/ para empaquetado o in-place temporal
        const targetPath = path.resolve('dist', file);
        await fs.promises.writeFile(targetPath, obfuscatedResult.getObfuscatedCode(), 'utf8');
        entryCount++;
        console.log(`  ✓ Ofuscado script principal -> dist/${file}`);
      } catch (err) {
        console.error(`  ❌ Error ofuscando ${file}:`, err.message);
      }
    }
  }));

  console.log(`✅ Ofuscación completada exitosamente. Total de archivos procesados: ${count + entryCount}`);
}

runObfuscation().catch(err => {
  console.error('❌ Fallo crítico en ofuscación:', err);
  process.exitCode = 1;
});
