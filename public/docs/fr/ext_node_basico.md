# Express.js et Architecture REST

Bien que Node.js intègre le module natif `http` pour créer des serveurs, celui-ci est trop verbeux et bas niveau. C'est pourquoi l'écosystème a adopté **Express.js** comme standard de fait. Express abstrait le routage et les requêtes, vous permettant de construire des API RESTful en quelques minutes.

## 1. Hello World avec Express

L'initialisation d'un serveur est extrêmement simple, mais elle masque une architecture en pipeline que nous verrons plus tard.

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware intégré pour parser le JSON
app.use(express.json());

// Route GET basique
app.get('/api/usuarios', (req, res) => {
  res.status(200).json({ mensaje: "Liste des utilisateurs", data: [] });
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
```

## 2. Les méthodes REST (CRUD)

Une API REST professionnelle doit associer les verbes HTTP aux actions de la base de données. N'utilisez pas `POST` pour récupérer des données, ni `GET` pour les supprimer.

| Verbe HTTP | Opération CRUD | Exemple de route |
| :--- | :--- | :--- |
| **GET** | Lecture (Read) | `/api/usuarios` (Tous) |
| **GET** | Lecture (Read) | `/api/usuarios/:id` (Un seul) |
| **POST** | Création (Create) | `/api/usuarios` |
| **PUT** | Mise à jour totale | `/api/usuarios/:id` |
| **PATCH** | Mise à jour partielle | `/api/usuarios/:id` |
| **DELETE** | Suppression (Delete) | `/api/usuarios/:id` |

### Exemple pratique de POST

```javascript
app.post('/api/usuarios', (req, res) => {
  // req.body contient le JSON envoyé depuis le Frontend (React/Angular)
  const { nombre, email } = req.body;
  
  if (!nombre || !email) {
    // 400 Bad Request
    return res.status(400).json({ error: "Champs requis manquants" });
  }

  // Logique de base de données ici...

  // 201 Created
  res.status(201).json({ mensaje: "Utilisateur créé avec succès" });
});
```

## 3. Paramétrage des routes (Params vs Queries)

Il est crucial de comprendre comment le frontend vous envoie des données via l'URL.

* **Req.Params (`/api/usuarios/5`) :** Identifiants uniques.
  ```javascript
  app.get('/api/usuarios/:id', (req, res) => {
    console.log(req.params.id); // "5"
  });
  ```
* **Req.Query (`/api/usuarios?rol=admin&edad=25`) :** Filtres, recherches et pagination.
  ```javascript
  app.get('/api/usuarios', (req, res) => {
    console.log(req.query.rol); // "admin"
  });
  ```

Vous savez maintenant créer des routes, mais tout mettre dans un seul fichier `index.js` produit du code spaghetti. Dans le **Niveau Intermédiaire**, nous apprendrons à structurer l'architecture par couches (Routes, Controllers, Services) et le concept le plus essentiel d'Express : les Middlewares.
