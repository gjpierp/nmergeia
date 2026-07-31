# Niveau initial

> [!NOTE]
> NGAC (Next Generation Access Control) est un modèle de contrôle d'accès standardisé par le NIST conçu pour surmonter les limites du RBAC (Role-Based Access Control) et de l'ABAC (Attribute-Based Access Control).

## Qu'est-ce que le NGAC ?

Contrairement aux modèles traditionnels, NGAC centralise la gestion des politiques en les exprimant via des graphiques orientés. Dans NGAC, tout (utilisateurs, objets, opérations) est un nœud dans un graphique et l'accès est déterminé en trouvant un chemin valide de l'utilisateur à l'objet.

### NGAC vs modèles traditionnels

```sirène
graphique TD
    A[Modèles traditionnels] --> B(RBAC : Rôle -> Autorisation)
    A --> C(ABAC : Règles complexes et lentes)
    
    D[NGAC] --> E(Graphiques de relations)
    D -> F (évaluation linéaire et rapide)
    
    B -> G[Difficile à mettre à l'échelle et à auditer]
    C ->.->G
    
    E ->.-> H[Evolutivité et Audit Naturel]
    F ->.-> H
```

> [!ASTUCE]
> Si votre système nécessite des politiques qui évoluent rapidement (par exemple, donner accès à un entrepreneur uniquement pendant son quart de travail), NGAC gère cela naturellement en ajoutant ou en supprimant simplement des bords dans le graphique.

## Principaux avantages
1. **Flexibilité :** Vous permet d'émuler RBAC, ABAC, MAC et DAC dans un seul modèle.
2. **Audit :** Répondez à la question « Qui peut accéder à ce fichier ? » est une simple requête de parcours graphique.
3. **Performances :** Les bases de données graphiques modernes résolvent les autorisations en millisecondes.

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

