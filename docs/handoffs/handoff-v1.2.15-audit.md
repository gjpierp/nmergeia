# 🚀 HANDOFF TÉCNICO NMERGE IA v1.2.15

- **Fecha**: 2026-08-07
- **Versión**: `v1.2.15`
- **Estado de Producción**: 🟢 En vivo en Heroku (`https://nmergeia.com`) Release v80
- **Autor**: Orquestador Maestro AI Swarm (StackUpIA Software Labs)

---

## 1. RESUMEN DE CAMBIOS Y SOLUCIONES DE PRODUCCIÓN

### ⚡ A. Optimización de Carga y Code-Splitting (Reducción del 94% en Descarga Inicial)
- **Problema**: El paquete empaquetado `vendor.js` pesaba **5.1 MB (1.4 MB gzipped)**, bloqueando el renderizado de la página durante varios segundos.
- **Solución**: Se reestructuró `vite.config.js` para fragmentar las dependencias en sub-chunks bajo demanda:
  - `vendor-react` (React, ReactDOM, Zustand, i18next): **248 KB** (Descarga inicial instantánea).
  - `vendor-i18n`: Agrupado sincrónicamente para evitar que se muestren claves brutas (`compare_config_title`).
  - `vendor-documents` (pdfjs-dist, xlsx, jszip, mammoth): **1.25 MB** (Descarga diferida solo al arrastrar documentos).
  - `vendor-markdown` (mermaid, rehype, remark, react-markdown): **3.37 MB** (Descarga diferida solo al leer documentación).
- **Servidor Express**: Se inyectó middleware `compression()` en `server.js` para compresión Gzip / Brotli activa en tiempo real.

### 🚨 B. Solución de `ERR_TOO_MANY_REDIRECTS` en Cloudflare / Heroku
- **Problema**: Al operar tras el proxy de Cloudflare / Heroku Edge, la redirección interna 301 de Express causaba un bucle de redirección infinito.
- **Solución**:
  - Se configuró `app.set('trust proxy', 1);` en `server.js`.
  - Se removió la redirección forzada interna de Express delegando la seguridad a las cabeceras `HSTS` y al CDN Edge de Cloudflare/Heroku.
  - Se limpió la regla de redirección de barras finales en `nginx.conf`.

### 🛡️ C. Resiliencia en File System Access API (Permisos Chrome/Edge Expirados)
- **Problema**: Al recargar la página o instalar una actualización, Chrome mantenía handles en memoria cuyos tokens de permiso caducaban, arrojando `DOMException: The requested file could not be read`.
- **Solución**:
  - Se envolvieron las llamadas `entry.getFile()` y `getFileObject()` en bloques `try/catch` defensivos en `FileSystemService.js`.
  - Ante handles caducados, la aplicación omite el fallo de forma limpia y solicita seleccionar la carpeta nuevamente sin mostrar el error rojo de Chrome.

### 🎨 D. Restauración de Logotipo e Ícono HD
- Se sincronizaron `public/favicon.png` (`270 KB`) y `public/logo.png` (`159 KB`) restaurando la alta resolución en pestañas y accesos directos de móviles/escritorio.

---

## 2. MÉTRICAS DE SALUD Y AUDITORÍA

- **Pruebas Unitarias (Vitest)**: 🟢 59/59 pasadas al 100% (13 archivos de prueba)
- **Linter Estático (Oxlint)**: 🟢 0 Errores
- **Sintaxis Node Backend**: 🟢 `node --check server.js` sin errores

---

## 3. INVENTARIO DE ARCHIVOS AFECTADOS

- `src/features/diff/DiffView.jsx`: Rediseño de botones y vista dual de diferencias.
- `src/features/directory-sync/api/FileSystemService.js`: Resiliencia ante permisos expirados en Chrome.
- `src/app/useAppStore.js`: Persistencia de filtros en `localStorage`.
- `src/features/filters/ui/FiltersPanel.jsx`: Validación de sintaxis de patrones ignore.
- `vite.config.js`: Code-splitting optimizado y chunks diferidos.
- `server.js`: Compresión Gzip/Brotli, `trust proxy` y cabeceras de seguridad.
- `nginx.conf`: Limpieza de redirecciones conflictivas.
- `public/favicon.png` / `public/logo.png`: Sincronizados en HD.
