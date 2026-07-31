# PL/SQL y Rendimiento

PL/SQL es el lenguaje procedimental incrustado en el motor Oracle. Su velocidad es insuperable porque se ejecuta en el mismo proceso de memoria que los datos.

```sql
CREATE OR REPLACE PROCEDURE actualizar_salarios(p_departamento IN NUMBER) IS
BEGIN
    UPDATE empleados 
    SET salario = salario * 1.10 
    WHERE id_dept = p_departamento;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/
```
