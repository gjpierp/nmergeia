import React, { useEffect, useState } from 'react';
import { SentinelAdsService } from '../services/sentinel-ads.service.ts';
import { useAppStore } from '../../useAppStore.js';

export const AppAdSidebarSlot = ({ position = 'SIDEBAR_BOTTOM' }) => {
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
        console.warn('AppAdSidebarSlot: error cargando anuncios:', err);
      });
    return () => { isMounted = false; };
  }, [position, userId, roleCode]);

  const handleDismiss = async (announcementId) => {
    await SentinelAdsService.dismissAnnouncement(announcementId, userId);
    setAnnouncements(prev => prev.filter(a => a.announcement_id !== announcementId));
  };

  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="sentinel-ad-sidebar-slot-container" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '12px',
      width: '100%',
      boxSizing: 'border-box',
      background: 'rgba(15, 23, 42, 0.5)',
      borderTop: '1px solid var(--border-color, #1e293b)',
      borderRadius: '8px',
      marginTop: 'auto'
    }}>
      {announcements.map(ad => (
        <div key={ad.announcement_id} class="sentinel-ad-card ad-sidebar-bottom" style={{
          background: 'var(--bg-glass, rgba(10, 10, 12, 0.85))',
          border: '1px solid var(--border-light, rgba(6, 182, 212, 0.25))',
          borderRadius: '8px',
          padding: '12px',
          color: 'var(--text-primary, #f8fafc)',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
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
                title="Descartar anuncio"
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary, #64748b)', fontSize: '1.1rem', cursor: 'pointer', padding: '0 4px' }}
              >
                &times;
              </button>
            )}
          </div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{ad.title}</h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{ad.message}</p>
          {ad.action_url && (
            <a 
              href={ad.action_url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#fff',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                borderRadius: '4px',
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              {ad.action_label || 'Ver más'}
            </a>
          )}
        </div>
      ))}
    </div>
  );
};
