# NMERGEIA_GUI_OptimizacionPostgres_v1.0.pdf - MANUAL TÉCNICO
======================================================================
Branding: nmergeia.com Tech Series
Título: Guia Avançado de Otimização no PostgreSQL: Tuning de Índices, EXPLAIN ANALYZE e Manutenção sem Downtime
Versão: v1.0
Data: 22 de Julho de 2026
Status: Documento Técnico Final / Não Modificável
======================================================================

## 1. Capa e Controle de Versões

| Versão | Data | Autor | Principais alterações |
| :--- | :--- | :--- | :--- |
| v1.0 | 2026-07-22 | nmergeia.com Core Team | Versão inicial do guia avançado de otimização. |

---

## 2. Diagnóstico avançado de consultas lentas com `pg_stat_statements`

A extensão `pg_stat_statements` é a ferramenta mais poderosa no PostgreSQL para registrar estatísticas de execução de todas as instruções SQL executadas no servidor.

### Habilitando a extensão
Para ativar o módulo, você deve adicionar `pg_stat_statements` à variável `shared_preload_libraries` no `postgresql.conf` (requer reinicialização do serviço) e, em seguida, criar a extensão no banco de dados:

```sql
-- Configuração no postgresql.conf
shared_preload_libraries = 'pg_stat_statements'

-- Executar no banco de dados alvo
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### Consultas de diagnóstico críticas

#### 1. Identificar as 5 consultas com maior tempo total de execução (Time Consumers)
Esta consulta detecta o código que mais carga total gera no servidor somando todas as suas execuções.

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

#### 2. Identificar consultas com maior impacto de leitura e gravação em disco
Consultas que não se beneficiam do cache e causam alta latência de I/O.

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

## 3. Guia de parâmetros-chave de memória

Ajustar corretamente os parâmetros de memória evita que o PostgreSQL recorra excessivamente ao disco rígido (`Seq Scan` ou gravações em arquivos temporários).

| Parâmetro | Propósito / Impacto | Configuração Recomendada |
| :--- | :--- | :--- |
| `shared_buffers` | Determina quanta memória o PostgreSQL dedica para armazenar dados em cache. | **25% da RAM total** do sistema (em ambientes dedicados). |
| `work_mem` | Memória alocada para operações de ordenação (`ORDER BY`, `DISTINCT`) e junções (`JOIN`). Se a operação exceder esse valor, será gravada no disco. | **4MB a 64MB** por conexão ativa. Monitorar via `log_temp_files`. |
| `maintenance_work_mem` | Memória para tarefas administrativas como `VACUUM`, `CREATE INDEX`, `ALTER TABLE`. | **10% da RAM total** (até 2GB no máximo para evitar sobrecarga). |
| `random_page_cost` | Estimativa de custo para o query planner ao ler páginas do disco aleatoriamente (em relação às buscas sequenciais). | **4.0** para discos mecânicos tradicionais (HDD).<br>**1.1 a 1.5** para armazenamento de estado sólido (SSD / NVMe). |

---

## 4. Manutenção preventiva (Autovacuum tuning e detecção de Index Bloat)

### Ajustes avançados do Autovacuum em produção
O Autovacuum previne o acúmulo de tuplas mortas (*dead tuples*). Em bancos de dados com alto tráfego de gravação (`UPDATE` e `DELETE`), o atraso padrão pode causar degradação.

```sql
-- Ajustes globais recomendados no postgresql.conf
autovacuum_max_workers = 4                    # Mais threads simultâneas para manutenção
autovacuum_vacuum_scale_factor = 0.05         # Limpar quando 5% das linhas mudarem
autovacuum_analyze_scale_factor = 0.02        # Atualizar estatísticas ao mudar 2%
autovacuum_vacuum_cost_limit = 1000           # Aumentar limite de custo para ir mais rápido
```

### Detecção de Index Bloat (Índices inflados por dados obsoletos)
Use o seguinte script SQL para identificar o espaço desperdiçado em índices que aumenta desnecessariamente o consumo de `shared_buffers` e retarda as leituras:

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
        GREATEST(0, (reltuples * 4)::bigint) AS bloat_size -- Estimativa simplificada de Bloat
    FROM pg_stat_user_indexes ui
    JOIN pg_class c ON ui.indexrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
) stats
WHERE bloat_size > 1024 * 1024 -- Mostrar apenas índices com mais de 1MB de bloat
ORDER BY bloat_size DESC;
```

---

## 5. Scripts SQL de produção

### Criação otimizada de índices compostos
```sql
-- Índice composto otimizado para filtros de igualdade seguidos de intervalos
CREATE INDEX CONCURRENTLY idx_users_status_created 
ON users (status, created_at);
```

### Script para forçar VACUUM e ANALYZE manual em tabelas críticas
```sql
-- Executar em períodos de baixo tráfego para compactar e atualizar o planejador
VACUUM (VERBOSE, ANALYZE) users;
```
