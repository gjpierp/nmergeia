# Configuration Initiale et Architecture de Base

Bienvenue au point de départ pour maîtriser PostgreSQL, le moteur de base de données relationnelle open-source le plus avancé au monde. Dans cette phase initiale, nous ne nous contenterons pas d'installer un binaire ; nous allons comprendre comment PostgreSQL interagit avec le système d'exploitation et comment les données sont structurées sur le disque.

## 1. Architecture des Processus

PostgreSQL n'est pas un programme unique, mais une architecture multi-processus robuste.

### Diagramme des Processus (Postmaster)

```mermaid
graph TD
    Client[Client (psql / Node.js)] -->|"Connexion TCP/IP"| Postmaster[Processus Postmaster (PID 1)]
    
    subgraph sub_1 [Serveur PostgreSQL]
        Postmaster -->|Fork| Backend1[Processus Backend 1 (Session A)]
        Postmaster -->|Fork| Backend2[Processus Backend 2 (Session B)]
        
        Postmaster -.-> BGWriter[Background Writer]
        Postmaster -.-> WAL[WAL Writer]
        Postmaster -.-> Autovacuum[Lanceur Autovacuum]
        Postmaster -.-> Checkpointer[Checkpointer]
    end
    
    Backend1 --> SharedBuffers[(Shared Buffers / RAM)]
    Backend2 --> SharedBuffers
    
    SharedBuffers --> BGWriter
    BGWriter --> Disque[(Disque Physique)]
```

**Concept Clé :** À chaque fois qu'une application se connecte, le `Postmaster` (le processus parent) crée un *fork* et alloue un processus backend dédié pour cette connexion. C'est pourquoi PostgreSQL nécessite des ressources RAM considérables dans des environnements à forte concurrence si l'on n'utilise pas de Connection Pooler comme *PgBouncer*.

## 2. Installation Zero-Friction (Docker)

La manière moderne de faire fonctionner et d'apprendre des bases de données localement n'est pas d'installer des binaires sur votre ordinateur, mais d'utiliser des conteneurs éphémères.

```bash
docker run --name pg-initial \
  -e POSTGRES_PASSWORD=mot_de_passe_ultra_securise \
  -e POSTGRES_USER=admin \
  -e POSTGRES_DB=nmerge_db \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Anatomie de la Commande :
* `-e POSTGRES_PASSWORD` : Variable d'environnement OBLIGATOIRE. Sans cela, le conteneur annulera le démarrage.
* `-p 5432:5432` : Expose le port interne de PostgreSQL vers votre `localhost`.
* `postgres:15-alpine` : Nous utilisons la version 15 basée sur Alpine Linux. Elle pèse seulement ~80Mo au lieu des ~400Mo de l'image par défaut basée sur Debian.

## 3. Le Répertoire de Données (PGDATA)

Où sont mes données ? Lorsque PostgreSQL démarre, il cherche un cluster de données dans le chemin défini par la variable d'environnement `PGDATA` (par défaut `/var/lib/postgresql/data`).

Si vous entrez dans le conteneur et inspectez ce répertoire :

```bash
docker exec -it pg-initial bash
ls -la /var/lib/postgresql/data
```

Vous y verrez des dossiers cruciaux tels que :
* `base/` : Là où résident les vraies données (tables et index en binaire).
* `pg_wal/` : (Write-Ahead Logs) Les registres vitaux des transactions. Si le serveur s'arrête brusquement, PostgreSQL utilisera ces fichiers pour reconstruire les données perdues en mémoire.
* `postgresql.conf` : Le "cerveau" de la configuration.
* `pg_hba.conf` : Le garde du corps (Host-Based Authentication) qui décide quelle adresse IP a accès et comment elle sera authentifiée.

## Prochaines Étapes
Maintenant que nous avons une fondation physique et architecturale. Au **Niveau Basique**, nous explorerons les Types de Données avancés qui différencient PostgreSQL des bases de données plus simples comme MySQL.
