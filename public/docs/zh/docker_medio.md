# Docker 中级：使用 Docker Compose 和网络进行本地编排

在容器中运行一个 API 固然很棒，但真实的软件世界需要多个组件：一个后端、一个数据库、一个 Redis 缓存和一个前端。使用几十个带有无数参数的 `docker run` 命令手动启动它们，这是不可持续且容易出错的。

答案就是 **Docker Compose**：一个用于本地环境的声明式编排器。

## 1. 声明式文件：docker-compose.yml

我们不再输入命令式的命令，而是在 YAML 文件中定义基础设施的最终期望状态。Docker 将负责以正确的顺序启动、连接和关闭所有的东西。

```mermaid
graph TD
    subgraph sub_1 [Docker Compose 网络 (app-network)]
        React[前端 - 端口 80]
        API[后端 API Node.js - 端口 3000]
        DB[(PostgreSQL - 端口 5432)]
        Caché[(Redis - 端口 6379)]
    end
    
    Usuario((浏览器)) --> React
    React --> API
    API --> DB
    API --> Caché
```

**注意网络规则：** 在 Docker Compose 网络内部，容器**不**使用 `localhost` 进行通信。它们使用**服务名称**作为 DNS 域名进行通信。

## 2. 构建开发集群

在你的项目根目录下创建一个名为 `docker-compose.yml` 的文件：

```yaml
version: '3.8'

services:
  # 服务 1：我们的数据库
  db:
    image: postgres:15-alpine
    restart: always # 如果数据库崩溃，Docker 会自动重启它
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: main_db
    volumes:
      - pg_data:/var/lib/postgresql/data # 持久化
    ports:
      - "5432:5432" # 只有当你在本地使用 DBeaver/DataGrip 连接时才需要

  # 服务 2：我们自定义的后端
  api:
    build: 
      context: ./backend # 后端 Dockerfile 的位置
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db # 魔法：归功于 Docker Compose 的自动 DNS 解析
      - DB_USER=admin
      - DB_PASS=mysecretpassword
    depends_on:
      - db # 强制要求数据库在 API 之前启动

  # 服务 3：超快的缓存
  redis-cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pg_data: # 定义一个具名卷（named volume）用于数据持久化
```

## 3. 内部 DNS 的威力

请注意 API 服务的环境变量 `DB_HOST=db`。因为这两个服务（`api` 和 `db`）都定义在同一个 compose 文件中，Docker 会自动创建一个桥接网络（bridge network）和一个内部 DNS 服务器。

当你的 Node.js 代码尝试连接 `postgresql://admin:mysecretpassword@db:5432/main_db` 时，Docker 会将 `db` 解析为 PostgreSQL 容器的内部 IP 地址。你不需要（也不应该）使用原始 IP。

## 4. Compose 命令的生命周期

使用 Compose，现代开发者的日常工作流程变得异常简单：

1. **在后台启动整个集群：**
   ```bash
   docker-compose up -d
   ```
2. **查看所有容器的集中式日志：**
   ```bash
   docker-compose logs -f
   ```
3. **关闭并销毁容器（保留卷的完整性）：**
   ```bash
   docker-compose down
   ```

## 5. 卷（Volumes）：数据的永生

容器是**短暂的（ephemeral）**实体。如果你删除了一个数据库容器，它包含的所有数据也会随之消亡。为了实现持久化，我们使用**卷（Volumes）**。

在上面的示例中，通过定义 `volumes: - pg_data:/var/lib/postgresql/data`，我们告诉 Docker：“把 PostgreSQL 保存在这个内部文件夹里的所有内容提取出来，安全地存放到我物理硬盘上的一个卷中”。如果你销毁了 Postgres 容器，并在第二天启动一个新的，新容器将连接到 `pg_data` 卷，并立即恢复所有的表。

掌握了 `docker-compose` 就彻底消灭了“本地环境配置”综合征。在**高级**中，我们将进行从开发到生产的关键跨越：探索多阶段构建（Multi-Stage Builds），将重达 GB 的镜像缩小到只有几兆字节且具备强大防护的镜像。
