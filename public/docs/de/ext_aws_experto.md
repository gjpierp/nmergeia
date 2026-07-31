# Event-Driven Architecture, SQS, SNS und EventBridge

Bisher haben wir synchrone Lambdas verwendet: Der Benutzer stellt eine HTTP-Anfrage, wartet 500 ms und erhält eine HTTP-Antwort.

Aber was passiert, wenn wir bei der Erstellung eines Benutzerkontos ein PDF generieren, 3 Willkommens-E-Mails senden, die Zahlung verarbeiten und das Unternehmen benachrichtigen müssen? Wenn du all das in der Lambda machst, die das HTTP bedient, wird der Benutzer 12 Sekunden lang auf einen Ladebildschirm starren. Und schlimmer noch: Wenn der E-Mail-Dienst in der 11. Sekunde ausfällt, verlierst du die gesamte Transaktion.

In der Enterprise-Architektur wechseln wir zu einem **asynchronen und ereignisgesteuerten Modell (Event-Driven)**.

## 1. Das Triumvirat des AWS Messaging

```mermaid
graph TD
    API[API Gateway] --> LambdaAuth[Lambda Benutzer Erstellen]
    LambdaAuth -->|Veröffentlicht Ereignis UsuarioCreado| Broker{Event Bus}
    LambdaAuth -.->|Antwortet SOFORT 201| Usuario
    
    Broker -->|"Benachrichtigt (Fan-Out)"| Queue1[SQS Warteschlange (E-Mails)]
    Broker -->|"Benachrichtigt (Fan-Out)"| Queue2[SQS Warteschlange (Zahlungen)]
    Broker -->|"Benachrichtigt (Fan-Out)"| Queue3[SQS Warteschlange (Berichte)]
    
    Queue1 --> LambdaEmail[Lambda E-Mail Senden]
    Queue2 --> LambdaPago[Lambda Zahlung Verarbeiten]
```

### AWS SNS (Simple Notification Service)
Es ist ein **Pub/Sub-System (Publisher/Subscriber)**. Die Lambda sendet EIN einziges Nachricht an ein SNS-"Thema" (Topic). Dieses Thema verteilt Klone der Nachricht sofort an Tausende von Abonnenten (Fan-Out-Effekt).

### AWS SQS (Simple Queue Service)
Es ist eine **Nachrichtenwarteschlange (Message Queue)**. Nachrichten sammeln sich an und warten darauf, verarbeitet zu werden. Es ist grundlegend, um den "Druck" (Backpressure) zu kontrollieren.
Wenn du am Black Friday 50.000 Käufe erhältst, hält SQS diese zurück und deine Lambda nimmt sie zu 100 pro Minute auf, anstatt 50.000 Zahlungs-Lambdas gleichzeitig aufzurufen und dein Zahlungsgateway zum Einsturz zu bringen, was 0% Ausfälle garantiert.

### Amazon EventBridge (Der Enterprise Bus)
Es ist die Weiterentwicklung von SNS für riesige Microservice-Architekturen. Es ermöglicht die Erstellung intelligenter Filterregeln.
Beispiel: EventBridge empfängt ein JSON. Wenn das JSON `"tipo": "PAGO_RECHAZADO"` sagt, leitet es es direkt an den Betrugs-Microservice (Microservicio de Fraude) weiter, ohne die anderen zu wecken.

## 2. Dead Letter Queues (DLQ)

Murphys Gesetz besagt, dass Systeme ausfallen werden. Was passiert, wenn die Lambda, die E-Mails sendet, fehlschlägt, weil SendGrid down ist?

Dank SQS kehrt die Nachricht in die Warteschlange zurück und wird automatisch erneut versucht, wenn die Lambda eine Ausnahme auslöst. Wenn sie dreimal hintereinander fehlschlägt, wird die Nachricht an eine **Dead Letter Queue (Warteschlange für unzustellbare Nachrichten)** gesendet.
Dies ermöglicht es dir, schlafen zu gehen. Am nächsten Tag überprüfst du die DLQ, behebst den Bug in deinem Code und sagst AWS: "Verarbeite diese 500 fehlgeschlagenen Nachrichten erneut". Es gehen niemals Daten verloren.

## 3. Maximale Ausfallsicherheit (Resilienz)
Durch die Verwendung dieses Musters antwortet deine API immer in 50 Millisekunden. Die schwere Arbeit findet im Hintergrund auf verteilte, automatisch skalierbare Weise statt, mit automatischen Wiederholungsversuchen und ohne Datenverlust. Das ist die wahre Macht der Cloud.

Auf der Stufe der **Optimierungen (Optimizaciones)** wirst du die finanziellen Kosten (FinOps) und Engpässe durch Lambdas in C/Rust, Provisioned Concurrency und DAX für Mikrosekunden-Caches minimieren.
