# Node.js 中级：中间件、控制器与分层架构

把你所有的业务逻辑（SQL 查询、验证、发送邮件）直接塞进 `app.get()` 是 Express 中最糟糕的反模式。代码会变得不可测试且混乱。

## 1. MVC 模式 / 分层架构

你必须分离职责。路由层只负责路由，控制器提取 HTTP 请求的数据，服务层执行计算或数据库操作。

```mermaid
graph LR
    Cliente[客户端 / React] -->|HTTP 请求| Routes[路由 (Router)]
    Routes -->|委托| Controller[控制器]
    Controller -->|提取 req.body| Service[服务层]
    Service -->|查询| DB[(数据库)]
    
    DB --> Service
    Service -->|纯结果| Controller
    Controller -->|"res.status(200)"| Cliente
```

## 2. Express 的核心：中间件 (Middlewares)

中间件仅仅是一个在**中间**执行的函数，也就是说，在请求到达之后、到达你的控制器之前执行。

它们是验证、安全、日志记录和身份验证的完美机制。它们可以访问 `req`、`res` 和魔法函数 `next()`。

```javascript
// 身份验证中间件
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: "未授权，缺少 token" });
  }

  // 如果 token 有效，我们将球传给下一个环节
  if (token === "TOKEN_SECRETO") {
    next(); 
  } else {
    return res.status(403).json({ error: "无效的 token" });
  }
};

// 将中间件注入到受保护的路由中
app.get('/api/datos-privados', verificarToken, (req, res) => {
  res.json({ secreto: "可口可乐的配方" });
});
```

## 3. 全局错误处理（安全网）

专家们不会在*每个*控制器中放置 `try/catch` 并返回 500 错误，而是使用**错误处理中间件**。
在 Express 中，如果你声明一个带有 4 个参数 `(err, req, res, next)` 的中间件，Express 就知道它是一个全局错误拦截器。

```javascript
// 控制器 (模拟异步失败)
app.get('/api/fallo', async (req, res, next) => {
  try {
    throw new Error("数据库崩溃");
  } catch (error) {
    next(error); // 我们将错误发送给全局处理器
  }
});

// 全局错误中间件 (始终在你的 index.js 文件的最后)
app.use((err, req, res, next) => {
  console.error(err.stack); // 在服务器上保存日志
  res.status(500).json({ 
    mensaje: "内部服务器错误", 
    detalles: err.message 
  });
});
```

这种架构可以让你走得很远，但如今在没有严格类型的情况下使用 Express 会带来企业级的风险。在**高级阶段**，我们将飞跃到 NestJS，或者使用依赖注入和 TypeScript (面向对象编程 POO) 迁移 Express。
