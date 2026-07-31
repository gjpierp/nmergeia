# Padrões Arquitetônicos, Registry Privado e Escalabilidade

Chegamos ao zênite tecnológico. No nível Mestre, contêineres individuais e ambientes locais não são mais o foco. Agora pensamos em ecossistemas distribuídos, CI/CD, distribuição global de imagens e padrões arquitetônicos avançados como Sidecars e Daemons.

## 1. O Padrão Sidecar: Arquitetura Desacoplada

Um contêiner deve fazer **uma única coisa e fazê-la perfeitamente**.
O que acontece se você tiver uma API obsoleta (Legacy) que salva logs em arquivos de texto, mas sua equipe de SRE (Engenheiros de Confiabilidade) exige que os logs sejam enviados em tempo real para o Datadog ou ElasticSearch?

Modificar o código Legacy é perigoso. A solução arquitetônica é o padrão **Sidecar** (Carro lateral).

### Implementação do Sidecar

Anexamos um contêiner secundário na mesma rede (ou no mesmo Pod no Kubernetes) que compartilha um volume físico.

```mermaid
graph LR
    subgraph sub_1 [Tarefa Docker / Pod Kubernetes]
        Legacy[App Legacy (Contêiner A)] -->|Escreve logs.txt| Volume[(Volume Compartilhado)]
        Volume -->|Lê logs.txt| Fluentd[Fluentd / Logstash (Contêiner B)]
    end
    
    Fluentd -->|Streaming Assíncrono HTTP| Cloud(ElasticSearch / Datadog)
```

Neste padrão, o contêiner Legacy não tem ideia de que está sendo monitorado. O contêiner Fluentd (o Sidecar) captura o arquivo, o transforma e o envia para a nuvem. Modernizamos a observabilidade sem tocar em uma única linha de código-fonte antigo.

## 2. Governar o seu próprio Docker Registry

Quando você opera sob estrito cumprimento legal (Fintech, Saúde, Defesa), não pode depender de repositórios públicos como o Docker Hub, nem pode enviar o código-fonte proprietário de sua empresa para repositórios compartilhados sem revisão.

### Montando um Registry Privado e Seguro

Você deve implantar o seu próprio **Registry**. O componente principal de distribuição oficial é em si um contêiner:

```yaml
services:
  private-registry:
    image: registry:2
    ports:
      - "5000:5000"
    environment:
      REGISTRY_AUTH: htpasswd
      REGISTRY_AUTH_HTPASSWD_REALM: "Registry Realm"
      REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
      REGISTRY_STORAGE_DELETE_ENABLED: true
    volumes:
      - ./auth:/auth
      - registry_data:/var/lib/registry
```

Uma vez implantado, os pipelines de Integração Contínua (CI) devem etiquetar (Tag) as imagens apontando para o seu domínio corporativo e assiná-las com **Docker Content Trust** para prevenir ataques de cadeia de suprimentos (Supply Chain Attacks).

```bash
# 1. Pipeline constrói e assina a imagem
export DOCKER_CONTENT_TRUST=1
docker build -t registry.minhaempresa.com/api-pagamentos:v1.0.4 .

# 2. A imagem assinada criptograficamente é enviada ao servidor central
docker push registry.minhaempresa.com/api-pagamentos:v1.0.4
```

## 3. Preparando o salto para o Kubernetes

O Docker Compose é brilhante para desenvolvimento local e implantações modestas em um único servidor físico. Mas quando você exige alta disponibilidade (HA), atualizações sem tempo de inatividade (Zero-Downtime Deployments) e balanceamento de carga automático em dezenas de servidores (Nós), o Docker por si só não é suficiente.

Você deve passar o controle para um Orquestrador de Nível 3.
Seu conhecimento exaustivo sobre *Dockerfiles, Multi-Stage, Cgroups e Volumes* é exatamente o mesmo conhecimento que o **Kubernetes (K8s)** exige. No K8s, um contêiner continua sendo um contêiner Docker (ou containerd); simplesmente o envolvemos em um conceito lógico chamado `Pod` e delegamos seu ciclo de vida ao plano de controle mestre.

**Parabéns!** Você escalou da teoria da virtualização básica para a engenharia de contêineres de nível corporativo. Sua infraestrutura agora é imutável, hiper-otimizada e blindada.
