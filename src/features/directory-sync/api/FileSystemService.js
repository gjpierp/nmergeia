import ignore from 'ignore';
import { telemetry } from '../../../shared/lib/TelemetryService.js';

/**
 * @file FileSystemService.js
 * @description Servicio para interactuar con la File System Access API nativa del navegador.
 * Permite leer directorios, filtrar archivos y verificar permisos de escritura.
 */

const IGNORED_PATHS = ['node_modules', '.git', '.DS_Store', 'dist', 'build', '.next', '.vscode'];

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
      state = { 
          count: 0, 
          igExclude: ignore().add(IGNORED_PATHS).add(excludes), 
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
      state.count++;
      if (state.count % 50 === 0) {
         await yieldToMain();
      }

      const relativePath = `${path}${entry.name}`;

      if (entry.kind === 'directory') {
         if (state.igExclude.ignores(relativePath + '/')) continue;
         
         const subFiles = await _getFilesFromHandle(entry, `${relativePath}/`, excludes, includes, rootName, state);
         files.push(...subFiles);
      } else if (entry.kind === 'file') {
         if (state.igExclude.ignores(relativePath)) continue;
         if (includes.length > 0 && !state.igInclude.ignores(relativePath)) continue;
         
         const file = await entry.getFile();
         Object.defineProperty(file, 'webkitRelativePath', {
           value: `${rootName}/${relativePath}`
         });
         file.fileHandle = entry; 
         files.push(file);
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

