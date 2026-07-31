# NMERGEIA_GUI_OptimizacionPostgres_v1.0.pdf - 技术手册
======================================================================
Branding: nmergeia.com Tech Series
标题: PostgreSQL 高级优化指南: 索引调优、EXPLAIN ANALYZE 及零停机维护
版本: v1.0
日期: 2026年7月22日
状态: 最终技术文档 / 不可修改
======================================================================

## 1. 封面与版本控制

| 版本 | 日期 | 作者 | 主要更改 |
| :--- | :--- | :--- | :--- |
| v1.0 | 2026-07-22 | nmergeia.com Core Team | 高级优化指南初始版本。 |

---

## 2. 使用 `pg_stat_statements` 进行慢查询高级诊断

`pg_stat_statements` 扩展是 PostgreSQL 中记录所有在服务器上执行的 SQL 语句执行统计信息的最强大工具。

### 启用扩展
要激活该模块，必须将 `pg_stat_statements` 添加到 `postgresql.conf` 中的 `shared_preload_libraries` 变量中（需要重启服务），然后在目标数据库中创建扩展：

```sql
-- postgresql.conf 中的配置
shared_preload_libraries = 'pg_stat_statements'

-- 在目标数据库中执行
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### 关键诊断查询

#### 1. 识别总执行时间最长的 5 个查询（Time Consumers）
该查询通过汇总服务器上所有执行的总执行时间，检测出产生最高总负载的代码。

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

#### 2. 识别磁盘读写影响最大的查询
这些查询未从缓存中受益，导致了高 I/O 延迟。

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

## 3. 关键内存参数指南

正确调整内存参数可防止 PostgreSQL 过度依赖硬盘（`Seq Scan` 或在临时文件中写入）。

| 参数 | 目的 / 影响 | 推荐配置 |
| :--- | :--- | :--- |
| `shared_buffers` | 决定 PostgreSQL 用于缓存数据的内存量。 | 系统**总 RAM 的 25%**（在专用环境中）。 |
| `work_mem` | 分配给排序操作（`ORDER BY`, `DISTINCT`）和连接（`JOIN`）的内存。如果操作超过此值，将写入磁盘。 | 每个活动连接 **4MB 到 64MB**。通过 `log_temp_files` 进行监控。 |
| `maintenance_work_mem` | 用于管理任务的内存，如 `VACUUM`, `CREATE INDEX`, `ALTER TABLE`。 | **总 RAM 的 10%**（最大可达 2GB 以避免过载）。 |
| `random_page_cost` | 查询规划器评估随机读取磁盘页面的成本（相对于顺序扫描）。 | 传统机械硬盘 (HDD) 设为 **4.0**。<br>固态存储 (SSD / NVMe) 设为 **1.1 到 1.5**。 |

---

## 4. 预防性维护（Autovacuum 调优及检测 Index Bloat）

### 生产环境中的 Autovacuum 高级设置
Autovacuum 可防止死元组（*dead tuples*）的累积。在写入流量高（`UPDATE` 和 `DELETE`）的数据库中，默认的延迟可能会导致性能下降。

```sql
-- postgresql.conf 中的推荐全局设置
autovacuum_max_workers = 4                    # 更多并发维护线程
autovacuum_vacuum_scale_factor = 0.05         # 当 5% 的行发生变化时进行清理
autovacuum_analyze_scale_factor = 0.02        # 发生 2% 变化时更新统计信息
autovacuum_vacuum_cost_limit = 1000           # 增加成本限制以加快速度
```

### 监测 Index Bloat（因过时数据膨胀的索引）
使用以下 SQL 脚本来识别索引中浪费的空间，这些空间不必要地增加了 `shared_buffers` 消耗并降低了读取速度：

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
        GREATEST(0, (reltuples * 4)::bigint) AS bloat_size -- Bloat 的简化估计
    FROM pg_stat_user_indexes ui
    JOIN pg_class c ON ui.indexrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
) stats
WHERE bloat_size > 1024 * 1024 -- 仅显示 bloat 超过 1MB 的索引
ORDER BY bloat_size DESC;
```

---

## 5. 生产环境 SQL 脚本

### 最优组合索引创建
```sql
-- 针对等值过滤再跟范围过滤优化的组合索引
CREATE INDEX CONCURRENTLY idx_users_status_created 
ON users (status, created_at);
```

### 在关键表上手动强制 VACUUM 和 ANALYZE 的脚本
```sql
-- 在低流量时段执行以压缩和更新规划器
VACUUM (VERBOSE, ANALYZE) users;
```
