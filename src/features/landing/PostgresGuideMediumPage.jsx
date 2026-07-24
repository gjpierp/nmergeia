import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const PostgresGuideMediumPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | PostgreSQL Guía Media</title>
        <meta name="description" content="Guía media de PostgreSQL: Funciones analíticas, agrupación, CTEs e introducción a índices." />
      </Helmet>
      
      <MarkdownViewer 
        filename="postgres_medio.md"
        title={t('postgresGuide.medium.title', { defaultValue: 'PostgreSQL: Análisis e Índices (Nivel Medio)' })}
        requiredRole="PostgresMedio"
      />
    </div>
  );
};
