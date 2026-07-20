import { create } from 'zustand';
import { apiClient } from '../../shared/lib/apiClient.js';

export const MonetizationConfig = {
  // Activa el modo Lanzamiento/Beta: todas las opciones premium habilitadas, pero con anuncios activos
  ALL_FEATURES_FREE: true,
};

export const useMonetizationStore = create((set, get) => ({
  isPro: false,
  licenseKey: '',
  isPremiumModalOpen: false,
  
  openPremiumModal: () => set({ isPremiumModalOpen: true }),
  closePremiumModal: () => set({ isPremiumModalOpen: false }),
  
  initializeLicense: async () => {
    try {
      const savedKey = localStorage.getItem('nmerge_license_key');
      if (savedKey) {
        const data = await apiClient.verifyLicense(savedKey);
        if (data.valid) {
          set({ isPro: true, licenseKey: savedKey });
        } else {
          localStorage.removeItem('nmerge_license_key');
          set({ isPro: false, licenseKey: '' });
        }
      }
    } catch (e) {
      console.warn("Error al inicializar la licencia:", e);
    }
  },

  verifyLicense: async (licenseKey) => {
    try {
      const data = await apiClient.verifyLicense(licenseKey);
      
      if (data.valid) {
        localStorage.setItem('nmerge_license_key', licenseKey);
        set({ isPro: true, licenseKey, isPremiumModalOpen: false });
        return { success: true };
      }
      return { success: false, message: data.message || 'Licencia inválida' };
    } catch (error) {
      return { success: false, message: 'Error al verificar la licencia' };
    }
  },

  deactivateLicense: () => {
    localStorage.removeItem('nmerge_license_key');
    set({ isPro: false, licenseKey: '' });
  }
}));
