# Event-Driven-Architektur und die V8 Engine

Willkommen auf der Serverseite mit JavaScript. Node.js hat die Webentwicklung nicht revolutioniert, weil es eine neue Sprache ist, sondern weil es die V8-Engine von Google Chrome ins Backend brachte, gekoppelt mit einem asynchronen, nicht blockierenden Ereignisschleifen-System (Event Loop).

## 1. Der Mythos des "Single Thread"

Es wird oft behauptet, dass Node.js "Single Threaded" (einsträngig) ist. Das ist nur die halbe Wahrheit.

* **Der Haupt-Thread (Main Thread):** Führt deinen JavaScript-Code aus.
* **Der Thread Pool (libuv):** Node delegiert schwere Aufgaben (I/O, Komprimierung, Kryptografie, Netzwerk) an einen versteckten Thread-Pool, der von der in C++ geschriebenen `libuv`-Bibliothek verwaltet wird.

```mermaid
graph TD
    Cliente[HTTP Client] -->|Anfrage| MainThread[Main Thread (V8)]
    MainThread -->|Ist es reiner JS-Code| Ejecucion[Wird sofort ausgeführt]
    MainThread -->|"Ist es ein Datei-/DB-Lesevorgang"| EventLoop[Event Loop]
    
    EventLoop -->|Delegiert| Libuv[libuv Thread Pool (C++)]
    Libuv -->|Thread 1| Disco[(Dateisystem)]
    Libuv -->|Thread 2| DB[(Datenbank)]
    
    Disco -->|Beendet| CallbackQueue[Callback-Warteschlange]
    DB -->|Beendet| CallbackQueue
    
    CallbackQueue -->|Gibt an den Haupt-Thread zurück| MainThread
```

## 2. Blockieren des Event Loops (Die Todsünde)

Da es nur einen Haupt-Thread für deinen Code gibt, wird **der gesamte Server eingefroren**, wenn du eine gigantische mathematische Operation oder eine Endlosschleife (`while`) ausführst. Kein anderer Benutzer kann sich anmelden oder Daten laden.

```javascript
// ❌ GEFAHR: Blockierender Code (Synchron)
app.get('/hash', (req, res) => {
  // Während diese 2GB-Datei gelesen wird, kann Node.js niemandem sonst antworten.
  const data = fs.readFileSync('/riesige-datei.mp4'); 
  res.send('Abgeschlossen');
});

// ✅ RICHTIG: Nicht blockierender Code (Asynchron)
app.get('/hash', async (req, res) => {
  // Node sendet die Aufgabe an libuv und bedient weiterhin andere HTTP-Anfragen
  const data = await fs.promises.readFile('/riesige-datei.mp4');
  res.send('Abgeschlossen');
});
```

## 3. Node ist nicht für rechenintensive Aufgaben (CPU-Intensive)

Wenn du Videos verarbeiten, KI-Modelle trainieren oder 3D rendern musst, ist Node.js das falsche Werkzeug. Für rechenintensive Aufgaben sind Python (mit C-Bibliotheken), Rust oder Go überlegen.
Node.js ist der absolute KÖNIG für **I/O-intensive** (Input/Output) Anwendungen: Echtzeit-Chats, REST-APIs, Daten-Streaming und Microservices.

## Nächste Schritte
Wir haben verstanden, wie Node.js atmet. Auf der **Basisstufe (Nivel Básico)** werden wir die Theorie verlassen und unseren ersten HTTP-Server mit dem Framework erstellen, das 90% des Marktes dominiert: Express.js.
