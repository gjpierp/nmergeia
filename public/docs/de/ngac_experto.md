# Expertenebene

> [!ACHTUNG]
> NGAC auf Unternehmensebene erfordert eine strenge Kontrolle der Leistung (Latenz) und Verfügbarkeit des Policy Decision Point (PDP).

## Verteilte NGAC-Architektur

In Cloud Native-Systemen dürfen Sie nicht zulassen, dass der PDP zu einem Engpass oder Single Point of Failure (SPOF) wird. 

### Graph Sharding und Cache

„Meerjungfrau
Diagramm TD
    API[API-Gateway] -> PEP[Policy Enforcement Point]
    
    PEP --> CACHE[(Redis / Memcached)]
    
    CACHE – „Cache Miss“ –> PDP[NGAC Policy Decision Point]
    
    PDP --> GDB[(Graph Database - Neo4j / ArangoDB)]
    
    PIP[Richtlinieninformationspunkt] -->|Kontext aktualisieren| PDP
„

Um Latenzen von weniger als 10 ms sicherzustellen:
1. **PEP-Level-Cache:** Autorisierungsergebnisse einige Minuten lang speichern, wenn die Richtlinien nicht sehr volatil sind (Memoisierung).
2. **Graph DB:** Verwenden Sie native Graphdatenbanken (z. B. Neo4j, Amazon Neptune), um das kostspielige rekursive „JOIN“ zu vermeiden, das für SQL erforderlich ist.

## Kontinuierliche Prüfung und Compliance

NGAC glänzt in der regulatorischen Analyse (Compliance). Sie können „Überprüfungs“-Algorithmen ausführen, um Schwachstellen in Richtlinieneinstellungen zu erkennen.

> [!NOTE]
> Mit einer Cypher-Abfrage in Neo4j können Sie mathematisch beweisen, dass „Kein externer Benutzer einen Pfad hat, der zu einem mit PII markierten Objekt führt“**, und bieten Prüfern formale Garantien.

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

