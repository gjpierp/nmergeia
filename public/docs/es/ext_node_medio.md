# Middlewares, Controladores y Arquitectura en Capas

Meter toda tu lógica de negocio (consultas SQL, validaciones, envío de emails) directamente dentro del `app.get()` es el peor antipatrón en Express. El código se vuelve intestable y caótico.

## 1. El Patrón MVC / Arquitectura de Capas

Debes separar responsabilidades. La capa de rutas solo enruta, el controlador extrae datos de la petición HTTP, y el servicio ejecuta la matemática o la base de datos.

```mermaid
graph LR
    Cliente[Cliente / React] -->|Petición HTTP| Routes[Rutas (Router)]
    Routes -->|Delega| Controller[Controlador]
    Controller -->|Extrae req.body| Service[Capa de Servicio]
    Service -->|Consulta| DB[(Base de Datos)]
    
    DB --> Service
    Service -->|Resultado Puro| Controller
    Controller -->|"res.status(200)"| Cliente
```

## 2. El Corazón de Express: Los Middlewares

Un Middleware es simplemente una función que se ejecuta **en el medio**, es decir, después de que llega la petición pero antes de que llegue a tu Controlador.

Son el mecanismo perfecto para validaciones, seguridad, logs y autenticación. Tienen acceso a `req`, `res` y la función mágica `next()`.

```javascript
// Middleware de Autenticación
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: "No autorizado, falta token" });
  }

  // Si el token es válido, le pasamos la pelota al siguiente eslabón
  if (token === "TOKEN_SECRETO") {
    next(); 
  } else {
    return res.status(403).json({ error: "Token inválido" });
  }
};

// Inyectando el middleware en la ruta protegida
app.get('/api/datos-privados', verificarToken, (req, res) => {
  res.json({ secreto: "La fórmula de la Coca-Cola" });
});
```

## 3. Manejo de Errores Global (El Red de Seguridad)

En lugar de poner un `try/catch` y responder un error 500 en CADA controlador, los expertos usan un **Middleware de Manejo de Errores**. 
En Express, si declaras un middleware con 4 parámetros `(err, req, res, next)`, Express sabe que es un interceptor global de errores.

```javascript
// Controlador (Simulando un fallo asíncrono)
app.get('/api/fallo', async (req, res, next) => {
  try {
    throw new Error("Base de datos colapsada");
  } catch (error) {
    next(error); // Enviamos el error al manejador global
  }
});

// Middleware Global de Errores (Siempre al final de tu archivo index.js)
app.use((err, req, res, next) => {
  console.error(err.stack); // Guardamos log en servidor
  res.status(500).json({ 
    mensaje: "Error interno del servidor", 
    detalles: err.message 
  });
});
```

Esta arquitectura te llevará lejos, pero hoy en día usar Express sin Tipado estricto es un riesgo corporativo. En el **Nivel Avanzado**, daremos el salto a NestJS o migraremos Express hacia TypeScript (POO) con inyección de dependencias.
