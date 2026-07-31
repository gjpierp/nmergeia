# Otimização Extrema e Multi-Stage Builds

Levar uma imagem Docker para produção exige um rigor totalmente diferente de um ambiente de desenvolvimento local. Uma imagem de 1 Gigabyte que contém ferramentas de compilação, repositórios locais e código-fonte exposto é uma bomba-relógio financeira (custos de transferência) e um pesadelo de cibersegurança.

No Nível Avançado, dominaremos o padrão arquitetônico mais importante do Docker: **As Builds de Múltiplas Etapas (Multi-Stage Builds)**.

## 1. O Problema das Imagens Monolíticas

Imagine que você está construindo um aplicativo em Go ou React. Para criar o executável ou os arquivos estáticos, você precisa baixar o compilador do Go ou todo o pacote do `node_modules` (que pesa centenas de MBs).

Se você construir a imagem em uma única etapa, todos esses arquivos inúteis para a produção acabam dentro do contêiner final.

### Diagrama de Fluxo Multi-Stage

```mermaid
flowchart LR
    subgraph sub_1 [Stage 1: Build (Construtor)]
        A[Imagem Base Node.js 18] --> B(Instalar Pacotes NPM)
        B --> C(Copiar Código Fonte)
        C --> D(Executar npm run build)
        D --> E{Gera Pasta /dist}
    end
    
    subgraph sub_2 [Stage 2: Production (Final)]
        F[Imagem Base NGINX Alpine] --> G(Copiar /dist do Stage 1)
        G --> H[Imagem Final de Produção]
    end
    
    E -.->|Transferência Cirúrgica| G
```

## 2. Escrevendo um Multi-Stage Dockerfile (Exemplo React/Vue)

O segredo do padrão Multi-Stage é usar a instrução `FROM` várias vezes no mesmo arquivo. Cada `FROM` inicia uma nova etapa limpa. No final, **apenas a última etapa é salva como imagem**. Todo o resto é descartado.

```dockerfile
# ==========================================
# ETAPA 1: Construtor (Build Stage)
# Nomeamos a etapa como "builder" para referenciá-la mais tarde.
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./

# Instalamos TODAS as dependências (incluindo devDependencies como Webpack)
RUN npm install

COPY . .

# Compilamos a aplicação. Isso gera HTML/CSS/JS estáticos em /app/dist
RUN npm run build

# ==========================================
# ETAPA 2: Produção (Production Stage)
# Começamos com uma imagem web ultra-leve (aprox. 5MB)
# ==========================================
FROM nginx:alpine

# Copiamos a configuração personalizada do Nginx (para evitar erros 404 no React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Aqui está a mágica: Copiamos a pasta /dist da etapa "builder"
COPY --from=builder /app/dist /usr/share/nginx/html

# Expomos a porta
EXPOSE 80

# Comando para ligar o Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Resultados Massivos:
Uma imagem tradicional do React superaria os **400 MB**. Usando essa técnica Multi-Stage, a imagem resultante pesará entre **15 e 20 MB**. É mais barata para hospedar, inicia mais rápido e reduz drasticamente os vetores de ataque (não tem Node.js, bash nem NPM instalado).

## 3. Otimização com Distroless

Se você está rodando binários compilados (Go, Rust ou Java) ou linguagens que não exigem um shell operacional, pode levar a segurança ao paroxismo usando imagens **Distroless** (criadas pelo Google).

As imagens Distroless contêm **apenas a sua aplicação e as dependências de tempo de execução (runtime)**. Elas não contêm gerenciadores de pacotes, shells (`sh`, `bash`) ou qualquer outro utilitário típico do sistema operacional.

```dockerfile
# Etapa 1: Builder
FROM golang:1.20 AS builder
WORKDIR /app
COPY . .
RUN go build -o minha-api .

# Etapa 2: Produção Distroless
FROM gcr.io/distroless/base-debian11
COPY --from=builder /app/minha-api /
EXPOSE 8080
CMD ["/minha-api"]
```

Se um invasor conseguir explorar uma vulnerabilidade na sua API e obtiver execução remota de comandos, ele descobrirá que não há um console de comandos para executar seus scripts maliciosos. Ele estará trancado em uma jaula vazia.

Dominando o Multi-Stage e Distroless, suas imagens são profissionais. No nível **Especialista**, exploraremos os cantos mais profundos do Kernel: Limits, CGroups e namespaces para controlar o consumo físico dos contêineres.
