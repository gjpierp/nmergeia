# Infrastruktur als Code und Unveränderlichkeit

Infrastructure as Code (IaC) stellt sicher, dass Umgebungen reproduzierbar sind.

## Terraform und dezentraler Staat
Terraform verwendet die Datei „terraform.tfstate“, um Cloud-Ressourcen abzubilden. Es muss remote gespeichert werden (z. B. S3 + DynamoDB für Sperren).

## Blaugrüne und kanarische Bereitstellungen
- **Blau-Grün:** Zwei identische Umgebungen. Keine Ausfallzeiten.
- **Canary:** Schrittweise Bereitstellung für 5 % der Benutzer, schrittweise Skalierung, wenn keine Fehler auftreten.

„Meerjungfrau
Grafik LR
  A[Terraform Code] -> B[Plan]
  B -> C[Anwenden]
  C -> D[AWS/GCP/Azure]
„

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

