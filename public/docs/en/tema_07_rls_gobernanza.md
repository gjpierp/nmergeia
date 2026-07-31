# Data Layer Security (RLS)

Row-Level Security (RLS) transfers the app's tenant filtering logic directly to the database.

## Advantages of RLS in Postgres
Any malicious query that does `SELECT * FROM invoices` without a tenant ID will return 0 rows.

## Governance and Policy
RLS policies are enabled using `ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;`.

```mermaid
graph TD
  A[Query: SELECT * FROM users] --> B{RLS Policy}
  B -->|Tenant ID Match| C[Returns 10 rows]
  B -->|No Match| D[Returns 0 rows]
```

> [!NOTE]
> The rest of the white paper is kept in its original language to preserve the syntax of code and diagrams.

