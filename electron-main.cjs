const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.cjs')
    },
    autoHideMenuBar: true,
    title: 'NMerge'
  });

  // Pasar ruta segura al backend para evitar escribir en app.asar de solo lectura
  process.env.CONFIGS_PATH = path.join(app.getPath('userData'), 'configs');

  const configsDir = process.env.CONFIGS_PATH;
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

  // IPC Handlers
  ipcMain.handle('read-filter', (event, filename) => {
      const safeFilename = path.basename(filename);
      const filePath = path.join(configsDir, safeFilename);
      if (!fs.existsSync(filePath)) {
          if (filename === 'filtro.txt') {
              const tpl = `// Configuración de Filtros (filtro.txt)\n// -----------------------------------------------------\n// Utiliza este archivo para indicar qué carpetas o archivos\n// quieres incluir o ignorar durante la comparación.\n//\n// REGLAS DE EXCLUSIÓN (Ignorar):\n// Las líneas que empiecen con '-' o '!' serán ignoradas.\n// Ejemplos:\n// - node_modules\n// - build\n// - .env\n// - .git\n//\n// REGLAS DE INCLUSIÓN (Solo comparar estos):\n// Las líneas que empiecen con '+' serán incluidas (las demás se omitirán).\n// Ejemplos:\n// + src/\n// + *.js\n// + *.jsx\n// -----------------------------------------------------\n\n- node_modules\n- dist\n- build\n- .git\n`;
              fs.writeFileSync(filePath, tpl, 'utf8');
              return tpl;
          }
          throw new Error('Not found');
      }
      return fs.readFileSync(filePath, 'utf8');
  });

  ipcMain.handle('write-filter', (event, filename, content) => {
      const safeFilename = path.basename(filename);
      const filePath = path.join(configsDir, safeFilename);
      fs.writeFileSync(filePath, content || '', 'utf8');
      return 'OK';
  });

  ipcMain.handle('verify-license', (event, key) => {
      const found = licenses.find(l => l.key === key);
      if (found && found.active === 1) {
          return { valid: true };
      }
      return { valid: false, message: 'La licencia no existe o está expirada' };
  });

  ipcMain.handle('call-ai-resolver', async (event, { provider, apiKey, model, originalText, modifiedText }) => {
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
              return { success: true, text: data.response };
          } catch (e) {
              return { success: false, message: 'Ollama local no está activo o el modelo no está descargado. Ejecuta "ollama run qwen2.5:1.5b" en la terminal.' };
          }
      } else if (provider === 'gemini') {
          try {
              const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`;
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
              // Limpiar bloques de markdown
              text = text.replace(/^```[a-zA-Z]*\n/, '').replace(/\\n\`\`\`$/, '').replace(/\`\`\`$/, '');
              return { success: true, text };
          } catch (e) {
              return { success: false, message: 'Error en la llamada a Gemini Cloud: ' + e.message };
          }
      }
      return { success: false, message: 'Proveedor de IA no soportado' };
  });

  // Conectarse nativamente al archivo estático sin HTTP
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
