# Prise d'exigences avancées et DDD

La capture efficace des exigences est la pierre angulaire d’un produit réussi, passant des documents statiques à la découverte collaborative.

## Conception basée sur le domaine (DDD)
Approche qui unifie le modèle mental de l'entreprise avec le code à travers le *Ubiquitous Language* (Ubiquitous Language).
- **Contextes délimités :** Limites explicites où les termes ont une seule signification.

## Prise d'assaut d'événements
Technique d'atelier visuel (à l'aide de post-its) pour modéliser des flux métiers complexes en identifiant les *Événements de domaine*, les *Commandes* et les *Agrégations*.

```sirène
graphique LR
  A[Commande : Créer une commande] --> B[Ajouter : Commande]
  B --> C[Événement : Commande créée]
  C --> D[Politique : Notifier l'envoi]
  D --> E[Commande : Envoyer un courrier]
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

