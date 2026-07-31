# Node.js 基础：Express.js 与 REST 架构

虽然 Node.js 带有原生的 `http` 模块来创建服务器，但它过于底层且冗长。因此，生态系统采用了 **Express.js** 作为事实上的标准。Express 对路由和请求进行了抽象，使你能够在几分钟内构建 RESTful API。

## 1. Express 的 Hello World

服务器的初始化极其简单，但它包含了一个管道 (pipeline) 设计，我们稍后会看到。

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// 用于解析 JSON 的内置中间件
app.use(express.json());

// 基础的 GET 路由
app.get('/api/usuarios', (req, res) => {
  res.status(200).json({ mensaje: "用户列表", data: [] });
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
```

## 2. REST 方法 (CRUD)

专业的 REST API 必须将 HTTP 动词映射到数据库操作。不要使用 `POST` 获取数据，也不要使用 `GET` 删除数据。

| HTTP 动词 | CRUD 操作 | 路由示例 |
| :--- | :--- | :--- |
| **GET** | 读取 (Read) | `/api/usuarios` (所有用户) |
| **GET** | 读取 (Read) | `/api/usuarios/:id` (仅一个) |
| **POST** | 创建 (Create) | `/api/usuarios` |
| **PUT** | 完全更新 | `/api/usuarios/:id` |
| **PATCH** | 部分更新 | `/api/usuarios/:id` |
| **DELETE** | 删除 (Delete) | `/api/usuarios/:id` |

### POST 的实际示例

```javascript
app.post('/api/usuarios', (req, res) => {
  // req.body 包含从前端 (React/Angular) 发送来的 JSON
  const { nombre, email } = req.body;
  
  if (!nombre || !email) {
    // 400 Bad Request
    return res.status(400).json({ error: "缺少必填字段" });
  }

  // 这里的数据库逻辑...

  // 201 Created
  res.status(201).json({ mensaje: "用户创建成功" });
});
```

## 3. 路由参数化 (Params vs Queries)

理解前端如何通过 URL 向你发送数据至关重要。

* **Req.Params (`/api/usuarios/5`)：** 唯一标识符。
  ```javascript
  app.get('/api/usuarios/:id', (req, res) => {
    console.log(req.params.id); // "5"
  });
  ```
* **Req.Query (`/api/usuarios?rol=admin&edad=25`)：** 过滤器、搜索和分页。
  ```javascript
  app.get('/api/usuarios', (req, res) => {
    console.log(req.query.rol); // "admin"
  });
  ```

现在你知道如何创建路由了，但是把所有东西都塞进一个 `index.js` 文件里会造成意大利面条式的代码。在**中级阶段**，我们将学习如何按层级（Routes、Controllers、Services）构建架构，以及 Express 中最重要的概念：中间件 (Middlewares)。
