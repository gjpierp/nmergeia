# Ingestão de dados e consistência distribuída

Microsserviços requerem coreografia e orquestração.

## Padrão Saga
Quando uma transação distribuída falha, o padrão Saga executa ações de *compensação* para reverter para outros microsserviços.

## ETL versus ELT
- **ETL:** Transformação no barramento.
- **ELT:** Transformação massiva no Data Warehouse (por exemplo, Snowflake/BigQuery).

```sereia
gráfico LR
  A[Serviço de Pedido] -->|Criar| B[Serviço de Pagamento]
  B -->|Falha| C[Serviço de Inventário]
  C -->|Compensar| Um
```

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

