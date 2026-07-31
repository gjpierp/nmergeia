import React from 'react';

export const TechnicalLevelToc = ({ items = [], title = "Tabla de Contenidos de esta Guía" }) => {
  if (!items || items.length === 0) return null;

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="technical-toc-container" style={{
      background: 'var(--bg-secondary, #1e293b)',
      border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      marginBottom: '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.95rem',
        fontWeight: '700',
        color: 'var(--accent-primary, #38bdf8)',
        marginBottom: '0.85rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '0.5rem'
      }}>
        <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>toc</span>
        <span>{title}</span>
      </div>
      <ul style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '8px 16px',
        listStyle: 'none',
        margin: 0,
        padding: 0
      }}>
        {items.map((item, idx) => (
          <li key={item.id || idx}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleScrollTo(e, item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-secondary, #cbd5e1)',
                textDecoration: 'none',
                fontSize: '0.88rem',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-primary, #38bdf8)';
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary, #cbd5e1)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '1rem', opacity: 0.7 }}>
                {item.icon || 'chevron_right'}
              </span>
              <span>{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
