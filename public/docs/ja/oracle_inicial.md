# Oracle DB: Nivel Inicial - Introducción y Entorno

Bienvenido a la guía definitiva de Oracle Database. Oracle es uno de los motores de bases de datos relacionales más robustos y utilizados en entornos Enterprise por su fiabilidad, transaccionalidad y características de alta disponibilidad.

En este nivel inicial, exploraremos qué es Oracle, por qué domina el sector bancario y corporativo, y cómo dar los primeros pasos en su ecosistema.

## 1. ¿Qué es Oracle Database?
Oracle Database es un RDBMS (Relational Database Management System) multi-modelo desarrollado por Oracle Corporation. Se destaca por:
- **Alta Disponibilidad y Escalabilidad (RAC)**: Capacidad de escalar masivamente.
- **Seguridad Robusta**: Cifrado a nivel de celda y auditoría detallada.
- **PL/SQL**: Lenguaje procedural integrado altamente potente.

## 2. Descarga e Instalación

Para entornos de desarrollo, la forma más rápida de usar Oracle sin configuraciones complejas es a través de Docker usando la versión **Oracle Database Free** (antes Express Edition - XE).

### Prerrequisitos
- Docker Desktop o Docker Engine.
- Al menos 2GB de RAM libres.

### Levantar Oracle Free 23c en Docker

Crea un archivo `docker-compose.yml` para aislar el entorno:

```yaml
version: '3.8'
services:
  oracledb:
    image: container-registry.oracle.com/database/free:latest
    container_name: oracle-db
    ports:
      - "1521:1521"
    environment:
      - ORACLE_PWD=<tu_contraseña_segura>
    volumes:
      - oracle-data:/opt/oracle/oradata
      
volumes:
  oracle-data:
```

Para iniciarlo, ejecuta:
```bash
docker-compose up -d
```
*Nota: La primera inicialización puede tardar varios minutos.*

## 3. Conectarse a la Base de Datos

Puedes conectarte usando clientes gráficos como **DBeaver** o **Oracle SQL Developer**. 

**Datos de Conexión Estándar:**
- **Host**: `localhost`
- **Puerto**: `1521`
- **Service Name (o SID)**: `FREE` (en Oracle 23c Free)
- **Usuario**: `sys as sysdba` o `system`
- **Contraseña**: `<tu_contraseña_segura>`

¡Con esto ya tienes un entorno Oracle puramente funcional listo para el siguiente nivel!
