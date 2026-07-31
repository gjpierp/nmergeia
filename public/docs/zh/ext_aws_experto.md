# AWS 专家：事件驱动架构 (Event-Driven)、SQS、SNS 与 EventBridge

到目前为止，我们已经使用了同步 Lambda：用户发出 HTTP 请求，等待 500 毫秒，然后收到 HTTP 响应。

但是，如果在创建用户帐户时，我们必须生成 PDF、发送 3 封欢迎电子邮件、处理付款并通知公司怎么办？如果你在处理 HTTP 请求的那个 Lambda 中完成所有这些操作，用户将盯着加载屏幕 12 秒。更糟糕的是，如果邮件服务在第 11 秒失败，你将丢失整个事务。

在企业级 (Enterprise) 架构中，我们转向**异步和事件驱动 (Event-Driven)** 模型。

## 1. AWS 消息传递三巨头

```mermaid
graph TD
    API[API Gateway] --> LambdaAuth[Lambda 创建用户]
    LambdaAuth -->|发布事件 UsuarioCreado| Broker{事件总线}
    LambdaAuth -.->|立即响应 201| Usuario
    
    Broker -->|"通知 (Fan-Out)"| Queue1[SQS 队列 (电子邮件)]
    Broker -->|"通知 (Fan-Out)"| Queue2[SQS 队列 (支付)]
    Broker -->|"通知 (Fan-Out)"| Queue3[SQS 队列 (报告)]
    
    Queue1 --> LambdaEmail[Lambda 发送邮件]
    Queue2 --> LambdaPago[Lambda 处理支付]
```

### AWS SNS (简单通知服务 Simple Notification Service)
这是一个 **Pub/Sub (发布者/订阅者)** 系统。Lambda 向一个 SNS“主题 (Topic)”发送**一个**消息。该主题会立即将消息的克隆分发给数千个订阅者（Fan-Out 扇出效应）。

### AWS SQS (简单队列服务 Simple Queue Service)
这是一个**消息队列 (Message Queue)**。消息积累起来等待被处理。这对于控制“压力” (Backpressure) 至关重要。
如果你在黑色星期五收到 50,000 笔购买，SQS 会保留它们，你的 Lambda 会以每分钟 100 笔的速度处理它们，保证 0% 的失败率，而不是同时调用 50,000 个支付 Lambda 并击垮你的银行网关。

### Amazon EventBridge (企业总线)
这是用于巨型微服务架构的 SNS 的演变版。它允许创建智能过滤规则。
示例：EventBridge 收到一个 JSON。如果 JSON 写着 `"tipo": "PAGO_RECHAZADO"`，它会直接路由到欺诈微服务，而不会唤醒其他服务。

## 2. 死信队列 (Dead Letter Queues - DLQ)

墨菲定律规定系统终将失败。如果发送电子邮件的 Lambda 因为 SendGrid 宕机而失败怎么办？

多亏了 SQS，如果 Lambda 抛出异常，消息将返回到队列并自动重试。如果连续失败 3 次，该消息将被发送到**死信队列 (Dead Letter Queue)**。
这让你能去安心睡觉。第二天，你检查 DLQ，修复代码中的 bug，并告诉 AWS：“重新处理这 500 个失败的消息”。永远不会丢失任何数据。

## 3. 终极弹性

使用此模式，你的 API 始终在 50 毫秒内响应。繁重的工作在后台以分布式、自动扩展、具有自动重试且不丢失数据的方式进行。这是云计算的真正威力。

在**优化**级别中，你将通过使用 C/Rust 编写 Lambda、预置并发 (Provisioned Concurrency) 和微秒级缓存 DAX 来挤压财务成本 (FinOps) 和消除瓶颈。
