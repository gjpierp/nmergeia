# Contexto del Proyecto: NMerge

> **Objetivo Core del negocio (North Star):**
> Proveer una herramienta local ultrarrápida para sincronización de directorios (diff/merge), gestión de perfiles y resolución de conflictos entre ramas/archivos de forma visual. El sistema ofrece un modo básico y un modelo "Pro" con características avanzadas verificables mediante licencia local.

## Stack Tecnológico Inmutable
- **Frontend:** React + Vite, Zustand (Manejo de estado), Monaco Editor (Visualización de código/diferencias).
- **Backend/API:** Node.js + Express.js.
- **Base de Datos:** SQLite (para verificación de licencias y configuraciones de estado locales).
- **Infraestructura:** Docker + Docker Compose, Nginx (Proxy inverso - Zero Ports).
- **API FileSystem:** Uso intensivo de *File System Access API* en el navegador para manipulación local (no sube archivos a un backend, procesa local).

## Invariantes (Reglas absolutas)
1. **Seguridad Zero-Trust & Zero-Ports:** Todo corre tras un proxy inverso Nginx (`global-network`). El frontend o el backend nunca exponen sus puertos locales en `docker-compose.yml`.
2. **Privacidad de Código (Local-First):** Todo el escaneo de directorios ocurre localmente vía *File System Access API*. El backend Node se usa solo para configuraciones, filtros (`filtro.txt`) y licencias.
3. **Manejo de Licencias (Monetización):** La aplicación debe bloquear explícitamente características premium detrás del `MonetizationStore` (validando SQLite).
4. **Diseño de Interfaz:** Se utilizará un patrón *Dense Form* para los inputs y modales. Cero popups no intrusivos. Las ventanas modales usan cabeceras del 100%.
5. **Testing (Quality Gate):** Mínimo 80% de code coverage en los módulos críticos.
