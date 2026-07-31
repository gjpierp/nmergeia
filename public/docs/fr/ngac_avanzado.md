# niveau avancé

> [!IMPORTANT]
> À un niveau avancé, nous commençons à combiner plusieurs graphiques, appelés « Politiques » ou classes de politiques, et ajoutons des attributs dynamiques tels que l'heure ou le lieu (ABAC au sein de NGAC).

## Évaluations conditionnelles

En NGAC avancé, un seul chemin dans le graphique ne suffit pas. Nous pouvons lier les « Conditions » à des associations.

### Restrictions de temps et de statut

```sirène
graphique TD
    U[Utilisateur : Caissier] -->|UA| Caissiers (caissiers caissiers)
    
    Caissiers -- Peut traiter --> OA1 (Caisses enregistreuses)
    
    Caissiers -. Condition : Uniquement les heures de travail .-> OA1
    
    O[Boîte 01] --> OA1
    O2[Boîte 02] --> OA1
```

Si l'utilisateur « Caissier » tente d'accéder à « Cash 01 » à 3h00 du matin, le moteur NGAC trouve le chemin, mais la condition de bord échoue. L’accès est donc refusé.

### Séparation des tâches (SoD)

NGAC vous permet d'implémenter facilement SoD en déclarant des **Contraintes d'interdiction**. 
- Si Alice approuve une demande d'achat, le graphique génère dynamiquement un nœud qui **nie** Alice le droit de signer le chèque pour ce même achat.

> [!ASTUCE]
> En tirant parti des attributs d'objet dynamiques, vous pouvez isoler les informations de manière granulaire sans avoir à créer des millions de rôles (Role Explosion).

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

