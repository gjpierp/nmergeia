import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema17KubernetesPage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Orquestación con Kubernetes (K8s)</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="tema_17_kubernetes_orquestacion.md"
        title="Orquestación con Kubernetes (K8s)"
        requiredRole="K8sAvanzado"
      />
    </div>
  );
};
