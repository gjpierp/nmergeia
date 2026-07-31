import React, { useEffect, useState } from 'react';
import { SentinelAdsService } from '../services/sentinel-ads.service.ts';
import { useAppStore } from '../../useAppStore.js';

export const AppAdRightAside = ({ position = 'RIGHT_ASIDE', onHasAdsChange }) => {
  const [announcements, setAnnouncements] = useState([]);
  const userSession = useAppStore(s => s.userSession);
  const userId = userSession?.id || userSession?.user_id || 'anonymous';
  const roleCode = userSession?.roles?.[0] || null;

  useEffect(() => {
    let isMounted = true;
    SentinelAdsService.getActiveAnnouncements(position, userId, roleCode)
      .then(ads => {
        if (isMounted) {
          const list = Array.isArray(ads) ? ads : [];
          setAnnouncements(list);
          if (onHasAdsChange) onHasAdsChange(list.length > 0);
        }
      })
      .catch(err => {
        console.warn('AppAdRightAside: error cargando anuncios:', err);
        if (onHasAdsChange) onHasAdsChange(false);
      });
    return () => { isMounted = false; };
  }, [position, userId, roleCode, onHasAdsChange]);

  const handleDismiss = async (announcementId) => {
    await SentinelAdsService.dismissAnnouncement(announcementId, userId);
    setAnnouncements(prev => {
      const updated = prev.filter(a => a.announcement_id !== announcementId);
      if (onHasAdsChange) onHasAdsChange(updated.length > 0);
      return updated;
    });
  };

  if (!announcements || announcements.length === 0) return null;

  return (
    <aside className="sentinel-ad-right-aside-container" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '16px',
      width: '240px',
      minWidth: '200px',
      boxSizing: 'border-box',
      background: 'var(--bg-glass, rgba(10, 10, 12, 0.85))',
      borderLeft: '1px solid var(--border-color, #1e293b)',
      height: '100%',
      overflowY: 'auto',
      flexShrink: 0
    }}>
      <div style={{ borderBottom: '1px solid var(--border-color, #1e293b)', paddingBottom: '8px', textAlign: 'center' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Comunicados Sentinel
        </span>
      </div>
      {announcements.map(ad => (
        <div key={ad.announcement_id} className="sentinel-ad-card ad-right-aside" style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-light, rgba(6, 182, 212, 0.25))',
          borderRadius: '10px',
          padding: '14px',
          color: 'var(--text-primary, #f8fafc)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              background: ad.announcement_type === 'CRITICAL' ? '#ef4444' : ad.announcement_type === 'WARNING' ? '#f59e0b' : 'var(--accent-primary, #06b6d4)',
              color: '#fff'
            }}>
              {ad.announcement_type || 'INFO'}
            </span>
            {ad.is_dismissible && (
              <button 
                onClick={() => handleDismiss(ad.announcement_id)}
                title="Cerrar"
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary, #64748b)', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            )}
          </div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>{ad.title}</h4>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{ad.message}</p>
          {ad.action_url && (
            <a 
              href={ad.action_url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#fff',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                borderRadius: '6px',
                textDecoration: 'none',
                boxSizing: 'border-box'
              }}
            >
              {ad.action_label || 'Más información'}
            </a>
          )}
        </div>
      ))}
    </aside>
  );
};
