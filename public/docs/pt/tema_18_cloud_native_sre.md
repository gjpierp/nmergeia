# Cloud Native, Serverless e Engenharia de Confiabilidade de Site (SRE)

O desenvolvimento **nativo da nuvem** e as práticas de **Engenharia de confiabilidade de site (SRE)** representam a metodologia moderna para projetar, implantar e operar aplicativos distribuídos de alta escala e tolerantes a falhas.

---

## 1. Princípios nativos da nuvem (o padrão de aplicativo de 12 fatores)

As aplicações Cloud Native seguem a metodologia dos 12 Fatores para garantir portabilidade, imutabilidade e escalabilidade em ambientes de nuvem:

1. **Codebase:** Um único repositório por microsserviço, múltiplas implantações (Dev, Staging, Prod).
2. **Dependências:** Declaradas explicitamente e isoladas (`package.json`, `Dockerfile`).
3. **Configuração:** Armazenada estritamente em **Variáveis ​​de Ambiente** (`process.env`), nunca no código-fonte.
4. **Serviços de apoio:** Trate os recursos de backup (bancos de dados, Redis, RabbitMQ) como recursos anexados acessíveis por URL/credenciais.
5. **Build, Release, Run:** Separação estrita entre as fases Build (compilação de imagens), Release (união com configuração) e Run (execução do contêiner).
6. **Processos sem estado:** O aplicativo deve executar processos sem estado. Qualquer estado persistente deve ser delegado a serviços externos (PostgreSQL, Redis).
7. **Port Binding:** Exporte serviços usando mapeamento de porta HTTP/TCP transparente.
8. **Simultaneidade:** Dimensione horizontalmente usando o modelo de processo (clonar pods/instâncias).
9. **Descarte

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

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
