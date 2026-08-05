import ignore from 'ignore';
import { telemetry } from '../../../shared/lib/TelemetryService.js';

/**
 * @file FileSystemService.js
 * @description Servicio para interactuar con la File System Access API nativa del navegador.
 * Permite leer directorios, filtrar archivos y verificar permisos de escritura.
 */

const IGNORED_PATHS = [
  'node_modules', 
  'node_modules/', 
  '.git', 
  '.git/', 
  '.svn',
  '.hg',
  '.DS_Store', 
  'Thumbs.db',
  'dist', 
  'dist/', 
  'dist_electron',
  'build', 
  'build/', 
  'out',
  'bin',
  'obj',
  'target',
  'target/',
  'target(',
  'target(/',
  '(target)',
  '(target)/',
  'vendor',
  'vendor/',
  'coverage',
  'coverage/',
  '.next', 
  '.next/', 
  '.nuxt',
  '.svelte-kit',
  '.cache',
  '.parcel-cache',
  '.turbo',
  '.vscode', 
  '.vscode/', 
  '.idea',
  '.docs', 
  '.docs/', 
  '.agents', 
  '.agents/', 
  '.gemini', 
  '.history',
  'tmp',
  'temp',
  'logs'
];

const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

export const verifyPermission = async (fileHandle, userTriggered = false) => {
  try {
    if (!fileHandle || typeof fileHandle.queryPermission !== 'function') return true;
    // 1. Verificación silenciosa sin abrir diálogos ni popups del navegador
    const current = await fileHandle.queryPermission({ mode: 'readwrite' });
    if (current === 'granted') return true;

    // 2. Solo solicitar permiso interactivo si fue detonado por un gesto directo de clic del usuario
    if (userTriggered && typeof fileHandle.requestPermission === 'function') {
      const requested = await fileHandle.requestPermission({ mode: 'readwrite' });
      if (requested === 'granted') return true;
    }
  } catch (e) {
    console.warn("Permiso denegado o no otorgado por el navegador:", e);
  }
  return false;
};

const safeGlobPattern = (pat) => {
  if (!pat) return '';
  return pat.replace(/([()\[\]])/g, '\\$1');
};

