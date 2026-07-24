# Guía Intermedia de PostgreSQL: Optimización y Estructuras

## 1. Índices (B-Tree, Hash)
- Creación de índices para mejorar el rendimiento de lectura.
- B-Tree para igualdades y rangos.
- Diferencia entre escanear una tabla completa (Seq Scan) y un Index Scan.

## 2. Joins y Subconsultas
- **INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN**.
- Subconsultas escalares y correlacionadas.
- CTEs (Common Table Expressions) con `WITH`.

## 3. Tipos de Datos Especiales
- Uso de **JSONB** para datos semi-estructurados y búsqueda sobre los mismos (`@>`, `->>`).
- Arrays nativos.

## 4. Transacciones y Control de Concurrencia
- `BEGIN`, `COMMIT`, `ROLLBACK`.
- Niveles de aislamiento (Read Committed, Serializable).
- Bloqueos implícitos y explícitos (Deadlocks).
