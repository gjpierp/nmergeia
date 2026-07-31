# Initiale Konfiguration und Basis-Architektur

Willkommen am Startpunkt zur Beherrschung von PostgreSQL, der fortschrittlichsten Open-Source-relationalen Datenbank der Welt. In dieser Anfangsphase werden wir nicht nur ein Binary installieren; wir werden verstehen, wie PostgreSQL mit dem Betriebssystem interagiert und wie die Daten auf der Festplatte strukturiert sind.

## 1. Prozess-Architektur

PostgreSQL ist kein einzelnes Programm, sondern eine robuste Multi-Prozess-Architektur.

### Prozess-Diagramm (Postmaster)

```mermaid
graph TD
    Client[Client (psql / Node.js)] -->|"TCP/IP Verbindung"| Postmaster[Postmaster Prozess (PID 1)]
    
    subgraph sub_1 [PostgreSQL Server]
        Postmaster -->|Fork| Backend1[Backend Prozess 1 (Sitzung A)]
        Postmaster -->|Fork| Backend2[Backend Prozess 2 (Sitzung B)]
        
        Postmaster -.-> BGWriter[Background Writer]
        Postmaster -.-> WAL[WAL Writer]
        Postmaster -.-> Autovacuum[Autovacuum Launcher]
        Postmaster -.-> Checkpointer[Checkpointer]
    end
    
    Backend1 --> SharedBuffers[(Shared Buffers / RAM)]
    Backend2 --> SharedBuffers
    
    SharedBuffers --> BGWriter
    BGWriter --> Festplatte[(Physische Festplatte)]
```

**Schlüsselkonzept:** Jedes Mal, wenn sich eine Anwendung verbindet, führt der `Postmaster` (der Elternprozess) einen *Fork* durch und weist dieser Verbindung einen dedizierten Backend-Prozess zu. Aus diesem Grund erfordert PostgreSQL in Umgebungen mit hoher Parallelität beträchtliche RAM-Ressourcen, wenn wir keinen Connection Pooler wie *PgBouncer* verwenden.

## 2. Zero-Friction Installation (Docker)

Die moderne Methode, Datenbanken lokal auszuführen und zu erlernen, besteht nicht darin, Binärdateien auf Ihrem Computer zu installieren, sondern flüchtige Container zu verwenden.

```bash
docker run --name pg-initial \
  -e POSTGRES_PASSWORD=super_sicheres_passwort \
  -e POSTGRES_USER=admin \
  -e POSTGRES_DB=nmerge_db \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Anatomie des Befehls:
* `-e POSTGRES_PASSWORD`: ZWINGEND ERFORDERLICHE Umgebungsvariable. Ohne sie wird der Container den Start abbrechen.
* `-p 5432:5432`: Stellt den internen Port von PostgreSQL auf Ihrem `localhost` zur Verfügung.
* `postgres:15-alpine`: Wir verwenden die auf Alpine Linux basierende Version 15. Sie ist nur ca. 80 MB groß anstelle der ca. 400 MB großen Standard-Debian-basierten Image.

## 3. Das Datenverzeichnis (PGDATA)

Wo sind meine Daten? Wenn PostgreSQL startet, sucht es nach einem Daten-Cluster im Pfad, der durch die Umgebungsvariable `PGDATA` definiert ist (standardmäßig `/var/lib/postgresql/data`).

Wenn Sie in den Container gehen und dieses Verzeichnis überprüfen:

```bash
docker exec -it pg-initial bash
ls -la /var/lib/postgresql/data
```

Sie werden dort wichtige Ordner sehen, wie z.B.:
* `base/`: Hier befinden sich die tatsächlichen Daten (Tabellen und Indizes im Binärformat).
* `pg_wal/`: (Write-Ahead Logs) Die lebenswichtigen Transaktionsprotokolle. Wenn der Server unerwartet heruntergefahren wird, verwendet PostgreSQL diese Dateien, um die im Arbeitsspeicher verlorenen Daten wiederherzustellen.
* `postgresql.conf`: Das "Gehirn" der Konfiguration.
* `pg_hba.conf`: Der Türsteher (Host-Based Authentication), der entscheidet, welche IP Zugriff hat und wie sie authentifiziert wird.

## Nächste Schritte
Jetzt, da wir ein physisches und architektonisches Fundament haben. Auf der **Basis-Stufe** werden wir die fortgeschrittenen Datentypen untersuchen, die PostgreSQL von einfacheren Datenbanken wie MySQL unterscheiden.
