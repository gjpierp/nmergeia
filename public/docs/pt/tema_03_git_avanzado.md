# Fluxos de trabalho Git avançados

A colaboração em escala requer estratégias de ramificação eficientes.

## Desenvolvimento baseado em tronco vs GitFlow
- **Baseado em tronco:** Integração contínua direta com `main`. Requer *Feature Flags* e TDD estrito. Reduz conflitos.
- **GitFlow:** Ideal para lançamentos com versões restritas (`develop`, `release`, `main`).

## Git Hooks e Husky
Husky permite que você execute scripts antes de enviar o código (por exemplo, Linting, Prettier, Unit Testing).

```sereia
gitGraph
  comprometer
  recurso de filial/A
  recurso de checkout/A
  comprometer
  check-out principal
  recurso de mesclagem/A
  id de commit: tag "v1.0": "lançamento"
```

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

