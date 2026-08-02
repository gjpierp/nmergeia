import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');

const docsEsDir = path.join(projectRoot, 'public', 'docs', 'es');
const datascienceEsDir = path.join(docsEsDir, 'datascience');
const targetLangs = ['en', 'fr', 'pt', 'de', 'zh', 'ja'];

if (!fs.existsSync(datascienceEsDir)) {
  fs.mkdirSync(datascienceEsDir, { recursive: true });
}

console.log("🚀 Creando Sub-temas Especializados de Data Science (PySpark, Kafka, Delta Lake, MLOps, Polars)...");

const subTopics = [
  {
    fileName: 'datascience_pyspark.md',
    title: 'PySpark & Big Data: Procesamiento Distribuido en Memoria RAM',
    content: `# PySpark & Big Data: Procesamiento Distribuido en Memoria RAM

Cuando los volúmenes de datos exceden la capacidad de memoria RAM de un servidor individual (cargas de trabajo en la escala de Terabytes a Petabytes), los DataFrames tradicionales como Pandas fallan con errores fatales de memoria (Out-of-Memory / OOM). **Apache Spark** resuelve este desafío mediante un motor de cómputo distribuido que divide las tareas en grafos acíclicos dirigidos (DAGs) procesados en paralelo por un clúster de nodos (Master y Workers).

\`\`\`mermaid
flowchart TD
    Driver["Spark Driver (Master Node)"] -->|"Catalyst Optimizer"| DAG["Grafo DAG de Tareas"]
    DAG -->|"Distribución de Particiones"| Worker1["Worker Node 1 (Executor RAM/CPU)"]
    DAG -->|"Distribución de Particiones"| Worker2["Worker Node 2 (Executor RAM/CPU)"]
    DAG -->|"Distribución de Particiones"| Worker3["Worker Node 3 (Executor RAM/CPU)"]
\`\`\`

## 1. Arquitectura de Apache Spark y el Optimizador Catalyst

Apache Spark desacopla la lógica de programación (definida en Python con PySpark) del motor de ejecución binario escrito en Scala/Java sobre la JVM.

- **Spark Driver Node:** Coordina el programa principal, crea el \`SparkSession\`, compila el código en un plan lógico y convierte las transformaciones en un plan físico optimizado.
- **Worker Nodes & Executors:** Procesos JVM independientes que ejecutan las tareas físicas (Tasks) en las particiones de datos asignadas y devuelven los resultados al Driver.
- **Optimizador Catalyst:** Analiza las sentencias SQL y DataFrames para aplicar optimizaciones automáticas como **Predicate Pushdown** (filtrar datos directamente en la fuente Parquet/SQL antes de cargarlos a RAM) y **Column Pruning** (leer solo las columnas necesarias).

## 2. Ingesta y Transformaciones Vectorizadas en PySpark

Las operaciones en PySpark se dividen estrictamente en dos categorías:

1. **Transformaciones (Lazy Evaluation):** Operaciones diferidas (\`filter\`, \`select\`, \`groupBy\`, \`join\`) que no ejecutan cómputo inmediato, sino que construyen el plan lógico del DAG.
2. **Acciones:** Operaciones físicas (\`count\`, \`collect\`, \`show\`, \`write\`) que fuerzan la ejecución del DAG y distribuyen los cómputos en el clúster.

\`\`\`python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, when, avg, count, broadcast

# Inicialización de la sesión de Spark distribuida
spark = SparkSession.builder \\
    .appName("NMerge Data Science PySpark Pipeline") \\
    .config("spark.driver.memory", "8g") \\
    .config("spark.executor.memory", "16g") \\
    .config("spark.sql.shuffle.partitions", "200") \\
    .getOrCreate()

# Carga perezosa desde almacenamiento columnar Parquet en AWS S3
df_transacciones = spark.read.parquet("s3a://nmerge-bigdata/transacciones/*.parquet")
df_clientes = spark.read.parquet("s3a://nmerge-bigdata/clientes/*.parquet")

# Aplicación de Broadcast Join para evitar el costoso Shuffle en red
df_unificado = df_transacciones.join(
    broadcast(df_clientes),
    on="cliente_id",
    how="inner"
)

# Transformaciones analíticas vectorizadas
df_resultado = df_unificado \\
    .filter(col("monto") > 50) \\
    .withColumn("segmento_riesgo", when(col("monto") > 1000, "Alto").otherwise("Normal")) \\
    .groupBy("region", "segmento_riesgo") \\
    .agg(
        avg("monto").alias("monto_promedio"),
        count("transaccion_id").alias("total_operaciones")
    )

# Acción física (Dispara el cómputo distribuido)
df_resultado.show(20)
\`\`\`

## 3. Optimización de Memoria: Shuffle, Partitioning y Caching

El punto crítico de latencia en PySpark es el **Shuffle** (reorganización de datos a través de la red entre nodos durante operaciones \`groupBy\` o \`join\`).

- **Particionamiento Adecuado:** La regla empírica es mantener particiones de entre **128 MB y 256 MB** de tamaño.
- **Uso de \`.cache()\` / \`.persist()\`:*** Almacena resultados intermedios de DataFrames reusados frecuentemente en la memoria RAM del Executor (\`MEMORY_AND_DISK_SER\`).

\`\`\`python
# Re-particionamiento inteligente por fecha para optimizar escrituras
df_resultado.repartition(10, col("region")) \\
    .write \\
    .mode("overwrite") \\
    .partitionBy("region") \\
    .parquet("s3a://nmerge-bigdata/procesado/ventas_por_region")
\`\`\`
`
  },
  {
    fileName: 'datascience_kafka.md',
    title: 'Apache Kafka & Real-Time Event Streaming',
    content: `# Apache Kafka & Real-Time Event Streaming

En la arquitectura de datos moderna, la capacidad de procesar flujos de datos continuos en tiempo real (**Event Streaming**) ha superado los procesos tradicionales por lotes (Batch). **Apache Kafka** es la plataforma distribuida de transmisión de eventos de mayor rendimiento en el mundo, capaz de procesar billones de eventos al día con latencias inferiores a 10 milisegundos.

\`\`\`mermaid
flowchart LR
    Producer["Productores (Microservicios / IoT)"] -->|"Publica Eventos (Key/Value)"| KafkaCluster["Clúster Apache Kafka (Brokers & Particiones)"]
    KafkaCluster -->|"Partición 0 / 1 / 2"| ConsumerGroup["Grupo de Consumidores PySpark / Flink"]
    ConsumerGroup -->|"Spark Structured Streaming"| Analytics["Analytics & Alertas Real-Time"]
\`\`\`

## 1. Conceptos Fundamentales de Apache Kafka

Kafka opera como un registro de confirmación de solo incorporación (Append-Only Commit Log) distribuido en un clúster de brokers.

- **Topics:** Categorías o nombres de flujo a los que se envían los mensajes.
- **Particiones:** Sub-registros distribuidos dentro de un Topic que permiten escalabilidad horizontal y procesamiento en paralelo.
- **Producers:** Aplicaciones que publican eventos en uno o más Topics de Kafka.
- **Consumers & Consumer Groups:** Clientes que se suscriben a los Topics. Un Grupo de Consumidores divide automáticamente las particiones entre sus miembros para garantizar un procesamiento ordenado y equilibrado.

## 2. Ingesta de Eventos en Tiempo Real con PySpark Structured Streaming

PySpark Structured Streaming permite tratar flujos en tiempo real procedentes de Kafka como si fueran DataFrames continuos en memoria.

\`\`\`python
from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, expr
from pyspark.sql.types import StructType, StructField, StringType, DoubleType, TimestampType

spark = SparkSession.builder \\
    .appName("Kafka Real-Time Streaming NMerge") \\
    .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0") \\
    .getOrCreate()

# Definicion del esquema del payload de eventos JSON
esquema_evento = StructType([
    StructField("transaccion_id", StringType(), True),
    StructField("cliente_id", StringType(), True),
    StructField("monto", DoubleType(), True),
    StructField("timestamp", TimestampType(), True)
])

# Conexión en streaming al cluster de Kafka
df_kafka_stream = spark.readStream \\
    .format("kafka") \\
    .option("kafka.bootstrap.servers", "kafka-broker-1:9092,kafka-broker-2:9092") \\
    .option("subscribe", "transacciones_bancarias") \\
    .option("startingOffsets", "latest") \\
    .load()

# Deserializacion del valor de la clave/payload JSON
df_eventos = df_kafka_stream.selectExpr("CAST(value AS STRING) as json_payload") \\
    .select(from_json(col("json_payload"), esquema_evento).alias("data")) \\
    .select("data.*")

# Procesamiento de Ventanas de Tiempo (Watermarking & Windowing)
df_alertas_fraude = df_eventos \\
    .withWatermark("timestamp", "10 minutes") \\
    .groupBy(
        expr("window(timestamp, '5 minutes', '1 minute')"),
        col("cliente_id")
    ) \\
    .agg({"monto": "sum"}) \\
    .filter(col("sum(monto)") > 5000)

# Escritura continua de alertas en streaming hacia Delta Lake
query = df_alertas_fraude.writeStream \\
    .format("delta") \\
    .outputMode("append") \\
    .option("checkpointLocation", "s3a://nmerge-data/checkpoints/alertas") \\
    .start("s3a://nmerge-data/lakehouse/silver/alertas_fraude")

# query.awaitTermination()
\`\`\`
`
  },
  {
    fileName: 'datascience_deltalake.md',
    title: 'Delta Lake & Arquitectura Lakehouse (Medallion Architecture)',
    content: `# Delta Lake & Arquitectura Lakehouse (Medallion Architecture)

La **Arquitectura Lakehouse** combina la confiabilidad, las transacciones ACID y la gobernanza de los Data Warehouses tradicionales con la escalabilidad y bajo costo de los Data Lakes sobre almacenamiento de objetos de la nube (AWS S3, Azure Data Lake, Google Cloud Storage). **Delta Lake** es la capa de almacenamiento ACID de código abierto que hace posible esta arquitectura.

\`\`\`mermaid
flowchart LR
    Raw["Fuentes de Datos Crudas"] --> Bronze["Bronze Zone (Ingesta Cruda / Raw Format)"]
    Bronze --> Silver["Silver Zone (Limpieza & Desduplicación)"]
    Silver --> Gold["Gold Zone (Agregaciones & Data Marts)"]
    Gold --> BI["Dashboards BI & Modelos Machine Learning"]
\`\`\`

## 1. La Arquitectura Medallón (Bronze, Silver, Gold)

- **Capa Bronze (Raw Data):** Almacena los eventos y archivos crudos tal como llegan de las fuentes de origen (JSON, CSV, Kafka), conservando la historia inmutable completa.
- **Capa Silver (Cleansed & Conformed Data):** Filtra, valida, limpia y desduplica los datos de la capa Bronze. Representa una vista estructurada confiable a nivel de empresa.
- **Capa Gold (Business Aggregates):** Datos agregados organizados en esquemas en estrella (Star Schema) o Data Marts preparados para consumo directo de inteligencia de negocios (BI) y modelos analíticos.

## 2. Transacciones ACID, Merge (UPSERT) y Time Travel en Delta Lake

Delta Lake implementa un registro de transacciones ACID (\`_delta_log\`) compuesto por archivos JSON secuenciales que garantizan aislamiento de lectura/escritura concurrente.

\`\`\`sql
-- Operación MERGE (UPSERT) nativa en Delta Lake para actualización incremental
MERGE INTO delta.\`s3a://nmerge-data/lakehouse/silver/clientes\` AS target
USING datos_nuevos_stage AS source
ON target.cliente_id = source.cliente_id
WHEN MATCHED THEN
  UPDATE SET 
    target.email = source.email,
    target.fecha_actualizacion = CURRENT_TIMESTAMP()
WHEN NOT MATCHED THEN
  INSERT (cliente_id, nombre, email, fecha_registro)
  VALUES (source.cliente_id, source.nombre, source.email, CURRENT_TIMESTAMP());
\`\`\`

\`\`\`python
# Consulta de Viaje en el Tiempo (Time Travel)
from delta.tables import DeltaTable

# Carga de la tabla Delta
deltaTable = DeltaTable.forPath(spark, "s3a://nmerge-data/lakehouse/silver/clientes")

# Restauración de la tabla a una versión histórica previa antes de una falla
deltaTable.restoreToVersion(5)
\`\`\`
`
  },
  {
    fileName: 'datascience_mlops.md',
    title: 'MLOps, Model Serving & Feature Stores',
    content: `# MLOps, Model Serving & Feature Stores

**MLOps (Machine Learning Operations)** es la extensión de la disciplina DevOps dedicada a la automatización del ciclo de vida completo de los modelos de inteligencia artificial: desde la ingesta de características hasta el entrenamiento continuo, el registro de modelos, el despliegue con baja latencia y el monitoreo de **Data Drift** (desviación de distribución de datos).

\`\`\`mermaid
flowchart TD
    Data["Datos en Producción"] --> Feast["Feast Feature Store (Online / Offline)"]
    Feast --> Train["Entrenamiento de Modelos"]
    Train --> MLflow["Registro de Modelos en MLflow Registry"]
    MLflow --> Serving["Inferencia de Alta Velocidad con vLLM en GPU"]
    Serving --> Drift["Monitoreo de Data Drift & Performance"]
    Drift -.->|"Re-entrenamiento Automatizado"| Train
\`\`\`

## 1. Feature Stores: Registro Centralizado de Características con Feast

Un **Feature Store** resuelve el problema de la discrepancia entre las características utilizadas en el entrenamiento por lotes (Offline Feature Store en S3/BigQuery) y la inferencia en tiempo real (Online Feature Store en Redis/DynamoDB).

\`\`\`python
# Definición de entidad y características en Feast (feature_definition.py)
from datetime import timedelta
from feast import Entity, FeatureView, Field, FileSource, ValueType
from feast.types import Float32, Int64

# Fuente de datos Offline
driver_stats_source = FileSource(
    name="driver_stats_source",
    path="s3a://nmerge-mlops/features/driver_stats.parquet",
    timestamp_field="event_timestamp",
)

# Definición de la entidad
driver = Entity(name="driver_id", value_type=ValueType.INT64)

# Feature View
driver_stats_fv = FeatureView(
    name="driver_hourly_stats",
    entities=[driver],
    ttl=timedelta(days=7),
    schema=[
        Field(name="conv_rate", dtype=Float32),
        Field(name="acc_rate", dtype=Float32),
        Field(name="avg_daily_trips", dtype=Int64),
    ],
    online=True,
    source=driver_stats_source,
)
\`\`\`

## 2. Inferencia en GPU con vLLM y PagedAttention para LLMs

Para servir modelos de lenguaje masivos (LLMs), los servidores tradicionales sufren por la fragmentación de la memoria RAM de la GPU. **vLLM** introduce **PagedAttention**, una arquitectura de memoria virtual inspirada en los sistemas operativos que permite un rendimiento hasta 24x mayor.

\`\`\`python
from vllm import LLM, SamplingParams

# Carga optimizada del modelo LLM en GPU con PagedAttention
llm = LLM(
    model="mistralai/Mistral-7B-Instruct-v0.2",
    tensor_parallel_size=1,
    gpu_memory_utilization=0.90
)

# Parámetros de generación de texto
sampling_params = SamplingParams(temperature=0.7, top_p=0.95, max_tokens=256)

prompts = [
    "Explica los principios del algoritmo Myers LCS en Data Science:",
    "¿Cuáles son los beneficios de la arquitectura Medallón en Delta Lake?"
]

# Generación masiva paralela en GPU
outputs = llm.generate(prompts, sampling_params)

for output in outputs:
    print(f"Prompt: {output.prompt}")
    print(f"Respuesta IA: {output.outputs[0].text}\\n---")
\`\`\`
`
  },
  {
    fileName: 'datascience_polars.md',
    title: 'Polars Framework: Motor SIMD en Rust vs Pandas',
    content: `# Polars Framework: Motor SIMD en Rust vs Pandas

**Polars** es la librería de manipulación de DataFrames de próxima generación diseñada desde cero en lenguaje **Rust** sobre la especificación en memoria **Apache Arrow**. A diferencia de Pandas, que ejecuta cómputos monohilo (Single-threaded) con copias continuas de memoria, Polars implementa procesamiento multihilo automático por hardware, optimizador de consultas en Cero-Copia (Zero-Copy) e instrucciones **SIMD (Single Instruction Multiple Data)** de la CPU.

\`\`\`mermaid
flowchart TD
    Pandas["Pandas (Python GIL / Single-Threaded / Memory Copy)"] -->|Slow| Result1["1.0x (Lento)"]
    Polars["Polars (Rust Engine / Multi-Threaded / Apache Arrow SIMD)"] -->|Fast| Result2["15.0x - 30.0x Máxima Velocidad"]
\`\`\`

## 1. Comparativa Arquitectónica: Polars vs Pandas 2.0

| Característica | Pandas 2.0 (PyArrow) | Polars (Rust Engine) |
| :--- | :--- | :--- |
| **Lenguaje del Engine** | Python / C | **Rust Puro** |
| **Ejecución de Hilos** | Monohilo (Global Interpreter Lock - GIL) | **Multihilo Paralelo Automático** |
| **Forma de Evaluación** | Solo Imperativa (Eager Evaluation) | **Lazy Evaluation & Eager Mode** |
| **Optimizador de Consultas** | Ninguno | **Catalyst-like Rust Optimizer** |
| **Uso de Memoria RAM** | Copias Frecuentes en Memoria | **Zero-Copy & Memory Mapping (mmap)** |

## 2. Modo Lazy y Optimización de Consultas en Polars

El modo \`LazyFrame\` compila la consulta en un grafo lógico y aplica optimizaciones automáticas de predicados y columnas antes de procesar un solo byte.

\`\`\`python
import polars as pl

# Ingesta perezosa desde Parquet usando LazyFrame
lazy_df = pl.scan_parquet("datos_gigantes.parquet")

# Construcción de la consulta diferida (Lazy Pipeline)
query = lazy_df \\
    .filter(pl.col("monto") > 100) \\
    .group_by(["pais", "categoria"]) \\
    .agg([
        pl.col("monto").mean().alias("monto_promedio"),
        pl.col("monto").sum().alias("monto_total"),
        pl.col("cliente_id").n_unique().alias("clientes_unicos")
    ]) \\
    .sort("monto_total", descending=True)

# Imprimir el plan físico optimizado por el motor en Rust
print("Plan Físico Optimizado de Polars:")
print(query.explain())

# Ejecución física hiper-rápida utilizando todos los núcleos de la CPU
result = query.collect()
print(result.head(10))
\`\`\`
`
  }
];

// Escribir en public/docs/es/datascience/ y public/docs/es/
subTopics.forEach(doc => {
  const filePathCategory = path.join(datascienceEsDir, doc.fileName);
  const filePathRoot = path.join(docsEsDir, doc.fileName);

  fs.writeFileSync(filePathCategory, doc.content, 'utf8');
  fs.writeFileSync(filePathRoot, doc.content, 'utf8');
  console.log(`✅ Creado Sub-tema: ${doc.fileName}`);
});

// Copiar a los 6 idiomas adicionales (en, fr, pt, de, zh, ja)
targetLangs.forEach(lang => {
  const langDir = path.join(projectRoot, 'public', 'docs', lang);
  const langDataScienceDir = path.join(langDir, 'datascience');
  if (!fs.existsSync(langDataScienceDir)) fs.mkdirSync(langDataScienceDir, { recursive: true });

  subTopics.forEach(doc => {
    fs.copyFileSync(path.join(docsEsDir, doc.fileName), path.join(langDir, doc.fileName));
    fs.copyFileSync(path.join(docsEsDir, doc.fileName), path.join(langDataScienceDir, doc.fileName));
  });
});

console.log("✅ Sincronizados los 5 Sub-temas de Data Science en los 7 idiomas.");
