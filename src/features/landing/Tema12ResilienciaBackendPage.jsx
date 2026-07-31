import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema12ResilienciaBackendPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Resiliencia en Backend y Tolerancia a Fallos</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_12_resiliencia_backend.md"
        title="Resiliencia en Backend y Tolerancia a Fallos"
        requiredRole="Tema12ResilienciaBackend"
      />
    </div>
  );
};
