# Kubernetes (K8s) による高度なオーケストレーション

Kubernetes (K8s) は単なるコンテナ オーケストレーターではありません。は、閉ループ調整エンジン (*制御ループ*) に基づく宣言型 **Desired State** 管理プラットフォームです。

---

## 1. クラスターのアーキテクチャとコントロール プレーン

Kubernetes コントロール プレーンは、レプリカの数、ネットワーク ルート、およびセキュリティ ポリシーが常に宣言マニフェストで定義されたものに収束することを保証します。

* **kube-apiserver:** クラスターへの唯一の HTTP/REST エントリー ポイント。すべての対話 (CLI `kubectl`、オペレーター、UI) はそれを通過します。
* **etcd:** クラスターの不変の信頼できるソースを格納する、分散型の一貫したキーと値のデータベース (Raft アルゴリズム)。
* **kube-scheduler:** 利用可能なリソース (CPU/RAM)、テイント/許容範囲、およびアフィニティに従って、保留中のポッドをワーカー ノード (*ワーカー ノード*) に割り当てます。
* **kube-controller-manager:** プライマリ制御ループ (DeploymentController、StatefullSetController、NodeController) を実行します。

「人魚」
グラフTD
    クライアント[kubectl / CI-CD] -->|"REST API / HTTPS"| APIサーバー[kube-apiserver]
    APIサーバー <--> ETCD[(etcd DB)]
    APIサーバー <--> スケジューラ[kube-scheduler]
    APIサーバー <--> コントローラー[kube-controller-manager]
    APIServer <--> Kubelet1[ワーカー ノード 1: Kubelet + Kube-Proxy]
    APIServer <--> Kubelet2[ワーカー ノード 2: Kubelet + Kube-Proxy]
「」

---

## 2. 基本的な抽象化: ポッド、

> [!NOTE]
> コードと図の構文を維持するために、ホワイト ペーパーの残りの部分は元の言語のままになっています。

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
