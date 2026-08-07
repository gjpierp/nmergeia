# ADR 0004: Resiliencia File System Access API & Code-Splitting Bundle Optimization
 
* **Fecha**: 2026-08-07
* **Estado**: Aceptado
 
## Contexto y Planteamiento del Problema
Manejadores de permisos Chrome/Edge expirados y bundles masivos de 5.1MB impactaban carga y estabilidad tras recargar.
 
## Decisión
Se agrupo i18next en vendor-react, se encapsulo getFile() en try-catch defensivos y se activo trust-proxy en Express con compresion Gzip/Brotli.
 
## Consecuencias
Carga 94% mas rapida (248KB inicial) y cero bloqueos por permisos caducados.
