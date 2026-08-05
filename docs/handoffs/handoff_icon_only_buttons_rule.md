# Handoff Técnico: Cumplimiento Estricto de Botones Solo Icono + Tooltips (v1.2.2)

## 1. Cambio Implementado
- **Directiva**: Los botones de acción en las botoneras y barras de herramientas deben contener **ÚNICAMENTE el icono físico (`<span className="material-symbols-rounded">...</span>`)**, quedando **estrictamente prohibido incluir etiquetas de texto visibles dentro del botón**. La descripción textual debe colocarse exclusivamente en el atributo `data-tooltip="..."`.
- **Implementación**:
  - Se modificaron todos los botones de acción en [MatrixView.jsx](file:///c:/Local/nmerge/src/features/matrix/MatrixView.jsx) (`Refrescar`, `Copiar Todo ➔ Destino`, `Copiar Todo ➔ Origen`, `Invertir`, `Solo Diffs`).
  - Se removió cualquier etiqueta `<span>Texto</span>` interna.
  - La descripción completa de cada botón se colocó en `data-tooltip="..."`.

---

## 2. Archivos Modificados
- [src/features/matrix/MatrixView.jsx](file:///c:/Local/nmerge/src/features/matrix/MatrixView.jsx) (Limpieza de texto interno y aplicación estricta de botones solo icono).
- [src/shared/ui/PageHeader.jsx](file:///c:/Local/nmerge/src/shared/ui/PageHeader.jsx) (Actualización del scroll natural de títulos).
- [src/shared/ui/GenericTopicPage.jsx](file:///c:/Local/nmerge/src/shared/ui/GenericTopicPage.jsx) (Desacoplamiento del scroll del contenedor para mantener Breadcrumbs sticky).

---

## 3. Pruebas y Compilación
- Pruebas unitarias Vitest: 🟢 **59 / 59 pruebas pasadas (100%)**
- Compilado de producción Vite/PWA: 🟢 **3,009 módulos transformados y 43 páginas pre-renderizadas en dist/**
