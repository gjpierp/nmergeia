# Worker Threads, Cluster und PM2

Wir haben den Gipfel erreicht. Dein Node.js-Server funktioniert perfekt, aber du stellst fest, dass du deine API auf einem Server mit 16 Kernen (Cores) bereitstellst und Node.js nur 1 nutzt. 93% deines Servers sind im Leerlauf, während deine Benutzer unter Langsamkeit leiden.

Warum? Weil Node in einem einzigen Main Thread läuft.

## 1. Das Cluster-Modul (Lokale horizontale Skalierung)

Um Multi-Core-Server auszunutzen, müssen wir unsere Anwendung klonen. Das native `cluster`-Modul ermöglicht es uns, für jeden physischen Kern der CPU einen Node-Prozess zu erstellen.

Ein Master-Prozess fungiert als interner Load Balancer, der HTTP-Verbindungen aus dem Internet empfängt und im *Round-Robin*-Verfahren auf seine Klone (Workers) verteilt.

```javascript
const cluster = require('cluster');
const os = require('os');
const express = require('express');

if (cluster.isPrimary) {
  // Master-Code
  const numeroCores = os.cpus().length;
  console.log(`Master PID ${process.pid} läuft`);

  // Wir klonen den Prozess entsprechend der Anzahl der Kerne
  for (let i = 0; i < numeroCores; i++) {
    cluster.fork();
  }

  // Selbstheilung: Wenn ein Worker abstürzt (OOM), starten wir einen neuen
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} ist gestorben. Ersatz wird erstellt...`);
    cluster.fork();
  });
} else {
  // Worker-Code
  const app = express();
  app.get('/', (req, res) => res.send(`Bedient von Worker ${process.pid}`));
  
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} gestartet`);
  });
}
```

## 2. PM2: Der Produktionsstandard

Heutzutage schreibt niemand mehr den obigen Cluster-Code von Hand. Wir verwenden den Prozessmanager **PM2**. Er ermöglicht es, deine normale Express-Anwendung im Cluster-Modus auszuführen, ohne eine einzige Codezeile zu ändern, und hält den Server nach Abstürzen und Neustarts des Betriebssystems am Leben.

```bash
# Die App mit den maximal möglichen CPUs starten
pm2 start index.js -i max --name mi-api-node

# Echtzeitüberwachung von RAM/CPU-Verbrauch (Terminal-Schnittstelle)
pm2 monit
```

## 3. Worker Threads (Vertikale Skalierung für CPU-Intensive)

Was passiert, wenn du eine schwere mathematische Aufgabe (wie Bildkomprimierung oder Krypto-Mining) in Node.js ausführen MUSST, ohne die Event-Schleife für andere Benutzer zu blockieren?

Wir verwenden `worker_threads`. Im Gegensatz zu Cluster-Subprozessen (die ihren eigenen, von der V8 unabhängigen Speicher haben) nutzen Worker Threads den Speicher über `SharedArrayBuffer` gemeinsam, was echte Multi-Thread-Parallelität innerhalb desselben Node.js-Prozesses ermöglicht.

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // Der Haupt-Thread delegiert die schwere Berechnung
  const worker = new Worker(__filename);
  worker.on('message', msg => console.log('Ergebnis des Threads:', msg));
  worker.postMessage('Starte Berechnung');
} else {
  // Worker-Thread (Blockiert die API nicht)
  parentPort.on('message', (msg) => {
    let result = 0;
    // Schwere Schleife mit Milliarden von Iterationen
    for(let i=0; i<1000000000; i++) result += i; 
    
    parentPort.postMessage(result);
  });
}
```

Wenn du Cluster (zur Skalierung von I/O-Anfragen), Worker Threads (für schwere CPU-Verarbeitung) und PM2 (Daemon-Management) beherrschst, hast du die volle Kontrolle über das zugrunde liegende Bare-Metal. Du bist ein Senior Backend Architekt.
