# Segurança da camada de dados (RLS)

A Segurança em Nível de Linha (RLS) transfere a lógica de filtragem de locatário do aplicativo diretamente para o banco de dados.

## Vantagens do RLS no Postgres
Qualquer consulta maliciosa que faça `SELECT * FROM faturas` sem um ID de locatário retornará 0 linhas.

## Governança e Política
As políticas RLS são habilitadas usando `ALTER TABLE faturas ENABLE ROW LEVEL SECURITY;`.

```sereia
gráfico TD
  A[Consulta: SELECT * FROM usuários] --> B{Política RLS}
  B -->|Correspondência de ID do locatário| C[Retorna 10 linhas]
  B -->|Sem correspondência| D[Retorna 0 linhas]
```

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

