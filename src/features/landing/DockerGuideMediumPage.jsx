import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const DockerGuideMediumPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Docker Guía Media</title>
        <meta name="description" content="Guía media de orquestación con Docker Compose." />
      </Helmet>
      
      <MarkdownViewer 
        filename="docker_medio.md"
        title="Docker Compose: Orquestación Local (Media)"
        requiredRole="DockerMedio"
      />
    </div>
  );
};
