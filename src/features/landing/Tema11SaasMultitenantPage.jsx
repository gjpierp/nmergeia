import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema11SaasMultitenantPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | SaaS Multi-Tenant y Multi-Idioma</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_11_saas_multitenant.md"
        title="SaaS Multi-Tenant y Multi-Idioma"
        requiredRole="Tema11SaasMultitenant"
      />
    </div>
  );
};
