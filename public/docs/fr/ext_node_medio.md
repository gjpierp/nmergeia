# Middlewares, Contrôleurs et Architecture en Couches

Placer toute votre logique métier (requêtes SQL, validations, envoi d'e-mails) directement à l'intérieur de `app.get()` est le pire anti-pattern dans Express. Le code devient impossible à tester et chaotique.

## 1. Le modèle MVC / Architecture en couches

Vous devez séparer les responsabilités. La couche de routes ne fait que du routage, le contrôleur extrait les données de la requête HTTP, et le service exécute les calculs ou les requêtes vers la base de données.

```mermaid
graph LR
    Cliente[Client / React] -->|Requête HTTP| Routes[Routes (Router)]
    Routes -->|Délègue| Controller[Contrôleur]
    Controller -->|Extrait req.body| Service[Couche de service]
    Service -->|Requête| DB[(Base de données)]
    
    DB --> Service
    Service -->|Résultat pur| Controller
    Controller -->|"res.status(200)"| Cliente
```

## 2. Le cœur d'Express : Les Middlewares

Un Middleware est simplement une fonction qui s'exécute **au milieu**, c'est-à-dire après l'arrivée de la requête mais avant qu'elle n'atteigne votre contrôleur.

C'est le mécanisme parfait pour les validations, la sécurité, les logs et l'authentification. Ils ont accès à `req`, `res` et à la fonction magique `next()`.

```javascript
// Middleware d'authentification
const verifierToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: "Non autorisé, jeton manquant" });
  }

  // Si le jeton est valide, on passe le relais au maillon suivant
  if (token === "TOKEN_SECRETO") {
    next(); 
  } else {
    return res.status(403).json({ error: "Jeton invalide" });
  }
};

// Injection du middleware dans la route protégée
app.get('/api/datos-privados', verifierToken, (req, res) => {
  res.json({ secreto: "La formule de Coca-Cola" });
});
```

## 3. Gestion globale des erreurs (Le filet de sécurité)

Au lieu de placer un `try/catch` et de renvoyer une erreur 500 dans CHAQUE contrôleur, les experts utilisent un **Middleware de gestion des erreurs**. 
Dans Express, si vous déclarez un middleware avec 4 paramètres `(err, req, res, next)`, Express sait qu'il s'agit d'un intercepteur global d'erreurs.

```javascript
// Contrôleur (Simulation d'une défaillance asynchrone)
app.get('/api/fallo', async (req, res, next) => {
  try {
    throw new Error("Base de données effondrée");
  } catch (error) {
    next(error); // On envoie l'erreur au gestionnaire global
  }
});

// Middleware global d'erreurs (Toujours à la fin de votre fichier index.js)
app.use((err, req, res, next) => {
  console.error(err.stack); // On enregistre le log sur le serveur
  res.status(500).json({ 
    message: "Erreur interne du serveur", 
    details: err.message 
  });
});
```

Cette architecture vous mènera loin, mais aujourd'hui, utiliser Express sans typage strict est un risque pour les entreprises. Au **Niveau Avancé**, nous ferons le saut vers NestJS ou nous migrerons Express vers TypeScript (POO) avec injection de dépendances.
