# Grundstufe

> [!IMPORTANT]
> Um NGAC zu beherrschen, müssen Sie zunächst seine Grundbausteine verstehen. Jedes Element ist ein Knoten im Autorisierungsdiagramm.

## Zentrale Elemente (Der grundlegende Kern)

NGAC basiert auf 5 Haupttypen von Elementen:

1. **U (Benutzer):** Die Entitäten, die Zugriff anfordern.
2. **O (Objekte):** Die Ressourcen, die geschützt werden (Dateien, Datenbankeinträge, URLs).
3. **UA (Benutzerattribute):** Benutzergruppen (z. B. Rollen, Abteilungen oder Titel).
4. **OA (Objektattribute):** Gruppierungen von Objekten (z. B. Ordner, Vertraulichkeitsetiketten).
5. **Op (Operationen):** Die zulässigen Aktionen (Lesen, Schreiben, Löschen).

### Das Beziehungsdiagramm

Die Zugriffskontrolle in NGAC wird durch die Verfolgung eines Pfads von einem Benutzer (U) zu einem Objekt (O) bestimmt.

„Meerjungfrau
Diagramm TD
    U1[Benutzer: Alice] -->|Zugewiesen an| UA1 (Benutzerattribut: IT-Abteilung)
    UA1 -->|"Kann Lesen/Schreiben"| OA1 (Objektattribut: Produktionsserver)
    O1[Objekt: App Server 1] -->|Gehört zu| OA1
    
    U2[Benutzer: Bob] -->|Zugewiesen an| UA2 (Benutzerattribut: Marketing)
    UA2 -->|Kann Lesen| OA2 (Objektattribut: Öffentliche Berichte)
    O2[Objekt: Bericht Q1] -->|Gehört zu| OA2
„

> [!NOTE]
> In diesem Diagramm erbt Alice Berechtigungen für „App Server 1“, weil es einen gültigen Pfad gibt: „Alice -> IT-Abteilung -> (Lesen/Schreiben) -> Produktionsserver <- App Server 1“.

## Verein

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

ones
Las asociaciones son aristas especiales que conectan un `UA` con un `OA` y contienen las Operaciones (Op). Las aristas regulares de pertenencia no contienen operaciones.
