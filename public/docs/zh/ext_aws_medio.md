# AWS 中级：API Gateway 与 DynamoDB (Serverless 技术栈)

如果世界无法访问你的代码，或者你无法永久保存数据，那么让代码在 Lambda 中运行也是徒劳的。在这里，我们将完成 Serverless 的三位一体。

## 1. Amazon API Gateway

API Gateway 充当你房子的正门。它暴露 HTTP 端点（`https://api.tu-dominio.com/usuarios`）并将它们链接到你的 Lambda 函数。

### 关键优势
* **原生的 Anti-DDoS 保护：** 与 AWS Shield 集成。
* **节流 (Throttling / 限制)：** 你可以配置它拒绝超过 10,000 req/sec 的请求，以保护你的后端和预算。
* **门禁身份验证：** 它可以在甚至唤醒主 Lambda 之前验证 JWT 令牌（使用 Amazon Cognito 或自定义的 Lambda Authorizer），从而节省资金。

```mermaid
graph LR
    Hacker[攻击者] -->|100万次请求| API[API Gateway]
    API -->|"拒绝 99% (Throttling)"| /dev/null
    API -->|合法请求| Lambda[Lambda (获救)]
```

## 2. Amazon DynamoDB：Serverless 数据库

如果你将 10,000 个同时运行的 Lambda 连接到传统的 PostgreSQL，由于超出并发连接限制 (OOM - Out of Memory)，你将击垮数据库。关系型数据库并不是为 Serverless 而生的。

**DynamoDB** 是 AWS 专有的 NoSQL 数据库。无论你每秒发出 10 个请求还是 1000 万个请求，它的延迟都将保持在个位数（~5 毫秒）。

### DynamoDB 的关键概念
没有带“关系” (JOINs) 的表。一切都是围绕两个键设计的：
1. **分区键 (Partition Key - PK)：** 决定数据将保存在哪个 AWS 物理服务器上。
2. **排序键 (Sort Key - SK)：** 在该物理分区内对数据进行排序。

```json
// DynamoDB 中项目 (Item) 的示例
{
  "PK": "USER#123",            // (Partition Key)
  "SK": "METADATA#123",        // (Sort Key)
  "nombre": "Alice",
  "email": "alice@nmerge.ai",
  "suscripcion": "PREMIUM"
}
```

### Node.js 的基本操作 (AWS SDK v3)

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const body = JSON.parse(event.body);

  const command = new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: `USER#${body.id}`,
      SK: `METADATA#${body.id}`,
      nombre: body.nombre
    },
  });

  await docClient.send(command);
  
  return { statusCode: 201, body: "用户已保存在 DynamoDB" };
};
```

## 后续步骤
在 AWS web 控制台 (Click-Ops) 中通过点击来创建这些资源是业界的死罪。在**高级阶段**，我们将使用 Serverless Framework、SAM 或 Terraform 拥抱基础设施即代码 (IaC)。
