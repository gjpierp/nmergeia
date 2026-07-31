import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from '../../shared/ui/MarkdownViewer.jsx';

export const OracleGuideInitialPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <Helmet>
        <title>NMerge | Oracle Guía Inicial</title>
        <meta name="description" content="Guía de inicio rápido y configuración cero-setup para Oracle Database." />
      </Helmet>
      
      <MarkdownViewer 
        filename="oracle_inicial.md"
        title={t('oracleGuide.initial.title', { defaultValue: 'Oracle: Despliegue Zero-Setup (Nivel Inicial)' })}
        requiredRole="OracleInicial"
      />
    </div>
  );
};
