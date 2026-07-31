# Sécurité de la couche de données (RLS)

Row-Level Security (RLS) transfère la logique de filtrage des locataires de l'application directement vers la base de données.

## Avantages de RLS dans Postgres
Toute requête malveillante qui effectue « SELECT * FROM factures » sans ID de locataire renverra 0 ligne.

## Gouvernance et politique
Les politiques RLS sont activées à l'aide de « ALTER TABLE factures ENABLE ROW LEVEL SECURITY ; ».

```sirène
graphique TD
  A[Requête : SELECT * FROM utilisateurs] --> B{Politique RLS}
  B -->|Correspondance de l'ID du locataire| C[Renvoie 10 lignes]
  B -->|Aucune correspondance| D[Renvoie 0 lignes]
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

