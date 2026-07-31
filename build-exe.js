import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 === INICIANDO PIPELINE DE COMPILACIÓN Y OFUSCACIÓN DE EXECUTIVE NMERGE .EXE ===');

try {
  // 1. Compilar Frontend Vite
  console.log('\n📦 1. Compilando bundle Vite (Frontend)...');
  process.env.VITE_IS_DESKTOP = 'true';
  execSync('npx vite build', { stdio: 'inherit' });

  // (Se eliminó el respaldo temporal ya que ahora usamos mapping directo en package.json)

  // 3. Ejecutar script de ofuscación sobre dist/ y los archivos principales
  console.log('\n🔒 3. Ejecutando ofuscación de código JavaScript...');
  execSync('node obfuscate.js', { stdio: 'inherit' });

  // (Se eliminó la sobreescritura de los archivos root, electron-builder mapeará desde dist/)

  // 4. Empaquetar ejecutable con electron-builder
  console.log('\n⚙️ 4. Generando instalador autoejecutable .exe con Electron Builder e iconos...');
  try {
    execSync('cmd /c "taskkill /f /im NMerge*.exe /im electron.exe 2>nul & timeout /t 1 /nobreak >nul & rmdir /s /q dist_electron\\win-unpacked 2>nul || ver >nul"', { stdio: 'ignore' });
  } catch (_) {}
  execSync('npx electron-builder --win', { stdio: 'inherit' });

  console.log('\n✅ === COMPILACIÓN .EXE OFUSCADA FINALIZADA CON ÉXITO ===');
  console.log('  📁 Los binarios autoejecutables se han generado en: dist_electron/');
} catch (error) {
  console.error('\n❌ ERROR EN EL PIPELINE DE COMPILACIÓN:', error.message);
  process.exitCode = 1;
  console.log('\n✅ Pipeline finalizado de manera segura y no destructiva.');
}
