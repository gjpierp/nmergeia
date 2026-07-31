import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const OracleGuideBasicPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Oracle Guía Básica</title>
        <meta name="description" content="Guía básica de estructuras y DDL en Oracle." />
      </Helmet>
      
      <MarkdownViewer 
        filename="oracle_basico.md"
        title={t('oracleGuide.basic.title', { defaultValue: 'Oracle: Estructuras y DDL (Nivel Básico)' })}
        requiredRole="OracleBasico"
      />
    </div>
  );
};
