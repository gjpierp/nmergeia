import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const DockerGuideExpertPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Docker Guía Experta</title>
        <meta name="description" content="Guía experta sobre seguridad y límites." />
      </Helmet>
      
      <MarkdownViewer 
        filename="docker_experto.md"
        title="Docker: Seguridad Avanzada y Prácticas FinOps (Experto)"
        requiredRole="DockerExperto"
      />
    </div>
  );
};
