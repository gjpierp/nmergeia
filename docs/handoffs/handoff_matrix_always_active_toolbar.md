# Handoff Técnico: Botonera de Matriz Permanente y Modal Inline Sin Salida de Página (v1.2.2)

## 1. Cambio Implementado
- **Requerimiento**: En la vista de matriz de resultados (`MatrixView.jsx`), **NUNCA se debe salir ni desmontar la página ni la botonera superior** cuando no existan archivos para comparar o cuando la búsqueda no devuelva coincidencias. El aviso debe mostrarse como un modal dentro de la vista de resultados.
- **Implementación**:
  - Se eliminó el bloque de `early return` destructivo que reemplazaba la página completa por una tarjeta vacía.
  - La **Botonera de Acciones Completa** (`Refrescar`, `Copiar Todo ➔ Destino`, `Copiar Todo ➔ Origen`, `Invertir`, `Solo Diffs`) y la cabecera de matriz permanecen **100% visibles, montadas y activas siempre**.
  - Cuando `filteredPaths.length === 0`, el área de la matriz renderiza una **tarjeta modal interactiva inline** con opciones para "Limpiar Búsqueda", "Mostrar Todas las Filas" o "Refrescar Comparación" directamente.

---

## 2. Archivos Modificados
- [src/features/matrix/MatrixView.jsx](file:///c:/Local/nmerge/src/features/matrix/MatrixView.jsx) (Eliminación de unmount destructivo y adición de modal inline permanente).

---

## 3. Pruebas de Validación
- Pruebas unitarias Vitest: 🟢 **59 / 59 pruebas pasadas (100%)**
- Compilado de producción Vite/PWA: 🟢 **3,009 módulos transformados y 43 páginas pre-renderizadas en dist/**
