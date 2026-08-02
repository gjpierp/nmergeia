## 🎯 1. PySpark & Distributed Big Data Processing

**PySpark** is the Python API for Apache Spark, the leading platform for petabyte-scale distributed Big Data processing.

### 💡 Core Architecture & Invariants:
- **Catalyst Optimizer & Tungsten Engine:** Logical/physical query optimization and JIT bytecode generation.
- **Broadcast Joins vs Shuffle Joins:** Eliminating network shuffle costs by broadcasting small tables (<10 MB).
- **Lazy Evaluation & DAGs:** Building execution graphs that trigger only on Actions (`write`, `collect`).

© 2026 NMerge IA. All rights reserved.