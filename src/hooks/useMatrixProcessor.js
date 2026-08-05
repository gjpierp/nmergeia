import ignore from 'ignore';
import { useAppStore } from '../app/useAppStore.js';
import { getRelativePath } from '../utils/pathUtils.js';
import { verifyPermission, getFilesFromHandle, saveFileToHandle, deleteFileFromHandle, getFileObject } from '../features/directory-sync/api/FileSystemService.js';
import { apiClient, FILTER_LOCAL_KEY } from '../shared/lib/apiClient.js';
import { showModal } from '../shared/ui/CustomModal.jsx';
import { saveHandle } from '../shared/lib/DatabaseService.js';
import { extractTextFromDocument } from '../shared/lib/DocumentExtractor.js';

export const parseFilterRules = (filterText) => {
  if (!filterText) return { excludes: [], includes: [] };
  const lines = filterText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l);

  const excludes = [];
  const includes = [];

  for (const line of lines) {
    if (line.startsWith('//') || line.startsWith('#')) continue;
    const clean = line;

    if (clean.startsWith('+')) {
      const pattern = clean.substring(1).trim();
      if (pattern) includes.push(pattern);
    } else if (clean.startsWith('-') || clean.startsWith('!')) {
      const pattern = clean.substring(1).trim();
      if (pattern) excludes.push(pattern);
    } else {
      excludes.push(clean);
    }
  }

  return { excludes, includes };
};

export const DEFAULT_FILTER_CONTENT = `- node_modules/
- dist/
- build/
- target/
- target(/
- (target)/
- .git/
- .env
- .docs/
- .agents/
- .next/
- .vscode/
- coverage/
- .DS_Store
- vendor/`;

export const getEffectiveFilterText = async (overrideTabFilterText, sessionFilterConfig) => {
  // 1. Filtro específico del tab (mayor prioridad)
  if (overrideTabFilterText !== undefined && overrideTabFilterText !== null && overrideTabFilterText.trim() !== '') {
    return overrideTabFilterText;
  }
  // 2. Config de sesión ya cargada en memoria
  if (sessionFilterConfig && sessionFilterConfig.trim() !== '') {
    return sessionFilterConfig;
  }
  // 3. localStorage unificado (siempre disponible, sin servidor)
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(FILTER_LOCAL_KEY);
    if (local && local.trim() !== '') return local;
  }
  // 4. Intento al servidor (best-effort, ya tiene timeout interno de 3s)
  try {
    const loadedFilter = await apiClient.readFilter('filtro.txt');
    if (loadedFilter && loadedFilter.trim() !== '') return loadedFilter;
  } catch (_e) {}

  return DEFAULT_FILTER_CONTENT;
};


export const readFileAsync = async (file) => {
  try {
    const extension = file.name.split('.').pop().toLowerCase();
    const isBinary = ['pdf', 'docx', 'xlsx', 'xls', 'zip', 'pem', 'crt', 'key', 'jpg', 'jpeg', 'png'].includes(extension);

    let actualFile = file;
    if (actualFile.fileHandle && typeof actualFile.fileHandle.getFile === 'function') {
        try {
            actualFile = await actualFile.fileHandle.getFile();
        } catch (e) {
            console.warn("No se pudo refrescar el archivo desde el disco:", e);
        }
    }

    let content = '';
    if (isBinary) {
      const buffer = await actualFile.arrayBuffer();
      content = await extractTextFromDocument(actualFile.name, buffer);
    } else {
      content = await actualFile.text();
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      name: actualFile.name,
      path: file.webkitRelativePath || actualFile.name,
      content: content,
      fileHandle: file.fileHandle || null
    };
  } catch (err) {
    console.error("Error en readFileAsync:", err);
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name || "Error",
      path: file.webkitRelativePath || file.name || "Error",
      content: "ERROR AL LEER EL ARCHIVO: " + err.message,
      fileHandle: file.fileHandle || null
    };
  }
};

