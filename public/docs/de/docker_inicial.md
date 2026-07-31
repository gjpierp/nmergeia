# Konfiguration und Container-Architektur

Willkommen bei der Container-Revolution. Docker ist nicht einfach nur ein Virtualisierungstool; es ist ein Paradigmenwechsel in der Art und Weise, wie wir Software verpacken, verteilen und ausführen. Die Zeiten von "auf meiner Maschine funktioniert es" sind vorbei.

## 1. Virtualisierung vs. Containerisierung

Um Docker zu verstehen, müssen wir zunächst verstehen, welches Problem es im Vergleich zu herkömmlichen virtuellen Maschinen (VMs) löst.

### Vergleichendes Architekturdiagramm

```mermaid
graph TD
    subgraph sub_1 [Traditionelle Virtuelle Maschine]
        HW1[Physischer Server / Hardware] --> Hyper[Hypervisor (VMware / Hyper-V)]
        Hyper --> VM1[VM 1: Vollständiges Gast-OS + App A]
        Hyper --> VM2[VM 2: Vollständiges Gast-OS + App B]
    end

    subgraph sub_2 [Docker Container]
        HW2[Physischer Server / Hardware] --> SO[Host-Betriebssystem]
        SO --> Engine[Docker Engine]
        Engine --> C1[Container: Binärdateien/Bibliotheken + App A]
        Engine --> C2[Container: Binärdateien/Bibliotheken + App B]
    end
```

**Der grundlegende Unterschied:** Eine virtuelle Maschine virtualisiert die gesamte *Hardware* und installiert ein vollständiges Betriebssystem (OS) (das Gigabytes wiegt und Minuten zum Booten benötigt). Docker virtualisiert das *Betriebssystem* unter Verwendung von Namespaces und Cgroups des Linux-Kernels. Container teilen sich denselben Kernel, wodurch sie nur Megabytes wiegen und in Millisekunden starten.

## 2. Reibungslose Installation

Abhängig von deinem Betriebssystem variiert die Installation, aber der Industriestandard für die Entwicklung ist **Docker Desktop** (für Windows/Mac) und die reine **Docker Engine** für Linux.

### Überprüfung der Umgebung
Öffne dein Terminal und führe aus:

```bash
docker version
```
Wenn du die Client-Informationen (Client) siehst, aber eine Fehlermeldung zum Server (Server oder Daemon) erhältst, bedeutet dies, dass die Docker-Engine nicht im Hintergrund ausgeführt wird. Starte den Docker-Dienst, bevor du fortfährst.

## 3. Dein erster Container: Der Klassiker NGINX

Wir werden noch keinen Code schreiben; wir werden ein bestehendes Image verwenden, um den Lebenszyklus zu verstehen.

```bash
# Einen Webserver im Hintergrund ausführen und den Port 80 des Containers auf den Port 8080 des Hosts mappen
docker run -d --name mi-servidor-web -p 8080:80 nginx:alpine
```

### Anatomie des Befehls:
* `run`: Weist die Engine an, das Image lokal zu suchen. Wenn es nicht existiert, wird es vom Docker Hub heruntergeladen, ein Container erstellt und gestartet.
* `-d` (Detached): Führt den Container im Hintergrund aus und gibt dein Terminal frei.
* `--name`: Weist einen lesbaren Namen zu. Wenn du dies weglässt, weist Docker einen zufälligen Namen wie `jolly_turing` zu.
* `-p 8080:80`: Port-Mapping. Der Datenverkehr, der auf deinem `localhost:8080` ankommt, wird an den Port `80` innerhalb des Containers weitergeleitet.
* `nginx:alpine`: Das zu verwendende Image. `alpine` ist eine ultraleichte Linux-Variante (ca. 5 MB), die jeder Cloud-Architekt aus Sicherheits- und Geschwindigkeitsgründen bevorzugen sollte.

Besuche `http://localhost:8080` in deinem Browser. Wenn du die NGINX-Willkommensseite siehst, hast du erfolgreich deinen ersten Container bereitgestellt.

## Nächste Schritte
Wir beherrschen nun die Nutzung vorgefertigter Images. Auf der **Basisstufe (Nivel Básico)** werden wir keine reinen Konsumenten mehr sein, sondern zu Schöpfern werden: Wir werden lernen, unsere eigene `Dockerfile` zu schreiben und unsere eigene Node.js/Python-Anwendung zu verpacken.
