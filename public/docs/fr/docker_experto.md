# Docker : pratiques avancées de sécurité et FinOps

> [!IMPORTANT]
> **🔐 Politique NGAC requise :** `DockerExperto`  
> **Durée estimée :** 25 minutes  
> **Profil :** Architecte / SRE

Normes de sécurité d'entreprise et implémentations efficaces pour les conteneurs dans les architectures cloud natives et de production.

---

## 1. Principe du moindre privilège (conteneurs sans racine)

Par défaut, les processus à l'intérieur des conteneurs Docker s'exécutent en tant qu'utilisateur « root ». Cela représente une vulnérabilité d’élévation de privilèges si un attaquant s’échappe du conteneur.

Chaque conteneur doit s'exécuter en tant qu'utilisateur non privilégié en créant des groupes explicites.

```fichier docker
DE nœud : 18-alpin

# Définir le répertoire de travail
RÉPERT TRAVAIL /app

# Copier les dépendances (production uniquement)
COPIER le paquet*.json ./
EXÉCUTER npm ci --omit=dev

# Copier le code source
COPIE. .

# Autorisations de transfert et changement de contexte
# node-alpine inclut l'utilisateur 'node' par défaut
Nœud UTILISATEUR

CMD ["nœud", "serveur.js"]
```

> [!AVERTISSEMENT]
> N'exécutez pas de binaires mis à l'échelle (avec SetUID) et, si possible, montez les systèmes de fichiers en lecture seule (`read_only : true` dans docker-compose) à l'exception des dossiers temporaires explicitement désignés dans la mémoire partagée (tmpfs).

## 2. Limites et FinOps (Garde-corps de ressources)

Autoriser un conteneur à accéder à toute la mémoire et au processeur de l'hôte (comportement par défaut) expose le système à des pannes complètes en cas de fuite de mémoire ou d'attaques par déni de service.

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

ervicio, y eleva innecesariamente el consumo en entornos Cloud.

Implementa presupuestos de infraestructura (FinOps Guardrails):

```yaml
version: '3.8'
services:
  api:
    image: mi-api
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.10'
          memory: 128M
```

## 3. Escaneo de Vulnerabilidades (DAST/SAST en Imágenes)

Antes de promover un contenedor hacia los registros productivos, debe atravesar un control de escaneo de Common Vulnerabilities and Exposures (CVEs) utilizando herramientas como Trivy o el escáner nativo de Docker.

```bash
docker scout cves mi-api:latest
```

---
*Fin de la Guía Experta. Has alcanzado el dominio operativo de Docker.*
