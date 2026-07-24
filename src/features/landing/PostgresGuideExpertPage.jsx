import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const PostgresGuideExpertPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | PostgreSQL Guía Experta</title>
        <meta name="description" content="Alta disponibilidad, Patroni, extensiones custom, optimizaciones extremas y arquitecturas avanzadas para PostgreSQL." />
      </Helmet>
      
      <MarkdownViewer 
        filename="postgres_experto.md"
        title={t('postgresGuide.expert.title', { defaultValue: 'PostgreSQL: Arquitectura y HA (Nivel Experto)' })}
        requiredRole="PostgresExperto"
      />
    </div>
  );
};
