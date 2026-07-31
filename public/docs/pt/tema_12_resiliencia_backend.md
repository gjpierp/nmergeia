# Resiliência de back-end e tolerância a falhas

Um sistema moderno não pressupõe que a rede seja confiável.

##Disjuntores
Se um microsserviço externo falhar continuamente, o loop “abre” retornando erros rápidos em vez de congelar os threads de execução.

## Limitação e limitação de taxa
Proteção contra DDOS e abuso. Algoritmos *Token Bucket* usando Redis.

```sereia
gráfico LR
  A[Cliente] --> B[API Gateway]
  B -->|Chamada lenta| C{Disjuntor}
  C -->|Abrir| D[Resposta substituta]
  C -->|Fechado| E[Serviço Real]
```

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

