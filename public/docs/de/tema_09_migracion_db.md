# Migration und Interoperabilität zwischen DBs

Strategien für den Ausstieg aus Legacy- oder On-Premise-Datenbanken (z. B. Oracle zu Postgres).

## Migrationstools
Verwendung von *AWS SCT (Schema Conversion Tool)* und *DMS (Data Migration Service)* für die CDC (Change Data Capture)-Replikation.

## Strangler-Feigen-Strategie
Von Tabelle zu Tabelle migrieren. Die Anwendung schreibt doppelt, bis die Integrität bestätigt ist.

„Meerjungfrau
Diagramm TD
  A[Monolithische App] -> B[Oracle DB]
  A -> C[Neuer Microservice]
  C -> D[PostgreSQL]
  B -. CDC Sync .-> D
„

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

