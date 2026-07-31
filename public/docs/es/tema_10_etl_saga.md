# Patrón Saga y Coreografía de Eventos (ETL vs EDA)

En las arquitecturas monolíticas, garantizar la integridad de los datos es sencillo gracias a las **Transacciones ACID** de las bases de datos relacionales (Begin, Commit/Rollback). Sin embargo, cuando rompes el monolito en microservicios con bases de datos independientes, las transacciones distribuidas clásicas (2PC - Two-Phase Commit) fallan debido a bloqueos, alta latencia y fallas de red.

## 1. El Problema de las Transacciones Distribuidas
Imagina un flujo de E-commerce moderno:
1. El `Servicio de Órdenes` crea el pedido (BD Postgres).
2. El `Servicio de Inventario` reserva los productos (BD MongoDB).
3. El `Servicio de Pagos` cobra la tarjeta (API externa).

¿Qué pasa si el pago falla? No puedes hacer un simple "Rollback" en Postgres y MongoDB porque están en servidores distintos. Necesitas un mecanismo de compensación a nivel de aplicación.

## 2. El Patrón Saga
Una **Saga** es una secuencia de transacciones locales. Cada servicio ejecuta su transacción local (actualiza su base de datos) y luego publica un evento que dispara el siguiente paso en la saga.

Si una transacción local falla (ej. tarjeta rechazada), la saga ejecuta **transacciones de compensación** en reversa para deshacer el trabajo de los pasos anteriores. En lugar de un *Rollback* técnico de SQL, se ejecuta un *Rollback* lógico (ej. si se creó el pedido, la compensación es cambiar el estado a "Cancelado").

## 3. Implementación de Saga: Coreografía vs Orquestación

Existen dos formas principales de coordinar una Saga:

### A. Coreografía (Bailarines Autónomos)
No hay un controlador central. Cada servicio escucha los eventos de otros servicios y reacciona de forma autónoma.
* **Flujo:** Órdenes publica `OrderCreated`. Inventario lo escucha y reserva stock, luego publica `StockReserved`. Pagos escucha eso y procesa el cargo.
* **Ventajas:** Extremadamente desacoplado y rápido. Ideal para sagas simples (2-4 pasos).
* **Desventajas:** A medida que el sistema crece, entender el flujo global es casi imposible sin herramientas de *observabilidad* potentes, porque la lógica está distribuida ("Event Spaguetti").

### B. Orquestación (El Director de Orquesta)
Existe un coordinador central (el Orquestador) que le dice a cada servicio qué hacer.
* **Flujo:** El servicio de Órdenes crea un registro y le dice al Orquestador: "Empieza la saga". El Orquestador manda un comando a Inventario: "Reserva stock". Si inventario responde OK, el Orquestador le manda un comando a Pagos. Si pagos falla, el Orquestador le dice a Inventario: "Libera el stock".
* **Ventajas:** Flujo claro y centralizado. Fácil de monitorear. Se sabe exactamente en qué estado está la transacción global.
* **Desventajas:** El orquestador puede convertirse en un punto único de falla (SPOF) o en un embudo de rendimiento si no está bien diseñado.

## 4. De ETL Batch a Streaming (CDC)
En el mundo analítico, los procesos **ETL (Extract, Transform, Load)** clásicos se ejecutan de noche (Batch) moviendo datos del monolito al Data Warehouse. En microservicios orientados a eventos, esto evoluciona hacia **CDC (Change Data Capture)**.
En lugar de hacer consultas pesadas por la noche, herramientas como **Debezium** leen el *Transaction Log (WAL)* de la base de datos en tiempo real y publican cada INSERT/UPDATE como un evento en Kafka, alimentando los Data Lakes y sistemas analíticos en tiempo real (Streaming).
