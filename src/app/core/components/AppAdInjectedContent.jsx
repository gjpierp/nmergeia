import React, { useEffect, useState } from 'react';
import { SentinelAdsService } from '../services/sentinel-ads.service.ts';
import { useAppStore } from '../../useAppStore.js';

export const AppAdInjectedContent = ({ children, position = 'INLINE_CONTENT', interval = 3 }) => {
  const [announcements, setAnnouncements] = useState([]);
  const userSession = useAppStore(s => s.userSession);
  const userId = userSession?.id || userSession?.user_id || 'anonymous';
  const roleCode = userSession?.roles?.[0] || null;

  useEffect(() => {
    let isMounted = true;
    SentinelAdsService.getActiveAnnouncements(position, userId, roleCode)
      .then(ads => {
        if (isMounted && Array.isArray(ads)) {
          setAnnouncements(ads);
        }
      })
      .catch(err => {
        console.warn('AppAdInjectedContent: error cargando anuncios:', err);
      });
    return () => { isMounted = false; };
  }, [position, userId, roleCode]);

  const handleDismiss = async (announcementId) => {
    await SentinelAdsService.dismissAnnouncement(announcementId, userId);
    setAnnouncements(prev => prev.filter(a => a.announcement_id !== announcementId));
  };

  const renderInlineAd = (ad) => (
    <div key={`inline-ad-${ad.announcement_id}`} className="sentinel-ad-inline-card" style={{
      margin: '1.5rem 0',
      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
      border: '1px solid var(--border-light, rgba(6, 182, 212, 0.3))',
      borderLeft: '4px solid var(--accent-primary, #06b6d4)',
      borderRadius: '12px',
      padding: '1.25rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '4px',
          background: 'var(--bg-glass, rgba(10, 10, 12, 0.8))',
          color: ad.announcement_type === 'CRITICAL' ? '#ef4444' : ad.announcement_type === 'WARNING' ? '#f59e0b' : 'var(--accent-primary, #06b6d4)',
          border: '1px solid var(--border-color)'
        }}>
          {ad.announcement_type || 'INFO'} (Patrocinado / Sentinel)
        </span>
        {ad.is_dismissible && (
          <button 
            onClick={() => handleDismiss(ad.announcement_id)}
            title="Ocultar anuncio"
            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary, #64748b)', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            &times;
          </button>
        )}
      </div>
      <div>
        <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ad.title}</h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ad.message}</p>
      </div>
      {ad.action_url && (
        <div style={{ marginTop: '12px' }}>
          <a 
            href={ad.action_url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              borderRadius: '6px',
              textDecoration: 'none'
            }}
          >
            {ad.action_label || 'Descubrir más'} &rarr;
          </a>
        </div>
      )}
    </div>
  );

  // Si se pasan hijos (elementos / párrafos), inyectamos anuncios cada N párrafos (default = 3)
  if (children) {
    const childArray = React.Children.toArray(children);
    const result = [];
    let pCount = 0;
    let adIndex = 0;

    childArray.forEach((child, index) => {
      result.push(child);
      // Contar elementos <p> o bloques de texto
      if (child?.type === 'p' || (typeof child === 'object' && child?.props?.children)) {
        pCount++;
        if (pCount % interval === 0 && announcements[adIndex]) {
          result.push(renderInlineAd(announcements[adIndex]));
          adIndex = (adIndex + 1) % announcements.length;
        }
      }
    });

    return <div className="sentinel-ad-injected-wrapper">{result}</div>;
  }

  // Si no hay hijos, simplemente renderiza los anuncios en línea disponibles
  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="sentinel-ad-injected-container">
      {announcements.map(ad => renderInlineAd(ad))}
    </div>
  );
};
