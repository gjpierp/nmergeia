import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MainScreen } from './MainScreen.jsx';

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
    expect(screen.getByText(/comparison configuration|configuración de comparación/i)).toBeInTheDocument();
    expect(screen.getAllByDisplayValue(/no selection|ninguna selección/i)).toHaveLength(2);
  });

  it('calls pickers on button clicks', () => {
    render(<MainScreen {...defaultProps} />);
    
    const folderButtons = screen.getAllByRole('button', { name: /folder/i });
    const fileButtons = screen.getAllByRole('button', { name: /insert_drive_file/i });

    // Origin picker click
    fireEvent.click(folderButtons[0]);
    expect(mockOpenOrigin).toHaveBeenCalledWith('folder');

    fireEvent.click(fileButtons[0]);
    expect(mockOpenOrigin).toHaveBeenCalledWith('files');

    // Dest picker click
    fireEvent.click(folderButtons[1]);
    expect(mockOpenDest).toHaveBeenCalledWith('slot-1', 'folder');

    fireEvent.click(fileButtons[1]);
    expect(mockOpenDest).toHaveBeenCalledWith('slot-1', 'files');
  });

  it('handles Drag & Drop over Origin slot', async () => {
    const { container } = render(<MainScreen {...defaultProps} />);
    
    // Find the drag area for Origin
    const originRow = screen.getByText(/origin|origen/i).closest('.config-row');
    expect(originRow).not.toHaveClass('drag-over');

    // Simulate dragOver
    fireEvent.dragOver(originRow);
    expect(originRow).toHaveClass('drag-over');

    // Simulate dragLeave
    fireEvent.dragLeave(originRow);
    expect(originRow).not.toHaveClass('drag-over');

    // Simulate Drop
    const mockFileHandle = { name: 'dropped-origin-folder', kind: 'directory' };
    const dragEvent = {
      preventDefault: vi.fn(),
      dataTransfer: {
        items: [
          {
            getAsFileSystemHandle: async () => mockFileHandle
          }
        ]
      }
    };
    
    // Fire dragOver again
    fireEvent.dragOver(originRow);
    // Trigger drop
    fireEvent.drop(originRow, dragEvent);

    expect(originRow).not.toHaveClass('drag-over');
    await waitFor(() => {
      expect(mockSetOriginDirect).toHaveBeenCalledWith(mockFileHandle);
    });
  });

  it('handles Drag & Drop over Dest slots', async () => {
    render(<MainScreen {...defaultProps} />);
    
    const destRow = screen.getByText(/destination|destino/i).closest('.config-row');
    expect(destRow).not.toHaveClass('drag-over');

    // Simulate dragOver
    fireEvent.dragOver(destRow);
    expect(destRow).toHaveClass('drag-over');

    // Simulate Drop
    const mockFileHandle = { name: 'dropped-dest-folder', kind: 'directory' };
    const dragEvent = {
      preventDefault: vi.fn(),
      dataTransfer: {
        items: [
          {
            getAsFileSystemHandle: async () => mockFileHandle
          }
        ]
      }
    };

    fireEvent.drop(destRow, dragEvent);
    expect(destRow).not.toHaveClass('drag-over');
    await waitFor(() => {
      expect(mockSetDestDirect).toHaveBeenCalledWith('slot-1', mockFileHandle);
    });
  });

  it('allows adding and removing destination slots', () => {
    const propsWithMultipleSlots = {
      ...defaultProps,
      destSlots: [
        { id: 'slot-1', path: 'path1', handle: {}, files: [] },
        { id: 'slot-2', path: 'path2', handle: {}, files: [] }
      ]
    };
    render(<MainScreen {...propsWithMultipleSlots} />);
    
    // Check that both paths are shown
    expect(screen.getByDisplayValue('path1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('path2')).toBeInTheDocument();

    // Check that delete slot button is visible and works
    const removeButtons = screen.getAllByRole('button', { name: /close/i });
    expect(removeButtons).toHaveLength(2); // One for each dest slot

    fireEvent.click(removeButtons[0]);
    expect(mockRemoveDestSlot).toHaveBeenCalledWith('slot-1');
  });

  it('triggers bottom actions (clear, add slot, save, process)', () => {
    const activeProps = {
      ...defaultProps,
      originHandle: {},
      destSlots: [{ id: 'slot-1', path: 'dest-path', handle: {}, files: [] }]
    };
    render(<MainScreen {...activeProps} />);

    fireEvent.click(screen.getByRole('button', { name: /cleaning_services/i }));
    expect(mockHandleClear).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(mockAddDestSlot).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(mockSaveCurrentProfile).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /play_arrow/i }));
    expect(mockProcessFiles).toHaveBeenCalled();
  });
});
