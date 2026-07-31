import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../shared/ui/PageHeader.jsx';

export const HistoryScreen = ({
  savedProfiles,
  loadProfile,
  setActiveTab,
  renameProfile,
  deleteProfile
}) => {
  const { t } = useTranslation();
  return (
    <div className="main-screen" style={{ padding: '20px' }}>
      <PageHeader 
        icon="history" 
        title={t('history_title')} 
        subtitle={t('history_subtitle')} 
      />
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {savedProfiles.length === 0 && <p style={{ color: 'var(--text-tertiary)' }}>{t('no_history')}</p>}
        {savedProfiles.map(p => (
          <div
            key={p.id}
            className="profile-card"
            style={{ display: 'flex', alignItems: 'center', minWidth: '150px' }}
            onClick={() => { loadProfile(p); setActiveTab('main'); }}
          >
            <strong style={{ color: 'var(--text-primary)', fontSize: '1rem', flex: 1 }}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '5px' }}>history</span>
              {p.name}
            </strong>
            <button
              className="btn secondary-btn small-btn"
              style={{ padding: '2px 6px', fontSize: '0.75rem', marginRight: '5px' }}
              data-tooltip={t('tooltip_rename_history')}
              onClick={async (e) => { e.stopPropagation(); await renameProfile(p); }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>edit</span>
            </button>
            <button
              className="btn clear-btn small-btn"
              style={{ padding: '2px 6px', fontSize: '0.75rem' }}
              data-tooltip={t('tooltip_delete_history')}
              onClick={async (e) => { e.stopPropagation(); await deleteProfile(p); }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
