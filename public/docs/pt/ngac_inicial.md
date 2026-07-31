# Nível Inicial

> [!NOTA]
> NGAC (Next Generation Access Control) é um modelo de controle de acesso padronizado pelo NIST projetado para superar as limitações do RBAC (Role-Based Access Control) e ABAC (Attribute-Based Access Control).

## O que é NGAC?

Ao contrário dos modelos tradicionais, o NGAC centraliza a gestão de políticas, expressando-as através de gráficos direcionados. No NGAC, tudo (usuários, objetos, operações) é um nó em um grafo, e o acesso é determinado encontrando um caminho válido do usuário até o objeto.

### NGAC versus modelos tradicionais

```sereia
gráfico TD
    A[Modelos Tradicionais] -> B(RBAC: Função -> Permissão)
    A -> C (ABAC: regras complexas e lentas)
    
    D[NGAC] --> E(Gráficos de Relacionamento)
    D -> F (Avaliação Linear e Rápida)
    
    B -.-> G[Difícil de dimensionar e auditar]
    C-.->G
    
    E -.-> H[Escalabilidade e Auditoria Natural]
    F-.->H
```

> [!TIP]
> Se o seu sistema precisar de políticas que mudam rapidamente (por exemplo, conceder acesso a um contratado apenas durante seu turno), o NGAC lida com isso naturalmente, simplesmente adicionando ou removendo arestas no gráfico.

## Principais benefícios
1. **Flexibilidade:** Permite emular RBAC, ABAC, MAC e DAC em um único modelo.
2. **Auditoria:** Responda à pergunta "Quem pode acessar este arquivo?" é uma consulta simples de passagem de gráfico.
3. **Desempenho:** bancos de dados gráficos modernos resolvem permissões em milissegundos.

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

