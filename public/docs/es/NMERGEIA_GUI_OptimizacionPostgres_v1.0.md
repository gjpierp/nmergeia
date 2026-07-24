# NMERGEIA_GUI_OptimizacionPostgres_v1.0.pdf - MANUAL TÉCNICO
======================================================================
Branding: nmergeia.com Tech Series
Título: Guía Avanzada de Optimización en PostgreSQL: Tuning de Índices, EXPLAIN ANALYZE y Mantenimiento sin Downtime
Versión: v1.0
Fecha: 22 de Julio de 2026
Estado: Documento Técnico Final / No Modificable
======================================================================

## 1. Portada y Control de Versiones

| Versión | Fecha | Autor | Cambios principales |
| :--- | :--- | :--- | :--- |
| v1.0 | 2026-07-22 | nmergeia.com Core Team | Versión inicial de la guía avanzada de optimización. |

---

## 2. Diagnóstico avanzado de consultas lentas con `pg_stat_statements`

La extensión `pg_stat_statements` es la herramienta más potente en PostgreSQL para registrar estadísticas de ejecución de todas las sentencias SQL ejecutadas en el servidor.

### Habilitación de la extensión
Para activar el módulo, debes añadir `pg_stat_statements` a la variable `shared_preload_libraries` en `postgresql.conf` (requiere reinicio del servicio) y luego crear la extensión en la base de datos:

```sql
-- Configuración en postgresql.conf
shared_preload_libraries = 'pg_stat_statements'

-- Ejecutar en la base de datos objetivo
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### Consultas de diagnóstico críticas

#### 1. Identificar las 5 consultas con mayor tiempo total de ejecución (Time Consumers)
Esta consulta detecta el código que más carga total genera en el servidor sumando todas sus ejecuciones.

```sql
SELECT 
    query, 
    calls, 
    round(total_exec_time::numeric, 2) AS total_time_ms, 
    round(mean_exec_time::numeric, 2) AS avg_time_ms, 
    round((100.0 * total_exec_time / sum(total_exec_time) OVER())::numeric, 2) AS percentage_of_total
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 5;
```

#### 2. Identificar consultas con mayor impacto de lectura y escritura en disco
Consultas que no se benefician del caché y causan alta latencia de I/O.

```sql
SELECT 
    query, 
    calls, 
    shared_blks_read AS cache_misses, 
    shared_blks_hit AS cache_hits,
    round((100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0))::numeric, 2) AS hit_ratio_percentage
FROM pg_stat_statements
ORDER BY shared_blks_read DESC
LIMIT 5;
```

---

## 3. Guía de parámetros clave de memoria

Ajustar correctamente los parámetros de memoria evita que PostgreSQL recurra excesivamente al disco rígido (`Seq Scan` o escrituras en archivos temporales).

| Parámetro | Propósito / Impacto | Configuración Recomendada |
| :--- | :--- | :--- |
| `shared_buffers` | Determina cuánta memoria dedica PostgreSQL a almacenar datos en caché. | **25% de la RAM total** del sistema (en entornos dedicados). |
| `work_mem` | Memoria asignada a operaciones de ordenación (`ORDER BY`, `DISTINCT`) y uniones (`JOIN`). Si la operación supera este valor, se escribe en disco. | **4MB a 64MB** por conexión activa. Monitorear mediante `log_temp_files`. |
| `maintenance_work_mem` | Memoria para tareas administrativas como `VACUUM`, `CREATE INDEX`, `ALTER TABLE`. | **10% de la RAM total** (hasta 2GB máximo para evitar sobrecarga). |
| `random_page_cost` | Estimación del costo para el query planner de leer páginas de disco de forma aleatoria (en relación a búsquedas secuenciales). | **4.0** para discos mecánicos tradicionales (HDD).<br>**1.1 a 1.5** para almacenamiento de estado sólido (SSD / NVMe). |

---

## 4. Mantenimiento preventivo (Autovacuum tuning y detección de Index Bloat)

### Ajustes avanzados de Autovacuum en producción
El Autovacuum previene la acumulación de tuplas muertas (*dead tuples*). En bases de datos con alto tráfico de escritura (`UPDATE` y `DELETE`), el retraso predeterminado puede causar degradación.

```sql
-- Ajustes globales recomendados en postgresql.conf
autovacuum_max_workers = 4                    # Más hilos concurrentes para mantenimiento
autovacuum_vacuum_scale_factor = 0.05         # Limpiar cuando el 5% de las filas cambien
autovacuum_analyze_scale_factor = 0.02        # Actualizar estadísticas al cambiar el 2%
autovacuum_vacuum_cost_limit = 1000           # Aumentar límite de coste para ir más rápido
```

### Detección de Index Bloat (Índices inflados por datos obsoletos)
Usa el siguiente script SQL para identificar el espacio desperdiciado en índices que incrementa innecesariamente el consumo de `shared_buffers` y lentifica las lecturas:

```sql
SELECT
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(index_oid)) AS index_size,
    pg_size_pretty(bloat_size) AS wasted_space,
    round(100.0 * bloat_size / nullif(pg_relation_size(index_oid), 0), 2) AS bloat_ratio_percentage
FROM (
    SELECT
        nspname AS schemaname,
        relname AS tablename,
        indexrelname AS indexname,
        indexrelid AS index_oid,
        GREATEST(0, (reltuples * 4)::bigint) AS bloat_size -- Estimación simplificada de Bloat
    FROM pg_stat_user_indexes ui
    JOIN pg_class c ON ui.indexrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
) stats
WHERE bloat_size > 1024 * 1024 -- Solo mostrar índices con más de 1MB de bloat
ORDER BY bloat_size DESC;
```

---

## 5. Scripts SQL de producción

### Creación óptima de índices compuestos
```sql
-- Índice compuesto optimizado para filtros de igualdad seguidos de rangos
CREATE INDEX CONCURRENTLY idx_users_status_created 
ON users (status, created_at);
```

### Script para forzar VACUUM y ANALYZE manual en tablas críticas
```sql
-- Ejecutar en periodos de bajo tráfico para compactar y actualizar el planificador
VACUUM (VERBOSE, ANALYZE) users;
```
