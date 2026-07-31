# Node.js 优化：工作线程 (Worker Threads)、集群 (Clusters) 与 PM2

我们已经到达了顶峰。你的 Node.js 服务器运行得非常完美，但是你发现你将 API 部署在一台 16 核的服务器上，而 Node.js 仅仅使用了 1 个核。服务器 93% 的性能处于闲置状态，而你的用户却在忍受缓慢的响应。

为什么？因为 Node 运行在单个主线程 (Main Thread) 上。

## 1. Cluster 模块 (本地水平扩展)

为了利用多核服务器，我们必须克隆我们的应用程序。原生的 `cluster` 模块允许我们为 CPU 的每个物理核心创建一个 Node 进程。

一个主进程 (Master) 将充当内部负载均衡器 (Load Balancer)，接收来自互联网的 HTTP 连接，并以*轮询 (Round-Robin)* 模式将它们分发给其克隆体 (Workers)。

```javascript
const cluster = require('cluster');
const os = require('os');
const express = require('express');

if (cluster.isPrimary) {
  // Master 代码
  const numeroCores = os.cpus().length;
  console.log(`Master PID ${process.pid} is running`);

  // 根据核心数量克隆进程
  for (let i = 0; i < numeroCores; i++) {
    cluster.fork();
  }

  // 自我修复：如果一个 worker 挂掉 (OOM)，我们就启动一个新的
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} 死亡。正在创建替换...`);
    cluster.fork();
  });
} else {
  // 线程工作者 (Workers) 代码
  const app = express();
  app.get('/', (req, res) => res.send(`由 Worker ${process.pid} 处理`));
  
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} 已启动`);
  });
}
```

## 2. PM2：生产环境标准

如今没有人会手动编写上面的 Cluster 代码。我们使用进程管理器 **PM2**。它允许在 Cluster 模式下运行你普通的 Express 应用而无需更改任何代码，此外还能在操作系统崩溃和重启后保持服务器处于活跃状态。

```bash
# 使用尽可能多的 CPU 启动应用程序
pm2 start index.js -i max --name mi-api-node

# 实时监控 RAM/CPU 消耗 (终端界面)
pm2 monit
```

## 3. Worker Threads (垂直 CPU 密集型扩展)

如果必须在 Node.js 中执行繁重的数学任务（例如图像压缩或加密货币挖矿），而又不想阻塞其他用户的事件循环，该怎么办？

我们使用 `worker_threads`。与 Cluster 的子进程（它们拥有独立于 V8 的自身内存）不同，Worker Threads 通过 `SharedArrayBuffer` 共享内存，从而在同一个 Node.js 进程中实现真正的多线程并行性。

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // 主线程委托繁重的计算
  const worker = new Worker(__filename);
  worker.on('message', msg => console.log('线程结果:', msg));
  worker.postMessage('开始计算');
} else {
  // 线程工作者 (不阻塞 API)
  parentPort.on('message', (msg) => {
    let result = 0;
    // 数十亿次迭代的繁重循环
    for(let i=0; i<1000000000; i++) result += i; 
    
    parentPort.postMessage(result);
  });
}
```

通过掌握集群 (Clusters，用于扩展 I/O 请求)、工作线程 (Worker Threads，用于繁重的 CPU 处理) 和 PM2 (守护进程管理 Daemon Management)，你完全控制了底层的裸机系统。你是一名高级 (Senior) 后端架构师了。
