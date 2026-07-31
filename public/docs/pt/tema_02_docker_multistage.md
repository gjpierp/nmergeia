# Estratégias de Docker e Container de vários estágios

Reduzir a superfície de ataque e o peso das imagens Docker (para <50 MB) é um objetivo importante no DevSecOps.

## Construções em vários estágios
Ele permite compilar o código em uma imagem pesada (por exemplo, `node:18-alpine`) e mover apenas os binários ou estáticas resultantes para uma imagem sem distribuição ou ultraleve (por exemplo, `nginx:alpine`).

## Docker Compose para orquestração local
O arquivo `docker-compose.yml` facilita a configuração de redes virtuais isoladas.

```sereia
gráfico TD
  A[Etapa 1: Construir] -->|Copiar binários| B[Estágio 2: sem distribuição]
  B --> C[Imagem <50MB]
  C --> D[Implantação Segura]
```

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

