# ADR 0011: Persistencia de Estado de Filtros e Integracion de Ola A NoSQL
 
* **Fecha**: 2026-08-07
* **Estado**: Aceptado
 
## Contexto y Planteamiento del Problema
El usuario reporto que la desactivacion de reglas de filtro se reajustaba a activa al recargar y solicito persistencia permanente del estado de visibilidad, ademas de iniciar la Ola A del backlog.
 
## Decisión
Se corrigio parseRules en FiltersPanel.jsx para que respete isComment asignando active = !isComment, guardando las reglas inactivas como // + o // - en localStorage (nmerge_filter_local) y filtro.txt. Asimismo, se integraron las 4 guias tecnicas de la Ola A (MongoDB, Redis, Elasticsearch y ClickHouse) en routesManifest.js, App.jsx, Sidebar.jsx, prerender.js y sitemap.xml.
 
## Consecuencias
Persistencia inmediata al primer clic del estado del filtro respetada ante reinicio del navegador y expansion de la biblioteca tecnica con 4 nuevos temas NoSQL.
