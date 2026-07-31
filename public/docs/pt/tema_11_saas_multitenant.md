# Arquiteturas SaaS multilocatários e multilíngues

## Isolamento de dados
1. **Silo:** Um banco de dados por cliente (Caro, Seguro).
2. **Pool:** Todas as linhas na mesma tabela com `tenant_id` + RLS (Econômico).
3. **Bridge:** Um esquema por cliente no mesmo banco de dados.

## Localização global
Usando bibliotecas como `i18next` no React para lidar com dicionários dinâmicos assíncronos.

```sereia
gráfico TD
  A[API Gateway] --> B[Esquema do Locatário A]
  A --> C[Esquema do Locatário B]
  A --> D[Esquema C do Locatário]
```

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

