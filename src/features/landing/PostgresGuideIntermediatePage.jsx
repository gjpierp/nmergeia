import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/useAppStore.js';

export const PostgresGuideIntermediatePage = () => {
  const { t } = useTranslation();
  const { appLanguage } = useAppStore();

  return (
    <div style={{ padding: '2.5rem', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', height: '100%', overflowY: 'auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
        {t('postgresGuide.intermediate.title', { defaultValue: 'Guía Intermedia de PostgreSQL' })}
      </h2>
      <p style={{ marginBottom: '2rem' }}>Índices B-Tree, transacciones complejas, JSONB y Joins.</p>
      
      <iframe 
        src={`/docs/${appLanguage}/postgres_medio.md`} 
        style={{ width: '100%', height: '600px', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fff' }}
        title="Postgres Intermediate"
      />
    </div>
  );
};
