import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const PostgresGuideAdvancedPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | PostgreSQL Guía Avanzada</title>
        <meta name="description" content="Guía avanzada de PostgreSQL: Transacciones ACID, MVCC, JSONB nativo y Vistas Materializadas." />
      </Helmet>
      
      <MarkdownViewer 
        filename="postgres_avanzado.md"
        title={t('postgresGuide.advanced.title', { defaultValue: 'PostgreSQL: Transacciones y JSONB (Nivel Avanzado)' })}
        requiredRole="PostgresAvanzado"
      />
    </div>
  );
};
