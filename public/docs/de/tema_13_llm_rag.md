# Integration von LLMs und Corporate RAG

## Interner Datenschutz
Unternehmen können personenbezogene Daten nicht an öffentliche OpenAI/Anthropic-APIs übermitteln.

## RAG-Architektur (Retrieval-Augmented Generation).
1. Indizierung interner Dokumente in Vector DB (Chroma, Pinecone).
2. Semantische Kontextwiederherstellung.
3. Injektion an der LLM-Eingabeaufforderung (lokal oder privat).

„Meerjungfrau
Diagramm TD
  A[Benutzeraufforderung] -> B[Vektor-DB-Suche]
  B -> C[Kontext abrufen]
  C -> D[LLM-Generierung]
  D -> E[Sichere Antwort]
„

> [!NOTE]
> Der Rest des Whitepapers ist in seiner Originalsprache gehalten, um die Syntax von Code und Diagrammen beizubehalten.

