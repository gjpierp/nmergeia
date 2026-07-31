import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DiffView } from './DiffView';
import { useAppStore } from '../../app/useAppStore';

vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        normalize_json: 'Normalizar JSON',
        clean_spaces: 'Limpiar espacios',
        diff_origin: 'Origen',
        diff_destination: 'Destino'
      };
      return translations[key] || key;
    },
    i18n: { changeLanguage: () => Promise.resolve() }
  })
}));

// Mock Monaco Editor reactive state
let currentEditorLine = 1;

let mockLineChanges = [
    {
        originalStartLineNumber: 2,
        originalEndLineNumber: 3,
        modifiedStartLineNumber: 2,
        modifiedEndLineNumber: 3
    },
    {
        originalStartLineNumber: 5,
        originalEndLineNumber: 5,
        modifiedStartLineNumber: 5,
        modifiedEndLineNumber: 5
    }
];

const mockOriginalEditor = {
    getModel: () => ({
        getLineContent: (line) => `line ${line} content`,
        getValue: () => 'const a = 1;\n\nconst b = 2;',
    }),
    executeEdits: vi.fn(),
    trigger: vi.fn(),
    revealLineInCenter: vi.fn(),
    onDidChangeCursorSelection: vi.fn(),
    addCommand: vi.fn(),
    onDidChangeModelContent: vi.fn(),
};

const mockModifiedEditor = {
    getModel: () => ({
        getLineContent: (line) => `line ${line} content`,
        getLineMaxColumn: (line) => 100,
        getValue: () => 'const a = 1;\n\nconst b = 2;',
        getFullModelRange: () => ({ startLineNumber: 1, startColumn: 1, endLineNumber: 10, endColumn: 100 }),
    }),
    executeEdits: vi.fn(),
    trigger: vi.fn(),
    revealLineInCenter: vi.fn(),
    getPosition: () => ({ lineNumber: currentEditorLine, column: 1 }),
    setPosition: vi.fn().mockImplementation((pos) => {
        currentEditorLine = pos.lineNumber;
    }),
    onDidChangeCursorSelection: vi.fn(),
    addCommand: vi.fn(),
    onDidChangeModelContent: vi.fn(),
};

const mockEditorInstance = {
    getOriginalEditor: () => mockOriginalEditor,
    getModifiedEditor: () => mockModifiedEditor,
    getLineChanges: () => mockLineChanges,
    onDidUpdateDiff: vi.fn(),
};

vi.mock('@monaco-editor/react', () => ({
    Editor: ({ value, onChange }) => (
        <textarea 
            data-testid="monaco-editor" 
            value={value} 
            onChange={(e) => onChange && onChange(e.target.value)} 
        />
    ),
    DiffEditor: ({ original, modified, onMount }) => {
        React.useEffect(() => {
            if (onMount) {
                onMount(mockEditorInstance, {
                    KeyMod: { CtrlCmd: 2048 },
                    KeyCode: { KeyS: 83 },
                    Range: function(sl, sc, el, ec) {
                        return { startLineNumber: sl, startColumn: sc, endLineNumber: el, endColumn: ec };
                    }
                });
            }
        }, [onMount]);

        return (
            <div data-testid="monaco-diff-editor">
                <div data-testid="original-code">{original}</div>
                <div data-testid="modified-code">{modified}</div>
            </div>
        );
    }
}));

// Mock PremiumLock
vi.mock('../monetization/PremiumLock.jsx', () => ({
    PremiumLock: ({ featureId, children }) => <div data-testid={`premium-lock-${featureId}`}>{children}</div>
}));

describe('DiffView Component', () => {
    beforeEach(() => {
        currentEditorLine = 1;
        vi.clearAllMocks();
        mockLineChanges = [
            {
                originalStartLineNumber: 2,
                originalEndLineNumber: 3,
                modifiedStartLineNumber: 2,
                modifiedEndLineNumber: 3
            },
            {
                originalStartLineNumber: 5,
                originalEndLineNumber: 5,
                modifiedStartLineNumber: 5,
                modifiedEndLineNumber: 5
            }
        ];
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
        expect(screen.getByText(/origin|origen|diff_origin/i)).toBeInTheDocument();
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

        const checkbox = screen.getByText(/diff_normalize_json|normalizar json/i).closest('label').querySelector('input');
        expect(checkbox).toBeInTheDocument();

        expect(screen.getByTestId('original-code').textContent).toBe(rawJsonOriginal);

        fireEvent.click(checkbox);

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

        const checkbox = screen.getByText(/diff_clean_spaces|limpiar espacios/i).closest('label').querySelector('input');
        expect(checkbox).toBeInTheDocument();

        fireEvent.click(checkbox);

        const expectedClean = 'console.log(1);\n\nconsole.log(2);';
        expect(screen.getByTestId('original-code').textContent).toBe(expectedClean);
    });

    it('navigates through differences safely using navigation buttons', async () => {
        render(
            <DiffView
                tab={{ id: 'tab-1', filePath: 'main.js', destSlotIdx: 0, original: 'a', modified: 'b' }}
                originPath="src"
                destSlots={mockDestSlots}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/origin|origen|diff_origin/i)).toBeInTheDocument();
        });

        // Test navigation action: first (text is 'first_page')
        const firstBtn = screen.getByRole('button', { name: /first_page/i });
        fireEvent.click(firstBtn);
        expect(mockModifiedEditor.setPosition).toHaveBeenCalledWith({ lineNumber: 2, column: 1 });

        // Test navigation action: next (text is 'keyboard_arrow_down')
        const nextBtn = screen.getByRole('button', { name: /keyboard_arrow_down/i });
        fireEvent.click(nextBtn);
        expect(mockModifiedEditor.setPosition).toHaveBeenCalledWith({ lineNumber: 5, column: 1 });

        // Test navigation action: prev (text is 'keyboard_arrow_up')
        const prevBtn = screen.getByRole('button', { name: /keyboard_arrow_up/i });
        fireEvent.click(prevBtn);
        expect(mockModifiedEditor.setPosition).toHaveBeenCalledWith({ lineNumber: 2, column: 1 });

        // Test navigation action: last (text is 'last_page')
        const lastBtn = screen.getByRole('button', { name: /last_page/i });
        fireEvent.click(lastBtn);
        expect(mockModifiedEditor.setPosition).toHaveBeenCalledWith({ lineNumber: 5, column: 1 });
    });

    it('handles difference navigation gracefully when there are no differences', async () => {
        mockLineChanges = []; // Set line changes to empty to test safety when no diffs exist

        render(
            <DiffView
                tab={{ id: 'tab-1', filePath: 'main.js', destSlotIdx: 0, original: 'a', modified: 'b' }}
                originPath="src"
                destSlots={mockDestSlots}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/origin|origen|diff_origin/i)).toBeInTheDocument();
        });

        const nextBtn = screen.getByRole('button', { name: /keyboard_arrow_down/i });
        
        // This click should execute navigateDiff but return early safely because mockLineChanges is empty
        expect(() => fireEvent.click(nextBtn)).not.toThrow();
    });
});
