# Migración de Bases de Datos (Migrations & Seeds)

Gestionar la estructura (Esquema) de la base de datos es igual de crítico que gestionar el código fuente. Si subes un código a Producción que espera una columna `correo_electronico` pero la base de datos en Producción aún tiene `email`, tu sistema arrojará un error 500 masivo.

## 1. El Peligro del SQL Manual (State-based DB Management)
El flujo "amateur" de bases de datos implica que un DBA ejecuta un script SQL (`ALTER TABLE...`) directamente en la consola de producción. 
* Si se incorpora un nuevo desarrollador, no sabe cómo configurar su base de datos local para que coincida con la de producción.
* Es imposible hacer *Rollback* si el cambio introduce un bug.
* No hay integración posible en tuberías de CI/CD.

## 2. Migraciones como Código (Migration-based DB Management)
Una **Migración** es un archivo de código que describe un cambio estructural incremental (una versión) de tu base de datos.
Herramientas populares como **Flyway**, **Liquibase**, **TypeORM Migrations**, **Prisma**, o **Alembic** se encargan de orquestar estos archivos.

### Anatomía de una Migración (Up y Down)
Toda migración profesional debe ser **bidireccional**:
* `Up` (Hacia adelante): El cambio que quieres aplicar. Ejemplo: `CREATE TABLE usuarios;`
* `Down` (Hacia atrás / Reversión): Cómo deshacer EXACTAMENTE lo que hiciste en el paso Up. Ejemplo: `DROP TABLE usuarios;`.
  * *Excepción:* Algunas migraciones son irreversibles por naturaleza (ej. truncar una tabla masivamente o borrar una columna, ya que los datos se pierden en el *Drop*). En esos casos, el `Down` debe lanzar una excepción explícita.

### La Tabla de Historial (Migrations Table)
¿Cómo sabe el sistema qué migraciones ya corrieron?
La herramienta crea una tabla oculta en tu base de datos (ej. `flyway_schema_history` o `_migrations`). Cuando ejecutas el comando de migración, la herramienta lee todos tus archivos, mira cuáles no están registrados en esa tabla, y los ejecuta **en estricto orden cronológico** o secuencial (ej. V1, V2, V3).

## 3. Seeders (Semillas de Datos)
Las migraciones construyen la "estructura" de la casa, pero los **Seeders** amueblan la casa con los datos iniciales necesarios para que la aplicación funcione.
* **Seeders de Configuración/Producción:** Inyectan datos inmutables y obligatorios, como los Roles del sistema (Admin, Usuario) o Países y Divisas. Se corren una sola vez en producción.
* **Seeders de Desarrollo (Fake Data):** Llenan la base local del desarrollador con 10,000 usuarios falsos, órdenes aleatorias y nombres ficticios (usando librerías como *Faker.js*). Esto permite al dev probar el sistema sin necesidad de descargar volcados sensibles de la base de datos productiva.

## 4. Reglas de Oro en Migraciones Empresariales
1. **Nunca editar una migración vieja:** Si ya le hiciste *commit* y *push* a una migración (ej. V5_agrega_edad) y los demás desarrolladores la corrieron, TIENES ESTRICTAMENTE PROHIBIDO editar ese archivo. Si te equivocaste y era "fecha_nacimiento", debes crear un NUEVO archivo V6 que altere la columna.
2. **Backward Compatibility (Retrocompatibilidad en Blue/Green Deployment):** Si estás eliminando o renombrando una columna, debes hacerlo en MÚLTIPLES pases de despliegue. 
   - Fase 1: Agregas la columna nueva. Despliegas el código que escribe en ambas, pero lee de la vieja.
   - Fase 2: Un script migra la data vieja a la nueva. El código ahora lee de la nueva.
   - Fase 3: Borras la columna vieja. 
   De esta forma logras *Zero-Downtime Deployments*.
