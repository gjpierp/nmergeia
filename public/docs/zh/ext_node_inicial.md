# Node.js：事件驱动架构与 V8 引擎

欢迎来到使用 JavaScript 的服务端。Node.js 彻底改变了 Web 开发，并不是因为它是一种新语言，而是因为它将 Google Chrome 的 V8 引擎引入了后端，并结合了异步和非阻塞的事件循环 (Event Loop)。

## 1. “单线程” (Single Thread) 的神话

人们通常说 Node.js 是“单线程的” (Single Threaded)。这只是部分正确。

* **主线程 (Main Thread)：** 执行你的 JavaScript 代码。
* **线程池 (Thread Pool - libuv)：** Node 将繁重的任务（I/O、压缩、加密、网络）委托给由 C++ 编写的 `libuv` 库管理的隐藏线程池。

```mermaid
graph TD
    Cliente[HTTP 客户端] -->|请求| MainThread[主线程 (V8)]
    MainThread -->|是纯 JS 代码吗| Ejecucion[立即执行]
    MainThread -->|"是文件/DB 读取吗"| EventLoop[事件循环 (Event Loop)]
    
    EventLoop -->|委托| Libuv[libuv 线程池 (C++)]
    Libuv -->|线程 1| Disco[(文件系统)]
    Libuv -->|线程 2| DB[(数据库)]
    
    Disco -->|完成| CallbackQueue[回调队列 (Callback Queue)]
    DB -->|完成| CallbackQueue
    
    CallbackQueue -->|返回给主线程| MainThread
```

## 2. 阻塞事件循环（大忌）

由于你的代码只有一个主线程，如果你执行一个巨大的数学运算或无限的 `while` 循环，**整个服务器就会冻结**。没有其他用户能够登录或加载数据。

```javascript
// ❌ 危险：阻塞代码 (同步)
app.get('/hash', (req, res) => {
  // 当读取这个 2GB 的文件时，Node.js 无法响应任何其他人。
  const data = fs.readFileSync('/archivo-gigante.mp4'); 
  res.send('完成');
});

// ✅ 正确：非阻塞代码 (异步)
app.get('/hash', async (req, res) => {
  // Node 将任务发送给 libuv，并继续处理其他 HTTP 请求
  const data = await fs.promises.readFile('/archivo-gigante.mp4');
  res.send('完成');
});
```

## 3. Node 不适合 CPU 密集型任务

如果你需要处理视频、训练人工智能模型或渲染 3D，Node.js 是错误的工具。对于 CPU 密集型任务，Python（带有 C 语言库）、Rust 或 Go 会更优秀。
Node.js 是 **I/O 密集型 (Input/Output)** 应用程序的绝对王者：实时聊天、REST API、数据流 (streaming) 和微服务。

## 后续步骤
我们已经了解了 Node.js 是如何运作的。在**基础级别**中，我们将抛开理论，使用统治 90% 市场的框架——Express.js——来创建我们的第一个 HTTP 服务器。
