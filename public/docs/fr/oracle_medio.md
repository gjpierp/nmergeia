# Nivel Medio - DML y Transaccionalidad

En este nivel profundizaremos en el Lenguaje de Manipulación de Datos (DML) y una de las características estrella de Oracle: su robusto modelo de control de transacciones (ACID).

## 1. Operaciones DML (Insert, Update, Delete)

Las operaciones básicas en Oracle siguen el estándar SQL pero con particularidades como la cláusula `RETURNING`.

```sql
-- Insertar un registro
INSERT INTO productos (nombre, precio) 
VALUES ('Servidor Blade', 2500);

-- Insertar con cláusula RETURNING (muy útil en backend para obtener el ID generado)
DECLARE
  v_id NUMBER;
BEGIN
  INSERT INTO productos (nombre, precio) 
  VALUES ('Switch Core', 1200) 
  RETURNING producto_id INTO v_id;
  DBMS_OUTPUT.PUT_LINE('ID Generado: ' || v_id);
END;
/

-- Actualizar
UPDATE productos 
SET precio = precio * 1.10 
WHERE nombre LIKE 'Servidor%';

-- Eliminar
DELETE FROM productos WHERE precio < 100;
```

## 2. El Modelo de Transacciones de Oracle

Oracle es famoso por su consistencia en lectura (Read Consistency). Si el Usuario A está actualizando una tabla, el Usuario B seguirá viendo la versión antigua (a través del segmento de *Undo*) hasta que A haga `COMMIT`. **Oracle no bloquea las lecturas a causa de escrituras**.

### Commit y Rollback

En Oracle, todo DML inicia implícitamente una transacción. No se aplica permanentemente hasta que ejecutas `COMMIT`.

```sql
-- Iniciamos una transacción al primer DML
UPDATE productos SET precio = 0 WHERE producto_id = 5;

-- Si nos equivocamos, podemos deshacer todo desde el último COMMIT
ROLLBACK;

-- Si estamos seguros, confirmamos
COMMIT;
```

### Savepoints

Puedes establecer puntos de guardado dentro de una transacción grande.

```sql
INSERT INTO categorias (categoria_id, nombre) VALUES (1, 'Hardware');
SAVEPOINT punto_1;

INSERT INTO categorias (categoria_id, nombre) VALUES (2, 'Software');
-- Si esto falla, podemos volver al punto 1 sin perder el primer INSERT
ROLLBACK TO punto_1;

COMMIT;
```

## 3. Funciones de Ventana (Analíticas)

Las funciones analíticas de Oracle permiten realizar cálculos complejos sobre conjuntos de filas que están relacionadas con la fila actual, sin usar el pesado `GROUP BY`.

```sql
SELECT 
    nombre, 
    precio,
    AVG(precio) OVER () as precio_promedio_global,
    RANK() OVER (ORDER BY precio DESC) as ranking_precio
FROM productos;
```

Comprender la consistencia de lectura y las transacciones es fundamental antes de pasar al Nivel Avanzado, donde exploraremos la programación interna en la base de datos con PL/SQL.
