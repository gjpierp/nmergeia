/**
 * =====================================================================
 * Módulo de Protección Anti-Copia, Anti-Clonado y Marcas de Agua (DLP)
 * NMerge IA - StackUpIA Software Labs
 * =====================================================================
 */

export function initContentProtection() {
  if (typeof window === 'undefined') return;

  // 1. Inyección de Marca de Agua y Copyright únicamente en Producción
  document.addEventListener('copy', (e) => {
    // En entorno de desarrollo no alterar el portapapeles
    if (import.meta.env.DEV) return;

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
    if (import.meta.env.DEV) return;
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('.monaco-editor')) {
      return;
    }
    e.preventDefault();
  });

  // 3. Prevenir Atajos de Teclado para Inspección / Ver Fuente (F12, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+C)
  document.addEventListener('keydown', (e) => {
    if (import.meta.env.DEV) return;
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.key.toLowerCase() === 'u') ||
      (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'c')) ||
      (e.ctrlKey && e.key.toLowerCase() === 's')
    ) {
      e.preventDefault();
    }
  });
}
