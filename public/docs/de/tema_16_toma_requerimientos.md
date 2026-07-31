# Erweiterte Anforderungen und DDD

Eine effektive Anforderungserfassung ist der Grundstein für ein erfolgreiches Produkt, weg von statischen Dokumenten hin zur gemeinschaftlichen Ermittlung.

## Domain-Driven Design (DDD)
Ansatz, der das mentale Modell des Unternehmens mit dem Code durch *Ubiquitous Language* (Ubiquitous Language) vereint.
- **Begrenzte Kontexte:** Explizite Grenzen, bei denen Begriffe eine einzige Bedeutung haben.

## Event Storming
Visuelle Workshop-Technik (unter Verwendung von Post-its) zur Modellierung komplexer Geschäftsabläufe durch Identifizierung von *Domänenereignissen*, *Befehlen* und *Aggregationen*.

„Meerjungfrau
Grafik LR
  A[Befehl: Bestellung erstellen] --> B[Hinzufügen: Bestellung]
  B -> C[Ereignis: Auftrag erstellt]
  C --> D[Richtlinie: Sendung benachrichtigen]
  D -> E[Befehl: E-Mail senden]
„

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

