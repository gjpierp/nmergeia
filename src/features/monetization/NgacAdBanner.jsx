import React, { useEffect, useState } from 'react';
import { NgacService } from '../../shared/lib/NgacService.js';
import { useAppStore } from '../../app/useAppStore.js';

// Función helper para verificar si existe una configuración activa para la posición solicitada
export const getAdConfig = (position) => {
  if (typeof window === 'undefined') return null;
  
  let config = window.nmergeAdConfig || null;
  if (!config) {
    try {
      const stored = localStorage.getItem('nmerge_ad_config');
      if (stored) config = JSON.parse(stored);
    } catch (_) {}
  }
  
  if (!config || !config.enabled) return null;

  // Si la configuración especifica banners por posición
  if (config.positions && config.positions[position]) {
    return config.positions[position];
  }
  
  // Si existe una configuración global genérica
  if (config.contentUrl || config.html || config.imageUrl) {
    return config;
  }

  return null;
};

export const NgacAdBanner = ({ position = 'Top' }) => {
  const [isVisible, setIsVisible] = useState(true);

  let userSession = null;
  let userSessionStr = null;
  try {
    userSessionStr = typeof window !== 'undefined' ? localStorage.getItem('nmerge_user_session') : null;
    userSession = userSessionStr && userSessionStr !== 'undefined' ? JSON.parse(userSessionStr) : null;
  } catch (e) {
    console.warn('Failed to parse user session in NgacAdBanner:', e);
  }
  const userRoles = userSession ? userSession.roles || [] : ['ROLE_INVITADO'];

  useEffect(() => {
    const resourceName = `AdBanner${position}`;
    const isNgacLocked = typeof window !== 'undefined' ? localStorage.getItem('nmergeia_ngac_locked') === 'true' : true;
    
    if (isNgacLocked) {
      const hasPermissionToHide = !NgacService.checkPermission(resourceName, userRoles);
      setIsVisible(!hasPermissionToHide);
    } else {
      setIsVisible(false);
    }
  }, [userSessionStr, position]);

  // Si el usuario no ha configurado publicidad, NO se muestra NADA (0 Banners)
  const adConfig = getAdConfig(position);

  if (!isVisible || !adConfig) return null;

  const stylesByPosition = {
    Top: {
      background: 'var(--bg-glass)',
      color: 'var(--text-secondary)',
      padding: '0.6rem',
      textAlign: 'center',
      fontSize: '11px',
      borderRadius: '4px',
      margin: '0.5rem 0.5rem 0 0.5rem',
      border: '1px solid var(--border-color)',
    },
    Sidebar: {
      background: 'var(--bg-glass)',
      border: '1px solid var(--border-color)',
      color: 'var(--text-secondary)',
      padding: '12px',
      textAlign: 'center',
      fontSize: '11px',
      borderRadius: '6px',
      margin: '10px 15px',
      boxSizing: 'border-box'
    },
    RightSidebar: {
      background: 'var(--bg-glass)',
      border: '1px solid var(--border-color)',
      color: 'var(--text-secondary)',
      padding: '12px',
      textAlign: 'center',
      fontSize: '11px',
      borderRadius: '6px',
      boxSizing: 'border-box'
    },
    Matrix: {
      background: 'var(--bg-glass)',
      borderTop: '1px solid var(--border-color)',
      color: 'var(--text-secondary)',
      padding: '10px 15px',
      textAlign: 'center',
      fontSize: '11px'
    }
  };

  const currentStyle = stylesByPosition[position] || stylesByPosition.Top;

  return (
    <div className={`ngac-ad-banner ad-banner-${position.toLowerCase()}`} style={currentStyle}>
      {adConfig.html ? (
        <div dangerouslySetInnerHTML={{ __html: adConfig.html }} />
      ) : (
        <>
          <div style={{ opacity: 0.7, marginBottom: adConfig.imageUrl ? '6px' : 0 }}>{adConfig.title || `Publicidad (${position})`}</div>
          {adConfig.imageUrl && (
            <a href={adConfig.linkUrl || '#'} target="_blank" rel="noopener noreferrer">
              <img src={adConfig.imageUrl} alt={adConfig.title || "Anuncio Publicitario Patrocinado - NMerge IA"} style={{ maxWidth: '100%', borderRadius: '4px' }} />
            </a>
          )}
        </>
      )}
    </div>
  );
};
