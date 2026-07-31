# Fortgeschrittenes Niveau

> [!IMPORTANT]
> Auf einer fortgeschrittenen Ebene beginnen wir mit der Kombination mehrerer Diagramme, bekannt als „Richtlinien“ oder Richtlinienklassen, und fügen dynamische Attribute wie Zeit oder Ort hinzu (ABAC innerhalb von NGAC).

## Bedingte Auswertungen

Bei fortgeschrittenem NGAC reicht ein Pfad im Diagramm nicht aus. Wir können „Bedingungen“ mit Assoziationen verknüpfen.

### Zeit- und Statusbeschränkungen

„Meerjungfrau
Diagramm TD
    U[Benutzer: Kassierer] ->|UA| Kassierer (Kassierer)
    
    Kassierer – Können verarbeiten –> OA1 (Registrierkassen)
    
    Kassierer -. Bedingung: Nur Arbeitszeit .-> OA1
    
    O[Box 01] -> OA1
    O2[Box 02] -> OA1
„

Wenn der Benutzer „Cashier“ um 3:00 Uhr morgens versucht, auf „Cash 01“ zuzugreifen, findet die NGAC-Engine den Weg, aber die Randbedingung schlägt fehl. Daher wird der Zugriff verweigert.

### Aufgabentrennung (SoD)

Mit NGAC können Sie SoD einfach implementieren, indem Sie **Ban Constraints** deklarieren. 
- Wenn Alice eine Kaufanfrage genehmigt, generiert das Diagramm dynamisch einen Knoten, der Alice das Recht verweigert, den Scheck für denselben Kauf zu unterzeichnen.

> [!TIP]
> Durch die Nutzung dynamischer Objektattribute können Sie Informationen granular isolieren, ohne Millionen von Rollen erstellen zu müssen (Rollenexplosion).

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

