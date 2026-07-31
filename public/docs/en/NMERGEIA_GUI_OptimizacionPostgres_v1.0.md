# NMERGEIA_GUI_OptimizacionPostgres_v1.0.pdf - TECHNICAL MANUAL
======================================================================
Branding: nmergeia.com Tech Series
Title: Advanced PostgreSQL Optimization Guide: Index Tuning, EXPLAIN ANALYZE, and Zero Downtime Maintenance
Version: v1.0
Date: July 22, 2026
Status: Final Technical Document / Non-Modifiable
======================================================================

## 1. Cover and Version Control

| Version | Date | Author | Main Changes |
| :--- | :--- | :--- | :--- |
| v1.0 | 2026-07-22 | nmergeia.com Core Team | Initial version of the advanced optimization guide. |

---

## 2. Advanced slow query diagnostics with `pg_stat_statements`

The `pg_stat_statements` extension is the most powerful tool in PostgreSQL to record execution statistics of all SQL statements executed on the server.

### Enabling the extension
To activate the module, you must add `pg_stat_statements` to the `shared_preload_libraries` variable in `postgresql.conf` (requires service restart) and then create the extension in the database:

```sql
-- Configuration in postgresql.conf
shared_preload_libraries = 'pg_stat_statements'

-- Execute on the target database
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### Critical diagnostic queries

#### 1. Identify the 5 queries with the highest total execution time (Time Consumers)
This query detects the code that generates the most total load on the server by summing up all its executions.

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

#### 2. Identify queries with the highest disk read and write impact
Queries that do not benefit from cache and cause high I/O latency.

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

## 3. Key memory parameters guide

Correctly adjusting memory parameters prevents PostgreSQL from excessively relying on hard disk (`Seq Scan` or writing to temporary files).

| Parameter | Purpose / Impact | Recommended Configuration |
| :--- | :--- | :--- |
| `shared_buffers` | Determines how much memory PostgreSQL dedicates to caching data. | **25% of total RAM** of the system (in dedicated environments). |
| `work_mem` | Memory allocated to sort operations (`ORDER BY`, `DISTINCT`) and joins (`JOIN`). If the operation exceeds this value, it writes to disk. | **4MB to 64MB** per active connection. Monitor using `log_temp_files`. |
| `maintenance_work_mem` | Memory for administrative tasks such as `VACUUM`, `CREATE INDEX`, `ALTER TABLE`. | **10% of total RAM** (up to 2GB maximum to avoid overload). |
| `random_page_cost` | Estimate of the cost for the query planner to read pages from disk randomly (relative to sequential reads). | **4.0** for traditional mechanical disks (HDD).<br>**1.1 to 1.5** for solid-state storage (SSD / NVMe). |

---

## 4. Preventive maintenance (Autovacuum tuning and Index Bloat detection)

### Advanced Autovacuum settings in production
Autovacuum prevents the accumulation of dead tuples. In databases with high write traffic (`UPDATE` and `DELETE`), the default delay can cause degradation.

```sql
-- Recommended global settings in postgresql.conf
autovacuum_max_workers = 4                    # More concurrent threads for maintenance
autovacuum_vacuum_scale_factor = 0.05         # Clean when 5% of rows change
autovacuum_analyze_scale_factor = 0.02        # Update stats when 2% change
autovacuum_vacuum_cost_limit = 1000           # Increase cost limit to go faster
```

### Detecting Index Bloat (Indexes inflated by obsolete data)
Use the following SQL script to identify wasted space in indexes that unnecessarily increases `shared_buffers` consumption and slows down reads:

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
        GREATEST(0, (reltuples * 4)::bigint) AS bloat_size -- Simplified Bloat estimation
    FROM pg_stat_user_indexes ui
    JOIN pg_class c ON ui.indexrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
) stats
WHERE bloat_size > 1024 * 1024 -- Only show indexes with more than 1MB of bloat
ORDER BY bloat_size DESC;
```

---

## 5. Production SQL scripts

### Optimal creation of composite indexes
```sql
-- Composite index optimized for equality filters followed by ranges
CREATE INDEX CONCURRENTLY idx_users_status_created 
ON users (status, created_at);
```

### Script to force manual VACUUM and ANALYZE on critical tables
```sql
-- Run during low traffic periods to compact and update the planner
VACUUM (VERBOSE, ANALYZE) users;
```
