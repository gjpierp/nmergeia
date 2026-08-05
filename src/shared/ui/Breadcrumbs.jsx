import React from 'react';
import { useAppStore } from '../../app/useAppStore.js';

/**
 * @file Breadcrumbs.jsx
 * @description Componente de jerarquía de navegación (Breadcrumbs) con marcado Schema.org BreadcrumbList HTML Microdata y JSON-LD.
 */
export const Breadcrumbs = ({ items = [] }) => {
  const { setActiveTab } = useAppStore();

  if (!items || items.length === 0) return null;

  const baseUrl = typeof window !== 'undefined' && window.location && window.location.origin.startsWith('http') 
    ? window.location.origin 
    : 'https://nmergeia.com';

  // Filter out any redundant 'Inicio' item if passed in items
  const cleanItems = items.filter(item => item.label && item.label.toLowerCase() !== 'inicio');

  const getItemUrl = (item) => {
    if (item.path) {
      const cleanPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
      return `${baseUrl}${cleanPath}`;
    }
    if (item.tabId) {
      return `${baseUrl}/${item.tabId.replace(/^temas\//, 'temas/')}`;
    }
    const slug = encodeURIComponent(item.label.toLowerCase().replace(/\s+/g, '-'));
    return `${baseUrl}/${slug}`;
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": `${baseUrl}/`
      },
      ...cleanItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": getItemUrl(item)
      }))
    ]
  };

  return (
    <nav 
      aria-label="Breadcrumb"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        fontSize: '0.8rem',
        color: 'var(--text-tertiary)',
        marginBottom: '16px',
        marginTop: '0px',
        padding: '10px 16px',
        marginLeft: '0px',
        marginRight: '0px',
        flexWrap: 'wrap',
        fontFamily: '"Outfit", sans-serif',
        background: 'var(--bg-glass, rgba(10, 15, 27, 0.95))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-light, rgba(6, 182, 212, 0.2))',
        borderRadius: '0 0 10px 10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
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
            href={`${baseUrl}/`}
            className="breadcrumb-item-link"
            onClick={(e) => { e.preventDefault(); setActiveTab('landing'); }}
            style={{ cursor: 'pointer', color: 'var(--accent-primary)', textDecoration: 'none', transition: 'color 0.2s' }}
          >
            <span itemProp="name">Inicio</span>
          </a>
          <meta itemProp="position" content="1" />
        </li>

        {cleanItems.map((item, idx) => {
          const itemUrl = getItemUrl(item);
          const isLast = idx === cleanItems.length - 1;
          return (
            <li 
              key={idx}
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <span style={{ opacity: 0.4, fontSize: '0.7rem' }}>/</span>
              <a 
                itemProp="item"
                href={itemUrl}
                className="breadcrumb-item-link"
                onClick={(e) => { 
                  if (item.tabId) {
                    e.preventDefault(); 
                    setActiveTab(item.tabId); 
                  }
                }}
                style={{ 
                  cursor: 'pointer', 
                  color: isLast ? 'var(--text-primary)' : 'var(--text-secondary)', 
                  fontWeight: isLast ? '600' : '400',
                  textDecoration: 'none', 
                  transition: 'color 0.2s' 
                }}
              >
                <span itemProp="name">{item.label}</span>
              </a>
              <meta itemProp="position" content={`${idx + 2}`} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
