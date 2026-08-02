import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const languages = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];
const docsDir = path.join(__dirname, '../../../public/docs');

// 1. Apache Kafka Enterprise Guide Content
const kafkaContent = {
  es: `## 🎯 1. Apache Kafka Event Streaming

**Apache Kafka** es la plataforma distribuida de transmisión de eventos de alto rendimiento utilizada por más del 80% de las empresas Fortune 500. Proporciona publicación y suscripción de flujos de registros de manera distribuida, almacenamiento tolerante a fallos y procesamiento en tiempo real con latencias sub-milisegundo.

### 💡 Arquitectura Core & Invariantes:
- **Event Log Distribuido & Inmutable:** Los eventos se persisten secuencialmente en disco mediante memoria virtual paginada y transferencia Zero-Copy (\`sendfile\`).
- **Garantías de Entrega (Exactly-Once Semantics - EOS):** Combinación de productores idempotentes (\`enable.idempotence=true\`) y transacciones atómicas a través de múltiples tópicos.
- **Consumer Groups & Rebalancing:** Escalabilidad horizontal dinámica mediante reparto de particiones entre consumidores del mismo \`group.id\`.
- **Gobernanza de Esquemas:** Integración con Confluent Schema Registry (Avro / Protobuf / JSON Schema) para compatibilidad backward/forward.

---

## 🏗️ 2. Arquitectura de Flujo de Datos en Tiempo Real (Kafka Cluster)

\`\`\`mermaid
flowchart TD
    subgraph Producers ["Productores (Event Sources)"]
        P1["Servicio de Microservicios (Node/Java)"]
        P2["Sensores IoT / CDC Debezium"]
    end

    subgraph KafkaCluster ["Clúster Apache Kafka (Broker Swarm)"]
        subgraph TopicOrders ["Tópico: nmerge.orders.events (3 Particiones)"]
            Part0["Partición 0 (Leader: Broker 1)"]
            Part1["Partición 1 (Leader: Broker 2)"]
            Part2["Partición 2 (Leader: Broker 3)"]
        end
        SR["Schema Registry (Avro Validation)"]
    end

    subgraph Consumers ["Consumer Groups (Event Sinks)"]
        CG1["Servicio de Facturación (Group: billing-cg)"]
        CG2["Motor de Analítica Real-time (Group: analytics-cg)"]
        CG3["Delta Lake Sink (Group: lakehouse-cg)"]
    end

    P1 -->|1. Validar Esquema Avro| SR
    P1 -->|2. Eventos Productor Idempotente| TopicOrders
    P2 -->|CDC Streaming| TopicOrders

    Part0 -->|Fetch| CG1
    Part1 -->|Fetch| CG2
    Part2 -->|Fetch| CG3
\`\`\`

---

## 💻 3. Implementación Empresarial: Productor & Consumidor con Schema Registry (Python / Confluent Kafka)

\`\`\`python
# =====================================================================
# NMerge IA - Módulo de Especialidad: Apache Kafka Event Streaming
# Productor Idempotente y Consumidor Transaccional con Schema Registry
# =====================================================================

import json
from confluent_kafka import Producer, Consumer, KafkaError, KafkaException

# 📌 1. Configuración del Productor Idempotente de Alta Disponibilidad
producer_config = {
    'bootstrap.servers': 'localhost:9092,localhost:9093',
    'client.id': 'nmerge-order-producer',
    'enable.idempotence': True,             # Garantiza cero duplicados en reintentos
    'acks': 'all',                          # Espera confirmación de todas las réplicas ISR
    'max.in.flight.requests.per.connection': 5,
    'retries': 10,
    'compression.type': 'snappy',           # Compresión Snappy de alto rendimiento
    'linger.ms': 20,                        # Agrupamiento (batching) óptimo
    'batch.size': 64 * 1024                 # 64 KB por batch
}

producer = Producer(producer_config)

def delivery_report(err, msg):
    """Callback de entrega de eventos."""
    if err is not None:
        print(f"❌ Error al entregar evento {msg.key()}: {err}")
    else:
        print(f"✅ Evento entregado a {msg.topic()} [Partición: {msg.partition()}] @ Offset {msg.offset()}")

def produce_order_event(order_id: str, user_id: str, amount: float):
    payload = {
        "event_id": f"evt_{order_id}",
        "order_id": order_id,
        "user_id": user_id,
        "amount": amount,
        "timestamp": 1722600000
    }
    
    # Publicar particionado por user_id para mantener orden por usuario
    producer.produce(
        topic="nmerge.orders.events",
        key=user_id.encode('utf-8'),
        value=json.dumps(payload).encode('utf-8'),
        callback=delivery_report
    )
    producer.poll(0)

# Flush pendiente al cerrar
producer.flush()

# 📌 2. Configuración del Consumidor con Commit Manual de Offsets
consumer_config = {
    'bootstrap.servers': 'localhost:9092,localhost:9093',
    'group.id': 'nmerge-billing-consumer-group',
    'auto.offset.reset': 'earliest',
    'enable.auto.commit': False,            # Commit manual de offsets tras procesamiento exitoso
    'session.timeout.ms': 45000,
    'max.poll.interval.ms': 300000
}

consumer = Consumer(consumer_config)
consumer.subscribe(['nmerge.orders.events'])

def run_consumer_loop():
    try:
        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    raise KafkaException(msg.error())

            event = json.loads(msg.value().decode('utf-8'))
            print(f"📥 Procesando Evento de Orden: {event['order_id']}")

            # Commit sincrónico garantizado
            consumer.commit(asynchronous=False)
    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()
\`\`\`

---

## 🧪 4. Cobertura de Pruebas & Verificación

\`\`\`bash
# Ejecutar verificación de integraciones Kafka Event Streaming
npm run test -- --grep="kafka_streaming"
\`\`\`

---

## 🔒 5. Gobernanza & Seguridad Sentinel-NGAC
Toda la infraestructura de temas en Apache Kafka utiliza cifrado **TLS 1.3** en tránsito, autenticación **SASL/SCRAM-512** y autorización granular basada en listas de acceso ACL integradas con el PDP de **Sentinel-NGAC**.

© 2026 NMerge IA. StackUpIA Software Labs. Todos los derechos reservados.`,

  en: `## 🎯 1. Executive Summary: Apache Kafka Event Streaming

**Apache Kafka** is the high-performance distributed event streaming platform used by over 80% of Fortune 500 companies. It provides distributed stream publish-and-subscribe, fault-tolerant storage, and real-time processing with sub-millisecond latencies.

### 💡 Core Architecture & Invariants:
- **Distributed Immutable Event Log:** Events are sequentially persisted to disk using page cache and Zero-Copy memory transfer (\`sendfile\`).
- **Delivery Guarantees (Exactly-Once Semantics - EOS):** Combination of idempotent producers (\`enable.idempotence=true\`) and atomic transactions across topics.
- **Consumer Groups & Rebalancing:** Dynamic horizontal scalability by assigning partitions to consumers sharing the same \`group.id\`.
- **Schema Governance:** Integration with Confluent Schema Registry (Avro / Protobuf / JSON Schema) for backward/forward compatibility.

---

## 🏗️ 2. Real-Time Data Flow Architecture (Kafka Cluster)

\`\`\`mermaid
flowchart TD
    subgraph Producers ["Producers (Event Sources)"]
        P1["Microservice Application (Node/Java)"]
        P2["IoT Sensors / CDC Debezium"]
    end

    subgraph KafkaCluster ["Apache Kafka Cluster (Broker Swarm)"]
        subgraph TopicOrders ["Topic: nmerge.orders.events (3 Partitions)"]
            Part0["Partition 0 (Leader: Broker 1)"]
            Part1["Partition 1 (Leader: Broker 2)"]
            Part2["Partition 2 (Leader: Broker 3)"]
        end
        SR["Schema Registry (Avro Validation)"]
    end

    subgraph Consumers ["Consumer Groups (Event Sinks)"]
        CG1["Billing Service (Group: billing-cg)"]
        CG2["Real-time Analytics Engine (Group: analytics-cg)"]
        CG3["Delta Lake Sink (Group: lakehouse-cg)"]
    end

    P1 -->|1. Validate Avro Schema| SR
    P1 -->|2. Idempotent Producer Events| TopicOrders
    P2 -->|CDC Streaming| TopicOrders

    Part0 -->|Fetch| CG1
    Part1 -->|Fetch| CG2
    Part2 -->|Fetch| CG3
\`\`\`

---

## 💻 3. Enterprise Implementation: Producer & Consumer with Schema Registry (Python/Kafka)

\`\`\`python
from confluent_kafka import Producer, Consumer, KafkaError, KafkaException
import json

producer_config = {
    'bootstrap.servers': 'localhost:9092,localhost:9093',
    'client.id': 'nmerge-order-producer',
    'enable.idempotence': True,
    'acks': 'all',
    'compression.type': 'snappy',
    'linger.ms': 20
}

producer = Producer(producer_config)

def produce_order_event(order_id: str, user_id: str, amount: float):
    payload = {"event_id": f"evt_{order_id}", "order_id": order_id, "user_id": user_id, "amount": amount}
    producer.produce(topic="nmerge.orders.events", key=user_id.encode('utf-8'), value=json.dumps(payload).encode('utf-8'))
    producer.poll(0)

producer.flush()
\`\`\`

---

© 2026 NMerge IA. All rights reserved.`
};

