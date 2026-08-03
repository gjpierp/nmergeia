import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';

/**
 * @file Breadcrumbs.jsx
 * @description Componente de jerarquía de navegación (Breadcrumbs) con marcado Schema.org BreadcrumbList HTML Microdata y JSON-LD.
 */
export const Breadcrumbs = ({ items = [] }) => {
  const { setActiveTab } = useAppStore();

  if (!items || items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://nmergeia.com/"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": item.path ? `https://nmergeia.com/#${item.path.replace(/^\//, '')}` : `https://nmergeia.com/#${item.tabId || ''}`
      }))
    ]
  };

  return (
    <nav 
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.75rem',
        color: 'var(--text-tertiary)',
        marginBottom: '16px',
        marginTop: '0px',
        padding: '10px 20px',
        marginLeft: '-20px',
        marginRight: '-20px',
        flexWrap: 'wrap',
        fontFamily: '"Outfit", sans-serif',
        position: 'sticky',
        top: 0,
        zIndex: 95,
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-light)',
        boxSizing: 'border-box'
      }}
    >
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      <ol 
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          flexWrap: 'wrap'
        }}
      >
        <li 
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <a 
            itemProp="item" 
            href="/"
            className="breadcrumb-item-link"
            onClick={(e) => { e.preventDefault(); setActiveTab('landing'); }}
            style={{ cursor: 'pointer', color: 'var(--accent-primary)', textDecoration: 'none', transition: 'color 0.2s' }}
          >
            <span itemProp="name">Inicio</span>
          </a>
          <meta itemProp="position" content="1" />
        </li>

        {items.map((item, idx) => (
          <li 
            key={idx}
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <span style={{ opacity: 0.4, fontSize: '0.7rem' }}>/</span>
            {item.tabId ? (
              <a 
                itemProp="item"
                href={`#${item.tabId}`}
                className="breadcrumb-item-link"
                onClick={(e) => { e.preventDefault(); setActiveTab(item.tabId); }}
                style={{ cursor: 'pointer', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
              >
                <span itemProp="name">{item.label}</span>
              </a>
            ) : (
              <span itemProp="name" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={`${idx + 2}`} />
          </li>
        ))}
      </ol>
    </nav>
  );
};
