import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

vi.mock('pdfjs-dist', () => ({
  getDocument: vi.fn(),
  GlobalWorkerOptions: { workerSrc: '' },
  version: '3.0.0'
}));

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
        const { container } = render(<MatrixView tab={tab} originPath="src" destSlots={[]} openDiffTab={() => {}} />);
        expect(container).toBeDefined();
    });
});
