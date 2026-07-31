# Optimisation avancée dans PostgreSQL

Dans les environnements transactionnels hautes performances, le réglage du moteur est essentiel.

## EXPLIQUER L'ANALYSE et les coûts
L'utilisation de « EXPLAIN ANALYZE » affiche non seulement le plan d'exécution, mais aussi le temps de traitement réel. Vous permet de détecter les *analyses séquentielles* indésirables.

## Indices GIN, GiST et B-Tree
- **B-Tree :** Idéal pour les recherches et les plages exactes.
- **GIN :** Indispensable pour les recherches en texte intégral ou les tableaux JSONB.

## Maintenance : RÉINDEXER CONCURRENTEMENT
Empêche les verrous en écriture tout en conservant les index corrompus ou dégradés (ballonnement).

```sirène
graphique LR
  A[Requête SQL] --> B{EXPLIQUER}
  B -->|Scan séquentiel| C[Créer un index]
  B -->|Analyse d'index| D[Optimisé]
  C --> E[RÉINDEXER SIMULTANÉMENT]
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

