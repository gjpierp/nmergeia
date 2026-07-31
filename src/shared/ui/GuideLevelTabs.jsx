import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';

export const GuideLevelTabs = ({ topicKey = 'postgres', activeLevel = 'inicial' }) => {
  const { setActiveTab } = useAppStore();

  const levels = [
    { key: 'inicial', label: 'Inicial', icon: 'auto_awesome' },
    { key: 'basico', label: 'Básico', icon: 'school' },
    { key: 'medio', label: 'Medio', icon: 'model_training' },
    { key: 'avanzado', label: 'Avanzado', icon: 'rocket_launch' },
    { key: 'experto', label: 'Experto', icon: 'workspace_premium' },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '8px',
      marginBottom: '1.5rem',
      borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))'
    }}>
      {levels.map((lvl) => {
        const targetTab = `${topicKey}-${lvl.key}`;
        const isActive = activeLevel === lvl.key;

        return (
          <button
            key={lvl.key}
            onClick={() => setActiveTab(targetTab)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '20px',
              border: isActive ? '1px solid var(--accent-primary, #38bdf8)' : '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
              background: isActive ? 'var(--accent-primary, #38bdf8)' : 'rgba(255, 255, 255, 0.03)',
              color: isActive ? '#ffffff' : 'var(--text-secondary, #cbd5e1)',
              fontSize: '0.85rem',
              fontWeight: isActive ? '700' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>
              {lvl.icon}
            </span>
            <span>Nivel {lvl.label}</span>
          </button>
        );
      })}
    </div>
  );
};
