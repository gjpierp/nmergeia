# ADR 0012: Solucion de Alertas GSC Pagina con Redireccion y Pagina Alternativa Canonical
 
* **Fecha**: 2026-08-07
* **Estado**: Aceptado
 
## Contexto y Planteamiento del Problema
Google Search Console reporto 24 paginas con redireccion y 23 paginas alternativas no indexadas debido a la falta de etiquetas rel canonical dinamicas en React y discrepancias en sitemap.xml.
 
## Decisión
Se agregaron bloques React Helmet con rel canonical dinámicos en todas las paginas principales y guias de la biblioteca, se corrigio el dominio nmergeia.local por nmergeia.com en politica-de-privacidad.html, y se incorporo la etiqueta hreflang x-default en generate-sitemap.js.
 
## Consecuencias
Indexacion limpia en Google Search Console, consolidacion canonica de URLs y eliminacion de duplicados.
