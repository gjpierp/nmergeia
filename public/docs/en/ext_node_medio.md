# Middlewares, Controllers, and Layered Architecture

Putting all your business logic (SQL queries, validations, sending emails) directly inside the `app.get()` is the worst anti-pattern in Express. The code becomes untestable and chaotic.

## 1. The MVC Pattern / Layered Architecture

You must separate responsibilities. The routes layer only routes, the controller extracts data from the HTTP request, and the service executes the math or database query.

```mermaid
graph LR
    Client[Client / React] -->|HTTP Request| Routes[Routes (Router)]
    Routes -->|Delegates| Controller[Controller]
    Controller -->|Extracts req.body| Service[Service Layer]
    Service -->|Queries| DB[(Database)]
    
    DB --> Service
    Service -->|Pure Result| Controller
    Controller -->|"res.status(200)"| Client
```

## 2. The Heart of Express: Middlewares

A Middleware is simply a function that executes **in the middle**, meaning after the request arrives but before it reaches your Controller.

They are the perfect mechanism for validations, security, logging, and authentication. They have access to `req`, `res`, and the magic `next()` function.

```javascript
// Authentication Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized, missing token" });
  }

  // If the token is valid, we pass the ball to the next link in the chain
  if (token === "SECRET_TOKEN") {
    next(); 
  } else {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Injecting the middleware in the protected route
app.get('/api/private-data', verifyToken, (req, res) => {
  res.json({ secret: "Coca-Cola's recipe" });
});
```

## 3. Global Error Handling (The Safety Net)

Instead of putting a `try/catch` and returning a 500 error in EVERY controller, experts use a **Global Error Handling Middleware**. 
In Express, if you declare a middleware with 4 parameters `(err, req, res, next)`, Express knows it is a global error interceptor.

```javascript
// Controller (Simulating an async crash)
app.get('/api/crash', async (req, res, next) => {
  try {
    throw new Error("Database collapsed");
  } catch (error) {
    next(error); // We send the error to the global handler
  }
});

// Global Error Middleware (Always at the end of your index.js file)
app.use((err, req, res, next) => {
  console.error(err.stack); // Save log on server
  res.status(500).json({ 
    message: "Internal Server Error", 
    details: err.message 
  });
});
```

This architecture will take you far, but nowadays using Express without strict Typing is a corporate risk. In the **Advanced Level**, we will make the leap to NestJS or migrate Express towards TypeScript (OOP) with dependency injection.
