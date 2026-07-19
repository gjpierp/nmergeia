import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por IP
  message: 'Demasiadas peticiones desde esta IP, por favor inténtalo de nuevo después de 15 minutos'
});
app.use('/api/', limiter);

// Zod schemas (inline para evitar errores de import dinámico si no está compilado)
import { z } from 'zod';
const ConfigSchema = z.object({
  name: z.string().min(1).regex(/^[a-zA-Z0-9_-]+(\.json)?$/),
  config: z.any()
});
const LicenseSchema = z.object({
  key: z.string().min(10)
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

// Serve static frontend
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
