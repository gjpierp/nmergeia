# TypeScript, Injeção de Dependências e Segurança

O ecossistema JavaScript moderno não tolera mais surpresas do tipo "undefined is not a function" em produção. As empresas Enterprise exigem **TypeScript** para o backend.

## 1. Migrando para TypeScript

No TypeScript, definimos contratos rígidos (Interfaces) para tudo o que entra e sai da nossa API.

```typescript
import { Request, Response } from 'express';

// Definimos a forma exata que o corpo da requisição deve ter
interface CrearUsuarioDto {
  nome: string;
  email: string;
  idade: number;
}

export const criarUsuario = (req: Request<{}, {}, CrearUsuarioDto>, res: Response) => {
  // O TypeScript nos autocompleta req.body.nome e impedirá que usemos
  // req.body.sobrenome (porque não existe na interface)
  const { nome, email } = req.body;
  
  res.status(201).json({ ok: true, usuario: nome });
};
```

## 2. Injeção de Dependências (DI) e Inversão de Controle (IoC)

No Node puro, costumamos fazer `require()` ou `import` direto de módulos como o Banco de Dados dentro do Serviço. Isso torna o código **impossível de testar (Unit Testing)**.

A Injeção de Dependências dita que um Serviço não cria suas ferramentas, ele as *recebe* do exterior.

```typescript
// RUIM: Fortemente acoplado. Impossível fazer um mock do DB para testes.
export class UserService {
  private db = new RealPostgresDatabase();
  async saveUser() { this.db.save(); }
}

// BOM: Injeção pelo Construtor.
export class UserService {
  private repository;
  
  // Recebe QUALQUER coisa que respeite a Interface (Pode ser Postgres, Mongo ou um Mock em memória)
  constructor(databaseRepository) {
    this.repository = databaseRepository;
  }
  
  async saveUser() { this.repository.save(); }
}
```
*Frameworks modernos como **NestJS** trazem contêineres DI nativos, aproximando o Node.js do nível arquitetônico do Spring Boot (Java).*

## 3. Segurança de Perímetro: CORS, Helmet e Rate Limiting

Um backend Express bruto é inseguro por padrão. Você deve blindá-lo antes de lançá-lo em produção.

### Pacotes Obrigatórios de Segurança
* **Helmet:** Oculta cabeçalhos HTTP que entregam qual tecnologia você usa (ex: `X-Powered-By: Express`) e ativa proteções XSS nativas do navegador.
* **CORS (Cross-Origin Resource Sharing):** Por padrão, as APIs rejeitam requisições de domínios diferentes. Você deve configurar uma *Whitelist*.
* **Rate Limiter:** Evita ataques de força bruta ou de Negação de Serviço (DDoS) limitando as requisições por IP.

```typescript
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// 1. Blindagem HTTP
app.use(helmet());

// 2. Controle de Origem
app.use(cors({
  origin: ['https://meu-frontend.com'], // Só aceitamos requisições deste domínio
  methods: ['GET', 'POST']
}));

// 3. Estrangulamento de Requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // Limite de 100 requisições por IP a cada 15 min
});
app.use('/api/', limiter);
```

No **Nível Especialista**, abordaremos a latência de banco de dados, o armazenamento em cache distribuído (Redis) e a arquitetura de mensagens (RabbitMQ/Kafka) para Microsserviços.
