# 🛡️ Guía Enterprise: Zero-Trust Architecture, Service Mesh & SPIFFE/SPIRE

Bienvenido a la guía técnica de **Arquitectura Cero Confianza (Zero-Trust)**. En este documento analizaremos los principios operativos de *Nunca Confiar, Siempre Verificar*, la microsegmentación mTLS con **Service Mesh (Istio / Linkerd)** y la emisión de identidades criptográficas de cargas de trabajo con **SPIFFE/SPIRE**.

---

## 🏛️ 1. Paradigma Zero-Trust: Del Perímetro a la Identidad Criptográfica

El modelo de seguridad tradicional basado en un perímetro defensivo de red ("Castillo y Foso") asume que cualquier dispositivo dentro de la red corporativa es confiable por defecto.

El modelo **Zero-Trust** elimina por completo la confianza implícita basada en la ubicación de la red.

```
       CONEXIÓN ENTRANTE (Usuario / Microservicio)
                          |
                          v
  +--------------------------------------------------+
  |  EVALUACIÓN DE ACCESO CONDICIONAL CERO CONFIANZA |
  |                                                  |
  |  1. Identidad Criptográfica Auténtica (mTLS)    |
  |  2. Estado de Salud del Dispositivo               |
  |  3. Contexto de Riesgo en Tiempo Real             |
  |  4. Autorización Basada en Políticas (ABAC/NGAC) |
  +-----------------------+--------------------------+
                          |
              +-----------+-----------+
              |                       |
       [ PERMITIDO ]           [ DENEGADO ]
```

---

## 🔒 2. Microsegmentación mTLS con Service Mesh (Istio / Linkerd)

Un **Service Mesh** inyecta proxies al lado de cada pod (*Sidecar Proxies* como Envoy) que interceptan todo el tráfico de red entrante y saliente.

Establecen **TLS Mutuo (mTLS)** automático en modo estricto (`STRICT`), asegurando cifrado en tránsito y autenticación criptográfica bidireccional entre microservicios.

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default-strict-mtls
  namespace: production
spec:
  mtls:
    mode: STRICT
---
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: allow-checkout-to-payment
  namespace: production
spec:
  selector:
    matchLabels:
      app: payment-service
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/production/sa/checkout-service-sa"]
      to:
        - operation:
            methods: ["POST"]
            paths: ["/api/v1/charge"]
```

---

## 🆔 3. Identidad de Cargas de Trabajo con SPIFFE / SPIRE

**SPIFFE** (Secure Production Identity Framework for Everyone) define un estándar para emitir identidades criptográficas a cargas de trabajo en cualquier entorno (Kubernetes, Bare Metal, Multi-Cloud).

Cada microservicio recibe una URI única llamada **SPIFFE ID** codificada dentro de un certificado X.509 de corta duración (**SVID**).

```
spiffe://enterprise.local/ns/production/sa/payment-service-sa
```

```
+------------------+         Solicita Identidad        +-------------------+
| POD MICROSERVICIO| --------------------------------> | SPIRE AGENT       |
| (sin secretos)   | <-------------------------------- | (Nodo Kubernetes) |
+------------------+     Asigna SVID X.509 en Memoria +-------------------+
```

El agente **SPIRE** valida las propiedades atestadas del proceso (ID del contenedor, Hash de la imagen, Namespace) antes de entregar el certificado en memoria volátil, evitando el uso de claves secretas hardcodeadas en disco.

---

## ⚖️ 4. Control de Acceso Avanzado (ABAC & NGAC)

En entornos de alta seguridad, el control de acceso tradicional basado en roles (RBAC) es insuficiente.

**ABAC** (Attribute-Based Access Control) y **NGAC** (Next Generation Access Control) evalúan políticas basadas en atributos dinámicos del sujeto, del recurso y del entorno.

```
Permitir si:
  Sujeto.Rol == "Auditor" AND
  Sujeto.Ubicación == "Chile" AND
  Recurso.Clasificación == "Confidencial" AND
  Entorno.HoraActual BETWEEN 08:00 AND 18:00 AND
  Conexión.mTLS == TRUE
```

---
*Documento de Ingeniería Avanzada de Software - NMerge IA Enterprise Labs.*
