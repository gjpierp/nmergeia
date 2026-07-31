import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const OracleGuideExpertPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Oracle Guía Experto</title>
        <meta name="description" content="Guía experta sobre Optimización e Índices en Oracle." />
      </Helmet>
      
      <MarkdownViewer 
        filename="oracle_experto.md"
        title={t('oracleGuide.expert.title', { defaultValue: 'Oracle: Optimización e Índices (Nivel Experto)' })}
        requiredRole="OracleExperto"
      />
    </div>
  );
};
