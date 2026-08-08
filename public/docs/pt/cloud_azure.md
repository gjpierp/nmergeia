# 🔷 Guía Enterprise: Azure Architecture, AKS & Entra ID

Bienvenido a la guía técnica sobre **Microsoft Azure Enterprise Architecture**. En este documento revisaremos desde la infraestructura gestionada de contenedores en **Azure Kubernetes Service (AKS)** hasta la gobernanza de identidad con **Microsoft Entra ID** (anteriormente Azure Active Directory) y el almacenamiento inmutable en **Azure Blob Storage**.

---

## 🏛️ 1. Estructura Jerárquica de Gobernanza en Azure

Para evitar la dispersión de recursos y garantizar el control financiero (*FinOps*), Azure organiza la infraestructura en cuatro niveles jerárquicos estrictos.

```
                   +----------------------------------+
                   |    GRUPOS DE GESTIÓN (Management) |
                   +----------------+-----------------+
                                    |
                   +----------------v-----------------+
                   |     SUSCRIPCIONES (Subscriptions)|
                   +----------------+-----------------+
                                    |
                   +----------------v-----------------+
                   |    GRUPOS DE RECURSOS (RG)       |
                   +----------------+-----------------+
                                    |
                   +----------------v-----------------+
                   | RECURSOS (AKS, Key Vault, Blobs) |
                   +----------------------------------+
```

Esta jerarquía permite aplicar políticas de cumplimiento legal mediante **Azure Policy** e imponer límites presupuestarios con **Azure Cost Management** de manera centralizada.

---

## ⚙️ 2. Azure Kubernetes Service (AKS) Enterprise

AKS es el servicio administrado de Kubernetes en Azure. Proporciona integración nativa con redes virtuales VNet y almacenamiento gestionado.

```bash
# Crear un clúster AKS de producción con Azure CNI, Entra ID y Zonas de Disponibilidad
az aks create \
  --resource-group rg-enterprise-prod \
  --name aks-core-prod \
  --node-count 3 \
  --node-vm-size Standard_D4s_v5 \
  --network-plugin azure \
  --enable-managed-identity \
  --enable-aad \
  --aad-admin-group-object-ids "a1b2c3d4-5678-90ab-cdef-1234567890ab" \
  --zones 1 2 3 \
  --enable-cluster-autoscaler \
  --min-count 3 \
  --max-count 15
```

### 2.1 Integración con Azure Key Vault via CSI Driver
En lugar de almacenar secretos en formato Base64 plano dentro de Kubernetes Secret objects, AKS utiliza **Azure Key Vault Provider for Secrets Store CSI Driver**.

Los secretos se sincronizan dinámicamente desde Azure Key Vault hacia los pods montados en memoria RAM (`tmpfs`), garantizando cifrado en reposo con claves gestionadas por el usuario (HSM FIPS 140-2 Nivel 3).

---

## 🔒 3. Almacenamiento Inmutable en Azure Blob Storage (WORM)

Azure Blob Storage soporta la política **WORM** (*Write Once, Read Many*), esencial para cumplimiento regulatorio financiero e industrial.

```json
{
  "immutabilityPeriodSinceCreationInDays": 3650,
  "state": "Locked",
  "allowProtectedAppendWrites": false
}
```

Una vez que una política de retención inmutable es bloqueada (*Locked*), **nadie** (ni siquiera los administradores globales de la cuenta ni el soporte de Microsoft) puede modificar o eliminar los archivos almacenados hasta que venza el plazo fijado.

---

## 🆔 4. Microsoft Entra ID & RBAC Cero Confianza

Microsoft Entra ID gobierna la identidad corporativa mediante **Conditional Access Policies**.

Evalúa en tiempo real señales como la ubicación IP, la salud del dispositivo Intune y el riesgo del usuario antes de conceder acceso a los recursos de Azure.

```bash
# Asignar rol explícito a una identidad administrada sobre Azure Blob Storage
az role assignment create \
  --assignee "b1c2d3e4-f5a6-7890-bcde-f1234567890a" \
  --role "Storage Blob Data Contributor" \
  --scope "/subscriptions/sub-123/resourceGroups/rg-prod/providers/Microsoft.Storage/storageAccounts/stenterprise"
```

---
*Documento de Ingeniería Avanzada de Software - NMerge IA Enterprise Labs.*
