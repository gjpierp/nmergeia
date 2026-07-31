# Middlewares, Controller und Schichtenarchitektur

Deine gesamte Geschäftslogik (SQL-Abfragen, Validierungen, E-Mail-Versand) direkt in `app.get()` zu stecken, ist das schlimmste Anti-Pattern in Express. Der Code wird untestbar und chaotisch.

## 1. Das MVC-Muster / Schichtenarchitektur

Du musst Zuständigkeiten trennen. Die Routenschicht routet nur, der Controller extrahiert Daten aus der HTTP-Anfrage, und der Service führt die Mathematik oder Datenbankoperationen aus.

```mermaid
graph LR
    Cliente[Client / React] -->|HTTP Anfrage| Routes[Routen (Router)]
    Routes -->|Delegiert| Controller[Controller]
    Controller -->|Extrahiert req.body| Service[Service-Schicht]
    Service -->|Abfrage| DB[(Datenbank)]
    
    DB --> Service
    Service -->|Reines Ergebnis| Controller
    Controller -->|"res.status(200)"| Cliente
```

## 2. Das Herz von Express: Die Middlewares

Eine Middleware ist einfach eine Funktion, die **in der Mitte** ausgeführt wird, d.h. nachdem die Anfrage eingeht, aber bevor sie deinen Controller erreicht.

Sie sind der perfekte Mechanismus für Validierungen, Sicherheit, Logs und Authentifizierung. Sie haben Zugriff auf `req`, `res` und die magische Funktion `next()`.

```javascript
// Authentifizierungs-Middleware
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: "Nicht autorisiert, Token fehlt" });
  }

  // Wenn das Token gültig ist, geben wir den Ball an das nächste Glied weiter
  if (token === "TOKEN_SECRETO") {
    next(); 
  } else {
    return res.status(403).json({ error: "Ungültiges Token" });
  }
};

// Middleware in die geschützte Route injizieren
app.get('/api/datos-privados', verificarToken, (req, res) => {
  res.json({ secreto: "Das Geheimrezept von Coca-Cola" });
});
```

## 3. Globale Fehlerbehandlung (Das Sicherheitsnetz)

Anstatt in JEDEM Controller ein `try/catch` zu setzen und einen 500-Fehler zurückzugeben, verwenden Experten eine **Fehlerbehandlungs-Middleware**. 
Wenn du in Express eine Middleware mit 4 Parametern `(err, req, res, next)` deklarierst, weiß Express, dass es sich um einen globalen Fehler-Interceptor handelt.

```javascript
// Controller (Simuliert einen asynchronen Fehler)
app.get('/api/fallo', async (req, res, next) => {
  try {
    throw new Error("Datenbank zusammengebrochen");
  } catch (error) {
    next(error); // Wir senden den Fehler an den globalen Handler
  }
});

// Globale Fehler-Middleware (Immer am Ende deiner index.js-Datei)
app.use((err, req, res, next) => {
  console.error(err.stack); // Wir speichern das Log auf dem Server
  res.status(500).json({ 
    mensaje: "Interner Serverfehler", 
    detalles: err.message 
  });
});
```

Diese Architektur wird dich weit bringen, aber heutzutage ist die Verwendung von Express ohne strikte Typisierung ein Unternehmensrisiko. Auf der **Fortgeschrittenen Stufe (Nivel Avanzado)** werden wir den Sprung zu NestJS wagen oder Express mit Dependency Injection auf TypeScript (OOP) migrieren.
