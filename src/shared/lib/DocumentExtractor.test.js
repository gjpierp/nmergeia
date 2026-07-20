import { describe, it, expect, vi } from 'vitest';
import { extractTextFromDocument } from './DocumentExtractor.js';
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

// Mocks para librerías de terceros
vi.mock('pdfjs-dist', () => ({
  getDocument: vi.fn().mockReturnValue({
    promise: Promise.resolve({
      numPages: 2,
      getPage: vi.fn().mockResolvedValue({
        getTextContent: vi.fn().mockResolvedValue({
          items: [{ str: 'Texto del PDF' }]
        })
      })
    })
  }),
  GlobalWorkerOptions: { workerSrc: '' },
  version: 'mock-version'
}));

vi.mock('mammoth', () => ({
  default: {
    extractRawText: vi.fn().mockResolvedValue({ value: 'Texto del Word' })
  }
}));

vi.mock('xlsx', () => ({
  read: vi.fn().mockReturnValue({
    SheetNames: ['Sheet1'],
    Sheets: {
      Sheet1: {}
    }
  }),
  utils: {
    sheet_to_csv: vi.fn().mockReturnValue('Celda1,Celda2')
  }
}));

vi.mock('jszip', () => {
  return {
    default: {
      loadAsync: vi.fn().mockResolvedValue({
        files: {
          'test.txt': { dir: false, _data: { uncompressedSize: 100 } }
        },
        forEach: function(cb) {
          cb('test.txt', { dir: false, _data: { uncompressedSize: 100 } });
        }
      })
    }
  };
});

describe('DocumentExtractor Tests', () => {
  it('should fallback to plain text decoding for unknown formats', async () => {
    const text = 'Hola Mundo';
    const buffer = new TextEncoder().encode(text).buffer;
    const result = await extractTextFromDocument('test.txt', buffer);
    expect(result).toBe(text);
  });

  it('should process PDF documents and extract pages', async () => {
    const buffer = new ArrayBuffer(8);
    const result = await extractTextFromDocument('test.pdf', buffer);
    expect(result).toContain('=== DOCUMENTO PDF (2 PÁGINAS) ===');
    expect(result).toContain('Texto del PDF');
  });

  it('should process Word DOCX files and extract text', async () => {
    const buffer = new ArrayBuffer(8);
    const result = await extractTextFromDocument('test.docx', buffer);
    expect(result).toContain('=== DOCUMENTO WORD (DOCX) ===');
    expect(result).toContain('Texto del Word');
  });

  it('should process Excel sheets and output CSV representations', async () => {
    const buffer = new ArrayBuffer(8);
    const result = await extractTextFromDocument('test.xlsx', buffer);
    expect(result).toContain('=== HOJA DE CÁLCULO EXCEL (XLSX) ===');
    expect(result).toContain('Celda1,Celda2');
  });

  it('should process ZIP file structure and list directory elements', async () => {
    const buffer = new ArrayBuffer(8);
    const result = await extractTextFromDocument('archive.zip', buffer);
    expect(result).toContain('=== ARCHIVO COMPRIMIDO (ZIP) ===');
    expect(result).toContain('📄 test.txt (100 Bytes)');
  });

  it('should parse cryptographic PEM blocks and display header info', async () => {
    const pemText = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA\n-----END PUBLIC KEY-----';
    const buffer = new TextEncoder().encode(pemText).buffer;
    const result = await extractTextFromDocument('cert.pem', buffer);
    expect(result).toContain('=== CERTIFICADO / CLAVE CRIPTOGRÁFICA (PEM) ===');
    expect(result).toContain('Bloque 1: [PUBLIC KEY]');
  });
});
