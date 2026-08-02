import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..', '..');

const DOCS_DIR = path.join(projectRoot, 'public', 'docs');

const iacTranslations = {
  en: `# Infrastructure as Code & Immutability (IaC & Terraform)

**Infrastructure as Code (IaC)** is the foundational DevOps and Cloud Engineering practice of provisioning, configuring, and managing IT infrastructure (servers, networks, databases, load balancers) via auditable, reproducible, and immutable code, replacing manual web console configurations (*ClickOps*).

## 1. Declarative Paradigm & Immutability

Unlike traditional step-by-step imperative scripting (Bash or PowerShell), **Terraform** uses a **Declarative** approach: you define the *DESIRED STATE* of your architecture, and the engine automatically calculates the diff against real cloud resources.

### Declarative Provisioning Flowchart

` + '```' + `mermaid
flowchart TD
subgraph sub_1 ["Development & Version Control"]
Git["Git Repository (HCL Code)"] -->|Pull Request / Merge| CI["CI/CD Pipeline (GitHub Actions / GitLab)"]
end

subgraph sub_2 ["HashiCorp Terraform Engine"]
CI -->|terraform init| Init["Download Providers (AWS, Azure, GCP)"]
Init -->|terraform plan| Plan["Generate Diff Plan"]
Plan -->|terraform apply| Lock["Acquire State Lock (DynamoDB)"]
end

subgraph sub_3 ["Immutable Cloud Infrastructure"]
Lock -->|API Provisioning| S3["Remote State Backend (Amazon S3)"]
Lock -->|Deploy Resources| Infra["VPC + Subnets + EC2 + RDS + K8s"]
end
` + '```' + `

## 2. Terraform Lifecycle

The standard infrastructure engineering workflow consists of 4 essential commands:

` + '```' + `bash
# 1. Initialize working directory & download provider plugins
terraform init

# 2. Preview changes & calculate diff against real infrastructure
terraform plan

# 3. Apply changes and provision resources
terraform apply -auto-approve

# 4. Safely destroy temporary test environments
terraform destroy
` + '```' + `

## 3. Remote State & Atomic Locking (S3 + DynamoDB)

The \`terraform.tfstate\` file maps declared code resources to actual cloud IDs.

* **Anti-pattern:** Storing state locally or committing to Git (exposes secrets and causes state corruption).
* **Enterprise Best Practice:** Store state encrypted in **Amazon S3** with atomic concurrency locking via **Amazon DynamoDB**.

### Example \`backend.tf\` Configuration:

` + '```' + `hcl
terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "nmerge-terraform-state-prod"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "nmerge-terraform-locks"
    encrypt        = true
  }
}
` + '```' + `

## 4. Reusable Production Modules

Modules encapsulate resource sets to promote code reuse and standardize security policies.

` + '```' + `hcl
# Reusable Web App Infrastructure Module
module "production_web_server" {
  source             = "./modules/web_infrastructure"
  environment        = "production"
  instance_type      = "t3.medium"
  min_size           = 2
  max_size           = 10
  enable_autoscaling = true

  tags = {
    Project   = "NMerge AI"
    ManagedBy = "Terraform"
  }
}
` + '```' + `
`,
  de: `# Infrastruktur als Code & Unveränderlichkeit (IaC & Terraform)

**Infrastructure as Code (IaC)** ist die grundlegende DevOps-Praxis zur Bereitstellung und Verwaltung von IT-Infrastrukturen über deklarativen Code.

## 1. Deklaratives Paradigma

Im Gegensatz zu imperativen Skripten definiert **Terraform** den *SOLL-ZUSTAND* Ihrer Architektur.

` + '```' + `mermaid
flowchart TD
subgraph sub_1 ["Entwicklung & Git"]
Git["Git Repository (HCL)"] -->|Merge| CI["CI/CD Pipeline"]
end

subgraph sub_2 ["Terraform Engine"]
CI -->|terraform init| Init["Download Provider"]
Init -->|terraform plan| Plan["Berechne Diff Plan"]
Plan -->|terraform apply| Lock["State Lock (DynamoDB)"]
end

subgraph sub_3 ["Cloud Infrastruktur"]
Lock -->|Provisionierung| S3["Remote State (Amazon S3)"]
Lock -->|Ressourcen| Infra["VPC + Subnets + EC2 + K8s"]
end
` + '```' + `

## 2. Terraform Lebenszyklus

` + '```' + `bash
terraform init
terraform plan
terraform apply -auto-approve
terraform destroy
` + '```' + `

## 3. Remote State & Locking (S3 + DynamoDB)

` + '```' + `hcl
terraform {
  backend "s3" {
    bucket         = "nmerge-terraform-state-prod"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "nmerge-terraform-locks"
    encrypt        = true
  }
}
` + '```' + `
`,
  fr: `# Infrastructure en tant que Code & Immuabilité (IaC & Terraform)

**Infrastructure as Code (IaC)** est la pratique clé du DevOps pour approvisionner et gérer les infrastructures via du code source.

## 1. Paradigme Déclaratif

**Terraform** utilise une approche déclarative où vous définissez l'état souhaité de votre infrastructure.

` + '```' + `mermaid
flowchart TD
subgraph sub_1 ["Développement Git"]
Git["Dépôt Git (HCL)"] -->|Merge| CI["Pipeline CI/CD"]
end

subgraph sub_2 ["Moteur Terraform"]
CI -->|terraform init| Init["Téléchargement Providers"]
Init -->|terraform plan| Plan["Génération du Plan"]
Plan -->|terraform apply| Lock["Verrouillage d'état (DynamoDB)"]
end

subgraph sub_3 ["Infrastructure Cloud"]
Lock -->|Provisionnement| S3["État Distant (Amazon S3)"]
Lock -->|Ressources| Infra["VPC + Subnets + EC2 + K8s"]
end
` + '```' + `

## 2. Cycle de vie Terraform

` + '```' + `bash
terraform init
terraform plan
terraform apply -auto-approve
terraform destroy
` + '```' + `

## 3. État Distant & Verrouillage (S3 + DynamoDB)

` + '```' + `hcl
terraform {
  backend "s3" {
    bucket         = "nmerge-terraform-state-prod"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "nmerge-terraform-locks"
    encrypt        = true
  }
}
` + '```' + `
`,
  pt: `# Infraestrutura como Código e Imutabilidade (IaC & Terraform)

**Infrastructure as Code (IaC)** é a prática fundamental de DevOps para provisionar e gerenciar infraestrutura por meio de código declarativo auditável.

## 1. Paradigma Declarativo

Com o **Terraform**, você declara o estado desejado da infraestrutura em código HCL.

` + '```' + `mermaid
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
` + '```' + `

## 2. Ciclo de Vida do Terraform

` + '```' + `bash
terraform init
terraform plan
terraform apply -auto-approve
terraform destroy
` + '```' + `

## 3. Estado Remoto e Bloqueio (S3 + DynamoDB)

` + '```' + `hcl
terraform {
  backend "s3" {
    bucket         = "nmerge-terraform-state-prod"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "nmerge-terraform-locks"
    encrypt        = true
  }
}
` + '```' + `
`,
  zh: `# 基础设施即代码与不可变性 (IaC & Terraform)

**基础设施即代码 (IaC)** 是通过声明性代码自动化配置和管理云基础架构的核心 DevOps 实践。

## 1. 声明式架构

` + '```' + `mermaid
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
` + '```' + `

## 2. Terraform 生命周期

` + '```' + `bash
terraform init
terraform plan
terraform apply -auto-approve
terraform destroy
` + '```' + `

## 3. 远程状态与并发锁 (S3 + DynamoDB)

` + '```' + `hcl
terraform {
  backend "s3" {
    bucket         = "nmerge-terraform-state-prod"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "nmerge-terraform-locks"
    encrypt        = true
  }
}
` + '```' + `
`,
  ja: `# コードとしてのインフラストラクチャと不可変性 (IaC & Terraform)

**Infrastructure as Code (IaC)** は、宣言型コードを使用してクラウドインフラを自動化・管理するDevOpsの標準手法です。

## 1. 宣言型アーキテクチャ

` + '```' + `mermaid
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
` + '```' + `

## 2. Terraform ライフサイクル

` + '```' + `bash
terraform init
terraform plan
terraform apply -auto-approve
terraform destroy
` + '```' + `

## 3. リモートステートと排他ロック (S3 + DynamoDB)

` + '```' + `hcl
terraform {
  backend "s3" {
    bucket         = "nmerge-terraform-state-prod"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "nmerge-terraform-locks"
    encrypt        = true
  }
}
` + '```' + `
`
};

Object.entries(iacTranslations).forEach(([lang, text]) => {
  const filePath = path.join(DOCS_DIR, lang, 'tema_04_iac_terraform.md');
  fs.writeFileSync(filePath, text, 'utf-8');
  console.log(`✅ Actualizado tema_04_iac_terraform.md para [${lang}]`);
});
