# Arquitecturas LLM y RAG (Retrieval-Augmented Generation)

La Inteligencia Artificial Generativa ha transformado la ingeniería de software. Sin embargo, los Modelos de Lenguaje Grande (LLMs) como GPT-4 o Claude sufren de *alucinaciones* y carecen de conocimiento sobre datos privados o recientes. Aquí es donde entra **RAG**.

## 1. ¿Qué es RAG?
**Retrieval-Augmented Generation (Generación Aumentada por Recuperación)** es un patrón de arquitectura que conecta un LLM a tus bases de datos privadas. En lugar de depender de lo que el modelo "memorizó" durante su entrenamiento, RAG busca activamente documentos relevantes y se los entrega al modelo como contexto para responder.

## 2. Flujo de Trabajo (El Pipeline RAG)
El proceso se divide en dos fases principales: **Ingesta** y **Recuperación**.

### Fase de Ingesta (Preparación de Datos)
1. **Extracción:** Se extrae texto de PDFs, Confluence, Jira o Bases de Datos.
2. **Chunking:** Se divide el texto en "fragmentos" pequeños (ej. 500 tokens). Si le pasas un libro entero, perderás precisión.
3. **Embedding:** Se usa un modelo de embedding (ej. `text-embedding-3-small`) para convertir cada fragmento en un vector matemático (un array de miles de números flotantes).
4. **Almacenamiento Vectorial:** Se guardan los vectores en una Base de Datos Vectorial (ej. Pinecone, Qdrant, o PostgreSQL con la extensión `pgvector`).

### Fase de Recuperación (Inferencia)
1. **Consulta del Usuario:** El usuario pregunta *"¿Cuál es la política de vacaciones?"*
2. **Vectorización:** La pregunta se convierte en un vector usando el mismo modelo de embedding.
3. **Búsqueda Semántica:** La base de datos vectorial compara matemáticamente (ej. Similitud del Coseno) el vector de la pregunta contra todos los fragmentos y devuelve los 5 más similares.
4. **Generación:** Se crea un *Prompt* que incluye los 5 fragmentos recuperados más la pregunta original. El LLM lee el contexto y redacta la respuesta final.

## 3. Retos y Técnicas Avanzadas
* **Lost in the Middle:** Si le pasas demasiado contexto a un LLM, tiende a olvidar la información que está en el medio del texto. Solución: Usar *Reranking* para poner los fragmentos más relevantes al principio y al final.
* **Hybrid Search:** La búsqueda vectorial es pésima buscando palabras clave exactas (ej. IDs de facturas o nombres propios raros). Se debe combinar Búsqueda Semántica (Vectores) con Búsqueda Lexicográfica (BM25 o Full-Text Search de Postgres).
* **Graph RAG:** En lugar de buscar fragmentos aislados de texto, se modelan las entidades (Personas, Empresas, Conceptos) como un Grafo de Conocimiento (Neo4j) para que el modelo entienda las relaciones complejas.

> **Regla de Oro:** Un sistema RAG es tan bueno como su fase de recuperación. Si la base de datos devuelve basura, el LLM generará basura (*Garbage In, Garbage Out*).
