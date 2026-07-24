import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CommandTerminal } from './CommandTerminal.jsx';
import { useAppStore } from '../../app/useAppStore.js';

// Mock scrollIntoView ya que no existe en jsdom
const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;

describe('CommandTerminal Component', () => {
  const mockProcessFiles = vi.fn();
  const mockHandleClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    useAppStore.setState({
      appTheme: 'dark',
      setAppTheme: (theme) => useAppStore.setState({ appTheme: theme }),
      addToast: vi.fn(),
      sessionFilterConfig: '',
      setSessionFilterConfig: (cfg) => useAppStore.setState({ sessionFilterConfig: cfg })
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });

  it('renders collapsed state initially', () => {
    render(<CommandTerminal processFiles={mockProcessFiles} handleClear={mockHandleClear} />);
    expect(screen.getByText(/Terminal de comandos/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Escribe un comando/i)).not.toBeInTheDocument();
  });

  it('expands when clicking the header', async () => {
    render(<CommandTerminal processFiles={mockProcessFiles} handleClear={mockHandleClear} />);
    const header = screen.getByText(/Terminal de comandos/i);
    await act(async () => {
      fireEvent.click(header);
    });

    expect(screen.getByPlaceholderText(/Escribe un comando/i)).toBeInTheDocument();
  });

  it('executes /help command successfully', async () => {
    render(<CommandTerminal processFiles={mockProcessFiles} handleClear={mockHandleClear} />);
    await act(async () => {
      fireEvent.click(screen.getByText(/Terminal de comandos/i));
    });

    const input = screen.getByPlaceholderText(/Escribe un comando/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: '/help' } });
    });
    
    await act(async () => {
      fireEvent.submit(screen.getByText('Ejecutar'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Comandos disponibles:/i)).toBeInTheDocument();
    });
  });

  it('executes /sync command calling processFiles', async () => {
    render(<CommandTerminal processFiles={mockProcessFiles} handleClear={mockHandleClear} />);
    await act(async () => {
      fireEvent.click(screen.getByText(/Terminal de comandos/i));
    });

    const input = screen.getByPlaceholderText(/Escribe un comando/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: '/sync' } });
    });
    
    await act(async () => {
      fireEvent.submit(screen.getByText('Ejecutar'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Iniciando comparación de archivos.../i)).toBeInTheDocument();
    });
    expect(mockProcessFiles).toHaveBeenCalledTimes(1);
  });

  it('executes /clear command calling handleClear', async () => {
    render(<CommandTerminal processFiles={mockProcessFiles} handleClear={mockHandleClear} />);
    await act(async () => {
      fireEvent.click(screen.getByText(/Terminal de comandos/i));
    });

    const input = screen.getByPlaceholderText(/Escribe un comando/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: '/clear' } });
    });

    await act(async () => {
      fireEvent.submit(screen.getByText('Ejecutar'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Slots y selecciones limpiadas con éxito/i)).toBeInTheDocument();
    });
    expect(mockHandleClear).toHaveBeenCalledTimes(1);
  });

  it('executes /theme command and toggles app theme', async () => {
    render(<CommandTerminal processFiles={mockProcessFiles} handleClear={mockHandleClear} />);
    await act(async () => {
      fireEvent.click(screen.getByText(/Terminal de comandos/i));
    });

    const input = screen.getByPlaceholderText(/Escribe un comando/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: '/theme' } });
    });

    await act(async () => {
      fireEvent.submit(screen.getByText('Ejecutar'));
    });

    await waitFor(() => {
      expect(useAppStore.getState().appTheme).toBe('light');
      expect(screen.getByText(/Tema cambiado a: Claro/i)).toBeInTheDocument();
    });
  });
});
