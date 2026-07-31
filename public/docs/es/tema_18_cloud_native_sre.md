# Cloud Native, Serverless y Site Reliability Engineering (SRE)

El desarrollo **Cloud Native** y las prácticas de **Site Reliability Engineering (SRE)** representan la metodología moderna para diseñar, desplegar y operar aplicaciones distribuidas de alta escala y tolerancia a fallos.

---

## 1. Principios Cloud Native (El Estándar 12-Factor App)

Las aplicaciones Cloud Native siguen la metodología de los 12 Factores para garantizar portabilidad, inmutabilidad y escalabilidad en entornos de nube:

1. **Codebase:** Un único repositorio por microservicio, múltiples despliegues (Dev, Staging, Prod).
2. **Dependencias:** Declaradas e aisladas explícitamente (`package.json`, `Dockerfile`).
3. **Configuración:** Estrictamente almacenada en **Variables de Entorno** (`process.env`), jamás en el código fuente.
4. **Backing Services:** Tratar recursos de respaldo (Bases de datos, Redis, RabbitMQ) como recursos adjuntos accesibles vía URL/credenciales.
5. **Construcción, Lanzamiento, Ejecución:** Separación estricta entre la fase de Build (compilación de imagen), Release (unión con config) y Run (ejecución de contenedor).
6. **Procesos Stateless:** La aplicación debe ejecutar procesos sin estado. Cualquier estado persistente debe delegarse a servicios externos (PostgreSQL, Redis).
7. **Port Binding:** Exportar servicios mediante asignación transparente de puertos HTTP/TCP.
8. **Concurrencia:** Escalar horizontalmente mediante el modelo de procesos (clonar pods/instancias).
9. **Descartabilidad:** Inicio rápido y apagado gradual (*Graceful Shutdown* reaccionando a señales `SIGTERM`).
10. **Paridad entre Dev y Prod:** Mantener entornos de desarrollo y producción lo más idénticos posible.
11. **Logs como Streams:** Tratar logs como flujos continuos de eventos hacia `stdout` / `stderr`.
12. **Procesos de Administración:** Ejecutar tareas administrativas/migraciones como procesos únicos de una sola vez.

---

## 2. Serverless vs Containers (CaaS)

```mermaid
graph LR
    IaaS[IaaS: VMs / EC2] -->|Abstracción| PaaS[PaaS / Containers K8s]
    PaaS -->|Abstracción Total| Serverless[Serverless: AWS Lambda / Fargate]
```

* **Serverless (FaaS):** Modelo basado en eventos de ejecución efímera. Auto-escala de $0$ a miles de instancias bajo demanda y cobra únicamente por los milisegundos reales de cómputo consumidos.
* **Graceful Shutdown Pattern en Node.js (Cloud Native):**
```javascript
const server = app.listen(3005, () => console.log('Server running on 3005'));

process.on('SIGTERM', () => {
  console.log('SIGTERM recibido. Cerrando conexiones HTTP de forma gradual...');
  server.close(() => {
    console.log('Servidor HTTP cerrado. Desconectando Base de Datos...');
    db.destroy().then(() => process.exit(0));
  });
});
```

---

## 3. Arquitectura SRE: SLI, SLO y Presupuesto de Error (Error Budget)

SRE es la disciplina que aplica principios de ingeniería de software a las operaciones de infraestructura.

### A. Definición de Métricas Core SRE:
* **SLI (Service Level Indicator):** La medida cuantitativa real del rendimiento del servicio.
  $$\text{SLI} = \frac{\text{Número de Peticiones Exitosas } (< 200\text{ms})}{\text{Número Total de Peticiones}} \times 100\%$$
* **SLO (Service Level Objective):** El objetivo meta acordado internamente (ej. $99.9\%$ de peticiones exitosas al mes).
* **Error Budget:** La cuota de error permitida ($100\% - \text{SLO}$). Para un SLO del $99.9\%$, el presupuesto de error es $0.1\%$.

```gherkin
FEATURE: Gobierno de Despliegues por Error Budget
  GIVEN un SLO mensual de disponibilidad del 99.9%
  AND un Error Budget consumido del 100% debido a incidentes Sev-1
  WHEN un equipo de desarrollo intenta desplegar una nueva feature a Producción
  THEN el pipeline de CI/CD debe congelar el despliegue de características
  AND permitir únicamente hotfixes de estabilidad y mejoras SRE
```

---

## 4. Observabilidad: Los Tres Pilares (Logs, Metrics, Traces)

```mermaid
flowchart TD
    Logs[Logs Estructurados JSON] --> Observability[Observabilidad Total]
    Metrics[Métricas PromQL / Grafana] --> Observability
    Traces[Distributed Traces OpenTelemetry] --> Observability
```

1. **Logs (Registros):** Eventos discretos codificados en JSON estructurado para indexación en ELK o Loki.
2. **Metrics (Métricas):** Datos agregados en series temporales (CPU, Latencia p99, Error Rate) visualizados en Grafana.
3. **Traces (Trazas Distribuidas):** Seguimiento del ciclo de vida de una petición HTTP a través de múltiples microservicios utilizando cabeceras `W3C Trace Context` (`traceparent`).
