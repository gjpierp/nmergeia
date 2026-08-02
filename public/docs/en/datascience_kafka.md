## 🎯 1. Executive Summary: Apache Kafka Event Streaming

**Apache Kafka** is the high-performance distributed event streaming platform used by over 80% of Fortune 500 companies. It provides distributed stream publish-and-subscribe, fault-tolerant storage, and real-time processing with sub-millisecond latencies.

### 💡 Core Architecture & Invariants:
- **Distributed Immutable Event Log:** Events are sequentially persisted to disk using page cache and Zero-Copy memory transfer (`sendfile`).
- **Delivery Guarantees (Exactly-Once Semantics - EOS):** Combination of idempotent producers (`enable.idempotence=true`) and atomic transactions across topics.
- **Consumer Groups & Rebalancing:** Dynamic horizontal scalability by assigning partitions to consumers sharing the same `group.id`.
- **Schema Governance:** Integration with Confluent Schema Registry (Avro / Protobuf / JSON Schema) for backward/forward compatibility.

---

## 🏗️ 2. Real-Time Data Flow Architecture (Kafka Cluster)

```mermaid
flowchart TD
    subgraph Producers ["Producers (Event Sources)"]
        P1["Microservice Application (Node/Java)"]
        P2["IoT Sensors / CDC Debezium"]
    end

    subgraph KafkaCluster ["Apache Kafka Cluster (Broker Swarm)"]
        subgraph TopicOrders ["Topic: nmerge.orders.events (3 Partitions)"]
            Part0["Partition 0 (Leader: Broker 1)"]
            Part1["Partition 1 (Leader: Broker 2)"]
            Part2["Partition 2 (Leader: Broker 3)"]
        end
        SR["Schema Registry (Avro Validation)"]
    end

    subgraph Consumers ["Consumer Groups (Event Sinks)"]
        CG1["Billing Service (Group: billing-cg)"]
        CG2["Real-time Analytics Engine (Group: analytics-cg)"]
        CG3["Delta Lake Sink (Group: lakehouse-cg)"]
    end

    P1 -->|1. Validate Avro Schema| SR
    P1 -->|2. Idempotent Producer Events| TopicOrders
    P2 -->|CDC Streaming| TopicOrders

    Part0 -->|Fetch| CG1
    Part1 -->|Fetch| CG2
    Part2 -->|Fetch| CG3
```

---

## 💻 3. Enterprise Implementation: Producer & Consumer with Schema Registry (Python/Kafka)

```python
from confluent_kafka import Producer, Consumer, KafkaError, KafkaException
import json

producer_config = {
    'bootstrap.servers': 'localhost:9092,localhost:9093',
    'client.id': 'nmerge-order-producer',
    'enable.idempotence': True,
    'acks': 'all',
    'compression.type': 'snappy',
    'linger.ms': 20
}

producer = Producer(producer_config)

def produce_order_event(order_id: str, user_id: str, amount: float):
    payload = {"event_id": f"evt_{order_id}", "order_id": order_id, "user_id": user_id, "amount": amount}
    producer.produce(topic="nmerge.orders.events", key=user_id.encode('utf-8'), value=json.dumps(payload).encode('utf-8'))
    producer.poll(0)

producer.flush()
```

---

© 2026 NMerge IA. All rights reserved.