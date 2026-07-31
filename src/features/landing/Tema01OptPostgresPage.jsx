import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema01OptPostgresPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Optimización Avanzada en PostgreSQL</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="postgres_optimizaciones.md"
        title="Optimización Avanzada en PostgreSQL"
        requiredRole="Tema01OptPostgres"
      />
    </div>
  );
};
