# nível de especialista

> [!CUIDADO]
> O NGAC em escala empresarial exige controle rígido sobre o desempenho (latência) e a disponibilidade do ponto de decisão política (PDP).

## Arquitetura Distribuída NGAC

Em sistemas Cloud Native, você não pode permitir que o PDP se torne um gargalo ou ponto único de falha (SPOF). 

### Fragmentação e cache de gráfico

```sereia
gráfico TD
    API[API Gateway] --> PEP[Ponto de aplicação de política]
    
    PEP -> CACHE[(Redis/Memcached)]
    
    CACHE -- "Cache Miss" --> PDP[Ponto de decisão da política NGAC]
    
    PDP -> GDB[(Banco de dados gráfico - Neo4j / ArangoDB)]
    
    PIP[Ponto de Informação da Política] -->|Atualizar Contexto| PDP
```

Para garantir latências inferiores a 10 ms:
1. **Cache de nível PEP:** Memorize os resultados da autorização por alguns minutos se as políticas não forem muito voláteis (Memoização).
2. **Graph DB:** Use bancos de dados gráficos nativos (por exemplo, Neo4j, Amazon Neptune) para evitar o caro `JOIN` recursivo exigido pelo SQL.

## Auditoria Contínua e Conformidade

NGAC brilha em análise regulatória (Compliance). Você pode executar algoritmos de "Revisão" para detectar vulnerabilidades nas configurações de política.

> [!NOTA]
> Com uma consulta Cypher no Neo4j, você pode provar matematicamente que **"Nenhum usuário externo possui um caminho que se conecta a um objeto marcado com PII"**, oferecendo garantias formais aos auditores.

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

