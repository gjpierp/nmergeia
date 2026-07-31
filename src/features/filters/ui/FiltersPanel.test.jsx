import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FiltersPanel } from './FiltersPanel.jsx';
import { useAppStore } from '../../../app/useAppStore.js';
import { apiClient } from '../../../shared/lib/apiClient.js';

vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        exclude_label: 'Excluir',
        include_label: 'Incluir',
        file_label: 'Archivo',
        directory_label: 'Carpeta',
        add_rule_btn: 'Añadir Regla',
        delete_label: 'Borrar'
      };
      return translations[key] || key;
    },
    i18n: { changeLanguage: () => Promise.resolve() }
  })
}));

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

    expect(screen.getByText(/Carpeta/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Archivo/i)[0]).toBeInTheDocument();
  });

  it('adds rule and appends trailing slash if target is directory', async () => {
    const { container } = render(<FiltersPanel openDiffTab={vi.fn()} processFiles={mockProcessFiles} />);

    const selects = container.querySelectorAll('select.input-field');
    const targetSelect = selects[1] || selects[0];
    if (targetSelect) {
      fireEvent.change(targetSelect, { target: { value: 'directory' } });
    }

    const input = container.querySelector('input.input-field[type="text"]');
    if (input) {
      fireEvent.change(input, { target: { value: 'dist' } });
    }

    const submitBtn = container.querySelector('button[type="submit"]') || screen.getByRole('button', { name: /añadir regla|add rule|add_rule_btn/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(apiClient.writeFilter).toHaveBeenCalledWith('filtro.txt', expect.stringContaining('- dist/'));
      expect(mockProcessFiles).toHaveBeenCalledTimes(1);
    });
  });

  it('deletes active rule and triggers re-comparison', async () => {
    useAppStore.setState({ sessionFilterConfig: '- config.json' });
    render(<FiltersPanel openDiffTab={vi.fn()} processFiles={mockProcessFiles} />);
    
    const deleteSpan = screen.getByText('delete');
    const deleteBtn = deleteSpan.closest('button');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(apiClient.writeFilter).toHaveBeenCalledWith('filtro.txt', '');
      expect(mockProcessFiles).toHaveBeenCalledTimes(1);
    });
  });
});
