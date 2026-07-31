# Arquitecturas de Software Modernas

Diseñar software a escala Enterprise exige separar las responsabilidades (Separation of Concerns). Un monolito clásico (MVC) con la lógica mezclada termina convirtiéndose en una "bola de lodo gigante" (Big Ball of Mud) imposible de mantener a largo plazo. Aquí entran los patrones estructurales.

## 1. Arquitectura Hexagonal (Puertos y Adaptadores)
Popularizada por Alistair Cockburn, su objetivo es **aislar el Núcleo del Dominio (Lógica de Negocio)** de cualquier dependencia externa (Base de Datos, Framework web, UI).

* **El Dominio (El Hexágono Interior):** Contiene entidades puras y casos de uso. No sabe si está corriendo en la web, en una terminal o en AWS. No importa librerías externas.
* **Puertos (Interfaces):** Contratos que definen cómo el núcleo se comunica con el exterior.
  * *Puertos de Entrada (Inbound/Driving):* Define qué operaciones se pueden hacer en el sistema (Ej: `CrearUsuarioUseCase`).
  * *Puertos de Salida (Outbound/Driven):* Define qué necesita el sistema del exterior (Ej: `UsuarioRepository`).
* **Adaptadores:** Implementaciones concretas de los puertos.
  * *Adaptador de Entrada:* Un controlador de Express.js o Spring Boot que recibe un HTTP POST y llama al Caso de Uso.
  * *Adaptador de Salida:* Una clase `SqlUsuarioRepository` que implementa el puerto y usa Sequelize/TypeORM para guardar en Postgres.

La ventaja principal: Puedes cambiar Postgres por MongoDB, o Express por un worker de RabbitMQ, escribiendo un nuevo adaptador sin tocar una sola línea de la lógica de negocio.

## 2. CQRS (Command Query Responsibility Segregation)
En sistemas de alto tráfico, la forma en que *escribes* datos es muy distinta a como los *lees*.
* **Commands (Escritura):** Operaciones que mutan el estado (INSERT, UPDATE). Suelen ser pesadas, con validaciones estrictas de negocio. Escriben en la base de datos principal (ej. PostgreSQL en modo Maestro).
* **Queries (Lectura):** Operaciones puras de consulta (GET). No alteran estado. Pueden leer de réplicas de solo-lectura, o incluso de una base de datos completamente distinta y optimizada para búsquedas masivas (ej. Elasticsearch o Redis).

CQRS permite escalar la lectura independientemente de la escritura, algo vital ya que el 90% del tráfico web suele ser de lectura.

## 3. Event-Driven Architecture (EDA)
En lugar de que un microservicio llame directamente a otro de forma síncrona (ej. REST `POST /pagos`), los servicios emiten y reaccionan a **Eventos de Dominio** de forma asíncrona mediante un bus de mensajes (Kafka, RabbitMQ, SQS).
* Ejemplo: El `Servicio de Órdenes` crea un pedido y emite el evento `OrderCreated`. No sabe quién lo está escuchando.
* El `Servicio de Pagos` y el `Servicio de Inventario` escuchan el evento y reaccionan de forma paralela.
* **Beneficio (Desacoplamiento):** Si el servicio de correos está caído, el evento `OrderCreated` se encola y el correo se enviará cuando el servicio se recupere. El flujo principal nunca se bloquea.
