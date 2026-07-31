# Migração e interoperabilidade entre bancos de dados

Estratégias para sair de bancos de dados legados ou locais (por exemplo, Oracle para Postgres).

## Ferramentas de migração
Utilização de *AWS SCT (Schema Conversion Tool)* e *DMS (Data Migration Service)* para replicação de CDC (Change Data Capture).

## Estratégia do Figo Estrangulador
Migrar tabela para tabela. O aplicativo grava duplamente até que a integridade seja confirmada.

```sereia
gráfico TD
  A[Aplicativo monolítico] -> B[Oracle DB]
  A --> C[Novo microsserviço]
  C --> D[PostgreSQL]
  B-. Sincronização CDC .-> D
```

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

