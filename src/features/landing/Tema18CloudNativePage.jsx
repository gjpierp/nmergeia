import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema18CloudNativePage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Cloud Native, Serverless y SRE</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_18_cloud_native_sre.md"
        title="Cloud Native, Serverless y SRE"
        requiredRole="CloudAvanzado"
      />
    </div>
  );
};
