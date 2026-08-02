# Infraestrutura como Código e Imutabilidade (IaC & Terraform)

**Infrastructure as Code (IaC)** é a prática fundamental de DevOps para provisionar e gerenciar infraestrutura por meio de código declarativo auditável.

## 1. Paradigma Declarativo

Com o **Terraform**, você declara o estado desejado da infraestrutura em código HCL.

```mermaid
flowchart TD
subgraph sub_1 ["Desenvolvimento & Git"]
Git["Repositório Git (HCL)"] -->|Merge| CI["Pipeline CI/CD"]
end

subgraph sub_2 ["Motor Terraform"]
CI -->|terraform init| Init["Download de Provedores"]
Init -->|terraform plan| Plan["Cálculo do Diff (Plan)"]
Plan -->|terraform apply| Lock["Bloqueio de Estado (DynamoDB)"]
end

subgraph sub_3 ["Infraestrutura em Nuvem"]
Lock -->|Provisionamento| S3["Estado Remoto (Amazon S3)"]
Lock -->|Recursos| Infra["VPC + Subnets + EC2 + K8s"]
end
```

## 2. Ciclo de Vida do Terraform

```bash
terraform init
terraform plan
terraform apply -auto-approve
terraform destroy
```

## 3. Estado Remoto e Bloqueio (S3 + DynamoDB)

```hcl
terraform {
  backend "s3" {
    bucket         = "nmerge-terraform-state-prod"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "nmerge-terraform-locks"
    encrypt        = true
  }
}
```
