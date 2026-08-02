# Express.js y Arquitectura REST

Aunque Node.js trae el módulo nativo `http` para crear servidores, es demasiado verboso de bajo nivel. Por eso, el ecosistema adoptó **Express.js** como el estándar de facto. Express abstrae el enrutamiento y las peticiones, permitiéndote construir APIs RESTful en minutos.

## 1. Hola Mundo en Express

La inicialización de un servidor es extremadamente sencilla, pero encierra un diseño de tuberías (pipeline) que veremos más adelante.

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware integrado para parsear JSON
app.use(express.json());

// Ruta GET básica
app.get('/api/usuarios', (req, res) => {
  res.status(200).json({ mensaje: "Lista de usuarios", data: [] });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

## 2. Los Métodos REST (CRUD)

Una API REST profesional debe mapear los verbos HTTP a las acciones de base de datos. No uses `POST` para obtener datos, ni `GET` para borrarlos.

| Verbo HTTP | Operación CRUD | Ruta Ejemplo |
| :--- | :--- | :--- |
| **GET** | Lectura (Read) | `/api/usuarios` (Todos) |
| **GET** | Lectura (Read) | `/api/usuarios/:id` (Solo uno) |
| **POST** | Creación (Create) | `/api/usuarios` |
| **PUT** | Actualización Total | `/api/usuarios/:id` |
| **PATCH** | Actualización Parcial | `/api/usuarios/:id` |
| **DELETE** | Eliminación (Delete) | `/api/usuarios/:id` |

### Ejemplo Práctico de POST

```javascript
app.post('/api/usuarios', (req, res) => {
  // req.body contiene el JSON enviado desde el Frontend (React/Angular)
  const { nombre, email } = req.body;
  
  if (!nombre || !email) {
    // 400 Bad Request
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  // Lógica de base de datos aquí...

  // 201 Created
  res.status(201).json({ mensaje: "Usuario creado exitosamente" });
});
```

## 3. Parametrización de Rutas (Params vs Queries)

Es crucial entender cómo el frontend te envía datos por la URL.

* **Req.Params (`/api/usuarios/5`):** Identificadores únicos.
  ```javascript
  app.get('/api/usuarios/:id', (req, res) => {
    console.log(req.params.id); // "5"
  });
  ```
* **Req.Query (`/api/usuarios?rol=admin&edad=25`):** Filtros, búsquedas y paginación.
  ```javascript
  app.get('/api/usuarios', (req, res) => {
    console.log(req.query.rol); // "admin"
  });
  ```

Ahora sabes crear las rutas, pero meter todo en un solo archivo `index.js` crea código espagueti. En el **Intermediate Level**, aprenderemos a estructurar la arquitectura por Capas (Routes, Controllers, Services) y el concepto más vital de Express: Los Middlewares.
