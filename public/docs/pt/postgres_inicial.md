# Configuração Inicial e Arquitetura Base

Bem-vindo ao ponto de partida para dominar o PostgreSQL, o motor de banco de dados relacional open-source mais avançado do mundo. Nesta etapa inicial, não instalaremos apenas um binário; vamos entender como o PostgreSQL interage com o sistema operacional e como os dados são estruturados em disco.

## 1. Arquitetura de Processos

O PostgreSQL não é um programa único, mas uma arquitetura multiprocesso robusta.

### Diagrama de Processos (Postmaster)

```mermaid
graph TD
    Cliente[Cliente (psql / Node.js)] -->|"Conexão TCP/IP"| Postmaster[Processo Postmaster (PID 1)]
    
    subgraph sub_1 [Servidor PostgreSQL]
        Postmaster -->|Fork| Backend1[Backend Process 1 (Sessão A)]
        Postmaster -->|Fork| Backend2[Backend Process 2 (Sessão B)]
        
        Postmaster -.-> BGWriter[Background Writer]
        Postmaster -.-> WAL[WAL Writer]
        Postmaster -.-> Autovacuum[Autovacuum Launcher]
        Postmaster -.-> Checkpointer[Checkpointer]
    end
    
    Backend1 --> SharedBuffers[(Shared Buffers / RAM)]
    Backend2 --> SharedBuffers
    
    SharedBuffers --> BGWriter
    BGWriter --> Disco[(Disco Físico)]
```

**Conceito Chave:** Cada vez que uma aplicação se conecta, o `Postmaster` (o processo pai) faz um *fork* e aloca um processo backend dedicado para essa conexão. É por isso que o PostgreSQL requer recursos consideráveis de RAM em ambientes com alta concorrência se não usarmos um Connection Pooler como o *PgBouncer*.

## 2. Instalação Zero-Friction (Docker)

A forma moderna de operar e aprender bancos de dados localmente não é instalando binários no seu computador, mas através de contêineres efêmeros.

```bash
docker run --name pg-inicial \
  -e POSTGRES_PASSWORD=senha_super_segura \
  -e POSTGRES_USER=admin \
  -e POSTGRES_DB=nmerge_db \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Anatomia do Comando:
* `-e POSTGRES_PASSWORD`: Variável de ambiente OBRIGATÓRIA. Sem ela, o contêiner abortará a inicialização.
* `-p 5432:5432`: Expõe a porta interna do PostgreSQL para o seu `localhost`.
* `postgres:15-alpine`: Usamos a versão 15 baseada no Alpine Linux. Pesa apenas ~80MB em vez dos ~400MB da imagem padrão baseada no Debian.

## 3. O Diretório de Dados (PGDATA)

Onde estão meus dados? Quando o PostgreSQL inicia, ele procura por um cluster de dados no caminho definido pela variável de ambiente `PGDATA` (por padrão `/var/lib/postgresql/data`).

Se você entrar no contêiner e inspecionar esse diretório:

```bash
docker exec -it pg-inicial bash
ls -la /var/lib/postgresql/data
```

Você verá pastas cruciais como:
* `base/`: Onde residem os dados reais (as tabelas e índices em binário).
* `pg_wal/`: (Write-Ahead Logs) Os registros vitais de transações. Se o servidor desligar inesperadamente, o PostgreSQL usará esses arquivos para reconstruir os dados perdidos da memória.
* `postgresql.conf`: O "cérebro" da configuração.
* `pg_hba.conf`: O porteiro (Host-Based Authentication) que decide qual IP tem acesso e como será autenticado.

## Próximos Passos
Agora que temos uma fundação física e arquitetônica. No **Nível Básico**, exploraremos os Tipos de Dados avançados que diferenciam o PostgreSQL de bancos de dados mais simples como o MySQL.
