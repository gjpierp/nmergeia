# Docker 大师：架构模式、私有 Registry 和可扩展性

我们来到了技术的顶点。在大师级别，单独的容器和本地环境不再是焦点。现在我们考虑的是分布式生态系统、CI/CD、镜像的全局分发以及诸如 Sidecars 和 Daemons 之类的高级架构模式。

## 1. Sidecar 模式：解耦架构

一个容器应该**只做一件事，并把它做到完美**。
如果你有一个过时的 (Legacy) API，它将日志保存在文本文件中，但你的 SRE (站点可靠性工程师) 团队要求将日志实时发送到 Datadog 或 ElasticSearch，那该怎么办？

修改旧代码是很危险的。架构上的解决方案是 **Sidecar**（边车）模式。

### Sidecar 的实现

我们在同一个网络（或 Kubernetes 中的同一个 Pod）中附加一个辅助容器，共享一个物理卷。

```mermaid
graph LR
    subgraph sub_1 [Docker 任务 / Kubernetes Pod]
        Legacy[Legacy 应用程序 (容器 A)] -->|写入 logs.txt| Volume[(共享卷)]
        Volume -->|读取 logs.txt| Fluentd[Fluentd / Logstash (容器 B)]
    end
    
    Fluentd -->|HTTP 异步流| Cloud(ElasticSearch / Datadog)
```

在这种模式中，Legacy 容器完全不知道自己正在被监控。Fluentd 容器 (Sidecar) 捕获该文件，对其进行转换并将其发送到云端。我们没有触碰一行旧的源代码，就实现了现代化的可观测性。

## 2. 治理你自己的 Docker Registry

当你在严格的法律合规要求下（如金融科技、医疗保健、国防）运营时，你不能依赖 Docker Hub 等公共存储库，也不能将你公司的专有源代码上传到未经审查的共享存储库中。

### 搭建安全私有的 Registry

你必须部署自己的 **Registry**。官方分发的核心组件本身也是一个容器：

```yaml
services:
  private-registry:
    image: registry:2
    ports:
      - "5000:5000"
    environment:
      REGISTRY_AUTH: htpasswd
      REGISTRY_AUTH_HTPASSWD_REALM: "Registry Realm"
      REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
      REGISTRY_STORAGE_DELETE_ENABLED: true
    volumes:
      - ./auth:/auth
      - registry_data:/var/lib/registry
```

一旦部署完毕，持续集成 (CI) 流水线必须为镜像打上标签 (Tag) 以指向你们公司的域名，并使用 **Docker Content Trust** 进行签名，以防止供应链攻击 (Supply Chain Attacks)。

```bash
# 1. Pipeline 构建并对镜像签名
export DOCKER_CONTENT_TRUST=1
docker build -t registry.miempresa.com/api-pagos:v1.0.4 .

# 2. 将密码学签名的镜像推送到中央服务器
docker push registry.miempresa.com/api-pagos:v1.0.4
```

## 3. 为跃迁至 Kubernetes 做准备

Docker Compose 在本地开发和单个物理服务器上的适度部署中表现出色。但当你需要高可用性 (HA)、零停机更新 (Zero-Downtime Deployments) 以及跨数十台服务器（节点）的自动负载均衡时，仅靠 Docker 是不够的。

你必须将控制权移交给一个 3 级编排器（Orchestrator）。
你对 *Dockerfiles、多阶段构建 (Multi-Stage)、Cgroups 和卷* 的详尽知识，正是 **Kubernetes (K8s)** 所要求的基础知识。在 K8s 中，一个容器仍然是一个 Docker (或 containerd) 容器；我们只是将其包装在一个被称为 `Pod` 的逻辑概念中，并将其生命周期委托给主控制平面。

**恭喜你！** 你已经从基础虚拟化理论扩展到企业级容器工程。你的基础设施现在是不可变的、高度优化的并得到了铁甲般的保护。
