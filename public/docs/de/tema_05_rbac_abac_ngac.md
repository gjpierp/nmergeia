# Entwicklung der Zugangskontrolle

Von klassischen Modellen bis hin zu modernen Standards.

## RBAC gegen ABAC
- **RBAC (rollenbasiert):** Berechtigungen, die an statische Rollen gebunden sind. Problem: Rollenexplosion.
- **ABAC (attributbasiert):** Berechtigungen, die an boolesche Attribute gebunden sind.

## NGAC-Grundlagen (Next Generation Access Control).
NIST-Standard. Verwenden Sie einen algebraischen Graphen. Benutzer und Objekte werden durch Attribute und Assoziationen verbunden.

„Meerjungfrau
Diagramm TD
  UA[Benutzerattribut] ->|Zugewiesen| U[Benutzer]
  OA[Objektattribut] ->|Zugewiesen| O[Objekt]
  UA -->|"Lesen/Schreiben"| O.A.
„

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

