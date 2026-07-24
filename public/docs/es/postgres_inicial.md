# PostgreSQL: Despliegue Zero-Setup y Conceptos Base

> [!IMPORTANT]
> **🔐 NGAC Policy Required:** `PostgresInicial`  
> **Tiempo Estimado:** 3 minutos  
> **Perfil:** Junior / Mid-Level  

Bienvenido a la guía inicial de PostgreSQL. Esta guía está diseñada bajo estándares operativos estrictos para garantizar que levantes una instancia funcional, segura y aislada en menos de un minuto, sin ensuciar tu entorno local.

---

## 1. Entorno Ejecutable (Zero-Setup)

En lugar de instalar binarios locales, utilizaremos Docker para mantener el aislamiento absoluto de los componentes.

Crea un archivo llamado `docker-compose.yml` en tu directorio de trabajo y pega el siguiente contenido:

```yaml
version: '3.8'
services:
  postgres-db:
    image: postgres:15-alpine
    container_name: postgres-initial
    restart: always
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-<tu_contraseña_segura>}
      POSTGRES_DB: nmerge_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - local-net

volumes:
  pgdata:

networks:
  local-net:
    driver: bridge
```

### Ejecución Rápida
Ejecuta el siguiente comando en tu terminal para levantar la base de datos en segundo plano:

```bash
docker-compose up -d
```

> [!NOTE]  
> **Validación:** Puedes comprobar que el puerto está escuchando mediante `docker ps` o intentando conectar con tu cliente favorito (ej. DBeaver o pgAdmin) usando `localhost:5432`.

---

## 2. Variables de Entorno y Seguridad Base

> [!WARNING]
> **FinOps & Security Warning:**  
> Nunca expongas el puerto `5432` en producción sin un firewall (Security Group). Exponer la base de datos a internet incrementa masivamente el riesgo de ataques de fuerza bruta y escaneos de puertos automatizados.  
> Costo estimado de instancia t3.micro en AWS: ~$12 USD/mes.

Asegúrate de tener un archivo `.env` configurado. El estándar del proyecto dicta el siguiente `.env.example`:

```env
# .env.example
DB_HOST=localhost
DB_PORT=5432
DB_USER=root
DB_PASSWORD=<tu_contraseña_segura>
DB_NAME=nmerge_db
```

---

## 3. Comprobación de Salud (Health-Check)

Para verificar matemáticamente que la base de datos está lista para aceptar conexiones, ejecuta un pulso rápido utilizando `pg_isready`:

```bash
docker exec -it postgres-initial pg_isready -U root
```
*Salida esperada:* `/var/run/postgresql:5432 - accepting connections`

---
*Fin de la Guía Inicial. Para optimizaciones de memoria y queries, visita la Guía Básica.*
