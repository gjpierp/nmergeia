# PostgreSQL：初始配置与基础架构

欢迎来到掌握世界上最先进的开源关系型数据库引擎 PostgreSQL 的起点。在初始阶段，我们不仅仅是安装一个二进制文件；我们将了解 PostgreSQL 是如何与操作系统交互的，以及数据在磁盘上是如何构建的。

## 1. 进程架构

PostgreSQL 并不是一个单一的程序，而是一个强大的多进程架构。

### 进程图解 (Postmaster)

```mermaid
graph TD
    Client[客户端 (psql / Node.js)] -->|"TCP/IP 连接"| Postmaster[Postmaster 进程 (PID 1)]
    
    subgraph sub_1 [PostgreSQL 服务器]
        Postmaster -->|Fork| Backend1[后端进程 1 (会话 A)]
        Postmaster -->|Fork| Backend2[后端进程 2 (会话 B)]
        
        Postmaster -.-> BGWriter[后台写入器 (Background Writer)]
        Postmaster -.-> WAL[WAL 写入器 (WAL Writer)]
        Postmaster -.-> Autovacuum[自动清理启动器 (Autovacuum Launcher)]
        Postmaster -.-> Checkpointer[检查点进程 (Checkpointer)]
    end
    
    Backend1 --> SharedBuffers[(共享缓冲区 / 内存)]
    Backend2 --> SharedBuffers
    
    SharedBuffers --> BGWriter
    BGWriter --> Disk[(物理磁盘)]
```

**核心概念：** 每次应用程序连接时，`Postmaster`（父进程）都会执行 *fork*，并为该连接分配一个专用的后端进程。这就是为什么如果我们不使用像 *PgBouncer* 这样的连接池，PostgreSQL 在高并发环境中需要大量内存资源的原因。

## 2. 零摩擦安装 (Docker)

在本地操作和学习数据库的现代方法不是在计算机上安装二进制文件，而是使用临时的容器。

```bash
docker run --name pg-initial \
  -e POSTGRES_PASSWORD=超级安全的密码 \
  -e POSTGRES_USER=admin \
  -e POSTGRES_DB=nmerge_db \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 命令剖析：
* `-e POSTGRES_PASSWORD`：必需的环境变量。如果没有它，容器将中止启动。
* `-p 5432:5432`：将 PostgreSQL 的内部端口暴露给你的 `localhost`。
* `postgres:15-alpine`：我们使用基于 Alpine Linux 的版本 15。它只有约 80MB，而不是基于 Debian 的默认镜像的约 400MB。

## 3. 数据目录 (PGDATA)

我的数据在哪里？当 PostgreSQL 启动时，它会在由 `PGDATA` 环境变量定义的路径中查找数据簇（默认为 `/var/lib/postgresql/data`）。

如果你进入容器并检查这个目录：

```bash
docker exec -it pg-initial bash
ls -la /var/lib/postgresql/data
```

你会看到一些关键的文件夹，例如：
* `base/`：实际数据（二进制形式的表和索引）驻留的地方。
* `pg_wal/`：(Write-Ahead Logs) 重要的事务日志。如果服务器意外关闭，PostgreSQL 将使用这些文件来重建内存中丢失的数据。
* `postgresql.conf`：配置的“大脑”。
* `pg_hba.conf`：决定哪个 IP 有权限访问以及如何进行身份验证的守门员 (基于主机的身份验证)。

## 下一步
现在我们已经拥有了物理和架构基础。在**基础阶段**，我们将探索区分 PostgreSQL 与 MySQL 等简单数据库的高级数据类型。
