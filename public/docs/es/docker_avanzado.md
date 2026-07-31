# Optimización Extrema y Multi-Stage Builds

Llevar una imagen Docker a producción exige un rigor totalmente distinto al de un entorno de desarrollo local. Una imagen de 1 Gigabyte que contiene herramientas de compilación, repositorios locales y código fuente expuesto es una bomba de tiempo financiera (costos de transferencia) y una pesadilla de ciberseguridad.

En el Nivel Avanzado, dominaremos el patrón arquitectónico más importante de Docker: **Los Builds Multi-Etapa (Multi-Stage Builds)**.

## 1. El Problema de las Imágenes Monolíticas

Imagina que estás construyendo una aplicación en Go o React. Para crear el ejecutable o los archivos estáticos estáticos, necesitas descargar el compilador de Go o toda la paquetería de `node_modules` (que pesa cientos de MBs).

Si construyes la imagen en un solo paso, todos esos archivos inútiles para producción terminan dentro del contenedor final. 

### Diagrama de Flujo Multi-Stage

```mermaid
flowchart LR
    subgraph sub_1 [Stage 1: Build (Constructor)]
        A[Imagen Base Node.js 18] --> B(Instalar NPM Packages)
        B --> C(Copiar Código Fuente)
        C --> D(Ejecutar npm run build)
        D --> E{Genera Carpeta /dist}
    end
    
    subgraph sub_2 [Stage 2: Production (Final)]
        F[Imagen Base NGINX Alpine] --> G(Copiar /dist desde Stage 1)
        G --> H[Imagen Final de Producción]
    end
    
    E -.->|Transferencia Quirúrgica| G
```

## 2. Escribiendo un Multi-Stage Dockerfile (Ejemplo React/Vue)

El secreto del patrón Multi-Stage es utilizar la instrucción `FROM` múltiples veces en el mismo archivo. Cada `FROM` comienza una nueva etapa limpia. Al final, **solo la última etapa se guarda como imagen**. Todo lo demás se descarta.

```dockerfile
# ==========================================
# ETAPA 1: Constructor (Build Stage)
# Nombramos la etapa como "builder" para referenciarla luego.
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo devDependencies como Webpack)
RUN npm install

COPY . .

# Compilamos la aplicación. Esto genera HTML/CSS/JS estáticos en /app/dist
RUN npm run build

# ==========================================
# ETAPA 2: Producción (Production Stage)
# Comenzamos con una imagen web ultra-ligera (aprox. 5MB)
# ==========================================
FROM nginx:alpine

# Copiamos la configuración personalizada de Nginx (para evitar errores 404 en React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Aquí está la magia: Copiamos la carpeta /dist desde la etapa "builder"
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto
EXPOSE 80

# Comando para encender Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Resultados Masivos:
Una imagen tradicional de React superaría los **400 MB**. Utilizando esta técnica Multi-Stage, la imagen resultante pesará entre **15 y 20 MB**. Es más barata de alojar, arranca más rápido y reduce drásticamente los vectores de ataque (no tiene Node.js, bash, ni NPM instalado).

## 3. Optimización con Distroless

Si estás corriendo binarios compilados (Go, Rust, o Java) o lenguajes que no requieren un shell operativo, puedes llevar la seguridad al paroxismo utilizando imágenes **Distroless** (creadas por Google).

Las imágenes Distroless contienen **solo tu aplicación y sus dependencias de tiempo de ejecución**. No contienen gestores de paquetes, shells (`sh`, `bash`) o cualquier otra utilidad típica del sistema operativo.

```dockerfile
# Etapa 1: Builder
FROM golang:1.20 AS builder
WORKDIR /app
COPY . .
RUN go build -o mi-api .

# Etapa 2: Producción Distroless
FROM gcr.io/distroless/base-debian11
COPY --from=builder /app/mi-api /
EXPOSE 8080
CMD ["/mi-api"]
```

Si un atacante logra explotar una vulnerabilidad en tu API y obtiene ejecución remota de comandos, descubrirá que no hay consola de comandos para ejecutar sus scripts maliciosos. Estará encerrado en una jaula vacía.

Al dominar el Multi-Stage y Distroless, tus imágenes son profesionales. En el nivel **Experto**, exploraremos los rincones más profundos del Kernel: Limits, CGroups, y namespaces para controlar el consumo físico de los contenedores.
