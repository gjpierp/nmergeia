# Worker Threads, Clusters et PM2

Nous arrivons au sommet. Votre serveur Node.js fonctionne parfaitement, mais vous découvrez que vous déployez votre API sur un serveur de 16 cœurs (Cores) et que Node.js n'en utilise qu'un seul. 93 % de votre serveur est inactif pendant que vos utilisateurs subissent des lenteurs.

Pourquoi ? Parce que Node s'exécute sur un seul Main Thread.

## 1. Le module Cluster (Mise à l'échelle horizontale locale)

Pour tirer parti des serveurs multi-cœurs, nous devons cloner notre application. Le module natif `cluster` nous permet de créer un processus Node pour chaque cœur physique du processeur.

Un processus maître (Primary / Master) agira comme un équilibreur de charge (Load Balancer) interne, recevant les connexions HTTP depuis Internet et les distribuant en mode *Round-Robin* à ses clones (Workers).

```javascript
const cluster = require('cluster');
const os = require('os');
const express = require('express');

if (cluster.isPrimary) {
  // Code du Maître
  const numeroCores = os.cpus().length;
  console.log(`Master PID ${process.pid} is running`);

  // Nous clonons le processus en fonction du nombre de cœurs
  for (let i = 0; i < numeroCores; i++) {
    cluster.fork();
  }

  // Auto-guérison : Si un worker plante (OOM), nous en lançons un nouveau
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} est mort. Création d'un remplacement...`);
    cluster.fork();
  });
} else {
  // Code des travailleurs (Workers)
  const app = express();
  app.get('/', (req, res) => res.send(`Traité par le Worker ${process.pid}`));
  
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} démarré`);
  });
}
```

## 2. PM2 : Le standard de production

Personne n'écrit le code Cluster ci-dessus à la main aujourd'hui. Nous utilisons le gestionnaire de processus **PM2**. Il permet d'exécuter votre application Express habituelle en mode Cluster sans modifier une seule ligne de code, tout en maintenant le serveur en vie après des plantages et des redémarrages du système d'exploitation.

```bash
# Lancer l'application en utilisant le maximum de processeurs possible
pm2 start index.js -i max --name mi-api-node

# Surveiller la consommation de RAM/CPU en temps réel (interface terminal)
pm2 monit
```

## 3. Worker Threads (Mise à l'échelle verticale CPU-Intensive)

Que se passe-t-il si vous DEVEZ exécuter une tâche mathématique lourde (comme la compression d'images ou le minage de crypto) dans Node.js sans bloquer l'Event Loop pour les autres utilisateurs ?

Nous utilisons `worker_threads`. Contrairement aux sous-processus de Cluster (qui possèdent leur propre mémoire indépendante de V8), les Worker Threads partagent de la mémoire via `SharedArrayBuffer`, permettant un véritable parallélisme multi-thread au sein du même processus Node.js.

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // Le thread principal délègue le calcul lourd
  const worker = new Worker(__filename);
  worker.on('message', msg => console.log('Résultat du Thread :', msg));
  worker.postMessage('Démarrer le calcul');
} else {
  // Thread travailleur (ne bloque pas l'API)
  parentPort.on('message', (msg) => {
    let result = 0;
    // Boucle lourde de milliards d'itérations
    for(let i=0; i<1000000000; i++) result += i; 
    
    parentPort.postMessage(result);
  });
}
```

En maîtrisant les Clusters (pour faire évoluer les requêtes d'E/S), les Worker Threads (pour le traitement lourd sur processeur) et PM2 (gestionnaire de démons), vous contrôlez totalement le bare-metal sous-jacent. Vous êtes un Architecte Backend Senior.
