import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MarkdownViewer } from './MarkdownViewer.jsx';
import { PageHeader } from './PageHeader.jsx';
import { Breadcrumbs } from './Breadcrumbs.jsx';

export const GenericTopicPage = ({ topicId, title, initialLevel = 'inicial', singleFile = null, appLanguage }) => {
  const [activeTab, setActiveTab] = useState(initialLevel);
  const { t } = useTranslation();

  useEffect(() => {
    setActiveTab(initialLevel || 'inicial');
    document.getElementById('generic-topic-container')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [topicId, initialLevel]);

  const topicToMenuKey = {
    'datascience': 'MNU_DATASCIENCE_GUIDE',
    'postgres': 'MNU_TEMA_POSTGRES',
    'oracle': 'MNU_ORACLE_GUIDE',
    'docker': 'MNU_TEMA_02',
    'ngac': 'MNU_NGAC_GUIDE',
    'ext_react': 'MNU_EXT_REACT',
    'ext_vue': 'MNU_EXT_VUE',
    'ext_node': 'MNU_EXT_NODE',
    'ext_aws': 'MNU_EXT_AWS',
    'ext_pentest': 'MNU_EXT_PENTEST'
  };

  const translatedTitle = topicToMenuKey[topicId] ? t(topicToMenuKey[topicId], { defaultValue: title }) : title;

  // Pestañas dinámicas según el tema
  let tabs = [];
  if (!singleFile) {
    tabs = [
      { id: 'inicial', label: t('TAB_INICIAL', 'Inicial') },
      { id: 'basico', label: t('TAB_BASICO', 'Básico') },
      { id: 'medio', label: t('TAB_MEDIO', 'Medio') },
      { id: 'avanzado', label: t('TAB_AVANZADO', 'Avanzado') },
      { id: 'experto', label: t('TAB_EXPERTO', 'Experto') },
      { id: 'optimizaciones', label: t('TAB_OPTIMIZACIONES', '🔥 Optimizaciones') }
    ];

    if (topicId === 'datascience') {
      tabs.push(
        { id: 'pyspark', label: '⚡ PySpark & Big Data' },
        { id: 'kafka', label: '📨 Apache Kafka' },
        { id: 'deltalake', label: '🏔️ Delta Lake' },
        { id: 'mlops', label: '🤖 MLOps & GPU' },
        { id: 'polars', label: '🚀 Polars Rust' }
      );
    }
  }

  const currentTab = tabs.find(t => t.id === activeTab) || (tabs.length > 0 ? tabs[0] : { id: 'default', label: 'Guía Completa' });
  const filename = singleFile ? singleFile : `${topicId}_${activeTab}.md`;

  const breadcrumbsItems = [
    { label: 'Biblioteca Técnica', tabId: 'docs' },
    { label: translatedTitle, tabId: `temas/${topicId}` }
  ];

  if (!singleFile) {
    breadcrumbsItems.push({ label: currentTab.label });
  }

  return (
    <div id="generic-topic-container" style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Helmet>
        <title>NMerge | {translatedTitle} {!singleFile ? `(${currentTab.label})` : ''}</title>
      </Helmet>

      <div style={{ 
        padding: '0.75rem 1.5rem 0', 
        background: 'var(--bg-secondary)', 
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <Breadcrumbs items={breadcrumbsItems} />
        <PageHeader 
          topicId={topicId}
          title={translatedTitle} 
          subtitle={`${translatedTitle} - Guía Técnica Profesional ${!singleFile ? `(Nivel ${currentTab.label})` : ''}`} 
        />

        {!singleFile && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '0.6rem' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  document.getElementById('generic-topic-container')?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  padding: '0.6rem 1.2rem',
                  background: activeTab === tab.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${activeTab === tab.id ? 'var(--accent-primary)' : 'transparent'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(100, 108, 255, 0.3)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ flex: 1, padding: '2rem', boxSizing: 'border-box' }}>
        <MarkdownViewer 
          filename={filename}
          title={`${translatedTitle} ${!singleFile ? `- Nivel ${currentTab.label}` : ''}`}
          requiredRole="TEMA_ACCESO"
        />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <button 
            className="premium-btn-secondary"
            onClick={() => {
              document.getElementById('generic-topic-container')?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>arrow_upward</span>
            Volver Arriba
          </button>
        </div>
      </div>
    </div>
  );
};
