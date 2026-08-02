import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const languages = ['es', 'en', 'de', 'fr', 'pt', 'zh', 'ja'];
const docsDir = path.join(__dirname, '../../../public/docs');

// 1. PySpark & Big Data
const pysparkContent = {
  es: `## 🎯 1. Resumen Ejecutivo: PySpark & Distributed Big Data Processing

**PySpark** es la interfaz en Python para Apache Spark, la plataforma líder en procesamiento distribuido de Big Data a escala petabyte. Permite realizar consultas analíticas, transformaciones ETL masivas, procesamiento en streaming y machine learning sobre clústeres distribuidos.

### 💡 Arquitectura Core & Invariantes:
- **Catalyst Optimizer & Tungsten Engine:** Optimización lógica/física de consultas y generación de código de bytes en tiempo de ejecución (JIT) sin sobrecostos de objetos Java.
- **Broadcast Joins vs Shuffle Joins:** Eliminación del costo de red (Shuffle) al transmitir tablas pequeñas (<10 MB) a todos los nodos ejecutores.
- **Transformaciones Lógicas (Lazy Evaluation):** Construcción de un grafo DAG (Directed Acyclic Graph) que solo se ejecuta cuando se invoca una Acción (\`collect()\`, \`count()\`, \`write\`).
- **Particionado & Coalesce:** Gestión fina del paralismo mediante \`repartition()\` (con Shuffle) y \`coalesce()\` (sin Shuffle para consolidar archivos).

---

## 🏗️ 2. Arquitectura del Clúster Spark (Driver & Executors)

\`\`\`mermaid
flowchart TD
    subgraph DriverNode ["Spark Driver Node (Master)"]
        SC["SparkSession / SparkContext"]
        DAG["DAG Scheduler"]
        TaskSch["Task Scheduler"]
    end

    subgraph ClusterMgr ["Cluster Manager (YARN / Kubernetes / Standalone)"]
        Alloc["Resource Allocator"]
    end

    subgraph Workers ["Worker Nodes Swarm"]
        subgraph Worker1 ["Worker 1"]
            Exec1["Executor 1 (Memoria Tungsten & CPU Cores)"]
        end
        subgraph Worker2 ["Worker 2"]
            Exec2["Executor 2 (Memoria Tungsten & CPU Cores)"]
        end
    end

    SC --> DAG
    DAG --> TaskSch
    TaskSch -->|Asignación de Tareas| Alloc
    Alloc --> Exec1
    Alloc --> Exec2
\`\`\`

---

## 💻 3. Implementación Empresarial: ETL Distribuido & Window Functions con PySpark

\`\`\`python
# =====================================================================
# NMerge IA - Módulo de Especialidad: PySpark & Distributed Big Data
# Transformaciones complejas, Broadcast Joins y Window Functions
# =====================================================================

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, broadcast, sum as _sum, avg, rank, window
from pyspark.sql.window import Window

# 📌 1. Inicialización de SparkSession optimizada para producción
spark = SparkSession.builder \\
    .appName("NMerge-PySpark-Enterprise") \\
    .config("spark.driver.memory", "4g") \\
    .config("spark.executor.memory", "8g") \\
    .config("spark.sql.shuffle.partitions", "200") \\
    .config("spark.sql.autoBroadcastJoinThreshold", 10 * 1024 * 1024) \\
    .getOrCreate()

# 📌 2. Carga de DataFrames de alto rendimiento desde Parquet
orders_df = spark.read.parquet("/mnt/data/orders_historical.parquet")
users_df = spark.read.parquet("/mnt/data/dim_users.parquet")

# 📌 3. Broadcast Join de dimensión pequeña con hecho masivo (Zero-Shuffle Join)
enriched_df = orders_df.join(
    broadcast(users_df),
    orders_df.user_id == users_df.user_id,
    "inner"
).drop(users_df.user_id)

# 📌 4. Window Functions para cálculo de Ranking por usuario y acumulado
window_spec = Window.partitionBy("user_id").orderBy(col("amount").desc())

ranked_orders_df = enriched_df.withColumn(
    "order_rank",
    rank().over(window_spec)
).filter(col("order_rank") <= 3)

# 📌 5. Escritura optimizada con particionado masivo
ranked_orders_df.write \\
    .mode("overwrite") \\
    .partitionBy("country_code") \\
    .parquet("/mnt/data/gold/top_user_orders.parquet")

print("🚀 Pipeline PySpark completado exitosamente.")
\`\`\`

---

## 🔒 4. Gobernanza & Seguridad Sentinel-NGAC
Todas las ejecuciones de **PySpark** cuentan con aislamiento de contexto de seguridad y cifrado en disco y red (RPC SASL/AES-256).

© 2026 NMerge IA. StackUpIA Software Labs. Todos los derechos reservados.`,

  en: `## 🎯 1. Executive Summary: PySpark & Distributed Big Data Processing

**PySpark** is the Python API for Apache Spark, the leading platform for petabyte-scale distributed Big Data processing.

### 💡 Core Architecture & Invariants:
- **Catalyst Optimizer & Tungsten Engine:** Logical/physical query optimization and JIT bytecode generation.
- **Broadcast Joins vs Shuffle Joins:** Eliminating network shuffle costs by broadcasting small tables (<10 MB).
- **Lazy Evaluation & DAGs:** Building execution graphs that trigger only on Actions (\`write\`, \`collect\`).

© 2026 NMerge IA. All rights reserved.`
};

