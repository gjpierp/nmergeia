# Express.js e Arquitetura REST

Embora o Node.js traga o módulo nativo `http` para criar servidores, ele é muito verboso e de baixo nível. Por isso, o ecossistema adotou o **Express.js** como o padrão de fato. O Express abstrai o roteamento e as requisições, permitindo que você construa APIs RESTful em minutos.

## 1. Olá Mundo no Express

A inicialização de um servidor é extremamente simples, mas encerra um design de tubulações (pipeline) que veremos mais adiante.

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware integrado para fazer parse de JSON
app.use(express.json());

// Rota GET básica
app.get('/api/usuarios', (req, res) => {
  res.status(200).json({ mensagem: "Lista de usuários", data: [] });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

## 2. Os Métodos REST (CRUD)

Uma API REST profissional deve mapear os verbos HTTP para as ações de banco de dados. Não use `POST` para obter dados, nem `GET` para excluí-los.

| Verbo HTTP | Operação CRUD | Rota Exemplo |
| :--- | :--- | :--- |
| **GET** | Leitura (Read) | `/api/usuarios` (Todos) |
| **GET** | Leitura (Read) | `/api/usuarios/:id` (Apenas um) |
| **POST** | Criação (Create) | `/api/usuarios` |
| **PUT** | Atualização Total | `/api/usuarios/:id` |
| **PATCH** | Atualização Parcial | `/api/usuarios/:id` |
| **DELETE** | Exclusão (Delete) | `/api/usuarios/:id` |

### Exemplo Prático de POST

```javascript
app.post('/api/usuarios', (req, res) => {
  // req.body contém o JSON enviado do Frontend (React/Angular)
  const { nome, email } = req.body;
  
  if (!nome || !email) {
    // 400 Bad Request
    return res.status(400).json({ erro: "Faltam campos obrigatórios" });
  }

  // Lógica de banco de dados aqui...

  // 201 Created
  res.status(201).json({ mensagem: "Usuário criado com sucesso" });
});
```

## 3. Parametrização de Rotas (Params vs Queries)

É crucial entender como o frontend envia dados para você pela URL.

* **Req.Params (`/api/usuarios/5`):** Identificadores únicos.
  ```javascript
  app.get('/api/usuarios/:id', (req, res) => {
    console.log(req.params.id); // "5"
  });
  ```
* **Req.Query (`/api/usuarios?rol=admin&idade=25`):** Filtros, buscas e paginação.
  ```javascript
  app.get('/api/usuarios', (req, res) => {
    console.log(req.query.rol); // "admin"
  });
  ```

Agora você sabe criar as rotas, mas colocar tudo em um único arquivo `index.js` cria código espaguete. No **Nível Médio**, aprenderemos a estruturar a arquitetura por Camadas (Routes, Controllers, Services) e o conceito mais vital do Express: Os Middlewares.
