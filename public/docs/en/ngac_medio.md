# Motores de Decisión (PDP/PEP)

En una arquitectura Zero-Trust, separamos la ejecución de la decisión.

```mermaid
flowchart TD
A["Usuario Web"] --> B(API Gateway / PEP)
B -->|Solicita Permiso| C{Motor NGAC / PDP}
C -->|"Allow/Deny"| B
B -->|Si es Allow| D["Microservicio de BD"]
```

* **PEP (Policy Enforcement Point):** El proxy que detiene el tráfico.
* **PDP (Policy Decision Point):** El cerebro que evalúa el Grafo NGAC.
