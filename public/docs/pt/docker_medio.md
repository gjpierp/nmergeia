# Orquestração Local com Docker Compose e Redes

Ter uma API rodando em um contêiner é excelente, mas o software do mundo real requer vários componentes: um Backend, um Banco de Dados, um cache do Redis e um Frontend. Ligá-los todos manualmente usando dezenas de comandos `docker run` com parâmetros infinitos é insustentável e propenso a erros.

A resposta é o **Docker Compose**: um orquestrador declarativo para ambientes locais.

## 1. O Arquivo Declarativo: docker-compose.yml

Em vez de digitar comandos imperativos, definimos o estado final desejado da nossa infraestrutura em um arquivo YAML. O Docker se encarregará de ligar, conectar e desligar tudo na ordem correta.

```mermaid
graph TD
    subgraph sub_1 [Rede do Docker Compose (app-network)]
        React[Frontend - Porta 80]
        API[Backend API Node.js - Porta 3000]
        DB[(PostgreSQL - Porta 5432)]
        Caché[(Redis - Porta 6379)]
    end
    
    Usuario((Navegador)) --> React
    React --> API
    API --> DB
    API --> Caché
```

**Atenção à regra de Redes:** Dentro de uma rede do Docker Compose, os contêineres não se comunicam usando `localhost`. Eles se comunicam usando **o nome do serviço** como domínio de DNS.

## 2. Construindo o Cluster de Desenvolvimento

Crie um arquivo chamado `docker-compose.yml` na raiz do seu projeto:

```yaml
version: '3.8'

services:
  # Serviço 1: Nosso Banco de Dados
  db:
    image: postgres:15-alpine
    restart: always # Se o BD travar, o Docker o reinicia
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: main_db
    volumes:
      - pg_data:/var/lib/postgresql/data # Persistência
    ports:
      - "5432:5432" # Apenas necessário para acessar do DBeaver/DataGrip localmente

  # Serviço 2: Nosso Backend Personalizado
  api:
    build: 
      context: ./backend # Localização do Dockerfile do backend
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db # Mágico: DNS automático graças ao Docker Compose
      - DB_USER=admin
      - DB_PASS=mysecretpassword
    depends_on:
      - db # Força o banco de dados a iniciar antes da API

  # Serviço 3: Cache Ultra-rápido
  redis-cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pg_data: # Define o volume nomeado para a persistência de dados
```

## 3. O Poder do DNS Interno

Preste atenção na variável de ambiente `DB_HOST=db` do serviço da API. Como ambos os serviços (`api` e `db`) estão definidos no mesmo arquivo compose, o Docker cria automaticamente uma rede de ponte (bridge network) e um servidor DNS interno.

Quando seu código em Node.js tentar se conectar a `postgresql://admin:mysecretpassword@db:5432/main_db`, o Docker resolverá a palavra `db` para o endereço IP interno do contêiner do PostgreSQL. Você não precisa (nem deve) usar IPs puros.

## 4. Ciclo de Vida do Comando Compose

O fluxo de trabalho diário de um desenvolvedor moderno é ridiculamente simples com o Compose:

1. **Ligar todo o cluster em segundo plano:**
   ```bash
   docker-compose up -d
   ```
2. **Ver os logs centralizados de todos os contêineres:**
   ```bash
   docker-compose logs -f
   ```
3. **Desligar e destruir os contêineres (mantendo os volumes intactos):**
   ```bash
   docker-compose down
   ```

## 5. Volumes (Volumes): Imortalidade para seus Dados

Contêineres são entidades **efêmeras**. Se você excluir um contêiner de banco de dados, todos os seus dados morrerão com ele. Para obter persistência, usamos **Volumes**.

No exemplo acima, ao definir `volumes: - pg_data:/var/lib/postgresql/data`, estamos dizendo ao Docker: "Pegue tudo o que o PostgreSQL salvar nessa pasta interna e guarde com segurança em um volume no meu disco rígido físico". Se você destruir o contêiner do Postgres e subir um novo no dia seguinte, o novo contêiner se conectará ao volume `pg_data` e recuperará todas as suas tabelas instantaneamente.

Dominar o `docker-compose` elimina completamente a síndrome da "Configuração de Ambiente Local". No **Nível Avançado**, daremos o salto crítico de desenvolvimento para produção: exploraremos as Builds Multietapa (Multi-Stage Builds) para reduzir imagens de gigabytes para apenas alguns megabytes blindados.
