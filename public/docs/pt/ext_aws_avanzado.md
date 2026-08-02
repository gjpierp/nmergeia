# Infraestructura como Código (IaC) y Serverless Framework

Crear Lambdas y Tablas haciendo clics en la interfaz web de AWS no es reproducible, no se puede versionar en Git, y destruirá tu salud mental cuando necesites duplicar tu entorno de desarrollo a producción (Staging vs Prod).

La única forma profesional de trabajar en la nube es mediante **Infraestructura como Código (IaC)**.

## 1. El Ecosistema IaC

Tienes tres herramientas gigantes para elegir:
1. **Terraform (HashiCorp):** Agnóstico, permite crear cosas en AWS, Azure y Google. Excelente para redes e infraestructura dura.
2. **AWS SAM / CDK:** Herramientas nativas de Amazon. CDK te permite definir infraestructura usando TypeScript.
3. **Serverless Framework (El Estándar para Lambdas):** La herramienta más amigable y poderosa enfocada exclusivamente en despliegues Serverless rápidos.

## 2. Trabajando con Serverless Framework

En lugar de usar la consola, describes tu infraestructura en un archivo YAML.

```yaml
# serverless.yml
service: nmerge-api-usuarios

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  stage: ${opt:stage, 'dev'} # Permite desplegar a --stage dev o --stage prod
  environment:
    TABLE_NAME: ${self:custom.tableName}
  
  # Permisos IAM estandarizados (Principio de Menor Privilegio)
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
        BillingMode: PAY_PER_REQUEST # Serverless total, sin capacidad provisionada
```

### El Poder del Despliegue

Con ese archivo en tu repositorio, levantar el 100% de tu arquitectura (La Tabla DynamoDB, el API Gateway, la asignación de permisos IAM de seguridad y la Lambda) toma un solo comando:

```bash
# Empaqueta tu código, sube un archivo ZIP a S3 y actualiza CloudFormation
sls deploy --stage prod
```

## 3. Seguridad Automática (IAM Roles)

Nota la sección `iam` en el YAML. Por defecto, una Lambda en AWS **no tiene permiso para hacer nada**. Si intenta leer DynamoDB sin un rol IAM asignado, lanzará un error `AccessDenied`. 
Escribir la infraestructura en código te permite auditar visualmente en Github qué Lambdas tienen acceso de borrado (`dynamodb:DeleteItem`) y cuáles solo de lectura, aplicando el **Principio del Menor Privilegio**.

En el **Nível Especialista**, dejaremos de pensar en APIs sincrónicas y pasaremos al Event-Driven total usando SQS, SNS y EventBridge para coreografiar microservicios.
