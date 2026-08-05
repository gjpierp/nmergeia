# Handoff Técnico: Resolución y Documentación de Duplicación de Menú (Documentación vs Biblioteca Técnica)

## 1. Resumen de Incidente y Documentación
- **ADR Registrado**: [adr-0003](file:///c:/Local/nmerge/docs/adrs/adr-0003-diferenciacion-de-etiquetas-i18n-en-menus-de-documentacion-y-biblioteca-tecnica.md)
- **RCA en Memoria Global**: Registrado en [LESSONS_LEARNED.md](file:///C:/Local/.agents/LESSONS_LEARNED.md)

---

## 2. Acciones Realizadas
1. **Diferenciación de Etiquetas**:
   - `MNU_NMERGEIA_DOCS` (`/docs`): **"Documentación del Sistema"**
   - `CAT_NMERGEIA_GUIAS` (Carpeta): **"Biblioteca Técnica & Especialidades"**
2. **Archivos Actualizados**:
   - [src/shared/lib/routesManifest.js](file:///c:/Local/nmerge/src/shared/lib/routesManifest.js)
   - Diccionarios i18n de 7 idiomas en `public/locales/`
3. **Verificación de Calidad**:
   - Pruebas unitarias e inspección de menús pasadas con éxito.
