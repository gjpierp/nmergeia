import React, { useState } from 'react';
import logoPng from '../../assets/logo.png';

/**
 * @file Logo.jsx
 * @description Componente accesible e inquebrantable para el logotipo oficial de NMerge IA.
 * Incluye atributo alt explícito, soporte de alta resolución y respaldo SVG vectorizado.
 */
export const Logo = ({ height = '42px', className = '', style = {}, alt = 'NMerge IA - StackUpIA Logo' }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Respaldo vectorial SVG garantizado si la imagen física no pudiera cargarse
    return (
      <div 
        className={`app-logo-svg-fallback ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: '"Outfit", sans-serif',
          fontWeight: '800',
          fontSize: '1.25rem',
          color: 'var(--text-primary)',
          userSelect: 'none',
          ...style
        }}
        aria-label={alt}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="url(#logo_grad)" />
          <path d="M9 16L14 21L23 11" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="logo_grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>
          </defs>
        </svg>
        <span>N<span style={{ color: '#10b981' }}>Merge</span><span style={{ fontSize: '0.8em', opacity: 0.8, marginLeft: '4px' }}>IA</span></span>
      </div>
    );
  }

  return (
    <img 
      src={logoPng} 
      alt={alt} 
      className={`app-logo-img ${className}`}
      style={{ 
        height: height, 
        width: 'auto', 
        objectFit: 'contain',
        filter: 'drop-shadow(0 2px 8px rgba(16, 185, 129, 0.12))',
        ...style 
      }} 
      onError={() => setHasError(true)}
    />
  );
};
