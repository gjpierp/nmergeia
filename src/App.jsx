import React, { useEffect, useState, Suspense } from 'react';
import { saveHandle, getHandle } from './shared/lib/DatabaseService.js';
import { encryptData, decryptData } from './shared/lib/cryptoUtils.js';
import { useAppStore } from './app/useAppStore.js';
import { useTranslation } from 'react-i18next';
import { CustomModal, showModal } from './shared/ui/CustomModal.jsx';
import { HourglassLoader } from './shared/ui/HourglassLoader.jsx';
import { PremiumModal } from './features/monetization/PremiumModal.jsx';
import { NgacAdBanner, getAdConfig } from './features/monetization/NgacAdBanner.jsx';
import { AppAdRightAside } from './app/core/components/AppAdRightAside.jsx';
import { useMonetizationStore } from './features/monetization/MonetizationStore.js';
import { NgacService } from './shared/lib/NgacService.js';
import { Sidebar } from './shared/ui/Sidebar.jsx';
import { ThemeSelector } from './shared/ui/ThemeSelector.jsx';
import { GenericTopicPage } from './shared/ui/GenericTopicPage.jsx';
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
const CommandTerminal = React.lazy(() => import('./features/terminal/CommandTerminal.jsx').then(m => ({ default: m.CommandTerminal })));
import { initContentProtection } from './shared/lib/contentProtection.js';
import { LandingPage } from './features/landing/LandingPage.jsx';
import { PrivacyPage } from './features/landing/PrivacyPage.jsx';
import { TermsPage } from './features/landing/TermsPage.jsx';
import { AboutPage } from './features/landing/AboutPage.jsx';
import { ContactPage } from './features/landing/ContactPage.jsx';
import { SettingsPage } from './features/settings/SettingsPage.jsx';
const CookiePolicyPage = React.lazy(() => import('./features/landing/CookiePolicyPage.jsx').then(m => ({ default: m.CookiePolicyPage })));
const LegalNoticePage = React.lazy(() => import('./features/landing/LegalNoticePage.jsx').then(m => ({ default: m.LegalNoticePage })));
const EulaPage = React.lazy(() => import('./features/landing/EulaPage.jsx').then(m => ({ default: m.EulaPage })));
import { DocsPanel } from './features/landing/DocsPanel.jsx';
const FaqPage = React.lazy(() => import('./features/landing/FaqPage.jsx').then(m => ({ default: m.FaqPage })));
const PostgresGuideInitialPage = React.lazy(() => import('./features/landing/PostgresGuideInitialPage.jsx').then(m => ({ default: m.PostgresGuideInitialPage })));
const PostgresGuideBasicPage = React.lazy(() => import('./features/landing/PostgresGuideBasicPage.jsx').then(m => ({ default: m.PostgresGuideBasicPage })));
const PostgresGuideMediumPage = React.lazy(() => import('./features/landing/PostgresGuideMediumPage.jsx').then(m => ({ default: m.PostgresGuideMediumPage })));
const PostgresGuideAdvancedPage = React.lazy(() => import('./features/landing/PostgresGuideAdvancedPage.jsx').then(m => ({ default: m.PostgresGuideAdvancedPage })));
const PostgresGuideExpertPage = React.lazy(() => import('./features/landing/PostgresGuideExpertPage.jsx').then(m => ({ default: m.PostgresGuideExpertPage })));
const OracleGuideInitialPage = React.lazy(() => import('./features/landing/OracleGuideInitialPage.jsx').then(m => ({ default: m.OracleGuideInitialPage })));
const OracleGuideBasicPage = React.lazy(() => import('./features/landing/OracleGuideBasicPage.jsx').then(m => ({ default: m.OracleGuideBasicPage })));
const OracleGuideMediumPage = React.lazy(() => import('./features/landing/OracleGuideMediumPage.jsx').then(m => ({ default: m.OracleGuideMediumPage })));
const OracleGuideAdvancedPage = React.lazy(() => import('./features/landing/OracleGuideAdvancedPage.jsx').then(m => ({ default: m.OracleGuideAdvancedPage })));
const OracleGuideExpertPage = React.lazy(() => import('./features/landing/OracleGuideExpertPage.jsx').then(m => ({ default: m.OracleGuideExpertPage })));
const DockerGuideInitialPage = React.lazy(() => import('./features/landing/DockerGuideInitialPage.jsx').then(m => ({ default: m.DockerGuideInitialPage })));
const DockerGuideBasicPage = React.lazy(() => import('./features/landing/DockerGuideBasicPage.jsx').then(m => ({ default: m.DockerGuideBasicPage })));
const DockerGuideMediumPage = React.lazy(() => import('./features/landing/DockerGuideMediumPage.jsx').then(m => ({ default: m.DockerGuideMediumPage })));
const DockerGuideAdvancedPage = React.lazy(() => import('./features/landing/DockerGuideAdvancedPage.jsx').then(m => ({ default: m.DockerGuideAdvancedPage })));
const DockerGuideExpertPage = React.lazy(() => import('./features/landing/DockerGuideExpertPage.jsx').then(m => ({ default: m.DockerGuideExpertPage })));
const NgacGuideInitialPage = React.lazy(() => import('./features/landing/NgacGuideInitialPage.jsx').then(m => ({ default: m.NgacGuideInitialPage })));
const NgacGuideBasicPage = React.lazy(() => import('./features/landing/NgacGuideBasicPage.jsx').then(m => ({ default: m.NgacGuideBasicPage })));
const NgacGuideMediumPage = React.lazy(() => import('./features/landing/NgacGuideMediumPage.jsx').then(m => ({ default: m.NgacGuideMediumPage })));
const NgacGuideAdvancedPage = React.lazy(() => import('./features/landing/NgacGuideAdvancedPage.jsx').then(m => ({ default: m.NgacGuideAdvancedPage })));
const NgacGuideExpertPage = React.lazy(() => import('./features/landing/NgacGuideExpertPage.jsx').then(m => ({ default: m.NgacGuideExpertPage })));
const Tema01OptPostgresPage = React.lazy(() => import('./features/landing/Tema01OptPostgresPage.jsx').then(m => ({ default: m.Tema01OptPostgresPage })));
const Tema02DockerMultistagePage = React.lazy(() => import('./features/landing/Tema02DockerMultistagePage.jsx').then(m => ({ default: m.Tema02DockerMultistagePage })));
const Tema03GitAvanzadoPage = React.lazy(() => import('./features/landing/Tema03GitAvanzadoPage.jsx').then(m => ({ default: m.Tema03GitAvanzadoPage })));
const Tema04IacTerraformPage = React.lazy(() => import('./features/landing/Tema04IacTerraformPage.jsx').then(m => ({ default: m.Tema04IacTerraformPage })));
const Tema05RbacAbacNgacPage = React.lazy(() => import('./features/landing/Tema05RbacAbacNgacPage.jsx').then(m => ({ default: m.Tema05RbacAbacNgacPage })));
const Tema06NgacMenusPage = React.lazy(() => import('./features/landing/Tema06NgacMenusPage.jsx').then(m => ({ default: m.Tema06NgacMenusPage })));
import { CookieConsentBanner } from './features/landing/CookieConsentBanner.jsx';
const Tema07RlsGobernanzaPage = React.lazy(() => import('./features/landing/Tema07RlsGobernanzaPage.jsx').then(m => ({ default: m.Tema07RlsGobernanzaPage })));
const Tema08DevsecopsVaultPage = React.lazy(() => import('./features/landing/Tema08DevsecopsVaultPage.jsx').then(m => ({ default: m.Tema08DevsecopsVaultPage })));
const Tema09MigracionDbPage = React.lazy(() => import('./features/landing/Tema09MigracionDbPage.jsx').then(m => ({ default: m.Tema09MigracionDbPage })));
const Tema10EtlSagaPage = React.lazy(() => import('./features/landing/Tema10EtlSagaPage.jsx').then(m => ({ default: m.Tema10EtlSagaPage })));
const Tema11SaasMultitenantPage = React.lazy(() => import('./features/landing/Tema11SaasMultitenantPage.jsx').then(m => ({ default: m.Tema11SaasMultitenantPage })));
const Tema12ResilienciaBackendPage = React.lazy(() => import('./features/landing/Tema12ResilienciaBackendPage.jsx').then(m => ({ default: m.Tema12ResilienciaBackendPage })));
const Tema13LlmRagPage = React.lazy(() => import('./features/landing/Tema13LlmRagPage.jsx').then(m => ({ default: m.Tema13LlmRagPage })));
const Tema14AiAgentsPage = React.lazy(() => import('./features/landing/Tema14AiAgentsPage.jsx').then(m => ({ default: m.Tema14AiAgentsPage })));
const Tema15ArquitecturasPage = React.lazy(() => import('./features/landing/Tema15ArquitecturasPage.jsx').then(m => ({ default: m.Tema15ArquitecturasPage })));
const Tema16RequerimientosPage = React.lazy(() => import('./features/landing/Tema16RequerimientosPage.jsx').then(m => ({ default: m.Tema16RequerimientosPage })));
const Tema17KubernetesPage = React.lazy(() => import('./features/landing/Tema17KubernetesPage.jsx').then(m => ({ default: m.Tema17KubernetesPage })));
const Tema18CloudNativePage = React.lazy(() => import('./features/landing/Tema18CloudNativePage.jsx').then(m => ({ default: m.Tema18CloudNativePage })));
const PricingPage = React.lazy(() => import('./features/landing/PricingPage.jsx').then(m => ({ default: m.PricingPage })));
const FeaturesPage = React.lazy(() => import('./features/landing/FeaturesPage.jsx').then(m => ({ default: m.FeaturesPage })));
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

