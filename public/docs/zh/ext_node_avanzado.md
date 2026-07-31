# Node.js 高级：TypeScript、依赖注入与安全性

现代 JavaScript 生态系统在生产环境中不再容忍出现 "undefined is not a function" 的意外。企业级 (Enterprise) 公司在后端强制要求使用 **TypeScript**。

## 1. 迁移到 TypeScript

在 TypeScript 中，我们为 API 所有进出的数据定义了严格的契约 (Interfaces / 接口)。

```typescript
import { Request, Response } from 'express';

// 我们定义了请求体必须具有的确切形状
interface CrearUsuarioDto {
  nombre: string;
  email: string;
  edad: number;
}

export const crearUsuario = (req: Request<{}, {}, CrearUsuarioDto>, res: Response) => {
  // TypeScript 会为我们自动补全 req.body.nombre，并阻止我们使用
  // req.body.apellido (因为它在接口中不存在)
  const { nombre, email } = req.body;
  
  res.status(201).json({ ok: true, usuario: nombre });
};
```

## 2. 依赖注入 (DI) 与控制反转 (IoC)

在纯 Node 中，我们通常会在服务内部直接通过 `require()` 或 `import` 引入诸如数据库之类的模块。这使得代码**无法进行测试 (Unit Testing)**。

依赖注入指出，一个服务不应该自己创建它的工具，而是应该从外部*接收*它们。

```typescript
// 错误：严重耦合。无法对 DB 进行 mock 以进行测试。
export class UserService {
  private db = new RealPostgresDatabase();
  async saveUser() { this.db.save(); }
}

// 正确：通过构造函数注入。
export class UserService {
  private repository;
  
  // 接收任何遵守该接口的东西 (可以是 Postgres, Mongo 或内存中的 Mock)
  constructor(databaseRepository) {
    this.repository = databaseRepository;
  }
  
  async saveUser() { this.repository.save(); }
}
```
*现代框架如 **NestJS** 带来了原生的 DI 容器，将 Node.js 的架构水平拉近到了 Spring Boot (Java) 的水平。*

## 3. 边界安全：CORS、Helmet 与速率限制 (Rate Limiting)

原生的 Express 后端默认是不安全的。在将其发布到生产环境之前，你必须为其做好防护。

### 必备的安全包
* **Helmet:** 隐藏暴露你所用技术的 HTTP 标头（例如 `X-Powered-By: Express`）并激活浏览器的原生 XSS 保护。
* **CORS (跨源资源共享 Cross-Origin Resource Sharing):** 默认情况下，API 拒绝来自不同域的请求。你必须配置一个*白名单 (Whitelist)*。
* **Rate Limiter (速率限制器):** 通过限制每个 IP 的请求次数来防止暴力破解或拒绝服务 (DDoS) 攻击。

```typescript
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// 1. HTTP 防护
app.use(helmet());

// 2. 来源控制
app.use(cors({
  origin: ['https://mi-frontend.com'], // 我们只接受来自这个域的请求
  methods: ['GET', 'POST']
}));

// 3. 请求节流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 每 15 分钟限制每个 IP 100 次请求
});
app.use('/api/', limiter);
```

在**专家级别**中，我们将解决数据库延迟、分布式缓存 (Redis) 以及微服务的消息传递架构 (RabbitMQ/Kafka) 问题。
