# Evolução do Controle de Acesso

Dos modelos clássicos aos padrões modernos.

## RBAC x ABAC
- **RBAC (baseado em função):** Permissões vinculadas a funções estáticas. Problema: Explosão de papéis.
- **ABAC (Baseado em Atributos):** Permissões vinculadas a atributos booleanos.

## Fundamentos do NGAC (controle de acesso de última geração)
Padrão NIST. Use um gráfico algébrico. Usuários e objetos são conectados por meio de atributos e associações.

```sereia
gráfico TD
  UA[Atributo do usuário] -->|Atribuído| Você[Usuário]
  OA[Atributo do Objeto] -->|Atribuído| O[Objeto]
  UA -->|"Ler/Escrever"| O.A.
```

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

