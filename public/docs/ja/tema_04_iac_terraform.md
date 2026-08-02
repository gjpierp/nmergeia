# コードとしてのインフラストラクチャと不可変性 (IaC & Terraform)

**Infrastructure as Code (IaC)** は、宣言型コードを使用してクラウドインフラを自動化・管理するDevOpsの標準手法です。

## 1. 宣言型アーキテクチャ

```mermaid
flowchart TD
subgraph sub_1 ["開発とGit"]
Git["Gitリポジトリ (HCL)"] -->|Merge| CI["CI/CD パイプライン"]
end

subgraph sub_2 ["Terraform エンジン"]
CI -->|terraform init| Init["Providerのダウンロード"]
Init -->|terraform plan| Plan["差分プランの生成"]
Plan -->|terraform apply| Lock["ステートロック (DynamoDB)"]
end

subgraph sub_3 ["クラウドインフラ"]
Lock -->|プロビジョニング| S3["リモートステート (Amazon S3)"]
Lock -->|リソース| Infra["VPC + Subnets + EC2 + K8s"]
end
```

## 2. Terraform ライフサイクル

```bash
terraform init
terraform plan
terraform apply -auto-approve
terraform destroy
```

## 3. リモートステートと排他ロック (S3 + DynamoDB)

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
