# NMERGEIA_GUI_OptimizacionPostgres_v1.0.pdf - TECHNISCHES HANDBUCH
======================================================================
Branding: nmergeia.com Tech Series
Titel: Fortgeschrittener Leitfaden zur PostgreSQL-Optimierung: Index-Tuning, EXPLAIN ANALYZE und Wartung ohne Ausfallzeiten
Version: v1.0
Datum: 22. Juli 2026
Status: Endgültiges Technisches Dokument / Nicht änderbar
======================================================================

## 1. Deckblatt und Versionskontrolle

| Version | Datum | Autor | Hauptänderungen |
| :--- | :--- | :--- | :--- |
| v1.0 | 2026-07-22 | nmergeia.com Core Team | Erste Version des fortgeschrittenen Optimierungsleitfadens. |

---

## 2. Erweiterte Diagnose langsamer Abfragen mit `pg_stat_statements`

Die Erweiterung `pg_stat_statements` ist das leistungsstärkste Werkzeug in PostgreSQL, um Ausführungsstatistiken aller auf dem Server ausgeführten SQL-Anweisungen aufzuzeichnen.

### Aktivierung der Erweiterung
Um das Modul zu aktivieren, müssen Sie `pg_stat_statements` zur Variablen `shared_preload_libraries` in der Datei `postgresql.conf` hinzufügen (erfordert einen Neustart des Dienstes) und dann die Erweiterung in der Datenbank erstellen:

```sql
-- Konfiguration in postgresql.conf
shared_preload_libraries = 'pg_stat_statements'

-- Ausführen in der Zieldatenbank
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### Kritische Diagnoseabfragen

#### 1. Identifizieren der 5 Abfragen mit der höchsten Gesamtausführungszeit (Time Consumers)
Diese Abfrage erkennt den Code, der die größte Gesamtlast auf dem Server erzeugt, indem alle seine Ausführungen summiert werden.

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

#### 2. Identifizieren von Abfragen mit den größten Lese- und Schreibauswirkungen auf die Festplatte
Abfragen, die nicht vom Cache profitieren und eine hohe I/O-Latenz verursachen.

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

## 3. Leitfaden zu den wichtigsten Speicherparametern

Die korrekte Einstellung der Speicherparameter verhindert, dass PostgreSQL übermäßig auf die Festplatte zugreift (`Seq Scan` oder Schreiben in temporäre Dateien).

| Parameter | Zweck / Auswirkung | Empfohlene Konfiguration |
| :--- | :--- | :--- |
| `shared_buffers` | Bestimmt, wie viel Speicher PostgreSQL dem Zwischenspeichern von Daten im Cache widmet. | **25% des gesamten RAM** des Systems (in dedizierten Umgebungen). |
| `work_mem` | Speicher, der für Sortieroperationen (`ORDER BY`, `DISTINCT`) und Joins (`JOIN`) zugewiesen wird. Wenn die Operation diesen Wert überschreitet, wird sie auf die Festplatte geschrieben. | **4MB bis 64MB** pro aktiver Verbindung. Überwachung über `log_temp_files`. |
| `maintenance_work_mem` | Speicher für administrative Aufgaben wie `VACUUM`, `CREATE INDEX`, `ALTER TABLE`. | **10% des gesamten RAM** (bis zu maximal 2GB, um Überlastung zu vermeiden). |
| `random_page_cost` | Schätzung der Kosten für den Query Planner, Seiten zufällig von der Festplatte zu lesen (im Verhältnis zu sequentiellen Suchen). | **4.0** für traditionelle mechanische Festplatten (HDD).<br>**1.1 bis 1.5** für Solid State Storage (SSD / NVMe). |

---

## 4. Vorbeugende Wartung (Autovacuum-Tuning und Index-Bloat-Erkennung)

### Erweiterte Autovacuum-Einstellungen in der Produktion
Das Autovacuum verhindert die Ansammlung toter Tupel (*dead tuples*). In Datenbanken mit hohem Schreibverkehr (`UPDATE` und `DELETE`) kann die Standardverzögerung zu Leistungseinbußen führen.

```sql
-- Empfohlene globale Einstellungen in postgresql.conf
autovacuum_max_workers = 4                    # Mehr gleichzeitige Threads für die Wartung
autovacuum_vacuum_scale_factor = 0.05         # Bereinigen, wenn sich 5% der Zeilen ändern
autovacuum_analyze_scale_factor = 0.02        # Statistiken bei 2% Änderung aktualisieren
autovacuum_vacuum_cost_limit = 1000           # Kostenlimit erhöhen, um schneller zu arbeiten
```

### Index-Bloat-Erkennung (Aufgeblähte Indizes durch veraltete Daten)
Verwenden Sie das folgende SQL-Skript, um verschwendeten Speicherplatz in Indizes zu identifizieren, der unnötigerweise den Verbrauch von `shared_buffers` erhöht und Lesevorgänge verlangsamt:

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
        GREATEST(0, (reltuples * 4)::bigint) AS bloat_size -- Vereinfachte Bloat-Schätzung
    FROM pg_stat_user_indexes ui
    JOIN pg_class c ON ui.indexrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
) stats
WHERE bloat_size > 1024 * 1024 -- Nur Indizes mit mehr als 1MB Bloat anzeigen
ORDER BY bloat_size DESC;
```

---

## 5. SQL-Produktionsskripte

### Optimale Erstellung zusammengesetzter Indizes
```sql
-- Optimierter zusammengesetzter Index für Gleichheitsfilter gefolgt von Bereichen
CREATE INDEX CONCURRENTLY idx_users_status_created 
ON users (status, created_at);
```

### Skript zur Erzwingung von manuellem VACUUM und ANALYZE auf kritischen Tabellen
```sql
-- In verkehrsarmen Zeiten ausführen, um zu komprimieren und den Planer zu aktualisieren
VACUUM (VERBOSE, ANALYZE) users;
```
