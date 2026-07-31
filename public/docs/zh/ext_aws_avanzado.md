# AWS 高级：基础设施即代码 (IaC) 与 Serverless Framework

通过在 AWS 网页界面点击来创建 Lambda 和表是不可重现的，不能在 Git 中进行版本控制，并且当你需要将开发环境复制到生产环境 (Staging vs Prod) 时会摧毁你的心理健康。

在云端工作的唯一专业方式是使用**基础设施即代码 (IaC)**。

## 1. IaC 生态系统

你有三个巨大的工具可供选择：
1. **Terraform (HashiCorp):** 平台无关，允许在 AWS、Azure 和 Google 中创建资源。非常适合网络和硬基础设施。
2. **AWS SAM / CDK:** Amazon 的原生工具。CDK 允许你使用 TypeScript 定义基础设施。
3. **Serverless Framework（Lambda 的标准）:** 最友好且强大的工具，专注于快速的 Serverless 部署。

## 2. 使用 Serverless Framework

不使用控制台，而是在 YAML 文件中描述你的基础设施。

```yaml
# serverless.yml
service: nmerge-api-usuarios

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  stage: ${opt:stage, 'dev'} # 允许部署到 --stage dev 或 --stage prod
  environment:
    TABLE_NAME: ${self:custom.tableName}
  
  # 标准化 IAM 权限（最小特权原则）
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
        BillingMode: PAY_PER_REQUEST # 完全 Serverless，无预置容量
```

### 部署的力量

有了你仓库中的那个文件，搭建 100% 的架构（DynamoDB 表、API Gateway、分配安全 IAM 权限以及 Lambda）只需要一条命令：

```bash
# 打包你的代码，将 ZIP 文件上传到 S3 并更新 CloudFormation
sls deploy --stage prod
```

## 3. 自动化安全 (IAM 角色)

注意 YAML 中的 `iam` 部分。默认情况下，AWS 中的 Lambda **没有任何执行权限**。如果它在没有分配 IAM 角色的情况下尝试读取 DynamoDB，它将抛出 `AccessDenied` 错误。
在代码中编写基础设施允许你在 Github 中直观地审计哪些 Lambda 具有删除访问权限 (`dynamodb:DeleteItem`)，哪些只有读取权限，从而应用**最小特权原则 (Principio del Menor Privilegio)**。

在**专家级别**，我们将停止考虑同步 API，并全面转向事件驱动 (Event-Driven)，使用 SQS、SNS 和 EventBridge 来编排微服务。
