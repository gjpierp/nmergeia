# Infrastructure as Code (IaC) und Serverless Framework

Lambdas und Tabellen durch Klicken in der AWS-Weboberfläche zu erstellen, ist nicht reproduzierbar, kann nicht in Git versioniert werden und wird deine geistige Gesundheit zerstören, wenn du deine Entwicklungsumgebung in die Produktion duplizieren musst (Staging vs. Prod).

Die einzige professionelle Art, in der Cloud zu arbeiten, ist durch **Infrastructure as Code (IaC)**.

## 1. Das IaC-Ökosystem

Du hast drei riesige Werkzeuge zur Auswahl:
1. **Terraform (HashiCorp):** Agnostisch, ermöglicht das Erstellen von Dingen in AWS, Azure und Google. Hervorragend für Netzwerke und harte Infrastruktur.
2. **AWS SAM / CDK:** Native Amazon-Tools. CDK ermöglicht es dir, Infrastruktur mit TypeScript zu definieren.
3. **Serverless Framework (Der Standard für Lambdas):** Das benutzerfreundlichste und leistungsstärkste Tool, das sich ausschließlich auf schnelle Serverless-Deployments konzentriert.

## 2. Arbeiten mit dem Serverless Framework

Anstatt die Konsole zu verwenden, beschreibst du deine Infrastruktur in einer YAML-Datei.

```yaml
# serverless.yml
service: nmerge-api-usuarios

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  stage: ${opt:stage, 'dev'} # Erlaubt Deployment nach --stage dev oder --stage prod
  environment:
    TABLE_NAME: ${self:custom.tableName}
  
  # Standardisierte IAM-Berechtigungen (Prinzip der geringsten Privilegien)
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
        BillingMode: PAY_PER_REQUEST # Komplett Serverless, keine provisionierte Kapazität
```

### Die Macht des Deployments

Mit dieser Datei in deinem Repository dauert es nur einen einzigen Befehl, um 100% deiner Architektur hochzufahren (die DynamoDB-Tabelle, das API Gateway, die Zuweisung von IAM-Sicherheitsberechtigungen und die Lambda):

```bash
# Verpackt deinen Code, lädt eine ZIP-Datei auf S3 hoch und aktualisiert CloudFormation
sls deploy --stage prod
```

## 3. Automatische Sicherheit (IAM Roles)

Beachte den Abschnitt `iam` im YAML. Standardmäßig hat eine Lambda in AWS **keine Berechtigung, irgendetwas zu tun**. Wenn sie versucht, DynamoDB ohne eine zugewiesene IAM-Rolle zu lesen, wirft sie einen `AccessDenied`-Fehler.
Das Schreiben der Infrastruktur in Code ermöglicht es dir, auf Github visuell zu überprüfen, welche Lambdas Löschzugriff (`dynamodb:DeleteItem`) und welche nur Lesezugriff haben, wobei das **Prinzip der geringsten Privilegien (Principio del Menor Privilegio)** angewendet wird.

Auf der **Expertenstufe (Nivel Experto)** werden wir aufhören, in synchronen APIs zu denken, und zum vollständigen Event-Driven-Modell übergehen, indem wir SQS, SNS und EventBridge zur Choreografie von Microservices verwenden.
