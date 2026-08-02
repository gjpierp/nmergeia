# TypeScript, Inyección de Dependencias y Seguridad

El ecosistema JavaScript moderno ya no tolera las sorpresas de "undefined is not a function" en producción. Las empresas Enterprise exigen **TypeScript** para el backend. 

## 1. Migrando a TypeScript

En TypeScript, definimos contratos estrictos (Interfaces) para todo lo que entra y sale de nuestra API.

```typescript
import { Request, Response } from 'express';

// Definimos la forma exacta que debe tener el cuerpo de la petición
interface CrearUsuarioDto {
  nombre: string;
  email: string;
  edad: number;
}

export const crearUsuario = (req: Request<{}, {}, CrearUsuarioDto>, res: Response) => {
  // TypeScript nos autocompleta req.body.nombre, e impedirá que usemos
  // req.body.apellido (porque no existe en la interfaz)
  const { nombre, email } = req.body;
  
  res.status(201).json({ ok: true, usuario: nombre });
};
```

## 2. Inyección de Dependencias (DI) e Inversión de Control (IoC)

En Node puro, solemos hacer `require()` o `import` directo de módulos como la Base de Datos dentro del Servicio. Esto hace que el código sea **imposible de testear (Unit Testing)**. 

La Inyección de Dependencias dicta que un Servicio no crea sus herramientas, las *recibe* desde el exterior.

```typescript
// MAL: Acoplado fuertemente. Imposible hacer un mock de la DB para tests.
export class UserService {
  private db = new RealPostgresDatabase();
  async saveUser() { this.db.save(); }
}

// BIEN: Inyección por Constructor. 
export class UserService {
  private repository;
  
  // Recibe CUALQUIER cosa que respete la Interfaz (Podría ser Postgres, Mongo o un Mock en memoria)
  constructor(databaseRepository) {
    this.repository = databaseRepository;
  }
  
  async saveUser() { this.repository.save(); }
}
```
*Frameworks modernos como **NestJS** traen contenedores DI nativos, acercando Node.js al nivel arquitectónico de Spring Boot (Java).*

## 3. Seguridad Perimetral: CORS, Helmet y Rate Limiting

Un backend crudo de Express es inseguro por defecto. Debes blindarlo antes de lanzarlo a producción.

### Paquetes Obligatorios de Seguridad
* **Helmet:** Oculta cabeceras HTTP que delatan qué tecnología usas (ej. `X-Powered-By: Express`) y activa protecciones XSS nativas del navegador.
* **CORS (Cross-Origin Resource Sharing):** Por defecto, las APIs rechazan peticiones de dominios distintos. Debes configurar una *Whitelist*.
* **Rate Limiter:** Evita ataques de fuerza bruta o de Denegación de Servicio (DDoS) limitando las peticiones por IP.

```typescript
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// 1. Blindaje HTTP
app.use(helmet());

// 2. Control de Origen
app.use(cors({
  origin: ['https://mi-frontend.com'], // Solo aceptamos peticiones de este dominio
  methods: ['GET', 'POST']
}));

// 3. Estrangulamiento de Peticiones
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // Límite de 100 peticiones por IP cada 15 min
});
app.use('/api/', limiter);
```

En el **Niveau Expert**, abordaremos la latencia de base de datos, el almacenamiento en caché distribuido (Redis), y la arquitectura de mensajería (RabbitMQ/Kafka) para Microservicios.
