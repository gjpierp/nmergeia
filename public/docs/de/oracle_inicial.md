## 🎯 1. Oracle Database Enterprise Architecture & Multitenant (CDB/PDB)

**Oracle Database Enterprise Edition** is the leading relational engine in global banking and telecommunications. It features a decoupled architecture between **Instance** (SGA/PGA memory + Background Processes) and **Database** (physical files), alongside a containerized **Multitenant (CDB/PDB)** architecture.

### 💡 Core Architecture & Invariants:
- **System Global Area (SGA):** Shared memory containing Shared Pool, Buffer Cache, Redo Log Buffer, Large Pool.
- **Program Global Area (PGA):** Private session memory for sorting and hash joins.
- **Background Processes:** DBWn, LGWR, CKPT, SMON, PMON.

© 2026 NMerge IA. All rights reserved.