# ⚡ Guía Enterprise: Redis Cluster, Caching & High Availability

Bienvenido a la guía técnica avanzada de **Redis Enterprise**. En este documento abordaremos desde las estructuras de memoria optimizadas hasta la arquitectura distribuida de **Redis Cluster**, **Redis Sentinel**, políticas avanzadas de evicción de memoria y procesamiento de eventos reactivos mediante **Redis Streams**.

---

## 🚀 1. Arquitectura en Memoria y Monohilo Thread Engine

Redis es una base de datos de estructura de datos en memoria orientada a clave-valor de altísimo rendimiento. Su arquitectura monohilo (*Single-threaded Event Loop*) basada en `epoll` / `kqueue` elimina la necesidad de bloqueos y sincronización de hilos en el procesamiento de comandos.

### 1.1 El Bucle de Eventos E/S (Multiplexed Event Loop)
- **Ejecución Atómica**: Cada comando en Redis se ejecuta de forma estrictamente atómica. Dos comandos concurrentes recibidos de clientes distintos jamás se intercalan a mitad de ejecución.
- **I/O Multihilo en Redis 6+**: A partir de Redis 6.0, la lectura y escritura de zócalos de red se delega a hilos secundarios de I/O, conservando el hilo principal únicamente para la ejecución lógica de los comandos en memoria.

---

## 🛡️ 2. Alta Disponibilidad con Redis Sentinel

**Redis Sentinel** proporciona alta disponibilidad sin sharding, supervisando la salud del primario, notificando anomalías y ejecutando failovers automáticos.

```
                  +--------------------+
                  |  REDIS PRIMARIO    |
                  +---------+----------+
                            |
                 Replicación Asíncrona
                            |
                 +----------+----------+
                 |                     |
        +--------v-------+    +--------v-------+
        | REDIS REPLICA 1|    | REDIS REPLICA 2|
        +----------------+    +----------------+

     [SENTINEL 1] ---- [SENTINEL 2] ---- [SENTINEL 3]
     (Cluster de Quórum para Monitoreo y Failover)
```

### 2.1 Proceso de Failover y Quórum
1. **Subjectively Down (SDOWN)**: Un Sentinel marca al primario como SDOWN si no responde a pings en el tiempo `down-after-milliseconds`.
2. **Objectively Down (ODOWN)**: Si la cantidad de Sentinels definida en el `quorum` confirman el estado SDOWN, el estado pasa a ODOWN.
3. **Líder de Elección Raft**: Los Sentinels eligen un líder entre ellos para promover automáticamente a la réplica más actualizada a nuevo Primario y reconfigurar el resto de los nodos.

---

## 🔀 3. Redis Cluster: Escalamiento Horizontal Distribuido

Cuando la memoria de un solo nodo no es suficiente o se requiere repartir la carga de lectura/escritura, **Redis Cluster** ofrece fragmentación automática de datos.

### 3.1 Los 16,384 Hash Slots
Redis Cluster divide el espacio de claves en **16,384 Slots de Hash (Hash Slots)**.
- **Algoritmo de Enrutamiento**: Para determinar en qué nodo se almacena una clave, se calcula:
  $$\text{Slot} = \text{CRC16}(\text{key}) \pmod{16384}$$
- **Hash Tags**: Para forzar que múltiples claves residan en el mismo nodo y permitir operaciones multi-clave atómicas, se utiliza la sintaxis `{tag}`:
  - `user:{1001}:profile` y `user:{1001}:orders` se enrutan usando solo el valor dentro de `{1001}`, garantizando que ambos slots caigan en el mismo nodo.

```bash
# Crear un clúster de 6 nodos (3 Primarios, 3 Réplicas)
redis-cli --cluster create \
  192.168.1.10:7000 192.168.1.11:7000 192.168.1.12:7000 \
  192.168.1.10:7001 192.168.1.11:7001 192.168.1.12:7001 \
  --cluster-replicas 1
```

---

## 🧹 4. Políticas de Evicción y Manejo de Memoria (Maxmemory)

Cuando Redis alcanza el límite configurado en `maxmemory`, aplica la política de evicción seleccionada para liberar espacio antes de aceptar nuevas escrituras.

### 4.1 Resumen de Políticas de Evicción

| Política | Descripción | Caso de Uso Recomendado |
| :--- | :--- | :--- |
| `noeviction` | Retorna un error `OOM command not allowed` ante escrituras. | Bases de datos primarias in-memory donde no se debe perder ningún dato. |
| `volatile-lru` | Elimina las claves vencidas más tiempo sin usar (*Least Recently Used*). | Caché mixto con expiración explícita (`TTL`). |
| `allkeys-lru` | Elimina cualquier clave basándose en el algoritmo LRU aproximado. | Caché universal de páginas web o tokens. |
| `volatile-lfu` | Elimina claves vencidas con menor frecuencia de uso (*Least Frequently Used*). | Proteger elementos con picos de tráfico recurrentes. |
| `allkeys-lfu` | Elimina cualquier clave con la menor frecuencia de acceso. | Optimización estricta de frecuencia de acceso global. |
| `volatile-ttl` | Elimina las claves cuya fecha de vencimiento sea la más próxima. | Caché de sesiones con caducidad temporal estricta. |

---

## 📊 5. Estructuras de Datos Avanzadas

### 5.1 Redis Streams: Procesamiento de Eventos Append-Only
Redis Streams es una estructura de datos append-only pensada para colas de mensajería persistentes con grupos de consumidores (*Consumer Groups*).

```bash
# Agregar un nuevo evento a la corriente 'order_events'
XADD order_events * order_id 88491 user_id 302 amount 150.50 status "PENDING"

# Crear un grupo de consumidores 'analytics_group' desde el inicio de la corriente
XGROUP CREATE order_events analytics_group 0-0

# Leer mensajes como consumidor 'worker_1' dentro del grupo
XREADGROUP GROUP analytics_group worker_1 BLOCK 2000 COUNT 10 STREAMS order_events >

# Confirmar el procesamiento del mensaje (ACK)
XACK order_events analytics_group 1723048923000-0
```

### 5.2 Bitmaps & HyperLogLog: Eficiencia Extrema de Memoria
- **Bitmaps**: Trata las cadenas como arreglos de bits. Ideal para rastrear asistencias diarias o actividades de usuarios activos (1 millón de usuarios usan solo **125 KB** de memoria).
- **HyperLogLog (`PFADD`, `PFCOUNT`)**: Algoritmo probabilístico para contar elementos únicos (*Cardinalidad*) con un margen de error del 0.81% consumiendo máximo **12 KB** de memoria fija por clave.

---

## ⚙️ 6. Configuración de Producción Recomendada (`redis.conf`)

```ini
# Límite de Memoria y Política
maxmemory 4gb
maxmemory-policy allkeys-lru

# Persistencia Híbrida RDB + AOF
save 900 1
save 300 10
appendonly yes
appendfsync everysec
no-appendfsync-on-rewrite yes
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# Ajustes de Kernel Linux Requeridos
# /etc/sysctl.conf -> vm.overcommit_memory = 1
# echo never > /sys/kernel/mm/transparent_hugepage/enabled
```

---
*Documento de Ingeniería Avanzada de Software - NMerge IA Enterprise Labs.*
