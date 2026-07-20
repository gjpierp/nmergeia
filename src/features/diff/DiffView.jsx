import React, { useRef, useState, Suspense } from 'react';
import { DiffEditor, Editor } from '@monaco-editor/react';
import { getRelativePath } from "../../utils/pathUtils.js";
import { PremiumLock } from '../monetization/PremiumLock.jsx';
import { apiClient } from '../../shared/lib/apiClient.js';
import * as yaml from 'js-yaml';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

const sortJsonKeys = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(sortJsonKeys);
    }
    const sortedKeys = Object.keys(obj).sort();
    const result = {};
    sortedKeys.forEach(key => {
        result[key] = sortJsonKeys(obj[key]);
    });
    return result;
};

const normalizeJson = (str) => {
    try {
        const parsed = JSON.parse(str);
        const sorted = sortJsonKeys(parsed);
        return JSON.stringify(sorted, null, 2);
    } catch (e) {
        return str;
    }
};

const normalizeYaml = (str) => {
    try {
        const parsed = yaml.load(str);
        const sorted = sortJsonKeys(parsed);
        return yaml.dump(sorted, { indent: 2 });
    } catch (e) {
        return str;
    }
};

const normalizeXml = (str) => {
    try {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_"
        });
        const builder = new XMLBuilder({
            ignoreAttributes: false,
            attributeNamePrefix: "@_",
            format: true,
            indentBy: '  '
        });
        const parsed = parser.parse(str);
        const sorted = sortJsonKeys(parsed);
        return builder.build(sorted);
    } catch (e) {
        return str;
    }
};

const normalizeWhitespace = (str) => {
    if (typeof str !== 'string') return str;
    return str
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+$/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};

