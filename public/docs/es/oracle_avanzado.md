# Data Guard y ASM

> [!IMPORTANT]
> **Complejidad:** Alta  

### Data Guard (Disaster Recovery)
Data Guard transmite **Redo Logs** (equivalentes al WAL de Postgres) a un centro de datos geográficamente distante para lograr RPO = 0.

### ASM (Automatic Storage Management)
Oracle asume el control directo de los discos duros ignorando el sistema de archivos de Linux, logrando optimización pura y *Striping* nativo.
