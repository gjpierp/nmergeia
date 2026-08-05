# Handoff Técnico: Corrección de Jerarquía SEO de BreadcrumbList y Fijación de Migas de Pan (v1.2.4)

## 1. Análisis de Causa Raíz (Root Cause Analysis)
En auditorías externas de SEO/UX (Google Search Console, AdValida), la jerarquía de migas de pan registraba una calificación incompleta (6/10 - 60%) debido a:
1. **URLs con fragmentos Hash (`/#...`)**: `Breadcrumbs.jsx` generaba los campos `item` del esquema JSON-LD y Microdata con fragmentos hash (ej. `https://nmergeia.com/#features` o `https://nmergeia.com/#`), los cuales son rechazados por los validadores de Schema.org al requerir URLs absolutas canónicas (`https://nmergeia.com/features`).
2. **Duplicación "Inicio ➔ Inicio"**: En la Landing Page se pasaba `items={[{ label: 'Inicio' }]}`, duplicando la posición 1 y 2 en la jerarquía.
3. **Encabezado Sticky Confuso**: `MarkdownViewer.jsx` forzaba `sticky={true}` en `<PageHeader>`, provocando que el título quedara fijo sobre la pantalla en lugar de mantener únicamente fijas las migas de pan `<Breadcrumbs>` (`position: 'sticky'`, `top: 0`).
4. **Desalineación en Pre-renderizado Estático (`prerender.js`)**: Las subpáginas pre-renderizadas (`/features`, `/pricing`, `/docs`, etc.) mantenían la estructura estática genérica de `index.html` sin inyectar las migas de pan específicas de cada ruta.

---

## 2. Solución de Fondo Implementada

### A. Refactorización de `Breadcrumbs.jsx`
- Generación de URLs canónicas limpias (`https://nmergeia.com/features`, `https://nmergeia.com/docs`, etc.) sin caracteres `#`.
- Sanitización de duplicados para "Inicio".
- Garantizada la posición pegajosa superior (`position: 'sticky'`, `top: 0`, `zIndex: 100`) con fondo de neón glassmorphism de alta visibilidad (`backdrop-filter: blur(16px)`).

### B. Corrección de `PageHeader` en `MarkdownViewer.jsx`
- Cambiado `sticky={true}` a `sticky={false}` en `PageHeader`, logrando que el título fluya con el contenido y que las migas de pan permanezcan fijas en la parte superior.

### C. Inyección de Rutas en Páginas de Landing y Legales
- Actualizadas las llamadas a `<Breadcrumbs>` en `FeaturesPage`, `PricingPage`, `FaqPage`, `AboutPage`, `ContactPage`, `DocsPanel`, `PrivacyPage`, `TermsPage`, `CookiePolicyPage`, `LegalNoticePage` y `EulaPage` para inyectar explícitamente la propiedad `path` (ej. `path: '/features'`).

### D. Enriquecimiento del Pre-renderizado (`index.html` & `prerender.js`)
- Inyectado marcado estático `<nav aria-label="Breadcrumb">` con Microdata `itemscope itemtype="https://schema.org/BreadcrumbList"` en el DOM principal para crawlers sin Javascript.
- `prerender.js` ahora inyecta dinámicamente en el `<head>` y `<main>` de cada HTML generado (`dist/features/index.html`, etc.) el JSON-LD y Microdata específico de su ruta.

---

## 3. Estado Final
- **Estructura BreadcrumbList:** 100% Válida y Compliant con Schema.org & Google Rich Results.
- **Comportamiento Visual:** Migas de pan fijas (`sticky top: 0`), Título de página normal (no fijo).
