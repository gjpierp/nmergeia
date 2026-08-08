# 🔍 Guía Enterprise: Elasticsearch, Búsqueda Vectorial & ILM

Bienvenido a la guía técnica avanzada de **Elasticsearch Enterprise & OpenSearch**. En este documento analizaremos en profundidad el funcionamiento del **Índice Invertido de Lucene**, la gestión de ciclo de vida de índices (**ILM**), la topología distribuida de nodos y la implementación de **Búsqueda Vectorial densa (kNN / HNSW)** para sistemas RAG con Inteligencia Artificial.

---

## 🧠 1. Arquitectura Interna y el Índice Invertido de Lucene

Elasticsearch se construye sobre la biblioteca **Apache Lucene**. Entender su estructura de datos fundamental es indispensable para diseñar búsquedas eficientes a escala de terabytes.

### 1.1 Estructura del Índice Invertido
A diferencia de las bases de datos relacionales tradicionales que mapean `Fila -> Campos`, el **Índice Invertido** mapea `Término -> Lista de Documentos` (Posting List).

```
Término      Frecuencia de Documento    Lista de Posiciones (Posting List)
-------------------------------------------------------------------------
"algoritmo"  2                          [Doc_1: pos 3], [Doc_3: pos 12]
"vector"     3                          [Doc_1: pos 8], [Doc_2: pos 1], [Doc_3: pos 4]
"lcs"        1                          [Doc_2: pos 14]
```

### 1.2 Segmentos de Lucene e Inmutabilidad
- **Inmutabilidad de Segmentos**: Los segmentos escritos en disco son inmutables. Las operaciones de eliminación no borran datos físicamente; escriben un archivo de mapa de bits de borrado (`.del`).
- **Proceso de Merge (Segment Merging)**: En segundo plano, Lucene combina continuamente pequeños segmentos en segmentos más grandes, purgando definitivamente los documentos marcados como eliminados para liberar espacio.

---

## 🏗️ 2. Topología de Clúster y Arquitectura Hot-Warm-Cold

En clústeres empresariales, los nodos deben especializarse mediante roles explícitos para garantizar aislamiento y costo-eficiencia en infraestructuras masivas.

```
                  +----------------------+
                  |   MASTER NODES (3)   | (Gobernanza y Estado del Clúster)
                  +----------+-----------+
                             |
         +-------------------+-------------------+
         |                                       |
+--------v--------------+               +--------v--------------+
|   HOT DATA NODES      |               |   WARM DATA NODES     |
| (SSDs NVMe, Alta CPU) |               | (HDDs/SSDs, Med CPU)  |
| Escrituras / Ingesta  |               | Búsquedas Históricas  |
+-----------------------+               +-----------------------+
```

### 2.1 Roles de Nodo Principales
- `master`: Participan en la elección del nodo maestro y gestionan los metadatos globales del clúster (`cluster_state`).
- `data_hot`: Reciben la ingesta masiva de datos en tiempo real y ejecutan búsquedas sobre los índices más recientes.
- `data_warm`: Almacenan índices de lectura menos frecuente con compresión de almacenamiento avanzada.
- `data_cold` / `data_frozen`: Almacenan datos históricos comprimidos montados sobre almacenamiento de objetos (Amazon S3 o Google Cloud Storage) mediante *Searchable Snapshots*.
- `ingest`: Ejecutan pipelines de pre-procesamiento (`enrich`, `grok`, `geojson`) antes de indexar los documentos.

---

## ⚡ 3. Búsqueda Vectorial Densa & HNSW kNN Search (RAG AI)

Elasticsearch soporta **búsqueda k-Nearest Neighbors (kNN)** nativa sobre vectores de embedding generados por modelos LLM (ej. OpenAI `text-embedding-3-small` o HuggingFace Transformers).

### 3.1 Mapeo de Campo Vectorial Densa (Dense Vector)

```json
PUT /enterprise_knowledge_base
{
  "mappings": {
    "properties": {
      "doc_id": { "type": "keyword" },
      "content_text": { "type": "text", "analyzer": "spanish" },
      "vector_embedding": {
        "type": "dense_vector",
        "dims": 1536,
        "index": true,
        "similarity": "cosine",
        "index_options": {
          "type": "hnsw",
          "m": 16,
          "ef_construction": 100
        }
      }
    }
  }
}
```

### 3.2 Consulta Híbrida: Búsqueda Léxica + Búsqueda Vectorial (kNN + BM25)

Las mejores arquitecturas RAG combinan búsqueda tradicional BM25 con similitud vectorial mediante **Reciprocal Rank Fusion (RRF)**:

```json
POST /enterprise_knowledge_base/_search
{
  "retriever": {
    "rrf": {
      "retrievers": [
        {
          "standard": {
            "query": {
              "match": {
                "content_text": "algoritmos de fusión semántica en repositorios"
              }
            }
          }
        },
        {
          "knn": {
            "field": "vector_embedding",
            "query_vector": [-0.012, 0.045, 0.089, "... (1536 dimensiones)"],
            "k": 10,
            "num_candidates": 100
          }
        }
      ],
      "window_size": 10,
      "rank_constant": 60
    }
  }
}
```

---

## ♻️ 4. Index Lifecycle Management (ILM)

**ILM** automatiza la transición de los índices a lo largo de 5 fases: **Hot**, **Warm**, **Cold**, **Frozen** y **Delete**.

```json
PUT /_ilm/policy/logs_policy
{
  "policy": {
    "phases": {
      "hot": {
        "min_age": "0ms",
        "actions": {
          "rollover": {
            "max_primary_shard_size": "50gb",
            "max_age": "30d"
          }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": {
          "forcemerge": {
            "max_num_segments": 1
          },
          "shrink": {
            "number_of_shards": 1
          }
        }
      },
      "delete": {
        "min_age": "90d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}
```

---

## 🛠️ 5. Optimización de Ingesta y Rendimiento

1. **Deshabilitar `_all` y Usar `keyword` para Identificadores**: No analice identificadores únicos (IDs, UUIDs, IPs); utilice el tipo `keyword` para evitar sobrecargar la CPU analizando tokens innecesarios.
2. **Uso de Bulk API**: Siempre envíe escrituras en bloques utilizando la `_bulk` API (recomendado entre 5 MB y 15 MB por batch).
3. **Ajuste de `refresh_interval`**: Para la ingesta masiva inicial, cambie temporalmente `"refresh_interval": "-1"`. Restablézcalo a `"30s"` al finalizar para minimizar las operaciones I/O de generación de segmentos.

---
*Documento de Ingeniería Avanzada de Software - NMerge IA Enterprise Labs.*
