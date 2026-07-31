import React, { useEffect } from 'react';
import { saveHandle, getHandle } from './shared/lib/DatabaseService.js';
import { useAppStore } from './app/useAppStore.js';
import { useTranslation } from 'react-i18next';
import { CustomModal, showModal } from './shared/ui/CustomModal.jsx';
import { PremiumModal } from './features/monetization/PremiumModal.jsx';
import { NgacAdBanner } from './features/monetization/NgacAdBanner.jsx';
import { useMonetizationStore } from './features/monetization/MonetizationStore.js';
import { NgacService } from './shared/lib/NgacService.js';
import { Sidebar } from './shared/ui/Sidebar.jsx';
import { FiltersPanel } from './features/filters/ui/FiltersPanel.jsx';
import { DiffView } from './features/diff/DiffView.jsx';
import { Helmet } from 'react-helmet-async';
import { useMatrixProcessor } from './hooks/useMatrixProcessor.js';
import { useFileHandles } from './hooks/useFileHandles.js';
import { useProfiles } from './hooks/useProfiles.js';
import { useEqualityWorker } from './hooks/useEqualityWorker.js';
import { MatrixView } from './features/matrix/MatrixView.jsx';
import { MainScreen } from './features/matrix/ui/MainScreen.jsx';
import { HistoryScreen } from './features/history/ui/HistoryScreen.jsx';
import { CommandTerminal } from './features/terminal/CommandTerminal.jsx';
import { LandingPage } from './features/landing/LandingPage.jsx';
import { PrivacyPage } from './features/landing/PrivacyPage.jsx';
import { TermsPage } from './features/landing/TermsPage.jsx';
import { AboutPage } from './features/landing/AboutPage.jsx';
import { ContactPage } from './features/landing/ContactPage.jsx';
import { DocsPanel } from './features/landing/DocsPanel.jsx';
import { FaqPage } from './features/landing/FaqPage.jsx';
import { PostgresGuideInitialPage } from './features/landing/PostgresGuideInitialPage.jsx';
import { PostgresGuideBasicPage } from './features/landing/PostgresGuideBasicPage.jsx';
import { PostgresGuideMediumPage } from './features/landing/PostgresGuideMediumPage.jsx';
import { PostgresGuideAdvancedPage } from './features/landing/PostgresGuideAdvancedPage.jsx';
import { PostgresGuideExpertPage } from './features/landing/PostgresGuideExpertPage.jsx';
import { PricingPage } from './features/landing/PricingPage.jsx';
import { FeaturesPage } from './features/landing/FeaturesPage.jsx';
import { RegisterPage } from './features/register/RegisterPage.jsx';
import { LoginPage } from './features/login/LoginPage.jsx';
import { OrbitalGlobeLanguageSelector } from './shared/ui/OrbitalGlobeLanguageSelector.jsx';
import appIcon from './assets/icon.png';
import './App.css';

// --- TOAST NOTIFICATIONS ---
const ToastItem = ({ toast, removeToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);
  return <div className={`toast toast-${toast.type}`}>{toast.message}</div>;
};

const Toasts = () => {
  const toasts = useAppStore(s => s.toasts);
  const removeToast = useAppStore(s => s.removeToast);
  return (
    <div className="toast-container">
      {toasts.map(t => <ToastItem key={t.id} toast={t} removeToast={removeToast} />)}
    </div>
  );
};

