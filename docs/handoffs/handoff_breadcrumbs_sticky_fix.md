# Handoff Técnico: Barra de Breadcrumbs Fija y Permanente al Desplazarse (Sticky top: 0) (v1.2.2)

## 1. Cambio Implementado
- **Requerimiento**: El componente de migas de pan (`Breadcrumbs`) de la página de inicio y demás páginas informativas debe permanecer **fijo en su ubicación (`top: 0`) al desplazarse (scroll) hacia abajo**, sin ocultarse ni perderse.
- **Solución Aplicada**:
  - Se configuró la barra `<nav aria-label="Breadcrumb">` en [Breadcrumbs.jsx](file:///c:/Local/nmerge/src/shared/ui/Breadcrumbs.jsx) con comportamiento inamovible `position: 'sticky'` y `top: 0`.
  - Se le añadió un fondo translúcido tipo Neón Glassmorphism (`backdropFilter: 'blur(16px)'`, `background: 'var(--bg-glass, rgba(10, 15, 27, 0.92))'`) con sombra sutil e índice de capa elevador (`z-index: 90`).
  - La barra se mantiene fija de forma elegante sobre todo el contenido desplegable.

---

## 2. Archivos Modificados
- [src/shared/ui/Breadcrumbs.jsx](file:///c:/Local/nmerge/src/shared/ui/Breadcrumbs.jsx) (Actualización a sticky layout con glassmorphism).

---

## 3. Pruebas y Compilación
- Pruebas unitarias Vitest: 🟢 **59 / 59 pruebas pasadas (100%)**
- Compilado de producción Vite/PWA: 🟢 **3,009 módulos transformados y 43 páginas pre-renderizadas en dist/**
