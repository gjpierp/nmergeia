import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/useAppStore.js';

export const PostgresGuidePage = () => {
  const { t } = useTranslation();
  const { appLanguage } = useAppStore();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      padding: '2.5rem',
      boxSizing: 'border-box',
      background: 'radial-gradient(circle at top, var(--bg-tertiary) 0%, var(--bg-primary) 80%)',
      color: 'var(--text-primary)',
      fontFamily: '"Outfit", sans-serif',
      overflowY: 'auto'
    }}>
      {/* Cabecera */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span style={{ 
          fontSize: '0.75rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.15em', 
          color: 'var(--accent-secondary)', 
          fontWeight: '800',
          background: 'rgba(139, 92, 246, 0.1)',
          padding: '4px 12px',
          borderRadius: '12px'
        }}>
          {t('postgresGuide.tag', { defaultValue: 'nmergeia.com Tech Series' })}
        </span>
        <h2 style={{ 
          fontSize: '2.2rem', 
          fontWeight: '800', 
          marginTop: '1rem',
          marginBottom: '0.75rem', 
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent' 
        }}>
          {t('postgresGuide.title', { defaultValue: 'Guías de Optimización en PostgreSQL' })}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '700px', margin: '0 auto' }}>
          {t('postgresGuide.subtitle', { defaultValue: 'Documentación técnica completa: desde los fundamentos hasta tuning avanzado sin downtime.' })}
        </p>
      </div>

      <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Guía Básica */}
        <section style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--accent-primary)' }}>school</span>
            {t('postgresGuide.basic.title', { defaultValue: 'Nivel Básico: Fundamentos y CRUD' })}
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
            {t('postgresGuide.basic.desc', { defaultValue: 'Introducción a bases de datos relacionales, instalación, comandos CRUD básicos y comprensión de los principales tipos de datos.' })}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a 
              href={`/docs/${appLanguage}/postgres_basico.md`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'var(--accent-primary)',
                color: '#ffffff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem'
              }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>menu_book</span>
              {t('postgresGuide.read', { defaultValue: 'Leer Guía Básica' })}
            </a>
          </div>
        </section>

        {/* Guía Media */}
        <section style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--accent-secondary)' }}>model_training</span>
            {t('postgresGuide.intermediate.title', { defaultValue: 'Nivel Medio: Joins y Estructuras' })}
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
            {t('postgresGuide.intermediate.desc', { defaultValue: 'Uso de índices B-Tree, uniones avanzadas (Joins), CTEs, tipos de datos especiales como JSONB y control de concurrencia con transacciones.' })}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a 
              href={`/docs/${appLanguage}/postgres_medio.md`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem'
              }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>menu_book</span>
              {t('postgresGuide.readInter', { defaultValue: 'Leer Guía Media' })}
            </a>
          </div>
        </section>

        {/* Guía Avanzada */}
        <section style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--error-color)', filter: 'hue-rotate(30deg)' }}>rocket_launch</span>
            {t('postgresGuide.advanced.title', { defaultValue: 'Nivel Avanzado: Tuning y Mantenimiento' })}
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
            {t('postgresGuide.advanced.desc', { defaultValue: 'Análisis con EXPLAIN ANALYZE, uso de índices especializados (BRIN, GIN), reindexación concurrente y tuning de autovacuum para evitar downtime.' })}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a 
              href={`/docs/${appLanguage}/postgres_avanzado.md`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem'
              }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>menu_book</span>
              {t('postgresGuide.readAdv', { defaultValue: 'Leer Guía Avanzada' })}
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};
