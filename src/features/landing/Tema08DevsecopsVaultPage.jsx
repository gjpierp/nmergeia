import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema08DevsecopsVaultPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Gestión Segura de Secretos y DevSecOps</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_08_devsecops_vault.md"
        title="Gestión Segura de Secretos y DevSecOps"
        requiredRole="Tema08DevsecopsVault"
      />
    </div>
  );
};
