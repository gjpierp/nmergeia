# Gestion sécurisée des secrets et DevSecOps

Les secrets codés en dur constituent une vulnérabilité critique. Swarm AI interdit d’exposer les informations d’identification.

## Coffre HashiCorp
Stockage dynamique. Vault peut générer des informations d'identification éphémères (par exemple, un utilisateur de base de données qui expire dans 1 heure).

## Intégration SAST/DAST
- **SAST :** Analyse statique dans le pipeline CI.
- **DAST :** Tests dynamiques attaquant le conteneur en Staging.

```sirène
graphique LR
  A[Commit] --> B[SonarQube/SAST]
  B --> C{Est-ce que ça arrive ?}
  C -->|Non| D[Rejet CI]
  C -->|Oui| E[Déploiement vers le staging]
  E --> F[DAST Owasp ZAP]
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

