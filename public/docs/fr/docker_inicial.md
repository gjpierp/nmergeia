# déploiement sans configuration et concepts de base

> [!IMPORTANT]
> **🔐 Politique NGAC requise :** `DockerInitial`  
> **Durée estimée :** 5 minutes  
> **Profil :** Junior

Bienvenue dans le guide de démarrage de Docker. Cet outil est le standard pour garantir que nos applications fonctionnent dans des environnements isolés (conteneurs), évitant ainsi le classique « ça marche sur ma machine ».

---

## 1. Qu'est-ce que Docker ?

Docker vous permet de regrouper des logiciels dans des unités standardisées appelées conteneurs, qui incluent tout ce qui est nécessaire à l'exécution du logiciel : code, runtime, outils système et bibliothèques. Un conteneur s'exécute directement au-dessus du noyau du système d'exploitation hôte, ce qui le rend beaucoup plus léger qu'une machine virtuelle.

## 2. Exécutez votre premier conteneur

Pour vérifier que Docker s'exécute dans votre environnement, vous pouvez exécuter votre premier conteneur éphémère :

```bash
docker run --rm bonjour-monde
```

> [!NOTE]  
> L'indicateur `--rm` indique à Docker que le conteneur sera automatiquement supprimé une fois son exécution terminée, gardant votre système propre.

## 3. Commandes essentielles du terminal

La vie quotidienne avec Docker nécessite de connaître les commandes fondamentales d'inspection et de contrôle :

- **Liste des conteneurs actifs :** `docker ps`
- **Liste de tous les conteneurs (y compris arrêtés) :** `docker ps -a`
- **Arrêter un conteneur en cours d'exécution :** `docker stop <container_id_or_name>`
- **Afficher les journaux d'un conteneur :** `docker logs <container_id_o_name>`

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

- **Inspeccionar características (IP, volumen, red):** `docker inspect <container_id>`

---
*Fin de la Guía Inicial. Para aprender sobre persistencia de datos y comunicación de red, visita la Guía Básica.*
