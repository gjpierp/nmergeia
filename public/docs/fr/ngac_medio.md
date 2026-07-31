# Niveau moyen

> [!ASTUCE]
> À ce niveau, les politiques statiques (qui est qui) sont mélangées aux politiques dynamiques, vous donnant un contrôle en temps réel.

## Politiques et autorisations dynamiques

Contrairement à RBAC, dans NGAC, les modifications prennent effet immédiatement sans nécessiter de rechargement de sessions ni de redistribution de jetons JWT. La validation est effectuée par rapport au graphique d'autorisation centralisé dans chaque demande critique.

### Évaluation des autorisations (évaluation des politiques)

Pour évaluer si une demande est approuvée, le moteur NGAC intercepte la demande.

```sirène
diagramme de séquence
    Utilisateur participant en tant que client Web
    API des participants en tant que passerelle API/proxy
    participant NGAC en tant que Motor Sentinel-NGAC
    Base de données des participants comme base de données
    
    Utilisateur->>API : GET /resources/protected/1
    API->>NGAC : l'utilisateur peut-il lire l'objet 1 ?
    
    rect RVB (20, 50, 40)
        Remarque sur NGAC : le graphique (PDP) est évalué
        NGAC-->>NGAC : Chemin de recherche : U -> UA -> OA <- O
    fin
    
    Chemin alternatif trouvé
        NGAC-->>API : 200 OK (autorisé)
        API->>DB : récupérer des données
        BD ->>API : Données
        API-->>Utilisateur : 200 OK + Données
    sinon chemin inexistant
        NGAC-->>API : 403 interdit
        API -->>Utilisateur : 403 Interdit
    fin
```

## Point de décision politique (PDP) et point d'application de la politique (PEP)
Le **PEP** (dans notre cas, l'intercepteur de requêtes) est chargé d'arrêter l'action et de demander l'autorisation. Le **PDP** (Sentinel-NGAC) est le cerveau qui navigue dans le graphique.

> [!ATTENTION]
>

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

 No hardcodees los chequeos de seguridad en la lógica de negocio. Toda autorización debe manejarse limpiamente en el nivel PEP, dejando a los controladores (controllers) libres de lógica de seguridad.
