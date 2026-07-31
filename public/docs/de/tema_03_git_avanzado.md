# Erweiterte Git-Workflows

Für eine Zusammenarbeit im großen Maßstab sind effiziente Verzweigungsstrategien erforderlich.

## Trunk-basierte Entwicklung vs. GitFlow
- **Trunk-basiert:** Direkte kontinuierliche Integration in „main“. Erfordert *Feature Flags* und striktes TDD. Reduziert Konflikte.
- **GitFlow:** Ideal für streng versionierte Releases („develop“, „release“, „main“).

## Git Hooks und Husky
Mit Husky können Sie Skripte ausführen, bevor Sie Code festschreiben (z. B. Linting, Prettier, Unit Testing).

„Meerjungfrau
gitGraph
  begehen
  Zweigmerkmal/A
  Checkout-Funktion/A
  begehen
  Hauptkasse
  Merge-Funktion/A
  Commit-ID: „v1.0“ Tag: „Release“
„

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

