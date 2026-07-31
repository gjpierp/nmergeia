# Datenschichtsicherheit (RLS)

Row-Level Security (RLS) überträgt die Mandantenfilterlogik der App direkt in die Datenbank.

## Vorteile von RLS in Postgres
Jede böswillige Abfrage, die „SELECT * FROM bills“ ohne Mandanten-ID ausführt, gibt 0 Zeilen zurück.

## Governance und Politik
RLS-Richtlinien werden mit „ALTER TABLE bills ENABLE ROW LEVEL SECURITY;“ aktiviert.

„Meerjungfrau
Diagramm TD
  A[Abfrage: SELECT * FROM user] --> B{RLS-Richtlinie}
  B -->|Tenant-ID-Übereinstimmung| C[Gibt 10 Zeilen zurück]
  B -->|Keine Übereinstimmung| D[Gibt 0 Zeilen zurück]
„

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

