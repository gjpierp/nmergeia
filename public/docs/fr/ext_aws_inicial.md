# Cloud Computing et Architecture sans Serveur

Bienvenue dans le Cloud. Pendant des décennies, héberger une application signifiait louer des serveurs physiques (Bare-Metal). Ensuite, nous sommes passés aux Machines Virtuelles (EC2) et aux Conteneurs (Docker). Aujourd'hui, le sommet de l'évolution est le **Serverless**.

## 1. Que signifie "Serverless" ?

Serverless (sans serveur) ne signifie pas que les serveurs ont magiquement disparu. Cela signifie que **la gestion, la scalabilité et la maintenance des serveurs vous sont totalement invisibles.**

```mermaid
graph LR
    Usuario[Utilisateur] -->|Requête HTTP| API[API Gateway]
    API -->|Déclenche| Lambda[AWS Lambda (Code)]
    Lambda -->|Consulte| DB[(DynamoDB)]
    
    subgraph sub_1 ["Vous ne gérez ni Système dExploitation, ni Correctifs, ni RAM"]
        API
        Lambda
        DB
    end
```

### Avantages Radicaux
* **Paiement à l'Usage Réel :** Si votre application a 0 utilisateur le week-end, vous payez exactement 0,00 $. (Contrairement à un VPS facturé 24/7).
* **Passage à l'Échelle Infini et Instantané :** Si vous passez de 10 utilisateurs à 10 000 en une seconde, AWS duplique automatiquement votre code des milliers de fois sans que vous n'ayez absolument rien à faire.
* **Zéro Maintenance :** Vous n'aurez jamais à mettre à jour la version de Linux ni à installer de patch de sécurité pour le Noyau (Kernel).

## 2. Les Piliers d'AWS Serverless

L'écosystème Serverless d'AWS est construit à partir de trois pièces de Lego fondamentales :

| Service | Fonction | Analogie Traditionnelle |
| :--- | :--- | :--- |
| **API Gateway** | Le Portier. Reçoit les requêtes HTTP, valide l'Authentification et achemine le trafic. | Nginx / Apache / Express Router |
| **AWS Lambda** | Le Cerveau. Exécute votre code (Node.js, Python, Go) durant des millisecondes. | Votre Contrôleur / Logique Métier |
| **DynamoDB** | La Mémoire. Base de données NoSQL avec une latence de 1 milliseconde. | MongoDB / PostgreSQL |

## 3. Le Changement de Paradigme dans le Code

Sur un serveur Node.js traditionnel, vous démarrez le serveur en écoutant sur un port (`app.listen(3000)`). En Serverless, **votre code est "en veille"** jusqu'à ce qu'un événement le réveille.

```javascript
// Voici à quoi ressemble une AWS Lambda. Pas de serveur, seulement une fonction pure.
export const handler = async (event) => {
  // L'objet 'event' contient tout ce qu'API Gateway a reçu (En-têtes, Corps)
  console.log("Événement Reçu :", event.body);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ mensaje: "Bonjour depuis le Cloud Serverless !" }),
  };
};
```

## Prochaines Étapes
Nous avons compris que le Serverless repose sur l'exécution dirigée par les événements (Event-Driven Computing). Dans le **Niveau Basique**, nous explorerons en profondeur AWS Lambda, ses contraintes de temps, ainsi que le concept de "Cold Start" (Démarrage à froid).
