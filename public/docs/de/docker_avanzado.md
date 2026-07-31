# Extreme Optimierung und Multi-Stage Builds

Ein Docker-Image in die Produktion zu überführen, erfordert eine völlig andere Strenge als eine lokale Entwicklungsumgebung. Ein 1 Gigabyte großes Image, das Build-Tools, lokale Repositorys und freiliegenden Quellcode enthält, ist eine finanzielle Zeitbombe (Transferkosten) und ein Cybersicherheits-Albtraum.

Auf der fortgeschrittenen Stufe (Nivel Avanzado) werden wir das wichtigste Architekturmuster von Docker beherrschen: **Die Multi-Stage Builds**.

## 1. Das Problem monolithischer Images

Stell dir vor, du erstellst eine Anwendung in Go oder React. Um die ausführbare Datei oder die statischen Dateien zu erstellen, musst du den Go-Compiler oder das gesamte `node_modules`-Paket (das Hunderte von MBs wiegt) herunterladen.

Wenn du das Image in einem einzigen Schritt erstellst, landen all diese für die Produktion nutzlosen Dateien im finalen Container. 

### Multi-Stage Flussdiagramm

```mermaid
flowchart LR
    subgraph sub_1 [Stage 1: Build (Konstruktor)]
        A[Basis Image Node.js 18] --> B(NPM Packages installieren)
        B --> C(Quellcode kopieren)
        C --> D(npm run build ausführen)
        D --> E{Generiert Ordner /dist}
    end
    
    subgraph sub_2 [Stage 2: Production (Final)]
        F[Basis Image NGINX Alpine] --> G(/dist aus Stage 1 kopieren)
        G --> H[Finales Produktions-Image]
    end
    
    E -.->|Chirurgischer Transfer| G
```

## 2. Schreiben einer Multi-Stage Dockerfile (Beispiel React/Vue)

Das Geheimnis des Multi-Stage-Musters ist die mehrfache Verwendung der `FROM`-Anweisung in derselben Datei. Jedes `FROM` beginnt eine neue, saubere Stufe. Am Ende **wird nur die letzte Stufe als Image gespeichert**. Alles andere wird verworfen.

```dockerfile
# ==========================================
# STUFE 1: Konstruktor (Build Stage)
# Wir benennen die Stufe "builder", um später darauf zu verweisen.
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./

# Wir installieren ALLE Abhängigkeiten (einschließlich devDependencies wie Webpack)
RUN npm install

COPY . .

# Wir kompilieren die Anwendung. Dies generiert statisches HTML/CSS/JS in /app/dist
RUN npm run build

# ==========================================
# STUFE 2: Produktion (Production Stage)
# Wir beginnen mit einem ultraleichten Web-Image (ca. 5MB)
# ==========================================
FROM nginx:alpine

# Wir kopieren die benutzerdefinierte Nginx-Konfiguration (um 404-Fehler in React Router zu vermeiden)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Hier ist die Magie: Wir kopieren den Ordner /dist aus der Stufe "builder"
COPY --from=builder /app/dist /usr/share/nginx/html

# Wir exponieren den Port
EXPOSE 80

# Befehl zum Starten von Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Massive Ergebnisse:
Ein herkömmliches React-Image würde **400 MB** übersteigen. Mit dieser Multi-Stage-Technik wiegt das resultierende Image zwischen **15 und 20 MB**. Es ist billiger zu hosten, startet schneller und reduziert Angriffsvektoren drastisch (es hat weder Node.js noch Bash oder NPM installiert).

## 3. Optimierung mit Distroless

Wenn du kompilierte Binärdateien (Go, Rust oder Java) oder Sprachen ausführst, die keine operative Shell benötigen, kannst du die Sicherheit auf die Spitze treiben, indem du **Distroless**-Images (erstellt von Google) verwendest.

Distroless-Images enthalten **nur deine Anwendung und ihre Laufzeitabhängigkeiten**. Sie enthalten keine Paketmanager, Shells (`sh`, `bash`) oder sonstige typische Betriebssystem-Dienstprogramme.

```dockerfile
# Stufe 1: Builder
FROM golang:1.20 AS builder
WORKDIR /app
COPY . .
RUN go build -o mi-api .

# Stufe 2: Distroless Produktion
FROM gcr.io/distroless/base-debian11
COPY --from=builder /app/mi-api /
EXPOSE 8080
CMD ["/mi-api"]
```

Wenn es einem Angreifer gelingt, eine Schwachstelle in deiner API auszunutzen und eine Remote-Befehlsausführung zu erlangen, wird er feststellen, dass es keine Befehlskonsole gibt, um seine bösartigen Skripte auszuführen. Er wird in einem leeren Käfig eingesperrt sein.

Durch die Beherrschung von Multi-Stage und Distroless sind deine Images professionell. Auf der **Expertenstufe (Experto)** werden wir die tiefsten Winkel des Kernels erkunden: Limits, CGroups und Namespaces, um den physischen Verbrauch von Containern zu kontrollieren.
