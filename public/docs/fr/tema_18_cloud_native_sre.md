# Ingénierie Cloud Native, Serverless et Site Reliability (SRE)

Les pratiques de développement **Cloud Native** et de **Site Reliability Engineering (SRE)** représentent la méthodologie moderne pour concevoir, déployer et exploiter des applications distribuées à grande échelle et tolérantes aux pannes.

---

## 1. Principes du Cloud Native (la norme d'application à 12 facteurs)

Les applications Cloud Native suivent la méthodologie des 12 facteurs pour garantir la portabilité, l'immuabilité et l'évolutivité dans les environnements cloud :

1. **Codebase :** Un seul référentiel par microservice, plusieurs déploiements (Dev, Staging, Prod).
2. **Dépendances :** Explicitement déclarées et isolées (`package.json`, `Dockerfile`).
3. **Configuration :** Strictement stocké dans **Variables d'environnement** (`process.env`), jamais dans le code source.
4. **Services de sauvegarde :** Traitez les ressources de sauvegarde (bases de données, Redis, RabbitMQ) comme des ressources attachées accessibles via une URL/des informations d'identification.
5. **Build, Release, Run :** Séparation stricte entre les phases Build (compilation d'images), Release (union avec la configuration) et Run (exécution du conteneur).
6. **Processus sans état :** L'application doit exécuter des processus sans état. Tout état persistant doit être délégué à des services externes (PostgreSQL, Redis).
7. **Liaison de port :** Exportez les services à l'aide d'un mappage de port HTTP/TCP transparent.
8. **Concurrence :** Évoluez horizontalement à l'aide du modèle de processus (pods/instances clones).
9. **Jeter

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

abilidad:** Inicio rápido y apagado gradual (*Graceful Shutdown* reaccionando a señales `SIGTERM`).
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
