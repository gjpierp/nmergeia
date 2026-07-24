import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileHandles } from './useFileHandles.js';
import { useAppStore } from '../app/useAppStore.js';

// Mock de Zustand store
vi.mock('../app/useAppStore.js', () => {
  const store = {
    setOriginHandle: vi.fn(),
    setOriginPath: vi.fn(),
    setDestSlots: vi.fn(),
    setHasProcessed: vi.fn(),
    addToast: vi.fn(),
    toasts: [],
  };
  return {
    useAppStore: (fn) => fn(store),
  };
});

describe('useFileHandles Hook - Picker safety and secure context alerts', () => {
  const originalShowDirectoryPicker = window.showDirectoryPicker;
  const originalShowOpenFilePicker = window.showOpenFilePicker;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.showDirectoryPicker = originalShowDirectoryPicker;
    window.showOpenFilePicker = originalShowOpenFilePicker;
  });

  it('triggers secure context error toast if showDirectoryPicker is not supported (HTTP)', async () => {
    // Simulamos entorno HTTP no seguro deshabilitando la API nativa
    window.showDirectoryPicker = undefined;

    const { result } = renderHook(() => useFileHandles());
    const store = useAppStore((s) => s);

    await act(async () => {
      await result.current.openOrigin('folder');
    });

    // Verificamos que alerte al usuario vía Toast de error
    expect(store.addToast).toHaveBeenCalledWith(
      expect.stringContaining('El navegador bloquea el selector en conexiones HTTP simples'),
      'error'
    );
    expect(store.setOriginHandle).not.toHaveBeenCalled();
  });

  it('triggers secure context error toast if showOpenFilePicker is not supported (HTTP)', async () => {
    window.showOpenFilePicker = undefined;

    const { result } = renderHook(() => useFileHandles());
    const store = useAppStore((s) => s);

    await act(async () => {
      await result.current.openOrigin('files');
    });

    expect(store.addToast).toHaveBeenCalledWith(
      expect.stringContaining('El navegador bloquea el selector en conexiones HTTP simples'),
      'error'
    );
    expect(store.setOriginHandle).not.toHaveBeenCalled();
  });

  it('calls native showDirectoryPicker and updates store under secure context (HTTPS/Local)', async () => {
    const mockDirHandle = { name: 'safe-folder', kind: 'directory' };
    window.showDirectoryPicker = vi.fn().mockResolvedValue(mockDirHandle);

    const { result } = renderHook(() => useFileHandles());
    const store = useAppStore((s) => s);

    await act(async () => {
      await result.current.openOrigin('folder');
    });

    expect(window.showDirectoryPicker).toHaveBeenCalled();
    expect(store.setOriginHandle).toHaveBeenCalledWith(mockDirHandle);
    expect(store.setOriginPath).toHaveBeenCalledWith('safe-folder');
    expect(store.setHasProcessed).toHaveBeenCalledWith(false);
  });

  it('directly sets origin and destination handles on Drag & Drop events', () => {
    const { result } = renderHook(() => useFileHandles());
    const store = useAppStore((s) => s);

    const mockHandle = { name: 'dropped-folder', kind: 'directory' };

    act(() => {
      result.current.setOriginDirect(mockHandle);
    });

    expect(store.setOriginHandle).toHaveBeenCalledWith(mockHandle);
    expect(store.setOriginPath).toHaveBeenCalledWith('dropped-folder');

    act(() => {
      result.current.setDestDirect('slot-1', mockHandle);
    });

    expect(store.setDestSlots).toHaveBeenCalled();
  });
});
