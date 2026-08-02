/**
 * =====================================================================
 * Módulo de Protección Anti-Copia, Anti-Clonado y Marcas de Agua (DLP)
 * NMerge IA - StackUpIA Software Labs
 * =====================================================================
 */

export function initContentProtection() {
  if (typeof window === 'undefined') return;

  // 1. Inyección de Marca de Agua y Copyright en el Portapapeles al copiar
  document.addEventListener('copy', (e) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length < 20) return;

    const selectionText = selection.toString();
    const sourceUrl = window.location.href;
    const copyrightNotice = `\n\n---
Contenido protegido extraído de NMerge IA (StackUpIA Software Labs)
Fuente original: ${sourceUrl}
Copyright © ${new Date().getFullYear()} NMerge IA. Todos los derechos reservados.
Queda prohibida su reproducción o clonación no autorizada.`;

    const customPayload = selectionText + copyrightNotice;

    if (e.clipboardData) {
      e.clipboardData.setData('text/plain', customPayload);
      e.preventDefault();
    }
  });

  // 2. Prevenir Menú Contextual (Clic Derecho) en páginas protegidas
  document.addEventListener('contextmenu', (e) => {
    // Permitir clic derecho en Monaco Editor o inputs
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('.monaco-editor')) {
      return;
    }
    e.preventDefault();
  });

  // 3. Prevenir Atajos de Teclado para Inspección / Ver Fuente (F12, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+C)
  document.addEventListener('keydown', (e) => {
    // Permitir en entornos de desarrollo o en inputs
    if (process.env.NODE_ENV === 'development') return;

    const isCtrl = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    // F12 (DevTools)
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }

    // Ctrl+U (Ver código fuente)
    if (isCtrl && key === 'u') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I / Ctrl+Shift+C / Ctrl+Shift+J (DevTools)
    if (isCtrl && e.shiftKey && (key === 'i' || key === 'c' || key === 'j')) {
      e.preventDefault();
      return false;
    }

    // Ctrl+S (Guardar página como HTML estático completo)
    if (isCtrl && key === 's') {
      e.preventDefault();
      return false;
    }
  });
}
