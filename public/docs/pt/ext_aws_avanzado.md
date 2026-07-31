# Infraestrutura como Código (IaC) e Serverless Framework

Criar Lambdas e Tabelas clicando na interface web da AWS não é reproduzível, não pode ser versionado no Git e destruirá sua saúde mental quando você precisar duplicar seu ambiente de desenvolvimento para produção (Staging vs Prod).

A única forma profissional de trabalhar na nuvem é por meio da **Infraestrutura como Código (IaC)**.

## 1. O Ecossistema IaC

Você tem três ferramentas gigantes para escolher:
1. **Terraform (HashiCorp):** Agnóstico, permite criar coisas na AWS, Azure e Google. Excelente para redes e infraestrutura pesada.
2. **AWS SAM / CDK:** Ferramentas nativas da Amazon. O CDK permite definir a infraestrutura usando TypeScript.
3. **Serverless Framework (O Padrão para Lambdas):** A ferramenta mais amigável e poderosa focada exclusivamente em implantações Serverless rápidas.

## 2. Trabalhando com Serverless Framework

Em vez de usar o console, você descreve sua infraestrutura em um arquivo YAML.

```yaml
# serverless.yml
service: nmerge-api-usuarios

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  stage: ${opt:stage, 'dev'} # Permite implantar para --stage dev ou --stage prod
  environment:
    TABLE_NAME: ${self:custom.tableName}
  
  # Permissões IAM padronizadas (Princípio do Menor Privilégio)
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
        BillingMode: PAY_PER_REQUEST # Totalmente Serverless, sem capacidade provisionada
```

### O Poder da Implantação

Com esse arquivo no seu repositório, levantar 100% da sua arquitetura (A Tabela DynamoDB, o API Gateway, a atribuição de permissões de segurança IAM e a Lambda) exige apenas um comando:

```bash
# Empacota seu código, envia um arquivo ZIP para o S3 e atualiza o CloudFormation
sls deploy --stage prod
```

## 3. Segurança Automática (IAM Roles)

Observe a seção `iam` no YAML. Por padrão, uma Lambda na AWS **não tem permissão para fazer nada**. Se tentar ler o DynamoDB sem uma role IAM atribuída, ela lançará um erro `AccessDenied`. 
Escrever a infraestrutura em código permite que você audite visualmente no Github quais Lambdas têm acesso de exclusão (`dynamodb:DeleteItem`) e quais têm apenas acesso de leitura, aplicando o **Princípio do Menor Privilégio**.

No **Nível Especialista**, deixaremos de pensar em APIs síncronas e passaremos para o Event-Driven total usando SQS, SNS e EventBridge para coreografar microsserviços.