export const DiffView = ({
    tab,
    tabs,
    setTabs,
    originHandle,
    destSlots,
    originPath,
    fileEqualityMap,
    closeTab,
    addToast,
    appTheme,
    showModal,
    openDiffTab,
    saveFile,
    handleDelete
}) => {
    const diffEditorRef = useRef(null);
    const monacoRef = useRef(null);
    const pendingNavigationRef = useRef(null);
    const [diffContent, setDiffContent] = useState(null);
    const [normalizeEnabled, setNormalizeEnabled] = useState(false);

    // Estados del Asistente Híbrido de Fusión
    const [assistantTab, setAssistantTab] = useState('traditional'); // 'traditional' | 'ai'
    const [aiProvider, setAiProvider] = useState(() => localStorage.getItem('nmerge_ai_provider') || 'ollama');
    const [aiApiKey, setAiApiKey] = useState(() => localStorage.getItem('nmerge_ai_apikey') || '');
    const [aiModel, setAiModel] = useState(() => localStorage.getItem('nmerge_ai_model') || 'qwen2.5:1.5b');
    const [aiStatusMessage, setAiStatusMessage] = useState('');
    const [aiResult, setAiResult] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [isAiConfigured, setIsAiConfigured] = useState(() => {
        const provider = localStorage.getItem('nmerge_ai_provider') || 'ollama';
        const key = localStorage.getItem('nmerge_ai_apikey') || '';
        return provider === 'ollama' || !!key;
    });
    const [showAiConfig, setShowAiConfig] = useState(!isAiConfigured);

    const titleLower = (tab.title || tab.filePath || '').toLowerCase();
    const isJson = titleLower.endsWith('.json');
    const isYaml = titleLower.endsWith('.yaml') || titleLower.endsWith('.yml');
    const isXml = titleLower.endsWith('.xml') || titleLower.endsWith('.html');
    const isNormalizable = isJson || isYaml || isXml || /\.(js|jsx|ts|tsx|css|py|sh|bat|txt|md)$/.test(titleLower);

    const applyNormalization = (str) => {
        if (!normalizeEnabled) return str;
        if (isJson) return normalizeJson(str);
        if (isYaml) return normalizeYaml(str);
        if (isXml) return normalizeXml(str);
        return normalizeWhitespace(str);
    };

    const originalVal = applyNormalization(tab.original) || '';
    const modifiedVal = applyNormalization(tab.modified) || '';

    const handleCallAI = async () => {
        if (!diffContent) return;
        setAiLoading(true);
        setAiStatusMessage('Analizando diferencias y fusionando con IA...');
        setAiResult('');
        try {
            const res = await apiClient.callAIResolver({
                provider: aiProvider,
                apiKey: aiProvider === 'gemini' ? aiApiKey : '',
                model: aiModel,
                originalText: diffContent.origin,
                modifiedText: diffContent.dest
            });
            if (res.success) {
                setAiResult(res.text);
                setAiStatusMessage('Sugerencia generada con éxito.');
            } else {
                setAiStatusMessage(res.message);
            }
        } catch (e) {
            setAiStatusMessage('Error al conectar con la API: ' + e.message);
        } finally {
            setAiLoading(false);
        }
    };

    const applyAiResolution = () => {
        if (!diffEditorRef.current || !monacoRef.current || !aiResult) return;
        const modEditor = diffEditorRef.current.getModifiedEditor();
        const selection = modEditor.getSelection();
        if (!selection) return;

        const range = new monacoRef.current.Range(
            selection.startLineNumber,
            selection.startColumn,
            selection.endLineNumber,
            selection.endColumn
        );

        const op = {
            identifier: { major: 1, minor: 1 },
            range: range,
            text: aiResult,
            forceMoveMarkers: true
        };
        modEditor.executeEdits("ai-merge", [op]);
        addToast("Fusión de IA aplicada correctamente", "success");
    };

    const handleSaveAiConfig = (key, provider, model) => {
        setAiApiKey(key);
        setAiProvider(provider);
        setAiModel(model);
        localStorage.setItem('nmerge_ai_apikey', key);
        localStorage.setItem('nmerge_ai_provider', provider);
        localStorage.setItem('nmerge_ai_model', model);
        setIsAiConfigured(true);
        setShowAiConfig(false);
        addToast("Configuración de IA guardada con éxito", "success");
    };

    const navigateDiff = (direction) => {
        if (!diffEditorRef.current) return;
        const changes = diffEditorRef.current.getLineChanges();
        if (!changes || changes.length === 0) return;
        
        const modEditor = diffEditorRef.current.getModifiedEditor();
        const currentLine = modEditor.getPosition().lineNumber;
        
        let targetChange = null;
        if (direction === 'first') {
            targetChange = changes[0];
        } else if (direction === 'last') {
            targetChange = changes[changes.length - 1];
        } else if (direction === 'current') {
            targetChange = changes.find(c => {
               const modStart = c.modifiedStartLineNumber === 0 ? c.modifiedStartLineNumber + 1 : c.modifiedStartLineNumber;
               const modEnd = c.modifiedEndLineNumber === 0 ? c.modifiedStartLineNumber + 1 : c.modifiedEndLineNumber;
               return currentLine >= modStart && currentLine <= modEnd;
            });
            if (!targetChange) targetChange = changes.find(c => (c.modifiedStartLineNumber || 1) >= currentLine) || changes[0];
        } else if (direction === 'next') {
            targetChange = changes.find(c => (c.modifiedStartLineNumber || 1) > currentLine);
            if (!targetChange) targetChange = changes[0];
        } else {
            targetChange = [...changes].reverse().find(c => (c.modifiedStartLineNumber || 1) < currentLine);
            if (!targetChange) targetChange = changes[changes.length - 1];
        }
        
        if (targetChange) {
            const line = targetChange.modifiedStartLineNumber || targetChange.originalStartLineNumber || 1;
            modEditor.setPosition({ lineNumber: line, column: 1 });
            modEditor.revealLineInCenter(line);
            diffEditorRef.current.getOriginalEditor().revealLineInCenter(line);
        }
    };

    const transferCurrentDiff = (direction) => {
        if (!diffEditorRef.current) return;
        const changes = diffEditorRef.current.getLineChanges();
        if (!changes || changes.length === 0) return;
    
        const origEditor = diffEditorRef.current.getOriginalEditor();
        const modEditor = diffEditorRef.current.getModifiedEditor();
        const currentLine = modEditor.getPosition().lineNumber;
    
        let currentChange = changes.find(c => {
           const modStart = c.modifiedStartLineNumber === 0 ? c.modifiedStartLineNumber + 1 : c.modifiedStartLineNumber;
           const modEnd = c.modifiedEndLineNumber === 0 ? c.modifiedStartLineNumber + 1 : c.modifiedEndLineNumber;
           return currentLine >= modStart && currentLine <= modEnd;
        });
        if (!currentChange) {
            currentChange = changes.find(c => (c.modifiedStartLineNumber || 1) >= currentLine) || changes[0];
        }
        
        const origModel = origEditor.getModel();
        const modModel = modEditor.getModel();
    
        if (direction === 'to_dest') {
            const origLines = [];
            if (currentChange.originalEndLineNumber > 0) {
                for (let i = currentChange.originalStartLineNumber; i <= currentChange.originalEndLineNumber; i++) {
                    origLines.push(origModel.getLineContent(i));
                }
            }
            
            let range;
            let text = origLines.join('\n');
            if (currentChange.modifiedEndLineNumber === 0) {
                range = { startLineNumber: currentChange.modifiedStartLineNumber + 1, startColumn: 1, endLineNumber: currentChange.modifiedStartLineNumber + 1, endColumn: 1 };
                text = text + '\n';
            } else {
                range = {
                    startLineNumber: currentChange.modifiedStartLineNumber, startColumn: 1,
                    endLineNumber: currentChange.modifiedEndLineNumber, endColumn: modModel.getLineMaxColumn(currentChange.modifiedEndLineNumber)
                };
            }
            modEditor.executeEdits("diff", [{ range, text }]);
        } else {
            const modLines = [];
            if (currentChange.modifiedEndLineNumber > 0) {
                for (let i = currentChange.modifiedStartLineNumber; i <= currentChange.modifiedEndLineNumber; i++) {
                    modLines.push(modModel.getLineContent(i));
                }
            }
            
            let range;
            let text = modLines.join('\n');
            if (currentChange.originalEndLineNumber === 0) {
                range = { startLineNumber: currentChange.originalStartLineNumber + 1, startColumn: 1, endLineNumber: currentChange.originalStartLineNumber + 1, endColumn: 1 };
                text = text + '\n';
            } else {
                range = {
                    startLineNumber: currentChange.originalStartLineNumber, startColumn: 1,
                    endLineNumber: currentChange.originalEndLineNumber, endColumn: origModel.getLineMaxColumn(currentChange.originalEndLineNumber)
                };
            }
            origEditor.executeEdits("diff", [{ range, text }]);
        }
        
        pendingNavigationRef.current = 'next';
    };
  
    const transferAllDiffs = (direction) => {
        if (!diffEditorRef.current) return;
        const origEditor = diffEditorRef.current.getOriginalEditor();
        const modEditor = diffEditorRef.current.getModifiedEditor();
        
        const origModel = origEditor.getModel();
        const modModel = modEditor.getModel();
  
        if (direction === 'to_dest') {
            const text = origModel.getValue();
            const fullRange = modModel.getFullModelRange();
            modEditor.executeEdits("automerge", [{ range: fullRange, text }]);
        } else {
            const text = modModel.getValue();
            const fullRange = origModel.getFullModelRange();
            origEditor.executeEdits("automerge", [{ range: fullRange, text }]);
        }
    };
  
    const handleUndo = () => {
        if (!diffEditorRef.current) return;
        diffEditorRef.current.getModifiedEditor().trigger('keyboard', 'undo', null);
        diffEditorRef.current.getOriginalEditor().trigger('keyboard', 'undo', null);
    };
  
    const handleRedo = () => {
        if (!diffEditorRef.current) return;
        diffEditorRef.current.getModifiedEditor().trigger('keyboard', 'redo', null);
        diffEditorRef.current.getOriginalEditor().trigger('keyboard', 'redo', null);
    };

    const handleSaveAndNext = async (isOriginFile) => {
        const handle = isOriginFile ? originHandle : destSlots[tab.destSlotIdx]?.handle;
        const content = isOriginFile ? tab.original : tab.modified;
        await saveFile(handle, tab.filePath, false, content, true, tab.id, isOriginFile);
        
        const matrixTab = tabs.find(t => t.type === 'matrix');
        if (matrixTab) {
            let allFiles = new Set([
                ...matrixTab.processedOrigin.map(f => getRelativePath(f.webkitRelativePath, matrixTab.originHandle.name)),
                ...matrixTab.processedDestSlots.flatMap(slot => slot.handle ? slot.files.map(f => getRelativePath(f.webkitRelativePath, slot.handle.name)) : [])
            ]);
            let sortedFiles = Array.from(allFiles).sort();
            let currentIndex = sortedFiles.indexOf(tab.filePath);
            
            let nextFile = null;
            for (let i = currentIndex + 1; i < sortedFiles.length; i++) {
                const path = sortedFiles[i];
                const oFile = matrixTab.processedOrigin.find(f => getRelativePath(f.webkitRelativePath, matrixTab.originHandle.name) === path);
                const slot = matrixTab.processedDestSlots[0];
                if (slot && slot.handle) {
                    const dFile = slot.files.find(f => getRelativePath(f.webkitRelativePath, slot.handle.name) === path);
                    let isDiff = (!oFile && dFile) || (oFile && dFile && oFile.size !== dFile.size);
                    if (!isDiff && oFile && dFile) {
                        const key = `${slot.id}-${path}`;
                        const eq = fileEqualityMap[key];
                        const status = typeof eq === 'object' ? eq.status : eq;
                        if (status === 'different') isDiff = true;
                    }
                    if (isDiff) {
                        nextFile = { oFile, dFile, slotIdx: 0 };
                        break;
                    }
                }
            }
            if (nextFile) {
                closeTab(tab.id);
                addToast("Guardado exitoso. Abriendo siguiente archivo con diferencias...", "success");
                openDiffTab(nextFile.oFile, nextFile.dFile, nextFile.slotIdx);
            } else {
                closeTab(tab.id);
                addToast("Guardado exitosamente. No hay más diferencias.", "success");
            }
        }
    };

    if (tab.isBackendFile) {
        return (
          <div className="editor-screen" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div className="editor-header" style={{flexShrink: 0, display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)'}}>
               <h3 style={{color: 'var(--text-primary)'}}>{tab.title}</h3>
               <div style={{display: 'flex', gap: '10px'}}>
                   {tab.originHandle && tab.destHandle && (
                       <>
                         <button className="btn secondary-btn small-btn" onClick={() => saveFile(tab.originHandle, tab.filePath, false, tab.modified, false, tab.id)} data-tooltip="Copiar código actual al archivo de Origen"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#3b82f6'}}>arrow_back</span></button>
                         <button className="btn secondary-btn small-btn" onClick={() => saveFile(tab.destHandle, tab.filePath, false, tab.original, false, tab.id, false)} data-tooltip="Copiar código actual al archivo de Destino"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#10b981'}}>arrow_forward</span></button>
                       </>
                   )}
                   <button 
                      className="btn primary-btn small-btn" 
                      data-tooltip="Guardar archivo actual"
                      disabled={tab.modified === tab.initialModified}
                      onClick={() => { const liveValue = diffEditorRef.current ? diffEditorRef.current.getModifiedEditor().getValue() : tab.modified; saveFile(tab.destHandle || null, tab.filePath, tab.isBackendFile, liveValue, false, tab.id); }}
                   >
                      <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>save</span>
                   </button>
               </div>
            </div>
            <textarea
               style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  width: '100%', 
                  background: 'var(--bg-primary)', 
                  color: 'var(--text-primary)', 
                  fontFamily: '"Fira Code", monospace', 
                  fontSize: '0.95rem',
                  padding: '1.5rem', 
                  border: 'none', 
                  outline: 'none',
                  resize: 'none',
                  lineHeight: '1.5'
               }}
               value={tab.modified}
                 onChange={e => {
                    setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, modified: e.target.value } : t));
                 }}
              />
          </div>
        );
    }

    const destSlot = destSlots[tab.destSlotIdx];
    const destDirHandle = destSlot ? destSlot.handle : null;

    const extension = tab.filePath.split('.').pop().toLowerCase();
    const isDocBinary = ['pdf', 'docx', 'xlsx', 'xls', 'zip', 'pem', 'crt', 'key', 'jpg', 'jpeg', 'png'].includes(extension);

    const getLanguage = (filename) => {
        if(!filename) return "plaintext";
        const ext = filename.split('.').pop().toLowerCase();
        switch(ext) {
          case 'js': case 'jsx': return 'javascript';
          case 'ts': case 'tsx': return 'typescript';
          case 'json': return 'json';
          case 'html': case 'htm': return 'html';
          case 'css': return 'css';
          case 'md': return 'markdown';
          case 'py': return 'python';
          case 'java': return 'java';
          case 'c': case 'cpp': case 'h': case 'hpp': return 'cpp';
          case 'cs': return 'csharp';
          case 'sh': case 'bash': return 'shell';
          case 'yml': case 'yaml': return 'yaml';
          case 'xml': return 'xml';
          case 'sql': return 'sql';
          default: return 'plaintext';
        }
    };

    return (
      <div className="editor-screen" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div className="editor-header" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '1rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)'}}>
           
           <div style={{ display: 'flex', width: '100%', marginBottom: '10px' }}>
               <div style={{ flex: 1, paddingRight: '10px', overflow: 'hidden' }}>
                   <strong style={{color: 'var(--accent-secondary)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}} title={`${originPath}/${tab.filePath}`}>
                      Origen: {originPath}/{tab.filePath}
                  </strong>
               </div>
               <div style={{ flex: 1, paddingLeft: '20px', borderLeft: '1px solid var(--border-color)', overflow: 'hidden' }}>
                   <strong style={{color: '#a78bfa', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}} title={destSlot ? `${destSlot.path}/${tab.filePath}` : 'Desconocido'}>
                      Destino: {destSlot ? `${destSlot.path}/${tab.filePath}` : 'Desconocido'}
                  </strong>
               </div>
           </div>
           
           <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '0px'}}>
                  <button className="btn clear-btn small-btn" data-tooltip="Eliminar del Origen" disabled={isDocBinary} onClick={() => {
                      handleDelete(originHandle, tab.filePath, true);
                  }}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#ef4444'}}>delete</span></button>
                  <button className="btn clear-btn small-btn" data-tooltip="Descartar Cambios" 
                      disabled={isDocBinary || tab.original === tab.initialOriginal}
                      onClick={() => {
                          setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, original: t.initialOriginal } : t));
                      }}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>close</span></button>
                  <button className="btn primary-btn small-btn" data-tooltip="Guardar Origen y Continuar" 
                      disabled={isDocBinary || tab.original === tab.initialOriginal}
                      onClick={() => handleSaveAndNext(true)}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>save</span></button>
                  <button className="btn secondary-btn small-btn" data-tooltip="Clonar de Destino a Origen" disabled={isDocBinary} onClick={() => {
                      saveFile(originHandle, tab.filePath, false, tab.modified, false, tab.id, true);
                      setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, original: tab.modified, initialOriginal: tab.modified } : t));
                  }}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#3b82f6'}}>arrow_back</span></button>
               </div>
               
               <div style={{display: 'flex', gap: '0px', margin: '0 10px'}}>

                    <button className="btn secondary-btn small-btn" disabled={isDocBinary} onClick={() => {
                        setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, modified: t.initialModified, original: t.initialOriginal } : t));
                    }} data-tooltip="Revertir a estado inicial (Descartar cambios no guardados)"><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>restore</span></button>
                    <div style={{width: '1px', background: 'var(--border-color)', margin: '0 5px'}}></div>

                     <button className="btn secondary-btn small-btn" disabled={isDocBinary} onClick={handleUndo} data-tooltip="Deshacer (Undo)"><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>undo</span></button>
                     <button className="btn secondary-btn small-btn" disabled={isDocBinary} onClick={handleRedo} data-tooltip="Rehacer (Redo)"><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>redo</span></button>
                     <div style={{width: '1px', background: 'var(--border-color)', margin: '0 5px'}}></div>
                                      {isNormalizable && (
                         <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer', marginRight: '10px', userSelect: 'none' }}>
                             <input 
                                 type="checkbox" 
                                 checked={normalizeEnabled} 
                                 onChange={(e) => setNormalizeEnabled(e.target.checked)} 
                                 style={{ cursor: 'pointer' }}
                             />
                             <span>
                                 {isJson ? 'Normalizar JSON' : isYaml ? 'Normalizar YAML' : isXml ? 'Normalizar XML' : 'Limpiar Espacios'}
                             </span>
                         </label>
                     )}
                    <div className="diff-headers">
                    <PremiumLock>
                    <button className="btn secondary-btn small-btn" disabled={isDocBinary} onClick={() => transferAllDiffs('to_origin')} data-tooltip="Autocombinar TODO hacia Origen"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#f59e0b'}}>keyboard_double_arrow_left</span></button>
                    </PremiumLock>
                    <span>{originPath || "Origen"}</span>
                    <span>vs</span>
                    <span>{destSlots[0]?.path || "Destino"}</span>
                    <PremiumLock>
                    <button className="btn secondary-btn small-btn" disabled={isDocBinary} onClick={() => transferAllDiffs('to_dest')} data-tooltip="Autocombinar TODO hacia Destino"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#f59e0b'}}>keyboard_double_arrow_right</span></button>
                    </PremiumLock>
                    </div>
                    <div style={{width: '1px', background: 'var(--border-color)', margin: '0 5px'}}></div>
                    <button className="btn secondary-btn small-btn" onClick={() => navigateDiff('first')} data-tooltip="Primera Diferencia"><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>first_page</span></button>
                    <button className="btn secondary-btn small-btn" onClick={() => navigateDiff('prev')} data-tooltip="Diferencia Anterior"><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>keyboard_arrow_up</span></button>
                    <button className="btn secondary-btn small-btn" onClick={() => navigateDiff('current')} data-tooltip="Diferencia Actual"><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>place</span></button>
                    <button className="btn secondary-btn small-btn" onClick={() => navigateDiff('next')} data-tooltip="Siguiente Diferencia"><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>keyboard_arrow_down</span></button>
                    <button className="btn secondary-btn small-btn" onClick={() => navigateDiff('last')} data-tooltip="Última Diferencia"><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>last_page</span></button>
                    <div style={{width: '1px', background: 'var(--border-color)', margin: '0 5px'}}></div>
                    <button className="btn secondary-btn small-btn" disabled={isDocBinary} onClick={() => transferCurrentDiff('to_origin')} data-tooltip="Copiar bloque seleccinado a Origen y continuar"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#3b82f6'}}>subdirectory_arrow_left</span></button>
                    <button className="btn secondary-btn small-btn" disabled={isDocBinary} onClick={() => transferCurrentDiff('to_dest')} data-tooltip="Copiar bloque seleccinado a Destino y continuar"><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#10b981'}}>subdirectory_arrow_right</span></button>
                </div>
               
               <div style={{display: 'flex', alignItems: 'center', gap: '0px'}}>
                  <button className="btn secondary-btn small-btn" data-tooltip="Clonar de Origen a Destino" disabled={isDocBinary} onClick={() => {
                      saveFile(destDirHandle, tab.filePath, false, tab.original, false, tab.id, false);
                      setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, modified: tab.original, initialModified: tab.original } : t));
                  }}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#10b981'}}>arrow_forward</span></button>
                  <button className="btn primary-btn small-btn" data-tooltip="Guardar Destino y Continuar" 
                      disabled={isDocBinary || tab.modified === tab.initialModified}
                      onClick={() => handleSaveAndNext(false)}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>save</span></button>
                  <button className="btn clear-btn small-btn" data-tooltip="Descartar Cambios" 
                      disabled={isDocBinary || tab.modified === tab.initialModified}
                      onClick={() => {
                          setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, modified: t.initialModified } : t));
                      }}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>close</span></button>
                  <button className="btn clear-btn small-btn" data-tooltip="Eliminar del Destino" disabled={isDocBinary} onClick={() => {
                      handleDelete(destDirHandle, tab.filePath, false);
                  }}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#ef4444'}}>delete</span></button>
               </div>
           </div>

        </div>
        {isDocBinary && (
            <div style={{ flexShrink: 0, background: 'rgba(245, 158, 11, 0.1)', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', padding: '8px 15px', color: '#f59e0b', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>warning</span>
              <span>Comparación de documento binario activa (Modo Lectura). Los cambios o transferencias de bloques no están disponibles en este formato.</span>
            </div>
         )}
         <div style={{ flex: 1, display: 'flex', minHeight: 0, width: '100%', overflow: 'auto' }}>
            <div style={{ 
                height: '100%', 
                minWidth: tab.destValues && tab.destValues.length > 1 
                    ? `${(tab.destValues.length + 1) * 460}px` 
                    : '920px', 
                display: 'flex', 
                flexDirection: 'column',
                flex: 1
            }}>
                <Suspense fallback={<div style={{padding: '20px', color: 'var(--text-secondary)'}}>Cargando editor...</div>}>
                    {tab.destValues && tab.destValues.length > 1 ? (
                        <div style={{ display: 'flex', height: '100%', width: '100%', gap: '15px' }}>
                            <div style={{ flex: '1 0 460px', display: 'flex', flexDirection: 'column', height: '100%', minWidth: '460px' }}>
                                <div style={{ padding: '8px 12px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>Origen: {originPath}</span>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button className="btn clear-btn small-btn" disabled={isDocBinary || tab.original === tab.initialOriginal} onClick={() => {
                                            setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, original: t.initialOriginal } : t));
                                        }} data-tooltip="Revertir Origen"><span className="material-symbols-rounded" style={{fontSize: '1rem'}}>restore</span></button>
                                        <button className="btn clear-btn small-btn" disabled={isDocBinary} onClick={() => {
                                            handleDelete(originHandle, tab.filePath, true);
                                        }} data-tooltip="Eliminar de Origen"><span className="material-symbols-rounded" style={{fontSize: '1rem', color: '#ef4444'}}>delete</span></button>
                                    </div>
                                </div>
                                <Editor
                                    height="100%"
                                    value={originalVal}
                                    language={getLanguage(tab.title)}
                                    theme={appTheme === 'dark' ? 'vs-dark' : 'vs'}
                                    options={{ readOnly: isDocBinary, minimap: { enabled: false }, wordWrap: 'off', automaticLayout: true }}
                                    onChange={(val) => {
                                        setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, original: val || '' } : t));
                                    }}
                                />
                            </div>
                            {tab.destValues.map((val, idx) => {
                                const slot = destSlots[idx];
                                const slotPath = slot ? slot.path : `Destino ${idx + 1}`;
                                const isDirty = val !== (tab.initialDestValues ? tab.initialDestValues[idx] : '');
                                return (
                                    <div key={idx} style={{ flex: '1 0 460px', display: 'flex', flexDirection: 'column', height: '100%', minWidth: '460px', borderLeft: '1px solid var(--border-color)' }}>
                                        <div style={{ padding: '8px 12px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#a78bfa' }}>{slotPath}</span>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button className="btn clear-btn small-btn" disabled={isDocBinary || !isDirty} onClick={() => {
                                                    setTabs(prev => prev.map(t => {
                                                        if (t.id === tab.id) {
                                                            const newVals = [...t.destValues];
                                                            newVals[idx] = t.initialDestValues[idx] || '';
                                                            return { ...t, destValues: newVals, modified: idx === t.destSlotIdx ? t.initialDestValues[idx] || '' : t.modified };
                                                        }
                                                        return t;
                                                    }));
                                                }} data-tooltip="Revertir"><span className="material-symbols-rounded" style={{fontSize: '1rem'}}>restore</span></button>
                                                <button className="btn primary-btn small-btn" disabled={isDocBinary || !isDirty} onClick={() => {
                                                    saveFile(slot.handle, tab.filePath, false, val, false, tab.id, false);
                                                }} data-tooltip="Guardar"><span className="material-symbols-rounded" style={{fontSize: '1rem'}}>save</span></button>
                                                <button className="btn clear-btn small-btn" disabled={isDocBinary} onClick={() => {
                                                    handleDelete(slot.handle, tab.filePath, false);
                                                }} data-tooltip="Eliminar de Destino"><span className="material-symbols-rounded" style={{fontSize: '1rem', color: '#ef4444'}}>delete</span></button>
                                            </div>
                                        </div>
                                        <Editor
                                            height="100%"
                                            value={val}
                                            language={getLanguage(tab.title)}
                                            theme={appTheme === 'dark' ? 'vs-dark' : 'vs'}
                                            options={{ readOnly: isDocBinary, minimap: { enabled: false }, wordWrap: 'off', automaticLayout: true }}
                                            onChange={(newVal) => {
                                                setTabs(prev => prev.map(t => {
                                                    if (t.id === tab.id) {
                                                        const newVals = [...t.destValues];
                                                        newVals[idx] = newVal || '';
                                                        return { ...t, destValues: newVals, modified: idx === t.destSlotIdx ? newVal || '' : t.modified };
                                                    }
                                                    return t;
                                                }));
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <DiffEditor
                            height="100%"
                            original={originalVal}
                            modified={modifiedVal}
                            language={getLanguage(tab.title)}
                            theme={appTheme === 'dark' ? 'vs-dark' : 'vs'}
                            options={{
                                renderSideBySide: true,
                                readOnly: isDocBinary,
                                originalEditable: !isDocBinary,
                                minimap: { enabled: true, renderCharacters: false, scale: 0.75 }, wordWrap: 'off',
                                automaticLayout: true
                            }}
                            onMount={(editor, monaco) => {
                                diffEditorRef.current = editor;
                                monacoRef.current = monaco;

                                editor.getModifiedEditor().addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                                    saveFile(destDirHandle, tab.filePath, false, editor.getModifiedEditor().getValue(), false, tab.id, false);
                                });

                                editor.getOriginalEditor().addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                                    saveFile(originHandle, tab.filePath, false, editor.getOriginalEditor().getValue(), false, tab.id, true);
                                });

                                const updateSelectedDiffFromEditor = (activeSubEditor, isModifiedSide) => {
                                    const changes = editor.getLineChanges();
                                    if (!changes || changes.length === 0) {
                                        setDiffContent(null);
                                        return;
                                    }
                                    
                                    const pos = activeSubEditor.getPosition();
                                    if (!pos) return;
                                    
                                    const currentLine = pos.lineNumber;
                                    
                                    const activeChange = changes.find(change => {
                                        if (isModifiedSide) {
                                            return currentLine >= change.modifiedStartLineNumber && currentLine <= (change.modifiedEndLineNumber || change.modifiedStartLineNumber);
                                        } else {
                                            return currentLine >= change.originalStartLineNumber && currentLine <= (change.originalEndLineNumber || change.originalStartLineNumber);
                                        }
                                    });
                                    
                                    if (activeChange) {
                                        const origModel = editor.getOriginalEditor().getModel();
                                        const modModel = editor.getModifiedEditor().getModel();
                                        
                                        const oLines = [];
                                        const mLines = [];
                                        
                                        if (activeChange.originalEndLineNumber > 0) {
                                            for(let i = activeChange.originalStartLineNumber; i <= activeChange.originalEndLineNumber; i++) oLines.push(origModel.getLineContent(i));
                                        }
                                        if (activeChange.modifiedEndLineNumber > 0) {
                                            for(let i = activeChange.modifiedStartLineNumber; i <= activeChange.modifiedEndLineNumber; i++) mLines.push(modModel.getLineContent(i));
                                        }
                                        
                                        setDiffContent({ origin: oLines.join('\n'), dest: mLines.join('\n') });
                                    } else {
                                        setDiffContent(null);
                                    }
                                };

                                const updateSelectedDiff = () => updateSelectedDiffFromEditor(editor.getModifiedEditor(), true);

                                editor.getModifiedEditor().onDidChangeCursorSelection(updateSelectedDiff);
                                editor.getOriginalEditor().onDidChangeCursorSelection(() => updateSelectedDiffFromEditor(editor.getOriginalEditor(), false));
                                
                                editor.onDidUpdateDiff(() => {
                                    if (pendingNavigationRef.current) {
                                        const action = pendingNavigationRef.current;
                                        pendingNavigationRef.current = null;
                                        navigateDiff(action);
                                    }
                                    updateSelectedDiff();
                                });

                                editor.getModifiedEditor().onDidChangeModelContent(() => {
                                    const val = editor.getModifiedEditor().getValue();
                                    setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, modified: val } : t));
                                });
                                editor.getOriginalEditor().onDidChangeModelContent(() => {
                                    const val = editor.getOriginalEditor().getValue();
                                    setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, original: val } : t));
                                });
                            }}
                        />
                    )}
                </Suspense>
            </div>
        </div>
        {diffContent && (
             <div style={{ flexShrink: 0, background: 'var(--bg-secondary)', padding: '15px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '15px', minHeight: '300px' }}>
                {/* Selector de Pestañas del Asistente */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '10px', paddingBottom: '10px' }}>
                    <button 
                        className={`btn ${assistantTab === 'traditional' ? 'primary-btn' : 'secondary-btn'} small-btn`}
                        onClick={() => setAssistantTab('traditional')}
                        style={{ height: '32px', borderRadius: '4px' }}
                    >
                        ⚡ Fusión Tradicional (Myers LCS)
                    </button>
                    <button 
                        className={`btn ${assistantTab === 'ai' ? 'primary-btn' : 'secondary-btn'} small-btn`}
                        onClick={() => setAssistantTab('ai')}
                        style={{ height: '32px', borderRadius: '4px' }}
                    >
                        🤖 Asistente de IA (Híbrido)
                    </button>
                </div>

                {/* Contenido Tradicional */}
                {assistantTab === 'traditional' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Líneas de Origen seleccionadas:</span>
                                <pre style={{textAlign: 'left', fontFamily: 'monospace', fontSize:'0.85rem', whiteSpace: 'pre', overflowX: 'auto', color: 'var(--accent-secondary)', margin: '0', background: 'rgba(0,0,0,0.3)', padding: '12px 15px', borderRadius: '4px', borderLeft: '4px solid var(--accent-secondary)'}}>{diffContent.origin}</pre>
                            </div>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Líneas de Destino seleccionadas:</span>
                                <pre style={{textAlign: 'left', fontFamily: 'monospace', fontSize:'0.85rem', whiteSpace: 'pre', overflowX: 'auto', color: '#a78bfa', margin: '0', background: 'rgba(0,0,0,0.3)', padding: '12px 15px', borderRadius: '4px', borderLeft: '4px solid #a78bfa'}}>{diffContent.dest}</pre>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                            <button 
                                className="btn secondary-btn small-btn"
                                onClick={() => transferCurrentDiff('to_dest')}
                                style={{ height: '34px', color: '#10b981', border: '1px solid #10b981' }}
                            >
                                <span className="material-symbols-rounded" style={{ marginRight: '5px', fontSize: '1.1rem' }}>arrow_forward</span>
                                Reemplazar con bloque de Origen
                            </button>
                            <button 
                                className="btn secondary-btn small-btn"
                                onClick={() => transferCurrentDiff('to_origin')}
                                style={{ height: '34px', color: '#3b82f6', border: '1px solid #3b82f6' }}
                            >
                                <span className="material-symbols-rounded" style={{ marginRight: '5px', fontSize: '1.1rem' }}>arrow_back</span>
                                Reemplazar con bloque de Destino
                            </button>
                        </div>
                    </div>
                )}

                {/* Contenido Asistente de IA */}
                {assistantTab === 'ai' && (
                    <div style={{ display: 'flex', gap: '15px', textAlign: 'left' }}>
                        {/* Pill de configuración activa o bloque editor de ajustes */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', borderRight: '1px solid var(--border-color)', paddingRight: '15px' }}>
                             {isAiConfigured && !showAiConfig ? (
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '10px 12px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>
                                     <span>Activo: <strong>{aiProvider === 'ollama' ? `Ollama (${aiModel})` : 'Gemini Cloud'}</strong></span>
                                     <button 
                                         className="btn secondary-btn" 
                                         onClick={() => setShowAiConfig(true)}
                                         style={{ height: '24px', padding: '0 8px', fontSize: '0.7rem', borderRadius: '4px' }}
                                     >
                                         🔧 Actualizar
                                     </button>
                                 </div>
                             ) : (
                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                     <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                         <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Proveedor:</span>
                                         <select 
                                             value={aiProvider} 
                                             onChange={(e) => setAiProvider(e.target.value)} 
                                             className="input-field"
                                             style={{ height: '28px', fontSize: '0.75rem', padding: '2px 5px', width: '130px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }}
                                         >
                                             <option value="ollama">Ollama (Local)</option>
                                             <option value="gemini">Gemini API (Nube)</option>
                                         </select>
                                         {isAiConfigured && (
                                             <button 
                                                 className="btn secondary-btn" 
                                                 onClick={() => setShowAiConfig(false)}
                                                 style={{ height: '28px', padding: '0 8px', fontSize: '0.7rem', borderRadius: '4px' }}
                                             >
                                                 Cancelar
                                             </button>
                                         )}
                                     </div>

                                     {/* Tutorial & API Key Input */}
                                     <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                         {aiProvider === 'ollama' ? (
                                             <div>
                                                 <strong style={{ color: 'var(--text-primary)' }}>Guía de Configuración de Ollama:</strong>
                                                 <ol style={{ margin: '5px 0 0 15px', padding: 0 }}>
                                                     <li>Descarga e instala Ollama desde <a href="https://ollama.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>ollama.com</a>.</li>
                                                     <li>Ejecuta el modelo en tu terminal: <code>ollama run qwen2.5:1.5b</code>.</li>
                                                     <li>Haz clic en "Guardar Ajustes" para continuar.</li>
                                                 </ol>
                                                 <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                     <span>Modelo:</span>
                                                     <input 
                                                         type="text" 
                                                         value={aiModel} 
                                                         onChange={(e) => setAiModel(e.target.value)}
                                                         className="input-field" 
                                                         style={{ height: '24px', fontSize: '0.75rem', padding: '2px 5px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', width: '120px' }}
                                                     />
                                                 </div>
                                                 <button 
                                                     className="btn primary-btn" 
                                                     onClick={() => handleSaveAiConfig('', 'ollama', aiModel)}
                                                     style={{ height: '26px', fontSize: '0.7rem', padding: '0 10px', borderRadius: '4px', marginTop: '10px', display: 'block' }}
                                                 >
                                                     Guardar Ajustes
                                                 </button>
                                             </div>
                                         ) : (
                                             <div>
                                                 <strong style={{ color: 'var(--text-primary)' }}>Guía de Configuración de Gemini Cloud:</strong>
                                                 <ol style={{ margin: '5px 0 8px 15px', padding: 0 }}>
                                                     <li>Ve a <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>Google AI Studio</a>.</li>
                                                     <li>Crea una API Key gratuita en segundos y pégala abajo:</li>
                                                 </ol>
                                                 <div style={{ display: 'flex', gap: '6px' }}>
                                                     <input 
                                                         type="password" 
                                                         placeholder="Gemini API Key" 
                                                         value={aiApiKey} 
                                                         onChange={(e) => setAiApiKey(e.target.value)}
                                                         className="input-field" 
                                                         style={{ flex: 1, height: '26px', fontSize: '0.75rem', padding: '2px 8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }}
                                                     />
                                                     <button 
                                                         className="btn primary-btn" 
                                                         onClick={() => handleSaveAiConfig(aiApiKey, 'gemini', 'gemini-1.5-flash')}
                                                         style={{ height: '26px', fontSize: '0.7rem', padding: '0 10px', borderRadius: '4px' }}
                                                     >
                                                         Guardar
                                                     </button>
                                                 </div>
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             )}

                            <button 
                                className="btn primary-btn"
                                onClick={handleCallAI}
                                disabled={aiLoading || (aiProvider === 'gemini' && !aiApiKey)}
                                style={{ height: '36px', borderRadius: '4px', fontSize: '0.8rem' }}
                            >
                                {aiLoading ? '🤖 Analizando con IA...' : '🤖 Resolver Conflicto con IA'}
                            </button>

                            {aiStatusMessage && (
                                <div style={{ fontSize: '0.75rem', color: aiStatusMessage.includes('Error') ? '#ef4444' : '#ef4444', fontStyle: 'italic' }}>
                                    {aiStatusMessage}
                                </div>
                            )}
                        </div>

                        {/* Resultado de la Fusión (Derecha) */}
                        <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Propuesta de Código Unificado:</span>
                            <textarea 
                                readOnly
                                value={aiResult}
                                placeholder="La propuesta de fusión mediante IA aparecerá aquí tras pulsar el botón..."
                                style={{
                                    flex: 1,
                                    minHeight: '120px',
                                    fontFamily: 'monospace',
                                    fontSize: '0.8rem',
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    padding: '10px',
                                    resize: 'none'
                                }}
                            />
                            {aiResult && (
                                <button 
                                    className="btn primary-btn"
                                    onClick={applyAiResolution}
                                    style={{ height: '34px', borderRadius: '4px', fontSize: '0.8rem', background: '#10b981', alignSelf: 'flex-end' }}
                                >
                                    ✔ Aplicar Fusión en Editor
                                </button>
                            )}
                        </div>
                    </div>
                )}
             </div>
        )}
      </div>
    );
};
