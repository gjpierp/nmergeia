# Flux de travail Git avancés

La collaboration à grande échelle nécessite des stratégies de branchement efficaces.

## Développement basé sur le tronc vs GitFlow
- **Basé sur le tronc :** Intégration continue directe vers « principal ». Nécessite des *Feature Flags* et un TDD strict. Réduit les conflits.
- **GitFlow :** Idéal pour les versions versionnées strictes (`develop`, `release`, `main`).

## Git Hooks et Husky
Husky vous permet d'exécuter des scripts avant de valider du code (par exemple Linting, Prettier, Unit Testing).

```sirène
gitGraph
  commettre
  fonction de branchement/A
  fonction de paiement/A
  commettre
  caisse principale
  fonction de fusion/A
  identifiant de validation : "v1.0" balise : "version"
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

