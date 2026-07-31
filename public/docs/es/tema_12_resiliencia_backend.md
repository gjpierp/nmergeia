# Patrones de Resiliencia en el Backend y Microservicios

En sistemas distribuidos, **la red no es confiable**. Los microservicios caen, la latencia fluctúa y las bases de datos experimentan bloqueos (deadlocks). Diseñar para la falla (Design for Failure) no es opcional, es el estándar.

## 1. Retry Pattern con Exponential Backoff
Si el Servicio A llama al Servicio B y este responde con un HTTP 503 (Servicio no disponible) o un HTTP 429 (Too Many Requests), intentar llamarlo de inmediato volverá a fallar y podría agravar la sobrecarga.
* **Retries Inteligentes:** Debes reintentar, pero esperando un tiempo que crece exponencialmente (ej. esperar 1s, luego 2s, luego 4s, 8s). 
* **Jitter (Ruido):** Para evitar el "problema de la estampida" (donde miles de clientes reintentan exactamente al mismo tiempo y tiran el servidor nuevamente), debes sumar un tiempo aleatorio (*jitter*) a tu backoff. Ej: `esperar 4.3s`, en vez de `4.0s` planos.

## 2. Circuit Breaker (El Cortacircuitos)
Inspirado en la ingeniería eléctrica. Si un servicio externo está totalmente caído, ¿para qué seguir enviándole peticiones (y bloqueando tus propios hilos de ejecución de Node.js o Java)?
* **Estado Cerrado (Normal):** Peticiones fluyen normalmente.
* **Estado Abierto (Fallo):** Si los errores superan un umbral (ej. 50% de fallos en 10 segundos), el circuito "salta" (se abre). Durante un tiempo definido (ej. 30 segundos), cualquier nueva llamada devuelve error instantáneamente (Fail Fast) sin siquiera intentar ir a la red, protegiendo tus propios recursos.
* **Estado Medio Abierto:** Pasado el tiempo, deja pasar una petición de prueba. Si es exitosa, cierra el circuito de nuevo. Si falla, lo mantiene abierto.
* *Implementación típica:* `Resilience4j` (Java), `Opossum` (Node.js).

## 3. Rate Limiting y Throttling
Para proteger tus propias APIs públicas, no confíes en el cliente.
* **Rate Limiting:** Bloquear al cliente devolviendo HTTP 429 si hace más de X peticiones por minuto. Fundamental para evitar ataques de fuerza bruta y saturación de la BD. Generalmente se implementa en el API Gateway (Kong, Nginx) usando un caché distribuido como Redis.
* **Throttling:** En vez de bloquear, simplemente encolas o ralentizas la respuesta para que la curva de tráfico sea suave (Smoothing).

## 4. Patrón Outbox (Transactional Outbox)
Si necesitas actualizar tu base de datos y además enviar un evento a RabbitMQ/Kafka, existe un riesgo: ¿Qué pasa si la BD hace commit, pero el microservicio se apaga milisegundos antes de enviar el evento al bróker?
* **Solución (Outbox):** En la misma transacción local de BD donde actualizas los datos, insertas una fila en una tabla llamada `outbox_events`. Como están en la misma transacción ACID, o ocurren ambas o ninguna.
* Un Worker externo (ej. Debezium o un cron local) lee la tabla `outbox_events` y envía los mensajes a Kafka con reintentos infinitos hasta que lleguen. Esto garantiza la entrega **Al Menos Una Vez (At-Least-Once Delivery)**.

## 5. Idempotencia Absoluta
Si usamos *Retries* o *Outbox* (At-Least-Once), inevitablemente un servicio recibirá el mismo mensaje o petición HTTP **dos veces**. 
* Toda mutación (POST, PUT, consumo de eventos) **DEBE ser idempotente**. 
* **Implementación:** El cliente debe mandar un header `Idempotency-Key: <UUID>`. Tu backend almacena esa llave al procesar el pago. Si llega la misma llave 2 segundos después (por un reintento por timeout), el sistema devuelve "Pago Exitoso" inmediatamente sin procesar el cargo dos veces.
