import { create } from 'zustand';
import i18n from '../i18n.js';

/**
 * Helper to support React's functional state updates e.g. setTabs(prev => [...prev, newTab])
 */
const setVal = (set, key, val) => 
  set((state) => ({ [key]: typeof val === 'function' ? val(state[key]) : val }));

export const useAppStore = create((set) => ({
  tabs: [],
  setTabs: (val) => setVal(set, 'tabs', val),

  modalConfig: { isOpen: false, type: 'alert', title: '', message: '', defaultValue: '', resolvePromise: null },
  setModalConfig: (val) => setVal(set, 'modalConfig', val),

  toasts: [],
  addToast: (message, type = 'success') => set((state) => ({ toasts: [...state.toasts, { id: Date.now() + Math.random(), message, type }] })),
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),

  activeTab: 'landing',
  setActiveTab: (val) => setVal(set, 'activeTab', val),

  appTheme: 'dark',
  setAppTheme: (val) => setVal(set, 'appTheme', val),

  selectedDiffContent: null,
  setSelectedDiffContent: (val) => setVal(set, 'selectedDiffContent', val),

  originHandle: null,
  setOriginHandle: (val) => setVal(set, 'originHandle', val),

  originPath: '',
  setOriginPath: (val) => setVal(set, 'originPath', val),

  destSlots: [ { id: Date.now().toString(), handle: null, files: [], path: '' } ],
  setDestSlots: (val) => setVal(set, 'destSlots', val),

  selectedOrigin: [],
  setSelectedOrigin: (val) => setVal(set, 'selectedOrigin', val),

  processedOrigin: [],
  setProcessedOrigin: (val) => setVal(set, 'processedOrigin', val),

  processedDestSlots: [],
  setProcessedDestSlots: (val) => setVal(set, 'processedDestSlots', val),

  fileEqualityMap: {},
  setFileEqualityMap: (val) => setVal(set, 'fileEqualityMap', val),

  hasProcessed: false,
  setHasProcessed: (val) => setVal(set, 'hasProcessed', val),

  isProcessing: false,
  setIsProcessing: (val) => setVal(set, 'isProcessing', val),

  progressMsg: '',
  setProgressMsg: (val) => setVal(set, 'progressMsg', val),

  filterText: '',
  setFilterText: (val) => setVal(set, 'filterText', val),

  sessionFilterConfig: null,
  setSessionFilterConfig: (val) => setVal(set, 'sessionFilterConfig', val),

  showOnlyChanges: false,
  setShowOnlyChanges: (val) => setVal(set, 'showOnlyChanges', val),

  collapsedFolders: new Set(),
  setCollapsedFolders: (val) => setVal(set, 'collapsedFolders', val),

  savedProfiles: [],
  setSavedProfiles: (val) => setVal(set, 'savedProfiles', val),

  loadedProfileId: null,
  setLoadedProfileId: (val) => setVal(set, 'loadedProfileId', val),

  loadedProfileName: null,
  setLoadedProfileName: (val) => setVal(set, 'loadedProfileName', val),

  matrixScrollTop: 0,
  setMatrixScrollTop: (val) => setVal(set, 'matrixScrollTop', val),

  userSession: typeof window !== 'undefined'
    ? (() => {
        try {
          const s = localStorage.getItem('nmerge_user_session');
          return s && s !== 'undefined' ? JSON.parse(s) : null;
        } catch (_) {
          return null;
        }
      })()
    : null,
  setUserSession: (session) => set(() => {
    if (typeof window !== 'undefined') {
      if (session) {
        localStorage.setItem('nmerge_user_session', JSON.stringify(session));
        const userFilters = localStorage.getItem(`nmergeia_filters_${session.email}`);
        return { 
          userSession: session, 
          sessionFilterConfig: userFilters 
        };
      } else {
        localStorage.removeItem('nmerge_user_session');
        return { 
          userSession: null, 
          sessionFilterConfig: null 
        };
      }
    }
    return { userSession: session };
  }),

  appLanguage: typeof window !== 'undefined' 
    ? (localStorage.getItem('nmergeia_language') || (() => {
        const browserLang = navigator.language.split('-')[0];
        const supported = ['es', 'en', 'pt', 'fr', 'de', 'zh', 'ja'];
        return supported.includes(browserLang) ? browserLang : 'es';
      })())
    : 'es',
  setAppLanguage: (lang) => set((state) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nmergeia_language', lang);
      i18n.changeLanguage(lang);
    }
    return { appLanguage: lang };
  }),
}));


