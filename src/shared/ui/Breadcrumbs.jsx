import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';

/**
 * @file Breadcrumbs.jsx
 * @description Componente de jerarquía de navegación (Breadcrumbs) con soporte JSON-LD Schema para SEO.
 */
export const Breadcrumbs = ({ items = [] }) => {
  const { setActiveTab } = useAppStore();

  if (!items || items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.path ? `https://nmergeia.com/#${item.path.replace(/^\//, '')}` : undefined
    }))
  };

  return (
    <nav 
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.7rem',
        color: 'var(--text-tertiary)',
        marginBottom: '4px',
        marginTop: '0px',
        flexWrap: 'wrap',
        fontFamily: '"Outfit", sans-serif'
      }}
    >
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      <span 
        className="breadcrumb-item-link"
        onClick={() => { window.location.hash = 'landing'; setActiveTab('landing'); }}
        style={{ cursor: 'pointer', color: 'var(--accent-primary)', textDecoration: 'none', transition: 'color 0.2s' }}
      >
        Inicio
      </span>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <span style={{ opacity: 0.4, fontSize: '0.7rem' }}>/</span>
          {item.tabId ? (
            <span 
              className="breadcrumb-item-link"
              onClick={() => { window.location.hash = item.tabId; setActiveTab(item.tabId); }}
              style={{ cursor: 'pointer', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
            >
              {item.label}
            </span>
          ) : (
            <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
