import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'serve-sitemap',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url === '/sitemap.xml' || req.url.startsWith('/sitemap.xml?'))) {
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            const xmlPath = path.resolve('public/sitemap.xml');
            if (fs.existsSync(xmlPath)) {
              return res.end(fs.readFileSync(xmlPath, 'utf8'));
            }
          }
          next();
        });
      }
    },
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
        navigateFallbackDenylist: [/^\/sitemap\.xml$/, /^\/robots\.txt$/, /^\/ads\.txt$/, /^\/manifest\.webmanifest$/]
      },
      devOptions: {
        enabled: false // Desactivado en desarrollo para prevenir popups de permisos en el navegador
      },
      manifest: {
        name: 'NMerge IA',
        short_name: 'NMerge',
        description: 'Advanced File Merging & Comparison',
        theme_color: '#0f172a',
        icons: [
          {
            src: 'assets/icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('monaco-editor')) {
              return 'vendor-monaco';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('zustand')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    host: '127.0.0.1',
    port: 3001,
    strictPort: true,
    allowedHosts: true,
    headers: {
      'Access-Control-Allow-Private-Network': 'true'
    },
    watch: {
      usePolling: true,
      interval: 100
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3005',
        changeOrigin: true
      }
    }
  }
});