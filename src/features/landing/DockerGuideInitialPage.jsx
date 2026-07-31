import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const DockerGuideInitialPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Docker Guía Inicial</title>
        <meta name="description" content="Guía de inicio rápido para Docker." />
      </Helmet>
      
      <MarkdownViewer 
        filename="docker_inicial.md"
        title="Docker: Introducción y Contenedores (Inicial)"
        requiredRole="DockerInicial"
      />
    </div>
  );
};