const _getFilesFromHandle = async (dirHandle, path = '', excludes = [], includes = [], rootName = dirHandle.name, state = null) => {
  if (!state) {
      const expandedExcludes = new Set();
      
      const addPatternToExcludes = (pat) => {
        if (!pat) return;
        const lower = pat.toLowerCase().trim();
        const clean = lower.endsWith('/') ? lower.slice(0, -1) : lower;
        const noParens = clean.replace(/[()]/g, '');

        expandedExcludes.add(clean);
        expandedExcludes.add(`${clean}/`);
        if (noParens && noParens !== clean) {
          expandedExcludes.add(noParens);
          expandedExcludes.add(`${noParens}/`);
        }
      };

      IGNORED_PATHS.forEach(addPatternToExcludes);
      excludes.forEach(addPatternToExcludes);

      const safeExcludesList = Array.from(expandedExcludes).map(safeGlobPattern);
      const safeIncludesList = includes.map(safeGlobPattern);

      state = { 
          lastYield: performance.now(),
          excludeSet: expandedExcludes,
          igExclude: ignore().add(safeExcludesList), 
          igInclude: ignore().add(safeIncludesList) 
      };
  }
  const files = [];
  try {
    if (dirHandle.type === 'files') {
       for (const entry of dirHandle.handles) {
          if (entry.kind === 'directory') {
             const subFiles = await _getFilesFromHandle(entry, `${entry.name}/`, excludes, includes, rootName, state);
             files.push(...subFiles);
          } else if (typeof entry.getFile === 'function') {
             const file = await entry.getFile();
             Object.defineProperty(file, 'webkitRelativePath', {
                value: `${rootName}/${entry.name}`
             });
             file.fileHandle = entry; 
             files.push(file);
          }
       }
       return files;
    }
    
    for await (const entry of dirHandle.values()) {
      const now = performance.now();
      if (now - state.lastYield > 16) {
         state.lastYield = now;
         await yieldToMain();
      }

      const entryNameLower = entry.name.toLowerCase();
      const cleanName = entryNameLower.replace(/[()]/g, '');
      const relativePath = `${path}${entry.name}`;
      const relLower = relativePath.toLowerCase();

      if (entry.kind === 'directory') {
         // PODA INMEDIATA (Pruning): Si el nombre de la carpeta coincide con cualquier regla de exclusión, omitir recursión
         if (
           state.excludeSet.has(entryNameLower) || 
           state.excludeSet.has(`${entryNameLower}/`) ||
           state.excludeSet.has(cleanName) ||
           state.excludeSet.has(`${cleanName}/`) ||
           entryNameLower.startsWith('target') ||
           cleanName.startsWith('target') ||
           entryNameLower === 'node_modules' ||
           entryNameLower === 'dist' ||
           entryNameLower === 'build'
         ) {
            continue;
         }
         const isIgnored = state.igExclude.ignores(relativePath + '/') ||
                           state.igExclude.ignores(relativePath) ||
                           (relativePath !== relLower && state.igExclude.ignores(relLower + '/'));
         if (isIgnored) continue;
         
         const subFiles = await _getFilesFromHandle(entry, `${relativePath}/`, excludes, includes, rootName, state);
         files.push(...subFiles);
      } else if (entry.kind === 'file') {
         if (
           state.excludeSet.has(entryNameLower) || 
           state.excludeSet.has(cleanName)
         ) {
            continue;
         }
         const isIgnored = state.igExclude.ignores(relativePath) ||
                           (relativePath !== relLower && state.igExclude.ignores(relLower));
         if (isIgnored) continue;
         if (includes.length > 0) {
            const isIncluded = state.igInclude.ignores(relativePath) ||
                               (relativePath !== relLower && state.igInclude.ignores(relLower));
            if (!isIncluded) continue;
         }
         
         const fileProxy = {
           name: entry.name,
           webkitRelativePath: `${rootName}/${relativePath}`,
           fileHandle: entry,
           getFile: () => entry.getFile()
         };
         files.push(fileProxy);
      }
    }
  } catch (e) {
    telemetry.logError(e, { operation: 'FileSystemRead', path });
  }
  return files;
};

export const getFilesFromHandle = telemetry.measureExecutionTime('getFilesFromHandle', _getFilesFromHandle);

/**
 * Guarda o escribe contenido en una ruta relativa bajo el directorio dado.
 */
export const saveFileToHandle = async (dirHandle, relativePath, content) => {
  try {
    const parts = relativePath.split('/').filter(Boolean);
    const fileName = parts.pop();
    let currentHandle = dirHandle;

    for (const part of parts) {
      currentHandle = await currentHandle.getDirectoryHandle(part, { create: true });
    }

    const fileHandle = await currentHandle.getFileHandle(fileName, { create: true });
    const isPermitted = await verifyPermission(fileHandle, true);
    if (!isPermitted) throw new Error("Permiso de escritura denegado en el navegador.");

    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    return true;
  } catch (err) {
    console.error("Error al guardar archivo a traves del Handle:", err);
    throw err;
  }
};

/**
 * Elimina un archivo o directorio relativo.
 */
export const deleteFileFromHandle = async (dirHandle, relativePath) => {
  try {
    const parts = relativePath.split('/').filter(Boolean);
    const fileName = parts.pop();
    let currentHandle = dirHandle;

    for (const part of parts) {
      currentHandle = await currentHandle.getDirectoryHandle(part);
    }

    await currentHandle.removeEntry(fileName);
    return true;
  } catch (err) {
    console.error("Error al eliminar archivo a traves del Handle:", err);
    throw err;
  }
};

/**
 * Obtiene el objeto File a partir de un Handle.
 */
export const getFileObject = async (fileHandle) => {
  if (fileHandle && typeof fileHandle.getFile === 'function') {
    return await fileHandle.getFile();
  }
  return fileHandle;
};
