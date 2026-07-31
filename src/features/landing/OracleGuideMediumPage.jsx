import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const OracleGuideMediumPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Oracle Guía Media</title>
        <meta name="description" content="Guía de nivel medio para DML y Transaccionalidad en Oracle." />
      </Helmet>
      
      <MarkdownViewer 
        filename="oracle_medio.md"
        title={t('oracleGuide.medium.title', { defaultValue: 'Oracle: DML y Transacciones (Nivel Medio)' })}
        requiredRole="OracleMedio"
      />
    </div>
  );
};
