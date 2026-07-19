# Roadmap de NMerge

🟢 **Fase 0: Pragmatismo No-Code, Diseño Base y Roadmap**
- [x] Definición del objetivo y stack tecnológico.
- [x] Establecimiento de Reglas Base.

🟢 **Fase 1: Definición, Datos, Topología Edge y Legal**
- [x] Inicialización del monolito App.jsx.
- [x] Implementación de File System Access API.
- [x] Aislamiento de Puertos (Zero-Ports, Nginx Proxy).
- [x] Integración de base de datos SQLite (para licencias).

🟢 **Fase 2: Documentación, Contratos y Arquitectura Viva (API-First)**
- [x] Especificación OpenAPI 3.0 en `openapi.yaml`.
- [x] Creación de `CONTEXT.md` y `ROADMAP.md`.

🟡 **Fase 3: Desarrollo Core (Hexagonal), TDD y Verificación Formal**
- [x] Extracción y Refactorización del Core UI (MatrixView, DiffView, Sidebar).
- [x] Desacoplamiento de App.jsx completo.
- [x] TDD y pruebas unitarias (FileSystemService, MonetizationStore).
- [x] Ampliación de Tests Unitarios de UI (MatrixView, DiffView) al >80% de cobertura.

🟢 **Fase 4: Seguridad Post-Cuántica, DevOps, Despliegue y FinOps**
- [x] Revisión SAST y DAST en el Frontend/Backend.
- [x] Hardening de la imagen Docker.

🟢 **Fase 5: Gemelos Digitales, SRE, Evolución y Telemetría**
- [x] Observabilidad (Métricas de negocio / telemetría simulada).
- [x] Resiliencia (Auto-Healing de la infraestructura local).
