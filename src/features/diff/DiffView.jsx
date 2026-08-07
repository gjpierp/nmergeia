import React, { useRef, useState, Suspense } from 'react';
import { DiffEditor, Editor } from '@monaco-editor/react';
import { getRelativePath } from "../../utils/pathUtils.js";
import { useAppStore } from '../../app/useAppStore.js';
import { useTranslation } from 'react-i18next';
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

export function DiffView({ tab, tabs, setTabs, originHandle, destSlots, originPath, fileEqualityMap, closeTab, addToast, appTheme, showModal, openDiffTab, saveFile, handleDelete, appLanguage }) {
    const { t } = useTranslation();
    const diffEditorRef = useRef(null);
    const monacoRef = useRef(null);
    const pendingNavigationRef = useRef(null);
    const [diffContent, setDiffContent] = useState(null);
    const [normalizeEnabled, setNormalizeEnabled] = useState(false);

    // Estados del Asistente Híbrido de Fusión
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
        setAiStatusMessage(t('diff_ai_status_analyzing'));
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
                setAiStatusMessage(t('diff_ai_status_success'));
            } else {
                setAiStatusMessage(res.message);
            }
        } catch (e) {
            setAiStatusMessage(t('diff_ai_status_error') + e.message);
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
        addToast(t('diff_toast_ai_applied'), "success");
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
        addToast(t('diff_toast_ai_config_saved'), "success");
    };

    const navigateDiff = (direction) => {
        try {
            if (!diffEditorRef.current) return;
            const changes = diffEditorRef.current.getLineChanges();
            if (!changes || changes.length === 0) return;
            
            const modEditor = diffEditorRef.current.getModifiedEditor();
            const origEditor = diffEditorRef.current.getOriginalEditor();
            if (!modEditor || !origEditor) return;

            const modModel = modEditor.getModel();
            const origModel = origEditor.getModel();
            if (!modModel || !origModel) return;

            const currentLine = modEditor.getPosition()?.lineNumber || 1;
            
            let targetChange = null;
            if (direction === 'first') {
                targetChange = changes[0];
            } else if (direction === 'last') {
                targetChange = changes[changes.length - 1];
            } else if (direction === 'current') {
                targetChange = changes.find(c => {
                   const modStart = c.modifiedStartLineNumber === 0 ? 1 : c.modifiedStartLineNumber;
                   const modEnd = c.modifiedEndLineNumber === 0 ? modStart : c.modifiedEndLineNumber;
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
                const maxModLine = modModel && typeof modModel.getLineCount === 'function' ? modModel.getLineCount() : 99999;
                const maxOrigLine = origModel && typeof origModel.getLineCount === 'function' ? origModel.getLineCount() : 99999;
                const modLine = Math.max(1, Math.min(targetChange.modifiedStartLineNumber || targetChange.originalStartLineNumber || 1, maxModLine));
                const origLine = Math.max(1, Math.min(targetChange.originalStartLineNumber || targetChange.modifiedStartLineNumber || 1, maxOrigLine));
                
                modEditor.setPosition({ lineNumber: modLine, column: 1 });
                modEditor.revealLineInCenter(modLine);
                origEditor.revealLineInCenter(origLine);
            }
        } catch (err) {
            console.error('[DiffView] Error en navigateDiff:', err);
        }
    };

    const transferCurrentDiff = (direction) => {
        try {
            if (!diffEditorRef.current) return;
            const changes = diffEditorRef.current.getLineChanges();
            if (!changes || changes.length === 0) return;
        
            const origEditor = diffEditorRef.current.getOriginalEditor();
            const modEditor = diffEditorRef.current.getModifiedEditor();
            if (!origEditor || !modEditor) return;

            const origModel = origEditor.getModel();
            const modModel = modEditor.getModel();
            if (!origModel || !modModel) return;

            const currentLine = modEditor.getPosition()?.lineNumber || 1;
        
            let currentChange = changes.find(c => {
               const modStart = c.modifiedStartLineNumber === 0 ? 1 : c.modifiedStartLineNumber;
               const modEnd = c.modifiedEndLineNumber === 0 ? modStart : c.modifiedEndLineNumber;
               return currentLine >= modStart && currentLine <= modEnd;
            });
            if (!currentChange) {
                currentChange = changes.find(c => (c.modifiedStartLineNumber || 1) >= currentLine) || changes[0];
            }
            if (!currentChange) return;

            const maxOrigLine = origModel && typeof origModel.getLineCount === 'function' ? origModel.getLineCount() : 99999;
            const maxModLine = modModel && typeof modModel.getLineCount === 'function' ? modModel.getLineCount() : 99999;

            if (direction === 'to_dest') {
                const origLines = [];
                if (currentChange.originalEndLineNumber > 0) {
                    const startL = Math.max(1, Math.min(currentChange.originalStartLineNumber, maxOrigLine));
                    const endL = Math.max(startL, Math.min(currentChange.originalEndLineNumber, maxOrigLine));
                    for (let i = startL; i <= endL; i++) {
                        origLines.push(origModel.getLineContent(i));
                    }
                }
                
                let range;
                let text = origLines.join('\n');
                if (currentChange.modifiedEndLineNumber === 0) {
                    const targetL = Math.max(1, Math.min(currentChange.modifiedStartLineNumber + 1, maxModLine + 1));
                    if (targetL > maxModLine) {
                        range = { startLineNumber: maxModLine, startColumn: modModel.getLineMaxColumn(maxModLine), endLineNumber: maxModLine, endColumn: modModel.getLineMaxColumn(maxModLine) };
                        text = '\n' + text;
                    } else {
                        range = { startLineNumber: targetL, startColumn: 1, endLineNumber: targetL, endColumn: 1 };
                        text = text + '\n';
                    }
                } else {
                    const startL = Math.max(1, Math.min(currentChange.modifiedStartLineNumber, maxModLine));
                    const endL = Math.max(startL, Math.min(currentChange.modifiedEndLineNumber, maxModLine));
                    range = {
                        startLineNumber: startL, startColumn: 1,
                        endLineNumber: endL, endColumn: modModel.getLineMaxColumn(endL)
                    };
                }
                modEditor.executeEdits("diff", [{ range, text }]);
            } else {
                const modLines = [];
                if (currentChange.modifiedEndLineNumber > 0) {
                    const startL = Math.max(1, Math.min(currentChange.modifiedStartLineNumber, maxModLine));
                    const endL = Math.max(startL, Math.min(currentChange.modifiedEndLineNumber, maxModLine));
                    for (let i = startL; i <= endL; i++) {
                        modLines.push(modModel.getLineContent(i));
                    }
                }
                
                let range;
                let text = modLines.join('\n');
                if (currentChange.originalEndLineNumber === 0) {
                    const targetL = Math.max(1, Math.min(currentChange.originalStartLineNumber + 1, maxOrigLine + 1));
                    if (targetL > maxOrigLine) {
                        range = { startLineNumber: maxOrigLine, startColumn: origModel.getLineMaxColumn(maxOrigLine), endLineNumber: maxOrigLine, endColumn: origModel.getLineMaxColumn(maxOrigLine) };
                        text = '\n' + text;
                    } else {
                        range = { startLineNumber: targetL, startColumn: 1, endLineNumber: targetL, endColumn: 1 };
                        text = text + '\n';
                    }
                } else {
                    const startL = Math.max(1, Math.min(currentChange.originalStartLineNumber, maxOrigLine));
                    const endL = Math.max(startL, Math.min(currentChange.originalEndLineNumber, maxOrigLine));
                    range = {
                        startLineNumber: startL, startColumn: 1,
                        endLineNumber: endL, endColumn: origModel.getLineMaxColumn(endL)
                    };
                }
                origEditor.executeEdits("diff", [{ range, text }]);
            }

            const newMod = modEditor.getValue();
            const newOrig = origEditor.getValue();
            setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, modified: newMod, original: newOrig } : t));
            
            pendingNavigationRef.current = 'next';
        } catch (err) {
            console.error('[DiffView] Error en transferCurrentDiff:', err);
            if (addToast) addToast(`Error al transferir código: ${err.message}`, 'error');
        }
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

        const newMod = modEditor.getValue();
        const newOrig = origEditor.getValue();
        setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, modified: newMod, original: newOrig } : t));
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
        try {
            const handle = isOriginFile 
                ? (tab.originHandle || originHandle) 
                : (tab.destHandle || (destSlots && destSlots[tab.destSlotIdx] ? destSlots[tab.destSlotIdx].handle : null));

            let content = isOriginFile ? tab.original : tab.modified;
            if (diffEditorRef.current) {
                content = isOriginFile 
                    ? diffEditorRef.current.getOriginalEditor().getValue() 
                    : diffEditorRef.current.getModifiedEditor().getValue();
            }

            await saveFile(handle, tab.filePath, false, content, false, tab.id, isOriginFile);
            
            const matrixTab = tabs ? tabs.find(t => t.type === 'matrix') : null;
            if (matrixTab) {
                const originFiles = matrixTab.processedOrigin || [];
                const destSlotsArr = matrixTab.processedDestSlots || [];
                const originHandleName = matrixTab.originHandle ? matrixTab.originHandle.name : '';

                let allFiles = new Set([
                    ...originFiles.map(f => f.webkitRelativePath && originHandleName ? getRelativePath(f.webkitRelativePath, originHandleName) : (f.name || f.name)),
                    ...destSlotsArr.flatMap(slot => slot && slot.handle ? (slot.files || []).map(f => f.webkitRelativePath ? getRelativePath(f.webkitRelativePath, slot.handle.name) : f.name) : [])
                ]);
                let sortedFiles = Array.from(allFiles).sort();
                let currentIndex = sortedFiles.indexOf(tab.filePath);
                
                let nextFile = null;
                for (let i = currentIndex + 1; i < sortedFiles.length; i++) {
                    const path = sortedFiles[i];
                    const oFile = originFiles.find(f => (f.webkitRelativePath && originHandleName ? getRelativePath(f.webkitRelativePath, originHandleName) : f.name) === path);
                    const slot = destSlotsArr[0];
                    if (slot) {
                        const slotHandleName = slot.handle ? slot.handle.name : '';
                        const dFile = (slot.files || []).find(f => (f.webkitRelativePath && slotHandleName ? getRelativePath(f.webkitRelativePath, slotHandleName) : f.name) === path);
                        let isDiff = (!oFile && dFile) || (oFile && dFile && oFile.size !== dFile.size);
                        if (!isDiff && oFile && dFile) {
                            const key = `${slot.id}-${path}`;
                            const eq = fileEqualityMap ? fileEqualityMap[key] : null;
                            const status = typeof eq === 'object' ? eq?.status : eq;
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
                    if (addToast) addToast(t('diff_toast_save_next'), "success");
                    openDiffTab(nextFile.oFile, nextFile.dFile, nextFile.slotIdx);
                } else {
                    closeTab(tab.id);
                    if (addToast) addToast(t('diff_toast_save_finished'), "success");
                }
            } else {
                closeTab(tab.id);
                if (addToast) addToast(t('diff_toast_save_finished'), "success");
            }
        } catch (err) {
            console.error('[DiffView] Error en handleSaveAndNext:', err);
            if (addToast) addToast(`Error al guardar y navegar: ${err.message}`, 'error');
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
                         <button className="btn secondary-btn small-btn" onClick={() => saveFile(tab.originHandle, tab.filePath, false, tab.modified, false, tab.id)} data-tooltip={t('diff_tooltip_copy_to_origin')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#3b82f6'}}>arrow_back</span></button>
                         <button className="btn secondary-btn small-btn" onClick={() => saveFile(tab.destHandle, tab.filePath, false, tab.original, false, tab.id, false)} data-tooltip={t('diff_tooltip_copy_to_dest')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#10b981'}}>arrow_forward</span></button>
                       </>
                   )}
                   <button 
                      className="btn primary-btn small-btn" 
                      data-tooltip={t('diff_tooltip_save_current')}
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
                      {t('diff_origin')}: {originPath}/{tab.filePath}
                  </strong>
               </div>
               <div style={{ flex: 1, paddingLeft: '20px', borderLeft: '1px solid var(--border-color)', overflow: 'hidden' }}>
                   <strong style={{color: '#a78bfa', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}} title={destSlot ? `${destSlot.path}/${tab.filePath}` : t('diff_unknown')}>
                      {t('diff_dest')}: {destSlot ? `${destSlot.path}/${tab.filePath}` : t('diff_unknown')}
                  </strong>
               </div>
           </div>
           
           <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '0px'}}>
                  <button className="btn clear-btn small-btn" data-tooltip={t('diff_tooltip_delete_origin')} disabled={isDocBinary} onClick={() => {
                      handleDelete(originHandle, tab.filePath, true);
                  }}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#ef4444'}}>delete</span></button>
                  <button className="btn clear-btn small-btn" data-tooltip={t('diff_tooltip_discard_changes')} 
                      disabled={isDocBinary || tab.original === tab.initialOriginal}
                      onClick={() => {
                          setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, original: t.initialOriginal } : t));
                      }}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>close</span></button>
                  <button className="btn primary-btn small-btn" data-tooltip={t('diff_tooltip_save_origin_continue')} 
                      disabled={isDocBinary || tab.original === tab.initialOriginal}
                      onClick={() => handleSaveAndNext(true)}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>save</span></button>
                  <button className="btn secondary-btn small-btn" data-tooltip={t('diff_tooltip_clone_dest_to_origin')} disabled={isDocBinary} onClick={() => {
                       const targetHandle = tab.originHandle || originHandle;
                       const modVal = diffEditorRef.current ? diffEditorRef.current.getModifiedEditor().getValue() : tab.modified;
                       if (diffEditorRef.current) diffEditorRef.current.getOriginalEditor().setValue(modVal);
                       saveFile(targetHandle, tab.filePath, false, modVal, false, tab.id, true);
                       setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, original: modVal, initialOriginal: modVal } : t));
                   }}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#3b82f6'}}>arrow_back</span></button>
               </div>
               
               <div style={{display: 'flex', gap: '0px', margin: '0 10px'}}>

                    <button className="btn secondary-btn small-btn" disabled={isDocBinary} onClick={() => {
                        setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, modified: t.initialModified, original: t.initialOriginal } : t));
                    }} data-tooltip={t('diff_tooltip_revert_initial')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>restore</span></button>
                    <div style={{width: '1px', background: 'var(--border-color)', margin: '0 5px'}}></div>

                     <button className="btn secondary-btn small-btn" disabled={isDocBinary} onClick={handleUndo} data-tooltip={t('diff_tooltip_undo')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>undo</span></button>
                     <button className="btn secondary-btn small-btn" disabled={isDocBinary} onClick={handleRedo} data-tooltip={t('diff_tooltip_redo')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>redo</span></button>
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
                                 {isJson ? t('diff_normalize_json') : isYaml ? t('diff_normalize_yaml') : isXml ? t('diff_normalize_xml') : t('diff_clean_spaces')}
                             </span>
                         </label>
                     )}
                    <div className="diff-headers">
                    <PremiumLock>
                    <button className="btn secondary-btn small-btn" disabled={isDocBinary} onClick={() => transferAllDiffs('to_origin')} data-tooltip={t('diff_tooltip_automerge_all_to_origin')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#f59e0b'}}>keyboard_double_arrow_left</span></button>
                    </PremiumLock>
                    <span>{originPath || t('diff_origin')}</span>
                    <span>{t('diff_vs')}</span>
                    <span>{destSlots[0]?.path || t('diff_dest')}</span>
                    <PremiumLock>
                    <button className="btn secondary-btn small-btn" disabled={isDocBinary} onClick={() => transferAllDiffs('to_dest')} data-tooltip={t('diff_tooltip_automerge_all_to_dest')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#f59e0b'}}>keyboard_double_arrow_right</span></button>
                    </PremiumLock>
                    </div>
                    <div style={{width: '1px', background: 'var(--border-color)', margin: '0 5px'}}></div>
                    <button className="btn secondary-btn small-btn" onClick={() => navigateDiff('first')} data-tooltip={t('diff_tooltip_first_diff')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>first_page</span></button>
                    <button className="btn secondary-btn small-btn" onClick={() => navigateDiff('prev')} data-tooltip={t('diff_tooltip_prev_diff')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>keyboard_arrow_up</span></button>
                    <button className="btn secondary-btn small-btn" onClick={() => navigateDiff('current')} data-tooltip={t('diff_tooltip_curr_diff')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>place</span></button>
                    <button className="btn secondary-btn small-btn" onClick={() => navigateDiff('next')} data-tooltip={t('diff_tooltip_next_diff')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>keyboard_arrow_down</span></button>
                    <button className="btn secondary-btn small-btn" onClick={() => navigateDiff('last')} data-tooltip={t('diff_tooltip_last_diff')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>last_page</span></button>
                    <div style={{width: '1px', background: 'var(--border-color)', margin: '0 5px'}}></div>
                    <button className="btn secondary-btn small-btn" disabled={isDocBinary} onClick={() => transferCurrentDiff('to_origin')} data-tooltip={t('diff_tooltip_copy_block_to_origin')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#3b82f6'}}>subdirectory_arrow_left</span></button>
                    <button className="btn secondary-btn small-btn" disabled={isDocBinary} onClick={() => transferCurrentDiff('to_dest')} data-tooltip={t('diff_tooltip_copy_block_to_dest')}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#10b981'}}>subdirectory_arrow_right</span></button>
                </div>
               
               <div style={{display: 'flex', alignItems: 'center', gap: '0px'}}>
                  <button className="btn secondary-btn small-btn" data-tooltip={t('diff_tooltip_clone_origin_to_dest')} disabled={isDocBinary} onClick={() => {
                      const targetHandle = tab.destHandle || (destSlots[tab.destSlotIdx] ? destSlots[tab.destSlotIdx].handle : null);
                      const origVal = diffEditorRef.current ? diffEditorRef.current.getOriginalEditor().getValue() : tab.original;
                      if (diffEditorRef.current) diffEditorRef.current.getModifiedEditor().setValue(origVal);
                      saveFile(targetHandle, tab.filePath, false, origVal, false, tab.id, false);
                      setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, modified: origVal, initialModified: origVal } : t));
                  }}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#10b981'}}>arrow_forward</span></button>
                  <button className="btn primary-btn small-btn" data-tooltip={t('diff_tooltip_save_dest_continue')} 
                      disabled={isDocBinary || tab.modified === tab.initialModified}
                      onClick={() => handleSaveAndNext(false)}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>save</span></button>
                  <button className="btn clear-btn small-btn" data-tooltip={t('diff_tooltip_discard_changes')} 
                      disabled={isDocBinary || tab.modified === tab.initialModified}
                      onClick={() => {
                          setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, modified: t.initialModified } : t));
                      }}><span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>close</span></button>
                  <button className="btn clear-btn small-btn" data-tooltip={t('diff_tooltip_delete_dest')} disabled={isDocBinary} onClick={() => {
                      handleDelete(destDirHandle, tab.filePath, false);
                  }}><span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: '#ef4444'}}>delete</span></button>
               </div>
           </div>

        </div>
        {isDocBinary && (
            <div style={{ flexShrink: 0, background: 'rgba(245, 158, 11, 0.1)', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', padding: '8px 15px', color: '#f59e0b', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>warning</span>
              <span>{t('diff_binary_warning')}</span>
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
                <Suspense fallback={<div style={{padding: '20px', color: 'var(--text-secondary)'}}>{t('diff_loading_editor')}</div>}>
                    {tab.destValues && tab.destValues.length > 1 ? (
                        <div style={{ display: 'flex', height: '100%', width: '100%', gap: '15px' }}>
                            <div style={{ flex: '1 0 460px', display: 'flex', flexDirection: 'column', height: '100%', minWidth: '460px' }}>
                                <div style={{ padding: '8px 12px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{t('diff_origin')}: {originPath}</span>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button className="btn clear-btn small-btn" disabled={isDocBinary || tab.original === tab.initialOriginal} onClick={() => {
                                            setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, original: t.initialOriginal } : t));
                                        }} data-tooltip={t('diff_tooltip_revert_origin')}><span className="material-symbols-rounded" style={{fontSize: '1rem'}}>restore</span></button>
                                        <button className="btn clear-btn small-btn" disabled={isDocBinary} onClick={() => {
                                            handleDelete(originHandle, tab.filePath, true);
                                        }} data-tooltip={t('diff_tooltip_delete_origin')}><span className="material-symbols-rounded" style={{fontSize: '1rem', color: '#ef4444'}}>delete</span></button>
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
                                const slotPath = slot ? slot.path : `${t('diff_dest')} ${idx + 1}`;
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
                                                }} data-tooltip={t('diff_tooltip_revert')}><span className="material-symbols-rounded" style={{fontSize: '1rem'}}>restore</span></button>
                                                <button className="btn primary-btn small-btn" disabled={isDocBinary || !isDirty} onClick={() => {
                                                    saveFile(slot.handle, tab.filePath, false, val, false, tab.id, false);
                                                }} data-tooltip={t('diff_tooltip_save')}><span className="material-symbols-rounded" style={{fontSize: '1rem'}}>save</span></button>
                                                <button className="btn clear-btn small-btn" disabled={isDocBinary} onClick={() => {
                                                    handleDelete(slot.handle, tab.filePath, false);
                                                }} data-tooltip={t('diff_tooltip_delete_dest')}><span className="material-symbols-rounded" style={{fontSize: '1rem', color: '#ef4444'}}>delete</span></button>
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

                                const modEd = editor.getModifiedEditor();
                                const origEd = editor.getOriginalEditor();

                                modEd.onDidChangeModelContent(() => {
                                    const val = modEd.getValue();
                                    setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, modified: val } : t));
                                });

                                origEd.onDidChangeModelContent(() => {
                                    const val = origEd.getValue();
                                    setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, original: val } : t));
                                });

                                modEd.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                                    const targetHandle = tab.destHandle || (destSlots[tab.destSlotIdx] ? destSlots[tab.destSlotIdx].handle : null);
                                    saveFile(targetHandle, tab.filePath, false, modEd.getValue(), false, tab.id, false);
                                });

                                origEd.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                                    const targetHandle = tab.originHandle || originHandle;
                                    saveFile(targetHandle, tab.filePath, false, origEd.getValue(), false, tab.id, true);
                                });

                                const updateSelectedDiffFromEditor = (activeSubEditor, isModifiedSide) => {
                                     try {
                                         if (!editor || !editor.getLineChanges) return;
                                         const changes = editor.getLineChanges();
                                         if (!changes || changes.length === 0) {
                                             setDiffContent(null);
                                             return;
                                         }
                                         
                                         const pos = activeSubEditor?.getPosition();
                                         if (!pos) return;
                                         
                                         const currentLine = pos.lineNumber;
                                         
                                         const activeChange = changes.find(change => {
                                             if (isModifiedSide) {
                                                 const start = change.modifiedStartLineNumber === 0 ? 1 : change.modifiedStartLineNumber;
                                                 const end = change.modifiedEndLineNumber === 0 ? start : change.modifiedEndLineNumber;
                                                 return currentLine >= start && currentLine <= end;
                                             } else {
                                                 const start = change.originalStartLineNumber === 0 ? 1 : change.originalStartLineNumber;
                                                 const end = change.originalEndLineNumber === 0 ? start : change.originalEndLineNumber;
                                                 return currentLine >= start && currentLine <= end;
                                             }
                                         });
                                         
                                         if (activeChange) {
                                             const origModel = editor.getOriginalEditor()?.getModel();
                                             const modModel = editor.getModifiedEditor()?.getModel();
                                             if (!origModel || !modModel) return;

                                             const maxOrig = origModel && typeof origModel.getLineCount === 'function' ? origModel.getLineCount() : 99999;
                                             const maxMod = modModel && typeof modModel.getLineCount === 'function' ? modModel.getLineCount() : 99999;
                                             
                                             const oLines = [];
                                             const mLines = [];
                                             
                                             if (activeChange.originalEndLineNumber > 0) {
                                                 const startL = Math.max(1, Math.min(activeChange.originalStartLineNumber, maxOrig));
                                                 const endL = Math.max(startL, Math.min(activeChange.originalEndLineNumber, maxOrig));
                                                 for (let i = startL; i <= endL; i++) oLines.push(origModel.getLineContent(i));
                                             }
                                             if (activeChange.modifiedEndLineNumber > 0) {
                                                 const startL = Math.max(1, Math.min(activeChange.modifiedStartLineNumber, maxMod));
                                                 const endL = Math.max(startL, Math.min(activeChange.modifiedEndLineNumber, maxMod));
                                                 for (let i = startL; i <= endL; i++) mLines.push(modModel.getLineContent(i));
                                             }
                                             
                                             setDiffContent({ origin: oLines.join('\n'), dest: mLines.join('\n') });
                                         } else {
                                             setDiffContent(null);
                                         }
                                     } catch (err) {
                                         console.error('[DiffView] Error en updateSelectedDiffFromEditor:', err);
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
             <div 
               style={{ 
                 flexShrink: 0, 
                 maxHeight: '33vh', 
                 height: 'fit-content', 
                 overflowY: 'auto', 
                 background: 'var(--bg-secondary)', 
                 padding: '12px 16px', 
                 borderTop: '1px solid var(--border-color)', 
                 display: 'flex', 
                 flexDirection: 'column', 
                 gap: '10px',
                 boxSizing: 'border-box'
               }}
             >
                {/* Visualizador Lado a Lado de Líneas (Origen vs Destino) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', height: 'fit-content' }}>
                  {/* Columna Origen */}
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-secondary, #06b6d4)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>difference</span>
                      <span>- {originPath || t('diff_origin')} (Líneas de Origen):</span>
                    </div>
                    <pre style={{
                      textAlign: 'left',
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      fontSize: '0.75rem',
                      lineHeight: '1.4',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      overflowX: 'auto',
                      overflowY: 'auto',
                      color: 'var(--accent-secondary, #06b6d4)',
                      margin: 0,
                      background: 'rgba(6, 182, 212, 0.07)',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      borderLeft: '3px solid var(--accent-secondary, #06b6d4)',
                      border: '1px solid rgba(6, 182, 212, 0.2)'
                    }}>
                      {diffContent.origin || '(Línea vacía / borrada)'}
                    </pre>
                  </div>

                  {/* Columna Destino */}
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#a78bfa', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>difference</span>
                      <span>+ {destSlots[0]?.path || t('diff_dest')} (Líneas de Destino):</span>
                    </div>
                    <pre style={{
                      textAlign: 'left',
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      fontSize: '0.75rem',
                      lineHeight: '1.4',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      overflowX: 'auto',
                      overflowY: 'auto',
                      color: '#a78bfa',
                      margin: 0,
                      background: 'rgba(167, 139, 250, 0.07)',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      borderLeft: '3px solid #a78bfa',
                      border: '1px solid rgba(167, 139, 250, 0.2)'
                    }}>
                      {diffContent.dest || '(Línea vacía / agregada)'}
                    </pre>
                  </div>
                </div>

                {/* Barra de Acciones con Botones Lado a Lado */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Botón 1: Copiar Origen a Destino */}
                    <button 
                      className="btn secondary-btn small-btn"
                      onClick={() => transferCurrentDiff('to_dest')}
                      style={{ height: '32px', padding: '0 12px', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', border: '1px solid #10b981', fontSize: '0.78rem', borderRadius: '4px' }}
                      data-tooltip={t('diff_replace_with_origin')}
                    >
                      <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
                      <span>Copiar Origen a Destino</span>
                    </button>

                    {/* Botón 2: Copiar Destino a Origen */}
                    <button 
                      className="btn secondary-btn small-btn"
                      onClick={() => transferCurrentDiff('to_origin')}
                      style={{ height: '32px', padding: '0 12px', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#3b82f6', border: '1px solid #3b82f6', fontSize: '0.78rem', borderRadius: '4px' }}
                      data-tooltip={t('diff_replace_with_dest')}
                    >
                      <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>arrow_back</span>
                      <span>Copiar Destino a Origen</span>
                    </button>

                    {/* Botón 3: Integrar por IA (Ubicado AL LADO de los otros 2 botones) */}
                    <button 
                      className="btn primary-btn small-btn"
                      onClick={handleCallAI}
                      disabled={aiLoading || (aiProvider === 'gemini' && !aiApiKey)}
                      style={{ height: '32px', padding: '0 14px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', color: '#ffffff', border: 'none', borderRadius: '4px' }}
                      data-tooltip="Resolver y fusionar diferencia automáticamente usando IA"
                    >
                      <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>auto_awesome</span>
                      <span>{aiLoading ? (t('diff_ai_analyzing') || 'Analizando...') : (t('diff_ai_resolve_conflict') || 'Integrar por IA')}</span>
                    </button>
                  </div>

                  {/* Configuración / Selector de proveedor IA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isAiConfigured && !showAiConfig ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span>IA Activa: <strong>{aiProvider === 'ollama' ? `Ollama (${aiModel})` : 'Gemini Cloud'}</strong></span>
                        <button 
                          className="btn clear-btn small-btn" 
                          onClick={() => setShowAiConfig(true)}
                          style={{ height: '24px', padding: '0 6px', fontSize: '0.7rem', color: 'var(--accent-primary)' }}
                        >
                          {t('diff_update')}
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                        <select 
                          value={aiProvider} 
                          onChange={(e) => setAiProvider(e.target.value)} 
                          style={{ height: '24px', fontSize: '0.75rem', padding: '0 4px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }}
                        >
                          <option value="ollama">Ollama Local</option>
                          <option value="gemini">Gemini Cloud</option>
                        </select>
                        {aiProvider === 'gemini' ? (
                          <input 
                            type="password" 
                            placeholder="API Key Gemini" 
                            value={aiApiKey} 
                            onChange={(e) => setAiApiKey(e.target.value)} 
                            style={{ height: '24px', fontSize: '0.75rem', width: '120px', padding: '0 4px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }}
                          />
                        ) : (
                          <input 
                            type="text" 
                            value={aiModel} 
                            onChange={(e) => setAiModel(e.target.value)} 
                            style={{ height: '24px', fontSize: '0.75rem', width: '110px', padding: '0 4px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }}
                          />
                        )}
                        <button 
                          className="btn primary-btn small-btn"
                          onClick={() => handleSaveAiConfig(aiApiKey, aiProvider, aiModel)}
                          style={{ height: '24px', fontSize: '0.7rem', padding: '0 8px' }}
                        >
                          Guardar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mensaje de estado IA */}
                {aiStatusMessage && (
                    <div style={{ fontSize: '0.75rem', color: '#ef4444', fontStyle: 'italic' }}>
                        {aiStatusMessage}
                    </div>
                )}

                {/* Propuesta de Integración Generada por IA */}
                {aiResult && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(16, 185, 129, 0.08)', padding: '10px 12px', borderRadius: '6px', border: '1px solid #10b981', marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>task_alt</span>
                        {t('diff_unified_proposal') || 'Propuesta de Integración Generada por IA:'}
                      </span>
                      <button 
                        className="btn primary-btn small-btn"
                        onClick={applyAiResolution}
                        style={{ height: '28px', padding: '0 12px', borderRadius: '4px', fontSize: '0.75rem', background: '#10b981', border: 'none', color: '#ffffff', fontWeight: 'bold' }}
                      >
                        {t('diff_apply_merge') || 'Aplicar Fusión IA'}
                      </button>
                    </div>
                    <textarea 
                      readOnly
                      value={aiResult}
                      style={{
                        width: '100%',
                        maxHeight: '100px',
                        fontFamily: 'Consolas, Monaco, monospace',
                        fontSize: '0.78rem',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        padding: '8px',
                        resize: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}
             </div>
        )}
      </div>
    );
};
