import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 === INICIANDO PIPELINE DE COMPILACIÓN Y OFUSCACIÓN DE EXECUTIVE NMERGE PORTÁTIL .EXE ===');

try {
  // Inyectar Certificado de Firma Digital StackUpIA
  const certPath = 'C:\\Local\\.agents\\certs\\stackupia_gerardo_cert.pfx';
  if (fs.existsSync(certPath)) {
    process.env.WIN_CSC_LINK = certPath;
    process.env.WIN_CSC_KEY_PASSWORD = 'StackUpIA2026';
    console.log('🔐 Certificado digital de StackUpIA detectado e inyectado correctamente.');
  }

  // 1. Compilar Frontend Vite para Aplicación Principal
  console.log('\n📦 1. Compilando bundle Vite (Frontend - Plataforma Principal)...');
  process.env.VITE_IS_DESKTOP = 'true';
  execSync('npx vite build', { stdio: 'inherit' });

  // 2. Ejecutar script de ofuscación sobre dist/ y los archivos principales
  console.log('\n🔒 2. Ejecutando ofuscación de código JavaScript...');
  execSync('node obfuscate.js', { stdio: 'inherit' });

  // 3. Preparar directorio de recursos y empaquetar ejecutable portátil
  console.log('\n⚙️ 3. Generando ejecutable portátil .exe con Electron Builder e iconos...');
  const resourcesDir = path.join('node_modules', 'electron', 'dist', 'resources');
  if (!fs.existsSync(resourcesDir)) {
    fs.mkdirSync(resourcesDir, { recursive: true });
  }

  execSync('npx electron-builder --win --prepackaged node_modules/electron/dist', { stdio: 'inherit' });

  console.log('\n✅ === COMPILACIÓN PORTÁTIL .EXE OFUSCADA Y FIRMADA FINALIZADA CON ÉXITO ===');
  console.log('  📁 El ejecutable portátil autoejecutable de la Plataforma Principal se encuentra en:');
  console.log('     dist_portable/NMerge 1.2.2.exe');
} catch (error) {
  console.error('\n❌ ERROR EN EL PIPELINE DE COMPILACIÓN:', error.message);
  process.exitCode = 1;
  console.log('\n✅ Pipeline finalizado de manera segura y no destructiva.');
}
