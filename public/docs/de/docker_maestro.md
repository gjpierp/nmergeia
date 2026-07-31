# Architekturmuster, Private Registry und Skalierbarkeit

Wir haben den technologischen Zenit erreicht. Auf der Meisterstufe stehen einzelne Container und lokale Umgebungen nicht mehr im Mittelpunkt. Jetzt denken wir an verteilte Ökosysteme, CI/CD, globale Image-Verteilung und fortgeschrittene Architekturmuster wie Sidecars und Daemons.

## 1. Das Sidecar-Muster: Entkoppelte Architektur

Ein Container sollte **nur eine einzige Sache tun und diese perfekt machen**. 
Was passiert, wenn du eine veraltete API (Legacy) hast, die Protokolle in Textdateien speichert, aber dein SRE-Team (Site Reliability Engineering) verlangt, dass die Protokolle in Echtzeit an Datadog oder ElasticSearch gesendet werden?

Die Änderung von Legacy-Code ist gefährlich. Die architektonische Lösung ist das **Sidecar**-Muster (Beiwagen).

### Implementierung des Sidecars

Wir hängen einen sekundären Container im selben Netzwerk (oder demselben Pod in Kubernetes) an, der ein physisches Volume gemeinsam nutzt.

```mermaid
graph LR
    subgraph sub_1 [Docker Task / Kubernetes Pod]
        Legacy[Legacy App (Container A)] -->|Schreibt logs.txt| Volume[(Gemeinsames Volume)]
        Volume -->|Liest logs.txt| Fluentd[Fluentd / Logstash (Container B)]
    end
    
    Fluentd -->|Asynchrones HTTP-Streaming| Cloud(ElasticSearch / Datadog)
```

Bei diesem Muster hat der Legacy-Container keine Ahnung, dass er überwacht wird. Der Fluentd-Container (der Sidecar) erfasst die Datei, transformiert sie und sendet sie in die Cloud. Wir haben die Observability modernisiert, ohne auch nur eine einzige Zeile alten Quellcodes anzufassen.

## 2. Steuerung deiner eigenen Docker Registry

Wenn du unter strengen gesetzlichen Compliance-Vorgaben operierst (Fintech, Gesundheitswesen, Verteidigung), kannst du dich nicht auf öffentliche Repositories wie Docker Hub verlassen und darfst den proprietären Quellcode deines Unternehmens nicht ohne Überprüfung in gemeinsam genutzte Repositories hochladen.

### Aufbau einer privaten und sicheren Registry

Du musst deine eigene **Registry** bereitstellen. Die Kernkomponente der offiziellen Verteilung ist selbst ein Container:

```yaml
services:
  private-registry:
    image: registry:2
    ports:
      - "5000:5000"
    environment:
      REGISTRY_AUTH: htpasswd
      REGISTRY_AUTH_HTPASSWD_REALM: "Registry Realm"
      REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
      REGISTRY_STORAGE_DELETE_ENABLED: true
    volumes:
      - ./auth:/auth
      - registry_data:/var/lib/registry
```

Nach der Bereitstellung sollten die Continuous Integration (CI)-Pipelines die Images mit einem Tag versehen, das auf deine Unternehmensdomäne verweist, und sie mit **Docker Content Trust** signieren, um Supply-Chain-Angriffe (Supply Chain Attacks) zu verhindern.

```bash
# 1. Pipeline erstellt und signiert das Image
export DOCKER_CONTENT_TRUST=1
docker build -t registry.miempresa.com/api-pagos:v1.0.4 .

# 2. Das kryptografisch signierte Image wird an den zentralen Server gesendet
docker push registry.miempresa.com/api-pagos:v1.0.4
```

## 3. Vorbereitung auf den Sprung zu Kubernetes

Docker Compose ist genial für die lokale Entwicklung und bescheidene Deployments auf einem einzelnen physischen Server. Aber wenn du Hochverfügbarkeit (HA), Updates ohne Ausfallzeiten (Zero-Downtime Deployments) und automatischen Lastausgleich über Dutzende von Servern (Nodes) hinweg benötigst, reicht Docker allein nicht mehr aus.

Du musst die Kontrolle an einen Layer-3-Orchestrator übergeben.
Dein umfassendes Wissen über *Dockerfiles, Multi-Stage, Cgroups und Volumes* ist genau dasselbe Wissen, das **Kubernetes (K8s)** verlangt. In K8s ist ein Container immer noch ein Docker-Container (oder containerd); wir packen ihn einfach in ein logisches Konzept namens `Pod` und delegieren seinen Lebenszyklus an die Control Plane.

**Herzlichen Glückwunsch!** Du bist von der grundlegenden Virtualisierungstheorie zum Container-Engineering auf Unternehmensebene aufgestiegen. Deine Infrastruktur ist nun unveränderlich, hyper-optimiert und gepanzert.
