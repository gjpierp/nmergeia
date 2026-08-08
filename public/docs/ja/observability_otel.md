# 📊 Guía Enterprise: Observabilidad OpenTelemetry, Grafana Loki & Prometheus

Bienvenido a la guía técnica sobre **Observabilidad Cloud-Native**. En este documento abordaremos desde la estandarización de telemetría con **OpenTelemetry (OTel)** hasta la agregación centralizada de logs con **Grafana Loki**, la recolección de métricas con **Prometheus** y la definición de **SLOs/SLIs** para alertas basadas en presupuesto de errores (*Error Budget*).

---

## 👁️ 1. Los 3 Pilares de la Observabilidad moderna

La observabilidad no consiste en tener dashboards coloridos, sino en la capacidad de inferir los estados internos de un sistema complejo basándose en sus salidas externas.

```
                  +-----------------------------------+
                  |         OPENTELEMETRY             |
                  |     (Estándar Unificado OTLP)     |
                  +-----------------+-----------------+
                                    |
         +--------------------------+--------------------------+
         |                          |                          |
+--------v--------+        +--------v--------+        +--------v--------+
|    TRACES       |        |    METRICS      |        |     LOGS        |
| (Jaeger/Tempo)  |        |  (Prometheus)   |        |  (Grafana Loki) |
| Latencias/DAGs  |        | Contadores/Gauge|        |  Eventos Texto  |
+-----------------+        +-----------------+        +-----------------+
```

---

## 🔄 2. Arquitectura de OpenTelemetry Collector (OTel Collector)

El **OTel Collector** es un proxy de telemetría sin estado que recibe, procesa y exporta datos de métricas, trazas y logs hacia múltiples backends.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
    timeout: 1s
    send_batch_size: 1024
  memory_limiter:
    check_interval: 1s
    limit_percentage: 75

exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"
  otlp/tempo:
    endpoint: "tempo.monitoring.svc:4317"
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlp/tempo]
    metrics:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [prometheus]
```

### 2.1 Trazabilidad Distribuida & W3C Trace Context
OpenTelemetry inyecta la cabecera estándar `traceparent` (`00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`) en las peticiones HTTP/gRPC entre microservicios.

Esto permite rastrear el camino completo de una transacción a través de decenas de microservicios distribuidos, identificando exactamente qué servicio introdujo latencia o falló.

---

## 📜 3. Agregación de Logs con Grafana Loki

Grafana Loki adopta el enfoque de "indexar solo las etiquetas, no el texto del log".

Al no indexar el contenido completo del mensaje de log, el consumo de memoria RAM de Loki disminuye en un **90%** comparado con Elasticsearch, permitiendo almacenar terabytes de logs a un costo mínimo en almacenamiento de objetos.

```logql
# Consulta LogQL para filtrar errores HTTP 5xx en microservicio de pagos
{app="payment-api", environment="production"} |= "status=5" | json | latency > 500ms
```

---

## 🎯 4. SLO, SLI & Presupuesto de Errores (Error Budgeting)

- **SLI (Service Level Indicator)**: Métrica en tiempo real (ej. % de peticiones exitosas devueltas en menos de 200 ms).
- **SLO (Service Level Objective)**: Objetivo prometido (ej. 99.9% de éxito en 30 días).
- **Error Budget (Presupuesto de Errores)**: El 0.1% de margen permitido para fallas o experimentos.

$$\text{Error Budget} = 100\% - \text{SLO} = 0.1\%$$

Si el presupuesto de errores se agota a mitad de mes, el sistema congela automáticamente los nuevos despliegues de características para priorizar tareas de resiliencia y estabilidad.

---
*Documento de Ingeniería Avanzada de Software - NMerge IA Enterprise Labs.*
