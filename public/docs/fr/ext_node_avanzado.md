# TypeScript, Injection de Dépendances et Sécurité

L'écosystème JavaScript moderne ne tolère plus les surprises du type "undefined is not a function" en production. Les entreprises Enterprise exigent **TypeScript** pour le backend. 

## 1. Migrer vers TypeScript

En TypeScript, nous définissons des contrats stricts (Interfaces) pour tout ce qui entre et sort de notre API.

```typescript
import { Request, Response } from 'express';

// Nous définissons la forme exacte que doit avoir le corps de la requête
interface CrearUsuarioDto {
  nombre: string;
  email: string;
  edad: number;
}

export const crearUsuario = (req: Request<{}, {}, CrearUsuarioDto>, res: Response) => {
  // TypeScript autocomplète req.body.nombre et nous empêchera d'utiliser
  // req.body.apellido (car il n'existe pas dans l'interface)
  const { nombre, email } = req.body;
  
  res.status(201).json({ ok: true, usuario: nombre });
};
```

## 2. Injection de Dépendances (DI) et Inversion de Contrôle (IoC)

En Node pur, nous avons l'habitude de faire un `require()` ou un `import` direct de modules comme la base de données au sein du service. Cela rend le code **impossible à tester (Unit Testing)**. 

L'Injection de Dépendances stipule qu'un service ne crée pas ses outils, il les *reçoit* de l'extérieur.

```typescript
// MAUVAIS : Fortement couplé. Impossible de mocker la DB pour les tests.
export class UserService {
  private db = new RealPostgresDatabase();
  async saveUser() { this.db.save(); }
}

// BON : Injection par constructeur. 
export class UserService {
  private repository;
  
  // Reçoit N'IMPORTE QUOI qui respecte l'interface (ce pourrait être Postgres, Mongo ou un Mock en mémoire)
  constructor(databaseRepository) {
    this.repository = databaseRepository;
  }
  
  async saveUser() { this.repository.save(); }
}
```
*Des frameworks modernes comme **NestJS** intègrent des conteneurs DI natifs, rapprochant Node.js du niveau architectural de Spring Boot (Java).*

## 3. Sécurité Périmétrique : CORS, Helmet et Rate Limiting

Un backend Express brut est non sécurisé par défaut. Vous devez le blinder avant de le lancer en production.

### Paquets de sécurité obligatoires
* **Helmet :** Masque les en-têtes HTTP révélant la technologie utilisée (ex. `X-Powered-By: Express`) et active les protections XSS natives du navigateur.
* **CORS (Cross-Origin Resource Sharing) :** Par défaut, les API rejettent les requêtes venant d'autres domaines. Vous devez configurer une *Whitelist*.
* **Rate Limiter :** Prévient les attaques par force brute ou par Déni de Service (DDoS) en limitant le nombre de requêtes par adresse IP.

```typescript
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// 1. Protection HTTP
app.use(helmet());

// 2. Contrôle de l'origine
app.use(cors({
  origin: ['https://mi-frontend.com'], // Nous n'acceptons des requêtes que depuis ce domaine
  methods: ['GET', 'POST']
}));

// 3. Limitation du débit des requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limite de 100 requêtes par IP toutes les 15 min
});
app.use('/api/', limiter);
```

Dans le **Niveau Expert**, nous aborderons la latence de base de données, la mise en cache distribuée (Redis) et l'architecture de messagerie (RabbitMQ/Kafka) pour les microservices.
