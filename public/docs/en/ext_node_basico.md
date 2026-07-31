# Express.js and REST Architecture

Although Node.js comes with the native `http` module to create servers, it is too low-level and verbose. Because of this, the ecosystem adopted **Express.js** as the de facto standard. Express abstracts routing and requests, allowing you to build RESTful APIs in minutes.

## 1. Hello World in Express

Initializing a server is extremely simple, but it conceals a pipeline design that we will see later.

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Built-in middleware to parse JSON
app.use(express.json());

// Basic GET Route
app.get('/api/users', (req, res) => {
  res.status(200).json({ message: "User list", data: [] });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 2. REST Methods (CRUD)

A professional REST API must map HTTP verbs to database actions. Do not use `POST` to fetch data, nor `GET` to delete it.

| HTTP Verb | CRUD Operation | Route Example |
| :--- | :--- | :--- |
| **GET** | Read | `/api/users` (All) |
| **GET** | Read | `/api/users/:id` (Just one) |
| **POST** | Create | `/api/users` |
| **PUT** | Full Update | `/api/users/:id` |
| **PATCH** | Partial Update | `/api/users/:id` |
| **DELETE** | Delete | `/api/users/:id` |

### Practical POST Example

```javascript
app.post('/api/users', (req, res) => {
  // req.body contains the JSON sent from the Frontend (React/Angular)
  const { name, email } = req.body;
  
  if (!name || !email) {
    // 400 Bad Request
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Database logic here...

  // 201 Created
  res.status(201).json({ message: "User successfully created" });
});
```

## 3. Route Parameters (Params vs Queries)

It is crucial to understand how the frontend sends data to you via the URL.

* **Req.Params (`/api/users/5`):** Unique identifiers.
  ```javascript
  app.get('/api/users/:id', (req, res) => {
    console.log(req.params.id); // "5"
  });
  ```
* **Req.Query (`/api/users?role=admin&age=25`):** Filters, searches, and pagination.
  ```javascript
  app.get('/api/users', (req, res) => {
    console.log(req.query.role); // "admin"
  });
  ```

Now you know how to create routes, but putting everything in a single `index.js` file creates spaghetti code. In the **Intermediate Level**, we will learn to structure the Layered Architecture (Routes, Controllers, Services) and Express's most vital concept: Middlewares.
