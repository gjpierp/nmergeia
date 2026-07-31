# Images, Volumes et Réseaux

> [!IMPORTANT]
> **🔐 Politique NGAC requise :** `DockerBasico`  
> **Durée estimée :** 10 minutes  
> **Profil :** Niveau Junior / Intermédiaire

Dans ce guide, nous expliquerons comment conserver les données des conteneurs et comment établir une communication entre plusieurs conteneurs à l'aide de réseaux personnalisés.

---

## 1. Gestion des volumes (Persistance)

Les conteneurs sont éphémères par conception. Si un conteneur est supprimé, toutes les informations écrites dans son système de fichiers interne sont perdues. Pour conserver les données (telles que les enregistrements dans une base de données Postgres), des **volumes** sont utilisés.

```bash
docker exécuter -d \
  --name ma-base de données \
  -v pgdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=[SECRET_MASKED_BY_DLP] \
  postgres:15-alpin
```

> [!ASTUCE]
> Les volumes gérés (comme « pgdata » ci-dessus) sont gérés par Docker et offrent de meilleures performances et sécurité que les montages liés de dossiers hôtes, en particulier dans les environnements Windows ou macOS.

## 2. Mise en réseau dans Docker

Pour que deux conteneurs communiquent entre eux en utilisant leurs noms (résolution DNS interne de Docker), ils doivent être connectés au même réseau.

### Créez un réseau personnalisé :
```bash
réseau docker créer un réseau local
```

### Exécutez des conteneurs sur le réseau :
```bash
docker run -d --name my-db --network local-net -e POSTGRES_PASSWORD=[SECRET_MASKED_BY_DLP] postgres:15-alpine
docker run -d --name mon-application --network local-net mon-image-application
```

> [!PAS

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

E]
> Estando en la misma red `local-net`, el contenedor `mi-app` puede conectarse a la base de datos usando el hostname `mi-db` en lugar de una dirección IP, asegurando alta cohesión y resiliencia.

---
*Fin de la Guía Básica. Para aprender orquestación multi-contenedor, visita la Guía Media.*
