# NGAC appliqué aux menus et aux vues dynamiques

L'intégration de Sentinel-NGAC dans une interface implique la résolution du graphique des autorisations au moment de l'exécution.

## Résolution du graphique
Lorsqu'un utilisateur se connecte, le backend NGAC calcule toutes les routes valides depuis son nœud (Utilisateur) vers les objets de menu (Objet).

## Success Story : safi-core
Dans les systèmes ERP massifs comme « safi-core », la réponse du menu est mise en cache dans Redis. S'il y a des modifications d'autorisation, le cache est invalidé.

```sirène
diagramme de séquence
  Frontend->>+Backend : Requête /menu (JWT)
  Backend->>+Sentinel-NGAC : vérifier les chemins
  Sentinel-NGAC-->>-Backend : objets autorisés
  Backend-->>-Frontend : Arborescence des menus
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

