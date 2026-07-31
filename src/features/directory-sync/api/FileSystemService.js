import ignore from 'ignore';
import { telemetry } from '../../../shared/lib/TelemetryService.js';

/**
 * @file FileSystemService.js
 * @description Servicio para interactuar con la File System Access API nativa del navegador.
 * Permite leer directorios, filtrar archivos y verificar permisos de escritura.
 */

const IGNORED_PATHS = [
  'node_modules', 
  '.git', 
  '.svn',
  '.hg',
  '.DS_Store', 
  'Thumbs.db',
  'dist', 
  'dist_electron',
  'build', 
  'out',
  'bin',
  'obj',
  'target',
  'vendor',
  'coverage',
  '.next', 
  '.nuxt',
  '.svelte-kit',
  '.cache',
  '.parcel-cache',
  '.turbo',
  '.vscode', 
  '.idea',
  '.docs', 
  '.docs/', 
  '.agents', 
  '.gemini', 
  '.history',
  'tmp',
  'temp',
  'logs'
];

const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

export const verifyPermission = async (fileHandle) => {
  try {
    if ((await fileHandle.queryPermission({ mode: 'readwrite' })) === 'granted') return true;
    if ((await fileHandle.requestPermission({ mode: 'readwrite' })) === 'granted') return true;
  } catch (e) {
    console.warn("Permiso denegado o expirado el gesto del usuario:", e);
  }
  return false;
};

const _getFilesFromHandle = async (dirHandle, path = '', excludes = [], includes = [], rootName = dirHandle.name, state = null) => {
  if (!state) {
      const expandedExcludes = new Set(IGNORED_PATHS.map(p => p.toLowerCase()));
      excludes.forEach(pat => {
          if (!pat) return;
          const cleanPat = pat.endsWith('/') ? pat.slice(0, -1) : pat;
          expandedExcludes.add(cleanPat.toLowerCase());
      });

      state = { 
          lastYield: performance.now(),
          excludeSet: expandedExcludes,
          igExclude: ignore().add(Array.from(expandedExcludes)), 
          igInclude: ignore().add(includes) 
      };
  }
  const files = [];
  try {
    if (dirHandle.type === 'files') {
       for (const entry of dirHandle.handles) {
          const file = await entry.getFile();
          Object.defineProperty(file, 'webkitRelativePath', {
             value: `${rootName}/${entry.name}`
          });
          file.fileHandle = entry; 
          files.push(file);
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
      const relativePath = `${path}${entry.name}`;
      const relLower = relativePath.toLowerCase();

      if (entry.kind === 'directory') {
         // PODA INMEDIATA (Pruning): Si el nombre de la carpeta está en exclusiones, no entrar en ella
         if (state.excludeSet.has(entryNameLower) || state.excludeSet.has(entry.name)) {
            continue;
         }
         const isIgnored = state.igExclude.ignores(relativePath + '/') ||
                           (relativePath !== relLower && state.igExclude.ignores(relLower + '/'));
         if (isIgnored) continue;
         
         const subFiles = await _getFilesFromHandle(entry, `${relativePath}/`, excludes, includes, rootName, state);
         files.push(...subFiles);
      } else if (entry.kind === 'file') {
         if (state.excludeSet.has(entryNameLower) || state.excludeSet.has(entry.name)) {
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
export const saveFileToHandle = async (rootDirHandle, filePath, content) => {
  let currentDir = rootDirHandle;
  const pathParts = filePath.split('/');
  const fileName = pathParts.pop();
  
  for (const part of pathParts) {
    currentDir = await currentDir.getDirectoryHandle(part, { create: true });
  }
  const targetHandle = await currentDir.getFileHandle(fileName, { create: true });
  const writable = await targetHandle.createWritable();
  await writable.write(content);
  await writable.close();
};

/**
 * Elimina un archivo en una ruta relativa del directorio dado.
 */
export const deleteFileFromHandle = async (rootDirHandle, filePath) => {
  let currentDir = rootDirHandle;
  const parts = filePath.split('/');
  const fileName = parts.pop();
  
  for (const part of parts) {
    currentDir = await currentDir.getDirectoryHandle(part, { create: false });
  }
  await currentDir.removeEntry(fileName);
};

/**
 * Resuelve y extrae el objeto File nativo a partir de un archivo o un handle de archivo.
 */
export const getFileObject = async (fileOrHandle) => {
  if (fileOrHandle.getFile) {
    return await fileOrHandle.getFile();
  }
  if (fileOrHandle.fileHandle && fileOrHandle.fileHandle.getFile) {
    return await fileOrHandle.fileHandle.getFile();
  }
  return fileOrHandle;
};

