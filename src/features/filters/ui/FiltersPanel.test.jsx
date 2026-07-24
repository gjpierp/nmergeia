import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FiltersPanel } from './FiltersPanel.jsx';
import { useAppStore } from '../../../app/useAppStore.js';
import { apiClient } from '../../../shared/lib/apiClient.js';

// Mock del apiClient
vi.mock('../../../shared/lib/apiClient.js', () => ({
  apiClient: {
    readFilter: vi.fn().mockResolvedValue('- node_modules\n+ src/'),
    writeFilter: vi.fn().mockResolvedValue('OK')
  }
}));

describe('FiltersPanel Component', () => {
  const mockProcessFiles = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({
      sessionFilterConfig: '',
      setSessionFilterConfig: (cfg) => useAppStore.setState({ sessionFilterConfig: cfg }),
      addToast: vi.fn()
    });
  });

  it('loads and parses rules on mount', async () => {
    useAppStore.setState({ sessionFilterConfig: '- node_modules\n+ src/' });
    render(<FiltersPanel openDiffTab={vi.fn()} processFiles={mockProcessFiles} />);

    expect(screen.getByText('node_modules')).toBeInTheDocument();
    expect(screen.getByText('src/')).toBeInTheDocument();
  });

  it('differentiates folders and files correctly based on trailing slash', async () => {
    useAppStore.setState({ sessionFilterConfig: '- node_modules/\n- config.json' });
    render(<FiltersPanel openDiffTab={vi.fn()} processFiles={mockProcessFiles} />);

    // Buscar con selectores de tag span para evitar colisiones con las opciones del select
    expect(screen.getByText(/carpeta|folder/i, { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText(/archivo|file/i, { selector: 'span' })).toBeInTheDocument();
  });

  it('adds rule and appends trailing slash if target is directory', async () => {
    const { container } = render(<FiltersPanel openDiffTab={vi.fn()} processFiles={mockProcessFiles} />);

    // Seleccionar Tipo: Carpeta
    const targetSelect = screen.getByDisplayValue(/aplica a: archivo|applies to: file/i);
    fireEvent.change(targetSelect, { target: { value: 'directory' } });

    // Ingresar patrón sin barra
    const input = container.querySelector('input.input-field[type="text"]');
    fireEvent.change(input, { target: { value: 'dist' } });

    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /añadir regla|add rule/i }));

    // Esperar guardado y re-comparación en caliente
    await waitFor(() => {
      expect(apiClient.writeFilter).toHaveBeenCalledWith('filtro.txt', expect.stringContaining('- dist/'));
      expect(mockProcessFiles).toHaveBeenCalledTimes(1);
    });
  });

  it('deletes active rule and triggers re-comparison', async () => {
    useAppStore.setState({ sessionFilterConfig: '- config.json' });
    render(<FiltersPanel openDiffTab={vi.fn()} processFiles={mockProcessFiles} />);

    const deleteBtn = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(apiClient.writeFilter).toHaveBeenCalledWith('filtro.txt', '');
      expect(mockProcessFiles).toHaveBeenCalledTimes(1);
    });
  });
});
