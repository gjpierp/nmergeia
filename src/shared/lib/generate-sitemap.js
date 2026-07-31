import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://nmergeia.com';
const LANGUAGES = ['es', 'en', 'pt', 'fr', 'de', 'zh', 'ja'];
const TODAY = new Date().toISOString().split('T')[0];

const PAGES = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '#about', priority: '0.9', changefreq: 'monthly' },
  { path: '#contact', priority: '0.9', changefreq: 'monthly' },
  { path: '#privacy', priority: '0.8', changefreq: 'monthly' },
  { path: '#terms', priority: '0.8', changefreq: 'monthly' },
  { path: '#docs', priority: '0.8', changefreq: 'weekly' },
  { path: '#faq', priority: '0.8', changefreq: 'weekly' },
  { path: '#pricing', priority: '0.8', changefreq: 'monthly' },
  { path: '#features', priority: '0.8', changefreq: 'monthly' },
  { path: '#postgres-inicial', priority: '0.7', changefreq: 'monthly' },
  { path: '#postgres-basico', priority: '0.7', changefreq: 'monthly' },
  { path: '#postgres-medio', priority: '0.7', changefreq: 'monthly' },
  { path: '#postgres-avanzado', priority: '0.7', changefreq: 'monthly' },
  { path: '#postgres-experto', priority: '0.7', changefreq: 'monthly' },
];

function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  PAGES.forEach(page => {
    const loc = page.path ? `${DOMAIN}/${page.path}` : `${DOMAIN}/`;
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;

    LANGUAGES.forEach(lang => {
      const langUrl = page.path 
        ? `${DOMAIN}/?lang=${lang}${page.path}`
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

  console.log(`[Sitemap Generator] ✅ sitemap.xml generado exitosamente en ${sitemapPath} (${PAGES.length} páginas, ${LANGUAGES.length} idiomas)`);
}

generateSitemap();
