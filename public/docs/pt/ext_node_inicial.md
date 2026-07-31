# Arquitetura Event-Driven e o V8 Engine

Bem-vindo ao lado do servidor com JavaScript. O Node.js revolucionou o desenvolvimento web não por ser uma nova linguagem, mas por levar o motor V8 do Google Chrome para o backend, acoplado com um loop de eventos (Event Loop) assíncrono e não bloqueante.

## 1. O Mito da "Single Thread"

Diz-se comumente que o Node.js é "Single Threaded" (de uma única thread). Esta é uma meia verdade.

* **A Thread Principal (Main Thread):** Executa o seu código JavaScript.
* **O Thread Pool (libuv):** O Node delega as tarefas pesadas (I/O, compressão, criptografia, rede) para um pool de threads oculto gerenciado pela biblioteca `libuv` escrita em C++.

```mermaid
graph TD
    Cliente[Cliente HTTP] -->|Requisição| MainThread[Main Thread (V8)]
    MainThread -->|É código JS puro| Ejecucion[É executado instantaneamente]
    MainThread -->|"É leitura de Arquivo/DB"| EventLoop[Event Loop]
    
    EventLoop -->|Delega| Libuv[libuv Thread Pool (C++)]
    Libuv -->|Thread 1| Disco[(Sistema de Arquivos)]
    Libuv -->|Thread 2| DB[(Banco de Dados)]
    
    Disco -->|Termina| CallbackQueue[Fila de Callbacks]
    DB -->|Termina| CallbackQueue
    
    CallbackQueue -->|Devolve à thread principal| MainThread
```

## 2. Bloqueando o Event Loop (O Pecado Capital)

Como há apenas uma Main Thread para o seu código, se você executar uma operação matemática gigante ou um loop `while` infinito, **todo o servidor congela**. Nenhum outro usuário poderá fazer login ou carregar dados.

```javascript
// ❌ PERIGO: Código Bloqueante (Síncrono)
app.get('/hash', (req, res) => {
  // Enquanto lê este arquivo de 2GB, o Node.js não pode responder a mais ninguém.
  const data = fs.readFileSync('/arquivo-gigante.mp4'); 
  res.send('Concluído');
});

// ✅ CORRETO: Código Não Bloqueante (Assíncrono)
app.get('/hash', async (req, res) => {
  // O Node envia a tarefa ao libuv e continua atendendo outras requisições HTTP
  const data = await fs.promises.readFile('/arquivo-gigante.mp4');
  res.send('Concluído');
});
```

## 3. Node não é para CPU-Intensive

Se você precisa processar vídeo, treinar modelos de Inteligência Artificial ou renderizar 3D, o Node.js é a ferramenta errada. Para tarefas intensivas de CPU, Python (com bibliotecas em C), Rust ou Go são superiores.
O Node.js é o REI absoluto em aplicativos **I/O Intensive** (Entrada/Saída): Chats em tempo real, APIs REST, streaming de dados e microsserviços.

## Próximos Passos
Entendemos como o Node.js respira. No **Nível Básico**, deixaremos a teoria e criaremos nosso primeiro servidor HTTP utilizando o framework que domina 90% do mercado: Express.js.
