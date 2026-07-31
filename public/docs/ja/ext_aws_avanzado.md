# AWS 上級：コードとしてのインフラストラクチャ (IaC) と Serverless Framework

AWSのWebインターフェースをクリックしてLambdaやテーブルを作成することは、再現性がなく、Gitでバージョン管理することもできず、開発環境を本番環境（Staging vs Prod）に複製する必要があるときに精神衛生を破壊します。

クラウドで作業する唯一のプロフェッショナルな方法は、**コードとしてのインフラストラクチャ (Infrastructure as Code / IaC)** を通じて行うことです。

## 1. IaC エコシステム

3つの巨大なツールから選択できます：
1. **Terraform (HashiCorp):** プラットフォームに依存せず、AWS、Azure、Googleで作成できます。ネットワークと強固なインフラストラクチャに最適です。
2. **AWS SAM / CDK:** Amazonのネイティブツール。CDKを使用すると、TypeScriptを使用してインフラストラクチャを定義できます。
3. **Serverless Framework (Lambda の標準):** 高速なサーバーレスデプロイメントのみに焦点を当てた、最も使いやすく強力なツール。

## 2. Serverless Framework での作業

コンソールを使用する代わりに、YAML ファイルでインフラストラクチャを記述します。

```yaml
# serverless.yml
service: nmerge-api-usuarios

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  stage: ${opt:stage, 'dev'} # --stage dev または --stage prod へのデプロイを許可します
  environment:
    TABLE_NAME: ${self:custom.tableName}
  
  # 標準化された IAM 権限 (最小権限の原則)
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:PutItem
            - dynamodb:GetItem
          Resource:
            - "arn:aws:dynamodb:${aws:region}:*:table/${self:custom.tableName}"

custom:
  tableName: nmerge-users-${self:provider.stage}

functions:
  crearUsuario:
    handler: src/crearUsuario.handler
    events:
      - httpApi:
          path: /usuarios
          method: post

resources:
  Resources:
    UsuariosTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:custom.tableName}
        AttributeDefinitions:
          - AttributeName: PK
            AttributeType: S
          - AttributeName: SK
            AttributeType: S
        KeySchema:
          - AttributeName: PK
            KeyType: HASH
          - AttributeName: SK
            KeyType: RANGE
        BillingMode: PAY_PER_REQUEST # 完全なサーバーレス、プロビジョニングされたキャパシティなし
```

### デプロイメントの力

このファイルをリポジトリに配置すると、アーキテクチャの100%（DynamoDBテーブル、API Gateway、セキュリティIAM権限の割り当て、Lambda）を起動するのに、1つのコマンドしか必要ありません：

```bash
# コードをパッケージ化し、ZIP ファイルを S3 にアップロードし、CloudFormation を更新します
sls deploy --stage prod
```

## 3. 自動セキュリティ (IAM Roles)

YAML の `iam` セクションに注目してください。デフォルトでは、AWS の Lambda は**何も行う権限を持っていません**。IAM ロールが割り当てられていない状態で DynamoDB を読み取ろうとすると、`AccessDenied` エラーがスローされます。
コードでインフラストラクチャを記述することで、Github 上でどの Lambda が削除アクセス権 (`dynamodb:DeleteItem`) を持ち、どれが読み取り専用アクセス権を持つかを視覚的に監査し、**最小権限の原則**を適用できます。

**エキスパート**レベルでは、同期的なAPIについて考えるのをやめ、SQS、SNS、EventBridge を使用してマイクロサービスをコレオグラフィ（振り付け）する完全なイベント駆動型 (Event-Driven) に移行します。
