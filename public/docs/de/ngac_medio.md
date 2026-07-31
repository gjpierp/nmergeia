# Mittleres Niveau

> [!TIP]
> Auf dieser Ebene werden statische Richtlinien (Who-is-Who) mit dynamischen Richtlinien gemischt, sodass Sie die Kontrolle in Echtzeit haben.

## Dynamische Richtlinien und Autorisierung

Im Gegensatz zu RBAC werden Änderungen bei NGAC sofort wirksam, ohne dass Sitzungen neu geladen oder JWT-Tokens neu verteilt werden müssen. Die Validierung erfolgt anhand des zentralisierten Autorisierungsdiagramms bei jeder kritischen Anfrage.

### Berechtigungsbewertung (Richtlinienbewertung)

Um zu beurteilen, ob eine Anfrage genehmigt wurde, fängt die NGAC-Engine die Anfrage ab.

„Meerjungfrau
Sequenzdiagramm
    Teilnehmer-Benutzer als Web-Client
    Teilnehmer-API als API-Gateway/Proxy
    Teilnehmer NGAC als Motor Sentinel-NGAC
    Teilnehmer-DB als Datenbank
    
    Benutzer->>API: GET /resources/protected/1
    API->>NGAC: Kann der Benutzer Objekt 1 lesen?
    
    rect rgb(20, 50, 40)
        Hinweis zu NGAC: Der Graph (PDP) wird ausgewertet
        NGAC-->>NGAC: Suchpfad: U -> UA -> OA <- O
    Ende
    
    alt Pfad gefunden
        NGAC-->>API: 200 OK (Zulässig)
        API->>DB: Daten abrufen
        DB -> API: Daten
        API -> Benutzer: 200 OK + Daten
    sonst nicht vorhandener Pfad
        NGAC-->>API: 403 Verboten
        API -> Benutzer: 403 Verboten
    Ende
„

## Policy Decision Point (PDP) und Policy Enforcement Point (PEP)
Der **PEP** (in unserem Fall der Request Interceptor) ist dafür verantwortlich, die Aktion zu stoppen und um Erlaubnis zu bitten. Der **PDP** (Sentinel-NGAC) ist das Gehirn, das durch die Grafik navigiert.

> [!ACHTUNG]
>

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

 No hardcodees los chequeos de seguridad en la lógica de negocio. Toda autorización debe manejarse limpiamente en el nivel PEP, dejando a los controladores (controllers) libres de lógica de seguridad.
