# Erweiterte Orchestrierung mit Kubernetes (K8s)

Kubernetes (K8s) ist nicht einfach ein Container-Orchestrator; ist eine deklarative **Desired State**-Verwaltungsplattform, die auf einer Closed-Loop-Abstimmungs-Engine (*Control Loop*) basiert.

---

## 1. Cluster-Architektur und Steuerungsebene

Die Kubernetes-Steuerungsebene stellt sicher, dass die Anzahl der Replikate, Netzwerkrouten und Sicherheitsrichtlinien immer den Definitionen in den deklarativen Manifesten entspricht:

* **kube-apiserver:** Der einzige HTTP/REST-Einstiegspunkt zum Cluster. Die gesamte Interaktion (CLI „kubectl“, Operatoren, UI) erfolgt darüber.
* **etcd:** Verteilte und konsistente Schlüsselwertdatenbank (Raft-Algorithmus), die die unveränderliche Wahrheitsquelle des Clusters speichert.
* **kube-scheduler:** Weist ausstehende Pods Worker-Knoten (*Worker-Knoten*) entsprechend den verfügbaren Ressourcen (CPU/RAM), Taints/Toleranzen und Affinitäten zu.
* **kube-controller-manager:** Führt die primären Regelkreise aus (DeploymentController, StatefullSetController, NodeController).

„Meerjungfrau
Diagramm TD
    Client[kubectl / CI-CD] ->|REST API / HTTPS| APIServer[kube-apiserver]
    APIServer <--> ETCD[(etcd DB)]
    APIServer <--> Scheduler[kube-scheduler]
    APIServer <--> Controller[kube-controller-manager]
    APIServer <--> Kubelet1[Worker-Knoten 1: Kubelet + Kube-Proxy]
    APIServer <--> Kubelet2[Worker-Knoten 2: Kubelet + Kube-Proxy]
„

---

## 2. Grundlegende Abstraktionen: Pods,

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

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
