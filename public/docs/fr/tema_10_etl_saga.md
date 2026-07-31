# Ingestion de données et cohérence distribuée

Les microservices nécessitent une chorégraphie et une orchestration.

## Modèle de saga
Lorsqu'une transaction distribuée échoue, le modèle Saga exécute des actions de *compensation* pour revenir à d'autres microservices.

## ETL contre ELT
- **ETL :** Transformation sur le bus.
- **ELT :** Transformation massive au sein du Data Warehouse (par exemple Snowflake/BigQuery).

```sirène
graphique LR
  A[Service de commande] -->|Créer| B[Service de paiement]
  B -->|Échec| C[Service d'inventaire]
  C -->|Compenser| Un
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

