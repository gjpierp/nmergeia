# Mehrstufige Docker- und Container-Strategien

Die Reduzierung der Angriffsfläche und des Gewichts von Docker-Images (auf <50 MB) ist ein wichtiges Ziel von DevSecOps.

## Mehrstufige Builds
Es ermöglicht Ihnen, den Code in einem umfangreichen Image (z. B. „node:18-alpine“) zu kompilieren und nur die resultierenden Binärdateien oder Statiken in ein verteilungsloses oder ultraleichtes Image (z. B. „nginx:alpine“) zu verschieben.

## Docker Compose für lokale Orchestrierung
Die Datei „docker-compose.yml“ erleichtert die Einrichtung isolierter virtueller Netzwerke.

„Meerjungfrau
Diagramm TD
  A[Stufe 1: Erstellen] ->|Binärdateien kopieren| B[Stufe 2: Distroless]
  B --> C[Bild < 50 MB]
  C -> D[Sichere Bereitstellung]
„

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

