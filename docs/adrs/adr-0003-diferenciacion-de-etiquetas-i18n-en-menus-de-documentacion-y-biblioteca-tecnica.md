# ADR-0003: Diferenciación de Etiquetas i18n entre Página de Documentación y Carpeta de Biblioteca Técnica

## Estado
**Aceptado** - 2026-08-04

## Contexto y Problema
En la barra lateral de navegación (`Sidebar.jsx`) y el manifiesto unificado de rutas (`routesManifest.js`), aparecían dos ítems visuales etiquetados de forma idéntica como **"Biblioteca Técnica"**:
1. Una entrada individual que enrutaba a la página estática `/docs` (cuyo código en el esquema i18n es `MNU_NMERGEIA_DOCS`).
2. Una carpeta contenedora desplegable (cuyo código es `CAT_NMERGEIA_GUIAS` / `CAT_NMERGEIA_N4_TEMAS`) que agrupa las 85+ guías técnicas y especialidades (*Data Science, PostgreSQL, Docker, MLOps, etc.*).

Esta colisión ocurrió porque scripts previos de actualización de traducciones asignaron el valor `"Biblioteca Técnica"` a ambas claves (`MNU_NMERGEIA_DOCS` y `CAT_NMERGEIA_N4_TEMAS`), generando confusión en la experiencia de navegación del usuario.

## Decisión Arquitectónica
1. **Desacoplar y diferenciar unívocamente las claves i18n**:
   - `MNU_NMERGEIA_DOCS` (Ruta `/docs`): Se establece de forma definitiva como **"Documentación del Sistema"** (*"System Documentation"* en inglés).
   - `CAT_NMERGEIA_GUIAS` / `CAT_NMERGEIA_N4_TEMAS` (Contenedor de cursos): Se mantiene como **"Biblioteca Técnica & Especialidades"** (*"Technical Library & Specialties"* en inglés).
2. **Sincronización Multilingüe**:
   - Se actualizaron las etiquetas correspondientes en los 7 diccionarios de idiomas (`es`, `en`, `fr`, `pt`, `de`, `ja`, `zh`) y en la constante `MENU_TREE` de [routesManifest.js](file:///c:/Local/nmerge/src/shared/lib/routesManifest.js).

## Consecuencias
- **Positivas**:
  - Eliminación del 100% de ambigüedad en el árbol de navegación.
  - El usuario distingue claramente entre la documentación de la aplicación `/docs` y el catálogo de formación técnica.
- **Invariante**: Queda prohibido asignar el nombre exacto de un contenedor de segundo nivel a un objeto navegable de primer nivel.
