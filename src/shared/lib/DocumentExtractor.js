import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

// Configurar el worker de PDF.js de forma compatible con ES Modules y entornos bundler
if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

/**
 * Identifica y extrae el texto estructurado de un archivo según su extensión
 * @param {string} fileName Nombre del archivo con su extensión
 * @param {ArrayBuffer} arrayBuffer Contenido binario del archivo
 * @returns {Promise<string>} Contenido en texto plano estructurado
 */
export async function extractTextFromDocument(fileName, arrayBuffer) {
  const extension = fileName.split('.').pop().toLowerCase();

  try {
    switch (extension) {
      case 'pdf':
        return await extractPdf(arrayBuffer);
      case 'docx':
        return await extractDocx(arrayBuffer);
      case 'pptx':
        return await extractPptx(arrayBuffer);
      case 'xlsx':
      case 'xls':
        return await extractXlsx(arrayBuffer);
      case 'zip':
        return await extractZip(arrayBuffer);
      case 'pem':
      case 'crt':
      case 'key':
        return await extractPem(arrayBuffer);
      case 'jpg':
      case 'jpeg':
      case 'png':
        return await extractImageMetadata(fileName, arrayBuffer);
      case 'mp3':
      case 'wav':
      case 'mp4':
      case 'mkv':
      case 'mov':
        return await extractMediaMetadata(fileName, arrayBuffer);
      default:
        // Fallback para tipos de archivo no binarios
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(arrayBuffer);
    }
  } catch (error) {
    return `--- ERROR AL EXTRAER CONTENIDO DE ${fileName.toUpperCase()} ---\nDetalle del error: ${error.message}`;
  }
}

/**
 * Extractor de PDF usando pdfjs-dist
 */
async function extractPdf(arrayBuffer) {
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  let text = `=== DOCUMENTO PDF (${pdf.numPages} PÁGINAS) ===\n\n`;

  for (let i = 1; i <= pdf.numPages; i++) {
    text += `--- Página ${i} ---\n`;
    try {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      text += pageText.trim() ? pageText : '[Página vacía o digitalizada]';
    } catch (e) {
      text += `[Error al leer página: ${e.message}]`;
    }
    text += '\n\n';
  }
  return text;
}

/**
 * Extractor de Word usando mammoth
 */
async function extractDocx(arrayBuffer) {
  const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
  return `=== DOCUMENTO WORD (DOCX) ===\n\n${result.value}`;
}

/**
 * Extractor de Excel usando xlsx (SheetJS)
 */
async function extractXlsx(arrayBuffer) {
  const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
  let text = '=== HOJA DE CÁLCULO EXCEL (XLSX) ===\n\n';

  workbook.SheetNames.forEach(sheetName => {
    text += `--- Hoja: ${sheetName} ---\n`;
    const sheet = workbook.Sheets[sheetName];
    // Convertir a formato CSV para una comparación de celdas fila a fila limpia
    const csv = XLSX.utils.sheet_to_csv(sheet);
    text += csv.trim() ? csv : '[Hoja sin datos]';
    text += '\n\n';
  });
  return text;
}

/**
 * Extractor de estructura ZIP usando JSZip
 */
async function extractZip(arrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);
  let text = '=== ARCHIVO COMPRIMIDO (ZIP) ===\n';
  text += `Cantidad de archivos: ${Object.keys(zip.files).length}\n\n`;
  text += '--- Árbol de Directorios Interno ---\n';

  const files = [];
  zip.forEach((relativePath, file) => {
    const dirIndicator = file.dir ? '📁' : '📄';
    const sizeIndicator = file.dir ? '' : ` (${formatBytes(file._data?.uncompressedSize || 0)})`;
    files.push(`${dirIndicator} ${relativePath}${sizeIndicator}`);
  });

  return text + files.sort().join('\n');
}

/**
 * Extractor de Certificados PEM
 */
async function extractPem(arrayBuffer) {
  const decoder = new TextDecoder('utf-8');
  const rawText = decoder.decode(arrayBuffer);
  let text = '=== CERTIFICADO / CLAVE CRIPTOGRÁFICA (PEM) ===\n\n';

  // Buscar bloques tipo -----BEGIN XXX-----
  const pemRegex = /-----BEGIN ([^-]+)-----([^-]+)-----END ([^-]+)-----/g;
  let match;
  let matchesCount = 0;

  while ((match = pemRegex.exec(rawText)) !== null) {
    matchesCount++;
    const blockType = match[1].trim();
    const base64Data = match[2].replace(/\s/g, '');
    
    text += `Bloque ${matchesCount}: [${blockType}]\n`;
    text += `Tamaño de clave (Base64): ${base64Data.length} caracteres\n`;
    
    try {
      const decodedBytes = atob(base64Data);
      text += `Tamaño binario (Decodificado): ${decodedBytes.length} bytes\n`;
    } catch (e) {
      text += `[Error al verificar bloque Base64: ${e.message}]\n`;
    }
    text += '\n';
  }

  if (matchesCount === 0) {
    text += 'No se encontraron bloques PEM estándar formateados.\n';
    text += 'Contenido crudo del archivo:\n';
    text += rawText;
  }

  return text;
}

async function extractImageMetadata(fileName, arrayBuffer) {
  const sizeBytes = arrayBuffer.byteLength;
  let text = `=== METADATOS DE IMAGEN ===\n\nArchivo: ${fileName}\nTamaño del archivo: ${formatBytes(sizeBytes)}\n`;
  if (typeof window !== 'undefined') {
    try {
      const dimensions = await getImageDimensions(arrayBuffer);
      text += `Dimensiones: ${dimensions.width} x ${dimensions.height} píxeles\n`;
    } catch (e) {
      // Ignorar fallo en entornos de test sin DOM completo
    }
  }
  return text;
}

/**
 * Extractor de diapositivas PPTX
 */
async function extractPptx(arrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);
  let text = '=== PRESENTACIÓN POWERPOINT (PPTX) ===\n\n';
  const slideFiles = Object.keys(zip.files).filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'));
  
  slideFiles.sort((a, b) => {
    const numA = parseInt(a.replace(/^\D+/g, ''), 10);
    const numB = parseInt(b.replace(/^\D+/g, ''), 10);
    return numA - numB;
  });

  for (let i = 0; i < slideFiles.length; i++) {
    const slideName = slideFiles[i];
    const content = await zip.files[slideName].async('text');
    text += `--- Diapositiva ${i + 1} ---\n`;
    const matches = [...content.matchAll(/<a:t>([^<]+)<\/a:t>/g)];
    const slideText = matches.map(m => m[1]).join(' ');
    text += slideText.trim() ? slideText : '[Diapositiva vacía o sin texto]';
    text += '\n\n';
  }
  return text;
}

/**
 * Extractor de archivos de audio y video
 */
async function extractMediaMetadata(fileName, arrayBuffer) {
  const sizeBytes = arrayBuffer.byteLength;
  const ext = fileName.split('.').pop().toLowerCase();
  const isVideo = ['mp4', 'mkv', 'mov'].includes(ext);
  
  return `=== METADATOS MULTIMEDIA (${isVideo ? 'VIDEO' : 'AUDIO'}) ===\n\nArchivo: ${fileName}\nTamaño del archivo: ${formatBytes(sizeBytes)}\nFormato: ${ext.toUpperCase()}\n`;
}

/**
 * Helper para leer dimensiones de imagen
 */
function getImageDimensions(arrayBuffer) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([arrayBuffer]);
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(url);
    };
    img.onerror = (e) => {
      reject(e);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/**
 * Utilidad para formatear bytes
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
