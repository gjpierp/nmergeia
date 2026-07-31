# orchestration locale

> [!IMPORTANT]
> **🔐 Politique NGAC requise :** `DockerMedio`  
> **Durée estimée :** 15 minutes  
> **Profil :** Niveau intermédiaire

La gestion de dizaines de commandes Docker dans un terminal devient insoutenable lorsque les écosystèmes se développent. `docker-compose` résout ce problème en nous permettant de définir et d'exécuter des applications multi-conteneurs à l'aide d'un fichier YAML déclaratif.

---

## 1. fichier docker-compose.yml

Le manifeste d'infrastructure en tant que code (IaC) pour les environnements sur site est écrit en YAML. Un environnement standard avec application et base de données ressemblerait à ceci :

```yaml
version : '3.8'
prestations :
  API :
    construire : .
    ports :
      - "3000:3000"
    environnement :
      - DB_HOST=base de données
    cela dépend :
      -db
    réseaux :
      - écosystème

  BD :
    image : postgres:15-alpine
    environnement :
      - POSTGRES_PASSWORD=[SECRET_MASKED_BY_DLP]
    tomes :
      - pgdata:/var/lib/postgresql/data
    réseaux :
      - écosystème

tomes :
  pgdonnées :

réseaux :
  écosystème :
    pilote:pont
```

## 2. Composer les commandes principales

- **Augmenter l'ensemble de l'écosystème (en arrière-plan) :** `docker-compose up -d`
- **Forcer la reconstruction des images avant de les soulever :** `docker-compose up -d --build`
- **Détruire l'écosystème (conteneurs et réseaux éphémères) :** `docker-compose down`
- **Afficher les journaux consolidés (logs) de tous les services :** `docker-compose logs -f`

> [!AVERTISSEMENT]
> N'utilisez jamais la commande `docker-compose down -v` dans les environnements professionnels

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

ductivos o de staging a menos que desees eliminar irreversiblemente los volúmenes de datos que persisten la información de las bases de datos.

---
*Fin de la Guía Media. Para aprender sobre optimización de imágenes (Multi-stage), visita la Guía Avanzada.*
