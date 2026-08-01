import { describe, it, expect } from 'vitest';
import { formatProjectReportTitle } from './domainSanitizer.js';

describe('formatProjectReportTitle', () => {
  it('cleans https://www.nmergeia.com/ into "Informe nmergeia"', () => {
    expect(formatProjectReportTitle('https://www.nmergeia.com/')).toBe('Informe nmergeia');
  });

  it('cleans http://nmergeia.com/#features into "Informe nmergeia"', () => {
    expect(formatProjectReportTitle('http://nmergeia.com/#features')).toBe('Informe nmergeia');
  });

  it('cleans https://www.mi-empresa.com.co into "Informe mi-empresa"', () => {
    expect(formatProjectReportTitle('https://www.mi-empresa.com.co')).toBe('Informe mi-empresa');
  });

  it('handles empty or non-string input safely', () => {
    expect(formatProjectReportTitle(null)).toBe('Informe NMergeIA');
    expect(formatProjectReportTitle('')).toBe('Informe NMergeIA');
  });
});
