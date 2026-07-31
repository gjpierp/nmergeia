# Tomada de Requisitos Avançados e DDD

A captura eficaz de requisitos é a base de um produto de sucesso, afastando-se de documentos estáticos em direção à descoberta colaborativa.

## Design Orientado a Domínio (DDD)
Abordagem que unifica o modelo mental do negócio com o código através da *Ubiquitous Language* (Linguagem Ubíqua).
- **Contextos limitados:** Limites explícitos onde os termos têm um único significado.

## Tempestade de Eventos
Técnica de workshop visual (usando post-its) para modelar fluxos de negócios complexos identificando *Eventos de Domínio*, *Comandos* e *Agregações*.

```sereia
gráfico LR
  A[Comando: Criar pedido] --> B[Adicionar: Pedido]
  B --> C[Evento: Pedido Criado]
  C --> D[Política: Notificar Remessa]
  D --> E[Comando: Enviar e-mail]
```

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

