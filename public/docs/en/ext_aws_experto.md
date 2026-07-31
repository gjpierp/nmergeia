# Event-Driven Architecture, SQS, SNS, and EventBridge

Until now we have used synchronous Lambdas: The user makes an HTTP Request, waits 500ms, and receives an HTTP Response.

But what happens if upon creating a user account we must generate a PDF, send 3 welcome emails, process the payment, and notify the company? If you do all that in the Lambda handling the HTTP request, the user will be staring at a loading screen for 12 seconds. Worse, if the email service fails on second 11, you lose the entire transaction.

In Enterprise architecture, we move to an **Asynchronous Event-Driven** model.

## 1. The AWS Messaging Triumvirate

```mermaid
graph TD
    API[API Gateway] --> LambdaAuth[Create User Lambda]
    LambdaAuth -->|Publishes UserCreated Event| Broker{Event Bus}
    LambdaAuth -.->|IMMEDIATE 201 Response| User
    
    Broker -->|"Notifies (Fan-Out)"| Queue1[SQS Queue (Emails)]
    Broker -->|"Notifies (Fan-Out)"| Queue2[SQS Queue (Payments)]
    Broker -->|"Notifies (Fan-Out)"| Queue3[SQS Queue (Reports)]
    
    Queue1 --> LambdaEmail[Send Email Lambda]
    Queue2 --> LambdaPayment[Process Payment Lambda]
```

### AWS SNS (Simple Notification Service)
It's a **Pub/Sub (Publisher/Subscriber)** system. The Lambda sends ONE single message to an SNS "Topic". That topic instantly distributes clones of the message to thousands of subscribers (Fan-Out Effect).

### AWS SQS (Simple Queue Service)
It's a **Message Queue**. Messages stack up and wait to be processed. It is fundamental for controlling "Backpressure".
If you receive 50,000 purchases on Black Friday, instead of invoking 50,000 payment Lambdas at once and crashing your bank gateway, SQS holds them and your Lambda pulls them in batches of 100 per minute, guaranteeing a 0% failure rate.

### Amazon EventBridge (The Corporate Bus)
It's the evolution of SNS for giant microservices architectures. It allows creating smart filtering rules.
Example: EventBridge receives a JSON. If the JSON says `"type": "PAYMENT_REJECTED"`, it routes it directly to the Fraud Microservice, without waking up the others.

## 2. Dead Letter Queues (DLQ)

Murphy's Law dictates that systems will fail. What happens if the Lambda sending emails fails because SendGrid is down?

Thanks to SQS, if the Lambda throws an exception, the message returns to the queue and is retried automatically. If it fails 3 consecutive times, the message is sent to a **Dead Letter Queue (DLQ)**.
This allows you to go to sleep. The next day, you check the DLQ, fix the bug in your code, and tell AWS: "Reprocess these 500 failed messages". No data is ever lost.

## 3. Maximum Resilience
By using this pattern, your API always responds in 50 milliseconds. The heavy lifting happens in the background in a distributed, auto-scalable way, with automatic retries and no data loss. This is the true power of the Cloud.

In the **Optimizations** level, you will squeeze financial costs (FinOps) and bottlenecks using Lambdas in C/Rust, Provisioned Concurrency, and DAX for microsecond caches.
