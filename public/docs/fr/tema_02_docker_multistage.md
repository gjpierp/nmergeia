# Stratégies de Docker et de conteneurs à plusieurs étapes

Réduire la surface d'attaque et le poids des images Docker (à <50 Mo) est un objectif clé de DevSecOps.

## Constructions en plusieurs étapes
Il vous permet de compiler le code dans une image lourde (par exemple `node:18-alpine`) et de déplacer uniquement les binaires ou les statistiques résultants vers une image sans distribution ou ultralégère (par exemple `nginx:alpine`).

## Docker Compose pour l'orchestration locale
Le fichier `docker-compose.yml` facilite la configuration de réseaux virtuels isolés.

```sirène
graphique TD
  A[Étape 1 : Construire] -->|Copier les binaires| B[Étape 2 : Sans distribution]
  B --> C[Image < 50 Mo]
  C --> D[Déploiement sécurisé]
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

