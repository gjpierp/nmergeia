# Tablespaces y Usuarios

En Oracle, no hay "bases de datos" por proyecto como en MySQL o Postgres. Hay **Schemas** (ligados a un Usuario) que viven dentro de **Tablespaces**.

```sql
-- Crear un tablespace (Disco)
CREATE TABLESPACE inventario_tbs 
DATAFILE 'inventario01.dbf' SIZE 1G AUTOEXTEND ON;

-- Crear un usuario y asignarle el tablespace
CREATE USER usr_inventario IDENTIFIED BY password_seguro
DEFAULT TABLESPACE inventario_tbs;
```
