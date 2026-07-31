# Local Orchestration with Docker Compose and Networks

Having an API running in a container is great, but real-world software requires multiple components: a Backend, a Database, a Redis cache, and a Frontend. Starting them all manually using dozens of `docker run` commands with endless parameters is unsustainable and error-prone. 

The answer is **Docker Compose**: a declarative orchestrator for local environments.

## 1. The Declarative File: docker-compose.yml

Instead of typing imperative commands, we define the desired final state of our infrastructure in a YAML file. Docker will take care of starting, connecting, and stopping everything in the correct order.

```mermaid
graph TD
    subgraph sub_1 [Docker Compose Network (app-network)]
        React[Frontend - Port 80]
        API[Node.js Backend API - Port 3000]
        DB[(PostgreSQL - Port 5432)]
        Cache[(Redis - Port 6379)]
    end
    
    User((Browser)) --> React
    React --> API
    API --> DB
    API --> Cache
```

**Pay attention to the Networking rule:** Inside a Docker Compose network, containers do not communicate using `localhost`. They communicate using **the service name** as the DNS domain.

## 2. Building the Development Cluster

Create a file named `docker-compose.yml` in the root of your project:

```yaml
version: '3.8'

services:
  # Service 1: Our Database
  db:
    image: postgres:15-alpine
    restart: always # If the DB crashes, Docker restarts it
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: main_db
    volumes:
      - pg_data:/var/lib/postgresql/data # Persistence
    ports:
      - "5432:5432" # Only necessary for accessing from DBeaver/DataGrip locally

  # Service 2: Our Custom Backend
  api:
    build: 
      context: ./backend # Location of the backend's Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db # Magic: Automatic DNS thanks to Docker Compose
      - DB_USER=admin
      - DB_PASS=mysecretpassword
    depends_on:
      - db # Forces the database to boot before the API

  # Service 3: Ultra-fast Cache
  redis-cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pg_data: # Defines the named volume for data persistence
```

## 3. The Power of Internal DNS

Notice the `DB_HOST=db` environment variable of the API service. Since both services (`api` and `db`) are defined in the same compose file, Docker automatically creates a bridge network and an internal DNS server.

When your Node.js code attempts to connect to `postgresql://admin:mysecretpassword@db:5432/main_db`, Docker will resolve the word `db` to the internal IP address of the PostgreSQL container. You don't need (nor should you) use raw IPs.

## 4. Compose Command Lifecycle

A modern developer's daily workflow is ridiculously simple with Compose:

1. **Start the entire cluster in the background:**
   ```bash
   docker-compose up -d
   ```
2. **View centralized logs from all containers:**
   ```bash
   docker-compose logs -f
   ```
3. **Stop and destroy the containers (keeping volumes intact):**
   ```bash
   docker-compose down
   ```

## 5. Volumes: Immortality for your Data

Containers are **ephemeral** entities. If you delete a database container, all its data dies with it. To achieve persistence, we use **Volumes**.

In the example above, by defining `volumes: - pg_data:/var/lib/postgresql/data`, we are telling Docker: "Take everything PostgreSQL saves in that internal folder and store it safely in a volume on my physical hard drive." If you destroy the Postgres container and bring up a new one the next day, the new container will connect to the `pg_data` volume and instantly recover all your tables.

Mastering `docker-compose` completely eliminates "Local Environment Configuration" syndrome. In the **Advanced Level**, we will take the critical leap from development to production: we will explore Multi-Stage Builds to reduce gigabyte images down to a few armored megabytes.
