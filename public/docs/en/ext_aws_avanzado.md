# Infrastructure as Code (IaC) and Serverless Framework

Creating Lambdas and Tables by clicking in the AWS web interface is not reproducible, cannot be versioned in Git, and will destroy your mental health when you need to duplicate your development environment to production (Staging vs Prod).

The only professional way to work in the cloud is through **Infrastructure as Code (IaC)**.

## 1. The IaC Ecosystem

You have three giant tools to choose from:
1. **Terraform (HashiCorp):** Agnostic, allows creating things in AWS, Azure, and Google. Excellent for networking and hard infrastructure.
2. **AWS SAM / CDK:** Amazon's native tools. CDK allows you to define infrastructure using TypeScript.
3. **Serverless Framework (The Standard for Lambdas):** The most friendly and powerful tool focused exclusively on rapid Serverless deployments.

## 2. Working with Serverless Framework

Instead of using the console, you describe your infrastructure in a YAML file.

```yaml
# serverless.yml
service: nmerge-users-api

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  stage: ${opt:stage, 'dev'} # Allows deploying to --stage dev or --stage prod
  environment:
    TABLE_NAME: ${self:custom.tableName}
  
  # Standardized IAM Permissions (Principle of Least Privilege)
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
  createUser:
    handler: src/createUser.handler
    events:
      - httpApi:
          path: /users
          method: post

resources:
  Resources:
    UsersTable:
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
        BillingMode: PAY_PER_REQUEST # Fully Serverless, no provisioned capacity
```

### The Power of Deployment

With that file in your repository, standing up 100% of your architecture (The DynamoDB Table, the API Gateway, the security IAM permissions assignment, and the Lambda) takes a single command:

```bash
# Packages your code, uploads a ZIP file to S3 and updates CloudFormation
sls deploy --stage prod
```

## 3. Automatic Security (IAM Roles)

Notice the `iam` section in the YAML. By default, a Lambda in AWS **has no permission to do anything**. If it tries to read DynamoDB without an assigned IAM role, it will throw an `AccessDenied` error. 
Writing infrastructure in code allows you to visually audit in Github which Lambdas have deletion access (`dynamodb:DeleteItem`) and which are read-only, applying the **Principle of Least Privilege**.

In the **Expert Level**, we will stop thinking about synchronous APIs and move to full Event-Driven architectures using SQS, SNS, and EventBridge to choreograph microservices.
