# Configuração e Arquitetura de Contêineres

Bem-vindo à revolução dos contêineres. O Docker não é simplesmente uma ferramenta de virtualização; é uma mudança de paradigma em como empacotamos, distribuímos e executamos software. Ficaram para trás os dias de "funciona na minha máquina".

## 1. Virtualização vs Conteinerização

Para entender o Docker, primeiro devemos entender qual problema ele resolve em comparação com as Máquinas Virtuais (VMs) tradicionais.

### Diagrama Arquitetônico Comparativo

```mermaid
graph TD
    subgraph sub_1 [Máquina Virtual Tradicional]
        HW1[Servidor Físico / Hardware] --> Hyper[Hypervisor (VMware / Hyper-V)]
        Hyper --> VM1[VM 1: SO Convidado Completo + App A]
        Hyper --> VM2[VM 2: SO Convidado Completo + App B]
    end

    subgraph sub_2 [Contêineres Docker]
        HW2[Servidor Físico / Hardware] --> SO[Sistema Operacional Host]
        SO --> Engine[Docker Engine]
        Engine --> C1[Contêiner: Binários/Bibliotecas + App A]
        Engine --> C2[Contêiner: Binários/Bibliotecas + App B]
    end
```

**A diferença fundamental:** Uma Máquina Virtual virtualiza todo o *Hardware*, instalando um Sistema Operacional (SO) completo (que pesa gigabytes e leva minutos para iniciar). O Docker virtualiza o *Sistema Operacional* utilizando namespaces e cgroups do kernel do Linux. Os contêineres compartilham o mesmo Kernel, o que os faz pesar megabytes e iniciar em milissegundos.

## 2. Instalação Zero-Atrito

Dependendo do seu sistema operacional, a instalação varia, mas o padrão industrial para desenvolvimento é o **Docker Desktop** (para Windows/Mac) e o **Docker Engine** puro para Linux.

### Verificando o ambiente
Abra seu terminal e execute:

```bash
docker version
```
Se você vir as informações do Cliente (Client), mas receber um erro sobre o Servidor (Server ou Daemon), isso significa que o motor do Docker não está sendo executado em segundo plano. Inicie o serviço do Docker antes de continuar.

## 3. Seu Primeiro Contêiner: O Clássico NGINX

Não escreveremos código ainda; vamos consumir uma imagem já existente para entender o ciclo de vida.

```bash
# Executar um servidor web em segundo plano mapeando a porta 80 do contêiner para a porta 8080 do host
docker run -d --name meu-servidor-web -p 8080:80 nginx:alpine
```

### Anatomia do Comando:
* `run`: Ordena ao motor que busque a imagem localmente. Se não existir, ele a baixará do Docker Hub, criará um contêiner e o iniciará.
* `-d` (Detached): Executa o contêiner em segundo plano, liberando seu terminal.
* `--name`: Atribui um nome legível. Se você omitir isso, o Docker atribuirá um nome aleatório como `jolly_turing`.
* `-p 8080:80`: Mapeamento de portas. O tráfego que chega ao seu `localhost:8080` será redirecionado para a porta `80` dentro do contêiner.
* `nginx:alpine`: A imagem a usar. `alpine` é uma variante ultra-leve do Linux (aprox. 5MB) que todo arquiteto cloud deveria preferir por segurança e velocidade.

Visite `http://localhost:8080` no seu navegador. Se você vir a página de boas-vindas do NGINX, implantou com sucesso seu primeiro contêiner.

## Próximos Passos
Dominamos o consumo de imagens preexistentes. No **Nível Básico**, deixaremos de ser consumidores para nos tornarmos criadores: aprenderemos a escrever nosso próprio `Dockerfile` e empacotar nosso próprio aplicativo Node.js/Python.
