# TypeScript, Dependency Injection und Sicherheit

Das moderne JavaScript-Ökosystem toleriert in der Produktion keine "undefined is not a function"-Überraschungen mehr. Enterprise-Unternehmen verlangen **TypeScript** für das Backend.

## 1. Migration zu TypeScript

In TypeScript definieren wir strikte Verträge (Interfaces) für alles, was in unsere API eingeht und daraus hervorgeht.

```typescript
import { Request, Response } from 'express';

// Wir definieren die genaue Form, die der Body der Anfrage haben muss
interface CrearUsuarioDto {
  nombre: string;
  email: string;
  edad: number;
}

export const crearUsuario = (req: Request<{}, {}, CrearUsuarioDto>, res: Response) => {
  // TypeScript vervollständigt req.body.nombre automatisch und verhindert,
  // dass wir req.body.apellido verwenden (da es im Interface nicht existiert)
  const { nombre, email } = req.body;
  
  res.status(201).json({ ok: true, usuario: nombre });
};
```

## 2. Dependency Injection (DI) und Inversion of Control (IoC)

In reinem Node verwenden wir oft `require()` oder den direkten `import` von Modulen wie der Datenbank innerhalb des Services. Dies macht den Code **untestbar (Unit Testing)**. 

Die Dependency Injection besagt, dass ein Service seine Werkzeuge nicht selbst erstellt, sondern sie von außen *erhält*.

```typescript
// SCHLECHT: Stark gekoppelt. Unmöglich, einen Mock der DB für Tests zu erstellen.
export class UserService {
  private db = new RealPostgresDatabase();
  async saveUser() { this.db.save(); }
}

// GUT: Konstruktor-Injektion. 
export class UserService {
  private repository;
  
  // Empfängt ALLES, was das Interface respektiert (Könnte Postgres, Mongo oder ein In-Memory-Mock sein)
  constructor(databaseRepository) {
    this.repository = databaseRepository;
  }
  
  async saveUser() { this.repository.save(); }
}
```
*Moderne Frameworks wie **NestJS** bringen native DI-Container mit und bringen Node.js auf die architektonische Ebene von Spring Boot (Java).*

## 3. Perimetersicherheit: CORS, Helmet und Rate Limiting

Ein rohes Express-Backend ist standardmäßig unsicher. Du musst es absichern, bevor du es in die Produktion überführst.

### Obligatorische Sicherheitspakete
* **Helmet:** Verbirgt HTTP-Header, die verraten, welche Technologie du verwendest (z. B. `X-Powered-By: Express`), und aktiviert native XSS-Schutzfunktionen des Browsers.
* **CORS (Cross-Origin Resource Sharing):** Standardmäßig lehnen APIs Anfragen von anderen Domänen ab. Du musst eine *Whitelist* konfigurieren.
* **Rate Limiter:** Verhindert Brute-Force- oder Denial-of-Service-Angriffe (DDoS), indem die Anfragen pro IP begrenzt werden.

```typescript
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// 1. HTTP-Abschirmung
app.use(helmet());

// 2. Ursprungskontrolle
app.use(cors({
  origin: ['https://mi-frontend.com'], // Wir akzeptieren nur Anfragen von dieser Domäne
  methods: ['GET', 'POST']
}));

// 3. Drosselung von Anfragen
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100 // Limit von 100 Anfragen pro IP alle 15 Min
});
app.use('/api/', limiter);
```

Auf der **Expertenstufe (Nivel Experto)** befassen wir uns mit der Datenbanklatenz, dem verteilten Caching (Redis) und der Messaging-Architektur (RabbitMQ/Kafka) für Microservices.
