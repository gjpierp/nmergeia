import React, { useEffect } from 'react';
import { saveHandle, getHandle } from './shared/lib/DatabaseService.js';
import { useAppStore } from './app/useAppStore.js';
import { CustomModal, showModal } from './shared/ui/CustomModal.jsx';
import { AdBanner } from './features/monetization/AdBanner.jsx';
import { PremiumModal } from './features/monetization/PremiumModal.jsx';
import { useMonetizationStore } from './features/monetization/MonetizationStore.js';
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
import { RegisterPage } from './features/register/RegisterPage.jsx';
import { LoginPage } from './features/login/LoginPage.jsx';
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
  const { processFiles, openDiffTab, closeTab, saveFile, handleDelete, handleTransfer, handleTransferFolder, handleClear } = useMatrixProcessor();
  const { openOrigin, openDest, addDestSlot, removeDestSlot } = useFileHandles();
  const { loadProfile, saveCurrentProfile, renameProfile, deleteProfile } = useProfiles();
  const initializeLicense = useMonetizationStore(s => s.initializeLicense);
  useEqualityWorker();

  useEffect(() => {
    initializeLicense();
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

  // Efectos de inicialización
  useEffect(() => {
    setOriginHandle(null);
    setOriginPath('');
    setDestSlots([{ id: Date.now().toString(), handle: null, path: '', files: null }]);
    saveHandle('lastSession', null);
  }, [setOriginHandle, setOriginPath, setDestSlots]);

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
    getHandle('savedProfiles').then(p => {
      if (p) setSavedProfiles(p);
    });
  }, [setSavedProfiles]);

  // --- RENDERS ---
  const renderMatrixScreen = (tab) => (
    <MatrixView
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
    if (activeTab === 'landing') return <LandingPage />;
    if (activeTab === 'register') return <RegisterPage />;
    if (activeTab === 'login') return <LoginPage />;
    if (activeTab === 'main') {
      return (
        <MainScreen
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
        />
      );
    }
    if (activeTab === 'history') {
      return (
        <HistoryScreen
          savedProfiles={savedProfiles}
          loadProfile={loadProfile}
          setActiveTab={setActiveTab}
          renameProfile={renameProfile}
          deleteProfile={deleteProfile}
        />
      );
    }
    if (activeTab === 'filters') return <FiltersPanel openDiffTab={openDiffTab} processFiles={processFiles} />;
    const tab = tabs.find(t => t.id === activeTab);
    if (!tab) return null;
    if (tab.type === 'matrix') return renderMatrixScreen(tab);
    return renderDiffScreen(tab);
  };

  return (
    <main className="app-container">
      <Helmet>
        <title>{tabs.length > 0 && activeTab >= 0 ? `${tabs[activeTab]?.title} - NodeMerge Pro` : 'NodeMerge Pro - Comparador Avanzado'}</title>
        <meta name="description" content="Compara directorios y archivos con alto rendimiento y funciones avanzadas." />
      </Helmet>
      <AdBanner />
      <header className="app-header">
        <h1><span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>folder_open</span> NodeMerge</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Advanced Agentic Diff</span>
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
          <div className="content" style={{ flex: 1, overflow: 'hidden' }}>
            {renderTabContent()}
          </div>
        </main>
      </div>

      <CommandTerminal processFiles={processFiles} handleClear={handleClear} />

      <footer className="app-footer">
        <div>NodeMerge v1.2.0</div>
        <div>
          {isProcessing ? 'Procesando...' : (processedOrigin.length > 0 ? `Archivos cargados: ${processedOrigin.length}` : 'Listo')}
        </div>
      </footer>

      <CustomModal />
      <PremiumModal />
      <Toasts />
    </main>
  );
}

export default App;
