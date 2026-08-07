import React, { memo, useState, useRef, useEffect, useMemo } from 'react';
import ignore from 'ignore';
import { useAppStore } from '../../app/useAppStore.js';
import { useTranslation } from 'react-i18next';
import { getRelativePath } from "../../utils/pathUtils.js";
import { parseFilterRules, DEFAULT_FILTER_CONTENT } from "../../hooks/useMatrixProcessor.js";
import { NgacAdBanner } from '../monetization/NgacAdBanner.jsx';
import { deleteFileFromHandle, saveFileToHandle, getFileObject } from '../../features/directory-sync/api/FileSystemService.js';
import { showModal } from '../../shared/ui/CustomModal.jsx';

export const MatrixView = memo(({ 
    tab, 
    processFiles, 
    handleTransferFolder, 
    handleDelete, 
    handleTransfer, 
    handleTransferAllToDest,
    handleTransferAllToOrigin,
    swapFolders,
    openDiffTab 
}) => {
    const { t } = useTranslation();
    const { 
        filterText, setFilterText, 
        showOnlyChanges, setShowOnlyChanges, 
        isProcessing, 
        collapsedFolders, setCollapsedFolders,
        fileEqualityMap,
        matrixScrollTop, setMatrixScrollTop,
        sessionFilterConfig,
        addToast,
        originHandle
    } = useAppStore();

    const [selectedPaths, setSelectedPaths] = useState(new Set());
    const containerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(600);

    const toggleFolder = (path) => {
        setCollapsedFolders(prev => {
            const next = new Set(prev);
            if (next.has(path)) next.delete(path);
            else next.add(path);
            return next;
        });
    };

    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                setContainerHeight(containerRef.current.clientHeight);
            }
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    const { originMap, destMaps, allPaths } = useMemo(() => {
        const oMap = new Map();
        if (tab.processedOrigin) {
            tab.processedOrigin.forEach(f => oMap.set(getRelativePath(f.webkitRelativePath, tab.originHandle?.name), f));
        }
        
        const dMaps = tab.processedDestSlots ? tab.processedDestSlots.map(slot => {
            const map = new Map();
            if (slot.files) {
                slot.files.forEach(f => map.set(getRelativePath(f.webkitRelativePath, slot.handle?.name), f));
            }
            return { slot, map };
        }) : [];

        const paths = new Set();
        for (const path of oMap.keys()) paths.add(path);
        for (const { map } of dMaps) {
            for (const path of map.keys()) paths.add(path);
        }
        return { originMap: oMap, destMaps: dMaps, allPaths: paths };
    }, [tab.processedOrigin, tab.processedDestSlots, tab.originHandle]);

    const filteredPaths = useMemo(() => {
        let pathsArray = Array.from(allPaths);
        const activeFilterTxt = tab.filterText || sessionFilterConfig || DEFAULT_FILTER_CONTENT;
        const { excludes: activeExcludes } = parseFilterRules(activeFilterTxt);
        
        if (activeExcludes.length > 0) {
            const systemDefaults = ['.docs', '.docs/', '.agents', '.gemini', '.history', 'node_modules', '.git', 'dist', 'build', '.next', '.vscode'];
            const expandedTabExcludes = new Set([...systemDefaults]);
            activeExcludes.forEach(pat => {
                if (!pat) return;
                const cleanPat = pat.endsWith('/') ? pat.slice(0, -1) : pat;
                expandedTabExcludes.add(cleanPat);
                expandedTabExcludes.add(cleanPat.toLowerCase());
            });
            const tabIg = ignore().add(Array.from(expandedTabExcludes));
            pathsArray = pathsArray.filter(relPath => {
                const relLower = relPath.toLowerCase();
                return !tabIg.ignores(relPath) && 
                       !tabIg.ignores(relPath + '/') && 
                       !tabIg.ignores(relLower) && 
                       !tabIg.ignores(relLower + '/');
            });
        }

        if (filterText) {
            pathsArray = pathsArray.filter(p => p.toLowerCase().includes(filterText.toLowerCase()));
        }

        if (showOnlyChanges) {
           pathsArray = pathsArray.filter(relPath => {
               const oFile = originMap.get(relPath);
               const hasDiff = destMaps.some(({ slot, map }) => {
                  if (!slot.handle) return true;
                  const dFile = map.get(relPath);
                  if (oFile && !dFile) return true;
                  if (!oFile && dFile) return true;

                  const key = `${slot.id}-${relPath}`;
                  if (fileEqualityMap[key]) {
                      const eq = fileEqualityMap[key];
                      const status = typeof eq === 'object' ? eq.status : eq;
                      return status === 'different';
                  }

                  if (oFile && dFile && oFile.size !== undefined && dFile.size !== undefined && oFile.size !== dFile.size) return true;
                  return false;
               });
               return hasDiff;
           });
        }
        return pathsArray.sort();
    }, [allPaths, tab.filterText, sessionFilterConfig, filterText, showOnlyChanges, originMap, destMaps, fileEqualityMap]);

    const sortedRows = useMemo(() => {
        const folderSet = new Set();
        filteredPaths.forEach(p => {
           const parts = p.split('/');
           parts.pop(); 
           let current = '';
           parts.forEach(part => {
              current = current ? current + '/' + part : part;
              folderSet.add(current);
           });
        });
        
        const allRows = [];
        folderSet.forEach(f => {
           allRows.push({ type: 'folder', path: f, name: f.split('/').pop(), depth: f.split('/').length - 1 });
        });
        filteredPaths.forEach(p => {
           allRows.push({ type: 'file', path: p, name: p.split('/').pop(), depth: p.split('/').length - 1 });
        });
        
        allRows.forEach(row => {
           const parts = row.path.split('/');
           if (row.type === 'folder') {
               row._sortKey = parts.map(p => '0_' + p).join('/');
           } else {
               const name = parts.pop();
               row._sortKey = (parts.length > 0 ? parts.map(p => '0_' + p).join('/') + '/' : '') + '1_' + name;
           }
        });

        allRows.sort((a, b) => a._sortKey.localeCompare(b._sortKey));
        return allRows;
    }, [filteredPaths]);

    const rowData = useMemo(() => {
        const visibleRows = sortedRows.filter(row => {
           const parts = row.path.split('/');
           parts.pop();
           let current = '';
           for(let part of parts) {
               current = current ? current + '/' + part : part;
               if (collapsedFolders.has(current)) return false;
           }
           return true;
        });

        return visibleRows.map(row => {
          if (row.type === 'folder') {
              return { ...row, isCollapsed: collapsedFolders.has(row.path) };
          }
          const oFile = originMap.get(row.path);
          const statuses = destMaps.map(({ slot, map }) => {
            if (!slot.handle) return { status: 'missing', file: null, handle: null };
            const dFile = map.get(row.path);
            if (oFile && !dFile) return { status: 'missing', file: null, handle: slot.handle };
            if (!oFile && dFile) return { status: 'different', file: dFile, handle: slot.handle };
            
            const key = `${slot.id}-${row.path}`;
            if (fileEqualityMap[key]) {
                 const eq = fileEqualityMap[key];
                 const status = typeof eq === 'object' ? eq.status : eq;
                 return { 
                     status, 
                     file: dFile, 
                     handle: slot.handle,
                     diffStats: typeof eq === 'object' && eq.status === 'different' && (eq.added > 0 || eq.deleted > 0)
                         ? { added: eq.added, deleted: eq.deleted } 
                         : null 
                 };
            }

            if (oFile.size !== undefined && dFile.size !== undefined && oFile.size !== dFile.size) return { status: 'different', file: dFile, handle: slot.handle };
            return { status: 'identical', file: dFile, handle: slot.handle };
          });
          return { ...row, oFile, statuses };
        });
    }, [sortedRows, collapsedFolders, originMap, destMaps, fileEqualityMap]);

    const toggleSelectPath = (path, e) => {
        if (e) e.stopPropagation();
        setSelectedPaths(prev => {
            const next = new Set(prev);
            if (next.has(path)) next.delete(path);
            else next.add(path);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedPaths.size === filteredPaths.length && filteredPaths.length > 0) {
            setSelectedPaths(new Set());
        } else {
            setSelectedPaths(new Set(filteredPaths));
        }
    };

    const handleBatchDeleteOrigin = async () => {
        if (selectedPaths.size === 0) return;
        const handleToUse = tab.originHandle || originHandle;
        if (!handleToUse) {
            if (addToast) addToast("No se encontró el directorio de origen.", "error");
            return;
        }
        const count = selectedPaths.size;
        const conf = await showModal('confirm', 'Eliminar Selección de Origen', `¿Seguro que quieres eliminar los ${count} archivos seleccionados del directorio de origen en tu disco local?`);
        if (!conf) return;

        let deletedCount = 0;
        for (const filePath of selectedPaths) {
            try {
                await deleteFileFromHandle(handleToUse, filePath);
                deletedCount++;
            } catch (_e) {
                console.error("Error borrando de origen:", filePath, _e);
            }
        }
        if (addToast) addToast(`${deletedCount} de ${count} archivos eliminados del origen con éxito.`, "success");
        setSelectedPaths(new Set());
        processFiles(true, tab);
    };

    const handleBatchDeleteDest = async () => {
        if (selectedPaths.size === 0) return;
        const destSlotsToUse = tab.processedDestSlots || [];
        if (destSlotsToUse.length === 0 || !destSlotsToUse[0]?.handle) {
            if (addToast) addToast("No se encontró directorio de destino.", "error");
            return;
        }
        const count = selectedPaths.size;
        const conf = await showModal('confirm', 'Eliminar Selección de Destino', `¿Seguro que quieres eliminar los ${count} archivos seleccionados del directorio de destino en tu disco local?`);
        if (!conf) return;

        let deletedCount = 0;
        for (const filePath of selectedPaths) {
            for (const slot of destSlotsToUse) {
                if (slot.handle) {
                    try {
                        await deleteFileFromHandle(slot.handle, filePath);
                        deletedCount++;
                    } catch (_e) {}
                }
            }
        }
        if (addToast) addToast(`Archivos seleccionados eliminados del destino con éxito.`, "success");
        setSelectedPaths(new Set());
        processFiles(true, tab);
    };

    const handleBatchTransferToDest = async () => {
        if (selectedPaths.size === 0) return;
        const destSlotsToUse = tab.processedDestSlots || [];
        if (destSlotsToUse.length === 0 || !destSlotsToUse[0]?.handle) {
            if (addToast) addToast("No se encontró directorio de destino.", "error");
            return;
        }
        let transferredCount = 0;
        for (const filePath of selectedPaths) {
            const oFile = originMap.get(filePath);
            if (oFile) {
                for (const slot of destSlotsToUse) {
                    if (slot.handle) {
                        try {
                            let fileObj = await getFileObject(oFile);
                            await saveFileToHandle(slot.handle, filePath, false, fileObj, true);
                            transferredCount++;
                        } catch (_e) {}
                    }
                }
            }
        }
        if (addToast) addToast(`${transferredCount} transferencias hacia el destino completadas.`, "success");
        setSelectedPaths(new Set());
        processFiles(true, tab);
    };

    const handleBatchTransferToOrigin = async () => {
        if (selectedPaths.size === 0) return;
        const originH = tab.originHandle || originHandle;
        if (!originH) {
            if (addToast) addToast("No se encontró el directorio de origen.", "error");
            return;
        }
        let transferredCount = 0;
        for (const filePath of selectedPaths) {
            const dSlot = destMaps.find(({ map }) => map.has(filePath));
            if (dSlot) {
                const dFile = dSlot.map.get(filePath);
                if (dFile) {
                    try {
                        let fileObj = await getFileObject(dFile);
                        await saveFileToHandle(originH, filePath, false, fileObj, true);
                        transferredCount++;
                    } catch (_e) {}
                }
            }
        }
        if (addToast) addToast(`${transferredCount} transferencias hacia el origen completadas.`, "success");
        setSelectedPaths(new Set());
        processFiles(true, tab);
    };

    const toggleSelectFolder = (folderPath, e) => {
        e.stopPropagation();
        const folderFiles = rowData.filter(r => r.type !== 'folder' && (r.path === folderPath || r.path.startsWith(folderPath + '/'))).map(r => r.path);
        if (folderFiles.length === 0) return;
        setSelectedPaths(prev => {
            const next = new Set(prev);
            const allSelected = folderFiles.every(p => next.has(p));
            if (allSelected) {
                folderFiles.forEach(p => next.delete(p));
            } else {
                folderFiles.forEach(p => next.add(p));
            }
            return next;
        });
    };

    const isFolderSelected = (folderPath) => {
        const folderFiles = rowData.filter(r => r.type !== 'folder' && (r.path === folderPath || r.path.startsWith(folderPath + '/'))).map(r => r.path);
        if (folderFiles.length === 0) return false;
        return folderFiles.every(p => selectedPaths.has(p));
    };

    const handleDeleteFolder = async (folderPath, target, e) => {
        e.stopPropagation();
        const targetName = target === 'origin' ? 'el Origen' : 'el Destino';
        const confirm = window.confirm(`¿Estás seguro de que deseas eliminar TODOS los archivos de la carpeta "${folderPath}" en ${targetName}?`);
        if (!confirm) return;

        const folderFiles = rowData.filter(r => r.type !== 'folder' && (r.path === folderPath || r.path.startsWith(folderPath + '/')));
        let count = 0;
        for (const item of folderFiles) {
            if (target === 'origin' && item.oFile) {
                const origH = tab.originHandle || originHandle;
                if (origH) {
                    try {
                        await handleDelete(origH, item.path, true);
                        count++;
                    } catch (_e) {}
                }
            } else if (target === 'dest') {
                for (const s of item.statuses) {
                    if (s.handle && s.file) {
                        try {
                            await handleDelete(s.handle, item.path, false);
                            count++;
                        } catch (_e) {}
                    }
                }
            }
        }
        if (addToast) addToast(`${count} archivos de la carpeta "${folderPath}" fueron eliminados en ${targetName}.`, "info");
        processFiles(true, tab);
    };

    const ROW_HEIGHT = 36;
    const overscan = 10;
    const totalHeight = rowData.length * ROW_HEIGHT;
    const startIndex = Math.max(0, Math.floor(matrixScrollTop / ROW_HEIGHT) - overscan);
    const endIndex = Math.min(rowData.length - 1, Math.ceil((matrixScrollTop + containerHeight) / ROW_HEIGHT) + overscan);
    const visibleRowsData = rowData.slice(startIndex, endIndex + 1);
    const paddingTop = startIndex * ROW_HEIGHT;

    return (
      <div className="matrix-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px 20px', overflow: 'hidden' }}>
        
        {/* Botonera de Gestión de Carpetas y Archivos en Resultados (Estilo DiffView) */}
        <div className="section-card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px 16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '10px' }}>
           
           {/* Buscador de Archivos y Carpetas en los Resultados */}
           <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '220px', gap: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '0 12px' }}>
             <span className="material-symbols-rounded" style={{ color: 'var(--text-tertiary)', fontSize: '1.2rem' }}>search</span>
             <input 
               type="text" 
               placeholder={t('matrix_search_placeholder') || "Buscar archivo o carpeta en los resultados..."}
               className="input-field"
               style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text-primary)', padding: '8px 0', fontSize: '0.9rem', outline: 'none' }}
               value={filterText}
               onChange={(e) => setFilterText(e.target.value)}
             />
             {filterText && (
               <button className="btn clear-btn small-btn" onClick={() => setFilterText('')} style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }} title="Limpiar búsqueda">
                 <span className="material-symbols-rounded" style={{ fontSize: '1.1rem', color: 'var(--text-tertiary)' }}>close</span>
               </button>
             )}
           </div>

           {/* Botonera de Acciones sobre Carpetas y Archivos (Solo Iconos + Tooltips Estricto) */}
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
             
             {/* 🔄 Refrescar Comparación */}
             <button 
                className="btn secondary-btn small-btn" 
                onClick={() => processFiles(true, tab)}
                data-tooltip={t('matrix_tooltip_refresh') || "Actualizar Escaneo de Carpetas"}
                disabled={isProcessing}
             >
               <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', color: 'var(--accent-secondary)' }}>
                 {isProcessing ? 'hourglass_empty' : 'sync'}
               </span>
             </button>

             <div style={{ width: '1px', height: '22px', background: 'var(--border-color)', margin: '0 2px' }}></div>

             {/* ⏩ Copiar Todo a Destino */}
             <button 
                className="btn secondary-btn small-btn" 
                onClick={() => handleTransferAllToDest && handleTransferAllToDest()}
                data-tooltip="Copiar todos los archivos con diferencias o inexistentes hacia el Destino"
                disabled={isProcessing}
             >
               <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', color: '#10b981' }}>keyboard_double_arrow_right</span>
             </button>

             {/* ⏪ Copiar Todo a Origen */}
             <button 
                className="btn secondary-btn small-btn" 
                onClick={() => handleTransferAllToOrigin && handleTransferAllToOrigin()}
                data-tooltip="Copiar todos los archivos con diferencias o inexistentes hacia el Origen"
                disabled={isProcessing}
             >
               <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', color: '#3b82f6' }}>keyboard_double_arrow_left</span>
             </button>

             <div style={{ width: '1px', height: '22px', background: 'var(--border-color)', margin: '0 2px' }}></div>

             {/* 🔀 Invertir Origen y Destino */}
             <button 
                className="btn secondary-btn small-btn" 
                onClick={() => swapFolders && swapFolders()}
                data-tooltip="Invertir carpetas de Origen y Destino"
                disabled={isProcessing}
             >
               <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', color: '#0284c7' }}>swap_vert</span>
             </button>

             {/* 👁️ Mostrar solo diferencias */}
             <button 
                className={`btn ${showOnlyChanges ? 'primary-btn' : 'secondary-btn'} small-btn`} 
                onClick={() => setShowOnlyChanges(!showOnlyChanges)}
                data-tooltip={showOnlyChanges ? "Mostrando Solo Diferencias (Clic para ver todas las filas)" : "Mostrando Todas las Filas (Clic para aislar solo diferencias)"}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>difference</span>
              </button>

           </div>
        </div>

        <div className="section-card matrix-container" style={{ flex: 1, overflow: 'hidden', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', borderRadius: '8px' }}>
          
          <div className="matrix-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', padding: '6px 12px', background: 'var(--bg-tertiary)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem' }}>
            {/* Sección Izquierda: Ruta de Origen | Rutas de Destino */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
              <span><strong>{t('matrix_origin')}:</strong> <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{tab.originHandle ? tab.originHandle.name : 'N/A'}</span></span> 
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span> 
              <span><strong>{t('matrix_destinations')}:</strong> <span style={{ color: '#22c55e', fontWeight: '600' }}>{tab.processedDestSlots ? tab.processedDestSlots.filter(s => s.handle).map(s => s.handle.name).join(', ') : 'N/A'}</span></span>
            </div>

            {/* Sección Derecha: Seleccionar Todo + Botonera de Acciones por Lote (Icon-Only Buttons) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                <input 
                  type="checkbox" 
                  checked={selectedPaths.size > 0 && selectedPaths.size === filteredPaths.length}
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                />
                <span>Seleccionar Todo ({filteredPaths.length})</span>
              </label>

              {selectedPaths.size > 0 && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 'bold', marginRight: '2px' }}>
                    ({selectedPaths.size})
                  </span>

                  {/* ⏪ Copiar Seleccionados a Origen (Icon-Only) */}
                  <button 
                    className="btn secondary-btn small-btn" 
                    onClick={handleBatchTransferToOrigin} 
                    data-tooltip="Copiar seleccionados hacia el Origen"
                    style={{ height: '26px', width: '26px', padding: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '4px' }}
                    aria-label="Copiar seleccionados hacia el Origen"
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>arrow_back</span>
                  </button>

                  {/* ⏩ Copiar Seleccionados a Destino (Icon-Only) */}
                  <button 
                    className="btn secondary-btn small-btn" 
                    onClick={handleBatchTransferToDest} 
                    data-tooltip="Copiar seleccionados hacia el Destino"
                    style={{ height: '26px', width: '26px', padding: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', color: '#10b981', border: '1px solid #10b981', borderRadius: '4px' }}
                    aria-label="Copiar seleccionados hacia el Destino"
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>arrow_forward</span>
                  </button>

                  {/* 🗑️ Borrar Seleccionados de Origen (Icon-Only) */}
                  <button 
                    className="btn secondary-btn small-btn" 
                    onClick={handleBatchDeleteOrigin} 
                    data-tooltip="Eliminar seleccionados del Origen en disco local"
                    style={{ height: '26px', width: '26px', padding: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px' }}
                    aria-label="Eliminar seleccionados del Origen"
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>delete_forever</span>
                  </button>

                  {/* 🗑️ Borrar Seleccionados de Destino (Icon-Only) */}
                  <button 
                    className="btn secondary-btn small-btn" 
                    onClick={handleBatchDeleteDest} 
                    data-tooltip="Eliminar seleccionados del Destino en disco local"
                    style={{ height: '26px', width: '26px', padding: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', color: '#f87171', border: '1px solid #f87171', borderRadius: '4px' }}
                    aria-label="Eliminar seleccionados del Destino"
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>delete</span>
                  </button>

                  {/* ✖️ Desmarcar Todo */}
                  <button 
                    className="btn clear-btn small-btn" 
                    onClick={() => setSelectedPaths(new Set())} 
                    data-tooltip="Desmarcar seleccionados"
                    style={{ height: '26px', width: '26px', padding: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-tertiary)' }}
                    aria-label="Desmarcar seleccionados"
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>close</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', position: 'relative' }} onScroll={(e) => setMatrixScrollTop(e.target.scrollTop)}>
            {filteredPaths.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', minHeight: '300px' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem', opacity: 0.8 }}>👻</div>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>{t('matrix_no_files_title')}</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  No se encontraron archivos para comparar con el filtro o criterio actual. La botonera permanece 100% activa arriba.
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {filterText && (
                    <button className="btn secondary-btn" onClick={() => setFilterText('')} style={{ fontSize: '0.85rem' }}>
                      Limpiar Búsqueda ("{filterText}")
                    </button>
                  )}
                  {showOnlyChanges && (
                    <button className="btn secondary-btn" onClick={() => setShowOnlyChanges(false)} style={{ fontSize: '0.85rem' }}>
                      Mostrar Todas las Filas
                    </button>
                  )}
                  <button className="btn primary-btn" onClick={() => processFiles(true, tab)} style={{ fontSize: '0.85rem' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '1.1rem', marginRight: '5px' }}>sync</span>
                    Refrescar Comparación
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ height: `${totalHeight}px`, width: '100%', position: 'relative' }}>
                <div style={{ transform: `translateY(${paddingTop}px)` }}>
                  {visibleRowsData.map(row => {
                    if (row.type === 'folder') {
                       let needsToOrigin = false;
                       let needsToDest = false;
                       
                       const children = rowData.filter(r => r.type !== 'folder' && r.path.startsWith(row.path + '/'));
                       
                       for (const child of children) {
                           const isMissingOrig = !child.oFile;
                           const hasDiff = child.statuses.some(s => s.status === 'different');
                           const hasMissingDest = child.statuses.some(s => s.status === 'missing');
                           
                           if (isMissingOrig || hasDiff) needsToOrigin = true;
                           if (hasMissingDest || hasDiff) needsToDest = true;
                           
                           if (needsToOrigin && needsToDest) break; // Optimization
                       }

                       return (
                          <div key={'folder-'+row.path} onClick={() => toggleFolder(row.path)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: `6px 1rem 6px ${row.depth * 1.5 + 1}rem`, borderBottom: '1px solid rgba(255,255,255,0.02)', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.75rem', height: '36px', boxSizing: 'border-box' }}>
                             <div style={{display: 'flex', alignItems: 'center'}}>
                                <input 
                                  type="checkbox"
                                  checked={isFolderSelected(row.path)}
                                  onChange={(e) => toggleSelectFolder(row.path, e)}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ cursor: 'pointer', width: '15px', height: '15px', marginRight: '8px', accentColor: 'var(--accent-primary)' }}
                                />
                                <span style={{marginRight: '6px', fontSize: '0.70rem', color: 'var(--text-tertiary)'}}>{row.isCollapsed ? '▶︎' : '▼'}</span>
                                <span className="file-icon" style={{fontSize: '0.8rem', marginRight: '5px'}}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#f59e0b'}}>folder</span></span> {row.name}
                             </div>
                             <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                {needsToOrigin && <button className="btn clear-btn small-btn" onClick={(e) => handleTransferFolder(row.path, 'to_origin', e)} data-tooltip={t('matrix_tooltip_copy_folder_to_origin')}><span className="material-symbols-rounded" style={{fontSize: '1.1rem', color: '#3b82f6'}}>arrow_back</span></button>}
                                {needsToDest && <button className="btn clear-btn small-btn" onClick={(e) => handleTransferFolder(row.path, 'to_dest', e)} data-tooltip={t('matrix_tooltip_copy_folder_to_dest')}><span className="material-symbols-rounded" style={{fontSize: '1.1rem', color: '#10b981'}}>arrow_forward</span></button>}
                                <button className="btn clear-btn small-btn" onClick={(e) => handleDeleteFolder(row.path, 'origin', e)} data-tooltip="Borrar todos los archivos de esta carpeta en Origen"><span className="material-symbols-rounded" style={{fontSize: '1.1rem', color: '#ef4444'}}>delete_forever</span></button>
                                <button className="btn clear-btn small-btn" onClick={(e) => handleDeleteFolder(row.path, 'dest', e)} data-tooltip="Borrar todos los archivos de esta carpeta en Destino"><span className="material-symbols-rounded" style={{fontSize: '1.1rem', color: '#f87171'}}>delete</span></button>
                             </div>
                          </div>
                       );
                    }
                    
                    let fileColor = 'var(--text-secondary)';
                    let hasDiff = false;
                    let isMissingInOrigin = false;
                    let isMissingInAllDests = true;

                    if (!row.oFile) {
                        fileColor = '#eab308';
                        isMissingInOrigin = true;
                    } else {
                        hasDiff = row.statuses.some(s => s.status === 'different');
                        isMissingInAllDests = row.statuses.every(s => s.status === 'missing');
                        if (hasDiff) fileColor = '#ef4444';
                        else if (isMissingInAllDests) fileColor = 'var(--accent-primary)';
                        else fileColor = '#22c55e';
                    }

                    const handleFileClick = () => {
                      const targetSlotIdx = row.statuses.findIndex(s => s.handle);
                      const slotIdx = targetSlotIdx !== -1 ? targetSlotIdx : 0;
                      const s = row.statuses[slotIdx];
                      openDiffTab(row.oFile, s ? s.file : null, slotIdx);
                    };

                    return (
                      <div key={'file-'+row.path} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `4px 1rem 4px ${row.depth * 1.5 + 1.5}rem`, borderBottom: '1px solid rgba(255,255,255,0.02)', height: '36px', boxSizing: 'border-box' }}>
                        
                        <div 
                          style={{
                            color: fileColor, 
                            fontWeight: (hasDiff || isMissingInOrigin || isMissingInAllDests) ? 'bold' : 'normal',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }} 
                        >
                          <input 
                            type="checkbox"
                            checked={selectedPaths.has(row.path)}
                            onChange={(e) => toggleSelectPath(row.path, e)}
                            style={{ cursor: 'pointer', width: '15px', height: '15px', marginRight: '8px', accentColor: 'var(--accent-primary)' }}
                          />
                          <span onClick={handleFileClick} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }} data-tooltip={t('matrix_tooltip_view_diff')}>
                            <span className="file-icon" style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '5px'}}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#9ca3af'}}>insert_drive_file</span></span> {row.name}
                          </span>
                        </div>

                        <div style={{display: 'flex', gap: '15px'}}>
                          {row.statuses.map((s, i) => {
                            const isMissingDest = s.status === 'missing' && !isMissingInOrigin;
                            const isMissingOrig = isMissingInOrigin && s.file;
                            const isDiff = s.status === 'different' && !isMissingInOrigin;
                            const isIdentical = s.status === 'identical';

                            return (
                              <div key={i} style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                  {isDiff && s.diffStats && (
                                     <span 
                                         style={{ 
                                             fontSize: '10px', 
                                             fontWeight: 'bold', 
                                             color: '#10b981', 
                                             backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                                             padding: '2px 6px', 
                                             borderRadius: '4px',
                                             marginRight: '6px'
                                         }}
                                         data-tooltip={t('matrix_tooltip_diff_stats')}
                                     >
                                         +{s.diffStats.added} -{s.diffStats.deleted}
                                     </span>
                                  )}
                                  {isMissingOrig && <span style={{fontSize: '0.75rem', color: '#eab308', fontWeight: 'bold'}}>{t('matrix_missing_in_origin')}</span>}
                                  {isMissingDest && <span style={{fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 'bold'}}>{t('matrix_missing_in_dest')}</span>}
                                 
                                  <div style={{display: 'flex', gap: '4px'}}>
                                    {isMissingDest && (
                                        <>
                                          <button className="btn clear-btn small-btn" onClick={() => handleDelete(tab.originHandle || originHandle, row.path, true)} data-tooltip={t('matrix_tooltip_delete_from_origin')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#b91c1c'}}>delete_forever</span></button>
                                          <button className="btn clear-btn small-btn" onClick={() => openDiffTab(row.oFile, null, i)} data-tooltip={t('matrix_tooltip_view_comparison')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#8b5cf6'}}>search</span></button>
                                          <button className="btn clear-btn small-btn" onClick={() => handleTransfer(row.oFile, s.handle, row.path)} data-tooltip={t('matrix_tooltip_copy_to_dest')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#10b981'}}>arrow_forward</span></button>
                                        </>
                                    )}
                                    {isDiff && (
                                        <>
                                          <button className="btn clear-btn small-btn" onClick={() => handleDelete(tab.originHandle || originHandle, row.path, true)} data-tooltip={t('matrix_tooltip_delete_from_origin')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#b91c1c'}}>delete_forever</span></button>
                                          <button className="btn clear-btn small-btn" onClick={() => handleDelete(s.handle, row.path)} data-tooltip={t('matrix_tooltip_delete_from_dest')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#ef4444'}}>delete</span></button>
                                          <button className="btn clear-btn small-btn" onClick={() => handleTransfer(s.file, tab.originHandle, row.path)} data-tooltip={t('matrix_tooltip_copy_from_dest_to_origin')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#3b82f6'}}>arrow_back</span></button>
                                          <button className="btn clear-btn small-btn" onClick={() => openDiffTab(row.oFile, s.file, i)} data-tooltip={t('matrix_tooltip_view_differences')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#8b5cf6'}}>search</span></button>
                                          <button className="btn clear-btn small-btn" onClick={() => handleTransfer(row.oFile, s.handle, row.path)} data-tooltip={t('matrix_tooltip_copy_from_origin_to_dest')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#10b981'}}>arrow_forward</span></button>
                                        </>
                                    )}
                                    {isMissingOrig && (
                                        <>
                                          <button className="btn clear-btn small-btn" onClick={() => handleDelete(s.handle, row.path)} data-tooltip={t('matrix_tooltip_delete_from_dest')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#ef4444'}}>delete</span></button>
                                          <button className="btn clear-btn small-btn" onClick={() => handleTransfer(s.file, tab.originHandle, row.path)} data-tooltip={t('matrix_tooltip_copy_to_origin')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#3b82f6'}}>arrow_back</span></button>
                                          <button className="btn clear-btn small-btn" onClick={() => openDiffTab(null, s.file, i)} data-tooltip={t('matrix_tooltip_view_comparison')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#8b5cf6'}}>search</span></button>
                                        </>
                                    )}
                                    {isIdentical && (
                                        <>
                                          <button className="btn clear-btn small-btn" onClick={() => handleDelete(tab.originHandle || originHandle, row.path, true)} data-tooltip={t('matrix_tooltip_delete_from_origin')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#b91c1c'}}>delete_forever</span></button>
                                          <button className="btn clear-btn small-btn" onClick={() => handleDelete(s.handle, row.path)} data-tooltip={t('matrix_tooltip_delete_from_dest')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#ef4444'}}>delete</span></button>
                                          <button className="btn clear-btn small-btn" onClick={() => openDiffTab(row.oFile, s.file, i)} data-tooltip={t('matrix_tooltip_view_file')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#8b5cf6'}}>search</span></button>
                                        </>
                                    )}
                                  </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <NgacAdBanner position="Matrix" />
          </div>
        </div>
      </div>
    );
});
