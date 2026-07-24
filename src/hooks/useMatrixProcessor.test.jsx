import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMatrixProcessor } from './useMatrixProcessor.js';
import { useAppStore } from '../app/useAppStore.js';

// Mock de submódulos externos
vi.mock('../features/directory-sync/api/FileSystemService.js', () => ({
  verifyPermission: vi.fn().mockResolvedValue(true),
  getFilesFromHandle: vi.fn(),
  saveFileToHandle: vi.fn(),
  deleteFileFromHandle: vi.fn(),
}));

vi.mock('../shared/lib/apiClient.js', () => ({
  apiClient: {
    writeFilter: vi.fn().mockResolvedValue(true),
  }
}));

vi.mock('../shared/lib/DocumentExtractor.js', () => ({
  extractTextFromDocument: vi.fn().mockResolvedValue(''),
}));

describe('useMatrixProcessor Integration Test - openDiffTab logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Limpiamos y reestablecemos el estado inicial del store de Zustand antes de cada test
    useAppStore.setState({
      tabs: [],
      activeTab: 'landing',
      originHandle: { name: 'origen-raiz', kind: 'directory' },
      destSlots: [
        {
          id: 'slot-1',
          handle: { name: 'destino-raiz', kind: 'directory' },
          path: 'destino-raiz',
          files: null
        }
      ],
      isProcessing: false,
      hasProcessed: false,
    });
  });

  it('correctly maps and resolves the destination file contents to "modified" when opening diff tab', async () => {
    // Sembramos una pestaña de matriz procesada en el store simulando el estado post-comparación.
    // OJO: Simulamos de forma realista que processedDestSlots contiene la lista de archivos con su fileHandle,
    // mientras que destSlots contiene la configuración cruda (que era la causa del bug anterior).
    const mockOriginFile = {
      name: 'App.jsx',
      webkitRelativePath: 'origen-raiz/src/App.jsx',
      fileHandle: { name: 'App.jsx', kind: 'file' }
    };

    const mockDestFile = {
      name: 'App.jsx',
      webkitRelativePath: 'destino-raiz/src/App.jsx',
      fileHandle: { name: 'App.jsx', kind: 'file' }
    };

    const matrixTab = {
      id: 'matrix-1',
      type: 'matrix',
      title: 'Resultados',
      originHandle: { name: 'origen-raiz', kind: 'directory' },
      destSlots: [
        { id: 'slot-1', handle: { name: 'destino-raiz', kind: 'directory' }, path: 'destino-raiz' }
      ],
      processedOrigin: [mockOriginFile],
      processedDestSlots: [
        {
          id: 'slot-1',
          handle: { name: 'destino-raiz', kind: 'directory' },
          path: 'destino-raiz',
          files: [mockDestFile] // processedDestSlots tiene la lista de archivos leídos
        }
      ]
    };

    useAppStore.setState({
      tabs: [matrixTab],
      activeTab: 'matrix-1'
    });

    // Mock del FileReader / readFileAsync usado en la lógica interna
    // Simulamos que al leer origen da 'codigo-origen' y en destino da 'codigo-destino'
    const mockFileContentMap = {
      'origen-raiz/src/App.jsx': 'const a = 1;',
      'destino-raiz/src/App.jsx': 'const a = 2;'
    };

    // Sobreescribimos el FileReader global o simulamos la API readFileAsync indirectamente
    // En openDiffTab se lee el archivo usando la función readFileAsync importada del mismo módulo.
    // Dado que readFileAsync lee el FileReader del objeto File, mockeamos el FileReader nativo
    const originalFileReader = window.FileReader;
    window.FileReader = vi.fn().mockImplementation(function() {
      this.readAsText = vi.fn().mockImplementation((file) => {
        const content = mockFileContentMap[file.webkitRelativePath] || '';
        this.onload({ target: { result: content } });
      });
    });

    const { result } = renderHook(() => useMatrixProcessor());

    await act(async () => {
      // Intentamos abrir la pestaña de diferencias para App.jsx
      await result.current.openDiffTab(mockOriginFile, mockDestFile, 0);
    });

    const updatedTabs = useAppStore.getState().tabs;
    const activeTabId = useAppStore.getState().activeTab;
    const diffTab = updatedTabs.find(t => t.id === activeTabId);

    // RESTAURAMOS EL FILEREADER NATIVO
    window.FileReader = originalFileReader;

    // Aserción Crítica: El archivo de destino modificado NO debe estar vacío.
    // Debe haber resuelto y extraído 'const a = 2;' de processedDestSlots.
    expect(diffTab).toBeDefined();
    expect(diffTab.original).toBe('const a = 1;');
    expect(diffTab.modified).toBe('const a = 2;'); // Si el bug existiera, aquí fallaría devolviendo ''
  });
});
