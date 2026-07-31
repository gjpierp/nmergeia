# Anfangsstufe

> [!NOTE]
> NGAC (Next Generation Access Control) ist ein NIST-standardisiertes Zugangskontrollmodell, das die Einschränkungen von RBAC (Role-Based Access Control) und ABAC (Attribute-Based Access Control) überwinden soll.

## Was ist NGAC?

Im Gegensatz zu herkömmlichen Modellen zentralisiert NGAC die Richtlinienverwaltung, indem es sie durch gerichtete Diagramme ausdrückt. In NGAC ist alles (Benutzer, Objekte, Operationen) ein Knoten in einem Diagramm, und der Zugriff wird durch die Suche nach einem gültigen Pfad vom Benutzer zum Objekt bestimmt.

### NGAC vs. traditionelle Modelle

„Meerjungfrau
Diagramm TD
    A[Traditionelle Modelle] -> B(RBAC: Rolle -> Berechtigung)
    A -> C (ABAC: Komplexe und langsame Regeln)
    
    D[NGAC] -> E(Beziehungsdiagramme)
    D -> F (lineare und schnelle Auswertung)
    
    B -.-> G[Schwer zu skalieren und zu prüfen]
    C -.-> G
    
    E -.-> H[Skalierbarkeit und natürliches Audit]
    F -.-> H
„

> [!TIP]
> Wenn Ihr System sich schnell ändernde Richtlinien benötigt (z. B. um einem Auftragnehmer nur während seiner Schicht Zugang zu gewähren), erledigt NGAC dies auf natürliche Weise, indem es einfach Kanten im Diagramm hinzufügt oder entfernt.

## Hauptvorteile
1. **Flexibilität:** Ermöglicht die Emulation von RBAC, ABAC, MAC und DAC in einem einzigen Modell.
2. **Prüfung:** Beantworten Sie die Frage „Wer kann auf diese Datei zugreifen?“ ist eine einfache Graph-Traversal-Abfrage.
3. **Leistung:** Moderne Graphdatenbanken lösen Berechtigungen in Millisekunden auf.

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

