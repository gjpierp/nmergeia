# Lokale Orchestrierung mit Docker Compose und Netzwerken

Eine in einem Container laufende API zu haben, ist großartig, aber reale Software erfordert mehrere Komponenten: ein Backend, eine Datenbank, einen Redis-Cache und ein Frontend. Alle diese manuell mit Dutzenden von `docker run`-Befehlen und unzähligen Parametern zu starten, ist nicht nachhaltig und fehleranfällig.

Die Antwort ist **Docker Compose**: ein deklarativer Orchestrator für lokale Umgebungen.

## 1. Die deklarative Datei: docker-compose.yml

Anstatt imperative Befehle einzutippen, definieren wir den gewünschten Endzustand unserer Infrastruktur in einer YAML-Datei. Docker kümmert sich darum, alles in der richtigen Reihenfolge zu starten, zu verbinden und herunterzufahren.

```mermaid
graph TD
    subgraph sub_1 [Docker Compose Netzwerk (app-network)]
        React[Frontend - Port 80]
        API[Backend API Node.js - Port 3000]
        DB[(PostgreSQL - Port 5432)]
        Caché[(Redis - Port 6379)]
    end
    
    Usuario((Browser)) --> React
    React --> API
    API --> DB
    API --> Caché
```

**Achtung bei der Netzwerk-Regel:** Innerhalb eines Docker Compose-Netzwerks kommunizieren Container nicht über `localhost`. Sie kommunizieren unter Verwendung **des Dienstnamens** als DNS-Domäne.

## 2. Aufbau des Entwicklungs-Clusters

Erstelle eine Datei namens `docker-compose.yml` im Stammverzeichnis deines Projekts:

```yaml
version: '3.8'

services:
  # Dienst 1: Unsere Datenbank
  db:
    image: postgres:15-alpine
    restart: always # Wenn die DB abstürzt, startet Docker sie neu
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: main_db
    volumes:
      - pg_data:/var/lib/postgresql/data # Persistenz
    ports:
      - "5432:5432" # Nur erforderlich für den Zugriff von lokalem DBeaver/DataGrip

  # Dienst 2: Unser benutzerdefiniertes Backend
  api:
    build: 
      context: ./backend # Speicherort der Backend-Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db # Magisch: Automatisches DNS dank Docker Compose
      - DB_USER=admin
      - DB_PASS=mysecretpassword
    depends_on:
      - db # Erzwingt, dass die Datenbank vor der API gestartet wird

  # Dienst 3: Ultraschneller Cache
  redis-cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pg_data: # Definiert das benannte Volume für die Datenpersistenz
```

## 3. Die Macht des internen DNS

Achte auf die Umgebungsvariable `DB_HOST=db` des API-Dienstes. Da beide Dienste (`api` und `db`) in derselben Compose-Datei definiert sind, erstellt Docker automatisch ein Bridge-Netzwerk (Bridge Network) und einen internen DNS-Server.

Wenn dein Node.js-Code versucht, eine Verbindung zu `postgresql://admin:mysecretpassword@db:5432/main_db` herzustellen, löst Docker das Wort `db` in die interne IP-Adresse des PostgreSQL-Containers auf. Du musst (und solltest) keine rohen IPs verwenden.

## 4. Lebenszyklus des Compose-Befehls

Der tägliche Workflow eines modernen Entwicklers ist mit Compose lächerlich einfach:

1. **Den gesamten Cluster im Hintergrund starten:**
   ```bash
   docker-compose up -d
   ```
2. **Die zentralisierten Logs aller Container anzeigen:**
   ```bash
   docker-compose logs -f
   ```
3. **Container herunterfahren und zerstören (wobei die Volumes intakt bleiben):**
   ```bash
   docker-compose down
   ```

## 5. Volumes (Volumen): Unsterblichkeit für deine Daten

Container sind **flüchtige (ephemere)** Entitäten. Wenn du einen Datenbankcontainer löschst, sterben alle seine Daten mit ihm. Um Persistenz zu erreichen, verwenden wir **Volumes**.

Im obigen Beispiel sagen wir Docker durch die Definition von `volumes: - pg_data:/var/lib/postgresql/data`: "Nimm alles, was PostgreSQL in diesem internen Ordner speichert, und speichere es sicher in einem Volume auf meiner physischen Festplatte." Wenn du den Postgres-Container zerstörst und am nächsten Tag einen neuen startest, verbindet sich der neue Container mit dem Volume `pg_data` und stellt alle deine Tabellen sofort wieder her.

Die Beherrschung von `docker-compose` beseitigt das "Lokale Umgebungs-Konfigurations"-Syndrom vollständig. Auf der **Fortgeschrittenen Stufe (Nivel Avanzado)** werden wir den entscheidenden Schritt von der Entwicklung zur Produktion machen: Wir werden Multi-Stage-Builds untersuchen, um Images von Gigabytes auf wenige, gepanzerte Megabytes zu reduzieren.
