import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema03GitAvanzadoPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Flujos de Trabajo Git Avanzados</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_03_git_avanzado.md"
        title="Flujos de Trabajo Git Avanzados"
        requiredRole="Tema03GitAvanzado"
      />
    </div>
  );
};