// --- APP ---
function App() {
  // Hooks de lógica de negocio
  const { t } = useTranslation();
  const { processFiles, openDiffTab, closeTab, saveFile, handleDelete, handleTransfer, handleTransferFolder, handleClear } = useMatrixProcessor();
  const { openOrigin, openDest, addDestSlot, removeDestSlot, setOriginDirect, setDestDirect } = useFileHandles();
  const { loadProfile, saveCurrentProfile, renameProfile, deleteProfile } = useProfiles();
  const initializeLicense = useMonetizationStore(s => s.initializeLicense);
  useEqualityWorker();

  useEffect(() => {
    initializeLicense();
    // Auto-inicializar políticas en Sentinel-NGAC de forma silenciosa al arrancar
    NgacService.setupNgacBasePolicies()
      .then(ok => {
        if (ok) console.log("Políticas base de Sentinel-NGAC inicializadas automáticamente.");
      })
      .catch(err => {
        console.warn("Sentinel-NGAC no disponible para auto-inicialización:", err.message);
      });
  }, [initializeLicense]);

  // Estado global
  const tabs = useAppStore(s => s.tabs);
  const activeTab = useAppStore(s => s.activeTab);
  const setActiveTab = useAppStore(s => s.setActiveTab);
  const setTabs = useAppStore(s => s.setTabs);

  const originHandle = useAppStore(s => s.originHandle);
  const setOriginHandle = useAppStore(s => s.setOriginHandle);
  const setOriginPath = useAppStore(s => s.setOriginPath);
  const originPath = useAppStore(s => s.originPath);
  const destSlots = useAppStore(s => s.destSlots);
  const setDestSlots = useAppStore(s => s.setDestSlots);

  const processedOrigin = useAppStore(s => s.processedOrigin);
  const setProcessedOrigin = useAppStore(s => s.setProcessedOrigin);
  const processedDestSlots = useAppStore(s => s.processedDestSlots);
  const setProcessedDestSlots = useAppStore(s => s.setProcessedDestSlots);
  const fileEqualityMap = useAppStore(s => s.fileEqualityMap);

  const isProcessing = useAppStore(s => s.isProcessing);
  const sessionFilterConfig = useAppStore(s => s.sessionFilterConfig);
  const savedProfiles = useAppStore(s => s.savedProfiles);
  const setSavedProfiles = useAppStore(s => s.setSavedProfiles);
  const addToast = useAppStore(s => s.addToast);
  const appTheme = useAppStore(s => s.appTheme);
  const setAppTheme = useAppStore(s => s.setAppTheme);
  const appLanguage = useAppStore(s => s.appLanguage);
  const setAppLanguage = useAppStore(s => s.setAppLanguage);
  const userSession = useAppStore(s => s.userSession);
  const setUserSession = useAppStore(s => s.setUserSession);

  // Efectos de inicialización
  useEffect(() => {
    setOriginHandle(null);
    setOriginPath('');
    setDestSlots([{ id: Date.now().toString(), handle: null, path: '', files: null }]);
    saveHandle('lastSession', null);
  }, [setOriginHandle, setOriginPath, setDestSlots]);

  // Sincronización automática de URL hash (#privacy, #terms, #about, #contact, etc.)
  useEffect(() => {
    const syncTabFromLocation = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.replace('/', '').toLowerCase();
      const target = hash || path;
      if (['privacy', 'terms', 'about', 'contact', 'docs', 'faq', 'pricing', 'features'].includes(target)) {
        setActiveTab(target);
      }
    };
    syncTabFromLocation();
    window.addEventListener('hashchange', syncTabFromLocation);
    return () => window.removeEventListener('hashchange', syncTabFromLocation);
  }, [setActiveTab]);

  useEffect(() => {
    const tab = tabs.find(t => t.id === activeTab);
    if (tab && tab.type === 'matrix') {
      if (tab.processedOrigin) setProcessedOrigin(tab.processedOrigin);
      if (tab.processedDestSlots) setProcessedDestSlots(tab.processedDestSlots);
    }
  }, [activeTab, tabs, setProcessedOrigin, setProcessedDestSlots]);

  useEffect(() => {
    document.documentElement.dataset.theme = appTheme;
    document.documentElement.setAttribute('data-theme', appTheme);
  }, [appTheme]);

  useEffect(() => {
    const key = userSession ? `savedProfiles_${userSession.email}` : 'savedProfiles';
    getHandle(key)
      .then(p => {
        if (p) setSavedProfiles(p);
        else setSavedProfiles([]);
      })
      .catch(err => {
        console.error("Error loading profiles from IndexedDB:", err);
        setSavedProfiles([]);
      });
  }, [userSession, setSavedProfiles]);

  // --- RENDERS ---
  const renderMatrixScreen = (tab) => (
    <MatrixView
      appLanguage={appLanguage}
      tab={tab}
      processFiles={processFiles}
      handleTransferFolder={handleTransferFolder}
      handleDelete={handleDelete}
      handleTransfer={handleTransfer}
      openDiffTab={openDiffTab}
    />
  );

  const renderDiffScreen = (tab) => (
    <DiffView
      appLanguage={appLanguage}
      tab={tab}
      tabs={tabs}
      setTabs={setTabs}
      originHandle={originHandle}
      destSlots={destSlots}
      originPath={originPath}
      fileEqualityMap={fileEqualityMap}
      closeTab={closeTab}
      addToast={addToast}
      appTheme={appTheme}
      showModal={showModal}
      openDiffTab={openDiffTab}
      saveFile={saveFile}
      handleDelete={handleDelete}
    />
  );



  const renderTabContent = () => {
    if (activeTab === 'landing') return <LandingPage appLanguage={appLanguage} />;
    if (activeTab === 'register') return <RegisterPage appLanguage={appLanguage} />;
    if (activeTab === 'login') return <LoginPage appLanguage={appLanguage} />;
    if (activeTab === 'main') {
      return (
        <MainScreen
          appLanguage={appLanguage}
          originPath={originPath}
          destSlots={destSlots}
          originHandle={originHandle}
          isProcessing={isProcessing}
          openOrigin={openOrigin}
          openDest={openDest}
          addDestSlot={addDestSlot}
          removeDestSlot={removeDestSlot}
          handleClear={handleClear}
          saveCurrentProfile={saveCurrentProfile}
          processFiles={processFiles}
          setOriginDirect={setOriginDirect}
          setDestDirect={setDestDirect}
        />
      );
    }
    if (activeTab === 'history') {
      return (
        <HistoryScreen
          appLanguage={appLanguage}
          savedProfiles={savedProfiles}
          loadProfile={loadProfile}
          setActiveTab={setActiveTab}
          renameProfile={renameProfile}
          deleteProfile={deleteProfile}
        />
      );
    }
    if (activeTab === 'filters') return <FiltersPanel appLanguage={appLanguage} openDiffTab={openDiffTab} processFiles={processFiles} />;
    if (activeTab === 'privacy') return <PrivacyPage />;
    if (activeTab === 'terms') return <TermsPage />;
    if (activeTab === 'about') return <AboutPage />;
    if (activeTab === 'contact') return <ContactPage />;
    if (activeTab === 'docs') return <DocsPanel />;
    if (activeTab === 'faq') return <FaqPage appLanguage={appLanguage} />;
    if (activeTab === 'postgres-inicial') return <PostgresGuideInitialPage />;
    if (activeTab === 'postgres-basico') return <PostgresGuideBasicPage />;
    if (activeTab === 'postgres-medio') return <PostgresGuideMediumPage />;
    if (activeTab === 'postgres-avanzado') return <PostgresGuideAdvancedPage />;
    if (activeTab === 'postgres-experto') return <PostgresGuideExpertPage />;
    if (activeTab === 'pricing') return <PricingPage />;
    if (activeTab === 'features') return <FeaturesPage />;
    if (activeTab === 'terminal') {
      return (
        <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--accent-secondary)' }}>terminal</span>
            Terminal de Comandos
          </h2>
          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <CommandTerminal processFiles={processFiles} handleClear={handleClear} isStandalonePage={true} />
          </div>
        </div>
      );
    }
    const tab = tabs.find(t => t.id === activeTab);
    if (!tab) return null;
    if (tab.type === 'matrix') return renderMatrixScreen(tab);
    return renderDiffScreen(tab);
  };

  return (
    <main className="app-container">
      <Helmet>
        <title>{tabs.length > 0 && activeTab >= 0 ? `${tabs.find(t => t.id === activeTab)?.title || 'Inicio'} - ${t('app_title')}` : t('app_title')}</title>
        <meta name="description" content="Compara directorios y archivos locales de manera rápida y segura." />
      </Helmet>
      <NgacAdBanner position="Top" />
      <header className="app-header">
        <h1><img src={appIcon} alt="NMerge Icon" style={{ height: '22px', width: '22px', marginRight: '8px', verticalAlign: 'middle', borderRadius: '4px' }} /> {t('app_title')}</h1>
        
        {/* Ads en el header */}
        <div style={{ flex: 1, margin: '0 20px', maxWidth: '300px' }}>
          <NgacAdBanner position="Top" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            className="btn secondary-btn small-btn"
            onClick={() => setAppTheme(appTheme === 'dark' ? 'light' : 'dark')}
            data-tooltip={`Cambiar a modo ${appTheme === 'dark' ? 'Claro' : 'Oscuro'}`}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '5px' }}>
              {appTheme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            {appTheme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          </button>

          <span style={{ height: '18px', width: '1px', background: 'var(--border-color)' }}></span>

          <div style={{ width: '110px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <OrbitalGlobeLanguageSelector activeLanguageCode={appLanguage} onSelectLanguage={setAppLanguage} width="110px" height="36px" />
          </div>

          <span style={{ height: '18px', width: '1px', background: 'var(--border-color)' }}></span>

          {userSession ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', color: 'var(--accent-secondary)' }}>account_circle</span>
                <span style={{ maxWidth: '140px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: '500' }}>{userSession.email}</span>
              </div>
              <button 
                className="btn secondary-btn small-btn" 
                style={{ borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={() => {
                  setUserSession(null);
                  setActiveTab('landing');
                }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '1.05rem' }}>logout</span>
                {t('nav_logout')}
              </button>
            </div>
          ) : (
            <button 
              className="btn primary-btn small-btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => setActiveTab('login')}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '1.05rem' }}>login</span>
              {t('nav_login')}
            </button>
          )}
        </div>
      </header>

      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          {tabs.length > 0 && (
            <div className="tab-bar">
              {tabs.map(tab => (
                <div key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}>
                  <span onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '1.1rem', marginRight: '5px', color: tab.type === 'matrix' ? '#f59e0b' : '#8b5cf6' }}>
                      {tab.type === 'matrix' ? 'search' : 'compare_arrows'}
                    </span>
                    {tab.title}
                  </span>
                  <button
                    className="close-btn"
                    data-tooltip="Cerrar pestaña"
                    onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: '0', marginLeft: '5px' }}
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>close</span>
                  </button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', width: '100%' }}>
            <div className="content" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Banner en la mitad de la página */}
              <NgacAdBanner position="Top" />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                {renderTabContent()}
              </div>
            </div>
            
            {/* Banner al lado derecho de la página */}
            <aside style={{ width: '180px', borderLeft: '1px solid var(--border-color)', background: 'var(--bg-glass)', display: 'flex', flexDirection: 'column', gap: '15px', padding: '15px', boxSizing: 'border-box', flexShrink: 0 }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Anuncios</span>
              <NgacAdBanner position="Sidebar" />
              <NgacAdBanner position="Sidebar" />
            </aside>
          </div>
        </main>
      </div>

      <footer className="app-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>&copy; 2026 {t('app_title')}. Desarrollado por <strong>StackUpIa</strong> | {t('app_subtitle')}</span>
          <span style={{ color: 'var(--border-color)' }}>|</span>
          <a href="#privacy" onClick={(e) => { e.preventDefault(); window.location.hash = 'privacy'; setActiveTab('privacy'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>{t('nav_privacy') || 'Privacidad'}</a>
          <a href="#terms" onClick={(e) => { e.preventDefault(); window.location.hash = 'terms'; setActiveTab('terms'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>{t('nav_terms') || 'Términos'}</a>
          <a href="#about" onClick={(e) => { e.preventDefault(); window.location.hash = 'about'; setActiveTab('about'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Sobre Nosotros (EEAT)</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); window.location.hash = 'contact'; setActiveTab('contact'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Contacto</a>
          <a href="#docs" onClick={(e) => { e.preventDefault(); window.location.hash = 'docs'; setActiveTab('docs'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>{t('nav_docs') || 'Documentación'}</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); window.location.hash = 'faq'; setActiveTab('faq'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>{t('nav_faq') || 'FAQ'}</a>
          <a href="#postgres-basico" onClick={(e) => { e.preventDefault(); setActiveTab('postgres-basico'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Guía Postgres (Básica)</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isProcessing ? '#f59e0b' : '#10b981',
            boxShadow: isProcessing ? '0 0 8px rgba(245, 158, 11, 0.6)' : '0 0 8px rgba(16, 185, 129, 0.6)',
            display: 'inline-block'
          }}></span>
          <span>
            {isProcessing ? t('status_processing') : (processedOrigin.length > 0 ? `Archivos cargados: ${processedOrigin.length}` : 'Listo')}
          </span>
        </div>
      </footer>

      <CustomModal />
      <PremiumModal />
      <Toasts />
    </main>
  );
}

export default App;
