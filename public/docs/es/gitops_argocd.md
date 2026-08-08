# 🐙 Guía Enterprise: GitOps, ArgoCD & Canary Deployments

Bienvenido a la guía técnica sobre **GitOps & Delivery Progresivo**. En este documento exploraremos desde los principios fundamentales de **GitOps con ArgoCD** hasta la automatización de despliegues canario (*Canary Deployments*) utilizando **Flagger** e **Istio Service Mesh**.

---

## 📜 1. Principios Fundamentales del Modelo GitOps

GitOps es un modelo operativo para infraestructuras cloud-native donde **Git es la Fuente Única de Verdad** para el estado deseado del sistema.

```
+------------------+          Git Commit          +---------------------+
| REPOSITORIO GIT  | ---------------------------> | OPERADOR ARGOCD     |
| Estado Deseado   |                              | (Bucle de Control)  |
+------------------+                              +----------+----------+
         ^                                                   |
         |                   Compara y Sincroniza            |
         +---------------------------------------------------+
                                                             v
                                                  +---------------------+
                                                  | CLÚSTER KUBERNETES  |
                                                  | Estado Real         |
                                                  +---------------------+
```

### 1.1 Los 4 Pilares de GitOps
1. **Declarativo**: Toda la infraestructura y servicios se definen mediante manifiestos declarativos (Kustomize / Helm).
2. **Versionado e Inmutable**: El estado deseado reside en Git y está protegido por control de versiones.
3. **Sincronización Automática**: Agentes dentro del clúster leen los cambios en Git y los aplican de forma desatendida.
4. **Auto-Corrección de Reconciliación (Self-Healing)**: Si alguien altera manualmente una configuración en el clúster con `kubectl edit`, ArgoCD detecta la desviación (*Out of Sync*) y restaura el estado definido en Git.

---

## 🛠️ 2. Arquitectura de ArgoCD & ApplicationSets

ArgoCD se instala dentro del clúster de Kubernetes y monitorea continuamente los repositorios de manifiestos.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: enterprise-payment-api
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/enterprise/k8s-manifests.git'
    targetRevision: HEAD
    path: apps/payment-api/production
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: payments
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

### 2.1 Patrón ApplicationSets para Multi-Clúster
Con **ApplicationSets**, una sola plantilla YAML genera dinámicamente cientos de aplicaciones ArgoCD a través de múltiples clústeres (Desarrollo, Staging, Producción).

---

## 🐤 3. Despliegues Canario Automáticos con Flagger & Istio

El despliegue tipo **Canario** envía un porcentaje mínimo del tráfico real (por ejemplo, 5%) a la nueva versión (*Canary*), manteniendo el 95% restante en la versión estable (*Primary*).

```yaml
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: payment-api
  namespace: payments
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: payment-api
  service:
    port: 8080
    targetPort: 8080
  analysis:
    interval: 1m
    threshold: 5
    maxWeight: 50
    stepWeight: 10
    metrics:
      - name: request-success-rate
        thresholdRange:
          min: 99.5
        interval: 1m
      - name: request-duration
        thresholdRange:
          max: 200
        interval: 1m
```

Si durante el análisis Flagger detecta que el porcentaje de errores supera el 0.5% o que la latencia p99 excede los 200 ms, revierte instantáneamente el tráfico a la versión estable de forma automática (**Auto-Rollback**).

---
*Documento de Ingeniería Avanzada de Software - NMerge IA Enterprise Labs.*
