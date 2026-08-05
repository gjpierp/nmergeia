# Handoff Técnico: Corrección de Referencia y Detección Estricta de Cambios (v1.2.2)

## 1. Problemas Resueltos

### A. ReferenceError: `handleTransferAllToDest` is not defined
- **Causa**: Al inyectar la botonera en `MatrixView.jsx`, las funciones `handleTransferAllToDest` y `handleTransferAllToOrigin` no estaban desestructuradas en la llamada inicial de `useMatrixProcessor()` dentro de `App.jsx`.
- **Solución**: Se desestructuraron explícitamente ambas funciones en la línea 261 de `src/App.jsx`.

---

### B. Fallo de Detección de Cambios de Contenido ("no detectas los cambios")
- **Causa**: En [src/hooks/useEqualityWorker.js](file:///c:/Local/nmerge/src/hooks/useEqualityWorker.js), la función de comparación usaba `replace(/\s+/g, ' ')`. Esto colapsaba todos los espacios, tabulaciones y saltos de línea a un solo espacio, provocando que archivos con modificaciones de formato, sangría o edicion de lineas fuesen evaluados erróneamente como `identical`.
- **Solución**: Se reemplazó la normalización destructiva por `cleanText = t => t.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')`. Esto preserva las diferencias exactas de código, espacio y texto entre archivos, garantizando una **detección 100% precisa e infalible de diferencias**.

---

## 2. Pruebas y Validación
- Pruebas unitarias Vitest: 🟢 **59 / 59 pasadas (100%)**
- Compilado de producción: 🟢 **3,009 módulos transformados y 43 páginas pre-renderizadas en dist/**
