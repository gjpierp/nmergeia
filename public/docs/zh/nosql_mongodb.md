# 🍃 Guía Enterprise: MongoDB, Sharding & Aggregation Pipelines

Bienvenido a la guía de arquitectura y optimización avanzada de **MongoDB Enterprise**. En este documento exploraremos desde los fundamentos internos del motor de almacenamiento **WiredTiger** hasta la implementación a gran escala de **Sharding**, **Replica Sets** resilientes y pipelines complejas de agregación analítica.

---

## 🏗️ 1. Arquitectura Interna del Motor WiredTiger

MongoDB utiliza **WiredTiger** como su motor de almacenamiento por defecto. Comprender su funcionamiento interno es fundamental para sintonizar el rendimiento en entornos corporativos de alto tráfico.

### 1.1 Concurrencia a Nivel de Documento (Document-Level Concurrency)
A diferencia de los motores relacionales legacy o versiones obsoletas de MongoDB (que aplicaban bloqueos a nivel de base de datos o colección), WiredTiger utiliza **control de concurrencia optimista (OCC)** con bloqueos a nivel de documento individual.
- **Sin Bloqueos Globales de Lectura/Escritura**: Las operaciones de escritura concurrentes en documentos distintos de la misma colección no se bloquean entre sí.
- **Control de Versiones Multi-versión (MVCC)**: Las lecturas proporcionan una vista consistente en el tiempo sin bloquear las escrituras concurrentes.

### 1.2 Caché de Memoria y Algoritmos Evicción (WiredTiger Cache)
WiredTiger reserva memoria RAM dedicada para acelerar las operaciones I/O:
- **Fórmula de Memoria por Defecto**: `RAM_Caché = MAX(50% de (RAM_Física - 1 GB), 256 MB)`.
- **Checkpointing Asíncrono**: Cada 60 segundos (o cuando el Journal alcanza 2 GB), WiredTiger escribe un punto de control inmutable a disco, asegurando la durabilidad del estado.
- **Journaling In-Memory**: Las operaciones de mutación se escriben primero en el registro de transacciones WAL (*Write-Ahead Logging*) en memoria comprimida Snappy para garantizar recuperación instantánea ante fallos eléctricos (`SIGKILL`).

---

## 🔄 2. Replica Sets: Alta Disponibilidad & Consenso Raft-like

Un **Replica Set** en MongoDB es un grupo de procesos `mongod` que mantienen el mismo conjunto de datos, proporcionando redundancia y alta disponibilidad.

```
       +-------------------+
       |   NODO PRIMARIO   | (Lecturas y Escrituras)
       +--------+----------+
                |
     Replicación Oplog (Async)
                |
   +------------+------------+
   |                         |
+--v------------------+   +--v------------------+
|   SECUNDARIO NODO 1 |   |   SECUNDARIO NODO 2 | (Lecturas / Failover)
+---------------------+   +---------------------+
```

### 2.1 El Operador Oplog (Operation Log)
El `oplog.rs` es una colección capped especial en la base de datos `local` que registra todas las modificaciones de datos en el primario.
- **Replicación Idempotente**: Las operaciones se convierten en declaraciones absolutas (por ejemplo, `$set` en lugar de `$inc`) para garantizar que la re-aplicación repetida en secundarios no corrompa el estado.
- **Elección de Primario**: Si el primario no responde en 10 segundos (heartbeat timeout), los secundarios inician una elección mediante un protocolo derivado de **Raft Consensus**, eligiendo al secundario con el `oplog` más actualizado.

### 2.2 Preocupaciones de Lectura y Escritura (Read & Write Concerns)

#### Write Concern (Garantía de Escritura):
- `{ w: 1 }`: Confirma la escritura tan pronto como el primario la aplica en memoria (Rápido, pero riesgo de pérdida de datos ante caída inmediata).
- `{ w: "majority" }`: Confirma únicamente cuando la mayoría estricta de los miembros del Replica Set han escrito la mutación en su Oplog.
- `{ j: true }`: Exige que la escritura haya sido volcada físicamente al Journal en disco antes de responder al cliente.

