# Extreme Optimization and Multi-Stage Builds

Taking a Docker image to production requires an entirely different rigor than a local development environment. A 1 Gigabyte image containing build tools, local repositories, and exposed source code is a financial time bomb (transfer costs) and a cybersecurity nightmare.

In the Advanced Level, we will master Docker's most important architectural pattern: **Multi-Stage Builds**.

## 1. The Problem with Monolithic Images

Imagine you're building an application in Go or React. To create the executable or the static files, you need to download the Go compiler or the entire `node_modules` package suite (which weighs hundreds of MBs).

If you build the image in a single step, all those files useless for production end up inside the final container. 

### Multi-Stage Flowchart

```mermaid
flowchart LR
    subgraph sub_1 [Stage 1: Build (Constructor)]
        A[Node.js 18 Base Image] --> B(Install NPM Packages)
        B --> C(Copy Source Code)
        C --> D(Execute npm run build)
        D --> E{Generates /dist Folder}
    end
    
    subgraph sub_2 [Stage 2: Production (Final)]
        F[NGINX Alpine Base Image] --> G(Copy /dist from Stage 1)
        G --> H[Final Production Image]
    end
    
    E -.->|Surgical Transfer| G
```

## 2. Writing a Multi-Stage Dockerfile (React/Vue Example)

The secret of the Multi-Stage pattern is using the `FROM` instruction multiple times in the same file. Each `FROM` starts a new clean stage. At the end, **only the last stage is saved as an image**. Everything else is discarded.

```dockerfile
# ==========================================
# STAGE 1: Constructor (Build Stage)
# We name the stage "builder" to reference it later.
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./

# We install ALL dependencies (including devDependencies like Webpack)
RUN npm install

COPY . .

# We compile the application. This generates static HTML/CSS/JS in /app/dist
RUN npm run build

# ==========================================
# STAGE 2: Production (Production Stage)
# We start with an ultra-light web image (approx. 5MB)
# ==========================================
FROM nginx:alpine

# We copy the custom Nginx configuration (to avoid 404 errors in React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Here is the magic: We copy the /dist folder from the "builder" stage
COPY --from=builder /app/dist /usr/share/nginx/html

# We expose the port
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Massive Results:
A traditional React image would exceed **400 MB**. Using this Multi-Stage technique, the resulting image will weigh between **15 and 20 MB**. It's cheaper to host, boots faster, and drastically reduces attack vectors (it has no Node.js, bash, or NPM installed).

## 3. Optimization with Distroless

If you are running compiled binaries (Go, Rust, or Java) or languages that don't require an operational shell, you can take security to the extreme using **Distroless** images (created by Google).

Distroless images contain **only your application and its runtime dependencies**. They do not contain package managers, shells (`sh`, `bash`), or any other typical operating system utilities.

```dockerfile
# Stage 1: Builder
FROM golang:1.20 AS builder
WORKDIR /app
COPY . .
RUN go build -o my-api .

# Stage 2: Distroless Production
FROM gcr.io/distroless/base-debian11
COPY --from=builder /app/my-api /
EXPOSE 8080
CMD ["/my-api"]
```

If an attacker manages to exploit a vulnerability in your API and gains remote command execution, they'll find there is no command console to run their malicious scripts. They will be locked in an empty cage.

By mastering Multi-Stage and Distroless, your images are professional. At the **Expert** level, we will explore the deepest corners of the Kernel: Limits, CGroups, and namespaces to control the physical consumption of containers.