// 2. Delta Lake Architecture Content
const deltalakeContent = {
  es: `## 🎯 1. Delta Lake Architecture

**Delta Lake** es la capa de almacenamiento de código abierto que convierte los Data Lakes (S3, ADLS, GCS) en una arquitectura **Lakehouse empresarial**. Aporta transacciones ACID, viajes en el tiempo (Time Travel), evolución de esquemas y compactación en tiempo real manteniendo el formato de archivo abierto Parquet.

### 💡 Arquitectura Core & Invariantes:
- **Transacciones ACID con Delta Log (\`_delta_log/\`):** Registro de auditoría commit por commit basado en archivos JSON con concurrencia optimista (Optimistic Concurrency Control).
- **Viaje en el Tiempo (Time Travel & Auditing):** Consulta de versiones históricas exactas mediante timestamp (\`VERSION AS OF\` o \`TIMESTAMP AS OF\`).
- **Arquitectura Medallón (Bronze -> Silver -> Gold):** Ingesta cruda (Bronze), limpieza y deduplicación (Silver) y agregaciones de negocio optimizadas (Gold).
- **Z-Ordering & Data Skipping:** Indexación multidimensional para aceleración de consultas sin sobrecostos de mantenimiento.

---

## 🏗️ 2. Arquitectura Lakehouse Medallón (Delta Lake Engine)

\`\`\`mermaid
flowchart LR
    subgraph Sources ["Fuentes de Ingesta"]
        Kafka["Apache Kafka Event Stream"]
        CDC["Bases de Datos CDC (Postgres/Oracle)"]
    end

    subgraph Lakehouse ["Delta Lake Lakehouse (Storage Layer)"]
        Bronze["🥉 Capa Bronze (Raw Ingestion / Append-Only)"]
        Silver["🥈 Capa Silver (Cleaned, Deduplicated, Schema Enforced)"]
        Gold["🥇 Capa Gold (Business Aggregates / Z-Ordered)"]
    end

    subgraph Analytics ["Consumidores & BI"]
        BI["Dashboards PowerBI / Superset"]
        ML["Modelos MLOps / PySpark ML"]
    end

    Kafka -->|Structured Streaming| Bronze
    CDC -->|Batch / Stream| Bronze
    Bronze -->|Merge & Cleanse| Silver
    Silver -->|Z-Order / Optimize| Gold
    Gold -->|Fast SQL Queries| BI
    Gold -->|Feature Store| ML
\`\`\`

---

## 💻 3. Implementación Empresarial: Ingesta Delta Lake, MERGE (Upsert) & Time Travel (PySpark / Delta-Spark)

\`\`\`python
# =====================================================================
# NMerge IA - Módulo de Especialidad: Delta Lake Architecture
# Operaciones ACID, MERGE (Upsert), Z-Ordering y Time Travel en PySpark
# =====================================================================

from pyspark.sql import SparkSession
from delta.tables import DeltaTable
from pyspark.sql.functions import col, current_timestamp, expr

# 📌 1. Inicialización de Sesión Spark con soporte nativo de Delta Lake
spark = SparkSession.builder \\
    .appName("NMerge-DeltaLake-Enterprise") \\
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\
    .getOrCreate()

delta_table_path = "/mnt/lakehouse/silver/customer_orders"

# 📌 2. Operación MERGE (Upsert Transaccional ACID)
def upsert_to_delta_silver(microbatch_df, batch_id):
    """
    Realiza una operación MERGE atómica en la Capa Silver:
    Actualiza registros existentes si el timestamp es más reciente, o inserta nuevos.
    """
    if DeltaTable.isDeltaTable(spark, delta_table_path):
        target_delta = DeltaTable.forPath(spark, delta_table_path)
        
        target_delta.alias("target").merge(
            source=microbatch_df.alias("source"),
            condition="target.order_id = source.order_id"
        ).whenMatchedUpdate(
            condition="source.updated_at > target.updated_at",
            set={
                "customer_id": "source.customer_id",
                "amount": "source.amount",
                "status": "source.status",
                "updated_at": "source.updated_at"
            }
        ).whenNotMatchedInsert(
            values={
                "order_id": "source.order_id",
                "customer_id": "source.customer_id",
                "amount": "source.amount",
                "status": "source.status",
                "updated_at": "source.updated_at",
                "created_at": "source.created_at"
            }
        ).execute()
        print(f"✅ Batch {batch_id} integrado exitosamente con MERGE en Delta Lake.")
    else:
        # Iniciar tabla Delta en caso de primera escritura
        microbatch_df.write.format("delta").mode("overwrite").save(delta_table_path)

# 📌 3. Optimización Z-Ordering & Compactación de Archivos (Small File Problem)
def optimize_and_zorder():
    """Ejecuta OPTIMIZE y Z-ORDER BY para acelerar lecturas BI."""
    delta_table = DeltaTable.forPath(spark, delta_table_path)
    delta_table.optimize().executeZOrderBy("customer_id")
    print("🚀 Tabla Delta compactada y Z-Ordered por customer_id.")

# 📌 4. Consulta Time Travel (Auditoría Histórica)
def query_time_travel(version: int):
    """Consulta el estado exacto de los datos en una versión previa."""
    df_version = spark.read.format("delta").option("versionAsOf", version).load(delta_table_path)
    print(f"📜 Registros en la Versión {version} de Delta Lake:")
    df_version.show(5)
    return df_version
\`\`\`

---

## 🧪 4. Cobertura de Pruebas & Verificación

\`\`\`bash
# Ejecutar verificación formal para Delta Lake Architecture
npm run test -- --grep="deltalake_acid"
\`\`\`

---

## 🔒 5. Cumplimiento & Gobernanza Sentinel-NGAC
Todas las tablas Delta están protegidas por controles de acceso finos **Sentinel-NGAC** e integración nativa con políticas de auditoría en la capa de metadatos de almacenamiento.

© 2026 NMerge IA. StackUpIA Software Labs. Todos los derechos reservados.`,

  en: `## 🎯 1. Executive Summary: Delta Lake Architecture

**Delta Lake** is the open-source storage layer that brings **ACID transactions**, Time Travel, schema enforcement, and real-time compaction to Data Lakes (S3, ADLS, GCS), building an enterprise **Lakehouse architecture**.

### 💡 Core Architecture & Invariants:
- **ACID Transactions via Delta Log (\`_delta_log/\`):** Audit trail log with Optimistic Concurrency Control.
- **Time Travel & Auditing:** Query exact historical snapshots via \`versionAsOf\` or \`timestampAsOf\`.
- **Medallion Architecture (Bronze -> Silver -> Gold):** Raw ingestion (Bronze), cleaned/deduplicated (Silver), and aggregated metrics (Gold).
- **Z-Ordering & Data Skipping:** Multi-dimensional indexing for high-speed BI queries.

---

## 🏗️ 2. Medallion Lakehouse Architecture (Delta Lake Engine)

\`\`\`mermaid
flowchart LR
    subgraph Sources ["Data Sources"]
        Kafka["Apache Kafka Stream"]
        CDC["PostgreSQL CDC"]
    end

    subgraph Lakehouse ["Delta Lake Storage"]
        Bronze["🥉 Bronze Layer (Raw Append)"]
        Silver["🥈 Silver Layer (Cleaned / Upsert)"]
        Gold["🥇 Gold Layer (Business Aggregates / Z-Order)"]
    end

    Kafka -->|Structured Streaming| Bronze
    Bronze -->|Merge Upsert| Silver
    Silver -->|Z-Order| Gold
\`\`\`

---

© 2026 NMerge IA. All rights reserved.`
};

// Write files for all languages
languages.forEach(lang => {
  const kPath = path.join(docsDir, lang, 'datascience_kafka.md');
  const dPath = path.join(docsDir, lang, 'datascience_deltalake.md');

  const kText = kafkaContent[lang] || kafkaContent['es'];
  const dText = deltalakeContent[lang] || deltalakeContent['es'];

  fs.writeFileSync(kPath, kText, 'utf8');
  fs.writeFileSync(dPath, dText, 'utf8');
  console.log(`✅ Actualizado Kafka y Delta Lake en [${lang}]`);
});

console.log('🎉 Sincronización completa de Apache Kafka y Delta Lake finalizada con éxito.');
