import React from 'react';

export const HistoryScreen = ({
  savedProfiles,
  loadProfile,
  setActiveTab,
  renameProfile,
  deleteProfile
}) => {
  return (
    <div className="main-screen">
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Historial de Comparaciónes Guardadas</h2>
      <div className="section-card">
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>
          Haz clic en un historial para cargar sus carpetas y filtros.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {savedProfiles.length === 0 && <p style={{ color: 'var(--text-tertiary)' }}>No hay historiales guardados.</p>}
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
                data-tooltip="Renombrar Historial"
                onClick={async (e) => { e.stopPropagation(); await renameProfile(p); }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>edit</span>
              </button>
              <button
                className="btn clear-btn small-btn"
                style={{ padding: '2px 6px', fontSize: '0.75rem' }}
                data-tooltip="Eliminar Historial"
                onClick={async (e) => { e.stopPropagation(); await deleteProfile(p); }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
