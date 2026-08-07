# ADR 0006: Gestión Completa de Carpetas en Matriz & Encabezado Unificado de Una Línea
 
* **Fecha**: 2026-08-07
* **Estado**: Aceptado
 
## Contexto y Planteamiento del Problema
El usuario solicitó unificar el encabezado de matriz en una sola línea compacta y agregar la capacidad de seleccionar y eliminar carpetas completas en Origen y Destino
 
## Decisión
Se actualizó MatrixView.jsx con toggleSelectFolder, isFolderSelected y handleDeleteFolder para operar sobre carpetas en lote, y se unificó el encabezado en una sola fila flexbox.
 
## Consecuencias
Gestión de directorios completa y encabezado limpio de alto rendimiento.
