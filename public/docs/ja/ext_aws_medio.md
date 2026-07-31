# AWS 中級：API Gateway と DynamoDB (サーバーレススタック)

世界からアクセスできなかったり、データを永続的に保存できなかったりする場合、コードをLambdaで実行しても役に立ちません。ここで、サーバーレスの三位一体（トリニティ）が完成します。

## 1. Amazon API Gateway

API Gatewayは家の玄関のドアとして機能します。HTTP エンドポイント (`https://api.tu-dominio.com/usuarios`) を公開し、それらをLambda関数にリンクします。

### 重要な利点
* **ネイティブのアンチ DDoS 保護:** AWS Shieldと統合されています。
* **スロットリング (Throttling / 制限):** バックエンドと予算を保護するために、秒間 10,000 リクエストを超える場合はリクエストを拒否するように構成できます。
* **ドアでの認証 (Auth):** メインのLambdaを起動する「前」に、JWTトークンを検証（Amazon Cognito またはカスタム Lambda オーソライザーを使用）でき、コストを節約できます。

```mermaid
graph LR
    Hacker[攻撃者] -->|100万 リクエスト| API[API Gateway]
    API -->|"99% を拒否 (スロットリング)"| /dev/null
    API -->|正当なリクエスト| Lambda[Lambda (救済された)]
```

## 2. Amazon DynamoDB: サーバーレスデータベース

10,000個の同時Lambdaを従来のPostgreSQLに接続すると、同時接続数の制限（OOM - メモリ不足）を超えてデータベースがダウンします。リレーショナルデータベースはサーバーレスのために生まれたのではありません。

**DynamoDB** は AWS 独自の NoSQL データベースです。秒間 10 リクエストであろうと秒間 1,000 万リクエストであろうと関係なく、そのレイテンシは1桁（約 5 ミリ秒）に保たれます。

### DynamoDB の主要概念
「関係（リレーション）」(JOIN) を持つテーブルはありません。すべては2つのキーを中心に設計されています。
1. **パーティションキー (Partition Key / PK):** データが保存されるAWSの物理サーバーを決定します。
2. **ソートキー (Sort Key / SK):** その物理パーティション内でデータをソートします。

```json
// DynamoDB のアイテム (Item) の例
{
  "PK": "USER#123",            // (パーティションキー)
  "SK": "METADATA#123",        // (ソートキー)
  "nombre": "Alice",
  "email": "alice@nmerge.ai",
  "suscripcion": "PREMIUM"
}
```

### Node.js からの基本操作 (AWS SDK v3)

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
  
  return { statusCode: 201, body: "ユーザーが DynamoDB に保存されました" };
};
```

## 次のステップ
AWS Web コンソール (Click-Ops) をクリックしてこれらのリソースを作成することは、業界では大罪です。**上級レベル**では、Serverless Framework、SAM、または Terraform を使用してコードとしてのインフラストラクチャ (IaC) を採用します。
