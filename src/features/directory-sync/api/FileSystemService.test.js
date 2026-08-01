import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as FileSystemService from './FileSystemService.js';

describe('FileSystemService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should be initialized properly', () => {
        expect(FileSystemService).toBeDefined();
        expect(FileSystemService.verifyPermission).toBeDefined();
        expect(FileSystemService.getFilesFromHandle).toBeDefined();
    });

    it('verifyPermission should return true if queryPermission grants', async () => {
        const mockHandle = {
            queryPermission: vi.fn().mockResolvedValue('granted'),
            requestPermission: vi.fn()
        };
        const result = await FileSystemService.verifyPermission(mockHandle);
        expect(result).toBe(true);
        expect(mockHandle.queryPermission).toHaveBeenCalledWith({ mode: 'readwrite' });
        expect(mockHandle.requestPermission).not.toHaveBeenCalled();
    });

    it('verifyPermission should return true if requestPermission grants on userTriggered', async () => {
        const mockHandle = {
            queryPermission: vi.fn().mockResolvedValue('prompt'),
            requestPermission: vi.fn().mockResolvedValue('granted')
        };
        const result = await FileSystemService.verifyPermission(mockHandle, true);
        expect(result).toBe(true);
        expect(mockHandle.requestPermission).toHaveBeenCalledWith({ mode: 'readwrite' });
    });

    it('verifyPermission should return false if queryPermission is prompt and userTriggered is false (silent mode)', async () => {
        const mockHandle = {
            queryPermission: vi.fn().mockResolvedValue('prompt'),
            requestPermission: vi.fn()
        };
        const result = await FileSystemService.verifyPermission(mockHandle, false);
        expect(result).toBe(false);
        expect(mockHandle.requestPermission).not.toHaveBeenCalled();
    });

    it('getFilesFromHandle should process a file list properly', async () => {
        const mockFile = { name: 'test.txt' };
        const mockEntry = { name: 'test.txt', getFile: vi.fn().mockResolvedValue(mockFile) };
        const mockHandle = {
            type: 'files',
            name: 'mockRoot',
            handles: [mockEntry]
        };

        const files = await FileSystemService.getFilesFromHandle(mockHandle);
        expect(files.length).toBe(1);
        expect(files[0].webkitRelativePath).toBe('mockRoot/test.txt');
        expect(files[0].fileHandle).toBe(mockEntry);
    });

    it('getFilesFromHandle should process a directory handle properly', async () => {
        const mockFileEntry = { kind: 'file', name: 'file1.txt', getFile: vi.fn().mockResolvedValue({ name: 'file1.txt' }) };
        
        // Mock a directory handle that yields values
        const mockDirHandle = {
            kind: 'directory',
            name: 'mockRoot',
            values: async function* () {
                yield mockFileEntry;
            }
        };

        const files = await FileSystemService.getFilesFromHandle(mockDirHandle);
        expect(files.length).toBe(1);
        expect(files[0].webkitRelativePath).toBe('mockRoot/file1.txt');
    });

    it('getFilesFromHandle should ignore .docs directory when excluded', async () => {
        const mockDocsDir = { kind: 'directory', name: '.docs' };
        const mockNormalFile = { kind: 'file', name: 'app.js', getFile: vi.fn().mockResolvedValue({ name: 'app.js' }) };

        const mockDirHandle = {
            kind: 'directory',
            name: 'root',
            values: async function* () {
                yield mockDocsDir;
                yield mockNormalFile;
            }
        };

        const files = await FileSystemService.getFilesFromHandle(mockDirHandle, '', ['.docs']);
        expect(files.length).toBe(1);
        expect(files[0].webkitRelativePath).toBe('root/app.js');
    });
});

