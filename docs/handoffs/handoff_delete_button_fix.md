# Handoff Técnico: Resolución de Funcionalidad de Borrado de Archivos (Origen y Destino)

## 1. Contexto y Diagnóstico del Incidente
- **Problema Reportado**: Los botones de borrado (icono de papelera) en la vista matricial (`MatrixView`) no ejecutaban la acción ni abrían el diálogo de confirmación al hacer clic sobre archivos de Origen o Destino.
- **Causa Raíz (Root Cause)**:
  1. En [MatrixView.jsx](file:///c:/Local/nmerge/src/features/matrix/MatrixView.jsx), los botones de borrado invocaban `handleDelete(originHandle, row.path, true)` haciendo referencia a una variable `originHandle` no declarada en el scope del componente en lugar de la propiedad `tab.originHandle`. Al pasar `undefined` como primer argumento, la función `handleDelete` en `useMatrixProcessor.js` ejecutaba un `if (!baseHandle) return;` que retornaba silenciosamente sin realizar ninguna acción.
  2. Ausencia de resolución transparente de handles de respaldo o notificaciones explícitas al usuario cuando un handle era nulo.

---

## 2. Solución Aplicada
1. **[src/features/matrix/MatrixView.jsx](file:///c:/Local/nmerge/src/features/matrix/MatrixView.jsx)**:
   - Se corrigieron los 3 handlers de borrado de origen para utilizar de forma explícita `tab.originHandle || originHandle`.
2. **[src/hooks/useMatrixProcessor.js](file:///c:/Local/nmerge/src/hooks/useMatrixProcessor.js)**:
   - Se mejoró la función `handleDelete` agregando resolución transparente de handles de respaldo a partir de la pestaña activa (`actualTab.originHandle` / `actualTab.processedDestSlots`).
   - Se agregaron notificaciones de error explícitas (`addToast`) con el mensaje devuelto por la API del navegador en lugar de silenciar excepciones.

---

## 3. Resultado de Verificación
- **Pruebas Unitarias (Vitest)**: 13/13 archivos de prueba verdes (59/59 tests pasados).
- **Linter (Oxlint)**: 0 Errores sintácticos en todo el codebase.
- **Funcionalidad UI**: El botón eliminar confirma y borra archivos correctamente tanto en Origen como en Destino.
