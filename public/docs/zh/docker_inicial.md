# Docker 初级：容器的配置和架构

欢迎来到容器革命。Docker 不仅仅是一个虚拟化工具；它在软件打包、分发和运行方式上带来了范式的转变。“在我的机器上能运行”的时代已经一去不复返了。

## 1. 虚拟化 vs 容器化

为了理解 Docker，我们首先必须了解它解决了传统虚拟机（VMs）面临的什么问题。

### 比较架构图

```mermaid
graph TD
    subgraph sub_1 [传统虚拟机]
        HW1[物理服务器 / 硬件] --> Hyper[Hypervisor (VMware / Hyper-V)]
        Hyper --> VM1[VM 1: 完整的客户操作系统 + App A]
        Hyper --> VM2[VM 2: 完整的客户操作系统 + App B]
    end

    subgraph sub_2 [Docker 容器]
        HW2[物理服务器 / 硬件] --> SO[宿主操作系统 Host]
        SO --> Engine[Docker Engine]
        Engine --> C1[容器: 二进制文件/库 + App A]
        Engine --> C2[容器: 二进制文件/库 + App B]
    end
```

**根本区别：** 虚拟机虚拟化了所有的*硬件*，安装了一个完整的操作系统（SO）（重达 GB 级别，启动需要几分钟）。而 Docker 使用 Linux 内核的 namespaces 和 cgroups 来虚拟化*操作系统*。所有的容器共享同一个内核，这使得它们的体积只有 MB 级别，且在毫秒内就能启动。

## 2. 零摩擦安装

根据你的操作系统，安装方法会有所不同，但在开发环境中的行业标准是 **Docker Desktop**（适用于 Windows/Mac），在 Linux 上则是原生的 **Docker Engine**。

### 验证环境
打开你的终端并执行：

```bash
docker version
```
如果你看到了客户端（Client）的信息，但在服务器（Server 或 Daemon）部分收到了错误信息，这说明 Docker 引擎没有在后台运行。在继续之前，请启动 Docker 服务。

## 3. 你的第一个容器：经典的 NGINX

我们还不会编写代码；我们将使用一个现成的镜像来理解它的生命周期。

```bash
# 在后台运行一个 Web 服务器，将容器的 80 端口映射到宿主机的 8080 端口
docker run -d --name mi-servidor-web -p 8080:80 nginx:alpine
```

### 命令剖析：
* `run`：命令引擎在本地查找该镜像。如果不存在，它将从 Docker Hub 下载，创建一个容器并启动它。
* `-d` (Detached)：在后台运行容器，释放你的终端。
* `--name`：分配一个可读的名称。如果你省略这一步，Docker 将分配一个随机名称，如 `jolly_turing`。
* `-p 8080:80`：端口映射。到达你 `localhost:8080` 的流量将被重定向到容器内部的 `80` 端口。
* `nginx:alpine`：要使用的镜像。`alpine` 是一种超轻量级的 Linux 变体（约 5MB），为了安全和速度，每一位云架构师都应该首选它。

在你的浏览器中访问 `http://localhost:8080`。如果你看到了 NGINX 的欢迎页面，说明你已经成功部署了你的第一个容器。

## 后续步骤
我们已经掌握了如何使用现成的镜像。在**基础级别**，我们将不再是消费者，而是成为创造者：我们将学习编写我们自己的 `Dockerfile` 并打包我们自己的 Node.js/Python 应用程序。
