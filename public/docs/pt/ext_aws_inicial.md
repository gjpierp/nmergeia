# Cloud Computing e Arquitetura sem Servidores

Bem-vindo à Nuvem. Durante décadas, hospedar um aplicativo significava alugar servidores físicos (Bare-Metal). Depois passamos para Máquinas Virtuais (EC2) e Contêineres (Docker). Hoje, o auge da evolução é o **Serverless**.

## 1. O que significa "Serverless"?

Serverless (Sem Servidor) não significa que os servidores desapareceram magicamente. Significa que **o gerenciamento, a escalabilidade e a manutenção dos servidores são completamente invisíveis para você.**

```mermaid
graph LR
    Usuario[Usuário] -->|Request HTTP| API[API Gateway]
    API -->|Desencadeia| Lambda[AWS Lambda (Código)]
    Lambda -->|Consulta| DB[(DynamoDB)]
    
    subgraph sub_1 ["Não gerencia Sistema Operacional, nem Patches, nem RAM"]
        API
        Lambda
        DB
    end
```

### Vantagens Radicais
* **Pagamento por Uso Real:** Se o seu aplicativo tiver 0 usuários no fim de semana, você paga exatamente $0.00. (Ao contrário de um VPS que cobra 24/7).
* **Escalonamento Infinito e Instantâneo:** Se você passar de 10 usuários para 10.000 em um segundo, a AWS clonará seu código milhares de vezes automaticamente, sem que você faça absolutamente nada.
* **Manutenção Zero:** Você nunca terá que atualizar a versão do Linux ou instalar um patch de segurança do Kernel.

## 2. Os Pilares do AWS Serverless

O ecossistema Serverless da AWS é construído com três blocos de montar fundamentais:

| Serviço | Função | Analogia Tradicional |
| :--- | :--- | :--- |
| **API Gateway** | O Porteiro. Recebe requisições HTTP, valida Auth e roteia. | Nginx / Apache / Express Router |
| **AWS Lambda** | O Cérebro. Executa seu código (Node.js, Python, Go) por milissegundos. | Seu Controlador / Lógica de Negócios |
| **DynamoDB** | A Memória. Banco de dados NoSQL de latência de 1 milissegundo. | MongoDB / PostgreSQL |

## 3. A Mudança de Paradigma no Código

Em um servidor Node.js tradicional, você inicia o servidor escutando em uma porta (`app.listen(3000)`). No Serverless, **o seu código fica "adormecido"** até que um evento o acorde.

```javascript
// É assim que se parece uma AWS Lambda. Não há servidor, apenas uma função pura.
export const handler = async (event) => {
  // O 'event' contém tudo o que o API Gateway recebeu (Headers, Body)
  console.log("Evento Recebido:", event.body);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ mensagem: "Olá da Nuvem Serverless!" }),
  };
};
```

## Próximos Passos
Entendemos que Serverless é execução por eventos (Event-Driven Computing). No **Nível Básico**, exploraremos profundamente o AWS Lambda, suas restrições de tempo e o conceito de "Cold Start" (Início a frio).
