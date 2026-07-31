import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema16RequerimientosPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Toma de Requerimientos y DDD</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_16_toma_requerimientos.md"
        title="Toma de Requerimientos y DDD"
        requiredRole="Tema16Requerimientos"
      />
    </div>
  );
};
