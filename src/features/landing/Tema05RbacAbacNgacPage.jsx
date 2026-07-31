import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema05RbacAbacNgacPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Evolución del Control de Acceso</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_05_rbac_abac_ngac.md"
        title="Evolución del Control de Acceso"
        requiredRole="Tema05RbacAbacNgac"
      />
    </div>
  );
};
