# Mantenimiento y Rendimiento

## 1. Análisis Avanzado con EXPLAIN (ANALYZE, BUFFERS)
El uso simple de EXPLAIN solo muestra estimaciones teóricas del optimizador de consultas. Añadir ANALYZE y BUFFERS fuerza la ejecución real y revela el impacto en los buffers de memoria y accesos a disco duro.
- Identificación de `Seq Scan` indeseados.
- Optimización de `Rows Removed by Filter`.

## 2. Índices Especializados (BRIN, GIN, GiST)
- **BRIN (Block Range Index)**: Indexa rangos de páginas físicas. Ideal para series temporales y logs ordenados, ahorrando hasta un 99% de espacio.
- **GIN (Inverted Index)**: Perfecto para tipos estructurados complejos como JSONB, text search y arrays.
- **Índices Parciales y Compuestos**: Creación estratégica de índices para consultas altamente específicas.

## 3. Reindexación Concurrente (Sin Downtime)
La fragmentación generada por sentencias frecuentes de UPDATE y DELETE infla el almacenamiento del índice. Reconstruirlos sin bloquear el tráfico en vivo requiere la directiva concurrente:
```sql
REINDEX TABLE CONCURRENTLY transactions;
```

## 4. Vacío y Autovacuum (MVCC)
- Control de tuplas muertas (`Dead Tuples`).
- Tuning de `autovacuum` para tablas de alta transaccionalidad.
- VACUUM FULL vs VACUUM.
