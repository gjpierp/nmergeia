# Middlewares, Controladores e Arquitetura em Camadas

Colocar toda a sua lógica de negócios (consultas SQL, validações, envio de e-mails) diretamente dentro do `app.get()` é o pior antipadrão no Express. O código torna-se intestável e caótico.

## 1. O Padrão MVC / Arquitetura de Camadas

Você deve separar as responsabilidades. A camada de rotas apenas roteia, o controlador extrai dados da requisição HTTP e o serviço executa a matemática ou o banco de dados.

```mermaid
graph LR
    Cliente[Cliente / React] -->|Requisição HTTP| Routes[Rotas (Router)]
    Routes -->|Delega| Controller[Controlador]
    Controller -->|Extrai req.body| Service[Camada de Serviço]
    Service -->|Consulta| DB[(Banco de Dados)]
    
    DB --> Service
    Service -->|Resultado Puro| Controller
    Controller -->|"res.status(200)"| Cliente
```

## 2. O Coração do Express: Os Middlewares

Um Middleware é simplesmente uma função que é executada **no meio**, ou seja, depois que a requisição chega, mas antes de chegar ao seu Controlador.

Eles são o mecanismo perfeito para validações, segurança, logs e autenticação. Eles têm acesso a `req`, `res` e à função mágica `next()`.

```javascript
// Middleware de Autenticação
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ erro: "Não autorizado, falta token" });
  }

  // Se o token for válido, passamos a bola para o próximo elo
  if (token === "TOKEN_SECRETO") {
    next(); 
  } else {
    return res.status(403).json({ erro: "Token inválido" });
  }
};

// Injetando o middleware na rota protegida
app.get('/api/dados-privados', verificarToken, (req, res) => {
  res.json({ segredo: "A fórmula da Coca-Cola" });
});
```

## 3. Tratamento Global de Erros (A Rede de Segurança)

Em vez de colocar um `try/catch` e responder com um erro 500 em CADA controlador, os especialistas usam um **Middleware de Tratamento de Erros**. 
No Express, se você declarar um middleware com 4 parâmetros `(err, req, res, next)`, o Express saberá que é um interceptor global de erros.

```javascript
// Controlador (Simulando uma falha assíncrona)
app.get('/api/falha', async (req, res, next) => {
  try {
    throw new Error("Banco de dados em colapso");
  } catch (error) {
    next(error); // Enviamos o erro para o manipulador global
  }
});

// Middleware Global de Erros (Sempre no final do seu arquivo index.js)
app.use((err, req, res, next) => {
  console.error(err.stack); // Salvamos log no servidor
  res.status(500).json({ 
    mensagem: "Erro interno do servidor", 
    detalhes: err.message 
  });
});
```

Essa arquitetura o levará longe, mas hoje em dia usar Express sem Tipagem estrita é um risco corporativo. No **Nível Avançado**, daremos o salto para o NestJS ou migraremos o Express para TypeScript (POO) com injeção de dependências.