// --- NGAC GUARD ---
const tabToMenuCode = {
  landing: 'Landing',
  register: 'Register',
  login: 'Login',
  main: 'Comparar',
  history: 'Historial',
  filters: 'Filtros',
  privacy: 'Privacy',
  terms: 'Terms',
  docs: 'Docs',
  faq: 'FAQ',
  terminal: 'Terminal',
  'postgres-inicial': 'PostgresInicial',
  'postgres-basico': 'PostgresBasico',
  'postgres-medio': 'PostgresMedio',
  'postgres-avanzado': 'PostgresAvanzado',
  'postgres-experto': 'PostgresExperto',
  'oracle-inicial': 'OracleInicial',
  'oracle-basico': 'OracleBasico',
  'oracle-medio': 'OracleMedio',
  'oracle-avanzado': 'OracleAvanzado',
  'oracle-experto': 'OracleExperto',
  'docker-inicial': 'DockerInicial',
  'docker-basico': 'DockerBasico',
  'docker-medio': 'DockerMedio',
  'docker-avanzado': 'DockerAvanzado',
  'docker-experto': 'DockerExperto',
  'kubernetes-avanzado': 'K8sAvanzado',
  'cloud-avanzado': 'CloudAvanzado',
  'git-inicial': 'GitInicial',
  'git-basico': 'GitBasico',
  'git-medio': 'GitMedio',
  'git-avanzado': 'GitAvanzado',
  'git-experto': 'GitExperto',
  'terraform-inicial': 'TerraformInicial',
  'terraform-basico': 'TerraformBasico',
  'terraform-medio': 'TerraformMedio',
  'terraform-avanzado': 'TerraformAvanzado',
  'terraform-experto': 'TerraformExperto',
  'arq-inicial': 'ArqInicial',
  'arq-basico': 'ArqBasico',
  'arq-medio': 'ArqMedio',
  'arq-avanzado': 'ArqAvanzado',
  'arq-experto': 'ArqExperto',
  'ia-inicial': 'IaInicial',
  'ia-basico': 'IaBasico',
  'ia-medio': 'IaMedio',
  'ia-avanzado': 'IaAvanzado',
  'ia-experto': 'IaExperto',
  'req-inicial': 'ReqInicial',
  'req-basico': 'ReqBasico',
  'req-medio': 'ReqMedio',
  'req-avanzado': 'ReqAvanzado',
  'req-experto': 'ReqExperto',
  'devsecops-inicial': 'DevsecopsInicial',
  'devsecops-basico': 'DevsecopsBasico',
  'devsecops-medio': 'DevsecopsMedio',
  'devsecops-avanzado': 'DevsecopsAvanzado',
  'devsecops-experto': 'DevsecopsExperto',
  'auth-inicial': 'AuthInicial',
  'auth-basico': 'AuthBasico',
  'auth-medio': 'AuthMedio',
  'auth-avanzado': 'AuthAvanzado',
  'auth-experto': 'AuthExperto',
  'cripto-inicial': 'CriptoInicial',
  'cripto-basico': 'CriptoBasico',
  'cripto-medio': 'CriptoMedio',
  'cripto-avanzado': 'CriptoAvanzado',
  'cripto-experto': 'CriptoExperto',
  'owasp-inicial': 'OwaspInicial',
  'owasp-basico': 'OwaspBasico',
  'owasp-medio': 'OwaspMedio',
  'owasp-avanzado': 'OwaspAvanzado',
  'owasp-experto': 'OwaspExperto',
  'mongo-inicial': 'MongoInicial',
  'mongo-basico': 'MongoBasico',
  'mongo-medio': 'MongoMedio',
  'mongo-avanzado': 'MongoAvanzado',
  'mongo-experto': 'MongoExperto',
  'redis-inicial': 'RedisInicial',
  'redis-basico': 'RedisBasico',
  'redis-medio': 'RedisMedio',
  'redis-avanzado': 'RedisAvanzado',
  'redis-experto': 'RedisExperto',
  'sqlserver-inicial': 'SqlServerInicial',
  'sqlserver-basico': 'SqlServerBasico',
  'sqlserver-medio': 'SqlServerMedio',
  'sqlserver-avanzado': 'SqlServerAvanzado',
  'sqlserver-experto': 'SqlServerExperto',
  'ml-inicial': 'MlInicial',
  'ml-basico': 'MlBasico',
  'ml-medio': 'MlMedio',
  'ml-avanzado': 'MlAvanzado',
  'ml-experto': 'MlExperto',
  'nlp-inicial': 'NlpInicial',
  'nlp-basico': 'NlpBasico',
  'nlp-medio': 'NlpMedio',
  'nlp-avanzado': 'NlpAvanzado',
  'nlp-experto': 'NlpExperto',
  'cleancode-inicial': 'CleanCodeInicial',
  'cleancode-basico': 'CleanCodeBasico',
  'cleancode-medio': 'CleanCodeMedio',
  'cleancode-avanzado': 'CleanCodeAvanzado',
  'cleancode-experto': 'CleanCodeExperto',
  'patrones-inicial': 'PatronesInicial',
  'patrones-basico': 'PatronesBasico',
  'patrones-medio': 'PatronesMedio',
  'patrones-avanzado': 'PatronesAvanzado',
  'patrones-experto': 'PatronesExperto',
  'qa-inicial': 'QaInicial',
  'qa-basico': 'QaBasico',
  'qa-medio': 'QaMedio',
  'qa-avanzado': 'QaAvanzado',
  'qa-experto': 'QaExperto',
  'bi-inicial': 'BiInicial',
  'bi-basico': 'BiBasico',
  'bi-medio': 'BiMedio',
  'bi-avanzado': 'BiAvanzado',
  'bi-experto': 'BiExperto',
  'dwh-inicial': 'DwhInicial',
  'dwh-basico': 'DwhBasico',
  'dwh-medio': 'DwhMedio',
  'dwh-avanzado': 'DwhAvanzado',
  'dwh-experto': 'DwhExperto',
  'pricing': 'Pricing',
  'features': 'Features',
  'ext-react': 'ExtReact', 'ext-vue': 'ExtVue', 'ext-angular': 'ExtAngular', 'ext-svelte': 'ExtSvelte', 'ext-wasm': 'ExtWasm',
  'ext-node': 'ExtNode', 'ext-spring': 'ExtSpring', 'ext-django': 'ExtDjango', 'ext-fastapi': 'ExtFastapi', 'ext-graphql': 'ExtGraphql',
  'ext-aws': 'ExtAws', 'ext-azure': 'ExtAzure', 'ext-gcp': 'ExtGcp', 'ext-cicd': 'ExtCicd', 'ext-obs': 'ExtObs',
  'ext-pentest': 'ExtPentest', 'ext-malware': 'ExtMalware', 'ext-cripto': 'ExtCripto', 'ext-harden': 'ExtHarden', 'ext-zerot': 'ExtZerot',
  'ext-prompt': 'ExtPrompt', 'ext-finetune': 'ExtFinetune', 'ext-datalake': 'ExtDatalake', 'ext-kafka': 'ExtKafka', 'ext-spark': 'ExtSpark'
};

