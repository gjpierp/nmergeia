# NMERGEIA_GUI_OptimizacionPostgres_v1.0.pdf - MANUEL TECHNIQUE
======================================================================
Branding: nmergeia.com Tech Series
Titre : Guide Avancé d'Optimisation dans PostgreSQL : Tuning d'Index, EXPLAIN ANALYZE et Maintenance sans Downtime
Version : v1.0
Date : 22 Juillet 2026
Statut : Document Technique Final / Non Modifiable
======================================================================

## 1. Page de garde et Contrôle des versions

| Version | Date | Auteur | Changements principaux |
| :--- | :--- | :--- | :--- |
| v1.0 | 2026-07-22 | nmergeia.com Core Team | Version initiale du guide avancé d'optimisation. |

---

## 2. Diagnostic avancé des requêtes lentes avec `pg_stat_statements`

L'extension `pg_stat_statements` est l'outil le plus puissant de PostgreSQL pour enregistrer les statistiques d'exécution de toutes les instructions SQL exécutées sur le serveur.

### Activation de l'extension
Pour activer le module, vous devez ajouter `pg_stat_statements` à la variable `shared_preload_libraries` dans `postgresql.conf` (nécessite un redémarrage du service), puis créer l'extension dans la base de données :

```sql
-- Configuration dans postgresql.conf
shared_preload_libraries = 'pg_stat_statements'

-- Exécuter dans la base de données cible
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### Requêtes de diagnostic critiques

#### 1. Identifier les 5 requêtes avec le temps d'exécution total le plus élevé (Time Consumers)
Cette requête détecte le code qui génère le plus de charge totale sur le serveur en additionnant toutes ses exécutions.

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

#### 2. Identifier les requêtes ayant le plus grand impact de lecture et d'écriture sur disque
Requêtes qui ne bénéficient pas du cache et causent une forte latence d'E/S.

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

## 3. Guide des paramètres clés de mémoire

Ajuster correctement les paramètres de mémoire évite que PostgreSQL ne recoure de manière excessive au disque dur (`Seq Scan` ou écritures dans des fichiers temporaires).

| Paramètre | Objectif / Impact | Configuration Recommandée |
| :--- | :--- | :--- |
| `shared_buffers` | Détermine la quantité de mémoire que PostgreSQL alloue au stockage des données en cache. | **25% de la RAM totale** du système (en environnement dédié). |
| `work_mem` | Mémoire allouée aux opérations de tri (`ORDER BY`, `DISTINCT`) et de jointure (`JOIN`). Si l'opération dépasse cette valeur, elle est écrite sur disque. | **4 Mo à 64 Mo** par connexion active. À surveiller via `log_temp_files`. |
| `maintenance_work_mem` | Mémoire pour les tâches administratives comme `VACUUM`, `CREATE INDEX`, `ALTER TABLE`. | **10% de la RAM totale** (jusqu'à 2 Go maximum pour éviter la surcharge). |
| `random_page_cost` | Estimation du coût pour le planificateur de requêtes de lire des pages disque de manière aléatoire (par rapport aux recherches séquentielles). | **4.0** pour les disques mécaniques traditionnels (HDD).<br>**1.1 à 1.5** pour le stockage à état solide (SSD / NVMe). |

---

## 4. Maintenance préventive (Tuning d'Autovacuum et détection de l'Index Bloat)

### Réglages avancés d'Autovacuum en production
L'Autovacuum prévient l'accumulation de tuples morts (*dead tuples*). Dans les bases de données à fort trafic d'écriture (`UPDATE` et `DELETE`), le délai par défaut peut entraîner une dégradation.

```sql
-- Réglages globaux recommandés dans postgresql.conf
autovacuum_max_workers = 4                    # Plus de threads concurrents pour la maintenance
autovacuum_vacuum_scale_factor = 0.05         # Nettoyer quand 5% des lignes changent
autovacuum_analyze_scale_factor = 0.02        # Mettre à jour les statistiques quand 2% changent
autovacuum_vacuum_cost_limit = 1000           # Augmenter la limite de coût pour aller plus vite
```

### Détection de l'Index Bloat (Index gonflés par des données obsolètes)
Utilisez le script SQL suivant pour identifier l'espace gaspillé dans les index qui augmente inutilement la consommation de `shared_buffers` et ralentit les lectures :

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
        GREATEST(0, (reltuples * 4)::bigint) AS bloat_size -- Estimation simplifiée du Bloat
    FROM pg_stat_user_indexes ui
    JOIN pg_class c ON ui.indexrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
) stats
WHERE bloat_size > 1024 * 1024 -- Afficher uniquement les index avec plus de 1 Mo de bloat
ORDER BY bloat_size DESC;
```

---

## 5. Scripts SQL de production

### Création optimale d'index composés
```sql
-- Index composé optimisé pour les filtres d'égalité suivis de plages
CREATE INDEX CONCURRENTLY idx_users_status_created 
ON users (status, created_at);
```

### Script pour forcer un VACUUM et ANALYZE manuel sur les tables critiques
```sql
-- Exécuter pendant les périodes de faible trafic pour compacter et mettre à jour le planificateur
VACUUM (VERBOSE, ANALYZE) users;
```
