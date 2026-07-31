# Orquestração Avançada com Kubernetes (K8s)

Kubernetes (K8s) não é simplesmente um orquestrador de contêineres; é uma plataforma de gerenciamento declarativa de **Estado Desejado** baseada em um mecanismo de reconciliação de circuito fechado (*Control Loop*).

---

## 1. Arquitetura de cluster e plano de controle

O plano de controle do Kubernetes garante que o número de réplicas, rotas de rede e políticas de segurança sempre convirjam para o que está definido nos manifestos declarativos:

* **kube-apiserver:** O único ponto de entrada HTTP/REST para o cluster. Toda a interação (CLI `kubectl`, operadores, UI) passa por ela.
* **etcd:** Banco de dados de valores-chave distribuído e consistente (algoritmo Raft) que armazena a fonte imutável da verdade do cluster.
* **kube-scheduler:** Atribui Pods pendentes a Worker Nodes (*Worker Nodes*) de acordo com os recursos disponíveis (CPU/RAM), taints/tolerações e afinidades.
* **kube-controller-manager:** Executa os loops de controle primários (DeploymentController, StatefullSetController, NodeController).

```sereia
gráfico TD
    Cliente[kubectl / CI-CD] -->|"API REST / HTTPS"| APIServer[kube-apiserver]
    APIServer <--> ETCD[(etcd DB)]
    APIServer <--> Agendador[kube-scheduler]
    APIServer <--> Controlador[kube-controller-manager]
    APIServer <--> Kubelet1[Nó de trabalho 1: Kubelet + Kube-Proxy]
    APIServer <--> Kubelet2[Nó de trabalho 2: Kubelet + Kube-Proxy]
```

---

## 2. Abstrações Fundamentais: Pods,

> [!NOTE]
> O restante do white paper é mantido em seu idioma original para preservar a sintaxe do código e dos diagramas.

 Services e Ingress

### A. Anatomía de un Pod
Un **Pod** es la unidad atómica de ejecución. Puede alojar un contenedor principal y contenedores secundarios (*Sidecars*) que comparten la misma red (`localhost`), la misma pila IP y los mismos volúmenes de almacenamiento local.

### B. Manifiesto de Despliegue con Estrategia RollingUpdate
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nmerge-backend
  namespace: prod
  labels:
    app: nmerge-backend
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1 # Mantiene como mínimo 2 Pods activos en producción
      maxSurge: 1       # Genera 1 Pod nuevo antes de apagar uno antiguo
  selector:
    matchLabels:
      app: nmerge-backend
  template:
    metadata:
      labels:
        app: nmerge-backend
    spec:
      containers:
      - name: backend
        image: registry.nmergeia.com/nmerge-backend:v1.2.2
        ports:
        - containerPort: 3005
        resources:
          requests:
            cpu: "250m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
```

---

## 3. Sondas de Salud (Liveness, Readiness y Startup Probes)

Sin sondas de salud, Kubernetes solo sabe si el proceso de Linux del contenedor está vivo, pero no si la aplicación está respondiendo o bloqueada por un interbloqueo (*Deadlock*).

```yaml
livenessProbe:
  httpGet:
    path: /api/healthz
    port: 3005
  initialDelaySeconds: 15
  periodSeconds: 10
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /api/ready
    port: 3005
  initialDelaySeconds: 5
  periodSeconds: 5
```

* **Liveness Probe:** Si falla $N$ veces consecutivas, Kubelet mata el contenedor y lo reinicia (Auto-Healing).
* **Readiness Probe:** Si falla, elimina temporalmente la IP del Pod del balanceador de carga del Service para evitar enviar tráfico a una instancia saturada.

---

## 4. Autoescalado Horizontal (HPA) y Resiliencia

El **Horizontal Pod Autoscaler (HPA)** ajusta el número de réplicas en función del consumo real métrico:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nmerge-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nmerge-backend
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 75
```
