# Express.js und REST-Architektur

Obwohl Node.js das native `http`-Modul zum Erstellen von Servern mitbringt, ist es auf niedriger Ebene zu wortreich. Deshalb hat das Ökosystem **Express.js** als De-facto-Standard übernommen. Express abstrahiert das Routing und die Anfragen, sodass du RESTful APIs in wenigen Minuten erstellen kannst.

## 1. Hallo Welt in Express

Die Initialisierung eines Servers ist extrem einfach, birgt jedoch ein Pipeline-Design (Tuberías), das wir später sehen werden.

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Integrierte Middleware zum Parsen von JSON
app.use(express.json());

// Grundlegende GET-Route
app.get('/api/usuarios', (req, res) => {
  res.status(200).json({ mensaje: "Benutzerliste", data: [] });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
```

## 2. Die REST-Methoden (CRUD)

Eine professionelle REST-API muss HTTP-Verben Datenbankaktionen zuordnen. Verwende `POST` nicht zum Abrufen von Daten und `GET` nicht zum Löschen.

| HTTP-Verb | CRUD-Operation | Beispielroute |
| :--- | :--- | :--- |
| **GET** | Lesen (Read) | `/api/usuarios` (Alle) |
| **GET** | Lesen (Read) | `/api/usuarios/:id` (Nur einer) |
| **POST** | Erstellen (Create) | `/api/usuarios` |
| **PUT** | Vollständiges Aktualisieren | `/api/usuarios/:id` |
| **PATCH** | Partielles Aktualisieren | `/api/usuarios/:id` |
| **DELETE** | Löschen (Delete) | `/api/usuarios/:id` |

### Praktisches POST-Beispiel

```javascript
app.post('/api/usuarios', (req, res) => {
  // req.body enthält das vom Frontend (React/Angular) gesendete JSON
  const { nombre, email } = req.body;
  
  if (!nombre || !email) {
    // 400 Bad Request
    return res.status(400).json({ error: "Erforderliche Felder fehlen" });
  }

  // Datenbanklogik hier...

  // 201 Created
  res.status(201).json({ mensaje: "Benutzer erfolgreich erstellt" });
});
```

## 3. Routen-Parametrierung (Params vs. Queries)

Es ist wichtig zu verstehen, wie das Frontend Daten über die URL an dich sendet.

* **Req.Params (`/api/usuarios/5`):** Eindeutige Bezeichner.
  ```javascript
  app.get('/api/usuarios/:id', (req, res) => {
    console.log(req.params.id); // "5"
  });
  ```
* **Req.Query (`/api/usuarios?rol=admin&edad=25`):** Filter, Suchen und Paginierung.
  ```javascript
  app.get('/api/usuarios', (req, res) => {
    console.log(req.query.rol); // "admin"
  });
  ```

Jetzt weißt du, wie man Routen erstellt, aber alles in eine einzige `index.js`-Datei zu packen, führt zu Spaghetti-Code. Auf der **mittleren Stufe (Nivel Medio)** lernen wir, die Architektur in Schichten (Routen, Controller, Services) zu strukturieren, und das wichtigste Konzept von Express: Middlewares.
