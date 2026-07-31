# niveau expert

> [!ATTENTION]
> Le NGAC à l'échelle de l'entreprise nécessite un contrôle strict des performances (latence) et de la disponibilité des points de décision politiques (PDP).

## Architecture distribuée NGAC

Dans les systèmes Cloud Native, vous ne pouvez pas permettre au PDP de devenir un goulot d'étranglement ou un point de défaillance unique (SPOF). 

### Partage de graphiques et cache

```sirène
graphique TD
    API[API Gateway] --> PEP[Policy Enforcement Point]
    
    PEP -> CACHE[(Redis / Memcached)]
    
    CACHE -- "Cache Miss" -> PDP [Point de décision de politique NGAC]
    
    PDP --> GDB[(Base de données graphique - Neo4j / ArangoDB)]
    
    PIP[Point d'information sur la politique] -->|Contexte de mise à jour| PDP
```

Pour assurer des latences inférieures à 10ms :
1. **PEP Level Cache :** Mémorisez les résultats d'autorisation pendant quelques minutes si les politiques ne sont pas très volatiles (Mémoisation).
2. **Graph DB :** Utilisez des bases de données graphiques natives (par exemple Neo4j, Amazon Neptune) pour éviter le coûteux `JOIN` récursif requis par SQL.

## Audit et conformité continus

NGAC brille dans l’analyse réglementaire (Conformité). Vous pouvez exécuter des algorithmes « Review » pour détecter les vulnérabilités dans les paramètres de stratégie.

> [!NOTE]
> Avec une requête Cypher dans Neo4j, vous pouvez prouver mathématiquement que **"Aucun utilisateur externe ne dispose d'un chemin qui se connecte à un objet marqué de PII"**, offrant ainsi des garanties formelles aux auditeurs.

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

