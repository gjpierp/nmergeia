# Migration et interopérabilité entre bases de données

Stratégies pour quitter les bases de données existantes ou sur site (par exemple, Oracle vers Postgres).

## Outils de migration
Utilisation de *AWS SCT (Schema Conversion Tool)* et *DMS (Data Migration Service)* pour la réplication CDC (Change Data Capture).

## Stratégie de figue étrangleur
Migrer de table en table. L'application écrit en double jusqu'à ce que l'intégrité soit confirmée.

```sirène
graphique TD
  A[Application monolithique] --> B[Oracle DB]
  A --> C[Nouveau microservice]
  C --> D[PostgreSQL]
  B-. Synchronisation CDC .-> D
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

