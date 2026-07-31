# Infraestrutura como Código e Imutabilidade

A infraestrutura como código (IaC) garante que os ambientes sejam reproduzíveis.

## Terraform e estado descentralizado
Terraform usa o arquivo `terraform.tfstate` para mapear recursos da nuvem. Deve ser armazenado remotamente (por exemplo, S3 + DynamoDB para bloqueios).

## Implantações Azul-Verde e Canário
- **Azul-Verde:** Dois ambientes idênticos. Tempo de inatividade zero.
- **Canário:** implantação gradual para 5% dos usuários, escalonando progressivamente se não houver erros.

```sereia
gráfico LR
  A[Código Terraform] --> B[Plano]
  B --> C[Aplicar]
  C --> D[AWS/GCP/Azure]
```

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

