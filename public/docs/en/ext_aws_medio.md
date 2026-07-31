# API Gateway and DynamoDB (The Serverless Stack)

Having code running on Lambda is useless if the world cannot access it or if you cannot save data permanently. Here we complete the Serverless trinity.

## 1. Amazon API Gateway

API Gateway acts as the front door of your house. It exposes HTTP endpoints (`https://api.your-domain.com/users`) and links them to your Lambda functions.

### Critical Benefits
* **Native Anti-DDoS Protection:** Integrated with AWS Shield.
* **Throttling:** You can configure it to reject requests if they exceed 10,000 req/sec to protect your backend and your budget.
* **Authentication at the Door:** It can validate JWT tokens (using Amazon Cognito or a custom Lambda Authorizer) *before* even waking up your main Lambda, saving money.

```mermaid
graph LR
    Hacker[Attacker] -->|1M Requests| API[API Gateway]
    API -->|"Rejects 99% (Throttling)"| /dev/null
    API -->|Legitimate Requests| Lambda[Lambda (Saved)]
```

## 2. Amazon DynamoDB: Serverless Database

If you connect 10,000 simultaneous Lambdas to a traditional PostgreSQL, you will bring down the database by exceeding the concurrent connection limit (OOM - Out of Memory). Relational databases were not born for Serverless.

**DynamoDB** is AWS's proprietary NoSQL database. It doesn't matter if you make 10 requests per second or 10 Million requests per second; its latency will remain in the single digits (~5 milliseconds).

### Key DynamoDB Concepts
There are no Tables with "Relationships" (JOINs). Everything is designed around two keys:
1. **Partition Key (PK):** Decides on which physical AWS server the data will be saved.
2. **Sort Key (SK):** Sorts the data within that physical partition.

```json
// Example of an Item in DynamoDB
{
  "PK": "USER#123",            // (Partition Key)
  "SK": "METADATA#123",        // (Sort Key)
  "name": "Alice",
  "email": "alice@nmerge.ai",
  "subscription": "PREMIUM"
}
```

### Basic Operations from Node.js (AWS SDK v3)

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
      name: body.name
    },
  });

  await docClient.send(command);
  
  return { statusCode: 201, body: "User saved in DynamoDB" };
};
```

## Next Steps
Creating these resources by clicking around the AWS web console (Click-Ops) is a deadly sin in the industry. In the **Advanced Level**, we will embrace Infrastructure as Code (IaC) using Serverless Framework, SAM, or Terraform.
