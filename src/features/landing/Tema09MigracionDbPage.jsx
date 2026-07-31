import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema09MigracionDbPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Migración e Interoperabilidad entre BDs</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_09_migracion_db.md"
        title="Migración e Interoperabilidad entre BDs"
        requiredRole="Tema09MigracionDb"
      />
    </div>
  );
};