#### Read Concern (Garantía de Lectura):
- `"local"`: Devuelve los datos más recientes en el nodo consultado (puede incluir escrituras no confirmadas por la mayoría que sufrirán rollback).
- `"majority"`: Garantiza que los datos leídos han sido confirmados por la mayoría de los nodos y no serán revertidos jamás.
- `"linearizable"`: Garantiza que la lectura refleja escrituras confirmadas concurrentemente antes de completar la consulta.

---

## ⚡ 3. Arquitectura Sharding: Escalamiento Horizontal Masivo

Cuando una colección supera la capacidad de almacenamiento de un solo servidor o sobrepasa los límites de IOPS de disco, el **Sharding** distribuye los documentos horizontalmente a través de múltiples clústeres independientes.

```
                   +---------------+
                   |    CLIENTE    |
                   +-------+-------+
                           |
                           v
                   +---------------+
                   |  mongos router|
                   +-------+-------+
                           |
            +--------------+--------------+
            |                             |
    +-------v-------+             +-------v-------+
    | Config Servers|             | Config Servers|
    +---------------+             +---------------+
            |                             |
      +-----+-----+                 +-----+-----+
      |           |                 |           |
 +----v----+ +----v----+       +----v----+ +----v----+
 | SHARD 1 | | SHARD 1 |       | SHARD 2 | | SHARD 2 |
 | Primario| |Secundar.|       | Primario| |Secundar.|
 +---------+ +---------+       +---------+ +---------+
```

### 3.1 Componentes del Clúster Sharded
1. **Shards (Fragmentos)**: Cada shard es un Replica Set independiente que almacena un subconjunto de los datos.
2. **Config Servers**: Replica Set que almacena los metadatos del clúster, el mapa de distribución de rangos de datos (*Chunks*) y la topología global.
3. **Routers (`mongos`)**: Procesos ligeros sin estado que actúan como proxies inversos, enrutando las operaciones de los clientes hacia los shards correspondientes.

### 3.2 Selección Estratégica de la Clave de Fragmentación (Shard Key)
La elección de la **Shard Key** determina el rendimiento y la balanceabilidad del clúster. Una mala clave genera *Hotspots* (puntos calientes) o enrutamiento *Scatter-Gather* ineficiente.

#### Estrategia A: Sharding Basado en Hash (Hashed Sharding)
Utiliza un índice hash sobre un campo con alta cardinalidad (por ejemplo, `_id` o `user_id`).
- **Ventaja**: Distribución perfectamente uniforme de escrituras y lecturas en todos los shards.
- **Desventaja**: Las consultas por rango (`$gt`, `$lt`) deben transmitirse a **todos** los shards (*Scatter-Gather*).

```javascript
// Habilitar sharded en la base de datos y coleccion
sh.enableSharding("enterprise_db");
sh.shardCollection("enterprise_db.audit_logs", { "tenant_id": "hashed" });
```

#### Estrategia B: Sharding Basado en Rangos (Ranged Sharding)
Agrupa documentos con claves similares en chunks contiguos.
- **Ventaja**: Las consultas por rango sobre la Shard Key son dirigidas quirúrgicamente a un solo shard.
- **Riesgo**: Claves monotónicamente crecientes (como `createdAt` o IDs secuenciales) dirigen el 100% de las nuevas escrituras al último shard (*Hotspotting*).

---

## 📊 4. Aggregation Framework Avanzado & Optimización

El **Aggregation Framework** de MongoDB es un motor de procesamiento de datos por tuberías (*Pipelines*). Cada etapa transforma los documentos conforme avanzan.

### 4.1 Pipeline Compleja de Análisis Financiero Multitenant

El siguiente ejemplo ilustra una agregación avanzada que combina unión de colecciones (`$lookup`), filtrado optimizado (`$match`), desmenuzado de arrays (`$unwind`), y facetado paralelo (`$facet`):

