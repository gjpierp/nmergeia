# Erweiterte Softwarearchitekturen

Der strukturelle Aufbau eines Systems bestimmt dessen Skalierbarkeit, Wartbarkeit und Ausfallsicherheit.

## Sechseckige Architektur (Ports und Adapter)
Trennt den Kern der Domäne von externen Abhängigkeiten (Datenbanken, Benutzeroberfläche, APIs). Die Domäne kennt die Infrastruktur nicht.
- **Ports:** Von der Domäne definierte Schnittstellen.
- **Adapter:** Technologische Implementierungen, die eine Verbindung mit Ports herstellen.

## Ereignisorientierte Architektur (EDA)
Die Komponenten kommunizieren durch die Emission und den Konsum asynchroner Ereignisse (Choreografie vs. Orchestrierung).
- Ideal für hochbelastete und schwach gekoppelte Systeme.

„Meerjungfrau
Diagramm TD
  A[UI-Adapter] ->|Befehl| B[Kerndomäne]
  C[DB-Adapter] -.->|Implementiert| D[Port-Repository]
  B -> D
  B -->|Veröffentlichen| E[Event-Bus]
„

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

