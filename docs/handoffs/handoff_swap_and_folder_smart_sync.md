# Handoff Técnico: Inversión de Carpetas (Swap) y Sincronización Inteligente de Carpetas (v1.2.2)

## 1. Funcionalidades Implementadas

### A. Botón para Invertir Carpetas de Origen y Destino (`swapFolders`)
- **Archivos Afectados**: 
  - [src/hooks/useFileHandles.js](file:///c:/Local/nmerge/src/hooks/useFileHandles.js)
  - [src/App.jsx](file:///c:/Local/nmerge/src/App.jsx)
  - [src/features/matrix/ui/MainScreen.jsx](file:///c:/Local/nmerge/src/features/matrix/ui/MainScreen.jsx)
  - Diccionarios i18n (`translation.json` en 7 idiomas)
- **Comportamiento**:
  - Permite intercambiar de forma instantánea la carpeta de Origen con cualquier ranura de Destino mediante el botón de inversión (`swap_vert`).
  - También disponible en la barra de acciones principal para 1-clic rápido de inversión.
  - Notifica con Toast de éxito y resetea el estado de procesamiento para re-comparar instantáneamente.

---

### B. Transferencia Inteligente de Carpetas (Solo Diferencias e Inexistentes)
- **Archivo Afectado**: [src/hooks/useMatrixProcessor.js](file:///c:/Local/nmerge/src/hooks/useMatrixProcessor.js) (`handleTransferFolder`)
- **Comportamiento**:
  - Al transferir una carpeta completa de Origen -> Destino (o Destino -> Origen), el algoritmo verifica el mapa de igualdad (`fileEqualityMap`), tamaño de archivo y fecha de modificación.
  - **Archivos Idénticos**: Se ignoran por completo (se les hace `continue` sin realizar escrituras ni modificaciones en disco).
  - **Archivos Diferentes o Inexistentes**: Se copian/sincronizan al destino.
  - **Notificación**: Al finalizar emite un resumen Toast: `Sincronización de carpeta finalizada: X archivo(s) transferido(s), Y idéntico(s) ignorado(s).`

---

## 2. Resultados de Pruebas
- Suite de pruebas unitarias Vitest: 🟢 **59 / 59 pruebas pasadas (100%)**
- Compilación de Producción: 🟢 **3,009 módulos transformados y 43 páginas pre-renderizadas en dist/**.
