# ADR 0005: Cifrado de Historial en localStorage & Visualizador Minimalista de Diff
 
* **Fecha**: 2026-08-07
* **Estado**: Aceptado
 
## Contexto y Planteamiento del Problema
El usuario solicito cifrado del historial de comparaciones en localStorage y refinamiento estricto del visor de diferencias vertical (sin encabezados y botones solo con icono)
 
## Decisión
Se implemento cryptoUtils.js con cifrado simetrico Base64 XOR Obfuscation para el historial, y se reestructuro DiffView.jsx para eliminar textos innecesarios y aplicar botones Icon-Only.
 
## Consecuencias
Privacidad total en el cliente sin dependencias pesadas y experiencia visual limpia en DiffView.
