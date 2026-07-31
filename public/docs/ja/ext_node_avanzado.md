# Node.js 上級：TypeScript、依存性の注入、およびセキュリティ

現代のJavaScriptエコシステムは、本番環境での「undefined is not a function」という驚きをもはや許容しません。エンタープライズ企業はバックエンドに **TypeScript** を要求します。

## 1. TypeScript への移行

TypeScriptでは、APIに出入りするすべてのものに対して厳密な契約（インターフェース / Interfaces）を定義します。

```typescript
import { Request, Response } from 'express';

// リクエストの本文 (body) が持つべき正確な形状を定義します
interface CrearUsuarioDto {
  nombre: string;
  email: string;
  edad: number;
}

export const crearUsuario = (req: Request<{}, {}, CrearUsuarioDto>, res: Response) => {
  // TypeScript は req.body.nombre をオートコンプリートし、
  // req.body.apellido を使用するのを防ぎます（インターフェースに存在しないため）
  const { nombre, email } = req.body;
  
  res.status(201).json({ ok: true, usuario: nombre });
};
```

## 2. 依存性の注入 (DI) と制御の反転 (IoC)

純粋なNodeでは、サービス内でデータベースのようなモジュールを直接 `require()` または `import` することがよくあります。これにより、コードの**テスト (Unit Testing) が不可能**になります。

依存性の注入は、サービスが独自のツールを作成するのではなく、外部からそれらを*受け取る*ことを規定しています。

```typescript
// 悪い例：密結合。テスト用に DB をモックすることは不可能です。
export class UserService {
  private db = new RealPostgresDatabase();
  async saveUser() { this.db.save(); }
}

// 良い例：コンストラクターによる注入。
export class UserService {
  private repository;
  
  // インターフェースを尊重する「あらゆる」ものを受け取ります (Postgres、Mongo、またはメモリ内のモックなど)
  constructor(databaseRepository) {
    this.repository = databaseRepository;
  }
  
  async saveUser() { this.repository.save(); }
}
```
* **NestJS** のような最新のフレームワークにはネイティブのDIコンテナが付属しており、Node.jsをSpring Boot (Java) のアーキテクチャレベルに近づけています。*

## 3. 境界セキュリティ：CORS、Helmet、および Rate Limiting

素のExpressバックエンドはデフォルトで安全ではありません。本番環境にデプロイする前に、これを強化する必要があります。

### 必須のセキュリティパッケージ
* **Helmet:** どのテクノロジーを使用しているか（例：`X-Powered-By: Express`）を明らかにするHTTPヘッダーを隠し、ネイティブのブラウザXSS保護を有効にします。
* **CORS (Cross-Origin Resource Sharing):** デフォルトでは、APIは異なるドメインからのリクエストを拒否します。*ホワイトリスト (Whitelist)* を構成する必要があります。
* **Rate Limiter:** IPごとのリクエストを制限することにより、ブルートフォース攻撃やサービス拒否攻撃 (DDoS) を防止します。

```typescript
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// 1. HTTP シールド
app.use(helmet());

// 2. オリジン制御
app.use(cors({
  origin: ['https://mi-frontend.com'], // このドメインからのリクエストのみを受け入れます
  methods: ['GET', 'POST']
}));

// 3. リクエストのスロットリング
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分
  max: 100 // 15 分ごとに IP あたり 100 リクエストの制限
});
app.use('/api/', limiter);
```

**エキスパート**レベルでは、データベースのレイテンシ、分散キャッシュ（Redis）、およびマイクロサービスのためのメッセージングアーキテクチャ（RabbitMQ/Kafka）について説明します。
