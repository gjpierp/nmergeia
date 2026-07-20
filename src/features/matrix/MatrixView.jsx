import React, { memo, useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../app/useAppStore.js';
import { getRelativePath } from "../../utils/pathUtils.js";

export const MatrixView = memo(({ 
    tab, 
    processFiles, 
    handleTransferFolder, 
    handleDelete, 
    handleTransfer, 
    openDiffTab 
}) => {
    const { 
        filterText, setFilterText, 
        showOnlyChanges, setShowOnlyChanges, 
        isProcessing, 
        collapsedFolders, setCollapsedFolders,
        fileEqualityMap
    } = useAppStore();

    const containerRef = useRef(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(600);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleScroll = () => {
            setScrollTop(el.scrollTop);
        };

        let resizeObserver;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    setContainerHeight(entry.contentRect.height);
                }
            });
            resizeObserver.observe(el);
        }

        el.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            el.removeEventListener('scroll', handleScroll);
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, []);

    const originMap = new Map();
    if (tab.processedOrigin) {
        tab.processedOrigin.forEach(f => {
            originMap.set(getRelativePath(f.webkitRelativePath, tab.originHandle.name), f);
        });
    }
    
    const destMaps = tab.processedDestSlots ? tab.processedDestSlots.map(slot => {
        const map = new Map();
        if (slot.files) {
            slot.files.forEach(f => map.set(getRelativePath(f.webkitRelativePath, slot.handle.name), f));
        }
        return { slot, map };
    }) : [];

    const allPaths = new Set();
    for (const path of originMap.keys()) allPaths.add(path);
    for (const { map } of destMaps) {
        for (const path of map.keys()) allPaths.add(path);
    }

    let pathsArray = Array.from(allPaths);

    if (filterText) {
        pathsArray = pathsArray.filter(p => p.toLowerCase().includes(filterText.toLowerCase()));
    }

    if (pathsArray.length === 0) {
        return (
            <div className="main-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div className="section-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center', background: 'transparent', border: 'none' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.8, filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))' }}>👻</div>
                  <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.8rem' }}>No hay archivos para comparar</h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: '1.5' }}>
                     Para ver la matriz de diferencias, dirígete a la pestaña de <strong>Configuración</strong>, selecciona al menos una carpeta de Origen y otra de Destino, y presiona el botón "Procesar y Comparar".
                  </p>
               </div>
            </div>
        );
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

                if (oFile && dFile && oFile.size !== dFile.size) return true;
                return false;
           });
           return !oFile || hasDiff;
       });
    }

    const folderSet = new Set();
    pathsArray.forEach(p => {
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
    pathsArray.forEach(p => {
       allRows.push({ type: 'file', path: p, name: p.split('/').pop(), depth: p.split('/').length - 1 });
    });
    
    const sortKey = (row) => {
       const parts = row.path.split('/');
       if (row.type === 'folder') {
           return parts.map(p => '0_' + p).join('/');
       } else {
           const name = parts.pop();
           return (parts.length > 0 ? parts.map(p => '0_' + p).join('/') + '/' : '') + '1_' + name;
       }
    };

    allRows.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

    const visibleRows = allRows.filter(row => {
       const parts = row.path.split('/');
       parts.pop();
       let current = '';
       for(let part of parts) {
           current = current ? current + '/' + part : part;
           if (collapsedFolders.has(current)) return false;
       }
       return true;
    });

    const toggleFolder = (folderPath) => {
      setCollapsedFolders(prev => {
         const newSet = new Set(prev);
         if (newSet.has(folderPath)) newSet.delete(folderPath);
         else newSet.add(folderPath);
         return newSet;
      });
    };

    const rowData = visibleRows.map(row => {
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

        if (oFile.size !== dFile.size) return { status: 'different', file: dFile, handle: slot.handle };
        return { status: 'identical', file: dFile, handle: slot.handle };
      });
      return { ...row, oFile, statuses };
    });

    const ROW_HEIGHT = 36;
    const overscan = 10;
    const totalHeight = rowData.length * ROW_HEIGHT;
    const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - overscan);
    const endIndex = Math.min(rowData.length - 1, Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + overscan);
    const visibleRowsData = rowData.slice(startIndex, endIndex + 1);
    const paddingTop = startIndex * ROW_HEIGHT;

    return (
      <div className="matrix-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px 20px', overflow: 'hidden' }}>
        
        <div className="section-card" style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '10px', padding: '10px 20px'}}>
           <input 
             type="text" 
             placeholder="🔍 Buscar archivo..."
             className="input-field"
             style={{ flex: 1, padding: '12px 20px', fontSize: '1.1rem', background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-primary)', borderRadius: '12px' }}
             value={filterText}
             onChange={(e) => setFilterText(e.target.value)}
           />
           <button 
              className={`btn ${showOnlyChanges ? 'primary-btn' : 'secondary-btn'}`} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '0.5rem', width: '40px', height: '40px', borderRadius: '8px' }}
              onClick={() => setShowOnlyChanges(!showOnlyChanges)}
              data-tooltip="Ver solo archivos con diferencias"
            >
              <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>difference</span>
            </button>
           <button 
             className="btn primary-btn" 
             style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '0.5rem', width: '40px', height: '40px', borderRadius: '8px' }}
             onClick={() => processFiles(true, tab)}
             data-tooltip="Actualizar Comparación"
             disabled={isProcessing}
           >
             <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>{isProcessing ? 'hourglass_empty' : 'sync'}</span>
           </button>
        </div>

        <div className="section-card matrix-container" style={{ flex: 1, overflow: 'hidden', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', borderRadius: '8px' }}>
          
          <div className="matrix-header" style={{ display: 'flex', flexDirection: 'column', padding: '15px 1rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
              <strong>Origen:</strong> <span style={{ color: 'var(--accent-primary)' }}>{tab.originHandle ? tab.originHandle.name : 'N/A'}</span> 
              <span style={{ margin: '0 10px' }}>|</span> 
              <strong>Destino(s):</strong> <span style={{ color: '#22c55e' }}>{tab.processedDestSlots ? tab.processedDestSlots.filter(s => s.handle).map(s => s.handle.name).join(', ') : 'N/A'}</span>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>- Estructura de Archivos</div>
          </div>

          <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
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
                         <span style={{marginRight: '8px', fontSize: '0.70rem', color: 'var(--text-tertiary)'}}>{row.isCollapsed ? '▶︎' : '▼'}</span>
                         <span className="file-icon" style={{fontSize: '0.8rem', marginRight: '5px'}}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#f59e0b'}}>folder</span></span> {row.name}
                      </div>
                      <div style={{display: 'flex', gap: '10px'}}>
                         {needsToOrigin && <button className="btn clear-btn small-btn" onClick={(e) => handleTransferFolder(row.path, 'to_origin', e)} data-tooltip="Copiar toda la carpeta de Destino a Origen"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#3b82f6'}}>arrow_back</span></button>}
                         {needsToDest && <button className="btn clear-btn small-btn" onClick={(e) => handleTransferFolder(row.path, 'to_dest', e)} data-tooltip="Copiar toda la carpeta de Origen a Destino"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#10b981'}}>arrow_forward</span></button>}
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

              return (
                <div key={'file-'+row.path} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `4px 1rem 4px ${row.depth * 1.5 + 2.5}rem`, borderBottom: '1px solid rgba(255,255,255,0.02)', height: '36px', boxSizing: 'border-box' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: fileColor, fontWeight: '500' }}>
                    <span className="file-icon" style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '5px'}}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#9ca3af'}}>insert_drive_file</span></span> {row.name}
                  </div>

                  <div style={{display: 'flex', gap: '15px'}}>
                    {row.statuses.map((s, i) => {
                      const isMissingDest = s.status === 'missing' && !isMissingInOrigin;
                      // buildMatrix sometimes assigns 'different' to files missing in origin, so we isolate the logic:
                      const isMissingOrig = isMissingInOrigin && s.file;
                      const isDiff = s.status === 'different' && !isMissingInOrigin;

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
                                   data-tooltip="Líneas modificadas (Añadidas / Eliminadas)"
                               >
                                   +{s.diffStats.added} -{s.diffStats.deleted}
                               </span>
                            )}
                            {isMissingOrig && <span style={{fontSize: '0.75rem', color: '#eab308', fontWeight: 'bold'}}>Falta en Origen</span>}
                            {isMissingDest && <span style={{fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 'bold'}}>Falta en Destino</span>}
                           
                           <div style={{display: 'flex', gap: '4px'}}>
                             {isMissingDest && (
                                 <button className="btn clear-btn small-btn" onClick={() => handleTransfer(row.oFile, s.handle, row.path)} data-tooltip="Copiar a destino"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#10b981'}}>arrow_forward</span></button>
                             )}
                             {isDiff && (
                                 <>
                                   <button className="btn clear-btn small-btn" onClick={() => handleDelete(s.handle, row.path)} data-tooltip="Eliminar del destino"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#ef4444'}}>delete</span></button>
                                   <button className="btn clear-btn small-btn" onClick={() => handleTransfer(s.file, tab.originHandle, row.path)} data-tooltip="Copiar de destino a origen"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#3b82f6'}}>arrow_back</span></button>
                                   <button className="btn clear-btn small-btn" onClick={() => openDiffTab(row.oFile, s.file, i)} data-tooltip="Ver Diferencias"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#8b5cf6'}}>search</span></button>
                                   <button className="btn clear-btn small-btn" onClick={() => handleTransfer(row.oFile, s.handle, row.path)} data-tooltip="Copiar de origen a destino"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#10b981'}}>arrow_forward</span></button>
                                 </>
                             )}
                             {isMissingOrig && (
                                 <>
                                   <button className="btn clear-btn small-btn" onClick={() => handleDelete(s.handle, row.path)} data-tooltip="Eliminar del destino"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#ef4444'}}>delete</span></button>
                                   <button className="btn clear-btn small-btn" onClick={() => handleTransfer(s.file, tab.originHandle, row.path)} data-tooltip="Copiar a origen"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#3b82f6'}}>arrow_back</span></button>
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
          </div>
        </div>
      </div>
    );
});
