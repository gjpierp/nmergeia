import { useAppStore } from '../app/useAppStore.js';
import { getRelativePath } from '../utils/pathUtils.js';
import { verifyPermission, getFilesFromHandle, saveFileToHandle, deleteFileFromHandle, getFileObject } from '../features/directory-sync/api/FileSystemService.js';
import { apiClient } from '../shared/lib/apiClient.js';
import { showModal } from '../shared/ui/CustomModal.jsx';
import { saveHandle } from '../shared/lib/DatabaseService.js';
import { extractTextFromDocument } from '../shared/lib/DocumentExtractor.js';

export const readFileAsync = (file) => {
  return new Promise((resolve) => {
    const extension = file.name.split('.').pop().toLowerCase();
    const isBinary = ['pdf', 'docx', 'xlsx', 'xls', 'zip', 'pem', 'crt', 'key', 'jpg', 'jpeg', 'png'].includes(extension);

    const reader = new FileReader();
    reader.onload = async (e) => {
      let content = '';
      if (isBinary) {
        content = await extractTextFromDocument(file.name, e.target.result);
      } else {
        content = e.target.result;
      }
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        path: file.webkitRelativePath || file.name,
        content: content,
        fileHandle: file.fileHandle || null
      });
    };

    if (isBinary) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
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
      let actualTab = overrideTab;
      if (!actualTab && isUpdate) {
          actualTab = tabs.find(t => t.id === activeTab);
          if (!actualTab || actualTab.type !== 'matrix') {
              actualTab = [...tabs].reverse().find(t => t.type === 'matrix');
          }
      }
      const currentOriginHandle = actualTab ? actualTab.originHandle : originHandle;
      const currentDestSlots = actualTab ? actualTab.destSlots : destSlots;

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
    
    let excludes = [];
    let includes = [];
    let currentFilterTxt = '';
    
    if (isUpdate && overrideTab && overrideTab.filterText !== undefined) {
        currentFilterTxt = overrideTab.filterText;
        const lines = currentFilterTxt.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'));
        excludes = lines.filter(l => l.startsWith('-') || l.startsWith('!')).map(l => l.substring(1).trim().toLowerCase());
        includes = lines.filter(l => l.startsWith('+')).map(l => l.substring(1).trim().toLowerCase());
    } else {
        try {
          currentFilterTxt = await apiClient.readFilter('filtro.txt');
          if (currentFilterTxt) {
            const lines = currentFilterTxt.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'));
            excludes = lines.filter(l => l.startsWith('-') || l.startsWith('!')).map(l => l.substring(1).trim().toLowerCase());
            includes = lines.filter(l => l.startsWith('+')).map(l => l.substring(1).trim().toLowerCase());
          }
        } catch(_e) {}
    }

    setProgressMsg("Leyendo archivos...");
    
    let oFiles = [];
    if (currentOriginHandle) {
        let hasPerm = false;
        if (currentOriginHandle.type === 'files') {
            const perms = await Promise.all(currentOriginHandle.handles.map(h => verifyPermission(h)));
            hasPerm = perms.every(p => p);
        } else {
            hasPerm = await verifyPermission(currentOriginHandle);
        }
        if (!hasPerm) {
             setIsProcessing(false);
             alert("Permiso denegado para el origen. Haz clic en 'Procesar y Comparar' de nuevo para reintentar.");
             return;
        }
        oFiles = await getFilesFromHandle(currentOriginHandle, '', excludes, includes);
    }
    
    const processedDests = [];
    for (const slot of effectiveDestSlots) {
        if (slot.handle) {
            let hasPerm = false;
            if (slot.handle.type === 'files') {
                const perms = await Promise.all(slot.handle.handles.map(h => verifyPermission(h)));
                hasPerm = perms.every(p => p);
            } else {
                hasPerm = await verifyPermission(slot.handle);
            }
            if (!hasPerm) {
                 setIsProcessing(false);
                 alert(`Permiso denegado para el destino: ${slot.handle.name}. Haz clic en 'Procesar y Comparar' de nuevo para reintentar.`);
                 return;
            }
            const dFiles = await getFilesFromHandle(slot.handle, '', excludes, includes);
            processedDests.push({ ...slot, files: dFiles });
        } else {
            processedDests.push(slot);
        }
    }
    setProcessedDestSlots(processedDests);
    setHasProcessed(true);
    let finalTabId = null;
      try {
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
        alert("Hubo un error al procesar los archivos.");
    } finally {
        setIsProcessing(false);
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
      const currentDestSlots = actualTab ? actualTab.destSlots : destSlots;
      
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

      const newTab = {
        id: `diff-${Date.now()}`,
        title: relPath.split('/').pop(),
        filePath: relPath,
        original: originalTxt,
        modified: modifiedTxt,
        initialOriginal: originalTxt,
        initialModified: modifiedTxt,
        destSlotIdx: slotIndex,
        isBackendFile: isBackendFile,
        originHandle: isBackendFile ? null : currentOriginHandle,
        destHandle: isBackendFile ? null : currentDestSlots[slotIndex].handle
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
               addToast("Filtro de sesiÃ³n guardado con Ã©xito.", "success");
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
          if (!baseHandle) return;
          const conf = await showModal('confirm', 'Eliminar', `¿Seguro que quieres eliminar "${filePath}" del ${isOrigin ? 'origen' : 'destino'}?`);
          if (!conf) return;
          
          await deleteFileFromHandle(baseHandle, filePath);
          addToast("Archivo eliminado con éxito.", "success");
          processFiles(true);
      } catch (_e) {
          if (!silent) addToast("Error al eliminar el archivo.", "error");
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
      if (!window.confirm(`¿Seguro que quieres copiar TODA la carpeta "${folderPath}" hacia ${isToDest ? 'el destino' : 'el origen'}?`)) return;

      if (isToDest) {
         const filesToTransfer = processedOrigin.filter(f => getRelativePath(f.webkitRelativePath, originHandle.name).startsWith(folderPath + '/'));
         for (const f of filesToTransfer) {
             const relPath = getRelativePath(f.webkitRelativePath, originHandle.name);
             for (const slot of processedDestSlots) {
                 if (slot.handle && slot.handle.type !== 'files') {
                     await handleTransfer(f, slot.handle, relPath, true);
                 }
             }
         }
      } else {
         const filesToTransfer = [];
         processedDestSlots.forEach(slot => {
             if (slot.files) {
                 slot.files.forEach(f => {
                     const relPath = getRelativePath(f.webkitRelativePath, slot.handle.name);
                     if (relPath.startsWith(folderPath + '/')) {
                         filesToTransfer.push({ file: f, relPath });
                     }
                 });
             }
         });
         for (const item of filesToTransfer) {
             if (originHandle) {
                 await handleTransfer(item.file, originHandle, item.relPath, true);
             }
         }
      }
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
      handleClear
  };
};
