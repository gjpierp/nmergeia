# ADR 0001: Solución a Error 502 Bad Gateway en Nginx con NMerge
 
* **Fecha**: 2026-07-24
* **Estado**: Aceptado
 
## Contexto y Planteamiento del Problema
El servidor Nginx global apunta a 'nmerge-app:3001'. Al usar 'npm run dev' nativamente, el contenedor se apaga y el proxy pierde conexión, generando 502.
 
## Decisión
En desarrollo, usar http://localhost:8085 (Vite HMR) para ver los cambios en caliente reales, y para nmergeia.local se debe usar 'npm run build' y 'docker compose up -d' ya que el backend estático de Node.js no soporta HMR a través del proxy inverso global.
 
## Consecuencias
Separación entre flujo de desarrollo (HMR local) y validación de proxy en Docker.
