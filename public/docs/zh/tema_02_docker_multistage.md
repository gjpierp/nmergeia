# 多阶段 Docker 和容器策略

减少攻击面和 Docker 镜像的重量（至 <50MB）是 DevSecOps 的一个关键目标。

## 多阶段构建
它允许您在重型映像（例如“node:18-alpine”）中编译代码，并仅将生成的二进制文件或静态数据移动到 distroless 或超轻映像（例如“nginx:alpine”）。

## 用于本地编排的 Docker Compose
“docker-compose.yml”文件可以轻松设置隔离的虚拟网络。

````美人鱼
图解TD
  A[第 1 阶段：构建] -->|复制二进制文件| B[第 2 阶段：无 Distroless]
  B --> C[图像 < 50MB]
  C --> D[安全部署]
````

> [!NOTE]
> 白皮书的其余部分保留其原始语言，以保留代码和图表的语法。

