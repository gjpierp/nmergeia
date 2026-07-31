# Datenaufnahme und verteilte Konsistenz

Microservices erfordern Choreografie und Orchestrierung.

## Saga-Muster
Wenn eine verteilte Transaktion fehlschlägt, führt das Saga-Muster *Kompensationsaktionen* aus, um ein Rollback auf andere Mikrodienste durchzuführen.

## ETL vs. ELT
- **ETL:** Transformation auf dem Bus.
- **ELT:** Massive Transformation innerhalb des Data Warehouse (z. B. Snowflake/BigQuery).

„Meerjungfrau
Grafik LR
  A[Bestellservice] ->|Erstellen| B[Zahlungsdienst]
  B -->|Fehlgeschlagen| C[Inventarservice]
  C -->|Kompensieren| A
„

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

