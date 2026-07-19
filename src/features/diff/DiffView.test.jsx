import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DiffView } from './DiffView';
import { useAppStore } from '../../app/useAppStore';

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
    DiffEditor: ({ original, modified }) => (
        <div data-testid="monaco-diff-editor">
            <div data-testid="original-code">{original}</div>
            <div data-testid="modified-code">{modified}</div>
        </div>
    )
}));

// Mock PremiumLock
vi.mock('../monetization/PremiumLock.jsx', () => ({
    PremiumLock: ({ featureId, children }) => <div data-testid={`premium-lock-${featureId}`}>{children}</div>
}));

describe('DiffView Component', () => {
    beforeEach(() => {
        useAppStore.setState({
            activeTab: 'origin',
            tabs: [
                {
                    id: 'tab-1',
                    filePath: 'main.js',
                    destSlotIdx: 0,
                    original: 'const a = 1;  \r\n\r\nconst b = 2;',
                    modified: 'const a = 1;  \r\n\r\nconst b = 2;'
                }
            ],
            fileEqualityMap: {}
        });
    });

    const mockDestSlots = [
        { id: 'slot-1', path: 'dest', handle: { name: 'dest' }, files: [] }
    ];

    it('renders the diff view header and file paths correctly', async () => {
        render(
            <DiffView
                tab={{ id: 'tab-1', filePath: 'main.js', destSlotIdx: 0, original: 'a', modified: 'b' }}
                originPath="src"
                destSlots={mockDestSlots}
            />
        );
        expect(screen.getByText('Origen: src/main.js')).toBeInTheDocument();
    });

    it('displays the normalizer checkbox for JSON files and sorts keys on toggle', async () => {
        const rawJsonOriginal = '{"z": 1, "a": 2}';
        const rawJsonModified = '{"y": 3, "b": 4}';

        render(
            <DiffView
                tab={{ 
                    id: 'tab-1', 
                    title: 'config.json',
                    filePath: 'config.json', 
                    destSlotIdx: 0, 
                    original: rawJsonOriginal, 
                    modified: rawJsonModified 
                }}
                originPath="src"
                destSlots={mockDestSlots}
            />
        );

        // Debería estar el checkbox de normalizar JSON
        const checkbox = screen.getByLabelText('Normalizar JSON');
        expect(checkbox).toBeInTheDocument();

        // Antes de activar: código crudo sin ordenar
        expect(screen.getByTestId('original-code').textContent).toBe(rawJsonOriginal);

        // Activar normalización
        fireEvent.click(checkbox);

        // Después de activar: llaves ordenadas alfabéticamente
        const expectedNormalizedOriginal = JSON.stringify({ a: 2, z: 1 }, null, 2);
        expect(screen.getByTestId('original-code').textContent).toBe(expectedNormalizedOriginal);
    });

    it('displays whitespace normalizer checkbox for source files and cleans trailing spaces/newlines', async () => {
        render(
            <DiffView
                tab={{ 
                    id: 'tab-1', 
                    title: 'script.js',
                    filePath: 'script.js', 
                    destSlotIdx: 0, 
                    original: 'console.log(1);   \r\n\r\n\r\nconsole.log(2);', 
                    modified: 'console.log(1);   \r\n\r\n\r\nconsole.log(2);' 
                }}
                originPath="src"
                destSlots={mockDestSlots}
            />
        );

        const checkbox = screen.getByLabelText('Limpiar Espacios');
        expect(checkbox).toBeInTheDocument();

        // Activar limpieza
        fireEvent.click(checkbox);

        // Debería tener finales de línea normalizados a \n y sin espacios finales redundantes
        const expectedClean = 'console.log(1);\n\nconsole.log(2);';
        expect(screen.getByTestId('original-code').textContent).toBe(expectedClean);
    });
});
