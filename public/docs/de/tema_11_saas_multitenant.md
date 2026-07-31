# Mandantenfähige und mehrsprachige SaaS-Architekturen

## Datenisolierung
1. **Silo:** Eine Datenbank pro Client (teuer, sicher).
2. **Pool:** Alle Zeilen in derselben Tabelle mit „tenant_id“ + RLS (Wirtschaftlich).
3. **Bridge:** Ein Schema pro Client innerhalb derselben Datenbank.

## Globaler Standort
Verwendung von Bibliotheken wie „i18next“ in React zur Verarbeitung asynchroner dynamischer Wörterbücher.

„Meerjungfrau
Diagramm TD
  A[API-Gateway] -> B[Mandanten-A-Schema]
  A -> C[Mandanten-B-Schema]
  A -> D[Mandanten-C-Schema]
„

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

