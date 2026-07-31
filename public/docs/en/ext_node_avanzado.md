# TypeScript, Dependency Injection, and Security

The modern JavaScript ecosystem no longer tolerates "undefined is not a function" surprises in production. Enterprise companies demand **TypeScript** for the backend. 

## 1. Migrating to TypeScript

In TypeScript, we define strict contracts (Interfaces) for everything that enters and exits our API.

```typescript
import { Request, Response } from 'express';

// We define the exact shape the request body must have
interface CreateUserDto {
  name: string;
  email: string;
  age: number;
}

export const createUser = (req: Request<{}, {}, CreateUserDto>, res: Response) => {
  // TypeScript auto-completes req.body.name, and will prevent us from using
  // req.body.lastName (because it doesn't exist in the interface)
  const { name, email } = req.body;
  
  res.status(201).json({ ok: true, user: name });
};
```

## 2. Dependency Injection (DI) and Inversion of Control (IoC)

In pure Node, we usually do a direct `require()` or `import` of modules like the Database inside the Service. This makes the code **impossible to test (Unit Testing)**. 

Dependency Injection dictates that a Service does not create its tools; it *receives* them from the outside.

```typescript
// BAD: Tightly coupled. Impossible to mock the DB for tests.
export class UserService {
  private db = new RealPostgresDatabase();
  async saveUser() { this.db.save(); }
}

// GOOD: Constructor Injection. 
export class UserService {
  private repository;
  
  // Receives ANYTHING that respects the Interface (Could be Postgres, Mongo, or a Memory Mock)
  constructor(databaseRepository) {
    this.repository = databaseRepository;
  }
  
  async saveUser() { this.repository.save(); }
}
```
*Modern frameworks like **NestJS** bring native DI containers, bringing Node.js closer to the architectural level of Spring Boot (Java).*

## 3. Perimeter Security: CORS, Helmet, and Rate Limiting

A raw Express backend is insecure by default. You must armor it before launching it into production.

### Mandatory Security Packages
* **Helmet:** Hides HTTP headers that betray what technology you use (e.g., `X-Powered-By: Express`) and activates native browser XSS protections.
* **CORS (Cross-Origin Resource Sharing):** By default, APIs reject requests from different domains. You must configure a *Whitelist*.
* **Rate Limiter:** Prevents brute-force or Denial of Service (DDoS) attacks by limiting requests per IP.

```typescript
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// 1. HTTP Armoring
app.use(helmet());

// 2. Origin Control
app.use(cors({
  origin: ['https://my-frontend.com'], // We only accept requests from this domain
  methods: ['GET', 'POST']
}));

// 3. Request Throttling
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit of 100 requests per IP every 15 min
});
app.use('/api/', limiter);
```

In the **Expert Level**, we will tackle database latency, distributed caching (Redis), and messaging architecture (RabbitMQ/Kafka) for Microservices.
