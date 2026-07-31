# Niveau de base

> [!IMPORTANT]
> Pour maîtriser NGAC, vous devez d'abord comprendre ses éléments fondamentaux. Chaque élément est un nœud dans le graphique d'autorisation.

## Éléments centraux (le noyau de base)

NGAC repose sur 5 grands types d’éléments :

1. **U (Utilisateurs) :** Les entités qui demandent l'accès.
2. **O (Objets) :** Les ressources protégées (fichiers, enregistrements de base de données, URL).
3. **UA (attributs utilisateur) :** Groupes d'utilisateurs (tels que les rôles, les départements ou les titres).
4. **OA (Attributs d'objet) :** Regroupements d'objets (tels que dossiers, étiquettes de confidentialité).
5. **Op (Opérations) :** Les actions autorisées (Lecture, Écriture, Supprimer).

### Le graphique des relations

Le contrôle d'accès dans NGAC est déterminé en traçant un chemin depuis un utilisateur (U) vers un objet (O).

```sirène
graphique TD
    U1[Utilisateur : Alice] -->|Attribué à| UA1 (attribut utilisateur : service informatique)
    UA1 -->|"Peut lire/écrire"| OA1 (attribut d'objet : serveurs de production)
    O1[Objet : App Server 1] -->|Appartient à| OA1
    
    U2[Utilisateur : Bob] -->|Attribué à| UA2 (attribut utilisateur : marketing)
    UA2 -->|Peut lire| OA2 (attribut d'objet : rapports publics)
    O2[Objet : Rapport Q1] -->|Appartient à| OA2
```

> [!NOTE]
> Dans ce diagramme, Alice hérite des autorisations sur « App Server 1 » car il existe un chemin valide : `Alice -> Département informatique -> (Lecture/écriture) -> Serveurs de production <- App Server 1`.

## Association

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

ones
Las asociaciones son aristas especiales que conectan un `UA` con un `OA` y contienen las Operaciones (Op). Las aristas regulares de pertenencia no contienen operaciones.