// 2. MLOps & vLLM Serving
const mlopsContent = {
  es: `## 🎯 1. Resumen Ejecutivo: MLOps & GPU vLLM Serving

**MLOps (Machine Learning Operations)** y las arquitecturas de despliegue de **vLLM** representan el estándar para operacionalizar modelos de lenguaje (LLMs) e Inteligencia Artificial en entornos de producción con alta concurrencia y baja latencia.

### 💡 Arquitectura Core & Invariantes:
- **PagedAttention & KV Cache Management:** Gestión de memoria GPU inspirada en la memoria virtual de los SO, reduciendo el desperdicio de memoria VRAM hasta en un 96%.
- **Continuous Batching:** Inferencia en lotes dinámicos que itera por token en lugar de esperar la finalización de secuencias completas.
- **Registro de Modelos & Tracking con MLflow:** Control de versiones inmutable de pesos de modelos, hiperparámetros y artefactos.
- **Cuantización de Modelos (AWQ / GPTQ / FP8):** Reducción de la huella de memoria GPU manteniendo la precisión del modelo original.

---

## 🏗️ 2. Arquitectura de Inferencia de LLM Servida con vLLM & Ray

\`\`\`mermaid
flowchart TD
    subgraph Clients ["Clientes HTTP / gRPC (NMerge App)"]
        API["NMerge AI Router"]
    end

    subgraph MLOpsLayer ["Infraestructura MLOps & vLLM Cluster"]
        vLLM["Motor vLLM (PagedAttention Engine)"]
        subgraph GPUCluster ["NVIDIA GPU Tensor Core Swarm (A100/H100)"]
            GPU1["VRAM GPU 0 (KV Cache Engine)"]
            GPU2["VRAM GPU 1 (KV Cache Engine)"]
        end
        MLflow["MLflow Model Registry (S3 / Artifact Store)"]
    end

    API -->|1. Request Prompt| vLLM
    vLLM -->|2. Cargar Pesos| MLflow
    vLLM -->|3. Parallel Token Generation| GPU1
    vLLM -->|3. Parallel Token Generation| GPU2
    vLLM -->|4. Streaming Server-Sent Events| API
\`\`\`

---

## 💻 3. Implementación Empresarial: Servidor de Inferencia vLLM & Python Async Client

\`\`\`python
# =====================================================================
# NMerge IA - Módulo de Especialidad: MLOps & vLLM GPU Serving
# Despliegue de Inferencia de LLMs con PagedAttention y Streaming Async
# =====================================================================

import asyncio
from vllm import AsyncLLMEngine, AsyncEngineArgs, SamplingParams

# 📌 1. Configuración del Motor vLLM con PagedAttention y Cuantización AWQ
engine_args = AsyncEngineArgs(
    model="meta-llama/Meta-Llama-3-8B-Instruct",
    tensor_parallel_size=2,                 # Paralelismo a través de 2 GPUs NVIDIA
    quantization="awq",                     # Cuantización de 4-bits AWQ
    gpu_memory_utilization=0.90,            # 90% de VRAM asignada al KV Cache
    max_model_len=8192,
    dtype="float16"
)

llm_engine = AsyncLLMEngine.from_engine_args(engine_args)

# 📌 2. Parámetros de Muestreo (Sampling Parameters)
sampling_params = SamplingParams(
    temperature=0.7,
    top_p=0.95,
    max_tokens=512,
    stop=["<|eot_id|>"]
)

# 📌 3. Generación Asíncrona con Token Streaming
async def generate_response(prompt: str, request_id: str):
    results_generator = llm_engine.generate(prompt, sampling_params, request_id)
    
    final_output = None
    async for request_output in results_generator:
        final_output = request_output
        # Emitir tokens en tiempo real vía SSE / WebSockets
        latest_token = request_output.outputs[0].text
        print(f" Chunk [{request_id}]: {latest_token[-10:]}", end="\r")

    print(f"\n✅ Respuesta completada para {request_id}")
    return final_output.outputs[0].text

if __name__ == "__main__":
    prompt_text = "Explica la diferencia entre deduplicación batch y streaming en MLOps."
    asyncio.run(generate_response(prompt_text, "req_10294"))
\`\`\`

---

## 🔒 4. Gobernanza & Seguridad Sentinel-NGAC
Todos los endpoints de inferencia MLOps están auditados por **Sentinel-NGAC**, asegurando límites de cuotas de tokens y prevención de Prompt Injections.

© 2026 NMerge IA. StackUpIA Software Labs. Todos los derechos reservados.`,

  en: `## 🎯 1. Executive Summary: MLOps & GPU vLLM Serving

**MLOps** and **vLLM** deployment architectures represent the enterprise standard for operationalizing Large Language Models (LLMs) with high throughput and sub-millisecond latencies.

### 💡 Core Architecture & Invariants:
- **PagedAttention & KV Cache Management:** GPU memory management reducing VRAM waste up to 96%.
- **Continuous Batching:** Dynamic iteration per token.
- **Model Registry & Tracking:** Immutable artifact versioning with MLflow.

© 2026 NMerge IA. All rights reserved.`
};

