# ADR 0009: Correccion de Importacion Faltante de PageHeader en Paginas de Landing
 
* **Fecha**: 2026-08-07
* **Estado**: Aceptado
 
## Contexto y Planteamiento del Problema
El usuario experimento un ReferenceError: PageHeader is not defined al navegar a las paginas de Terminos, Sobre Nosotros y Contacto en produccion.
 
## Decisión
Se agregaron las importaciones explicitas de PageHeader en TermsPage.jsx, AboutPage.jsx y ContactPage.jsx.
 
## Consecuencias
Eliminacion completa del error en runtime al navegar por paginas informativas y de contacto.
