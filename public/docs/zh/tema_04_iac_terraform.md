# 基础设施即代码与不可变性 (IaC & Terraform)

**基础设施即代码 (IaC)** 是通过声明性代码自动化配置和管理云基础架构的核心 DevOps 实践。

## 1. 声明式架构

```mermaid
flowchart TD
subgraph sub_1 ["开发与版本控制"]
Git["Git 仓库 (HCL)"] -->|Merge| CI["CI/CD 流水线"]
end

subgraph sub_2 ["Terraform 引擎"]
CI -->|terraform init| Init["下载 Provider"]
Init -->|terraform plan| Plan["生成变更计划 (Plan)"]
Plan -->|terraform apply| Lock["状态锁 (DynamoDB)"]
end

subgraph sub_3 ["不可变云架构"]
Lock -->|自动配置| S3["远程状态 (Amazon S3)"]
Lock -->|资源| Infra["VPC + 子网 + EC2 + K8s"]
end
```

## 2. Terraform 生命周期

```bash
terraform init
terraform plan
terraform apply -auto-approve
terraform destroy
```

## 3. 远程状态与并发锁 (S3 + DynamoDB)

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
