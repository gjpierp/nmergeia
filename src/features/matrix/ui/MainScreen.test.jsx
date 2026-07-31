import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MainScreen } from './MainScreen.jsx';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        compare_config_title: 'Configuración de Comparación',
        select_folders_title: 'Selecciona las carpetas o archivos',
        label_origin: 'Origen',
        label_destination: 'Destino',
        drag_drop_placeholder: 'Ninguna selección',
        drag_drop_title: 'Arrastra y suelta carpetas aquí',
        tooltip_select_folder: 'Seleccionar Carpeta',
        tooltip_select_files: 'Seleccionar Archivos',
        tooltip_clear_all: 'Limpiar Todo',
        tooltip_add_destination: 'Agregar Destino',
        tooltip_save_profile: 'Guardar Perfil',
        tooltip_start_compare: 'Iniciar Comparación'
      };
      return translations[key] || key;
    },
    i18n: { changeLanguage: () => Promise.resolve() }
  })
}));

describe('MainScreen Component - Drag & Drop and UI tests', () => {
  const mockOpenOrigin = vi.fn();
  const mockOpenDest = vi.fn();
  const mockAddDestSlot = vi.fn();
  const mockRemoveDestSlot = vi.fn();
  const mockHandleClear = vi.fn();
  const mockSaveCurrentProfile = vi.fn();
  const mockProcessFiles = vi.fn();
  const mockSetOriginDirect = vi.fn();
  const mockSetDestDirect = vi.fn();

  const defaultProps = {
    originPath: '',
    destSlots: [{ id: 'slot-1', path: '', handle: null, files: [] }],
    originHandle: null,
    isProcessing: false,
    openOrigin: mockOpenOrigin,
    openDest: mockOpenDest,
    addDestSlot: mockAddDestSlot,
    removeDestSlot: mockRemoveDestSlot,
    handleClear: mockHandleClear,
    saveCurrentProfile: mockSaveCurrentProfile,
    processFiles: mockProcessFiles,
    setOriginDirect: mockSetOriginDirect,
    setDestDirect: mockSetDestDirect,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial layout with placeholders', () => {
    render(<MainScreen {...defaultProps} />);
    expect(screen.getByText(/configuración de comparación/i)).toBeInTheDocument();
    expect(screen.getAllByDisplayValue(/ninguna selección/i)).toHaveLength(2);
  });

  it('calls pickers on button clicks', () => {
    render(<MainScreen {...defaultProps} />);
    
    const folderButtons = screen.getAllByRole('button', { name: /folder/i });
    const fileButtons = screen.getAllByRole('button', { name: /insert_drive_file/i });

    fireEvent.click(folderButtons[0]);
    expect(mockOpenOrigin).toHaveBeenCalled();

    fireEvent.click(folderButtons[1]);
    expect(mockOpenDest).toHaveBeenCalledWith('slot-1', 'folder');

    fireEvent.click(fileButtons[0]);
    expect(mockOpenOrigin).toHaveBeenCalled();

    fireEvent.click(fileButtons[1]);
    expect(mockOpenDest).toHaveBeenCalledWith('slot-1', 'files');
  });

  it('handles Drag & Drop over Origin slot', () => {
    render(<MainScreen {...defaultProps} />);

    const originRow = screen.getByText(/origen/i).closest('.config-row');
    expect(originRow).not.toHaveClass('drag-over');

    fireEvent.dragOver(originRow, { dataTransfer: { types: ['Files'] } });
    expect(originRow).toHaveClass('drag-over');

    fireEvent.dragLeave(originRow);
    expect(originRow).not.toHaveClass('drag-over');

    const fakeItem = { kind: 'file', getAsFileSystemHandle: vi.fn().mockResolvedValue({ kind: 'directory', name: 'FolderOrigin' }) };
    const fakeDataTransfer = { items: [fakeItem] };

    fireEvent.drop(originRow, { dataTransfer: fakeDataTransfer });
    expect(originRow).not.toHaveClass('drag-over');
  });

  it('handles Drag & Drop over Dest slots', () => {
    render(<MainScreen {...defaultProps} />);

    const destRow = screen.getByText(/destino/i).closest('.config-row');
    expect(destRow).not.toHaveClass('drag-over');

    fireEvent.dragOver(destRow, { dataTransfer: { types: ['Files'] } });
    expect(destRow).toHaveClass('drag-over');

    fireEvent.dragLeave(destRow);
    expect(destRow).not.toHaveClass('drag-over');

    const fakeItem = { kind: 'file', getAsFileSystemHandle: vi.fn().mockResolvedValue({ kind: 'directory', name: 'FolderDest' }) };
    const fakeDataTransfer = { items: [fakeItem] };

    fireEvent.drop(destRow, { dataTransfer: fakeDataTransfer });
    expect(destRow).not.toHaveClass('drag-over');
  });

  it('allows adding and removing destination slots', () => {
    const multiProps = {
      ...defaultProps,
      destSlots: [
        { id: 'slot-1', path: 'path1', handle: null, files: [] },
        { id: 'slot-2', path: 'path2', handle: null, files: [] },
      ]
    };

    render(<MainScreen {...multiProps} />);

    expect(screen.getByDisplayValue('path1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('path2')).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole('button', { name: /close/i });
    fireEvent.click(deleteButtons[0]);
    expect(mockRemoveDestSlot).toHaveBeenCalledWith('slot-1');
  });

  it('triggers bottom actions (clear, add slot, save, process)', () => {
    const activeProps = {
      ...defaultProps,
      originPath: 'C:/origin',
      originHandle: { kind: 'directory' },
      destSlots: [{ id: 'slot-1', path: 'C:/dest', handle: { kind: 'directory' }, files: [] }]
    };

    render(<MainScreen {...activeProps} />);

    fireEvent.click(screen.getByRole('button', { name: /cleaning_services/i }));
    expect(mockHandleClear).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(mockAddDestSlot).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(mockSaveCurrentProfile).toHaveBeenCalled();

    const playBtn = screen.getByRole('button', { name: /play_arrow/i });
    expect(playBtn).not.toBeDisabled();

    fireEvent.click(playBtn);
    expect(mockProcessFiles).toHaveBeenCalled();
  });
});
