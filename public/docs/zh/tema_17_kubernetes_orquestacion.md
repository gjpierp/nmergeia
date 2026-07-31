# 使用 Kubernetes (K8s) 进行高级编排

Kubernetes (K8s) 不仅仅是一个容器编排器；是一个基于闭环协调引擎（*控制环*）的声明式**期望状态**管理平台。

---

## 1. 集群架构和控制平面

Kubernetes 控制平面确保副本数量、网络路由和安全策略始终收敛于声明性清单中定义的内容：

* **kube-apiserver：** 集群的唯一 HTTP/REST 入口点。所有交互（CLI `kubectl`、操作员、UI）都经过它。
* **etcd：** 分布式一致的键值数据库（Raft 算法），用于存储集群的不可变事实来源。
* **kube-scheduler：** 根据可用资源（CPU/RAM）、污点/容忍度和关联性将挂起的 Pod 分配给工作节点（*工作节点*）。
* **kube-controller-manager：** 运行主控制循环（DeploymentController、StatefullSetController、NodeController）。

``美人鱼
图解TD
    客户端[kubectl / CI-CD] -->|"REST API / HTTPS"| API服务器[kube-apiserver]
    APIServer <--> ETCD[(etcd DB)]
    APIServer <--> 调度程序[kube-scheduler]
    APIServer <--> 控制器[kube-controller-manager]
    APIServer <--> Kubelet1[工作节点 1：Kubelet + Kube-Proxy]
    APIServer <--> Kubelet2[工作节点 2：Kubelet + Kube-Proxy]
````

---

## 2. 基本抽象：Pod，

> [!NOTE]
> 白皮书的其余部分保留其原始语言，以保留代码和图表的语法。

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
