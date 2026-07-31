# API Gateway et DynamoDB (Le Stack Serverless)

Avoir du code qui s'exécute dans Lambda est inutile si le monde extérieur ne peut pas y accéder ou si vous ne pouvez pas sauvegarder vos données de manière permanente. Ici, nous complétons la trinité Serverless.

## 1. Amazon API Gateway

API Gateway agit comme la porte d'entrée principale de votre maison. Il expose des endpoints HTTP (`https://api.tu-dominio.com/usuarios`) et les relie à vos fonctions Lambda.

### Avantages Critiques
* **Protection Anti-DDoS native :** Intégré avec AWS Shield.
* **Throttling (Limitation de débit) :** Vous pouvez le configurer pour rejeter les requêtes si elles dépassent 10 000 req/sec afin de protéger votre backend et votre budget.
* **Authentification à la Porte :** Il peut valider des jetons JWT (en utilisant Amazon Cognito ou un Autoriseur Lambda personnalisé) *avant* même de réveiller votre Lambda principale, vous faisant ainsi économiser de l'argent.

```mermaid
graph LR
    Hacker[Attaquant] -->|1M de Requêtes| API[API Gateway]
    API -->|"Rejette 99% (Throttling)"| /dev/null
    API -->|Requêtes Légitimes| Lambda[Lambda (Sauvée)]
```

## 2. Amazon DynamoDB : Base de Données Serverless

Si vous connectez 10 000 Lambdas simultanées à un PostgreSQL traditionnel, vous ferez tomber la base de données en dépassant la limite de connexions concurrentes (OOM - Out of Memory). Les bases de données relationnelles n'ont pas été conçues pour le Serverless.

**DynamoDB** est la base de données NoSQL propriétaire d'AWS. Peu importe si vous lui adressez 10 requêtes par seconde ou 10 millions de requêtes par seconde ; sa latence se maintiendra sous la barre d'un seul chiffre (~5 millisecondes).

### Concepts Clés de DynamoDB
Il n'y a pas de Tables avec des "Relations" (JOINs). Tout est conçu autour de deux clés :
1. **Partition Key (PK) :** Décide sur quel serveur physique d'AWS la donnée sera stockée.
2. **Sort Key (SK) :** Trie les données au sein de cette partition physique.

```json
// Exemple d'un Élément (Item) dans DynamoDB
{
  "PK": "USER#123",            // (Partition Key)
  "SK": "METADATA#123",        // (Sort Key)
  "nombre": "Alice",
  "email": "alice@nmerge.ai",
  "suscripcion": "PREMIUM"
}
```

### Opérations Basiques desde Node.js (AWS SDK v3)

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
  
  return { statusCode: 201, body: "Utilisateur enregistré dans DynamoDB" };
};
```

## Prochaines Étapes
Créer ces ressources en cliquant dans la console web d'AWS (Click-Ops) est un péché capital dans l'industrie. Dans le **Niveau Avancé**, nous adopterons l'Infrastructure as Code (IaC) en utilisant Serverless Framework, SAM ou Terraform.
