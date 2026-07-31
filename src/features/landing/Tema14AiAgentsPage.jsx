import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema14AiAgentsPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Agentes de Código e IA en el Workflow</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_14_ai_agents.md"
        title="Agentes de Código e IA en el Workflow"
        requiredRole="Tema14AiAgents"
      />
    </div>
  );
};
