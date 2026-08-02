import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import Stripe from 'stripe';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

import rateLimit from 'express-rate-limit';
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por IP
    message: 'Demasiadas peticiones desde esta IP, por favor inténtalo de nuevo después de 15 minutos'
  });
  app.use('/api/', limiter);
}

// Zod schemas (inline para evitar errores de import dinámico si no está compilado)
import { z } from 'zod';
const ConfigSchema = z.object({
  name: z.string().min(1).regex(/^[a-zA-Z0-9_-]+(\.json)?$/),
  config: z.any()
});
const LicenseSchema = z.object({
  key: z.string().min(10)
});
const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().default('soporte'),
  message: z.string().min(5)
});


const configsDir = process.env.CONFIGS_PATH || path.join(__dirname, 'configs');
if (!fs.existsSync(configsDir)) {
    fs.mkdirSync(configsDir, { recursive: true });
}

// Pure JS Database for License to avoid MSVC/node-gyp native compilation issues
const licenseFile = path.join(configsDir, 'licenses.json');
let licenses = [];
try {
    if (fs.existsSync(licenseFile)) {
        licenses = JSON.parse(fs.readFileSync(licenseFile, 'utf8'));
    } else {
        licenses = [{ key: "PRO-ANTIGRAVITY-2026", active: 1 }];
        fs.writeFileSync(licenseFile, JSON.stringify(licenses, null, 2), 'utf8');
    }
} catch(e) {
    licenses = [{ key: "PRO-ANTIGRAVITY-2026", active: 1 }];
}

// Inicializar Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

