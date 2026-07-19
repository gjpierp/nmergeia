# --- Etapa 1: Construcción (Build) ---
FROM node:20.12.2-alpine3.19 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Etapa 2: Servidor Node Backend + Frontend ---
FROM node:20.12.2-alpine3.19
WORKDIR /app

# Configurar permisos para usuario non-root (node)
RUN chown -R node:node /app
USER node

# Copiamos package json y instalamos dependencias de produccion
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev

# Copiamos el build del frontend y el servidor
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node server.js ./

# Opcional: sqlite db file can be created if needed, ensure folder exists
RUN mkdir -p /app/configs && chown -R node:node /app/configs

EXPOSE 80
CMD ["node", "server.js"]
