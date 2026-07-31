# Docker 高级：极限优化与多阶段构建（Multi-Stage Builds）

将 Docker 镜像推向生产环境要求与本地开发环境截然不同的严谨性。一个 1GB 大小、包含编译工具、本地存储库和暴露的源代码的镜像，在财务（传输成本）上是一颗定时炸弹，在网络安全方面也是一场噩梦。

在高级阶段，我们将掌握 Docker 中最重要的架构模式：**多阶段构建（Multi-Stage Builds）**。

## 1. 单体镜像的问题

假设你正在使用 Go 或 React 构建一个应用程序。为了创建可执行文件或静态文件，你需要下载 Go 编译器或整个 `node_modules` 包（其重量达数百兆字节）。

如果你在一个步骤中构建镜像，所有这些对生产无用的文件最终都会进入最终容器。

### 多阶段流程图

```mermaid
flowchart LR
    subgraph sub_1 [Stage 1: Build (构建器)]
        A[基础镜像 Node.js 18] --> B(安装 NPM Packages)
        B --> C(复制源代码)
        C --> D(执行 npm run build)
        D --> E{生成 /dist 文件夹}
    end
    
    subgraph sub_2 [Stage 2: Production (生产环境)]
        F[基础镜像 NGINX Alpine] --> G(从 Stage 1 复制 /dist)
        G --> H[最终生产镜像]
    end
    
    E -.->|精准传输| G
```

## 2. 编写多阶段 Dockerfile（React/Vue 示例）

多阶段模式的秘诀是在同一个文件中多次使用 `FROM` 指令。每个 `FROM` 都会开启一个干净的新阶段。最后，**只有最后一个阶段会被保存为镜像**。其他所有内容都会被丢弃。

```dockerfile
# ==========================================
# 阶段 1：构建器 (Build Stage)
# 我们将此阶段命名为 "builder"，以便稍后引用它。
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./

# 安装**所有**依赖项（包括像 Webpack 这样的 devDependencies）
RUN npm install

COPY . .

# 编译应用程序。这会在 /app/dist 中生成静态的 HTML/CSS/JS
RUN npm run build

# ==========================================
# 阶段 2：生产 (Production Stage)
# 我们从一个超轻量级的 Web 镜像（约 5MB）开始
# ==========================================
FROM nginx:alpine

# 复制自定义 Nginx 配置（以避免 React Router 出现 404 错误）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 奇迹在这里发生：从 "builder" 阶段复制 /dist 文件夹
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx 的命令
CMD ["nginx", "-g", "daemon off;"]
```

### 显著效果：
传统的 React 镜像将超过 **400 MB**。使用这种多阶段技术，生成的镜像重量将在 **15 到 20 MB** 之间。它的托管成本更低、启动速度更快，并大幅减少了攻击向量（它没有安装 Node.js、bash 或 NPM）。

## 3. 使用 Distroless 进行优化

如果你正在运行编译后的二进制文件（Go、Rust 或 Java）或不需要操作系统 shell 的语言，你可以通过使用 **Distroless** 镜像（由 Google 创建）将安全性提升到极致。

Distroless 镜像**仅包含你的应用程序及其运行时依赖项**。它们不包含包管理器、shell（`sh`、`bash`）或操作系统的任何其他典型实用程序。

```dockerfile
# 阶段 1：Builder
FROM golang:1.20 AS builder
WORKDIR /app
COPY . .
RUN go build -o mi-api .

# 阶段 2：生产 Distroless
FROM gcr.io/distroless/base-debian11
COPY --from=builder /app/mi-api /
EXPOSE 8080
CMD ["/mi-api"]
```

如果攻击者设法利用了你的 API 中的漏洞并获得了远程命令执行的权限，他会发现根本没有命令行控制台来执行他的恶意脚本。他将被锁在一个空笼子里。

通过掌握多阶段构建和 Distroless，你的镜像将具备专业水准。在**专家**级别，我们将探索内核的最深处：Limits、CGroups 和 namespaces，以控制容器的物理资源消耗。
