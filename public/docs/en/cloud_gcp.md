# ☁️ Guía Enterprise: Google Cloud Platform (GCP), Cloud Run & BigQuery

Bienvenido a la guía de arquitectura corporativa sobre **Google Cloud Platform (GCP)**. En este documento exploraremos desde la gestión global de identidades (IAM) y la infraestructura Serverless con **Cloud Run** hasta la orquestación distribuida en **GKE Autopilot** y la analítica masiva en **BigQuery**.

---

## 🏗️ 1. Filosofía de Infraestructura Global de Google

GCP opera sobre la misma red privada de fibra óptica de baja latencia que sostiene los servicios masivos de Google.

A diferencia de otros proveedores en la nube donde las redes están confinas regionalmente por defecto, VPC (Virtual Private Cloud) en Google Cloud es un recurso global. Esto permite conectar recursos ubicados en distintos continentes dentro del mismo segmento de red interna de forma transparente y sin necesidad de complejos túneles VPN interregionales.

```
                    +-----------------------------+
                    |  GOOGLE CLOUD LOAD BALANCER | (IP Anycast Global Única)
                    +--------------+--------------+
                                   |
         +-------------------------+-------------------------+
         |                                                   |
+--------v----------------------+           +----------------v---------------+
| REGIONAL CLOUD RUN (us-east1) |           | REGIONAL CLOUD RUN (europe-west1)|
+-------------------------------+           +--------------------------------+
```

---

## ⚡ 2. Compute Serverless: Cloud Run & Contenedores

Cloud Run es la plataforma administrada de cómputo serverless de GCP que permite ejecutar contenedores directamente sin gestionar nodos ni clústeres.

Escala automáticamente desde cero hasta miles de instancias concurrentes respondiendo a la demanda en tiempo real.

```bash
# Desplegar una aplicación de microservicio en Cloud Run con HTTP/2 e IAM estricto
gcloud run deploy enterprise-auth-api \
  --image=gcr.io/enterprise-project/auth-api:v1.2.0 \
  --region=us-central1 \
  --platform=managed \
  --no-allow-unauthenticated \
  --concurrency=80 \
  --cpu=2 \
  --memory=2Gi \
  --min-instances=2 \
  --max-instances=100 \
  --set-env-vars="NODE_ENV=production,DB_HOST=10.0.0.5"
```

### 2.1 Concurrencia y Min-Instances para Eliminar Arranques en Frío (Cold Starts)
A diferencia de AWS Lambda donde cada contenedor maneja solo una petición concurrente a la vez, Cloud Run permite que una sola instancia procese hasta **250 peticiones simultáneas**.

Al configurar `--min-instances=2`, se mantienen siempre instancias en memoria caliente para garantizar tiempos de respuesta en sub-milisegundos sin sufrir latencia por arranques en frío.

---

## 📊 3. BigQuery: Data Warehouse Serverless a Escala Petabyte

BigQuery es el almacén de datos analítico (*Data Warehouse*) de GCP sin servidor. Utiliza la arquitectura **Dremel** para dividir consultas SQL masivas entre miles de trabajadores concurrentes.

Almacena datos en formato columnar **Capacitor** comprimido con optimización de diccionario y decodificación RLE.

```sql
-- Consulta analítica optimizada con particionado por fecha y clúster por tenant
SELECT 
    tenant_id,
    event_type,
    COUNT(1) AS total_events,
    ROUND(AVG(response_time_ms), 2) AS avg_latency
FROM `enterprise-project.analytics.user_events`
WHERE event_date BETWEEN DATE('2026-08-01') AND DATE('2026-08-07')
GROUP BY tenant_id, event_type
HAVING total_events > 1000
ORDER BY total_events DESC;
```

---

## 📦 4. Pub/Sub & Cloud Spanner

### 4.1 Pub/Sub: Bus de Eventos Asíncronos
Pub/Sub proporciona mensajería global orientada a eventos con latencia en milisegundos y retención de mensajes con garantías de entrega *at-least-once*.

### 4.2 Cloud Spanner: Base de Datos Transaccional Global
Cloud Spanner combina la consistencia ACID de una base de datos relacional tradicional con la escalabilidad horizontal ilimitada de una NoSQL. Utiliza **TrueTime API** (relojes atómicos y GPS en los centros de datos) para coordinar transacciones distribuidas sin bloqueos.

---

## 🛡️ 5. Gobernanza IAM y Principio de Menor Privilegio

```json
{
  "bindings": [
    {
      "role": "roles/run.invoker",
      "members": [
        "serviceAccount:internal-gateway-sa@enterprise-project.iam.gserviceaccount.com"
      ]
    }
  ]
}
```

La asignación de permisos debe basarse en cuentas de servicio dedicadas (*Service Accounts*) aisladas por proyecto. Jamás utilice claves JSON estáticas descargadas; aplique **Workload Identity Federation** en pipelines CI/CD de GitHub Actions o GitLab.

---
*Documento de Ingeniería Avanzada de Software - NMerge IA Enterprise Labs.*
