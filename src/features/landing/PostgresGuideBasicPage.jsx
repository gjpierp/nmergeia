import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const PostgresGuideBasicPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | PostgreSQL Guía Básica</title>
        <meta name="description" content="Guía básica de PostgreSQL: Creación de tablas, relaciones, DDL, DML y consultas JOIN." />
      </Helmet>
      
      <MarkdownViewer 
        filename="postgres_basico.md"
        title={t('postgresGuide.basic.title', { defaultValue: 'PostgreSQL: Primeros Pasos (Nivel Básico)' })}
        requiredRole="PostgresBasico"
      />
    </div>
  );
};
