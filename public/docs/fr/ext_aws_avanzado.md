# Infrastructure en tant que Code (IaC) et Serverless Framework

Créer des Lambdas et des Tables en cliquant dans l'interface web d'AWS n'est pas reproductible, ne peut pas être versionné dans Git, et détruira votre santé mentale lorsque vous aurez besoin de dupliquer votre environnement de développement en production (Staging vs Prod).

La seule façon professionnelle de travailler dans le cloud est d'utiliser **l'Infrastructure en tant que Code (IaC)**.

## 1. L'Écosystème IaC

Vous avez trois grands outils au choix :
1. **Terraform (HashiCorp) :** Agnostique, permet de créer des ressources sur AWS, Azure et Google. Excellent pour les réseaux et l'infrastructure lourde.
2. **AWS SAM / CDK :** Outils natifs d'Amazon. CDK vous permet de définir l'infrastructure en utilisant TypeScript.
3. **Serverless Framework (Le Standard pour les Lambdas) :** L'outil le plus convivial et puissant axé exclusivement sur les déploiements Serverless rapides.

## 2. Travailler avec Serverless Framework

Au lieu d'utiliser la console, vous décrivez votre infrastructure dans un fichier YAML.

```yaml
# serverless.yml
service: nmerge-api-usuarios

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  stage: ${opt:stage, 'dev'} # Permet de déployer avec --stage dev ou --stage prod
  environment:
    TABLE_NAME: ${self:custom.tableName}
  
  # Permissions IAM standardisées (Principe du Moindre Privilège)
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
        BillingMode: PAY_PER_REQUEST # Serverless total, sans capacité provisionnée
```

### Le Pouvoir du Déploiement

Avec ce fichier dans votre dépôt, monter 100% de votre architecture (la table DynamoDB, l'API Gateway, l'attribution des permissions de sécurité IAM et la Lambda) ne nécessite qu'une seule commande :

```bash
# Empaquette votre code, téléverse un fichier ZIP dans S3 et met à jour CloudFormation
sls deploy --stage prod
```

## 3. Sécurité Automatique (Rôles IAM)

Remarquez la section `iam` dans le YAML. Par défaut, une Lambda dans AWS **n'a la permission de rien faire**. Si elle tente de lire DynamoDB sans rôle IAM attribué, elle renverra une erreur `AccessDenied`. 
Écrire l'infrastructure en code vous permet d'auditer visuellement dans GitHub quelles Lambdas disposent d'un accès en suppression (`dynamodb:DeleteItem`) et lesquelles ne sont qu'en lecture seule, en appliquant le **Principe du Moindre Privilège**.

Au **Niveau Expert**, nous cesserons de penser en termes d'APIs synchrones et passerons à l'Event-Driven total en utilisant SQS, SNS et EventBridge pour chorégraphier des microservices.
