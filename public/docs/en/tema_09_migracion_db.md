# Migration and Interoperability between DBs

Strategies for exiting legacy or on-premise databases (e.g. Oracle to Postgres).

## Migration Tools
Use of *AWS SCT (Schema Conversion Tool)* and *DMS (Data Migration Service)* for CDC (Change Data Capture) replication.

## Strangler Fig Strategy
Migrate table to table. The application writes dually until integrity is confirmed.

```mermaid
graph TD
  A[Monolithic App] --> B[Oracle DB]
  A --> C[New Microservice]
  C --> D[PostgreSQL]
  B -. CDC Sync .-> D
```

> [!NOTE]
> The rest of the white paper is kept in its original language to preserve the syntax of code and diagrams.

