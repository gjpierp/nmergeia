# Handoff Técnico: Botonera de Acciones y Sincronización Masiva en Vista Matriz de Resultados (v1.2.2)

## 1. Funcionalidad Implementada
Se integró una **Botonera de Acciones Completa y Funcional** en la barra superior de la vista de matriz de resultados (`MatrixView.jsx`).

### Botones Integrados en la Barra Superior:
1. 🔄 **Refrescar / Re-procesar (`sync`)**:
   - Re-escanea de forma inmediata las carpetas comparadas y actualiza la matriz de diferencias.
2. ➡️ **Copiar Todo ➔ Destino (`arrow_forward`)**:
   - Ejecuta `handleTransferAllToDest`: Transfiere en 1-clic **todos** los archivos con diferencias o inexistentes desde el Origen hacia el Destino.
   - **Filtro Inteligente**: Los archivos identicos son omitidos sin sufrir escrituras en disco.
3. ⬅️ **Copiar Todo ➔ Origen (`arrow_back`)**:
   - Ejecuta `handleTransferAllToOrigin`: Transfiere en 1-clic **todos** los archivos con diferencias o inexistentes desde el Destino hacia el Origen.
   - **Filtro Inteligente**: Los archivos identicos son ignorados.
4. 🔀 **Invertir Carpetas (`swap_vert`)**:
   - Ejecuta `swapFolders`: Invierte de manera instantánea el Origen con el Destino y refresca los resultados.
5. 👁️ **Filtro Solo Cambios (`difference`)**:
   - Alterna entre mostrar la matriz completa o únicamente las filas que contienen diferencias.

---

## 2. Archivos Afectados
- [src/hooks/useMatrixProcessor.js](file:///c:/Local/nmerge/src/hooks/useMatrixProcessor.js) (`handleTransferAllToDest`, `handleTransferAllToOrigin`)
- [src/features/matrix/MatrixView.jsx](file:///c:/Local/nmerge/src/features/matrix/MatrixView.jsx) (Barra superior de acciones de la matriz)
- [src/App.jsx](file:///c:/Local/nmerge/src/App.jsx) (Paso de props hacia `MatrixView`)

---

## 3. Pruebas y Validación
- Pruebas unitarias Vitest: 🟢 **59 / 59 pruebas pasadas (100%)**
- Compilado de producción Vite/PWA: 🟢 **3,009 módulos transformados y 43 páginas pre-renderizadas en dist/**
