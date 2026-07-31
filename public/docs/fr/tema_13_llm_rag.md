# Intégration des LLM et Corporate RAG

## Internal Data Privacy
Companies cannot submit PII to public OpenAI/Anthropic APIs.

## RAG (Retrieval-Augmented Generation) architecture
1. Indexing of internal documents in Vector DB (Chroma, Pinecone).
2. Récupération du contexte sémantique.
3. Injection at the LLM prompt (Local or Private).

```sirène
graph TD
  A[Invite utilisateur] --> B[Recherche dans la base de données vectorielle]
  B --> C[Récupérer le contexte]
  C --> D[LLM Generation]
  D --> E[Safe Answer]
```

> [!NOTE]
> Le reste du livre blanc est conservé dans sa langue d'origine pour préserver la syntaxe du code et des diagrammes.

