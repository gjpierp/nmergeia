import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { useTranslation } from 'react-i18next';
import { NgacService } from '../lib/NgacService.js';
import { NgacAdBanner } from '../../features/monetization/NgacAdBanner.jsx';

export const Sidebar = () => {
  const { t } = useTranslation();
  const { activeTab, setActiveTab, userSession } = useAppStore();
  const [allowedOptions, setAllowedOptions] = useState([
    'Comparar', 'Historial', 'Filtros', 'FAQ', 
    'PostgresInicial', 'PostgresBasico', 'PostgresMedio', 'PostgresAvanzado', 'PostgresExperto'
  ]); 
  
  const [isHelpFolderOpen, setIsHelpFolderOpen] = useState(false);
  const [isDbFolderOpen, setIsDbFolderOpen] = useState(false);
  const [isPostgresFolderOpen, setIsPostgresFolderOpen] = useState(false);
  const [isOracleFolderOpen, setIsOracleFolderOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    const userRoles = userSession ? userSession.roles || [] : ['ROLE_INVITADO'];
    NgacService.getDynamicMenu(userRoles, !!userSession)
      .then(options => {
        if (options && options.length > 0) {
          setAllowedOptions(options);
        }
      })
      .catch(e => console.error("Error cargando menú dinámico de Sentinel:", e));
  }, [userSession]);

  // Lógica: Si el sidebar se colapsa, cerramos las carpetas A MENOS que un hijo esté activo.
  // Si un hijo está activo, abrimos automáticamente toda la rama de sus padres.
  useEffect(() => {
    const isHelpChildActive = activeTab === 'faq' || activeTab.startsWith('postgres-') || activeTab.startsWith('oracle-');
    const isDbChildActive = activeTab.startsWith('postgres-') || activeTab.startsWith('oracle-');
    const isPostgresChildActive = activeTab.startsWith('postgres-');
    const isOracleChildActive = activeTab.startsWith('oracle-');

    if (isCollapsed) {
      setIsHelpFolderOpen(isHelpChildActive);
      setIsDbFolderOpen(isDbChildActive);
      setIsPostgresFolderOpen(isPostgresChildActive);
      setIsOracleFolderOpen(isOracleChildActive);
    } else {
      // Al expandir, podríamos querer abrir la rama activa también.
      if (isHelpChildActive) setIsHelpFolderOpen(true);
      if (isDbChildActive) setIsDbFolderOpen(true);
      if (isPostgresChildActive) setIsPostgresFolderOpen(true);
      if (isOracleChildActive) setIsOracleFolderOpen(true);
    }
  }, [isCollapsed, activeTab]);

  const showComparar = allowedOptions.includes('Comparar');
  const showLicencia = allowedOptions.includes('Licencia');
  const showHistorial = allowedOptions.includes('Historial');
  const showFiltros = allowedOptions.includes('Filtros');
  const showFaq = allowedOptions.includes('FAQ');
  const showPostgresInicial = allowedOptions.includes('PostgresInicial');
  const showPostgresBasico = allowedOptions.includes('PostgresBasico');
  const showPostgresMedio = allowedOptions.includes('PostgresMedio');
  const showPostgresAvanzado = allowedOptions.includes('PostgresAvanzado');
  const showPostgresExperto = allowedOptions.includes('PostgresExperto');

  const hasHelpContent = showFaq || showPostgresInicial || showPostgresBasico || showPostgresMedio || showPostgresAvanzado || showPostgresExperto;

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="sidebar-btn toggle-collapse-btn" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ 
          justifyContent: isCollapsed ? 'center' : 'flex-end', 
          padding: isCollapsed ? '12px 0' : '10px 20px', 
          borderBottom: '1px solid var(--border-color)', 
          marginBottom: '10px',
          width: '100%',
          boxSizing: 'border-box'
        }}
        data-tooltip={isCollapsed ? "Expandir menú" : "Colapsar menú"}
      >
        <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>menu</span>
        {!isCollapsed && <span>{t('collapse_menu', { defaultValue: 'Colapsar' })}</span>}
      </button>

      {/* PÁGINA PRINCIPAL / INICIO (Siempre Visible) */}
      <button className={`sidebar-btn ${activeTab === 'landing' ? 'active' : ''}`} data-tooltip="Inicio" onClick={() => setActiveTab('landing')}>
        <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>home</span> 
        {!isCollapsed && <span>Inicio</span>}
      </button>

      {showComparar && (
        <button className={`sidebar-btn ${activeTab === 'main' ? 'active' : ''}`} data-tooltip={t('nav_compare')} onClick={() => setActiveTab('main')}>
          <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>compare</span> 
          {!isCollapsed && <span>{t('nav_compare', { defaultValue: 'Comparar' })}</span>}
        </button>
      )}

      {showLicencia && (
        <button className={`sidebar-btn ${activeTab === 'register' ? 'active' : ''}`} data-tooltip={t('nav_license')} onClick={() => setActiveTab('register')}>
          <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>card_membership</span> 
          {!isCollapsed && <span>{t('nav_license', { defaultValue: 'Licencia' })}</span>}
        </button>
      )}

      {showHistorial && (
        <button className={`sidebar-btn ${activeTab === 'history' ? 'active' : ''}`} data-tooltip={t('nav_history')} onClick={() => setActiveTab('history')}>
          <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>history</span> 
          {!isCollapsed && <span>{t('nav_history', { defaultValue: 'Historial' })}</span>}
        </button>
      )}

      {showFiltros && (
        <button className={`sidebar-btn ${activeTab === 'filters' ? 'active' : ''}`} data-tooltip={t('nav_filters')} onClick={() => setActiveTab('filters')}>
          <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>filter_alt</span> 
          {!isCollapsed && <span>{t('nav_filters', { defaultValue: 'Filtros' })}</span>}
        </button>
      )}

      {/* ACORDEÓN UNIFICADO: AYUDA Y GUÍAS */}
      {hasHelpContent && (
        <>
          <button 
            className={`sidebar-btn ${isHelpFolderOpen ? 'active-folder' : ''}`} 
            onClick={() => setIsHelpFolderOpen(!isHelpFolderOpen)}
            data-tooltip="Ayuda y Guías"
            style={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'space-between', alignItems: 'center', width: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: isCollapsed ? 'center' : 'flex-start', width: isCollapsed ? '100%' : 'auto' }}>
              <span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: 'var(--accent-secondary)'}}>folder</span>
              {!isCollapsed && <span>Ayuda y Guías</span>}
            </div>
            {!isCollapsed && (
              <span className="material-symbols-rounded" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                {isHelpFolderOpen ? 'expand_less' : 'expand_more'}
              </span>
            )}
          </button>

          {isHelpFolderOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: isCollapsed ? '0' : '1rem', width: '100%', boxSizing: 'border-box' }}>
              {showFaq && (
                <button className={`sidebar-btn ${activeTab === 'faq' ? 'active' : ''}`} data-tooltip="FAQ" onClick={() => setActiveTab('faq')} style={{ fontSize: '0.82rem', padding: isCollapsed ? '10px 0' : '8px 12px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                  <span className="material-symbols-rounded" style={{fontSize: '1.05rem', marginRight: isCollapsed ? '0' : '6px', color: 'var(--accent-primary)'}}>help</span>
                  {!isCollapsed && 'FAQ'}
                </button>
              )}

              <button 
                className={`sidebar-btn ${isDbFolderOpen ? 'active-folder' : ''}`} 
                onClick={() => setIsDbFolderOpen(!isDbFolderOpen)}
                data-tooltip="Bases de Datos"
                style={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'space-between', alignItems: 'center', width: '100%', fontSize: '0.82rem', padding: isCollapsed ? '10px 0' : '8px 12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: isCollapsed ? 'center' : 'flex-start', width: isCollapsed ? '100%' : 'auto' }}>
                  <span className="material-symbols-rounded" style={{fontSize: '1.05rem', color: 'var(--accent-secondary)'}}>database</span>
                  {!isCollapsed && <span>Bases de Datos</span>}
                </div>
                {!isCollapsed && (
                  <span className="material-symbols-rounded" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                    {isDbFolderOpen ? 'expand_less' : 'expand_more'}
                  </span>
                )}
              </button>

              {isDbFolderOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: isCollapsed ? '0' : '1rem', width: '100%', boxSizing: 'border-box' }}>
                  
                  {/* POSTGRESQL */}
                  <button 
                    className={`sidebar-btn ${isPostgresFolderOpen ? 'active-folder' : ''}`} 
                    onClick={() => setIsPostgresFolderOpen(!isPostgresFolderOpen)}
                    data-tooltip="PostgreSQL"
                    style={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'space-between', alignItems: 'center', width: '100%', fontSize: '0.82rem', padding: isCollapsed ? '10px 0' : '6px 12px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: isCollapsed ? 'center' : 'flex-start', width: isCollapsed ? '100%' : 'auto' }}>
                      <span className="material-symbols-rounded" style={{fontSize: '1rem', color: '#336791'}}>storage</span>
                      {!isCollapsed && <span>PostgreSQL</span>}
                    </div>
                    {!isCollapsed && (
                      <span className="material-symbols-rounded" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        {isPostgresFolderOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    )}
                  </button>

                  {isPostgresFolderOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: isCollapsed ? '0' : '0.8rem', width: '100%', boxSizing: 'border-box' }}>
                      {showPostgresInicial && (
                        <button className={`sidebar-btn ${activeTab === 'postgres-inicial' ? 'active' : ''}`} data-tooltip="Postgres Inicial" onClick={() => setActiveTab('postgres-inicial')} style={{ fontSize: '0.78rem', padding: isCollapsed ? '10px 0' : '6px 10px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                          <span className="material-symbols-rounded" style={{fontSize: '0.9rem', marginRight: isCollapsed ? '0' : '4px', color: 'var(--text-secondary)'}}>play_circle</span>
                          {!isCollapsed && 'Inicial'}
                        </button>
                      )}
                      {showPostgresBasico && (
                        <button className={`sidebar-btn ${activeTab === 'postgres-basico' ? 'active' : ''}`} data-tooltip="Postgres Básica" onClick={() => setActiveTab('postgres-basico')} style={{ fontSize: '0.78rem', padding: isCollapsed ? '10px 0' : '6px 10px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                          <span className="material-symbols-rounded" style={{fontSize: '0.9rem', marginRight: isCollapsed ? '0' : '4px', color: 'var(--accent-primary)'}}>school</span>
                          {!isCollapsed && 'Básica'}
                        </button>
                      )}
                      {showPostgresMedio && (
                        <button className={`sidebar-btn ${activeTab === 'postgres-medio' ? 'active' : ''}`} data-tooltip="Postgres Media" onClick={() => setActiveTab('postgres-medio')} style={{ fontSize: '0.78rem', padding: isCollapsed ? '10px 0' : '6px 10px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                          <span className="material-symbols-rounded" style={{fontSize: '0.9rem', marginRight: isCollapsed ? '0' : '4px', color: 'var(--accent-secondary)'}}>model_training</span>
                          {!isCollapsed && 'Media'}
                        </button>
                      )}
                      {showPostgresAvanzado && (
                        <button className={`sidebar-btn ${activeTab === 'postgres-avanzado' ? 'active' : ''}`} data-tooltip="Postgres Avanzada" onClick={() => setActiveTab('postgres-avanzado')} style={{ fontSize: '0.78rem', padding: isCollapsed ? '10px 0' : '6px 10px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                          <span className="material-symbols-rounded" style={{fontSize: '0.9rem', marginRight: isCollapsed ? '0' : '4px', color: 'var(--error-color)'}}>rocket_launch</span>
                          {!isCollapsed && 'Avanzada'}
                        </button>
                      )}
                      {showPostgresExperto && (
                        <button className={`sidebar-btn ${activeTab === 'postgres-experto' ? 'active' : ''}`} data-tooltip="Postgres Experto" onClick={() => setActiveTab('postgres-experto')} style={{ fontSize: '0.78rem', padding: isCollapsed ? '10px 0' : '6px 10px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                          <span className="material-symbols-rounded" style={{fontSize: '0.9rem', marginRight: isCollapsed ? '0' : '4px', color: '#8E24AA'}}>workspace_premium</span>
                          {!isCollapsed && 'Experto'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* ORACLE */}
                  <button 
                    className={`sidebar-btn ${isOracleFolderOpen ? 'active-folder' : ''}`} 
                    onClick={() => setIsOracleFolderOpen(!isOracleFolderOpen)}
                    data-tooltip="Oracle"
                    style={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'space-between', alignItems: 'center', width: '100%', fontSize: '0.82rem', padding: isCollapsed ? '10px 0' : '6px 12px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: isCollapsed ? 'center' : 'flex-start', width: isCollapsed ? '100%' : 'auto' }}>
                      <span className="material-symbols-rounded" style={{fontSize: '1rem', color: '#F80000'}}>storage</span>
                      {!isCollapsed && <span>Oracle</span>}
                    </div>
                    {!isCollapsed && (
                      <span className="material-symbols-rounded" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        {isOracleFolderOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    )}
                  </button>

                  {isOracleFolderOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: isCollapsed ? '0' : '0.8rem', width: '100%', boxSizing: 'border-box' }}>
                       <button className={`sidebar-btn ${activeTab === 'oracle-basico' ? 'active' : ''}`} data-tooltip="Oracle Básica (Próximamente)" onClick={() => {}} style={{ fontSize: '0.78rem', padding: isCollapsed ? '10px 0' : '6px 10px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                          <span className="material-symbols-rounded" style={{fontSize: '0.9rem', marginRight: isCollapsed ? '0' : '4px', color: 'var(--text-secondary)'}}>school</span>
                          {!isCollapsed && 'Básica'}
                        </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {allowedOptions.includes('Terminal') && (
        <button className={`sidebar-btn ${activeTab === 'terminal' ? 'active' : ''}`} data-tooltip="Terminal de comandos" onClick={() => setActiveTab('terminal')}>
          <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>terminal</span> 
          {!isCollapsed && <span>Terminal</span>}
        </button>
      )}

      {!isCollapsed && <NgacAdBanner position="Sidebar" />}
 
      {!isCollapsed && (
        <div style={{ marginTop: 'auto', padding: '15px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%' }}>
          <NgacAdBanner position="Sidebar" />
        </div>
      )}
    </aside>
  );
};
