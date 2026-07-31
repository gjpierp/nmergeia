# Configuración y Arquitectura de Contenedores

Bienvenido a la revolución de los contenedores. Docker no es simplemente una herramienta de virtualización; es un cambio de paradigma en cómo empaquetamos, distribuimos y ejecutamos software. Atrás quedaron los días de "funciona en mi máquina".

## 1. Virtualización vs Contenerización

Para entender Docker, primero debemos entender qué problema resuelve frente a las Máquinas Virtuales (VMs) tradicionales.

### Diagrama Arquitectónico Comparativo

```mermaid
graph TD
    subgraph sub_1 [Máquina Virtual Tradicional]
        HW1[Servidor Físico / Hardware] --> Hyper[Hypervisor (VMware / Hyper-V)]
        Hyper --> VM1[VM 1: SO Invitado Completo + App A]
        Hyper --> VM2[VM 2: SO Invitado Completo + App B]
    end

    subgraph sub_2 [Contenedores Docker]
        HW2[Servidor Físico / Hardware] --> SO[Sistema Operativo Host]
        SO --> Engine[Docker Engine]
        Engine --> C1[Contenedor: Binarios/Librerías + App A]
        Engine --> C2[Contenedor: Binarios/Librerías + App B]
    end
```

**La diferencia fundamental:** Una Máquina Virtual virtualiza todo el *Hardware*, instalando un Sistema Operativo (SO) completo (que pesa gigabytes y toma minutos en arrancar). Docker virtualiza el *Sistema Operativo* utilizando namespaces y cgroups del kernel de Linux. Los contenedores comparten el mismo Kernel, lo que los hace pesar megabytes y arrancar en milisegundos.

## 2. Instalación Cero-Fricción

Dependiendo de tu sistema operativo, la instalación varía, pero el estándar industrial para desarrollo es **Docker Desktop** (para Windows/Mac) y el **Docker Engine** crudo para Linux.

### Verificando el entorno
Abre tu terminal y ejecuta:

```bash
docker version
```
Si ves la información del Cliente (Client) pero recibes un error sobre el Servidor (Server o Daemon), significa que el motor de Docker no se está ejecutando en segundo plano. Inicia el servicio de Docker antes de continuar.

## 3. Tu Primer Contenedor: El Clásico NGINX

No escribiremos código todavía; vamos a consumir una imagen ya existente para entender el ciclo de vida.

```bash
# Ejecutar un servidor web en segundo plano mapeando el puerto 80 del contenedor al puerto 8080 del host
docker run -d --name mi-servidor-web -p 8080:80 nginx:alpine
```

### Anatomía del Comando:
* `run`: Ordena al motor que busque la imagen localmente. Si no existe, la descargará de Docker Hub, creará un contenedor y lo encenderá.
* `-d` (Detached): Ejecuta el contenedor en segundo plano, liberando tu terminal.
* `--name`: Asigna un nombre legible. Si omites esto, Docker asignará un nombre aleatorio como `jolly_turing`.
* `-p 8080:80`: Mapeo de puertos. El tráfico que llega a tu `localhost:8080` será redirigido al puerto `80` dentro del contenedor.
* `nginx:alpine`: La imagen a usar. `alpine` es una variante ultra-ligera de Linux (aprox. 5MB) que todo arquitecto cloud debería preferir por seguridad y velocidad.

Visita `http://localhost:8080` en tu navegador. Si ves la página de bienvenida de NGINX, has desplegado con éxito tu primer contenedor.

## Próximos Pasos
Hemos dominado el consumo de imágenes preexistentes. En el **Nivel Básico**, dejaremos de ser consumidores para convertirnos en creadores: aprenderemos a escribir nuestro propio `Dockerfile` y empacar nuestra propia aplicación Node.js/Python.
