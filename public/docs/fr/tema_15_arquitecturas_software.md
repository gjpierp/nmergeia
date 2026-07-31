# Architectures logicielles avancées

La conception structurelle d'un système dicte son évolutivité, sa maintenabilité et sa résilience.

## Architecture hexagonale (ports et adaptateurs)
Sépare le cœur du domaine des dépendances externes (bases de données, interface utilisateur, API). Le domaine ne connaît pas l'infrastructure.
- **Ports :** Interfaces définies par le domaine.
- **Adaptateurs :** implémentations technologiques qui se connectent aux ports.

## Architecture orientée événements (EDA)
Les composants communiquent via l'émission et la consommation d'événements asynchrones (Chorégraphie vs Orchestration).
- Idéal pour les systèmes à charge élevée et faiblement couplés.

```sirène
graphique TD
  A[Adaptateur UI] -->|Commande| B[Domaine principal]
  C[Adaptateur DB] ->|Outils| D[Référentiel de ports]
  B --> D
  B -->|Publier| E[Bus d'événement]
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

