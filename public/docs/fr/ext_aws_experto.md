# Event-Driven Architecture, SQS, SNS et EventBridge

Jusqu'à présent, nous avons utilisé des Lambdas synchrones : l'utilisateur émet une requête HTTP, attend 500ms et reçoit une réponse HTTP.

Mais que se passe-t-il si, lors de la création d'un compte utilisateur, nous devons générer un PDF, envoyer 3 e-mails de bienvenue, traiter le paiement et notifier l'entreprise ? Si vous effectuez tout cela dans la Lambda qui traite la requête HTTP, l'utilisateur restera devant un écran de chargement pendant 12 secondes. Et pire encore, si le service d'e-mailing échoue à la 11ème seconde, vous perdez toute la transaction.

Dans l'architecture Enterprise, nous passons à un modèle **Asynchrone et Piloté par les Événements (Event-Driven)**.

## 1. Le Triumvirat de la Messagerie d'AWS

```mermaid
graph TD
    API[API Gateway] --> LambdaAuth[Lambda Créer Utilisateur]
    LambdaAuth -->|Publie Événement UtilisateurCréé| Broker{Bus dÉvénements}
    LambdaAuth -.->|Répond IMMÉDIATEMENT 201| Usuario[Utilisateur]
    
    Broker -->|"Notifie (Fan-Out)"| Queue1[File SQS (E-mails)]
    Broker -->|"Notifie (Fan-Out)"| Queue2[File SQS (Paiements)]
    Broker -->|"Notifie (Fan-Out)"| Queue3[File SQS (Rapports)]
    
    Queue1 --> LambdaEmail[Lambda Envoyer E-mail]
    Queue2 --> LambdaPago[Lambda Traiter Paiement]
```

### AWS SNS (Simple Notification Service)
C'est un système **Pub/Sub (Éditeur/Abonné)**. La Lambda envoie UN seul message à un "Sujet" (Topic) SNS. Ce sujet distribue instantanément des copies du message à des milliers d'abonnés (Effet Fan-Out).

### AWS SQS (Simple Queue Service)
C'est une **File d'Attente de Messages** (Message Queue). Les messages s'accumulent et attendent d'être traités. C'est fondamental pour contrôler la pression (Backpressure).
Si vous recevez 50 000 achats lors du Black Friday, au lieu d'invoquer 50 000 Lambdas de paiement simultanément et de faire s'effondrer votre passerelle bancaria, SQS les retient et votre Lambda les traite par lots de 100 par minute, garantissant 0% d'échec.

### Amazon EventBridge (Le Bus d'Entreprise)
C'est l'évolution de SNS pour les architectures de microservices géantes. Il permet de créer des règles de filtrage intelligentes.
Exemple : EventBridge reçoit un JSON. Si le JSON indique `"tipo": "PAGO_RECHAZADO"`, il l'achemine directement vers le Microservice de Fraude, sans réveiller les autres.

## 2. Dead Letter Queues (DLQ)

La loi de Murphy dicte que les systèmes finiront par échouer. Que se passe-t-il si la Lambda qui envoie les e-mails échoue parce que SendGrid est en panne ?

Grâce à SQS, si la Lambda lève une exception, le message retourne dans la file et est réessayé automatiquement. S'il échoue 3 fois consécutives, le message est envoyé vers une **Dead Letter Queue (File de Lettres Mortes)**.
Cela vous permet d'aller dormir sereinement. Le lendemain, vous consultez la DLQ, vous corrigez le bug dans votre code, et vous dites à AWS : "Retraite ces 500 messages ayant échoué". Aucune donnée n'est jamais perdue.

## 3. Résilience Maximale
En utilisant ce patron de conception (pattern), votre API répond toujours en 50 millisecondes. Le travail lourd s'effectue en arrière-plan de manière distribuée, auto-scalable, avec des tentatives automatiques et sans perte de données. C'est le véritable pouvoir du Cloud.

Au niveau des **Optimisations**, vous optimiserez au maximum les coûts financiers (FinOps) et les goulots d'étranglement grâce à des Lambdas en C/Rust, à la Provisioned Concurrency, et à DAX pour des caches mesurés en microsecondes.
