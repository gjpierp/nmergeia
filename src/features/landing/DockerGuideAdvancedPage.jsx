import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const DockerGuideAdvancedPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Docker Guía Avanzada</title>
        <meta name="description" content="Guía avanzada de Dockerfiles multietapa." />
      </Helmet>
      
      <MarkdownViewer 
        filename="docker_avanzado.md"
        title="Dockerfiles Multietapa y Optimización (Avanzada)"
        requiredRole="DockerAvanzado"
      />
    </div>
  );
};
