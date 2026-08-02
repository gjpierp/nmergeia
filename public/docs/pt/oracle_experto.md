# RAC (Real Application Clusters)

> [!IMPORTANT]
> **Costo Estimado:** Cientos de miles de dólares.  

RAC permite que MÚLTIPLES instancias en distintos servidores físicos accedan concurrentemente a los MISMOS archivos de base de datos en un almacenamiento SAN compartido.

```mermaid
flowchart TD
A["App Server"] --> B(Nodo 1: Instancia A)
A --> C(Nodo 2: Instancia B)
B --> D["(SAN Storage Compartido)"]
C --> D
```
Si el Nodo 1 se incendia, las conexiones fallan instantáneamente al Nodo 2 (Transparent Application Failover).
