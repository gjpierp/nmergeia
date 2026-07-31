# Worker Threads, Clusters, and PM2

We have reached the pinnacle. Your Node.js server works perfectly, but you discover that you are deploying your API on a 16 Core server and Node.js is only using 1. 93% of your server is idle while your users suffer from slowness.

Why? Because Node runs in a single Main Thread.

## 1. The Cluster Module (Local Horizontal Scaling)

To take advantage of Multi-Core servers, we must clone our application. The native `cluster` module allows us to create one Node process for every physical CPU core.

A Master process will act as an internal Load Balancer, receiving HTTP connections from the internet and distributing them in a *Round-Robin* fashion to its clones (Workers).

```javascript
const cluster = require('cluster');
const os = require('os');
const express = require('express');

if (cluster.isPrimary) {
  // Master's Code
  const numCores = os.cpus().length;
  console.log(`Master PID ${process.pid} is running`);

  // We clone the process according to the number of cores
  for (let i = 0; i < numCores; i++) {
    cluster.fork();
  }

  // Auto-Healing: If a worker crashes (OOM), we launch a new one
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Creating replacement...`);
    cluster.fork();
  });
} else {
  // Workers' Code
  const app = express();
  app.get('/', (req, res) => res.send(`Handled by Worker ${process.pid}`));
  
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
```

## 2. PM2: The Production Standard

No one writes the Cluster code above by hand nowadays. We use the **PM2** process manager. It allows you to run your normal Express app in Cluster mode without changing a single line of code, besides keeping the server alive after crashes and OS reboots.

```bash
# Launch the app using the maximum CPUs possible
pm2 start index.js -i max --name my-node-api

# Monitor RAM/CPU consumption in real-time (Terminal Interface)
pm2 monit
```

## 3. Worker Threads (CPU-Intensive Vertical Scaling)

What happens if you MUST run a heavy mathematical task (like image compression or crypto mining) in Node.js without blocking the Event Loop for other users?

We use `worker_threads`. Unlike Cluster subprocesses (which have their own independent V8 memory), Worker Threads share memory through `SharedArrayBuffer`, allowing true multi-thread parallelism within the same Node.js process.

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // The main thread delegates the heavy calculation
  const worker = new Worker(__filename);
  worker.on('message', msg => console.log('Thread Result:', msg));
  worker.postMessage('Start calculation');
} else {
  // Worker Thread (Does not block the API)
  parentPort.on('message', (msg) => {
    let result = 0;
    // Heavy loop of a billion iterations
    for(let i=0; i<1000000000; i++) result += i; 
    
    parentPort.postMessage(result);
  });
}
```

By mastering Clusters (to scale I/O requests), Worker Threads (for heavy CPU processing), and PM2 (Daemon Management), you completely control the underlying bare-metal. You are a Senior Backend Architect.