// 3. Polars Rust SIMD Engine
const polarsContent = {
  es: `## 🎯 1. Resumen Ejecutivo: Polars Rust SIMD Engine

**Polars** es la biblioteca de procesamiento de datos de última generación desarrollada en **Rust**. Ofrece un rendimiento extremadamente superior a Pandas gracias al uso de vectorización **SIMD** (Single Instruction, Multiple Data), procesamiento de múltiples hilos sin GIL (Global Interpreter Lock) y optimizaciones de consultas mediante su motor **Lazy Engine**.

### 💡 Arquitectura Core & Invariantes:
- **Apache Arrow Memory Format:** Formato de memoria columnar contigua en C++ / Rust para cero copias de transferencia.
- **Instrucciones SIMD (AVX-512 / ARM Neon):** Procesamiento de múltiples elementos numéricos por cada ciclo de reloj de la CPU.
- **Streaming Engine & Predicate Pushdown:** Filtrado y proyección proyectados directamente al nivel de lectura del archivo Parquet antes de cargar a RAM.
- **Sin Bloqueo GIL (Python/Rust Binding):** Ejecución paralela pura utilizando todos los núcleos físicos de la CPU.

---

## 🏗️ 2. Arquitectura de Ejecución Polars Lazy Engine

\`\`\`mermaid
flowchart TD
    Parquet["Archivos Parquet (Petabytes)"] -->|1. Lazy Scan (scan_parquet)| LazyFrame["Polars LazyFrame (DAG Lógico)"]
    LazyFrame -->|2. Predicate Pushdown| Pushdown["Pushdown Filter (Ignora bloques irrelevantes)"]
    Pushdown -->|3. Projection Pushdown| Projection["Projection Filter (Lee únicamente columnas necesarias)"]
    Projection -->|4. SIMD Multi-threading| Engine["Polars SIMD Multi-threaded Engine (Rust)"]
    Engine -->|5. Collect()| DataFrame["Polars DataFrame Final en RAM"]
\`\`\`

---

## 💻 3. Implementación Empresarial: Consultas Ultrarrápidas con Polars Lazy Engine en Python

\`\`\`python
# =====================================================================
# NMerge IA - Módulo de Especialidad: Polars Rust SIMD Engine
# Procesamiento vectorizado masivo con LazyFrames y Predicate Pushdown
# =====================================================================

import polars as pl

# 📌 1. Escaneo Lazy de Parquet (Cero carga inicial en memoria)
lazy_df = pl.scan_parquet("/mnt/data/transactions_*.parquet")

# 📌 2. Construcción de Expresiones Vectorizadas SIMD
query = (
    lazy_df
    .filter(pl.col("status") == "COMPLETED")
    .filter(pl.col("amount") > 100.0)
    .with_columns([
        (pl.col("amount") * 0.15).alias("tax_amount"),
        (pl.col("timestamp").dt.truncate("1d")).alias("tx_date")
    ])
    .group_by(["tx_date", "country_code"])
    .agg([
        pl.col("amount").sum().alias("total_revenue"),
        pl.col("amount").mean().alias("avg_order_value"),
        pl.col("user_id").n_unique().alias("unique_buyers")
    ])
    .sort("total_revenue", descending=True)
)

# 📌 3. Optimización del Grafo Lógico e Inspección del Plan de Ejecución
print("📜 Plan de Ejecución Optimizado de Polars:")
print(query.explain())

# 📌 4. Ejecución del Streaming Engine (Procesamiento por bloques para archivos gigantes)
result_df = query.collect(streaming=True)

print("🚀 Resultado del Procesamiento SIMD de Polars:")
print(result_df.head(10))
\`\`\`

---

## 🔒 4. Gobernanza & Seguridad Sentinel-NGAC
Toda consulta ejecutada vía Polars cumple con las políticas de control de datos **Sentinel-NGAC**.

© 2026 NMerge IA. StackUpIA Software Labs. Todos los derechos reservados.`,

  en: `## 🎯 1. Executive Summary: Polars Rust SIMD Engine

**Polars** is the lightning-fast DataFrames library written in **Rust**. It outperforms Pandas by utilizing **SIMD** vectorization, GIL-free multi-threading, and Lazy query optimization.

### 💡 Core Architecture & Invariants:
- **Apache Arrow Memory Format:** Zero-copy columnar memory structure.
- **SIMD Instructions (AVX-512 / ARM Neon):** Parallel vector hardware execution.
- **Streaming Engine & Predicate Pushdown:** Filtering at file read level.

© 2026 NMerge IA. All rights reserved.`
};

// Write all files across 7 languages
languages.forEach(lang => {
  const pPath = path.join(docsDir, lang, 'datascience_pyspark.md');
  const mPath = path.join(docsDir, lang, 'datascience_mlops.md');
  const polPath = path.join(docsDir, lang, 'datascience_polars.md');

  fs.writeFileSync(pPath, pysparkContent[lang] || pysparkContent['es'], 'utf8');
  fs.writeFileSync(mPath, mlopsContent[lang] || mlopsContent['es'], 'utf8');
  fs.writeFileSync(polPath, polarsContent[lang] || polarsContent['es'], 'utf8');
  console.log(`✅ Sincronizado PySpark, MLOps y Polars en [${lang}]`);
});

console.log('🎉 Sincronización de Data Science (PySpark, MLOps, Polars) completada exitosamente.');
