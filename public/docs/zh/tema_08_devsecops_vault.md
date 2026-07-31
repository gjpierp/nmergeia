# 安全秘密管理和 DevSecOps

硬编码秘密是一个严重的漏洞。 Swarm AI 禁止泄露凭证。

## HashiCorp 金库
动态存储。 Vault 可以生成临时凭证（例如 1 小时后过期的数据库用户）。

## SAST/DAST 集成
- **SAST：** CI 管道中的静态分析。
- **DAST：** 攻击暂存中容器的动态测试。

````美人鱼
图LR
  A[提交] --> B[SonarQube/SAST]
  B --> C{这会发生吗？}
  C -->|否| D[CI 拒绝]
  C -->|是| E[部署到暂存]
  E --> F[DAST Owasp ZAP]
````

> [!NOTE]
> 白皮书的其余部分保留其原始语言，以保留代码和图表的语法。

