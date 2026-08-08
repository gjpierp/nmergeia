# Contexto del Proyecto: NMerge IA (v1.2.30)

> **Objetivo Core del negocio (North Star):**
> Proveer una plataforma web empresarial local-first ultrarrápida para comparación y sincronización de directorios (diff/merge), gestión de perfiles, análisis de código, gobernanza Sentinel-NGAC y una biblioteca de ingeniería de software de alta densidad narrativa (58 páginas indexadas en 7 idiomas).

## 🏢 Stack Tecnológico Inmutable
- **Frontend:** React 19 + Vite, Zustand (Manejo de estado global), Monaco Editor (Visualizador de diferencias de código), React Helmet Async.
- **Backend/API:** Node.js + Express.js con Zod Schema Validation, compresión Gzip/Brotli activa y `trust proxy` configurado.
- **Base de Datos:** SQLite / JSON DB pura (para licencias, configuraciones y almacenamiento de tickets de contacto locales).
- **Infraestructura:** Docker + Docker Compose, Nginx (Proxy inverso - Zero Ports), Heroku Platform (Release v83 en `https://nmergeia.com`).
- **API FileSystem:** Uso intensivo de *File System Access API* en el navegador con persitencia encriptada de permisos de carpetas (`nmerge_granted_folders`).
- **Optimización SSG & Bundles:** Code-Splitting con descarga inicial optimizada y pre-renderizado nativo SSG de 58 páginas HTML estáticas independientes en `dist/` con migas de pan Schema.org específicas.
- **i18n Multilingüe:** Soporte completo en 7 idiomas (Español, Inglés, Portugués, Francés, Alemán, Chino y Japonés) para la UI, navegación y biblioteca de temas.

## 🛡️ Invariantes & Gobernanza (Reglas Absolutas)
1. **Seguridad Zero-Trust & Zero-Ports:** Todo corre tras un proxy inverso Nginx (`global-network`). El frontend o el backend nunca exponen sus puertos locales en `docker-compose.yml`.
2. **Privacidad de Código (Local-First):** Todo el escaneo de directorios ocurre localmente vía *File System Access API*. El backend Node se usa solo para configuraciones, filtros (`filtro.txt`), tickets de contacto y licencias.
3. **Manejo de Licencias (Monetización):** La aplicación bloquea explícitamente características premium detrás del `MonetizationStore` (validando SQLite).
4. **Diseño de Interfaz:** Se utiliza un patrón *Dense Form* para los inputs y modales. Cero popups no intrusivos. Las ventanas modales usan cabeceras del 100%.
5. **Testing (Quality Gate):** Mínimo 80% de code coverage en módulos críticos (59/59 unit tests pasados en Vitest).
6. **Estandarización de Layout UI/UX:** Toda página o vista nueva de la plataforma debe implementar obligatoriamente el contenedor unificado precedido por la secuencia de encabezado estándar (`<Breadcrumbs />` + `<PageHeader title subtitle badgeText />`). En código JSX, los resaltados de texto deben usar etiquetas HTML semánticas (`<strong>`, `<em>`) en lugar de sintaxis Markdown cruda (`**`).
7. **Integridad de Enrutamiento y Encapsulamiento en la Cáscara de la Biblioteca (`GenericTopicPage`):** Todas las rutas y guías de la biblioteca técnica (`/temas/*`) deben estar explícitamente registradas y resueltas en `App.jsx`, `Sidebar.jsx` (incluyendo `DEFAULT_TREE`) y `routesManifest.js`. Queda estrictamente prohibido permitir fallthroughs silenciosos. Además, todas las guías técnicas deben renderizarse obligatoriamente encapsuladas dentro del componente cáscara unificado `<GenericTopicPage />`.
8. **Sincronización Multilingüe i18n Obligatoria:** Todo nuevo módulo o guía técnica agregada debe incorporar sincrónicamente sus claves de traducción `MNU_*` en los 7 archivos JSON de localización (`public/locales/{es,en,pt,fr,de,zh,ja}/translation.json`) y en el mapeo `topicToMenuKey` de `GenericTopicPage.jsx`.

## 📚 Estado de las Olas de Expansión de la Biblioteca Técnica
- 🟢 **Ola A (NoSQL & Storage Distribuido)**: MongoDB Enterprise, Redis Cluster, Elasticsearch Vector Search, ClickHouse Analytics.
- 🟢 **Ola B (Multi-Cloud, GitOps & Observabilidad)**: Google Cloud Platform (GCP) Enterprise, Azure Enterprise Architecture, GitOps ArgoCD, Observabilidad OpenTelemetry & Grafana Loki.
- 🟢 **Ola C (Criptografía & Zero-Trust Architecture)**: PKI/TLS 1.3/Criptografía Post-Cuántica (Kyber/Dilithium), Zero-Trust Architecture & SPIFFE/SPIRE.
