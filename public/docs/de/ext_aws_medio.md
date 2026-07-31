# API Gateway und DynamoDB (Der Serverless Stack)

Code in Lambda auszuführen, ist nutzlos, wenn die Welt nicht darauf zugreifen kann oder wenn du Daten nicht dauerhaft speichern kannst. Hier vervollständigen wir die Serverless-Dreifaltigkeit.

## 1. Amazon API Gateway

Das API Gateway fungiert als Haupteingangstür zu deinem Haus. Es exponiert HTTP-Endpoints (`https://api.deine-domain.com/usuarios`) und verknüpft sie mit deinen Lambda-Funktionen.

### Kritische Vorteile
* **Nativer Anti-DDoS-Schutz:** Integriert mit AWS Shield.
* **Throttling (Drosselung):** Du kannst es so konfigurieren, dass Anfragen abgelehnt werden, wenn sie 10.000 req/sec überschreiten, um dein Backend und dein Budget zu schützen.
* **Authentifizierung an der Tür:** Es kann JWT-Tokens (mit Amazon Cognito oder einem benutzerdefinierten Lambda-Authorizer) validieren, *bevor* es deine Haupt-Lambda überhaupt weckt, was Geld spart.

```mermaid
graph LR
    Hacker[Angreifer] -->|1M Anfragen| API[API Gateway]
    API -->|"Lehnt 99% ab (Throttling)"| /dev/null
    API -->|Legitime Anfragen| Lambda[Lambda (Gerettet)]
```

## 2. Amazon DynamoDB: Serverless-Datenbank

Wenn du 10.000 gleichzeitige Lambdas mit einem traditionellen PostgreSQL verbindest, wirst du die Datenbank zum Absturz bringen, weil das Limit der gleichzeitigen Verbindungen überschritten wird (OOM - Out of Memory). Relationale Datenbanken wurden nicht für Serverless geboren.

**DynamoDB** ist die proprietäre NoSQL-Datenbank von AWS. Es spielt keine Rolle, ob du 10 Anfragen pro Sekunde oder 10 Millionen Anfragen pro Sekunde an sie richtest; ihre Latenz bleibt im einstelligen Bereich (~5 Millisekunden).

### Schlüsselkonzepte von DynamoDB
Es gibt keine Tabellen mit "Beziehungen" (JOINs). Alles dreht sich um zwei Schlüssel:
1. **Partition Key (PK):** Entscheidet, auf welchem physischen AWS-Server die Daten gespeichert werden.
2. **Sort Key (SK):** Sortiert die Daten innerhalb dieser physischen Partition.

```json
// Beispiel für ein Element (Item) in DynamoDB
{
  "PK": "USER#123",            // (Partition Key)
  "SK": "METADATA#123",        // (Sort Key)
  "nombre": "Alice",
  "email": "alice@nmerge.ai",
  "suscripcion": "PREMIUM"
}
```

### Grundlegende Operationen aus Node.js (AWS SDK v3)

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
  
  return { statusCode: 201, body: "Benutzer in DynamoDB gespeichert" };
};
```

## Nächste Schritte
Diese Ressourcen durch Klicken in der AWS-Webkonsole (Click-Ops) zu erstellen, ist eine Todsünde in der Branche. Auf der **Fortgeschrittenen Stufe (Nivel Avanzado)** werden wir Infrastructure as Code (IaC) mit Serverless Framework, SAM oder Terraform einsetzen.
