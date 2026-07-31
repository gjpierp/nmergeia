# Advanced Level

> [!IMPORTANT]
> At an advanced level, we start combining multiple graphs, known as "Policies" or policy classes, and add dynamic attributes such as time or location (ABAC within NGAC).

## Conditional Evaluations

In advanced NGAC, one path in the graph is not enough. We can tie "Conditions" to associations.

### Time and Status Restrictions

```mermaid
graph TD
    U[User: Cashier] -->|UA| Cashiers (Cashier Cashiers)
    
    Cashiers -->|Can Process| OA1 (Cash Registers)
    
    Cashiers -. Condition: Only working hours .-> OA1
    
    O[Box 01] --> OA1
    O2[Box 02] --> OA1
```

If user "Cashier" tries to access "Cash 01" at 3:00 AM, the NGAC engine finds the way, but the edge condition fails. Therefore, access is denied.

### Separation of Duty (SoD)

NGAC allows you to easily implement SoD by declaring **Ban Constraints**. 
- If Alice approves a purchase request, the graph dynamically generates a node that **denies** Alice the right to sign the check for that same purchase.

> [!TIP]
> By taking advantage of dynamic Object Attributes, you can isolate information in a granular way without having to create millions of roles (Role Explosion).

> [!NOTE]
> The rest of the white paper is kept in its original language to preserve the syntax of code and diagrams.