const NgacGuard = ({ tab, children }) => {
  const allowedMenus = useAppStore(s => s.allowedMenus);

  // En desarrollo o entorno local, deshabilitar lista blanca y restricciones de Sentinel
  if (import.meta.env.DEV || process.env.NODE_ENV !== 'production') {
    return children;
  }
  
  // En la aplicación ejecutable desktop, permitir siempre las funciones core del comparador
  const isCoreTab = ['main', 'diff', 'filters', 'history', 'terminal', 'register', 'login', 'landing', 'settings', 'configuracion'].includes(tab)
    || (typeof tab === 'string' && (tab.startsWith('tab-') || tab.startsWith('diff')));

  if (isCoreTab || !allowedMenus) {
    return children;
  }

  return children;
};

// --- APP ---
function App() {
  // Hooks de lógica de negocio
  const { t } = useTranslation();
  const { 
    processFiles, 
    openDiffTab, 
    closeTab, 
    saveFile, 
    handleDelete, 
    handleTransfer, 
    handleTransferFolder, 
    handleTransferAllToDest,
    handleTransferAllToOrigin,
    handleClear 
  } = useMatrixProcessor();
  const { openOrigin, openDest, addDestSlot, removeDestSlot, setOriginDirect, setDestDirect, swapFolders } = useFileHandles();
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

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector('.content')?.scrollTo(0, 0);
    document.querySelector('.app-main')?.scrollTo(0, 0);
  }, [activeTab]);
  const setTabs = useAppStore(s => s.setTabs);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nmerge_sidebar_collapsed');
      if (saved !== null) return saved === 'true';
    }
    return false;
  });

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') localStorage.setItem('nmerge_sidebar_collapsed', String(next));
      return next;
    });
  };

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
  const progressMsg = useAppStore(s => s.progressMsg);

  const [hourglassIcon, setHourglassIcon] = useState('hourglass_top');

  useEffect(() => {
    if (!isProcessing) return;
    setHourglassIcon('hourglass_top');
    let current = 'hourglass_top';
    const timer = setInterval(() => {
      current = current === 'hourglass_top' ? 'hourglass_bottom' : 'hourglass_top';
      setHourglassIcon(current);
    }, 800);
    return () => clearInterval(timer);
  }, [isProcessing]);

  useEffect(() => {
    initContentProtection();
    if (typeof window !== 'undefined' && (window.location.search || window.location.hash || window.location.pathname !== '/')) {
      window.history.replaceState({}, '', '/');
    }
  }, []);
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
  const allowedMenus = useAppStore(s => s.allowedMenus);
  const setAllowedMenus = useAppStore(s => s.setAllowedMenus);

  // Efecto de inicialización NGAC Menús
  useEffect(() => {
    const roles = userSession?.roles || ['ROLE_NMERGEIA_INVITADO'];
    NgacService.getDynamicMenu(roles, !!userSession).then(menus => {
      if (menus && menus.length > 0) {
        setAllowedMenus(menus);
      }
    }).catch(err => {
      console.error("Error obteniendo menus NGAC:", err);
    });
  }, [userSession, setAllowedMenus]);

  // Efectos de inicialización
  useEffect(() => {
    setOriginHandle(null);
    setOriginPath('');
    setDestSlots([{ id: Date.now().toString(), handle: null, path: '', files: null }]);
    saveHandle('lastSession', null);
  }, [setOriginHandle, setOriginPath, setDestSlots]);

  // Sincronización automática de URL hash (#privacy, #terms, #about, #contact, #postgres-inicial, etc.) y pathname (/privacy, /about)
  useEffect(() => {
    const syncTabFromLocation = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.replace('/', '').toLowerCase();
      const target = hash || path;
      if (target && target !== 'index.html' && target !== '') {
        setActiveTab(target);
      }
    };
    syncTabFromLocation();
    window.addEventListener('hashchange', syncTabFromLocation);
    window.addEventListener('popstate', syncTabFromLocation);
    return () => {
      window.removeEventListener('hashchange', syncTabFromLocation);
      window.removeEventListener('popstate', syncTabFromLocation);
    };
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
        if (p && p.length > 0) {
          setSavedProfiles(p);
        } else {
          const encLocal = localStorage.getItem(`nmerge_history_${key}`);
          const decrypted = decryptData(encLocal);
          if (decrypted) setSavedProfiles(decrypted);
          else setSavedProfiles([]);
        }
      })
      .catch(err => {
        console.error("Error loading profiles from IndexedDB, intentando lectura cifrada:", err);
        const encLocal = localStorage.getItem(`nmerge_history_${key}`);
        const decrypted = decryptData(encLocal);
        if (decrypted) setSavedProfiles(decrypted);
        else setSavedProfiles([]);
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
      handleTransferAllToDest={handleTransferAllToDest}
      handleTransferAllToOrigin={handleTransferAllToOrigin}
      swapFolders={swapFolders}
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
    // Páginas Públicas y Documentación
    if (activeTab === 'landing') return <LandingPage appLanguage={appLanguage} setActiveTab={setActiveTab} />;
    if (
      activeTab === 'settings' ||
      activeTab === 'configuracion' ||
      activeTab === 'mnu_settings' ||
      activeTab === 'mnu_nmergeia_settings' ||
      activeTab === 'mnu_nmergeia_configuracion' ||
      (typeof activeTab === 'string' && (activeTab.toLowerCase().includes('setting') || activeTab.toLowerCase().includes('configur')))
    ) {
      return <SettingsPage appLanguage={appLanguage} />;
    }
    if (activeTab === 'features') return <FeaturesPage appLanguage={appLanguage} />;
    if (activeTab === 'pricing') return <PricingPage appLanguage={appLanguage} />;
    if (activeTab === 'faq') return <FaqPage appLanguage={appLanguage} />;
    if (activeTab === 'docs') return <DocsPanel appLanguage={appLanguage} />;
    if (activeTab === 'privacy') return <PrivacyPage appLanguage={appLanguage} />;
    if (activeTab === 'terms') return <TermsPage appLanguage={appLanguage} />;
    if (activeTab === 'cookies' || activeTab === 'cookie-policy') return <CookiePolicyPage appLanguage={appLanguage} />;
    if (activeTab === 'legal-notice' || activeTab === 'aviso-legal') return <LegalNoticePage appLanguage={appLanguage} />;
    if (activeTab === 'eula' || activeTab === 'licencia') return <EulaPage appLanguage={appLanguage} />;

    // Autenticación & Cuenta
    if (activeTab === 'register') return <RegisterPage appLanguage={appLanguage} />;
    if (activeTab === 'login') return <LoginPage appLanguage={appLanguage} />;

    // Workspace Herramientas
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

    // Guías por Niveles (Data Science, PostgreSQL, Oracle, Docker, NGAC) con Título, Subtítulo y Pestañas de Niveles
    if (
      activeTab === 'datascience' ||
      activeTab === 'datascience-inicial' ||
      activeTab === 'temas/datascience' ||
      activeTab === 'mnu_datascience_guide'
    ) return <GenericTopicPage topicId="datascience" initialLevel="inicial" title="Data Science & AI" appLanguage={appLanguage} />;
    if (activeTab === 'datascience-basico') return <GenericTopicPage topicId="datascience" initialLevel="basico" title="Data Science & AI" appLanguage={appLanguage} />;
    if (activeTab === 'datascience-medio') return <GenericTopicPage topicId="datascience" initialLevel="medio" title="Data Science & AI" appLanguage={appLanguage} />;
    if (activeTab === 'datascience-avanzado') return <GenericTopicPage topicId="datascience" initialLevel="avanzado" title="Data Science & AI" appLanguage={appLanguage} />;
    if (activeTab === 'datascience-experto') return <GenericTopicPage topicId="datascience" initialLevel="experto" title="Data Science & AI" appLanguage={appLanguage} />;
    if (activeTab === 'datascience-optimizaciones') return <GenericTopicPage topicId="datascience" initialLevel="optimizaciones" title="Data Science & AI" appLanguage={appLanguage} />;

    if (activeTab === 'postgres-inicial') return <GenericTopicPage topicId="postgres" initialLevel="inicial" title="PostgreSQL Enterprise" appLanguage={appLanguage} />;
    if (activeTab === 'postgres-basico') return <GenericTopicPage topicId="postgres" initialLevel="basico" title="PostgreSQL Enterprise" appLanguage={appLanguage} />;
    if (activeTab === 'postgres-medio') return <GenericTopicPage topicId="postgres" initialLevel="medio" title="PostgreSQL Enterprise" appLanguage={appLanguage} />;
    if (activeTab === 'postgres-avanzado') return <GenericTopicPage topicId="postgres" initialLevel="avanzado" title="PostgreSQL Enterprise" appLanguage={appLanguage} />;
    if (activeTab === 'postgres-experto') return <GenericTopicPage topicId="postgres" initialLevel="experto" title="PostgreSQL Enterprise" appLanguage={appLanguage} />;

    if (activeTab === 'oracle-inicial') return <GenericTopicPage topicId="oracle" initialLevel="inicial" title="Oracle Database Enterprise" appLanguage={appLanguage} />;
    if (activeTab === 'oracle-basico') return <GenericTopicPage topicId="oracle" initialLevel="basico" title="Oracle Database Enterprise" appLanguage={appLanguage} />;
    if (activeTab === 'oracle-medio') return <GenericTopicPage topicId="oracle" initialLevel="medio" title="Oracle Database Enterprise" appLanguage={appLanguage} />;
    if (activeTab === 'oracle-avanzado') return <GenericTopicPage topicId="oracle" initialLevel="avanzado" title="Oracle Database Enterprise" appLanguage={appLanguage} />;
    if (activeTab === 'oracle-experto') return <GenericTopicPage topicId="oracle" initialLevel="experto" title="Oracle Database Enterprise" appLanguage={appLanguage} />;

    if (activeTab === 'docker-inicial') return <GenericTopicPage topicId="docker" initialLevel="inicial" title="Docker & Contenedores" appLanguage={appLanguage} />;
    if (activeTab === 'docker-basico') return <GenericTopicPage topicId="docker" initialLevel="basico" title="Docker & Contenedores" appLanguage={appLanguage} />;
    if (activeTab === 'docker-medio') return <GenericTopicPage topicId="docker" initialLevel="medio" title="Docker & Contenedores" appLanguage={appLanguage} />;
    if (activeTab === 'docker-avanzado') return <GenericTopicPage topicId="docker" initialLevel="avanzado" title="Docker & Contenedores" appLanguage={appLanguage} />;
    if (activeTab === 'docker-experto') return <GenericTopicPage topicId="docker" initialLevel="experto" title="Docker & Contenedores" appLanguage={appLanguage} />;


    // Bases de Datos
    if (activeTab === 'tema-postgres') return <GenericTopicPage topicId="postgres" initialLevel="inicial" title="PostgreSQL Enterprise" appLanguage={appLanguage} />;
    if (activeTab === 'tema-oracle') return <GenericTopicPage topicId="oracle" initialLevel="inicial" title="Oracle Database Enterprise" appLanguage={appLanguage} />;
    if (activeTab === 'tema-sqlserver') return <GenericTopicPage topicId="db_sqlserver" title="SQL Server" appLanguage={appLanguage} />;
    if (activeTab === 'tema-mysql') return <GenericTopicPage topicId="db_mysql" title="MySQL" appLanguage={appLanguage} />;
    if (activeTab === 'tema-mariadb') return <GenericTopicPage topicId="db_mariadb" title="MariaDB" appLanguage={appLanguage} />;
    if (activeTab === 'tema-mongodb') return <GenericTopicPage topicId="db_mongodb" title="MongoDB" appLanguage={appLanguage} />;

    // Temas Especializados
    // 🧠 Data Science & Sub-temas Especializados (Páginas Únicas Limpias sin Niveles)
    if (activeTab === 'datascience-pyspark' || activeTab.startsWith('datascience-pyspark-') || activeTab === 'temas/datascience/pyspark') {
      return <GenericTopicPage topicId="datascience_pyspark" title="PySpark & Big Data" singleFile="datascience_pyspark.md" appLanguage={appLanguage} />;
    }

    if (activeTab === 'datascience-kafka' || activeTab.startsWith('datascience-kafka-') || activeTab === 'temas/datascience/kafka') {
      return <GenericTopicPage topicId="datascience_kafka" title="Apache Kafka Event Streaming" singleFile="datascience_kafka.md" appLanguage={appLanguage} />;
    }

    if (activeTab === 'datascience-deltalake' || activeTab.startsWith('datascience-deltalake-') || activeTab === 'temas/datascience/deltalake') {
      return <GenericTopicPage topicId="datascience_deltalake" title="Delta Lake Architecture" singleFile="datascience_deltalake.md" appLanguage={appLanguage} />;
    }

    if (activeTab === 'datascience-mlops' || activeTab.startsWith('datascience-mlops-') || activeTab === 'temas/datascience/mlops') {
      return <GenericTopicPage topicId="datascience_mlops" title="MLOps & vLLM Infrastructure" singleFile="datascience_mlops.md" appLanguage={appLanguage} />;
    }

    if (activeTab === 'datascience-polars' || activeTab.startsWith('datascience-polars-') || activeTab === 'temas/datascience/polars') {
      return <GenericTopicPage topicId="datascience_polars" title="Polars Rust & SIMD" singleFile="datascience_polars.md" appLanguage={appLanguage} />;
    }

    if (activeTab === 'datascience' || activeTab.startsWith('datascience-') || activeTab === 'temas/datascience') {
      const sub = activeTab.replace('datascience-', '');
      const level = ['inicial', 'basico', 'medio', 'avanzado', 'experto', 'optimizaciones'].includes(sub) ? sub : 'inicial';
      return <GenericTopicPage topicId="datascience" title="Data Science & AI Engineering" initialLevel={level} appLanguage={appLanguage} />;
    }

    // 🐘 Base de Datos & Optimización
    if (activeTab === 'postgres' || activeTab.startsWith('postgres-') || activeTab === 'tema-postgres') {
      const sub = activeTab.replace('postgres-', '');
      const level = ['inicial', 'basico', 'medio', 'avanzado', 'experto', 'optimizaciones'].includes(sub) ? sub : 'inicial';
      return <GenericTopicPage topicId="postgres" title="PostgreSQL Enterprise" initialLevel={level} appLanguage={appLanguage} />;
    }

    if (activeTab === 'oracle' || activeTab.startsWith('oracle-') || activeTab === 'tema-oracle') {
      const sub = activeTab.replace('oracle-', '');
      const level = ['inicial', 'basico', 'medio', 'avanzado', 'experto', 'maestro'].includes(sub) ? sub : 'inicial';
      return <GenericTopicPage topicId="oracle" title="Oracle Database Enterprise" initialLevel={level} appLanguage={appLanguage} />;
    }

    // 🐳 Contenedores e Infraestructura
    if (activeTab === 'docker' || activeTab.startsWith('docker-')) {
      const sub = activeTab.replace('docker-', '');
      const level = ['inicial', 'basico', 'medio', 'avanzado', 'experto', 'optimizaciones'].includes(sub) ? sub : 'inicial';
      return <GenericTopicPage topicId="docker" title="Docker & Contenedores" initialLevel={level} appLanguage={appLanguage} />;
    }

    // 🛡️ Ciberseguridad & Gobernanza NGAC (Página Única Limpia sin Niveles)
    if (activeTab === 'ngac' || activeTab.startsWith('ngac-') || activeTab === 'temas/ngac') {
      return <GenericTopicPage topicId="ngac" title="Gobernanza Sentinel-NGAC" singleFile="ngac.md" appLanguage={appLanguage} />;
    }

    // ⚛️ Frontend & Backend Ecosystem
    if (activeTab === 'ext-react' || activeTab.startsWith('ext-react-')) {
      const sub = activeTab.replace('ext-react-', '');
      const level = ['inicial', 'basico', 'medio', 'avanzado', 'experto', 'optimizaciones'].includes(sub) ? sub : 'inicial';
      return <GenericTopicPage topicId="ext_react" title="React.js Avanzado & Profiling" initialLevel={level} appLanguage={appLanguage} />;
    }

    if (activeTab === 'ext-vue' || activeTab.startsWith('ext-vue-')) {
      const sub = activeTab.replace('ext-vue-', '');
      const level = ['inicial', 'basico', 'medio', 'avanzado', 'experto', 'optimizaciones'].includes(sub) ? sub : 'inicial';
      return <GenericTopicPage topicId="ext_vue" title="Vue.js Ecosystem & Pinia" initialLevel={level} appLanguage={appLanguage} />;
    }

    if (activeTab === 'ext-node' || activeTab.startsWith('ext-node-') || activeTab === 'temas/ext-node') {
      const sub = activeTab.replace('ext-node-', '');
      const level = ['inicial', 'basico', 'medio', 'avanzado', 'experto', 'optimizaciones'].includes(sub) ? sub : 'inicial';
      return <GenericTopicPage topicId="ext_node" title="Node.js Enterprise Architecture" initialLevel={level} appLanguage={appLanguage} />;
    }

    if (activeTab === 'ext-aws' || activeTab.startsWith('ext-aws-')) {
      const sub = activeTab.replace('ext-aws-', '');
      const level = ['inicial', 'basico', 'medio', 'avanzado', 'experto', 'optimizaciones'].includes(sub) ? sub : 'inicial';
      return <GenericTopicPage topicId="ext_aws" title="AWS Serverless & Lambda" initialLevel={level} appLanguage={appLanguage} />;
    }

    if (activeTab === 'ext-pentest' || activeTab.startsWith('ext-pentest-')) {
      const sub = activeTab.replace('ext-pentest-', '');
      const level = ['inicial', 'basico', 'medio', 'avanzado', 'experto', 'optimizaciones'].includes(sub) ? sub : 'inicial';
      return <GenericTopicPage topicId="ext_pentest" title="Pentesting Web & OWASP Top 10" initialLevel={level} appLanguage={appLanguage} />;
    }

    // 🏗️ Temas Específicos Integrados a la Cáscara Unificada de la Biblioteca
    if (activeTab === 'tema-02-docker-multistage' || activeTab.includes('docker-multistage') || activeTab.includes('tema-02')) return <GenericTopicPage topicId="docker" title="Docker Multi-stage Builds" singleFile="docker_medio.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-03-git-avanzado' || activeTab === 'git-avanzado' || activeTab.includes('git-avanzado') || activeTab.includes('tema-03')) return <GenericTopicPage topicId="ext_node" title="Git Avanzado & Rebase" singleFile="tema_03_git_avanzado.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-04-iac-terraform' || activeTab === 'terraform-avanzado' || activeTab.includes('iac-terraform') || activeTab.includes('tema-04')) return <GenericTopicPage topicId="ext_aws" title="Infraestructura como Código (IaC) y Terraform" singleFile="tema_04_iac_terraform.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-05-rbac-abac-ngac' || activeTab === 'auth-avanzado' || activeTab.includes('rbac-abac') || activeTab.includes('tema-05')) return <GenericTopicPage topicId="ngac" title="Control de Acceso RBAC / ABAC / NGAC" singleFile="tema_05_rbac_abac_ngac.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-06-ngac-menus' || activeTab === 'auth-experto' || activeTab.includes('ngac-menus') || activeTab.includes('tema-06')) return <GenericTopicPage topicId="ngac" title="Menús Dinámicos Sentinel-NGAC" singleFile="tema_06_ngac_menus.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-07-rls-gobernanza' || activeTab === 'cripto-avanzado' || activeTab.includes('rls-gobernanza') || activeTab.includes('tema-07')) return <GenericTopicPage topicId="postgres" title="Row-Level Security (RLS) & Gobernanza" singleFile="tema_07_rls_gobernanza.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-08-devsecops-vault' || activeTab === 'devsecops-avanzado' || activeTab.includes('devsecops-vault') || activeTab.includes('tema-08')) return <GenericTopicPage topicId="ngac" title="DevSecOps & HashiCorp Vault" singleFile="tema_08_devsecops_vault.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-09-migracion-db' || activeTab.includes('migracion-db') || activeTab.includes('tema-09')) return <GenericTopicPage topicId="postgres" title="Migraciones de Base de Datos (Liquibase/Flyway)" singleFile="tema_09_migracion_db.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-10-etl-saga' || activeTab === 'dwh-avanzado' || activeTab.includes('etl-saga') || activeTab.includes('tema-10')) return <GenericTopicPage topicId="ext_node" title="Patrón Saga & Distributed ETL" singleFile="tema_10_etl_saga.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-11-saas-multitenant' || activeTab === 'arq-avanzado' || activeTab.includes('saas-multitenant') || activeTab.includes('tema-11')) return <GenericTopicPage topicId="ext_node" title="Arquitecturas SaaS Multi-Tenant" singleFile="tema_11_saas_multitenant.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-12-resiliencia-backend' || activeTab === 'arq-experto' || activeTab.includes('resiliencia-backend') || activeTab.includes('tema-12')) return <GenericTopicPage topicId="ext_node" title="Resiliencia Backend & Circuit Breakers" singleFile="tema_12_resiliencia_backend.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-13-llm-rag' || activeTab === 'ia-avanzado' || activeTab.includes('llm-rag') || activeTab.includes('tema-13')) return <GenericTopicPage topicId="datascience" title="Arquitecturas LLM & RAG Vectorial" singleFile="tema_13_llm_rag.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-14-ai-agents' || activeTab === 'ia-experto' || activeTab.includes('ai-agents') || activeTab.includes('tema-14')) return <GenericTopicPage topicId="datascience" title="Agentes Autónomos de IA" singleFile="tema_14_ai_agents.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-15-arquitecturas-software' || activeTab === 'cleancode-avanzado' || activeTab.includes('arquitecturas-software') || activeTab.includes('tema-15')) return <GenericTopicPage topicId="ext_node" title="Arquitecturas Limpias & Hexagonal" singleFile="tema_15_arquitecturas_software.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-16-toma-requerimientos' || activeTab === 'req-avanzado' || activeTab.includes('toma-requerimientos') || activeTab.includes('tema-16')) return <GenericTopicPage topicId="ext_node" title="DDD & Toma de Requerimientos" singleFile="tema_16_toma_requerimientos.md" appLanguage={appLanguage} />;
    if (activeTab === 'nosql-mongodb' || activeTab.includes('mongodb') || activeTab.includes('nosql/mongodb')) return <GenericTopicPage topicId="nosql_mongodb" title="MongoDB Enterprise & Sharding" singleFile="nosql_mongodb.md" appLanguage={appLanguage} />;
    if (activeTab === 'nosql-redis' || activeTab.includes('redis') || activeTab.includes('nosql/redis')) return <GenericTopicPage topicId="nosql_redis" title="Redis Cluster & High Availability" singleFile="nosql_redis.md" appLanguage={appLanguage} />;
    if (activeTab === 'nosql-elasticsearch' || activeTab.includes('elasticsearch') || activeTab.includes('nosql/elasticsearch')) return <GenericTopicPage topicId="nosql_elasticsearch" title="Elasticsearch & Vector Search" singleFile="nosql_elasticsearch.md" appLanguage={appLanguage} />;
    if (activeTab === 'nosql-clickhouse' || activeTab.includes('clickhouse') || activeTab.includes('nosql/clickhouse')) return <GenericTopicPage topicId="nosql_clickhouse" title="ClickHouse Analytics & Columnar Engine" singleFile="nosql_clickhouse.md" appLanguage={appLanguage} />;
    if (activeTab === 'cloud-gcp' || activeTab.includes('cloud/gcp') || activeTab.includes('gcp')) return <GenericTopicPage topicId="cloud_gcp" title="Google Cloud Platform (GCP) Enterprise" singleFile="cloud_gcp.md" appLanguage={appLanguage} />;
    if (activeTab === 'cloud-azure' || activeTab.includes('cloud/azure') || activeTab.includes('azure')) return <GenericTopicPage topicId="cloud_azure" title="Azure Enterprise Architecture" singleFile="cloud_azure.md" appLanguage={appLanguage} />;
    if (activeTab === 'gitops-argocd' || activeTab.includes('gitops/argocd') || activeTab.includes('argocd')) return <GenericTopicPage topicId="gitops_argocd" title="GitOps & Canary Deployments" singleFile="gitops_argocd.md" appLanguage={appLanguage} />;
    if (activeTab === 'observability-otel' || activeTab.includes('observability/otel') || activeTab.includes('otel')) return <GenericTopicPage topicId="observability_otel" title="Observabilidad OTel & Grafana Loki" singleFile="observability_otel.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-17-kubernetes' || activeTab === 'k8s-avanzado' || activeTab.includes('kubernetes') || activeTab.includes('tema-17')) return <GenericTopicPage topicId="docker" title="Kubernetes & Orquestación" singleFile="tema_17_kubernetes_orquestacion.md" appLanguage={appLanguage} />;
    if (activeTab === 'tema-18-cloud-native' || activeTab.includes('cloud-native') || activeTab.includes('tema-18')) return <GenericTopicPage topicId="docker" title="Cloud Native & SRE Resiliencia" singleFile="tema_18_cloud_native_sre.md" appLanguage={appLanguage} />;

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
          swapFolders={swapFolders}
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
    if (activeTab === 'cookies') return <CookiePolicyPage />;
    if (activeTab === 'legal-notice') return <LegalNoticePage />;
    if (activeTab === 'eula') return <EulaPage />;
    if (activeTab === 'docs') return <DocsPanel />;
    if (activeTab === 'faq') return <FaqPage appLanguage={appLanguage} />;
    if (activeTab === 'postgres-inicial') return <PostgresGuideInitialPage />;
    if (activeTab === 'postgres-basico') return <PostgresGuideBasicPage />;
    if (activeTab === 'postgres-medio') return <PostgresGuideMediumPage />;
    if (activeTab === 'postgres-avanzado') return <PostgresGuideAdvancedPage />;
    if (activeTab === 'postgres-experto') return <PostgresGuideExpertPage />;
    if (activeTab === 'pricing') return <PricingPage />;
    if (activeTab === 'features') return <FeaturesPage />;
    if (activeTab === 'settings') return <SettingsPage />;
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
    if (tab) {
      if (tab.type === 'matrix') return renderMatrixScreen(tab);
      return renderDiffScreen(tab);
    }

    // Vista principal por defecto (Landing Page)
    return <LandingPage appLanguage={appLanguage} setActiveTab={setActiveTab} />;
  };

  return (
    <main className="app-container">
      <Helmet>
        <title>{tabs.length > 0 && activeTab ? `${tabs.find(t => t.id === activeTab)?.title || 'Comparador'} - NMerge` : 'NMerge'}</title>
        <meta name="description" content="Compara directorios y archivos locales de manera rápida y segura." />
      </Helmet>
      <header className="app-header" style={{ paddingLeft: 0, gap: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <button 
            className="desktop-toggle-btn"
            onClick={toggleSidebar}
            style={{
              width: isCollapsed ? '64px' : '260px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingLeft: isCollapsed ? '20px' : '20px',
              background: 'transparent',
              border: 'none',
              borderRight: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              flexShrink: 0
            }}
            data-tooltip={isCollapsed ? "Desplegar menú" : "Colapsar menú"}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.4rem' }}>
              {isCollapsed ? 'menu' : 'close_fullscreen'}
            </span>
          </button>
          
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Abrir menú"
            style={{ margin: '0 12px' }}
          >
            <span className="material-symbols-rounded">menu</span>
          </button>

          <h1 style={{ paddingLeft: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={appIcon} 
              alt="NMerge IA Icon" 
              style={{ height: '22px', width: '22px', verticalAlign: 'middle', borderRadius: '4px', objectFit: 'contain' }} 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            /> 
            NMerge IA
          </h1>
        </div>
        
        {/* Ads en el header (solo si están configurados) */}
        {getAdConfig('Top') && (
          <div className="header-ad-container" style={{ flex: 1, margin: '0 20px', maxWidth: '300px' }}>
            <NgacAdBanner position="Top" />
          </div>
        )}

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {userSession ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', color: 'var(--accent-secondary)' }}>account_circle</span>
                <span className="user-email-text" style={{ maxWidth: '140px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: '500' }}>{userSession.email}</span>
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
        <Sidebar mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} isCollapsed={isCollapsed} />
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
          <div style={{ display: 'flex', flex: 1, minHeight: 0, width: '100%' }}>
            <div className="content" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <NgacGuard tab={activeTab}>
                  <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>Cargando módulo...</div>}>
                    {renderTabContent()}
                  </Suspense>
                </NgacGuard>
              </div>
            </div>
            
            {/* Columna Derecha Adaptativa para Comunicados y Posición RIGHT_ASIDE de Sentinel NGAC */}
            <AppAdRightAside />

            {/* Banner al lado derecho de la página (solamente si está configurado) */}
            {getAdConfig('RightSidebar') && (
              <aside style={{ width: '180px', borderLeft: '1px solid var(--border-color)', background: 'var(--bg-glass)', display: 'flex', flexDirection: 'column', gap: '15px', padding: '15px', boxSizing: 'border-box', flexShrink: 0 }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Anuncios</span>
                <NgacAdBanner position="RightSidebar" />
              </aside>
            )}
          </div>
        </main>
      </div>

      <footer className="app-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.65rem' }}>
          <span>&copy; 2026 NMerge IA. StackUpIA Software Labs</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <a href="#privacy" onClick={(e) => { e.preventDefault(); setActiveTab('privacy'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('nav_privacy') || 'Privacidad'}</a>
          <span style={{ opacity: 0.4 }}>•</span>
          <a href="#terms" onClick={(e) => { e.preventDefault(); setActiveTab('terms'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('nav_terms') || 'Términos'}</a>
          <span style={{ opacity: 0.4 }}>•</span>
          <a href="#cookie-policy" onClick={(e) => { e.preventDefault(); setActiveTab('cookie-policy'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Cookies</a>
          <span style={{ opacity: 0.4 }}>•</span>
          <a href="#legal-notice" onClick={(e) => { e.preventDefault(); setActiveTab('legal-notice'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Aviso Legal</a>
          <span style={{ opacity: 0.4 }}>•</span>
          <a href="#eula" onClick={(e) => { e.preventDefault(); setActiveTab('eula'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>EULA</a>
          <span style={{ opacity: 0.4 }}>•</span>
          <a href="#about" onClick={(e) => { e.preventDefault(); setActiveTab('about'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Sobre Nosotros</a>
          <span style={{ opacity: 0.4 }}>•</span>
          <a href="#contact" onClick={(e) => { e.preventDefault(); setActiveTab('contact'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contacto</a>
          <span style={{ opacity: 0.4 }}>•</span>
          <a href="#docs" onClick={(e) => { e.preventDefault(); setActiveTab('docs'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('nav_docs') || 'Biblioteca'}</a>
          <span style={{ opacity: 0.4 }}>•</span>
          <a href="#faq" onClick={(e) => { e.preventDefault(); setActiveTab('faq'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('nav_faq') || 'FAQ'}</a>
          <span style={{ opacity: 0.4 }}>•</span>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary, #38bdf8)', textDecoration: 'none', fontWeight: 600 }}>Sitemap XML</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, whiteSpace: 'nowrap', fontSize: '0.65rem' }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: isProcessing ? '#f59e0b' : '#10b981',
            boxShadow: isProcessing ? '0 0 6px rgba(245, 158, 11, 0.8)' : '0 0 6px rgba(16, 185, 129, 0.6)',
            display: 'inline-block',
            flexShrink: 0
          }}></span>
          <span style={{ fontVariantNumeric: 'tabular-nums', opacity: 0.9 }}>
            {isProcessing ? 'En proceso' : 'Listo'}
          </span>
        </div>
      </footer>

      {/* Overlay de procesamiento centrado con reloj de arena animado */}
      {isProcessing && <HourglassLoader message={progressMsg} />}

      <CustomModal />
      <PremiumModal />
      <Toasts />
    </main>
  );
}

export default App;
