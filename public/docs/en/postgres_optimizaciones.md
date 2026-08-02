# Optimización Avanzada de PostgreSQL, Índices GIN/B-Tree y Anti-Patrones ORM

Los ORMs (*Object-Relational Mappers*) como Hibernate, Prisma, TypeORM o Drizzle aceleran el desarrollo inicial, pero constituyen la principal fuente de cuellos de botella y degradación de rendimiento en entornos de producción de alta demanda. PostgreSQL es un motor relacional extremadamente eficiente, pero un ORM mal configurado o una consulta sin indexación adecuada puede colapsarlo en segundos.

---

## 1. El Anti-Patrón N+1 y su Solución Práctica

### ❌ Ejemplo Incorrecto (Genera 51 consultas a la Base de Datos)

```typescript
// En TypeORM o Prisma (Lazy Loading por defecto):
const ordenes = await db.orden.findMany({ take: 50 });

for (const orden of ordenes) {
  // Ejecuta una consulta adicional POR CADA registro retornado
  const cliente = await db.cliente.findUnique({ where: { id: orden.clienteId } });
  console.log(`Orden #${orden.id} - Cliente: ${cliente.nombre}`);
}
```

### ✅ Ejemplo Correcto (1 sola consulta optimizada con Eager Loading / JOIN)

```typescript
// TypeORM
const ordenes = await db.orden.findMany({
  take: 50,
  include: { cliente: true } // Utiliza INNER/LEFT JOIN en Postgres
});
```

#### SQL Real Generado por PostgreSQL:
```sql
SELECT 
    o.id AS orden_id, 
    o.monto, 
    o.fecha, 
    c.id AS cliente_id, 
    c.nombre AS cliente_nombre, 
    c.email
FROM ordenes o
INNER JOIN clientes c ON o.cliente_id = c.id
ORDER BY o.fecha DESC
LIMIT 50;
```

---

## 2. Benchmark de Índices: B-Tree vs GIN vs Hash

### A. Estructura de Tabla y Creación de Índices

```sql
-- Creación de la tabla de auditoría masiva
CREATE TABLE logs_auditoria (
    id BIGSERIAL PRIMARY KEY,
    usuario_id UUID NOT NULL,
    nivel_prioridad VARCHAR(20) NOT NULL,
    metadatos JSONB NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1. Índice B-Tree para rangos de fechas (Frecuencia de lectura <, >, BETWEEN)
CREATE INDEX idx_auditoria_fecha ON logs_auditoria USING btree (fecha_creacion DESC);

-- 2. Índice Hash para búsquedas exactas por UUID de usuario (Menor espacio en disco)
CREATE INDEX idx_auditoria_usuario_hash ON logs_auditoria USING hash (usuario_id);

-- 3. Índice GIN para búsquedas dentro de documentos JSONB
CREATE INDEX idx_auditoria_meta_gin ON logs_auditoria USING gin (metadatos jsonb_path_ops);
```

### B. Ejemplo de Búsqueda JSONB Usando el Índice GIN

```sql
-- Consulta optimizada utilizando operador de contención JSONB (@>)
EXPLAIN ANALYZE 
SELECT id, metadatos 
FROM logs_auditoria 
WHERE metadatos @> '{"ip_origen": "192.168.1.100", "status": "FAIL"}';
```

---

## 3. Paginación Eficiente: OFFSET/LIMIT vs Keyset Pagination (Cursor)

### ❌ OFFSET/LIMIT (Lento en tablas con millones de filas)

```sql
-- Postgres debe leer y descartar 1,000,000 de filas antes de retornar las 20 solicitadas
SELECT id, usuario_id, fecha_creacion 
FROM logs_auditoria 
ORDER BY fecha_creacion DESC 
LIMIT 20 OFFSET 1000000;
-- Tiempo estimado de ejecución: 1,850 ms (Sequential / Index Scan continuo)
```

### ✅ Keyset Pagination (Cursor Logarítmico O(log N))

```sql
-- El cliente envía el ID y la fecha del último registro obtenido en la página anterior
SELECT id, usuario_id, fecha_creacion 
FROM logs_auditoria 
WHERE fecha_creacion < '2026-07-29 10:00:00.000000+00' 
ORDER BY fecha_creacion DESC 
LIMIT 20;
-- Tiempo estimado de ejecución: 2.1 ms (Index Scan directo mediante árbol B-Tree)
```

---

## 4. Pooler de Conexiones de Producción: Configuración PgBouncer

Para evitar que PostgreSQL supere su límite de procesos en memoria (`max_connections`), se utiliza **PgBouncer** en modo `transaction`.

### Configuración Práctica `pgbouncer.ini`:

```ini
[databases]
* = host=${DB_HOST} port=${DB_PORT} user=${DB_USER} password=${DB_PASSWORD}

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 5000
default_pool_size = 50
min_pool_size = 10
reserve_pool_size = 5
reserve_pool_timeout = 5
```
