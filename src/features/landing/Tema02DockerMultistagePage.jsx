import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const Tema02DockerMultistagePage = () => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Estrategias de Contenedores y Docker Multi-Stage</title>
      </Helmet>
      
      <MarkdownViewer 
        filename="docker_optimizaciones.md"
        title="Estrategias de Contenedores y Docker Multi-Stage"
        requiredRole="Tema02DockerMultistage"
      />
    </div>
  );
};
