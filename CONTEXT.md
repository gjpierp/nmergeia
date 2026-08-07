# Contexto del Proyecto: NMerge (v1.2.15)

> **Objetivo Core del negocio (North Star):**
> Proveer una herramienta local ultrarrápida para sincronización de directorios (diff/merge), gestión de perfiles y resolución de conflictos entre ramas/archivos de forma visual. El sistema ofrece un modo básico y un modelo "Pro" con características avanzadas verificables mediante licencia local.

## Stack Tecnológico Inmutable
- **Frontend:** React + Vite, Zustand (Manejo de estado), Monaco Editor (Visualización de código/diferencias).
- **Backend/API:** Node.js + Express.js con compresión Gzip/Brotli activa y `trust proxy` configurado.
- **Base de Datos:** SQLite (para verificación de licencias y configuraciones de estado locales).
- **Infraestructura:** Docker + Docker Compose, Nginx (Proxy inverso - Zero Ports), Heroku Platform (Release v80).
- **API FileSystem:** Uso intensivo de *File System Access API* en el navegador para manipulación local con resiliencia defensiva ante permisos expirados en Chrome/Edge.
- **Optimización de Bundles:** Code-Splitting con descarga inicial reducida a 248 KB (94% más ligero) y sub-chunks diferidos bajo demanda (`vendor-documents`, `vendor-markdown`, `vendor-monaco`).

## Invariantes (Reglas absolutas)
1. **Seguridad Zero-Trust & Zero-Ports:** Todo corre tras un proxy inverso Nginx (`global-network`). El frontend o el backend nunca exponen sus puertos locales en `docker-compose.yml`.
2. **Privacidad de Código (Local-First):** Todo el escaneo de directorios ocurre localmente vía *File System Access API*. El backend Node se usa solo para configuraciones, filtros (`filtro.txt`) y licencias.
3. **Manejo de Licencias (Monetización):** La aplicación debe bloquear explícitamente características premium detrás del `MonetizationStore` (validando SQLite).
4. **Diseño de Interfaz:** Se utilizará un patrón *Dense Form* para los inputs y modales. Cero popups no intrusivos. Las ventanas modales usan cabeceras del 100%.
5. **Testing (Quality Gate):** Mínimo 80% de code coverage en los módulos críticos (59/59 unit tests pasados).
6. **Estandarización de Layout UI/UX:** Toda página o vista nueva de la plataforma debe implementar obligatoriamente el contenedor unificado de `1000px` (`maxWidth: '1000px'`, `margin: '0 auto'`) precedido por la secuencia de encabezado estándar (`<Breadcrumbs />` + `<PageHeader title subtitle badgeText />`). En código JSX, los resaltados de texto deben usar etiquetas HTML semánticas (`<strong>`, `<em>`) en lugar de sintaxis Markdown cruda (`**`).
7. **Integridad de Enrutamiento y Encapsulamiento en la Cáscara de la Biblioteca (`GenericTopicPage`):** Todas las rutas y guías de la biblioteca técnica (`/temas/*`, `/guias/*`) deben estar explícitamente registradas y resueltas en `App.jsx`, `Sidebar.jsx` y `routesManifest.js`. Queda estrictamente prohibido permitir fallthroughs silenciosos que redirijan al usuario a la página de inicio (`LandingPage`). Además, todas las guías técnicas deben renderizarse obligatoriamente encapsuladas dentro del componente cáscara unificado `<GenericTopicPage />`, garantizando que contengan encabezado, migas de pan, selectores de nivel y visor markdown estandarizado.
