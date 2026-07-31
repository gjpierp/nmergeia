# Evolution du contrôle d'accès

Des modèles classiques aux standards modernes.

## RBAC contre ABAC
- **RBAC (Basé sur les rôles) :** Autorisations liées aux rôles statiques. Problème : explosion des rôles.
- **ABAC (Basé sur les attributs) :** Autorisations liées aux attributs booléens.

## Principes fondamentaux du NGAC (Contrôle d'accès de nouvelle génération)
Norme NIST. Utilisez un graphique algébrique. Les utilisateurs et les objets sont connectés via des attributs et des associations.

```sirène
graphique TD
  UA[Attribut utilisateur] -->|Attribué| U[Utilisateur]
  OA[Attribut d'objet] -->|Attribué| O[Objet]
  UA -->|"Lecture/Ecriture"| O.A.
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

