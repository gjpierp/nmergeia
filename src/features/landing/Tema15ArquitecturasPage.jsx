import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema15ArquitecturasPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Arquitecturas de Software Avanzadas</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_15_arquitecturas_software.md"
        title="Arquitecturas de Software Avanzadas"
        requiredRole="Tema15Arquitecturas"
      />
    </div>
  );
};