```javascript
db.transactions.aggregate([
  // Etapa 1: Filtrar usando índices antes de procesar (SARGable)
  {
    $match: {
      status: "COMPLETED",
      createdAt: { 
        $gte: ISODate("2026-01-01T00:00:00Z"), 
        $lt: ISODate("2026-08-01T00:00:00Z") 
      }
    }
  },

  // Etapa 2: JOIN eficiente con la colección de clientes
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customerInfo"
    }
  },

  // Etapa 3: Aplanar el array devuelto por $lookup
  {
    $unwind: "$customerInfo"
  },

  // Etapa 4: Agrupación y cálculo métrico por categoría y región
  {
    $group: {
      _id: {
        region: "$customerInfo.region",
        category: "$category"
      },
      totalVolume: { $sum: "$amount" },
      avgTransaction: { $avg: "$amount" },
      count: { $sum: 1 }
    }
  },

  // Etapa 5: Proyección limpia y formateo de respuesta
  {
    $project: {
      _id: 0,
      region: "$_id.region",
      category: "$_id.category",
      totalVolumeUSD: { $round: ["$totalVolume", 2] },
      averageTicketUSD: { $round: ["$avgTransaction", 2] },
      transactionCount: "$count"
    }
  },

  // Etapa 6: Ordenar por volumen descendente
  {
    $sort: { totalVolumeUSD: -1 }
  }
], {
  allowDiskUse: true // Permite desbordar a disco si la memoria supera los 100 MB
});
```

---

## 📡 5. Change Streams: Arquitecturas Reactivas Event-Driven

Los **Change Streams** permiten a las aplicaciones suscribirse a cambios de datos en tiempo real a nivel de colección, base de datos o clúster completo sin sobrecargar la base de datos con polling ineficiente.

```javascript
// Ejemplo de Listener Reactivo en Node.js / Express
import { MongoClient } from 'mongodb';

const client = new MongoClient("mongodb://primary.node.local:27017/?replicaSet=rs0");

async function runChangeStream() {
  await client.connect();
  const db = client.db("enterprise_db");
  const collection = db.collection("orders");

  // Crear el Stream filtrando solo inserciones de órdenes críticas
  const changeStream = collection.watch([
    {
      $match: {
        operationType: "insert",
        "fullDocument.totalAmount": { $gte: 5000 }
      }
    }
  ], { fullDocument: "updateLookup" });

  console.log("📡 Escuchando eventos de alta prioridad en MongoDB Change Stream...");

  changeStream.on("change", (change) => {
    console.log("⚡ Nueva Orden VIP Detectada:", change.fullDocument._id);
    console.log("Monto Total:", change.fullDocument.totalAmount);
    // Notificar a microservicio vía Kafka / RabbitMQ
  });
}

runChangeStream().catch(console.error);
```

---

## 🛠️ 6. Buenas Prácticas y Antipatrones en Producción

### ✅ Prácticas Recomendadas
1. **Regla del 1-a-N para Modelado**: Prefiera **documentos embebidos** para relaciones 1-a-Pocos (ej. direcciones de un usuario). Use **referencias normadas** para relaciones 1-a-Muchos desbordantes (ej. logs o comentarios).
2. **Índices Compuestos ESR (Equal, Sort, Range)**: Ordene los campos de un índice compuesto siempre en la secuencia: **Campos de Igualdad primero**, **Campos de Ordenamiento después**, **Campos de Rango al final**.
3. **Uso de Capped Collections o TTL Indexes**: Configure índices TTL (`expireAfterSeconds`) para purgar logs automáticamente sin saturar la CPU con comandos `DELETE`.

### ❌ Antipatrones a Evitar
1. **Arrays Ilimitados (Unbounded Arrays)**: Permitir que un array dentro de un documento crezca indefinidamente puede causar que el documento exceda el límite estricto de **16 MB BSON**, provocando fallos fatales de escritura.
2. **Consultas Regex Sin Anclaje Inicial**: Expresiones regulares como `{$regex: /patron/}` fuerzan un escaneo completo de colección (*COLLSCAN*). Use siempre anclaje frontal `{$regex: /^patron/}` o índices de texto completo.

---
*Documento de Ingeniería Avanzada de Software - NMerge IA Enterprise Labs.*
