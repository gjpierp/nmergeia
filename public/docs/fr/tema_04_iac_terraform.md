# Infrastructure comme code et immuabilité

L'infrastructure en tant que code (IaC) garantit que les environnements sont reproductibles.

## Terraform et État décentralisé
Terraform utilise le fichier « terraform.tfstate » pour cartographier les ressources cloud. Il doit être stocké à distance (ex. S3 + DynamoDB pour les verrous).

## Déploiements Blue-Green et Canary
- **Bleu-Vert :** Deux environnements identiques. Zéro temps d'arrêt.
- **Canary :** Déploiement progressif jusqu'à 5 % des utilisateurs, mise à l'échelle progressive s'il n'y a pas d'erreurs.

```sirène
graphique LR
  A[Code Terraform] --> B[Plan]
  B --> C[Appliquer]
  C --> D[AWS/GCP/Azure]
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

