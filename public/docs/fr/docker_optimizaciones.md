# Docker Multi-Stage Builds, Seguridad No-Root y Optimización de Imágenes

Las imágenes monolíticas sin optimizar generan vulnerabilidades de seguridad, tiempos de despliegue lentos y un consumo desmedido de almacenamiento en los registros de contenedores. **Docker Multi-Stage** permite separar las etapas de compilación (*build stage*) de la imagen final de ejecución (*runtime stage*).

---

## 1. Dockerfile Multi-Stage de Producción para Node.js / React

Este patrón reduce el tamaño de la imagen final de **>1.2 GB** a menos de **45 MB** utilizando Alpine Linux y servidores NGINX ligeros.

```dockerfile
# ==========================================
# ETAPA 1: Dependencias y Compilación (Build)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de definición de paquetes primero para aprovechar la caché de capas
COPY package.json package-lock.json ./

# Instalación limpia de dependencias de desarrollo e interacción
RUN npm ci

# Copiar el resto del código fuente del proyecto
COPY . .

# Compilación optimizada para producción
RUN npm run build

# ==========================================
# ETAPA 2: Runtime de Producción (Servidor Ligero)
# ==========================================
FROM nginx:1.25-alpine AS production

# Crear usuario no-root por seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar artefactos estáticos compilados desde la ETAPA 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Asignar permisos al usuario no-root
RUN chown -R appuser:appgroup /usr/share/nginx/html /var/cache/nginx /var/log/nginx

# Cambiar contexto de ejecución al usuario sin privilegios
USER appuser

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

---

## 2. Dockerfile Multi-Stage de Producción para Go / Backend Cero-Dependencias

Para aplicaciones en Go o lenguajes compilados estáticamente, el contenedor final puede construirse desde una imagen completamente vacía (`scratch`), ocupando **menos de 15 MB**.

```dockerfile
# ETAPA 1: Compilación de binario Go estático
FROM golang:1.22-alpine AS builder

WORKDIR /build

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Compilar sin CGO y con strip de símbolos de depuración (-s -w)
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o /app/server .

# ETAPA 2: Imagen scratch ultraligera sin SO
FROM scratch

# Copiar certificados SSL/TLS raíz para permitir llamadas HTTPS hacia API externas
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copiar el binario estático resultante
COPY --from=builder /app/server /server

EXPOSE 3000

ENTRYPOINT ["/server"]
```

---

## 3. Configuración de Red Docker Local (Cero Puertos Expuestos al Exterior)

### `docker-compose.yml` de Producción

```yaml
version: '3.8'

networks:
  global-network:
    external: true

services:
  nmerge-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: nmerge-app
    restart: always
    networks:
      - global-network
    # NOTA: Cero sección 'ports' pública. 
    # Todo el tráfico entra por el Proxy Inverso Central (nginx) en la red compartida.
    environment:
      - NODE_ENV=production
      - PORT=8080
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:8080/health"]
      interval: 10s
      timeout: 5s
      retries: 3
```
