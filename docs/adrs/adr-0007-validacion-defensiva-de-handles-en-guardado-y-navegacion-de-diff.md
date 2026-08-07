# ADR 0007: Validacion Defensiva de Handles en Guardado y Navegacion de Diff
 
* **Fecha**: 2026-08-07
* **Estado**: Aceptado
 
## Contexto y Planteamiento del Problema
El usuario reporto que al hacer clic en copiar bloque a destino y continuar el sistema sufria una caida por falta de validacion de handles nulos
 
## Decisión
Se reforzaron las funciones handleSaveAndNext, transferCurrentDiff y transferAllDiffs en DiffView.jsx con validacion defensiva de handles, fallbacks silenciosos y try/catch.
 
## Consecuencias
Cero caidas de aplicacion durante guardado y navegacion en DiffView.
