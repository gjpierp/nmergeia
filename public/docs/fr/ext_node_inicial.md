# Architecture Event-Driven et moteur V8

Bienvenue côté serveur avec JavaScript. Node.js a révolutionné le développement web non pas en étant un nouveau langage, mais en apportant le moteur V8 de Google Chrome au backend, associé à une boucle d'événements (Event Loop) asynchrone et non bloquante.

## 1. Le mythe du "Single Thread"

On dit couramment que Node.js est "Single Threaded" (monothread). C'est une demi-vérité.

* **Le thread principal (Main Thread) :** Exécute votre code JavaScript.
* **Le pool de threads (libuv) :** Node délègue les tâches lourdes (I/O, compression, cryptographie, réseau) à un pool de threads caché géré par la bibliothèque `libuv` écrite en C++.

```mermaid
graph TD
    Cliente[Client HTTP] -->|Requête| MainThread[Main Thread (V8)]
    MainThread -->|Est-ce du code JS pur | Ejecucion[Sexécute instantanément]
    MainThread -->|"Est-ce une lecture de fichier/BDD "| EventLoop[Event Loop]
    
    EventLoop -->|Délègue| Libuv[libuv Thread Pool (C++)]
    Libuv -->|Thread 1| Disco[(Système de fichiers)]
    Libuv -->|Thread 2| DB[(Base de données)]
    
    Disco -->|Termine| CallbackQueue[File dattente de callbacks]
    DB -->|Termine| CallbackQueue
    
    CallbackQueue -->|Renvoie au thread principal| MainThread
```

## 2. Bloquer l'Event Loop (Le péché capital)

Puisqu'il n'y a qu'un seul Main Thread pour votre code, si vous exécutez une opération mathématique géante ou une boucle `while` infinie, **tout le serveur gèle**. Aucun autre utilisateur ne pourra se connecter ou charger des données.

```javascript
// ❌ DANGER : Code bloquant (synchrone)
app.get('/hash', (req, res) => {
  // Pendant la lecture de ce fichier de 2 Go, Node.js ne peut répondre à personne d'autre.
  const data = fs.readFileSync('/archivo-gigante.mp4'); 
  res.send('Terminé');
});

// ✅ CORRECT : Code non bloquant (asynchrone)
app.get('/hash', async (req, res) => {
  // Node envoie la tâche à libuv et continue de traiter d'autres requêtes HTTP
  const data = await fs.promises.readFile('/archivo-gigante.mp4');
  res.send('Terminé');
});
```

## 3. Node n'est pas fait pour le CPU-Intensive

Si vous devez traiter de la vidéo, entraîner des modèles d'intelligence artificielle ou effectuer du rendu 3D, Node.js n'est pas le bon outil. Pour les tâches intensives en CPU, Python (avec des bibliothèques en C), Rust ou Go sont supérieurs.
Node.js est le ROI absolu pour les applications **I/O Intensive** (Input/Output) : chats en temps réel, API REST, streaming de données et microservices.

## Prochaines étapes
Nous avons compris comment respire Node.js. Dans le **Niveau débutant**, nous laisserons la théorie de côté et créerons notre premier serveur HTTP en utilisant le framework qui règne sur 90 % du marché : Express.js.
