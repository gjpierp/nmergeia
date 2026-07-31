# Worker Threads, Clusters e PM2

Chegamos ao ápice. Seu servidor Node.js funciona perfeitamente, mas você descobre que está implantando sua API em um servidor de 16 Núcleos (Cores) e o Node.js está usando apenas 1. 93% do seu servidor está ocioso enquanto seus usuários sofrem lentidão.

Por quê? Porque o Node é executado em uma única Main Thread.

## 1. O Módulo Cluster (Escalonamento Horizontal Local)

Para tirar proveito de servidores Multi-Core, devemos clonar nosso aplicativo. O módulo nativo `cluster` nos permite criar um processo Node para cada núcleo físico da CPU.

Um processo Mestre (Master) atuará como um Load Balancer interno, recebendo as conexões HTTP da internet e distribuindo-as no modo *Round-Robin* para seus clones (Workers).

```javascript
const cluster = require('cluster');
const os = require('os');
const express = require('express');

if (cluster.isPrimary) {
  // Código do Mestre
  const numeroCores = os.cpus().length;
  console.log(`Master PID ${process.pid} is running`);

  // Clonamos o processo de acordo com a quantidade de núcleos
  for (let i = 0; i < numeroCores; i++) {
    cluster.fork();
  }

  // Auto-Cura: Se um worker travar (OOM), lançamos um novo
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} morreu. Criando substituto...`);
    cluster.fork();
  });
} else {
  // Código dos Trabalhadores (Workers)
  const app = express();
  app.get('/', (req, res) => res.send(`Atendido pelo Worker ${process.pid}`));
  
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} iniciado`);
  });
}
```

## 2. PM2: O Padrão de Produção

Ninguém escreve o código Cluster acima à mão hoje em dia. Usamos o gerenciador de processos **PM2**. Ele permite executar seu aplicativo Express normal no modo Cluster sem alterar uma única linha de código, além de manter o servidor ativo após falhas e reinicializações do sistema operacional.

```bash
# Iniciar o aplicativo usando o máximo de CPUs possíveis
pm2 start index.js -i max --name minha-api-node

# Monitorar o consumo de RAM/CPU em tempo real (Interface do Terminal)
pm2 monit
```

## 3. Worker Threads (Escalonamento Vertical CPU-Intensive)

O que acontece se você DEVE executar uma tarefa matemática pesada (como compactação de imagem ou mineração de criptografia) no Node.js sem bloquear o Event Loop para outros usuários?

Usamos `worker_threads`. Ao contrário dos subprocessos do Cluster (que têm sua própria memória V8 independente), as Worker Threads compartilham a memória através do `SharedArrayBuffer`, permitindo o verdadeiro paralelismo multi-thread no mesmo processo do Node.js.

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // A thread principal delega o cálculo pesado
  const worker = new Worker(__filename);
  worker.on('message', msg => console.log('Resultado da Thread:', msg));
  worker.postMessage('Inicia o cálculo');
} else {
  // Thread Trabalhadora (Não bloqueia a API)
  parentPort.on('message', (msg) => {
    let result = 0;
    // Loop pesado de bilhões de iterações
    for(let i=0; i<1000000000; i++) result += i; 
    
    parentPort.postMessage(result);
  });
}
```

Ao dominar Clusters (para escalonar requisições I/O), Worker Threads (para processamento pesado de CPU) e PM2 (Daemon Management), você controla totalmente o bare-metal subjacente. Você é um Arquiteto Backend Sênior.
