import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema07RlsGobernanzaPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Seguridad en la Capa de Datos (RLS)</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_07_rls_gobernanza.md"
        title="Seguridad en la Capa de Datos (RLS)"
        requiredRole="Tema07RlsGobernanza"
      />
    </div>
  );
};
