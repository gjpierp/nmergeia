import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const PostgresGuideInitialPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | PostgreSQL Guía Inicial</title>
        <meta name="description" content="Guía de inicio rápido y configuración cero-setup para PostgreSQL. Entorno interactivo y seguro." />
      </Helmet>
      
      <MarkdownViewer 
        filename="postgres_inicial.md"
        title={t('postgresGuide.initial.title', { defaultValue: 'PostgreSQL: Despliegue Zero-Setup (Nivel Inicial)' })}
        requiredRole="PostgresInicial"
      />
    </div>
  );
};
