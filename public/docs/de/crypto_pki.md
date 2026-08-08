# 🔐 Guía Enterprise: PKI, TLS 1.3 & Criptografía Post-Cuántica

Bienvenido a la guía de ingeniería en **Infraestructura de Llave Pública (PKI)** y **Criptografía Avanzada**. En este documento analizaremos desde la jerarquía de Autoridades Certificadoras (CA) y la automatización con **Cert-Manager** hasta las optimizaciones de latencia en **TLS 1.3** y los nuevos estándares de **Criptografía Post-Cuántica (PQC)** recomendados por el NIST.

---

## 🏛️ 1. Jerarquía de Autoridades Certificadoras (PKI Architecture)

Una PKI corporativa robusta nunca utiliza la Autoridad Certificadora Raíz (*Root CA*) para firmar certificados de clientes o servidores finales directamente.

La CA Raíz se mantiene estrictamente fuera de línea (*Offline Root CA*) en una cámara de seguridad física o en un HSM desconectado de la red. Solo se enciende para firmar los certificados de las Autoridades Certificadoras Intermedias (*Intermediate CAs*).

```
                      +-----------------------------+
                      |   OFFLINE ROOT CA (RSA 4096)| (HSM / Desconectada)
                      +--------------+--------------+
                                     |
           +-------------------------+-------------------------+
           |                                                   |
+----------v------------------+             +------------------v----------+
| ISSUING CA 1 (ECDSA P-384)  |             | ISSUING CA 2 (ECDSA P-384)  | (En línea)
+--------------+--------------+             +------------------+----------+
               |                                               |
+--------------v--------------+                 +--------------v----------+
| Certificado Servidor TLS    |                 | Certificado Cliente mTLS|
+-----------------------------+                 +-------------------------+
```

---

## ⚡ 2. TLS 1.3: Reducción de Latencia & Seguridad Modernizada

TLS 1.3 elimina algoritmos obsoletos e inseguros (como RSA para intercambio de llaves, RC4, 3DES, MD5 y SHA-1) y exige **Perfect Forward Secrecy (PFS)** mediante Diffie-Hellman Ephemeral (ECDHE).

```
CLIENTE                                                             SERVIDOR
  |                                                                    |
  | -------- ClientHello + Key Share (ECDHE) ------------------------> |
  |                                                                    |
  | <------- ServerHello + Key Share + Certificate + Finished ------- |
  |                                                                    |
  | ======== DATOS CIFRADOS HTTP/2 (Solo 1 RTT transcurrido) ======= |
```

### 2.1 Conexiones 0-RTT (Resumption)
Para clientes que reanudan una sesión previa, TLS 1.3 permite enviar datos cifrados en el primer paquete de la conexión (**0-RTT**).

Para mitigar ataques de repetición (*Replay Attacks*) en 0-RTT, las aplicaciones deben asegurar que solo se transmitan peticiones idempotentes (como `GET` HTTP) en los primeros datos de reanudación.

---

## 🤖 3. Automatización de Certificados con Cert-Manager en Kubernetes

`cert-manager` es el operador estándar para automatizar la emisión y renovación de certificados X.509 en Kubernetes.

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: security-admin@enterprise.com
    privateKeySecretRef:
      name: letsencrypt-production-key
    solvers:
      - dns01:
          cloudflare:
            apiTokenSecretRef:
              name: cloudflare-api-token
              key: api-token
```

---

## ⚛️ 4. Criptografía Post-Cuántica (PQC) & Estándares NIST

Las computadoras cuánticas avanzadas que ejecuten el **Algoritmo de Shor** podrán romper la criptografía asimétrica actual (RSA, ECC, ECDSA) en cuestión de minutos.

Para prevenir ataques del tipo *Harvest Now, Decrypt Later* (donde los atacantes capturan tráfico cifrado hoy para descifrarlo en el futuro), el NIST ha estandarizado los primeros algoritmos post-cuánticos resistentes a computadoras cuánticas:

1. **ML-KEM (CRYSTALS-Kyber)**: Mecanismo de encapsulamiento de llaves asimétricas basado en redes matriciales (*Lattice-based cryptography*).
2. **ML-DSA (CRYSTALS-Dilithium)**: Esquema de firma digital post-cuántica de alto rendimiento.

```
+-----------------------------------------------------------------------+
| HÍBRIDO TRANSITORIO: ECDHE (P-256) + ML-KEM-768 (CRYSTALS-Kyber)       |
| Combina la seguridad probada clásica con resistencia cuántica futura. |
+-----------------------------------------------------------------------+
```

---
*Documento de Ingeniería Avanzada de Software - NMerge IA Enterprise Labs.*
