# Architectures SaaS multi-locataires et multi-langues

## Isolation des données
1. **Silo :** Une base de données par client (coûteuse, sécurisée).
2. **Pool :** Toutes les lignes de la même table avec `tenant_id` + RLS (économique).
3. **Bridge :** Un schéma par client au sein de la même base de données.

## Emplacement mondial
Utiliser des bibliothèques comme « i18next » dans React pour gérer des dictionnaires dynamiques asynchrones.

```sirène
graphique TD
  A[API Gateway] --> B[Tenant A Schema]
  A --> C[Schéma du locataire B]
  A --> D[Schéma du locataire C]
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

