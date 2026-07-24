# Oracle DB: Nivel Experto - Índices, Particionamiento y Tuning

Cuando las tablas superan los millones de registros, un `SELECT` puede tardar horas. En el nivel experto abordamos la optimización de consultas y la administración física de los datos.

## 1. El Plan de Ejecución (EXPLAIN PLAN)

Antes de optimizar, debes saber cómo Oracle está resolviendo la consulta. 

```sql
EXPLAIN PLAN FOR 
SELECT * FROM productos WHERE nombre = 'Servidor Blade';

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

Si el plan de ejecución muestra un `TABLE ACCESS FULL` en una tabla masiva, significa que Oracle está leyendo bloque por bloque toda la tabla, lo cual es ineficiente y candidato a un índice.

## 2. Estrategias de Indexación

Oracle ofrece múltiples tipos de índices según la cardinalidad de los datos.

### Índice B-Tree (Por defecto)
Ideal para columnas con alta cardinalidad (muchos valores distintos, como IDs o correos).

```sql
CREATE INDEX idx_productos_nombre ON productos(nombre);
```

### Índice Bitmap
Ideal para columnas con bajísima cardinalidad (pocos valores distintos repetidos masivamente, como Género, Estado Civil o Booleanos 'S'/'N').

```sql
CREATE BITMAP INDEX idx_productos_estado ON productos(estado_activo);
```

### Índice Basado en Funciones
Si tu backend siempre busca usando `LOWER()`, el índice normal no servirá.

```sql
CREATE INDEX idx_prod_nombre_lower ON productos(LOWER(nombre));
-- Ahora esta consulta usará el índice:
-- SELECT * FROM productos WHERE LOWER(nombre) = 'laptop';
```

## 3. Particionamiento (Table Partitioning)

Para tablas del orden de los Gigabytes o Terabytes, los índices no bastan. El particionamiento divide físicamente una tabla en piezas más pequeñas conservando la unidad lógica.

### Particionamiento por Rango (Range Partitioning)
Extremadamente común para tablas de datos históricos.

```sql
CREATE TABLE facturas (
    factura_id NUMBER,
    fecha_emision DATE,
    total NUMBER
)
PARTITION BY RANGE (fecha_emision) (
    PARTITION p_2023 VALUES LESS THAN (TO_DATE('01-01-2024', 'DD-MM-YYYY')),
    PARTITION p_2024 VALUES LESS THAN (TO_DATE('01-01-2025', 'DD-MM-YYYY')),
    PARTITION p_futuro VALUES LESS THAN (MAXVALUE)
);
```

Cuando un usuario consulta `WHERE fecha_emision = '15-05-2024'`, Oracle ejecuta **Partition Pruning**: ignora todas las particiones excepto `p_2024`, reduciendo el I/O drásticamente.

## 4. Bulk Collect y FORALL (PL/SQL Tuning)

Si necesitas procesar millones de filas en PL/SQL, un loop clásico `FOR row IN cursor` causará "Cambios de Contexto" constantes entre el motor SQL y el motor PL/SQL. Se debe usar colecciones en memoria.

```sql
DECLARE
    TYPE t_productos IS TABLE OF productos%ROWTYPE;
    v_productos t_productos;
BEGIN
    -- BULK COLLECT extrae los datos de golpe en ráfagas (fetch_limit)
    SELECT * BULK COLLECT INTO v_productos FROM productos WHERE precio < 100;
    
    -- FORALL hace la escritura masiva
    FORALL i IN 1..v_productos.COUNT
        UPDATE productos 
        SET precio = v_productos(i).precio * 1.05
        WHERE producto_id = v_productos(i).producto_id;
        
    COMMIT;
END;
/
```

¡Felicidades! Tienes una base arquitectónica "World-Class" de Oracle. Con este conocimiento, estás listo para escalar bases de datos en entornos financieros o de altísima concurrencia.
