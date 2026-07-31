# NGAC wird auf Menüs und dynamische Ansichten angewendet

Die Integration von Sentinel-NGAC in ein Frontend erfordert die Auflösung des Berechtigungsdiagramms zur Laufzeit.

## Diagrammauflösung
Wenn sich ein Benutzer anmeldet, berechnet das NGAC-Backend alle gültigen Routen von seinem Knoten (Benutzer) zu den Menüobjekten (Objekt).

## Erfolgsgeschichte: safi-core
In großen ERP-Systemen wie „safi-core“ wird die Menüantwort in Redis zwischengespeichert. Bei Berechtigungsänderungen wird der Cache ungültig gemacht.

„Meerjungfrau
Sequenzdiagramm
  Frontend->>+Backend: Anfrage /Menü (JWT)
  Backend->>+Sentinel-NGAC: Pfade prüfen
  Sentinel-NGAC-->>-Backend: Erlaubte Objekte
  Backend-->>-Frontend: Menübaum
„

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

