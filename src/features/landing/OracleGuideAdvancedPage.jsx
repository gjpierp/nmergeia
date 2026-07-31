import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const OracleGuideAdvancedPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Oracle Guía Avanzada</title>
        <meta name="description" content="Guía avanzada sobre PL/SQL en Oracle." />
      </Helmet>
      
      <MarkdownViewer 
        filename="oracle_avanzado.md"
        title={t('oracleGuide.advanced.title', { defaultValue: 'Oracle: Introducción a PL/SQL (Nivel Avanzado)' })}
        requiredRole="OracleAvanzado"
      />
    </div>
  );
};
