# Worker Threads, Clusters y PM2

Llegamos a la cúspide. Tu servidor en Node.js funciona perfecto, pero descubres que estás desplegando tu API en un servidor de 16 Núcleos (Cores) y Node.js solo está utilizando 1. El 93% de tu servidor está ocioso mientras tus usuarios sufren lentitud.

¿Por qué? Porque Node corre en un solo Main Thread.

## 1. El Módulo Cluster (Escalado Horizontal Local)

Para aprovechar los servidores Multi-Core, debemos clonar nuestra aplicación. El módulo nativo `cluster` nos permite crear un proceso de Node por cada núcleo físico de la CPU.

Un proceso Maestro (Master) actuará como un Load Balancer interno, recibiendo las conexiones HTTP de internet y distribuyéndolas en modo *Round-Robin* a sus clones (Workers).

```javascript
const cluster = require('cluster');
const os = require('os');
const express = require('express');

if (cluster.isPrimary) {
  // Código del Maestro
  const numeroCores = os.cpus().length;
  console.log(`Master PID ${process.pid} is running`);

  // Clonamos el proceso según la cantidad de núcleos
  for (let i = 0; i < numeroCores; i++) {
    cluster.fork();
  }

  // Auto-Sanación: Si un worker se cuelga (OOM), lanzamos uno nuevo
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} murió. Creando reemplazo...`);
    cluster.fork();
  });
} else {
  // Código de los Trabajadores (Workers)
  const app = express();
  app.get('/', (req, res) => res.send(`Atendido por Worker ${process.pid}`));
  
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} iniciado`);
  });
}
```

## 2. PM2: El Estándar de Producción

Nadie escribe el código Cluster de arriba a mano hoy en día. Usamos el gestor de procesos **PM2**. Permite ejecutar tu aplicación normal de Express en modo Cluster sin cambiar una sola línea de código, además de mantener el servidor vivo tras crasheos y reinicios del sistema operativo.

```bash
# Lanzar la app usando el máximo de CPUs posibles
pm2 start index.js -i max --name mi-api-node

# Monitorear consumo de RAM/CPU en tiempo real (Interfaz Terminal)
pm2 monit
```

## 3. Worker Threads (Escalado Vertical CPU-Intensive)

¿Qué pasa si DEBES ejecutar una tarea matemática pesada (como compresión de imágenes o minería de cripto) en Node.js sin bloquear el Event Loop a los demás usuarios?

Usamos `worker_threads`. A diferencia de los subprocesos de Cluster (que tienen su propia memoria independiente de V8), los Worker Threads comparten memoria a través de `SharedArrayBuffer`, permitiendo un verdadero paralelismo multi-hilo dentro del mismo proceso de Node.js.

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // El hilo principal delega el cálculo pesado
  const worker = new Worker(__filename);
  worker.on('message', msg => console.log('Resultado del Hilo:', msg));
  worker.postMessage('Inicia el cálculo');
} else {
  // Hilo Trabajador (No bloquea la API)
  parentPort.on('message', (msg) => {
    let result = 0;
    // Bucle pesado de miles de millones de iteraciones
    for(let i=0; i<1000000000; i++) result += i; 
    
    parentPort.postMessage(result);
  });
}
```

Al dominar Clusters (para escalar peticiones I/O), Worker Threads (para procesamiento pesado de CPU), y PM2 (Daemon Management), controlas por completo el bare-metal subyacente. Eres un Arquitecto Backend Senior.
