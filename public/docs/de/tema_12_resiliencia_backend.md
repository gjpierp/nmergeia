# Backend-Ausfallsicherheit und Fehlertoleranz

Ein modernes System geht nicht davon aus, dass das Netzwerk vertrauenswürdig ist.

##Leistungsschalter
Wenn ein externer Mikrodienst ständig ausfällt, „öffnet“ sich die Schleife, indem sie schnelle Fehler zurückgibt, anstatt Ausführungsthreads einzufrieren.

## Ratenbegrenzung und -drosselung
Schutz vor DDOS und Missbrauch. *Token Bucket*-Algorithmen mit Redis.

„Meerjungfrau
Grafik LR
  A[Client] -> B[API-Gateway]
  B -->|Langsamer Anruf| C{Leistungsschalter}
  C -->|Öffnen| D[Fallback-Antwort]
  C -->|Geschlossen| E[Königlicher Dienst]
„

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

