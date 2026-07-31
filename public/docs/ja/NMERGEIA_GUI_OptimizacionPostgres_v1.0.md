# NMERGEIA_GUI_OptimizacionPostgres_v1.0.pdf - テクニカルマニュアル
======================================================================
Branding: nmergeia.com Tech Series
Título: PostgreSQL最適化の高度なガイド: インデックスチューニング、EXPLAIN ANALYZE、およびダウンタイムなしのメンテナンス
Versión: v1.0
Fecha: 2026年7月22日
Estado: 最終テクニカルドキュメント / 変更不可
======================================================================

## 1. 表紙とバージョン管理

| バージョン | 日付 | 作成者 | 主な変更点 |
| :--- | :--- | :--- | :--- |
| v1.0 | 2026-07-22 | nmergeia.com Core Team | 高度な最適化ガイドの初期バージョン。 |

---

## 2. `pg_stat_statements`を用いた遅いクエリの高度な診断

`pg_stat_statements`拡張機能は、サーバー上で実行されたすべてのSQLステートメントの実行統計を記録するための、PostgreSQLで最も強力なツールです。

### 拡張機能の有効化
モジュールをアクティブにするには、`postgresql.conf`の`shared_preload_libraries`変数に`pg_stat_statements`を追加し（サービスの再起動が必要）、データベースに拡張機能を作成する必要があります。

```sql
-- postgresql.confでの設定
shared_preload_libraries = 'pg_stat_statements'

-- ターゲットデータベースで実行
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### 重要な診断クエリ

#### 1. 合計実行時間が最も長い5つのクエリの特定 (Time Consumers)
このクエリは、すべての実行を合計することにより、サーバー上で最大の総負荷を生成するコードを検出します。

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

#### 2. ディスクの読み取りおよび書き込みの影響が最も大きいクエリの特定
キャッシュの恩恵を受けず、高いI/Oレイテンシを引き起こすクエリ。

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

## 3. 主要なメモリパラメータガイド

メモリパラメータを正しく調整することで、PostgreSQLがハードディスクに過度に依存するのを防ぎます（`Seq Scan`または一時ファイルへの書き込み）。

| パラメータ | 目的 / 影響 | 推奨設定 |
| :--- | :--- | :--- |
| `shared_buffers` | PostgreSQLがデータをキャッシュするために割り当てるメモリ量を決定します。 | システムの**合計RAMの25%**（専用環境の場合）。 |
| `work_mem` | ソート操作（`ORDER BY`, `DISTINCT`）および結合（`JOIN`）に割り当てられるメモリ。操作がこの値を超えると、ディスクに書き込まれます。 | アクティブな接続ごとに**4MBから64MB**。`log_temp_files`を使用して監視します。 |
| `maintenance_work_mem` | `VACUUM`, `CREATE INDEX`, `ALTER TABLE`などの管理タスク用のメモリ。 | **合計RAMの10%**（過負荷を避けるため最大2GBまで）。 |
| `random_page_cost` | クエリプランナーがディスクからランダムにページを読み取るコストの見積もり（シーケンシャルスキャンと比較して）。 | 従来のメカニカルディスク（HDD）の場合は**4.0**。<br>ソリッドステートストレージ（SSD / NVMe）の場合は**1.1から1.5**。 |

---

## 4. 予防的メンテナンス (AutovacuumチューニングとIndex Bloatの検出)

### 本番環境での高度なAutovacuum設定
Autovacuumは、不要なタプル（*dead tuples*）の蓄積を防ぎます。書き込みトラフィックが高いデータベース（`UPDATE`および`DELETE`）では、デフォルトの遅延がパフォーマンスの低下を引き起こす可能性があります。

```sql
-- postgresql.confでのグローバルな推奨設定
autovacuum_max_workers = 4                    # メンテナンスのためのより多くの同時スレッド
autovacuum_vacuum_scale_factor = 0.05         # 5%の行が変更されたときにクリーンアップ
autovacuum_analyze_scale_factor = 0.02        # 2%変更されたときに統計を更新
autovacuum_vacuum_cost_limit = 1000           # より速く実行するためにコスト制限を増やす
```

### Index Bloatの検出 (古いデータによって肥大化したインデックス)
次のSQLスクリプトを使用して、`shared_buffers`の消費を不必要に増加させ、読み取りを遅くするインデックス内の無駄なスペースを特定します。

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
        GREATEST(0, (reltuples * 4)::bigint) AS bloat_size -- Bloatの簡易見積もり
    FROM pg_stat_user_indexes ui
    JOIN pg_class c ON ui.indexrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
) stats
WHERE bloat_size > 1024 * 1024 -- 1MB以上のbloatを持つインデックスのみを表示
ORDER BY bloat_size DESC;
```

---

## 5. 本番環境のSQLスクリプト

### 複合インデックスの最適な作成
```sql
-- 等価フィルターとそれに続く範囲フィルターのために最適化された複合インデックス
CREATE INDEX CONCURRENTLY idx_users_status_created 
ON users (status, created_at);
```

### 重要なテーブルで手動のVACUUMとANALYZEを強制するスクリプト
```sql
-- トラフィックの少ない期間に実行して圧縮し、プランナーを更新する
VACUUM (VERBOSE, ANALYZE) users;
```
