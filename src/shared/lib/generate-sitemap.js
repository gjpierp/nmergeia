import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_MENU_ROUTES } from './routesManifest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://nmergeia.com';
const LANGUAGES = ['es', 'en', 'pt', 'fr', 'de', 'zh', 'ja'];
const TODAY = new Date().toISOString().split('T')[0];

function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  ALL_MENU_ROUTES.forEach(page => {
    // Convierte rutas tipo '/guias/postgres/inicial' a hash '#guias/postgres/inicial' o '#'
    let hashPath = page.path === '/' ? '' : `#${page.path.replace(/^\//, '')}`;
    const loc = hashPath ? `${DOMAIN}/${hashPath}` : `${DOMAIN}/`;
    
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq || 'monthly'}</changefreq>\n`;
    xml += `    <priority>${page.priority || '0.7'}</priority>\n`;

    LANGUAGES.forEach(lang => {
      const langUrl = hashPath 
        ? `${DOMAIN}/?lang=${lang}${hashPath}`
        : `${DOMAIN}/?lang=${lang}`;
      xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${langUrl}"/>\n`;
    });

    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  const publicDir = path.join(__dirname, '..', '..', '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');

  const distDir = path.join(__dirname, '..', '..', '..', 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
  }

  console.log(`[Sitemap Generator] ✅ sitemap.xml generado exitosamente desde el Árbol del Menú en ${sitemapPath} (${ALL_MENU_ROUTES.length} páginas de menú, ${LANGUAGES.length} idiomas)`);
}

generateSitemap();
