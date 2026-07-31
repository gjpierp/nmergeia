import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema10EtlSagaPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Ingesta de Datos y Consistencia Distribuida</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_10_etl_saga.md"
        title="Ingesta de Datos y Consistencia Distribuida"
        requiredRole="Tema10EtlSaga"
      />
    </div>
  );
};
