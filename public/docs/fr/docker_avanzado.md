# Fichiers Docker à plusieurs étapes et optimisation

> [!IMPORTANT]
> **🔐 Politique NGAC requise :** `DockerAdvanced`  
> **Durée estimée :** 20 minutes  
> **Profil :** Sénior

L'optimisation de la taille et de la surface d'attaque des images Docker est une exigence architecturale dans les écosystèmes cloud natifs modernes.

---

## 1. Constructions en plusieurs étapes

Les builds en plusieurs étapes vous permettent de compiler votre application dans un conteneur lourd (chargé de compilateurs et de dépendances de développement) et de transférer *exclusivement* les binaires ou l'empaquetage résultants vers une image finale extrêmement légère et sécurisée.

```fichier docker
# Étape 1 : Construire (environnement lourd en compilateur)
FROM nœud : constructeur AS 18 alpins
RÉPERT TRAVAIL /app
COPIER le paquet*.json ./
EXÉCUTER npm ci
COPIE. .
RUN npm exécuter la construction

#Étape 2 : Production (Environnement vierge et lumineux)
DE nginx: alpin
# On copie uniquement le résultat de l'étape précédente
COPIER --from=builder /app/dist /usr/share/nginx/html
EXPOSER 80
CMD ["nginx", "-g", "démon désactivé ;"]
```

> [!ASTUCE]
> Cette technique réduit non seulement considérablement les temps de téléchargement et de démarrage des conteneurs dans les pipelines CI/CD, mais minimise également la surface d'attaque en n'incluant pas les dépendances de développement (telles que « npm », « gcc » ou les outils de débogage) dans l'environnement de production final.

## 2. Mise en cache des couches

L'ordre des instructions dans un « Dockerfile » a un impact important sur la vitesse de *build*. Copiez les fichiers qui changent peu (comme `package.js

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

on`) antes de archivos que cambian mucho (código fuente) permite a Docker usar la caché.

```dockerfile
# ✅ Correcto: Solo instalar si package.json cambia
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

# ❌ Incorrecto: Invalida la caché de npm ci cada vez que editas código
COPY . .
RUN npm ci --omit=dev
```

---
*Fin de la Guía Avanzada. Para aprender sobre seguridad y FinOps, visita la Guía Experta.*
