import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema13LlmRagPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Integración de LLMs y RAG Corporativo</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_13_llm_rag.md"
        title="Integración de LLMs y RAG Corporativo"
        requiredRole="Tema13LlmRag"
      />
    </div>
  );
};
