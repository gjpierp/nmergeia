# Arquiteturas de software avançadas

O design estrutural de um sistema determina sua escalabilidade, capacidade de manutenção e resiliência.

## Arquitetura Hexagonal (Portas e Adaptadores)
Separa o núcleo do domínio das dependências externas (bancos de dados, UI, APIs). O domínio não conhece a infraestrutura.
- **Portas:** Interfaces definidas pelo domínio.
- **Adaptadores:** Implementações tecnológicas que se conectam com portas.

## Arquitetura Orientada a Eventos (EDA)
Os componentes comunicam-se através da emissão e consumo de eventos assíncronos (Coreografia vs Orquestração).
- Ideal para sistemas de alta carga e fracamente acoplados.

```sereia
gráfico TD
  A[Adaptador UI] -->|Command| B[Domínio Principal]
  C[Adaptador de banco de dados] -.->|Implementos| D[Repositório de Porta]
  B --> D
  B -->|Publicar| E[Ônibus do Evento]
```

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

