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

console.log("🚀 Creando el Módulo Exclusivo de Data Science & Machine Learning (6 Niveles Profundos)...");

const datascienceDocs = [
  {
    fileName: 'datascience_inicial.md',
    title: 'Data Science, Ecosistema Python, NumPy y Pandas Core',
    level: 'Inicial',
    content: `# Data Science, Ecosistema Python, NumPy y Pandas Core

La **Ciencia de Datos (Data Science)** es la disciplina interdisciplinaria que combina métodos científicos, algoritmos matemáticos, procesos estadísticos y sistemas de computación para extraer conocimiento útil, patrones ocultos e insights accionables a partir de grandes volúmenes de datos estructurados y no estructurados. En la era actual de la Inteligencia Artificial y el Big Data, Python se ha consolidado como el lenguaje estándar absoluto gracias a su ecosistema rico en librerías científicas optimizadas en C/C++ y Rust.

\`\`\`mermaid
flowchart TD
    RawData["Fuentes de Datos (SQL, NoSQL, API, Parquet)"] -->|"Ingesta & Parsing"| Pandas["Pandas DataFrames (Estructura de Memoria)"]
    Pandas -->|"Cómputo Matricial"| NumPy["NumPy Ndarrays (C/C++ Backend)"]
    NumPy -->|"Modelado & Estadística"| SciPy["SciPy / Statsmodels (Análisis Estadístico)"]
    SciPy -->|"Insights Accionables"| Output["Dashboards & Modelos de Machine Learning"]
\`\`\`

## 1. Fundamentos del Ecosistema Data Science en Python

El éxito de Python en la ciencia de datos reside en la separación clara entre la interfaz sintáctica de alto nivel (Python) y los motores de cálculo numérico vectorizados de bajo nivel en C, C++ y Fortran.

- **NumPy (Numerical Python):** Proporciona la estructura fundamental de almacenamiento denso de datos \`ndarray\` (N-Dimensional Array), permitiendo operaciones matemáticas vectorizadas sin bucles explícitos en Python.
- **Pandas:** Construido sobre NumPy, introduce las estructuras bidimensionales de etiquetado de datos \`DataFrame\` y \`Series\`, facilitando el filtrado, la alineación automática de índices y la agregación de datos.
- **SciPy:** Módulo avanzado de algoritmos matemáticos y estadísticos (optimización, integración numérica, transformadas de Fourier y distribuciones de probabilidad).

## 2. NumPy: Operaciones Vectorizadas y Estructuras Ndarray

En Python tradicional, una lista almacena punteros a objetos dispersos en la memoria Heap. NumPy sustituye esto por bloques continuos de memoria contigua (Contiguous Memory Blocks), reduciendo la latencia de caché L1/L2 en la CPU.

\`\`\`python
import numpy as np

# Creación de arreglos vectorizados N-dimensionales
data = np.array([[1.5, 2.8, 3.4], [4.1, 5.0, 6.9]], dtype=np.float64)

# Operaciones matematicas vectorizadas (SIMD - Single Instruction Multiple Data)
squared_data = data ** 2
mean_by_column = np.mean(data, axis=0)

print(f"Dimensiones del ndarray: {data.shape}")
print(f"Tipo de datos en memoria contigua: {data.dtype}")
print(f"Promedio por columna: {mean_by_column}")
\`\`\`

### Tabla Comparativa de Rendimiento de Memoria

| Estructura de Datos | Acceso a Memoria | Recolección de Basura | Velocidad Relativa de Cómputo |
| :--- | :--- | :--- | :--- |
| Lista Nativa de Python | Punteros Dispersos | Alto Overhead (PyObject) | 1x (Base Lenta) |
| NumPy Ndarray | Bloque Contiguo C-Contiguous | Cero Overhead en C | 50x - 100x más rápido |
| Pandas Series (PyArrow Backend) | Apache Arrow Columnar | Cero Overhead (Zero-Copy) | 150x más rápido |

## 3. Pandas: Manipulación de DataFrames y Carga de Archivos Parquet

Pandas es la navaja suiza de la ingesta de datos. En entornos profesionales de ingeniería de datos, el formato **Apache Parquet** sustituye al antiguo CSV debido a su compresión columnar (Snappy/Gzip) y lectura ultrarrápida.

\`\`\`python
import pandas as pd

# Lectura eficiente desde almacenamiento columnar Parquet
df = pd.read_parquet('datos_empresa.parquet')

# Inspeccion estructural del DataFrame
print("Primeros registros:")
print(df.head(5))

# Filtrado booleano de alto rendimiento
df_filtrado = df[(df['ventas'] > 5000) & (df['categoria'] == 'Tecnología')]

# Agregación y agrupamiento rápido (Group-By Engine)
resumen = df_filtrado.groupby('region').agg({
    'ventas': ['sum', 'mean'],
    'cliente_id': 'nunique'
}).reset_index()

print("Resumen Estadístico por Región:")
print(resumen)
\`\`\`

## 4. Mejores Prácticas de Optimización de Memoria en Pandas

1. **Evitar bucles \`for\` e \`iter-rows()\`:*** Utiliza siempre expresiones vectorizadas nativas o \`.apply()\` vectorizado.
2. **Downcasting de tipos de datos numéricos:** Convierte enteros de \`int64\` a \`int32\` o \`int16\`, y flotantes a \`float32\` cuando la precisión lo permita.
3. **Uso del tipo de datos Categorical:** Convierte columnas de texto repetitivo (ej. regiones, estados, categorías) al tipo \`category\` para reducir el consumo de RAM hasta en un 80%.

\`\`\`python
# Downcasting eficiente para optimizar uso de memoria RAM
def optimizar_dataframe(df):
    for col in df.columns:
        if df[col].dtype == 'int64':
            df[col] = pd.to_numeric(df[col], downcast='integer')
        elif df[col].dtype == 'float64':
            df[col] = pd.to_numeric(df[col], downcast='float')
        elif df[col].dtype == 'object' and df[col].nunique() / len(df[col]) < 0.5:
            df[col] = df[col].astype('category')
    return df
\`\`\`
`
  },
  {
    fileName: 'datascience_basico.md',
    title: 'Exploración de Datos (EDA), Data Cleaning y Visualización Científica',
    level: 'Básico',
    content: `# Exploración de Datos (EDA), Data Cleaning y Visualización Científica

El **Análisis Exploratorio de Datos (EDA - Exploratory Data Analysis)** es la fase crítica de la ciencia de datos donde el investigador analiza cuantitativamente y visualmente las estructuras del conjunto de datos para descubrir anomalías, probar hipótesis preliminares, identificar datos faltantes y comprender la distribución subyacente antes de construir cualquier modelo predictivo de Machine Learning.

\`\`\`mermaid
flowchart LR
    Raw["Datos Crudos Incómodos"] --> Impute["Imputación de Nulos & Outliers"]
    Impute --> Scale["Escalamiento StandardScaler / RobustScaler"]
    Scale --> Encode["Categorical Encoding (One-Hot / Target)"]
    Encode --> Viz["Visualización Plotly & Seaborn (EDA)"]
\`\`\`

## 1. Tratamiento Profesional de Datos Faltantes (Data Imputation)

Los valores nulos (\`NaN\` / \`None\`) pueden distorsionar los algoritmos estadísticos. Eliminar filas a ciegas (\`dropna\`) produce sesgo de selección. Las técnicas avanzadas incluyen la imputación por mediana condicional o la imputación por vecinos más cercanos (KNN Imputer).

\`\`\`python
import pandas as pd
import numpy as np
from sklearn.impute import KNNImputer

# Creación de DataFrame con datos faltantes sintéticos
np.random.seed(42)
df = pd.DataFrame({
    'edad': [25, 30, np.nan, 45, 50, 22, np.nan, 60],
    'ingresos': [50000, 60000, 52000, np.nan, 110000, 48000, 95000, np.nan],
    'score_credito': [650, 700, 680, 750, np.nan, 610, 790, 800]
})

# Imputacion avanzada basada en k-Vecinos Mas Cercanos (KNN)
imputer = KNNImputer(n_neighbors=3)
datos_imputados = imputer.fit_transform(df)
df_limpio = pd.DataFrame(datos_imputados, columns=df.columns)

print("DataFrame Imputado con KNN:")
print(df_limpio)
\`\`\`

## 2. Escalamiento de Características (Feature Scaling)

Muchos algoritmos de Machine Learning (KNN, SVM, Regresión Ridge/Lasso, Redes Neuronales) se basan en la distancia euclidiana entre puntos. Si una variable está en el rango [0, 1] y otra en [1000, 1000000], la segunda dominará injustamente el cálculo de los gradientes.

- **StandardScaler:** Z-score normalization ($z = \\frac{x - \\mu}{\\sigma}$). Ideal para distribuciones gaussianas.
- **RobustScaler:** Utiliza la mediana y el rango intercuartílico (IQR). Resistente a valores atípicos (outliers).

\`\`\`python
from sklearn.preprocessing import StandardScaler, RobustScaler

scaler_standard = StandardScaler()
scaler_robust = RobustScaler()

df_limpio['ingresos_std'] = scaler_standard.fit_transform(df_limpio[['ingresos']])
df_limpio['ingresos_robust'] = scaler_robust.fit_transform(df_limpio[['ingresos']])

print("Comparación de Escalamiento:")
print(df_limpio[['ingresos', 'ingresos_std', 'ingresos_robust']])
\`\`\`

## 3. Visualización Científica e Interactiva con Plotly y Seaborn

La visualización de datos permite detectar correlaciones no lineales y distribuciones bimodales que los resúmenes estadísticos simples ocultan.

\`\`\`python
import plotly.express as px

# Creacion de gráfico de dispersión interactivamente con linea de tendencia
fig = px.scatter(
    df_limpio, 
    x='edad', 
    y='ingresos', 
    color='score_credito',
    size='ingresos',
    trendline='ols',
    title='Relación Interactiva entre Edad, Ingresos y Score Crediticios'
)

# Renderizado interactivo compatible con Jupyter / Web Application
fig.update_layout(template='plotly_dark')
# fig.show()
\`\`\`
`
  },
  {
    fileName: 'datascience_medio.md',
    title: 'Machine Learning Tradicional: Algoritmos Supervisados y No Supervisados',
    level: 'Medio',
    content: `# Machine Learning Tradicional: Algoritmos Supervisados y No Supervisados

El **Machine Learning (Aprendizaje Automático)** es la rama de la Inteligencia Artificial dedicada a la construcción de sistemas capaces de aprender patrones automáticamente a partir de datos históricos sin ser programados explícitamente mediante reglas fijas. Se divide en **Aprendizaje Supervisado** (donde existen etiquetas de variable objetivo $Y$) y **Aprendizaje No Supervisado** (donde el algoritmo busca agrupamientos de patrones $X$ por sí solo).

\`\`\`mermaid
flowchart TD
    Dataset["Dataset de Entrenamiento (X, Y)"] --> Split["Train / Test Split (Stratified 80/20)"]
    Split --> Train["Entrenamiento de XGBoost / Random Forest"]
    Train --> Optuna["Optimización de Hiperparámetros (Optuna)"]
    Optuna --> Metrics["Evaluación de Métricas (ROC-AUC, F1-Score, RMSE)"]
\`\`\`

## 1. Algoritmos Supervisados: Clasificación y Regresión

### Clasificación con XGBoost (Extreme Gradient Boosting)
XGBoost es el algoritmo basado en árboles de decisión (Ensemble Learning) más premiado en competencias de ciencia de datos debido a su velocidad de cómputo y manejo de regularización L1/L2 interna.

\`\`\`python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
from xgboost import XGBClassifier

# Generacion de dataset sintético de detección de fraude
np.random.seed(42)
X = np.random.randn(1000, 10)
y = (X[:, 0] + X[:, 1] * 2 > 1).astype(int)

# División Estratificada de Entrenamiento y Prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Entrenamiento del Modelo XGBoost
model = XGBClassifier(
    n_estimators=100,
    learning_rate=0.05,
    max_depth=4,
    eval_metric='logloss',
    random_state=42
)
model.fit(X_train, y_train)

# Prediccion de probabilidades y etiquetas
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

print("Reporte de Clasificación:")
print(classification_report(y_test, y_pred))
print(f"Métrica ROC-AUC Score: {roc_auc_score(y_test, y_proba):.4f}")
\`\`\`

## 2. Optimización de Hiperparámetros con Optuna

En lugar de utilizar búsquedas exhaustivas lentas (GridSearch), **Optuna** emplea la optimización bayesiana mediante muestreadores Tree-structured Parzen Estimator (TPE) para encontrar los mejores parámetros en una fracción del tiempo.

\`\`\`python
import optuna

def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 50, 300),
        'max_depth': trial.suggest_int('max_depth', 3, 9),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.2, log=True),
        'subsample': trial.suggest_float('subsample', 0.6, 1.0)
    }
    
    clf = XGBClassifier(**params, random_state=42, eval_metric='logloss')
    clf.fit(X_train, y_train)
    preds = clf.predict_proba(X_test)[:, 1]
    return roc_auc_score(y_test, preds)

# Búsqueda bayesiana de hyperparámetros
study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=20)

print(f"Mejores Hiperparámetros Encontrados: {study.best_params}")
print(f"Mejor ROC-AUC: {study.best_value:.4f}")
\`\`\`

## 3. Algoritmos No Supervisados: K-Means y DBSCAN

El aprendizaje no supervisado descubre agrupamientos naturales (clusters) sin intervención humana.

\`\`\`python
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler

# Normalizacion previa obligatoria para algoritmos de distancia
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Agrupamiento K-Means
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
clusters_kmeans = kmeans.fit_predict(X_scaled)

# Agrupamiento DBSCAN (Deteccion de ruido y forma arbitraria)
dbscan = DBSCAN(eps=0.5, min_samples=5)
clusters_dbscan = dbscan.fit_predict(X_scaled)

print(f"Clusters K-Means Asignados: {np.bincount(clusters_kmeans)}")
\`\`\`
`
  },
  {
    fileName: 'datascience_avanzado.md',
    title: 'Big Data Engineering: PySpark, Delta Lake, Apache Kafka y Airflow',
    level: 'Avanzado',
    content: `# Big Data Engineering: PySpark, Delta Lake, Apache Kafka y Airflow

Cuando el volumen de los datos supera la memoria RAM de un solo servidor (Terabytes o Petabytes), las herramientas tradicionales como Pandas fallan por Out-of-Memory (OOM). La **Ingeniería de Big Data** utiliza sistemas de cómputo distribuido en clústeres masivos donde las cargas de trabajo se dividen horizontalmente entre decenas o cientos de nodos.

\`\`\`mermaid
flowchart TD
    Kafka["Apache Kafka (Streaming de Eventos)"] --> Spark["PySpark Streaming Engine (Master / Worker Nodes)"]
    Spark --> Delta["Delta Lake Storage (Bronze -> Silver -> Gold)"]
    Airflow["Apache Airflow (Orquestador DAG)"] -.->|"Schedules Job"| Spark
\`\`\`

## 1. PySpark: Cómputo Distribuido en memoria RAM

PySpark es la API en Python para Apache Spark. Transforma operaciones imperativas en grafos acíclicos dirigidos (DAGs) de ejecución perezosa (Lazy Evaluation) optimizados por el motor Catalyst.

\`\`\`python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg, count

# Inicialización de la Sesión distribuida de Spark
spark = SparkSession.builder \
    .appName("NMerge Big Data Pipeline") \
    .config("spark.driver.memory", "4g") \
    .config("spark.executor.memory", "8g") \
    .getOrCreate()

# Carga de dataset masivo Parquet desde HDFS o S3
df_spark = spark.read.parquet("s3a://nmerge-data-bucket/transacciones/*.parquet")

# Operaciones transformacionales con ejecución diferida (Lazy)
df_agrupado = df_spark.filter(col("monto") > 100) \
    .groupBy("categoria", "pais") \
    .agg(
        avg("monto").alias("monto_promedio"),
        count("transaccion_id").alias("total_operaciones")
    ) \
    .orderBy(col("total_operaciones").desc())

# Evaluación de la acción (Acción física en los nodos workers)
df_agrupado.show(10)
\`\`\`

## 2. Delta Lake: Arquitectura Lakehouse y Transacciones ACID

Delta Lake añade una capa de almacenamiento de código abierto sobre almacenamiento de objetos (AWS S3, Azure Blob, GCS) que aporta transacciones ACID, registro de transacciones ACID (\`_delta_log\`) y Time Travel (viaje en el tiempo de versiones).

\`\`\`python
# Escritura en formato Delta Lake con soporte ACID
df_spark.write.format("delta") \
    .mode("overwrite") \
    .partitionBy("fecha") \
    .save("s3a://nmerge-data-bucket/lakehouse/silver/transacciones")

# Consulta de Viaje en el Tiempo (Time Travel) a una versión anterior
df_version_anterior = spark.read.format("delta") \
    .option("versionAsOf", 2) \
    .load("s3a://nmerge-data-bucket/lakehouse/silver/transacciones")
\`\`\`

## 3. Orquestación de Data Pipelines con Apache Airflow

Airflow define pipelines de datos como código Python estructurado en DAGs (Directed Acyclic Graphs).

\`\`\`python
from datetime import datetime, timedelta
from airflow import DAG
from airflow.providers.apache.spark.operators.spark_submit import SparkSubmitOperator

default_args = {
    'owner': 'Data Engineering Team',
    'depends_on_past': False,
    'start_date': datetime(2026, 1, 1),
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'etl_big_data_nmerge',
    default_args=default_args,
    schedule_interval='@daily',
    catchup=False
) as dag:

    spark_job = SparkSubmitOperator(
        task_id='procesamiento_spark_diario',
        application='/opt/airflow/dags/scripts/spark_etl.py',
        conn_id='spark_default',
        executor_memory='4g',
        total_executor_cores=8
    )
\`\`\`
`
  },
  {
    fileName: 'datascience_experto.md',
    title: 'Deep Learning con PyTorch, Arquitecturas Transformers y MLOps',
    level: 'Experto',
    content: `# Deep Learning con PyTorch, Arquitecturas Transformers y MLOps

El **Deep Learning (Aprendizaje Profundo)** utiliza redes neuronales artificiales profundas compuestas por múltiples capas ocultas no lineales para aprender representaciones jerárquicas complejas directamente a partir de datos no estructurados como imágenes, texto libre, audio y video. En la producción moderna de IA, la arquitectura **Transformer** (basada en el mecanismo de auto-atención) domina el estado del arte (SOTA).

\`\`\`mermaid
flowchart TD
    Input["Texto Crudo / Imagen"] --> Tokenizer["HuggingFace Tokenizer / Feature Extractor"]
    Tokenizer --> PyTorch["Modelo Transformer PyTorch (Attention Layer)"]
    PyTorch --> Loss["Cálculo de Loss & Autograd Backprop"]
    Loss --> Feast["Feature Store (Feast)"]
    Feast --> Serving["MLOps Serving con vLLM en GPU"]
\`\`\`

## 1. PyTorch: Tensores, Autograd y Redes Neuronales Profundas

PyTorch es la librería preferida en investigación y producción para Deep Learning gracias a sus grafos de computación dinámicos y aceleración en unidades de procesamiento gráfico (GPU CUDA).

\`\`\`python
import torch
import torch.nn as nn
import torch.optim as optim

# Selección dinámica de dispositivo de cómputo (CUDA GPU vs CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Ejecutando Deep Learning en Dispositivo: {device}")

# Definición de una Red Neuronal Profunda Multi-Capa (MLP)
class RedNeuronalProfunda(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super(RedNeuronalProfunda, self).__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
        self.fc2 = nn.Linear(hidden_dim, output_dim)
        
    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.dropout(out)
        out = self.fc2(out)
        return out

# Instanciación y transferencia del modelo a memoria GPU
model = RedNeuronalProfunda(input_dim=100, hidden_dim=64, output_dim=2).to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)
\`\`\`

## 2. Arquitectura Transformer con HuggingFace Transformers

Los Transformers procesan secuencias de texto enteras en paralelo mediante la fórmula de auto-atención escalada (Scaled Dot-Product Attention):

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

\`\`\`python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model_transformer = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)

# Tokenización eficiente en tensores PyTorch
inputs = tokenizer("NMerge IA ofrece procesamiento local-first de alto rendimiento.", return_tensors="pt")
outputs = model_transformer(**inputs)
logits = outputs.logits
print(f"Logits de Clasificación Transformer: {logits}")
\`\`\`

## 3. MLOps: Inferencia de Alta Velocidad en GPU con vLLM y MLflow

El ciclo de vida MLOps requiere rastrear experimentos y empaquetar modelos para inferencia masiva con baja latencia.

\`\`\`bash
# Ejemplo de servidor de inferencia vLLM para LLMs en GPU con soporte PagedAttention
python3 -m vllm.entrypoints.openai.api_server \\
    --model mistralai/Mistral-7B-Instruct-v0.2 \\
    --tensor-parallel-size 1 \\
    --port 8000
\`\`\`
`
  },
  {
    fileName: 'datascience_optimizaciones.md',
    title: 'Optimizaciones Extremas: Polars (Rust), dbt y Great Expectations',
    level: '🔥 Optimizaciones',
    content: `# Optimizaciones Extremas: Polars (Rust), dbt y Great Expectations

Para alcanzar la máxima eficiencia operativa y reducir costos de infraestructura cloud en entornos de producción masivos, los equipos de ciencia de datos modernos reemplazan la pila tradicional por motores hiper-optimizados en **Rust (Polars)**, transformación declarativa en Data Warehouses **(dbt)** y validación automatizada de calidad de datos **(Great Expectations)**.

\`\`\`mermaid
flowchart LR
    Polars["Polars (Rust Engine SIMD)"] --> dbt["dbt Transformations (Snowflake/BigQuery)"]
    dbt --> GX["Great Expectations (Automated Quality Testing)"]
    GX --> Validated["Dataset Prístino en Producción"]
\`\`\`

## 1. Polars: El Reemplazo de Pandas Escrito en Rust

Polars es una librería de DataFrames escrita en Rust y construida sobre Apache Arrow. A diferencia de Pandas, Polars soporta ejecución multihilo nativa (Parallel Query Engine), evaluación perezosa (Lazy Evaluation) y optimización de consultas en Cero-Copia (Zero-Copy).

\`\`\`python
import polars as pl

# Creación de LazyFrame para optimización de consultas
df_polars = pl.scan_parquet("datos_gigantes.parquet")

# Consulta diferida optimizada por el motor en Rust
consulta_optimizada = df_polars \\
    .filter(pl.col("monto") > 200) \\
    .group_by(["region", "categoria"]) \\
    .agg([
        pl.col("monto").mean().alias("monto_promedio"),
        pl.col("cliente_id").n_unique().alias("clientes_unicos")
    ]) \\
    .sort("monto_promedio", descending=True)

# Ejecución física hiper-rápida (Multi-Threaded Rust)
resultado = consulta_optimizada.collect()
print("Resultado Polars en Rust:")
print(resultado.head(5))
\`\`\`

### Tabla de Benchmarking de Velocidad: Pandas vs Polars

| Operación (10 Millones de Filas) | Pandas 2.0 (Segundos) | Polars (Rust) (Segundos) | Aceleración |
| :--- | :--- | :--- | :--- |
| Lectura de Archivo Parquet | 4.82 s | 0.41 s | **11.7x más rápido** |
| Filtrado y Agrupamiento (Group-By) | 6.15 s | 0.32 s | **19.2x más rápido** |
| Operaciones de Joins | 9.40 s | 0.85 s | **11.0x más rápido** |

## 2. dbt (Data Build Tool): Transformaciones SQL Modulares

dbt permite a los analistas e ingenieros de datos transformar datos en Snowflake, BigQuery o Databricks utilizando sentencias \`SELECT\` de SQL modulares con control de versiones y pruebas de integridad.

\`\`\`sql
-- Modelo dbt: models/marts/fact_ventas_diarias.sql
{{ config(materialized='incremental', unique_key='fecha') }}

WITH ventas_raw AS (
    SELECT 
        DATE(fecha_transaccion) AS fecha,
        region_id,
        SUM(monto) AS total_ventas,
        COUNT(DISTINCT cliente_id) AS total_clientes
    FROM {{ ref('stg_transacciones') }}
    {% if is_incremental() %}
      WHERE fecha_transaccion >= (SELECT MAX(fecha) FROM {{ this }})
    {% endif %}
    GROUP BY 1, 2
)

SELECT * FROM ventas_raw
\`\`\`

## 3. Great Expectations: Calidad de Datos y Prevención de Data Drift

Great Expectations automatiza la validación del esquema y los rangos estadísticos de los datasets para prevenir que datos corruptos lleguen a los modelos de producción.

\`\`\`python
import great_expectations as gx

context = gx.get_context()
validator = context.sources.pandas_default.read_dataframe(resultado.to_pandas())

# Definición de expectativas de calidad de datos
validator.expect_column_values_to_not_be_null(column="region")
validator.expect_column_values_to_be_between(column="monto_promedio", min_value=0, max_value=1000000)

# Validación física del lote de datos
validation_result = validator.validate()
print(f"¿Dataset Válido para Producción?: {validation_result.success}")
\`\`\`
`
  }
];

// Escribir los 6 archivos markdown en public/docs/es/datascience/ y public/docs/es/
datascienceDocs.forEach(doc => {
  const filePathCategory = path.join(datascienceEsDir, doc.fileName);
  const filePathRoot = path.join(docsEsDir, doc.fileName);

  fs.writeFileSync(filePathCategory, doc.content, 'utf8');
  fs.writeFileSync(filePathRoot, doc.content, 'utf8');
  console.log(`✅ Creado: ${doc.fileName}`);
});

// Copiar a los 6 idiomas adicionales (en, fr, pt, de, zh, ja)
targetLangs.forEach(lang => {
  const langDir = path.join(projectRoot, 'public', 'docs', lang);
  const langDataScienceDir = path.join(langDir, 'datascience');
  if (!fs.existsSync(langDataScienceDir)) fs.mkdirSync(langDataScienceDir, { recursive: true });

  datascienceDocs.forEach(doc => {
    fs.copyFileSync(path.join(docsEsDir, doc.fileName), path.join(langDir, doc.fileName));
    fs.copyFileSync(path.join(docsEsDir, doc.fileName), path.join(langDataScienceDir, doc.fileName));
  });
});

console.log("✅ Sincronizado el Módulo Data Science en los 7 idiomas soportados.");
