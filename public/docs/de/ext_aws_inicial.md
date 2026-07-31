# Cloud Computing und Serverless-Architektur

Willkommen in der Cloud. Über Jahrzehnte hinweg bedeutete das Hosting einer Anwendung, physische Server zu mieten (Bare-Metal). Dann gingen wir zu virtuellen Maschinen (EC2) und Containern (Docker) über. Heute ist der Gipfel der Evolution **Serverless**.

## 1. Was bedeutet "Serverless"?

Serverless (ohne Server) bedeutet nicht, dass die Server auf magische Weise verschwunden sind. Es bedeutet, dass **die Verwaltung, Skalierbarkeit und Wartung der Server für dich völlig unsichtbar sind.**

```mermaid
graph LR
    Usuario[Benutzer] -->|HTTP Request| API[API Gateway]
    API -->|Löst aus| Lambda[AWS Lambda (Code)]
    Lambda -->|Fragt ab| DB[(DynamoDB)]
    
    subgraph sub_1 ["Du verwaltest kein Betriebssystem, keine Patches, keinen RAM"]
        API
        Lambda
        DB
    end
```

### Radikale Vorteile
* **Zahlen nach tatsächlicher Nutzung (Pay-per-Use):** Wenn deine App am Wochenende 0 Benutzer hat, zahlst du exakt $0.00. (Im Gegensatz zu einem VPS, der 24/7 berechnet).
* **Unendliche und sofortige Skalierung:** Wenn du in einer Sekunde von 10 auf 10.000 Benutzer springst, klont AWS deinen Code automatisch tausendfach, ohne dass du absolut irgendetwas tun musst.
* **Keine Wartung:** Du musst niemals eine Linux-Version aktualisieren oder einen Kernel-Sicherheitspatch installieren.

## 2. Die Säulen von AWS Serverless

Das Serverless-Ökosystem von AWS baut auf drei grundlegenden Bausteinen auf:

| Service | Funktion | Traditionelle Analogie |
| :--- | :--- | :--- |
| **API Gateway** | Der Pförtner. Empfängt HTTP-Anfragen, validiert Auth und routet. | Nginx / Apache / Express Router |
| **AWS Lambda** | Das Gehirn. Führt deinen Code (Node.js, Python, Go) für Millisekunden aus. | Dein Controller / Geschäftslogik |
| **DynamoDB** | Das Gedächtnis. NoSQL-Datenbank mit einer Latenz von 1 Millisekunde. | MongoDB / PostgreSQL |

## 3. Der Paradigmenwechsel im Code

Bei einem traditionellen Node.js-Server startest du den Server, der auf einem Port lauscht (`app.listen(3000)`). In Serverless **"schläft" dein Code**, bis ein Ereignis ihn weckt.

```javascript
// So sieht eine AWS Lambda aus. Es gibt keinen Server, nur eine reine Funktion.
export const handler = async (event) => {
  // Das 'event' enthält alles, was das API Gateway empfangen hat (Headers, Body)
  console.log("Empfangenes Ereignis:", event.body);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ mensaje: "Hallo aus der Serverless-Cloud!" }),
  };
};
```

## Nächste Schritte
Wir haben verstanden, dass Serverless eine ereignisgesteuerte Ausführung (Event-Driven Computing) ist. Auf der **Basisstufe (Nivel Básico)** werden wir AWS Lambda, seine Zeitbeschränkungen und das Konzept des "Cold Start" (Kaltstart) genauer untersuchen.
