# Event-Driven Architecture, SQS, SNS e EventBridge

Até agora usamos Lambdas síncronas: O usuário faz um Request HTTP, espera 500ms e recebe um Response HTTP.

Mas o que acontece se, ao criar uma conta de usuário, precisarmos gerar um PDF, enviar 3 e-mails de boas-vindas, processar o pagamento e notificar a empresa? Se você fizer tudo isso na Lambda que atende o HTTP, o usuário ficará olhando para uma tela de carregamento por 12 segundos. E pior ainda, se o serviço de correios falhar no segundo 11, você perde toda a transação.

Na arquitetura Enterprise, passamos para um modelo **Assíncrono e Orientado a Eventos (Event-Driven)**.

## 1. O Triunvirato de Mensagens da AWS

```mermaid
graph TD
    API[API Gateway] --> LambdaAuth[Lambda Criar Usuário]
    LambdaAuth -->|Publica Evento UsuarioCreado| Broker{Barramento de Eventos}
    LambdaAuth -.->|Responde IMEDIATO 201| Usuario
    
    Broker -->|"Notifica (Fan-Out)"| Queue1[Fila SQS (E-mails)]
    Broker -->|"Notifica (Fan-Out)"| Queue2[Fila SQS (Pagamentos)]
    Broker -->|"Notifica (Fan-Out)"| Queue3[Fila SQS (Relatórios)]
    
    Queue1 --> LambdaEmail[Lambda Enviar E-mail]
    Queue2 --> LambdaPago[Lambda Processar Pagamento]
```

### AWS SNS (Simple Notification Service)
É um sistema **Pub/Sub (Publicador/Assinante)**. A Lambda envia UM único arquivo/mensagem para um "Tópico" SNS. Esse tópico distribui clones da mensagem para milhares de assinantes instantaneamente (Efeito Fan-Out).

### AWS SQS (Simple Queue Service)
É uma **Fila de Mensagens**. As mensagens se acumulam e esperam para ser processadas. É fundamental para controlar a "Pressão" (Backpressure).
Se você receber 50.000 compras na Black Friday, em vez de invocar 50.000 Lambdas de pagamento de uma vez e travar seu gateway bancário, o SQS as retém e sua Lambda as pega de 100 por minuto, garantindo 0% de falhas.

### Amazon EventBridge (O Barramento Corporativo)
É a evolução do SNS para arquiteturas de microsserviços gigantes. Permite criar regras de filtragem inteligentes.
Exemplo: EventBridge recebe um JSON. Se o JSON disser `"tipo": "PAGO_RECHAZADO"`, ele o roteia diretamente para o Microsserviço de Fraude, sem acordar os outros.

## 2. Dead Letter Queues (DLQ)

A Lei de Murphy dita que os sistemas falharão. O que acontece se a Lambda que envia e-mails falhar porque o SendGrid está fora do ar?

Graças ao SQS, se a Lambda lançar uma exceção, a mensagem retorna para a fila e é repetida automaticamente. Se falhar 3 vezes consecutivas, a mensagem é enviada para uma **Dead Letter Queue (Fila de Cartas Mortas)**.
Isso permite que você vá dormir. No dia seguinte, você analisa a DLQ, corrige o bug no seu código e diz à AWS: "Reprocesse essas 500 mensagens com falha". Nenhum dado é perdido jamais.

## 3. Resiliência Máxima
Ao utilizar esse padrão, sua API responde sempre em 50 milissegundos. O trabalho pesado ocorre em segundo plano de forma distribuída, autoescalável, com tentativas automáticas e sem perda de dados. Este é o verdadeiro poder da Nuvem.

No nível de **Otimizações**, você extrairá os custos financeiros (FinOps) e os gargalos por meio de Lambdas em C/Rust, Provisioned Concurrency e DAX para caches de microssegundos.
