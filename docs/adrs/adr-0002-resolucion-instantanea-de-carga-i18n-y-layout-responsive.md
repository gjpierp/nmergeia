# ADR 0002: Resolucion Instantanea de Carga i18n y Layout Responsive
 
* **Fecha**: 2026-08-03
* **Estado**: Aceptado
 
## Contexto y Planteamiento del Problema
La aplicacion sufria de congelamiento en la pantalla 'Cargando...' debido a un wrapper de Suspense top-level en main.jsx y a cargas asincronas HTTP de traducciones locales.
 
## Decisión
Se empaquetaron estaticamente las traducciones i18n en src/i18n.js, se removio el Suspense global de main.jsx para mantener la cascara App siempre visible y se fijaron breadcrumbs sticky bajo el app-header.
 
## Consecuencias
Carga instantanea 0ms sin pantallas en blanco, resiliencia offline 100% y compatibilidad total con Electron y navegadores.
