import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const DockerGuideBasicPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Docker Guía Básica</title>
        <meta name="description" content="Guía básica de imágenes, volúmenes y redes para Docker." />
      </Helmet>
      
      <MarkdownViewer 
        filename="docker_basico.md"
        title="Docker: Imágenes, Volúmenes y Redes (Básica)"
        requiredRole="DockerBasico"
      />
    </div>
  );
};
