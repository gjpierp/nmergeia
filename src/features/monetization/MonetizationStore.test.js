import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMonetizationStore } from './MonetizationStore.js';

global.fetch = vi.fn();

// Mock para localStorage nativo de jsdom
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('MonetizationStore', () => {
  beforeEach(() => {
    useMonetizationStore.setState({ isPro: false, isPremiumModalOpen: false });
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('opens and closes premium modal', () => {
    const state = useMonetizationStore.getState();
    state.openPremiumModal();
    expect(useMonetizationStore.getState().isPremiumModalOpen).toBe(true);
    
    useMonetizationStore.getState().closePremiumModal();
    expect(useMonetizationStore.getState().isPremiumModalOpen).toBe(false);
  });

  it('verifies license successfully and saves it to localStorage', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ valid: true })
    });

    const result = await useMonetizationStore.getState().verifyLicense('valid-key');
    expect(result.success).toBe(true);
    expect(useMonetizationStore.getState().isPro).toBe(true);
    expect(localStorage.getItem('nmerge_license_key')).toBe('valid-key');
  });

  it('fails verification on invalid license and does not save to localStorage', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ valid: false, message: 'Invalid key' })
    });

    const result = await useMonetizationStore.getState().verifyLicense('invalid-key');
    expect(result.success).toBe(false);
    expect(useMonetizationStore.getState().isPro).toBe(false);
    expect(localStorage.getItem('nmerge_license_key')).toBeNull();
  });

  it('initializes license from localStorage when valid', async () => {
    localStorage.setItem('nmerge_license_key', 'stored-valid-key');
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ valid: true })
    });

    await useMonetizationStore.getState().initializeLicense();
    expect(useMonetizationStore.getState().isPro).toBe(true);
  });

  it('removes license from localStorage on initialization if invalid', async () => {
    localStorage.setItem('nmerge_license_key', 'stored-invalid-key');
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ valid: false })
    });

    await useMonetizationStore.getState().initializeLicense();
    expect(useMonetizationStore.getState().isPro).toBe(false);
    expect(localStorage.getItem('nmerge_license_key')).toBeNull();
  });
});
