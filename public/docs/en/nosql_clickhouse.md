# ⚡ Guía Enterprise: ClickHouse Analytics, Motores MergeTree & OLAP

Bienvenido a la guía técnica de **ClickHouse Enterprise**. ClickHouse es el sistema de gestión de bases de datos orientado a columnas (OLAP) de mayor rendimiento del mundo, capaz de procesar miles de millones de filas por segundo y ejecutar agregaciones analíticas complejas en tiempo real sobre conjuntos de datos de escala de petabytes.

---

## 🏛️ 1. Arquitectura Orientada a Columnas vs Relacional Tradicional

Las bases de datos relacionales tradicionales (como PostgreSQL o MySQL) almacenan datos en **formato de fila** (*Row-oriented*). ClickHouse almacena los datos en **formato de columna** (*Column-oriented*).

```
Almacenamiento Por Filas (Row-Oriented):
[ID_1, Fecha_1, Usuario_1, Monto_1] [ID_2, Fecha_2, Usuario_2, Monto_2] ...

Almacenamiento Por Columnas (Column-Oriented ClickHouse):
[ID_1, ID_2, ID_3, ...]
[Fecha_1, Fecha_2, Fecha_3, ...]
[Usuario_1, Usuario_2, Usuario_3, ...]
[Monto_1, Monto_2, Monto_3, ...]
```

### 1.1 Ventajas Fundamentales del Almacenamiento Columnar
1. **Lectura Quirúrgica de Disco**: Si una consulta calcula el promedio del `Monto` (`SELECT AVG(Monto)`), ClickHouse lee **exclusivamente** el bloque de archivos correspondiente a la columna `Monto`, ignorando las demás columnas.
2. **Compresión Masiva de Datos**: Al ser todos los datos de una misma columna del mismo tipo (por ejemplo, enteros de 64 bits o timestamps), algoritmos como **ZSTD** o **DoubleDelta** logran tasas de compresión de hasta **10x - 20x**.
3. **Instrucciones SIMD (Vectorized Query Execution)**: ClickHouse procesa bloques de datos en vectores utilizando instrucciones vectoriales de CPU de 128 o 256 bits (AVX2 / AVX-512).

---

## 🌲 2. La Familia de Motores MergeTree

El motor **`MergeTree`** es la piedra angular del ecosistema de almacenamiento de ClickHouse.

```sql
CREATE TABLE enterprise_analytics.web_events
(
    event_date Date,
    event_timestamp DateTime64(3, 'UTC'),
    tenant_id UInt32,
    user_id UInt64,
    event_type LowCardinality(String),
    response_time_ms UInt16,
    user_agent String
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (tenant_id, event_type, event_timestamp)
SETTINGS index_granularity = 8192;
```

### 2.1 Conceptos Clave de la Familia MergeTree
- **`ORDER BY` (Clave de Ordenamiento Implícita)**: Define el orden físico de los datos en los bloques de disco. Genera marcas de índice espaciadas por la granularidad configurada (`index_granularity = 8192` filas).
- **`PARTITION BY`**: Divide físicamente la tabla en directorios independientes en disco (por ejemplo, por año y mes). Permite borrado y archivado instantáneo de particiones enteras mediante `ALTER TABLE DROP PARTITION`.

### 2.2 Variantes Especializadas de MergeTree
- **`ReplacingMergeTree`**: Elimina automáticamente duplicados basados en la clave de ordenamiento durante las fusiones de partes en segundo plano.
- **`SummingMergeTree`**: Consolida y suma automáticamente todas las columnas numéricas para filas que comparten la misma clave de ordenamiento.
- **`AggregatingMergeTree`**: Almacena los estados intermedios de agregación (`AggregateFunction`) para consultas analíticas ultra-rápidas.

---

## 📈 3. Vistas Materializadas y Tablas Proyectadas en Tiempo Real

A diferencia de las bases de datos relacionales donde las Vistas Materializadas son estáticas y requieren refrescos periódicos, en ClickHouse las **Materialized Views son gatillos de ingesta en tiempo real** (*Real-time Ingest Triggers*).

```sql
-- 1. Tabla de Destino de la Vista Materializada
CREATE TABLE enterprise_analytics.hourly_event_stats
(
    hourly_bucket DateTime,
    tenant_id UInt32,
    event_type LowCardinality(String),
    total_events SimpleAggregateFunction(sum, UInt64),
    avg_response_time SimpleAggregateFunction(avg, Float64)
)
ENGINE = AggregatingMergeTree()
ORDER BY (tenant_id, hourly_bucket, event_type);

-- 2. Creación de la Vista Materializada en Tiempo Real
CREATE MATERIALIZED VIEW enterprise_analytics.mv_hourly_event_stats
TO enterprise_analytics.hourly_event_stats
AS SELECT
    toStartOfHour(event_timestamp) AS hourly_bucket,
    tenant_id,
    event_type,
    count() AS total_events,
    avg(response_time_ms) AS avg_response_time
FROM enterprise_analytics.web_events
GROUP BY hourly_bucket, tenant_id, event_type;
```

---

## ⚡ 4. Consultas Analíticas Masivas y Funciones de Ventana

ClickHouse incluye funciones analíticas avanzadas diseñadas para procesamiento estadístico y arrays:

```sql
-- Ejemplo de Análisis de Embudos de Conversión (Funnel Analysis)
SELECT
    tenant_id,
    windowFunnel(3600)(
        event_timestamp,
        event_type = 'landed_page',
        event_type = 'added_to_cart',
        event_type = 'completed_checkout'
    ) AS funnel_step,
    count() AS user_count
FROM enterprise_analytics.web_events
WHERE event_date = currentUserDate()
GROUP BY tenant_id
ORDER BY user_count DESC;
```

---

## 🛠️ 5. Buenas Prácticas de Rendimiento en Producción

1. **Ingesta en Bloques (Bulk Inserts)**: NUNCA inserte fila por fila (`INSERT INTO ... VALUES (...)`). Envíe inserciones en lotes de al menos **10,000 a 100,000 filas por bloque**.
2. **Uso de `LowCardinality(String)`**: Para columnas tipo texto con menos de 10,000 valores únicos distintos (como países, navegadores, estados), aplique `LowCardinality` para reducir el consumo de memoria en un **80%**.
3. **Primary Key Selección**: Mantenga la clave `ORDER BY` con no más de 3 o 4 columnas ordenadas de **menor a mayor cardinalidad** para maximizar la efectividad del índice primario disperso.

---
*Documento de Ingeniería Avanzada de Software - NMerge IA Enterprise Labs.*
