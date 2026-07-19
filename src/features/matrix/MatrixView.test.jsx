import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MatrixView } from './MatrixView';
import { useAppStore } from '../../app/useAppStore';

describe('MatrixView Component', () => {
    beforeEach(() => {
        useAppStore.setState({
            filterText: '',
            showOnlyChanges: false,
            isProcessing: false,
            collapsedFolders: new Set(),
            fileEqualityMap: {}
        });
    });

    it('renders the empty state correctly when there are no files', () => {
        const tab = { processedOrigin: [], processedDestSlots: [] };
        render(<MatrixView tab={tab} />);
        expect(screen.getByText(/No hay archivos para comparar/i)).toBeInTheDocument();
    });

    it('renders files from the matrix and handles search filtering', () => {
        useAppStore.setState({ filterText: 'App' });
        const tab = { 
            originHandle: { name: 'src' },
            processedOrigin: [{ webkitRelativePath: 'src/index.js' }, { webkitRelativePath: 'src/App.js' }],
            processedDestSlots: []
        };

        render(<MatrixView tab={tab} />);
        expect(screen.getByText('App.js')).toBeInTheDocument();
        expect(screen.queryByText('index.js')).not.toBeInTheDocument();
    });

    it('toggles directory expansion', () => {
        const tab = {
            originHandle: { name: 'src' },
            processedOrigin: [{ webkitRelativePath: 'src/components/Button.js' }],
            processedDestSlots: []
        };
        const { rerender } = render(<MatrixView tab={tab} />);
        
        const dirElement = screen.getByText('components');
        fireEvent.click(dirElement);

        const state = useAppStore.getState();
        expect(state.collapsedFolders.has('components')).toBe(true);
    });
});
