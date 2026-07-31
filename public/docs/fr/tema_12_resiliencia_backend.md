# Résilience backend et tolérance aux pannes

Un système moderne ne suppose pas que le réseau est digne de confiance.

##Disjoncteurs
Si un microservice externe échoue continuellement, la boucle « s'ouvre » en renvoyant des erreurs rapides au lieu de geler les threads d'exécution.

## Limitation et limitation du débit
Protection contre les DDOS et les abus. Algorithmes *Token Bucket* utilisant Redis.

```sirène
graphique LR
  A[Client] --> B[API Passerelle]
  B -->|Appel lent| C{Disjoncteur}
  C -->|Ouvrir| D[Réponse de secours]
  C -->|Fermé| E[Service Royal]
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

