import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');

const TARGET_FILES = [
  'src/features/landing/AboutPage.jsx',
  'src/features/landing/ContactPage.jsx',
  'src/features/landing/CookiePolicyPage.jsx',
  'src/features/landing/DocsPanel.jsx',
  'src/features/landing/EulaPage.jsx',
  'src/features/landing/FaqPage.jsx',
  'src/features/landing/FeaturesPage.jsx',
  'src/features/landing/LandingPage.jsx',
  'src/features/landing/LegalNoticePage.jsx',
  'src/features/landing/NgacGuideAdvancedPage.jsx',
  'src/features/landing/NgacGuideBasicPage.jsx',
  'src/features/landing/NgacGuideExpertPage.jsx',
  'src/features/landing/NgacGuideInitialPage.jsx',
  'src/features/landing/NgacGuideMediumPage.jsx',
  'src/features/landing/PostgresGuidePage.jsx',
  'src/features/landing/PricingPage.jsx',
  'src/features/landing/PrivacyPage.jsx',
  'src/features/landing/TermsPage.jsx',
  'src/features/settings/SettingsPage.jsx'
];

console.log("📐 Removiendo restricciones de maxWidth en TODAS las páginas para habilitar ancho fluido al 100%...");

let updatedCount = 0;

TARGET_FILES.forEach(relPath => {
  const filePath = path.join(projectRoot, relPath);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // Reemplazar maxWidth de contenedores principales (800px, 850px, 900px, 950px, 1000px)
  content = content.replace(/maxWidth:\s*['"](800|850|900|950|1000)px['"],?/g, "width: '100%',");
  content = content.replace(/margin:\s*['"]0 auto['"],?/g, "");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    updatedCount++;
    console.log(`  ✅ Modificado: ${relPath}`);
  }
});

console.log(`🎉 ¡Restaurado el 100% del ancho en ${updatedCount} páginas de la aplicación!`);
