# Agentes de IA en el Workflow de Desarrollo

Los **Agentes Autónomos de Código** representan el siguiente salto evolutivo tras herramientas como GitHub Copilot. Mientras que un asistente tradicional solo completa la línea actual de código, un *Agente* puede razonar, planificar, leer tu sistema de archivos, ejecutar comandos en terminal y auto-corregir sus errores.

## 1. Anatomía de un Agente de Software
Un agente no es solo un modelo (LLM). Es un sistema compuesto por:
* **El Cerebro (El Modelo):** Quien toma decisiones lógicas. (Ej: GPT-4o, Claude 3.5 Sonnet).
* **El Prompt de Sistema (Directivas):** Reglas inquebrantables que definen su personalidad y restricciones (Ej: "Nunca borres la base de datos sin preguntar", "Usa arquitectura hexagonal").
* **Herramientas (Tool Calling / Function Calling):** Habilidades que el orquestador le expone al LLM. Si el LLM necesita leer un archivo, emite una estructura JSON solicitando `read_file("/src/app.js")`.
* **Memoria y Contexto:** Capacidad de recordar el historial del chat o usar *RAG* para buscar en el código base.

## 2. Orquestación Multi-Agente (Swarm Intelligence)
Los problemas complejos no los resuelve un solo agente monolítico; se dividen en equipos o enjambres (Swarm).
* **Orquestador (Router):** Recibe la petición del humano, genera un plan y decide qué sub-agentes invocar.
* **Agentes Especialistas:**
  * *Product Agent:* Escribe historias de usuario y requerimientos.
  * *Design/Frontend Agent:* Genera componentes visuales.
  * *Backend Agent:* Escribe APIs y lógica de negocio.
  * *Security/QA Agent:* Intenta hackear el código o escribe tests unitarios.

## 3. Protocolos de Handoff (Relevos)
Cuando el *Backend Agent* termina de escribir una API, no le manda un mensaje informal al *Frontend Agent*. Usa un artefacto estricto llamado **Handoff (Contrato de Entrega)**. Este archivo (usualmente un `.md` o `.json`) contiene el estado del trabajo, el payload (ej. la especificación OpenAPI), y restricciones para la siguiente fase. El agente receptor lee este documento en frío (Cold Start) y continúa el trabajo sin pérdida de contexto.

## 4. Peligros y Guardrails (Mecanismos de Defensa)
Darle acceso de terminal a un LLM es peligroso. Requiere contramedidas:
* **Human-in-the-Loop (HitL):** El agente propone el comando (Ej: `npm run build`), pero la terminal no lo ejecuta hasta que el usuario humano apruebe.
* **Sandboxing:** Los agentes se ejecutan en contenedores efímeros de Docker.
* **Circuit Breakers (Rompe-bucles):** Si el agente intenta arreglar el mismo error de compilación 3 veces y falla, el sistema debe cortar el proceso y pedir ayuda humana para evitar quemar todo el presupuesto (Token Burn).
* **Data Loss Prevention (DLP):** Filtros antes de enviar el prompt a la nube para enmascarar contraseñas reales (`[SECRET_MASKED]`).
