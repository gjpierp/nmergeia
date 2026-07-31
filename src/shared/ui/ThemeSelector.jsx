import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';

export const PREMIUM_THEMES = [
  { id: 'cyber', name: 'Cyber Neon', color1: '#06b6d4', color2: '#10b981', type: 'dark' },
  { id: 'obsidian', name: 'Obsidian Gold', color1: '#f59e0b', color2: '#d97706', type: 'dark' },
  { id: 'tokyo', name: 'Tokyo Cyberpunk', color1: '#ec4899', color2: '#8b5cf6', type: 'dark' },
  { id: 'nord', name: 'Nord Aurora', color1: '#38bdf8', color2: '#14b8a6', type: 'dark' },
  { id: 'emerald', name: 'Emerald Slate', color1: '#2dd4bf', color2: '#84cc16', type: 'dark' },
  { id: 'light-modern', name: 'Light Modern', color1: '#4f46e5', color2: '#0284c7', type: 'light' },
  { id: 'light-cyber', name: 'Light Cyber', color1: '#059669', color2: '#0891b2', type: 'light' },
  { id: 'light-nord', name: 'Light Nord', color1: '#0284c7', color2: '#0d9488', type: 'light' },
  { id: 'light-paper', name: 'Light Paper', color1: '#ea580c', color2: '#d97706', type: 'light' }
];

export const ThemeSelector = () => {
  const { appTheme, setAppTheme, setActiveTab } = useAppStore();

  return (
    <div 
      className="theme-selector-bar"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'var(--bg-glass)',
        padding: '4px 8px',
        borderRadius: '20px',
        border: '1px solid var(--border-light)'
      }}
    >
      <span 
        onClick={() => setActiveTab('settings')}
        style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600, paddingRight: '4px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
        title="Abrir Configuración de Temas"
      >
        <span className="material-symbols-rounded" style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}>palette</span>
        Tema:
      </span>
      {PREMIUM_THEMES.slice(0, 5).map((theme) => {
        const isActive = appTheme === theme.id;
        return (
          <button
            key={theme.id}
            onClick={() => setAppTheme(theme.id)}
            title={`Tema: ${theme.name}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '16px',
              border: isActive ? `1.5px solid ${theme.color1}` : '1px solid transparent',
              background: isActive ? 'var(--bg-hover)' : 'transparent',
              boxShadow: isActive ? `0 0 10px ${theme.color1}40` : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)'
            }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.color1}, ${theme.color2})`,
                boxShadow: isActive ? `0 0 8px ${theme.color1}` : 'none',
                display: 'inline-block'
              }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 600 : 400 }}>
              {theme.name}
            </span>
          </button>
        );
      })}

      <button
        onClick={() => setActiveTab('settings')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          borderRadius: '16px',
          border: '1px solid var(--border-light)',
          background: 'var(--bg-tertiary)',
          color: 'var(--accent-secondary)',
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer'
        }}
        title="Ver todos los 9 temas (Oscuros y Claros) en Configuración"
      >
        <span className="material-symbols-rounded" style={{ fontSize: '0.9rem' }}>settings</span>
        Más (+4 Claros)
      </button>
    </div>
  );
};
