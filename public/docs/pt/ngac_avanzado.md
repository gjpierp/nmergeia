# Nível Avançado

> [!IMPORTANTE]
> Em um nível avançado, começamos a combinar vários gráficos, conhecidos como "Políticas" ou classes de políticas, e adicionamos atributos dinâmicos como hora ou localização (ABAC dentro do NGAC).

## Avaliações Condicionais

No NGAC avançado, um caminho no gráfico não é suficiente. Podemos vincular “Condições” a associações.

### Restrições de tempo e status

```sereia
gráfico TD
    U[Usuário: Caixa] -->|UA| Caixas (caixas de caixa)
    
    Caixas -- Podem Processar --> OA1 (Caixas Registradoras)
    
    Caixas -. Condição: Somente horário de trabalho .-> OA1
    
    O[Caixa 01] --> OA1
    O2[Caixa 02] --> OA1
```

Se o usuário “Caixa” tentar acessar o “Caixa 01” às 3h, o mecanismo NGAC encontra o caminho, mas a condição de limite falha. Portanto, o acesso é negado.

### Separação de Deveres (SoD)

O NGAC permite que você implemente facilmente o SoD declarando **Restrições de Banimento**. 
- Se Alice aprovar uma solicitação de compra, o gráfico gera dinamicamente um nó que **nega** a Alice o direito de assinar o cheque dessa mesma compra.

> [!TIP]
> Aproveitando os atributos dinâmicos de objetos, você pode isolar informações de forma granular sem precisar criar milhões de funções (Explosão de funções).

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

