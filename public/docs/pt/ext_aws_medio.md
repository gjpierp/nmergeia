# API Gateway e DynamoDB (A Pilha Serverless)

Ter código em execução no Lambda é inútil se o mundo não puder acessá-lo ou se você não puder salvar dados permanentemente. Aqui completamos a trindade Serverless.

## 1. Amazon API Gateway

O API Gateway atua como a porta da frente de sua casa. Ele expõe endpoints HTTP (`https://api.seu-dominio.com/usuarios`) e os vincula às suas funções Lambda.

### Benefícios Críticos
* **Proteção Anti-DDoS nativa:** Integrado ao AWS Shield.
* **Throttling (Limitação):** Você pode configurá-lo para rejeitar requisições se elas excederem 10.000 req/seg para proteger seu backend e seu orçamento.
* **Autenticação na Porta:** Pode validar tokens JWT (usando Amazon Cognito ou um Autorizador Lambda personalizado) *antes* de sequer acordar sua Lambda principal, economizando dinheiro.

```mermaid
graph LR
    Hacker[Atacante] -->|1M Requisições| API[API Gateway]
    API -->|"Rejeita 99% (Throttling)"| /dev/null
    API -->|Requisições Legítimas| Lambda[Lambda (Salva)]
```

## 2. Amazon DynamoDB: Banco de Dados Serverless

Se você conectar 10.000 Lambdas simultâneas a um PostgreSQL tradicional, derrubará o banco de dados por exceder o limite de conexões simultâneas (OOM - Out of Memory). Bancos de dados relacionais não nasceram para Serverless.

O **DynamoDB** é o banco de dados NoSQL proprietário da AWS. Não importa se você faz 10 requisições por segundo ou 10 milhões de requisições por segundo; sua latência permanecerá em um único dígito (~5 milissegundos).

### Conceitos-Chave do DynamoDB
Não existem Tabelas com "Relações" (JOINs). Tudo é projetado em torno de duas chaves:
1. **Partition Key (PK):** Decide em qual servidor físico da AWS os dados serão salvos.
2. **Sort Key (SK):** Classifica os dados dentro dessa partição física.

```json
// Exemplo de um Elemento (Item) no DynamoDB
{
  "PK": "USER#123",            // (Partition Key)
  "SK": "METADATA#123",        // (Sort Key)
  "nome": "Alice",
  "email": "alice@nmerge.ai",
  "assinatura": "PREMIUM"
}
```

### Operações Básicas do Node.js (AWS SDK v3)

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const body = JSON.parse(event.body);

  const command = new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: `USER#${body.id}`,
      SK: `METADATA#${body.id}`,
      nome: body.nome
    },
  });

  await docClient.send(command);
  
  return { statusCode: 201, body: "Usuário salvo no DynamoDB" };
};
```

## Próximos Passos
Criar esses recursos clicando no console da web da AWS (Click-Ops) é um pecado capital na indústria. No **Nível Avançado**, adotaremos a Infraestrutura como Código (IaC) usando Serverless Framework, SAM ou Terraform.
