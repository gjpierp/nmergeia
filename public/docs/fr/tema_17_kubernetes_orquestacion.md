# Orchestration avancée avec Kubernetes (K8s)

Kubernetes (K8s) n'est pas simplement un orchestrateur de conteneurs ; est une plateforme déclarative de gestion **Desired State** basée sur un moteur de réconciliation en boucle fermée (*Control Loop*).

---

## 1. Architecture de cluster et plan de contrôle

Le plan de contrôle Kubernetes garantit que le nombre de réplicas, de routes réseau et de politiques de sécurité convergent toujours vers ce qui est défini dans les manifestes déclaratifs :

* **kube-apiserver :** Le seul point d'entrée HTTP/REST au cluster. Toutes les interactions (CLI `kubectl`, opérateurs, UI) passent par là.
* **etcd :** Base de données clé-valeur distribuée et cohérente (algorithme Raft) qui stocke la source de vérité immuable du cluster.
* **kube-scheduler :** attribue les pods en attente aux nœuds de travail (*Worker Nodes*) en fonction des ressources disponibles (CPU/RAM), des teintes/tolérances et des affinités.
* **kube-controller-manager :** Exécute les boucles de contrôle principales (DeploymentController, StatefullSetController, NodeController).

```sirène
graphique TD
    Client[kubectl / CI-CD] -->|"API REST / HTTPS"| Serveur API[kube-apiserver]
    APIServeur <--> ETCD[(etcd DB)]
    APIServer <--> Planificateur[kube-scheduler]
    APIServer <--> Contrôleur[kube-controller-manager]
    APIServer <--> Kubelet1[Nœud de travail 1 : Kubelet + Kube-Proxy]
    APIServer <--> Kubelet2[Nœud de travail 2 : Kubelet + Kube-Proxy]
```

---

## 2. Abstractions fondamentales : Pods,

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

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