// Get all config files
app.get('/api/configs', (req, res) => {
    try {
        const files = fs.readdirSync(configsDir).filter(f => f.endsWith('.json'));
        res.json(files);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get specific config
app.get('/api/configs/:name', (req, res) => {
    try {
        const safeName = path.basename(req.params.name);
        const data = fs.readFileSync(path.join(configsDir, safeName), 'utf8');
        res.json(JSON.parse(data));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Save config
app.post('/api/configs', (req, res) => {
    try {
        const parsed = ConfigSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Validación fallida (Zero-Trust)', details: parsed.error.issues });
        }
        const { name, config } = parsed.data;
        const safeName = path.basename(name);
        const filename = safeName.endsWith('.json') ? safeName : `${safeName}.json`;
        fs.writeFileSync(path.join(configsDir, filename), JSON.stringify(config, null, 2));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Verificación de Licencia (Pro) con DB SQLite
app.post('/api/license/verify', (req, res) => {
    try {
        const parsed = LicenseSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ valid: false, message: 'Clave inválida' });
        
        const { key } = parsed.data;
        
        const found = licenses.find(l => l.key === key);
        
        if (found && found.active === 1) {
            res.json({ valid: true });
        } else {
            res.status(401).json({ valid: false, message: 'La licencia no existe o está expirada' });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Guardar y procesar solicitudes de contacto
app.post('/api/contact', async (req, res) => {
    try {
        const parsed = ContactSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Validación fallida', details: parsed.error.issues });
        }
        const { name, email, subject, message } = parsed.data;
        const ticketId = 'TICK-' + Date.now();
        const newContact = {
            id: ticketId,
            name,
            email,
            subject,
            message,
            createdAt: new Date().toISOString(),
            status: 'NUEVO'
        };

        // 1. Guardar localmente en configs/contacts.json
        const contactsFile = path.join(configsDir, 'contacts.json');
        let contacts = [];
        if (fs.existsSync(contactsFile)) {
            try { contacts = JSON.parse(fs.readFileSync(contactsFile, 'utf8')); } catch (_) { contacts = []; }
        }
        contacts.unshift(newContact);
        fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2), 'utf8');

        // 2. Reenviar asíncronamente a webhook/Formspree si está configurado
        if (process.env.CONTACT_WEBHOOK_URL) {
            try {
                fetch(process.env.CONTACT_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newContact)
                }).catch(err => console.error('Error enviando webhook de contacto:', err));
            } catch (_) {}
        }

        res.json({ success: true, ticketId, message: 'Solicitud registrada correctamente.' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Obtener mensajes de contacto guardados localmente con soporte de Paginación Escalable (1MM+ registros)
app.get('/api/contact/messages', (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
        const contactsFile = path.join(configsDir, 'contacts.json');
        
        let contacts = [];
        if (fs.existsSync(contactsFile)) {
            try { contacts = JSON.parse(fs.readFileSync(contactsFile, 'utf8')); } catch (_) { contacts = []; }
        }

        const total = contacts.length;
        const startIndex = (page - 1) * limit;
        const paginatedItems = contacts.slice(startIndex, startIndex + limit);

        res.json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
            items: paginatedItems
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Endpoints to edit filtro.txt / filters
app.get('/api/filters/:filename', (req, res) => {
    const safeFilename = path.basename(req.params.filename);
    const filePath = path.join(configsDir, safeFilename);
    try {
        if (!fs.existsSync(filePath)) {
            // Provide default if not exists
            if (req.params.filename === 'filtro.txt') {
                 const tpl = `// Configuración de Filtros (filtro.txt)
// -----------------------------------------------------
// Utiliza este archivo para indicar qué carpetas o archivos
// quieres incluir o ignorar durante la comparación.
//
// REGLAS DE EXCLUSIÓN (Ignorar):
// Las líneas que empiecen con '-' o '!' serán ignoradas.
// Ejemplos:
// - node_modules
// - build
// - .env
// - .git
//
// REGLAS DE INCLUSIÓN (Solo comparar estos):
// Las líneas que empiecen con '+' serán incluidas (las demás se omitirán).
// Ejemplos:
// + src/
// + *.js
// + *.jsx
// -----------------------------------------------------

- node_modules
- dist
- build
- .git
`;
                 fs.writeFileSync(filePath, tpl, 'utf8');
            } else {
                 return res.status(404).send('Not found');
            }
        }
        res.send(fs.readFileSync(filePath, 'utf8'));
    } catch(e) {
        res.status(500).send(e.message);
    }
});

app.post('/api/filters/:filename', (req, res) => {
    const safeFilename = path.basename(req.params.filename);
    const filePath = path.join(configsDir, safeFilename);
    try {
        fs.writeFileSync(filePath, req.body.content || '', 'utf8');
        res.send('OK');
    } catch(e) {
        res.status(500).send(e.message);
    }
});

app.post('/api/ai/resolve', async (req, res) => {
    const { provider, apiKey, model, originalText, modifiedText } = req.body;
    const prompt = `Analiza el siguiente conflicto de diferencias de código.
Fichero original:
\"\"\"
${originalText}
\"\"\"

Fichero modificado:
\"\"\"
${modifiedText}
\"\"\"

Genera el código resultante unificado de la mejor manera resolviendo el conflicto. Devuelve EXCLUSIVAMENTE el código resultante final, sin explicaciones ni bloques de comentarios explicativos.`;

    if (provider === 'ollama') {
        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: model || 'qwen2.5:1.5b',
                    prompt: prompt,
                    stream: false
                })
            });
            if (!response.ok) throw new Error('Servicio de Ollama no responde correctamente');
            const data = await response.json();
            res.json({ success: true, text: data.response });
        } catch (e) {
            res.json({ success: false, message: 'Ollama local no está activo o el modelo no está descargado. Ejecuta "ollama run qwen2.5:1.5b" en la terminal.' });
        }
    } else if (provider === 'gemini') {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
             if (!response.ok) {
                 let errMsg = '';
                 try {
                     const errData = await response.json();
                     errMsg = errData.error?.message || JSON.stringify(errData);
                 } catch (_) {
                     errMsg = await response.text();
                 }
                 throw new Error(`Código ${response.status}: ${errMsg || response.statusText}`);
             }
             const data = await response.json();
             let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
             text = text.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '').replace(/```$/, '');
             res.json({ success: true, text });
         } catch (e) {
             res.json({ success: false, message: 'Error en la llamada a Gemini Cloud: ' + e.message });
         }
    } else {
        res.status(400).json({ success: false, message: 'Proveedor de IA no soportado' });
    }
});

// Serve sitemap.xml with explicit XML MIME type and on-the-fly dynamic fallback (Zero 404 guarantee)
import { ALL_MENU_ROUTES } from './src/shared/lib/routesManifest.js';

app.get('/sitemap.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    const pathDist = path.join(__dirname, 'dist', 'sitemap.xml');
    const pathPublic = path.join(__dirname, 'public', 'sitemap.xml');
    if (fs.existsSync(pathDist)) return res.sendFile(pathDist);
    if (fs.existsSync(pathPublic)) return res.sendFile(pathPublic);

    // Fallback dinámico instantáneo si el archivo físico no ha sido leído de disco
    const DOMAIN = 'https://nmergeia.com';
    const LANGUAGES = ['es', 'en', 'pt', 'fr', 'de', 'zh', 'ja'];
    const TODAY = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

    ALL_MENU_ROUTES.forEach(page => {
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
    return res.status(200).send(xml);
});

// Serve robots.txt & ads.txt with text/plain MIME type
app.get(['/robots.txt', '/ads.txt', '/filtro.txt'], (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const fileName = req.path.replace('/', '');
    const pathDist = path.join(__dirname, 'dist', fileName);
    const pathPublic = path.join(__dirname, 'public', fileName);
    if (fs.existsSync(pathDist)) return res.sendFile(pathDist);
    if (fs.existsSync(pathPublic)) return res.sendFile(pathPublic);
    return res.status(404).send(`${fileName} not found`);
});

// Serve webmanifest with explicit JSON MIME type and noindex for crawler compatibility
app.get(['/manifest.webmanifest', '/site.webmanifest'], (req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    const manifestDist = path.join(__dirname, 'dist', 'manifest.webmanifest');
    const manifestPublic = path.join(__dirname, 'public', 'manifest.webmanifest');
    if (fs.existsSync(manifestDist)) {
        return res.sendFile(manifestDist);
    } else if (fs.existsSync(manifestPublic)) {
        return res.sendFile(manifestPublic);
    }
    return res.status(404).json({ error: 'Manifest file not found' });
});

// Serve static frontend with explicit headers
app.use(express.static(path.join(__dirname, 'dist'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.webmanifest')) {
            res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
            res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
        }
    }
}));

// SPA Fallback
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;

const certPath = 'C:\\Local\\certs';
const keyFile = path.join(certPath, 'server.key');
const certFile = path.join(certPath, 'server.crt');

if (fs.existsSync(keyFile) && fs.existsSync(certFile)) {
    const options = {
        key: fs.readFileSync(keyFile),
        cert: fs.readFileSync(certFile)
    };
    https.createServer(options, app).listen(PORT, () => {
        console.info(`Server (HTTPS) running securely on port ${PORT}`);
    });
} else {
    app.listen(PORT, () => console.info(`Server (HTTP) running on port ${PORT}`));
}
