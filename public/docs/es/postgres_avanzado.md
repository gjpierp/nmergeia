# Nivel Avanzado: Transacciones, Bloqueos y JSONB

> [!IMPORTANT]
> **Propósito de esta guía:** Asegurar la integridad transaccional (ACID), gestionar concurrencia mediante bloqueos (Locks), y trabajar con datos no estructurados utilizando el poderoso tipo `JSONB`.

El nivel avanzado se centra en entornos de producción donde ocurren miles de operaciones por segundo y la integridad de los datos es la máxima prioridad.

## 1. Control de Transacciones (ACID)
Una transacción agrupa un conjunto de sentencias en una única unidad lógica de trabajo. Si algo falla, se revierte todo (`ROLLBACK`).

```sql
BEGIN; -- Inicia la transacción

UPDATE cuentas SET saldo = saldo - 1000 WHERE id = 1; -- Retiro
UPDATE cuentas SET saldo = saldo + 1000 WHERE id = 2; -- Depósito

-- Si todo está correcto
COMMIT;
-- Si ocurre un error
-- ROLLBACK;
```

### Puntos de Guardado (Savepoints)
Permiten hacer rollbacks parciales dentro de una transacción mayor.
```sql
BEGIN;
INSERT INTO logs (msg) VALUES ('Inicio proceso');
SAVEPOINT mi_punto;
INSERT INTO datos_criticos (valor) VALUES ('Error intencional');
-- Algo falló aquí
ROLLBACK TO mi_punto;
COMMIT;
```

## 2. Gestión de Bloqueos (Locks) y Concurrencia
PostgreSQL utiliza MVCC (Multiversion Concurrency Control) para permitir lecturas sin bloquear escrituras. Sin embargo, a veces necesitas bloqueos explícitos.

### FOR UPDATE
Previene que otras transacciones modifiquen las filas leídas hasta que termine tu transacción. Esto es crítico en sistemas financieros o inventarios.

```sql
BEGIN;
-- Bloqueamos el registro del producto
SELECT stock FROM inventario WHERE producto_id = 45 FOR UPDATE;

-- Modificamos el stock con seguridad
UPDATE inventario SET stock = stock - 1 WHERE producto_id = 45;
COMMIT;
```

> [!CAUTION]
> Los Deadlocks ocurren cuando dos transacciones se esperan mutuamente para liberar bloqueos. PostgreSQL los detecta y abortará una de las transacciones (error `40P01`). Diseña tu aplicación para atrapar este error y reintentar la transacción.

## 3. Tipos Avanzados: Arrays y JSONB
PostgreSQL no es solo una base de datos relacional. Soporta de forma nativa estructuras de datos complejas y NoSQL.

### Trabajando con Arrays
```sql
CREATE TABLE publicaciones (
    id SERIAL PRIMARY KEY,
    tags TEXT[]
);

INSERT INTO publicaciones (tags) VALUES (ARRAY['tech', 'postgres', 'avanzado']);

-- Consultar si un array contiene un elemento
SELECT * FROM publicaciones WHERE 'postgres' = ANY(tags);
```

### El Poder del JSONB
`JSONB` guarda datos en un formato binario estructurado, permitiendo indexación y consultas ultra rápidas, fusionando lo mejor de SQL y NoSQL.

```sql
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    payload JSONB
);

INSERT INTO eventos (payload) 
VALUES ('{"usuario": "jdoe", "accion": "click", "metadata": {"boton": "comprar"}}');

-- Extraer valores usando el operador ->> (como texto)
SELECT payload->>'usuario' AS user_name 
FROM eventos 
WHERE payload->'metadata'->>'boton' = 'comprar';
```

### Indexación GIN para JSONB
Para búsquedas veloces dentro de un JSONB masivo, utiliza índices GIN.
```sql
CREATE INDEX idx_eventos_payload ON eventos USING GIN (payload);
```

## 4. Vistas Materializadas (Materialized Views)
Para reportes pesados, las vistas tradicionales pueden ser lentas porque ejecutan la consulta en cada llamada. Las vistas materializadas *guardan* el resultado en disco.

```sql
CREATE MATERIALIZED VIEW reporte_ventas_diario AS
SELECT fecha, SUM(monto) AS total
FROM ventas_historicas
GROUP BY fecha;

-- Para actualizar los datos en la vista (esto bloquea las lecturas a menos que uses CONCURRENTLY)
REFRESH MATERIALIZED VIEW reporte_ventas_diario;
```

---

*Fuente Oficial:* [PostgreSQL 16 - Transacciones y Concurrencia](https://www.postgresql.org/docs/16/mvcc.html)
*Autores:* Enjambre de IA NMerge.
