# Event-Driven Architecture, SQS, SNS y EventBridge

Hasta ahora hemos usado Lambdas sincrónicas: El usuario hace un HTTP Request, espera 500ms, y recibe un HTTP Response.

Pero, ¿qué pasa si al crear una cuenta de usuario debemos generar un PDF, enviar 3 correos de bienvenida, procesar el pago y notificar a la empresa? Si haces todo eso en la Lambda que atiende el HTTP, el usuario estará mirando una pantalla de carga por 12 segundos. Y peor aún, si el servicio de correos falla en el segundo 11, pierdes toda la transacción.

En la arquitectura Enterprise, pasamos a un modelo **Asíncrono y Dirigido por Eventos (Event-Driven)**.

## 1. El Triunvirato de Mensajería de AWS

```mermaid
graph TD
    API[API Gateway] --> LambdaAuth[Lambda Crear Usuario]
    LambdaAuth -->|Publica Evento UsuarioCreado| Broker{Bus de Eventos}
    LambdaAuth -.->|Responde INMEDIATO 201| Usuario
    
    Broker -->|"Notifica (Fan-Out)"| Queue1[Cola SQS (Emails)]
    Broker -->|"Notifica (Fan-Out)"| Queue2[Cola SQS (Pagos)]
    Broker -->|"Notifica (Fan-Out)"| Queue3[Cola SQS (Reportes)]
    
    Queue1 --> LambdaEmail[Lambda Enviar Correo]
    Queue2 --> LambdaPago[Lambda Procesar Pago]
```

### AWS SNS (Simple Notification Service)
Es un sistema **Pub/Sub (Publicador/Suscriptor)**. La Lambda envía UN solo mensaje a un "Tópico" SNS. Ese tópico distribuye clones del mensaje a miles de suscriptores al instante (Efecto Fan-Out).

### AWS SQS (Simple Queue Service)
Es una **Cola de Mensajes**. Los mensajes se acumulan y esperan a ser procesados. Es fundamental para controlar la "Presión" (Backpressure).
Si recibes 50,000 compras en Black Friday, en lugar de invocar 50,000 Lambdas de pago a la vez y colapsar tu pasarela bancaria, SQS las retiene y tu Lambda las va tomando de a 100 por minuto, garantizando 0% de fallos.

### Amazon EventBridge (El Bus Corporativo)
Es la evolución de SNS para arquitecturas de microservicios gigantes. Permite crear reglas de filtrado inteligentes.
Ejemplo: EventBridge recibe un JSON. Si el JSON dice `"tipo": "PAGO_RECHAZADO"`, lo enruta directamente al Microservicio de Fraude, sin despertar a los demás.

## 2. Dead Letter Queues (DLQ)

La Ley de Murphy dicta que los sistemas fallarán. ¿Qué pasa si la Lambda que envía correos falla porque SendGrid está caído?

Gracias a SQS, si la Lambda lanza una excepción, el mensaje regresa a la cola y se reintenta automáticamente. Si falla 3 veces consecutivas, el mensaje es enviado a una **Dead Letter Queue (Cola de Letras Muertas)**.
Esto te permite irte a dormir. Al día siguiente, revisas la DLQ, corriges el bug en tu código, y le dices a AWS: "Vuelve a procesar estos 500 mensajes fallidos". Ningún dato se pierde jamás.

## 3. Resiliencia Máxima
Al utilizar este patrón, tu API responde siempre en 50 milisegundos. El trabajo pesado ocurre en segundo plano de forma distribuida, auto-escalable, con reintentos automáticos y sin pérdida de datos. Este es el verdadero poder de la Nube.

En el nivel de **Optimizaciones**, exprimirás los costos financieros (FinOps) y los cuellos de botella mediante Lambdas en C/Rust, Provisioned Concurrency, y DAX para cachés de microsegundos.