export const useMatrixProcessor = () => {
    const tabs = useAppStore(s => s.tabs);
    const activeTab = useAppStore(s => s.activeTab);
    const originHandle = useAppStore(s => s.originHandle);
    const destSlots = useAppStore(s => s.destSlots);
    const loadedProfileName = useAppStore(s => s.loadedProfileName);
    const loadedProfileId = useAppStore(s => s.loadedProfileId);
    const processedOrigin = useAppStore(s => s.processedOrigin);
    const processedDestSlots = useAppStore(s => s.processedDestSlots);
    
    const setTabs = useAppStore(s => s.setTabs);
    const setActiveTab = useAppStore(s => s.setActiveTab);
    const setDestSlots = useAppStore(s => s.setDestSlots);
    const setIsProcessing = useAppStore(s => s.setIsProcessing);
    const setProgressMsg = useAppStore(s => s.setProgressMsg);
    const setProcessedDestSlots = useAppStore(s => s.setProcessedDestSlots);
    const setHasProcessed = useAppStore(s => s.setHasProcessed);
    const setSessionFilterConfig = useAppStore(s => s.setSessionFilterConfig);
    const sessionFilterConfig = useAppStore(s => s.sessionFilterConfig);
    const setSavedProfiles = useAppStore(s => s.setSavedProfiles);
    const addToast = useAppStore(s => s.addToast);
    
    const setOriginHandle = useAppStore(s => s.setOriginHandle);
    const setOriginPath = useAppStore(s => s.setOriginPath);
    const setLoadedProfileName = useAppStore(s => s.setLoadedProfileName);

    const handleClear = (resetUi = true) => {
        setOriginHandle(null);
        setOriginPath('');
        saveHandle('lastSession', null);
        setDestSlots([{ id: Date.now().toString(), handle: null, path: '', files: null }]);
        setTabs(prev => prev.filter(t => t.type === 'matrix'));
        setActiveTab('main');
        setLoadedProfileName(null);
    };

    const processFiles = async (isUpdate = false, overrideTab = null) => {
      const globalState = useAppStore.getState();
      let actualTab = overrideTab;
      if (!actualTab && isUpdate) {
          actualTab = globalState.tabs.find(t => t.id === globalState.activeTab);
          if (!actualTab || actualTab.type !== 'matrix') {
              actualTab = [...globalState.tabs].reverse().find(t => t.type === 'matrix');
          }
      }
      const currentOriginHandle = actualTab ? actualTab.originHandle : globalState.originHandle;
      const currentDestSlots = actualTab ? actualTab.destSlots : globalState.destSlots;

      if (!currentOriginHandle && currentDestSlots.every(s => !s.handle)) return;

      let effectiveDestSlots = [...currentDestSlots];
      if (currentOriginHandle && currentOriginHandle.kind === 'directory') {
          let changed = false;
          for (let i = 0; i < effectiveDestSlots.length; i++) {
              let slot = effectiveDestSlots[i];
              if (slot.handle && slot.handle.kind === 'directory' && slot.handle.name !== currentOriginHandle.name) {
                  const confirmClone = await showModal('confirm', 'Clonar Carpeta', `El origen se llama "${currentOriginHandle.name}" pero el destino se llama "${slot.handle.name}". ¿Deseas clonarlo (crear la subcarpeta "${currentOriginHandle.name}" en el destino) antes de comparar?`);
                  if (confirmClone) {
                      try {
                          const newHandle = await slot.handle.getDirectoryHandle(currentOriginHandle.name, { create: true });
                          effectiveDestSlots[i] = { ...slot, handle: newHandle, path: slot.path + '/' + currentOriginHandle.name };
                          changed = true;
                      } catch (e) {
                          alert(`No se pudo crear la carpeta ${currentOriginHandle.name} en el destino. ` + e.message);
                      }
                  }
              }
          }
          if (changed && !overrideTab) {
              setDestSlots(effectiveDestSlots);
          }
      }

    setIsProcessing(true);
    setProgressMsg('Leyendo filtro.txt...');
    try {
    
    const currentFilterTxt = await getEffectiveFilterText(
        isUpdate && overrideTab ? overrideTab.filterText : undefined,
        globalState.sessionFilterConfig
    );
    if (!globalState.sessionFilterConfig) {
        setSessionFilterConfig(currentFilterTxt);
    }

    const { excludes, includes } = parseFilterRules(currentFilterTxt);

    setProgressMsg("Leyendo archivos...");
    
    // 1. Verificar permisos en paralelo
    const originPermPromise = (async () => {
        if (!currentOriginHandle) return true;
        if (currentOriginHandle.type === 'files') {
            const perms = await Promise.all(currentOriginHandle.handles.map(h => verifyPermission(h)));
            return perms.every(p => p);
        }
        return await verifyPermission(currentOriginHandle);
    })();

    const destPermsPromise = Promise.all(effectiveDestSlots.map(async slot => {
        if (!slot.handle) return true;
        if (slot.handle.type === 'files') {
            const perms = await Promise.all(slot.handle.handles.map(h => verifyPermission(h)));
            return perms.every(p => p);
        }
        return await verifyPermission(slot.handle);
    }));

    const [hasOriginPerm, destPerms] = await Promise.all([originPermPromise, destPermsPromise]);

      if (!hasOriginPerm) {
          alert("Permiso denegado para el origen. Haz clic en 'Procesar y Comparar' de nuevo para reintentar.");
          return;
      }

      const failedDestIdx = destPerms.findIndex(p => !p);
      if (failedDestIdx !== -1) {
          alert(`Permiso denegado para el destino: ${effectiveDestSlots[failedDestIdx].handle?.name}. Haz clic en 'Procesar y Comparar' de nuevo para reintentar.`);
          return;
      }

    // 2. Leer archivos de origen y destinos en paralelo
    const [oFilesRaw, ...destFilesResults] = await Promise.all([
        currentOriginHandle ? getFilesFromHandle(currentOriginHandle, '', excludes, includes) : Promise.resolve([]),
        ...effectiveDestSlots.map(async slot => {
            if (!slot.handle) return [];
            return await getFilesFromHandle(slot.handle, '', excludes, includes);
        })
    ]);

    const systemDefaults = ['.docs', '.docs/', '.agents', '.gemini', '.history', 'node_modules', '.git', '.svn', '.hg', '.DS_Store', 'Thumbs.db', 'dist', 'dist_electron', 'build', 'out', 'bin', 'obj', 'target', 'vendor', 'coverage', '.next', '.nuxt', '.svelte-kit', '.cache', '.parcel-cache', '.turbo', '.vscode', '.idea', 'tmp', 'temp', 'logs'];
    const expandedTabExcludes = new Set([...systemDefaults, ...excludes]);
    const postIg = ignore().add(Array.from(expandedTabExcludes));

    const filterFileList = (fileList, rootName) => {
        if (!fileList || !rootName) return fileList;
        return fileList.filter(f => {
            const rel = getRelativePath(f.webkitRelativePath, rootName);
            const relLower = rel.toLowerCase();
            return !postIg.ignores(rel) && 
                   !postIg.ignores(rel + '/') && 
                   !postIg.ignores(relLower) && 
                   !postIg.ignores(relLower + '/');
        });
    };

    const oFiles = currentOriginHandle ? filterFileList(oFilesRaw, currentOriginHandle.name) : oFilesRaw;

    const processedDests = effectiveDestSlots.map((slot, idx) => {
        if (slot.handle) {
            const slotFiles = destFilesResults[idx] || [];
            return { ...slot, files: filterFileList(slotFiles, slot.handle.name) };
        }
        return slot;
    });
      setProcessedDestSlots(processedDests);
      setHasProcessed(true);

      let finalTabId = null;
      setTabs(prev => {
          const baseName = loadedProfileName ? loadedProfileName : 'Resultados';
          const specificTab = overrideTab;
          let existingId = null;
          let finalTitle = baseName;

          if (specificTab || isUpdate) {
              existingId = specificTab ? specificTab.id : null;
              if (!existingId) {
                  const active = prev.find(t => t.id === activeTab);
                  if (active && active.type === 'matrix') {
                      existingId = active.id;
                  } else {
                      const lastMatrix = [...prev].reverse().find(t => t.type === 'matrix');
                      if (lastMatrix) existingId = lastMatrix.id;
                  }
              }
              if (existingId) {
                  const exTab = prev.find(t => t.id === existingId);
                  if (exTab) finalTitle = exTab.title;
              }
          } else if (loadedProfileName) {
              const existingMatrix = prev.find(t => t.type === 'matrix' && t.title === loadedProfileName);
              if (existingMatrix) {
                  existingId = existingMatrix.id;
                  finalTitle = existingMatrix.title;
              }
          } else {
              let count = 1;
              while (prev.some(t => t.title === finalTitle)) {
                  count++;
                  finalTitle = `${baseName} ${count}`;
              }
          }

          if (existingId) {
              finalTabId = existingId;
              return prev.map(t => t.id === existingId ? {
                  ...t,
                  title: finalTitle,
                  processedOrigin: oFiles,
                  processedDestSlots: processedDests,
                  originHandle: currentOriginHandle,
                  destSlots: effectiveDestSlots,
                  filterText: isUpdate && t.filterText !== undefined ? t.filterText : currentFilterTxt
              } : t);
          } else {
              const newId = `matrix-${Date.now()}`;
              finalTabId = newId;
              return [...prev, {
                  id: newId,
                  title: finalTitle,
                  type: 'matrix',
                  processedOrigin: oFiles,
                  processedDestSlots: processedDests,
                  originHandle: currentOriginHandle,
                  destSlots: effectiveDestSlots,
                  filterText: currentFilterTxt
              }];
          }
      });

      if (!isUpdate) {
          handleClear(false);
          setTimeout(() => {
              if (finalTabId) setActiveTab(finalTabId);
          }, 0);
      }
    } catch (_err) {
        console.error('Error en processFiles:', _err);
        alert('Hubo un error al procesar los archivos: ' + (_err?.message || String(_err)));
    } finally {
        setIsProcessing(false);
        setProgressMsg('');
    }
  };

  const openDiffTab = async (originFile, destFile, slotIndex = 0, isBackendFile = false) => {
      setProgressMsg("Abriendo archivo...");
      setIsProcessing(true);
      
      let actualTab = tabs.find(t => t.id === activeTab);
      if (!actualTab || actualTab.type !== 'matrix') {
          actualTab = [...tabs].reverse().find(t => t.type === 'matrix');
      }
      const currentOriginHandle = actualTab ? actualTab.originHandle : originHandle;
      const currentDestSlots = actualTab ? (actualTab.processedDestSlots || actualTab.destSlots) : destSlots;
      
      let originalTxt = '';
      let modifiedTxt = '';
      let relPath = '';
      
      if (isBackendFile) {
          originalTxt = destFile;
          modifiedTxt = destFile;
          relPath = originFile;
      } else {
          if (originFile && originFile.fileHandle) {
            const fileData = await readFileAsync(originFile);
            originalTxt = fileData.content;
          }
          if (destFile && destFile.fileHandle) {
            const fileData = await readFileAsync(destFile);
            modifiedTxt = fileData.content;
          }
          relPath = originFile ? getRelativePath(originFile.webkitRelativePath, currentOriginHandle.name) : getRelativePath(destFile.webkitRelativePath, currentDestSlots[slotIndex].handle.name);
      }

      const destValues = [];
      if (!isBackendFile && currentDestSlots) {
          const reads = currentDestSlots.map(async (slot) => {
              if (slot && slot.files) {
                  const foundFile = slot.files.find(f => getRelativePath(f.webkitRelativePath, slot.handle.name) === relPath);
                  if (foundFile && (foundFile.fileHandle || foundFile.name)) {
                      const fileData = await readFileAsync(foundFile);
                      return fileData.content;
                  }
              }
              return '';
          });
          const readResults = await Promise.all(reads);
          destValues.push(...readResults);
      } else {
          destValues.push(modifiedTxt);
      }

      const newTab = {
        id: `diff-${Date.now()}`,
        title: relPath.split('/').pop(),
        filePath: relPath,
        original: originalTxt,
        modified: destValues[slotIndex] || '',
        initialOriginal: originalTxt,
        initialModified: destValues[slotIndex] || '',
        destSlotIdx: slotIndex,
        isBackendFile: isBackendFile,
        originHandle: isBackendFile ? null : currentOriginHandle,
        destHandle: isBackendFile ? null : (currentDestSlots[slotIndex] ? currentDestSlots[slotIndex].handle : null),
        destValues: destValues,
        initialDestValues: [...destValues]
      };

      setTabs(prev => [...prev.filter(t => t.filePath !== relPath), newTab]);
      setActiveTab(newTab.id);
      setIsProcessing(false);
  };

  const closeTab = (id) => {
    setTabs(prev => {
        const remaining = prev.filter(t => t.id !== id);
        if (activeTab === id) {
            const lastMatrix = remaining.find(t => t.type === 'matrix');
            if (lastMatrix) setActiveTab(lastMatrix.id);
            else if (remaining.length > 0) setActiveTab(remaining[remaining.length - 1].id);
            else setActiveTab('main');
        }
        return remaining;
    });
  };

  const saveFile = async (rootDirHandle, filePath, isBackendFile, contentToSave, silent = false, tabId = null, isOrigin = false) => {
      if (isBackendFile) {
          if (filePath === 'filtro.txt') {
               setSessionFilterConfig(contentToSave);
               apiClient.writeFilter('filtro.txt', contentToSave).catch(_e => {});
               addToast("Filtro de sesión guardado con éxito.", "success");
             if (loadedProfileId) {
                  setSavedProfiles(prev => {
                      const updated = prev.map(p => p.id === loadedProfileId ? { ...p, filterContent: contentToSave } : p);
                      saveHandle('savedProfiles', updated);
                      return updated;
                  });
             }
             if (!silent) closeTab(activeTab);
             return;
          }
          try {
              await apiClient.writeFilter(filePath, contentToSave);
              addToast("Filtro guardado con éxito.", "success");
              
              if (loadedProfileId) {
                  setSavedProfiles(prev => {
                      const updated = prev.map(p => p.id === loadedProfileId ? { ...p, filterContent: contentToSave } : p);
                      saveHandle('savedProfiles', updated);
                      return updated;
                  });
              }
                  
              if (!silent) closeTab(activeTab);
          } catch(e) {
              alert("Error guardando el filtro: " + e.message);
          }
          return;
      }

      if (!rootDirHandle || rootDirHandle.type === 'files') {
          if (!silent) addToast("Transferencia no soportada para este destino/origen o no hay carpeta selecciónada.", "error");
          return;
      }
      
      try {
          await saveFileToHandle(rootDirHandle, filePath, contentToSave);
          if (!silent) addToast("Guardado exitosamente.", "success");
          
          if (tabId) {
              setTabs(prev => prev.map(t => {
                  if (t.id === tabId) {
                      return isOrigin ? { ...t, initialOriginal: contentToSave } : { ...t, initialModified: contentToSave };
                  }
                  return t;
              }));
              if (!silent) closeTab(tabId);
          }
          
          processFiles(true);
      } catch (_e) {
          if(!silent) alert("Error al transferir el archivo.");
      }
  };

  const handleDelete = async (baseHandle, filePath, isOrigin = false, silent = false) => {
      try {
          let handleToUse = baseHandle;
          if (!handleToUse) {
              const actualTab = tabs.find(t => t.id === activeTab && t.type === 'matrix');
              if (isOrigin) {
                  handleToUse = actualTab ? actualTab.originHandle : originHandle;
              } else {
                  handleToUse = actualTab && actualTab.processedDestSlots && actualTab.processedDestSlots[0] 
                      ? actualTab.processedDestSlots[0].handle 
                      : (destSlots[0] ? destSlots[0].handle : null);
              }
          }
          if (!handleToUse) {
              if (!silent) addToast("No se encontró el directorio correspondiente para borrar el archivo.", "error");
              return;
          }
          const conf = await showModal('confirm', 'Eliminar Archivo', `¿Seguro que quieres eliminar "${filePath}" del ${isOrigin ? 'origen' : 'destino'}?`);
          if (!conf) return;
          
          await deleteFileFromHandle(handleToUse, filePath);
          addToast("Archivo eliminado con éxito.", "success");
          processFiles(true);
      } catch (_e) {
          console.error("Error al borrar archivo:", _e);
          if (!silent) addToast("Error al eliminar el archivo: " + (_e.message || "Permiso denegado o archivo no encontrado"), "error");
      }
  };

  const handleTransfer = async (sourceFileOrHandle, destHandle, filePath, silent = false) => {
      try {
          let fileObj = await getFileObject(sourceFileOrHandle);
          await saveFile(destHandle, filePath, false, fileObj, silent);
      } catch (_e) {
          if (!silent) alert("Error al preparar la transferencia.");
      }
  };

  const handleTransferFolder = async (folderPath, direction, e) => {
      e.stopPropagation();
      const isToDest = direction === 'to_dest';
      if (!window.confirm(`¿Seguro que quieres copiar la carpeta "${folderPath}" hacia ${isToDest ? 'el destino' : 'el origen'}? (Solo se transferirán archivos con diferencias o inexistentes)`)) return;

      const actualTab = tabs.find(t => t.id === activeTab && t.type === 'matrix');
      const currentOriginHandle = actualTab ? actualTab.originHandle : originHandle;
      const currentProcessedOrigin = actualTab ? (actualTab.processedOrigin || []) : (processedOrigin || []);
      const currentProcessedDestSlots = actualTab ? (actualTab.processedDestSlots || []) : (processedDestSlots || []);
      const fileEqualityMap = useAppStore.getState().fileEqualityMap || {};

      let totalTransferred = 0;
      let totalSkipped = 0;

      if (isToDest) {
         if (!currentOriginHandle) return;
         const filesToTransfer = currentProcessedOrigin.filter(f => getRelativePath(f.webkitRelativePath, currentOriginHandle.name).startsWith(folderPath + '/'));
         for (const f of filesToTransfer) {
             const relPath = getRelativePath(f.webkitRelativePath, currentOriginHandle.name);
             for (const slot of currentProcessedDestSlots) {
                 if (slot.handle && slot.handle.type !== 'files') {
                     const destFile = slot.files ? slot.files.find(df => getRelativePath(df.webkitRelativePath, slot.handle.name) === relPath) : null;
                     const key = `${slot.id}-${relPath}`;
                     const eqState = fileEqualityMap[key];
                     const status = typeof eqState === 'object' ? eqState?.status : eqState;

                     // Saltar archivos que ya son idénticos en el destino
                     const isIdentical = destFile && (
                         status === 'equal' || 
                         (!status && f.size !== undefined && destFile.size !== undefined && f.size === destFile.size && f.lastModified === destFile.lastModified)
                     );

                     if (isIdentical) {
                         totalSkipped++;
                         continue;
                     }

                     await handleTransfer(f, slot.handle, relPath, true);
                     totalTransferred++;
                 }
             }
         }
      } else {
         const filesToTransfer = [];
         currentProcessedDestSlots.forEach(slot => {
             if (slot.files && slot.handle) {
                 slot.files.forEach(f => {
                     const relPath = getRelativePath(f.webkitRelativePath, slot.handle.name);
                     if (relPath.startsWith(folderPath + '/')) {
                         filesToTransfer.push({ file: f, relPath, slotId: slot.id });
                     }
                 });
             }
         });
         for (const item of filesToTransfer) {
             if (currentOriginHandle) {
                 const originFile = currentProcessedOrigin.find(of => getRelativePath(of.webkitRelativePath, currentOriginHandle.name) === item.relPath);
                 const key = `${item.slotId}-${item.relPath}`;
                 const eqState = fileEqualityMap[key];
                 const status = typeof eqState === 'object' ? eqState?.status : eqState;

                 // Saltar archivos que ya son idénticos en el origen
                 const isIdentical = originFile && (
                     status === 'equal' || 
                     (!status && item.file.size !== undefined && originFile.size !== undefined && item.file.size === originFile.size && item.file.lastModified === originFile.lastModified)
                 );

                 if (isIdentical) {
                     totalSkipped++;
                     continue;
                 }

                 await handleTransfer(item.file, currentOriginHandle, item.relPath, true);
                 totalTransferred++;
             }
         }
      }

      useAppStore.getState().addToast(`Sincronización de carpeta finalizada: ${totalTransferred} archivo(s) transferido(s), ${totalSkipped} idéntico(s) ignorado(s).`, "success");
      processFiles(true);
  };

  const handleTransferAllToDest = async () => {
      if (!window.confirm("¿Seguro que deseas transferir TODOS los archivos con diferencias o inexistentes hacia el Destino? (Los archivos iguales no sufrirán modificaciones)")) return;

      const actualTab = tabs.find(t => t.id === activeTab && t.type === 'matrix');
      const currentOriginHandle = actualTab ? actualTab.originHandle : originHandle;
      const currentProcessedOrigin = actualTab ? (actualTab.processedOrigin || []) : (processedOrigin || []);
      const currentProcessedDestSlots = actualTab ? (actualTab.processedDestSlots || []) : (processedDestSlots || []);
      const fileEqualityMap = useAppStore.getState().fileEqualityMap || {};

      if (!currentOriginHandle) return;

      let totalTransferred = 0;
      let totalSkipped = 0;

      for (const f of currentProcessedOrigin) {
          const relPath = getRelativePath(f.webkitRelativePath, currentOriginHandle.name);
          for (const slot of currentProcessedDestSlots) {
              if (slot.handle && slot.handle.type !== 'files') {
                  const destFile = slot.files ? slot.files.find(df => getRelativePath(df.webkitRelativePath, slot.handle.name) === relPath) : null;
                  const key = `${slot.id}-${relPath}`;
                  const eqState = fileEqualityMap[key];
                  const status = typeof eqState === 'object' ? eqState?.status : eqState;

                  const isIdentical = destFile && (
                      status === 'equal' || 
                      (!status && f.size !== undefined && destFile.size !== undefined && f.size === destFile.size && f.lastModified === destFile.lastModified)
                  );

                  if (isIdentical) {
                      totalSkipped++;
                      continue;
                  }

                  await handleTransfer(f, slot.handle, relPath, true);
                  totalTransferred++;
              }
          }
      }

      useAppStore.getState().addToast(`Transferencia masiva completada: ${totalTransferred} archivo(s) transferido(s) al destino, ${totalSkipped} idéntico(s) ignorado(s).`, "success");
      processFiles(true);
  };

  const handleTransferAllToOrigin = async () => {
      if (!window.confirm("¿Seguro que deseas transferir TODOS los archivos con diferencias o inexistentes desde el Destino hacia el Origen? (Los archivos iguales no sufrirán modificaciones)")) return;

      const actualTab = tabs.find(t => t.id === activeTab && t.type === 'matrix');
      const currentOriginHandle = actualTab ? actualTab.originHandle : originHandle;
      const currentProcessedOrigin = actualTab ? (actualTab.processedOrigin || []) : (processedOrigin || []);
      const currentProcessedDestSlots = actualTab ? (actualTab.processedDestSlots || []) : (processedDestSlots || []);
      const fileEqualityMap = useAppStore.getState().fileEqualityMap || {};

      if (!currentOriginHandle) return;

      let totalTransferred = 0;
      let totalSkipped = 0;

      for (const slot of currentProcessedDestSlots) {
          if (slot.files && slot.handle) {
              for (const f of slot.files) {
                  const relPath = getRelativePath(f.webkitRelativePath, slot.handle.name);
                  const originFile = currentProcessedOrigin.find(of => getRelativePath(of.webkitRelativePath, currentOriginHandle.name) === relPath);
                  const key = `${slot.id}-${relPath}`;
                  const eqState = fileEqualityMap[key];
                  const status = typeof eqState === 'object' ? eqState?.status : eqState;

                  const isIdentical = originFile && (
                      status === 'equal' || 
                      (!status && f.size !== undefined && originFile.size !== undefined && f.size === originFile.size && f.lastModified === originFile.lastModified)
                  );

                  if (isIdentical) {
                      totalSkipped++;
                      continue;
                  }

                  await handleTransfer(f, currentOriginHandle, relPath, true);
                  totalTransferred++;
              }
          }
      }

      useAppStore.getState().addToast(`Transferencia masiva completada: ${totalTransferred} archivo(s) transferido(s) al origen, ${totalSkipped} idéntico(s) ignorado(s).`, "success");
      processFiles(true);
  };

  return {
      processFiles,
      openDiffTab,
      closeTab,
      saveFile,
      handleDelete,
      handleTransfer,
      handleTransferFolder,
      handleTransferAllToDest,
      handleTransferAllToOrigin,
      handleClear
  };
};
