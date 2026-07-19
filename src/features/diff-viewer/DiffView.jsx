import React, { memo } from 'react';
import { DiffEditor } from '@monaco-editor/react';

export const DiffView = memo(({
    tab,
    appTheme,
    originPath,
    destSlots,
    originHandle,
    diffEditorRef,
    saveFile,
    setTabs,
    tabDiffContents,
    setTabDiffContents,
    pendingNavigationRef,
    navigateDiff,
    transferCurrentDiff,
    transferAllDiffs,
    handleUndo,
    handleRedo
}) => {
    
    if (tab.isBackendFile) {
        return (
          <div className="editor-screen">
            <div className="editor-header" style={{display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
               <h3 style={{color: 'var(--text-primary)'}}>{tab.title}</h3>
               <div style={{display: 'flex', gap: '10px'}}>
                   {tab.originHandle && tab.destHandle && (
                       <>
                         <button className="btn secondary-btn small-btn" onClick={() => saveFile(tab.originHandle, tab.filePath, false, tab.modified, false)} data-tooltip="Copiar código actual al archivo de Origen">{"⬅️"}</button>
                         <button className="btn secondary-btn small-btn" onClick={() => saveFile(tab.destHandle, tab.filePath, false, tab.original, false)} data-tooltip="Copiar código actual al archivo de Destino">{"➡️"}</button>
                       </>
                   )}
                   <button 
                      className="btn primary-btn small-btn" 
                      data-tooltip="Guardar archivo actual"
                      disabled={tab.modified === tab.initialModified}
                      onClick={() => { const liveValue = diffEditorRef.current ? diffEditorRef.current.getModifiedEditor().getValue() : tab.modified; saveFile(tab.destHandle || null, tab.filePath, tab.isBackendFile, liveValue, false, tab.id); }}
                   >
                      {"💾"}
                   </button>
               </div>
            </div>
            <textarea
               style={{
                  width: '100%', 
                  height: 'calc(100vh - 120px)', 
                  background: 'var(--bg-primary)', 
                  color: 'var(--accent-secondary)', 
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

    return (
      <div className="editor-screen" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className="editor-header" style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
           
           <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
              <strong style={{color: 'var(--accent-secondary)'}}>Origen: {originPath}</strong>
               <div style={{marginTop: '5px', display: 'flex', gap: '10px'}}>
                  <button className="btn clear-btn small-btn" data-tooltip="Descartar Cambios" 
                      disabled={tab.original === tab.initialOriginal}
                      onClick={() => {
                          setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, original: t.initialOriginal } : t));
                          if (diffEditorRef.current) diffEditorRef.current.getOriginalEditor().setValue(tab.initialOriginal);
                      }}
                  >{"↩️"}</button>
                  <button className="btn secondary-btn small-btn" 
                     disabled={tab.original === tab.initialOriginal}
                     onClick={() => {
                        const liveValue = diffEditorRef.current ? diffEditorRef.current.getOriginalEditor().getValue() : tab.original;
                        saveFile(originHandle, tab.filePath, false, liveValue, false, tab.id, true);
                     }}
                     data-tooltip="Guardar Cambios en Archivo Origen (Local)"
                  >{"💾 Guardar (Origen)"}</button>
               </div>
           </div>

           <div style={{display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'nowrap'}}>
               <button className="btn clear-btn small-btn" onClick={handleUndo} data-tooltip="Deshacer (Ctrl+Z)">{"↩️"}</button>
               <button className="btn clear-btn small-btn" onClick={handleRedo} data-tooltip="Rehacer (Ctrl+Y)">{"↪️"}</button>
               
               <div style={{width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px'}}></div>

               <button className="btn clear-btn small-btn" onClick={() => {
                   pendingNavigationRef.current = 'prev';
                   if (diffEditorRef.current) diffEditorRef.current.getModifiedEditor().trigger('keyboard', 'editor.action.accessibleDiffViewer.prev');
                   else navigateDiff('prev');
               }} data-tooltip="Diferencia Anterior">{"⬆️"}</button>
               <button className="btn clear-btn small-btn" onClick={() => {
                   pendingNavigationRef.current = 'next';
                   if (diffEditorRef.current) diffEditorRef.current.getModifiedEditor().trigger('keyboard', 'editor.action.accessibleDiffViewer.next');
                   else navigateDiff('next');
               }} data-tooltip="Siguiente Diferencia">{"⬇️"}</button>

               <div style={{width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px'}}></div>

               <button className="btn secondary-btn small-btn" onClick={() => transferCurrentDiff('to_origin')} data-tooltip="Mover DIFERENCIA ACTUAL al Origen">{"⬅️"}</button>
               <button className="btn secondary-btn small-btn" onClick={() => transferCurrentDiff('to_dest')} data-tooltip="Mover DIFERENCIA ACTUAL al Destino">{"➡️"}</button>
               
               <div style={{width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 4px'}}></div>

               <button className="btn secondary-btn small-btn" onClick={() => transferAllDiffs('to_origin')} data-tooltip="Reemplazar TODO el Origen">{"⏪"}</button>
               <button className="btn secondary-btn small-btn" onClick={() => transferAllDiffs('to_dest')} data-tooltip="Reemplazar TODO el Destino">{"⏩"}</button>
           </div>

           <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
               <strong style={{color: '#a78bfa'}}>Destino: {destSlot ? destSlot.path : 'Desconocido'}</strong>
               <div style={{marginTop: '5px', display: 'flex', gap: '10px'}}>
                  <button className="btn clear-btn small-btn" data-tooltip="Descartar Cambios" 
                      disabled={tab.modified === tab.initialModified}
                      onClick={() => {
                          setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, modified: t.initialModified } : t));
                          if (diffEditorRef.current) diffEditorRef.current.getModifiedEditor().setValue(tab.initialModified);
                      }}
                  >{"↩️"}</button>
                  <button className="btn primary-btn small-btn" 
                     disabled={tab.modified === tab.initialModified}
                     onClick={() => {
                        const liveValue = diffEditorRef.current ? diffEditorRef.current.getModifiedEditor().getValue() : tab.modified;
                        saveFile(destDirHandle, tab.filePath, false, liveValue, false, tab.id, false);
                     }}
                     data-tooltip="Guardar Cambios en Archivo Destino"
                  >{"💾 Guardar (Destino)"}</button>
               </div>
           </div>

        </div>
        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {(() => {
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
                    <><div className="diff-headers">
           <div style={{flex: 1, textAlign: 'center'}}>
               <span style={{color: 'var(--accent-secondary)'}}>- Origen: </span>
               <span style={{color: 'var(--text-primary)'}}>{originPath}</span>
           </div>
           <div style={{width: '2px', background: 'var(--border-color)'}}></div>
           <div style={{flex: 1, textAlign: 'center'}}>
               <span style={{color: '#a78bfa'}}>- Destino: </span>
               <span style={{color: 'var(--text-primary)'}}>{destSlot ? destSlot.path : 'Desconocido'}</span>
           </div>
        </div>
        <DiffEditor
              height="100%"
              original={tab.original}
              modified={tab.modified}
              language={getLanguage(tab.title)}
              theme={appTheme === 'dark' ? 'vs-dark' : 'vs'}
              options={{
                 renderSideBySide: true,
                 readOnly: false,
                 originalEditable: true,
                 minimap: { enabled: true, renderCharacters: false, scale: 0.75 }, wordWrap: 'on'
              }}
          onMount={(editor, monaco) => {
             diffEditorRef.current = editor;

             editor.getModifiedEditor().addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                 saveFile(destDirHandle, tab.filePath, false, editor.getModifiedEditor().getValue(), false, tab.id, false);
             });

             editor.getOriginalEditor().addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                 saveFile(originHandle, tab.filePath, false, editor.getOriginalEditor().getValue(), false, tab.id, true);
             });

             const updateSelectedDiffFromEditor = (targetEditor, isModified) => {
                 const changes = editor.getLineChanges();
                 if (!changes || changes.length === 0) {
                     setTabDiffContents(prev => ({...prev, [tab.id]: null}));
                     return;
                 }
                 
                 const selection = targetEditor.getSelection();
                 if (!selection) return;
                 
                 const startLine = selection.startLineNumber;
                 const endLine = selection.endLineNumber;

                 const targetChanges = changes.filter(c => {
                     const start = isModified ? c.modifiedStartLineNumber : c.originalStartLineNumber;
                     let end = isModified ? c.modifiedEndLineNumber : c.originalEndLineNumber;
                     if (end === 0) end = start; 
                     const s = start === 0 ? 1 : start;
                     return startLine <= end && endLine >= s;
                 });

                 if (targetChanges.length > 0) {
                     const origModel = editor.getOriginalEditor().getModel();
                     const modModel = editor.getModifiedEditor().getModel();
                     let oLines = [];
                     let mLines = [];
                     
                     targetChanges.forEach(change => {
                         if (change.originalEndLineNumber > 0) {
                             for(let i = change.originalStartLineNumber; i <= change.originalEndLineNumber; i++) oLines.push(origModel.getLineContent(i));
                         }
                         if (change.modifiedEndLineNumber > 0) {
                             for(let i = change.modifiedStartLineNumber; i <= change.modifiedEndLineNumber; i++) mLines.push(modModel.getLineContent(i));
                         }
                         oLines.push('---');
                         mLines.push('---');
                     });
                     
                     if (oLines.length > 0) oLines.pop();
                     if (mLines.length > 0) mLines.pop();
                     
                     setTabDiffContents(prev => ({...prev, [tab.id]: { origin: oLines.join('\n'), dest: mLines.join('\n') }}));
                 } else {
                     setTabDiffContents(prev => ({...prev, [tab.id]: null}));
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
        </>
        );
        })()}
        </div>
        {tabDiffContents[tab.id] && (
          <div style={{ 
              flexShrink: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              width: '100%', 
              height: '350px',
              background: 'var(--bg-secondary)', 
              borderTop: '1px solid var(--border-color)',
              overflow: 'hidden'
          }}>
             <div style={{ flex: 1, padding: '15px', overflow: 'auto', borderBottom: '1px solid var(--border-color)' }}>
                <h4 style={{marginBottom: '5px', color: 'var(--accent-secondary)'}}>Origen</h4>
                <pre style={{fontSize:'0.85rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: 'var(--text-primary)', margin: 0, textAlign: 'left'}}>{tabDiffContents[tab.id].origin}</pre>
             </div>
             <div style={{ flex: 1, padding: '15px', overflow: 'auto' }}>
                <h4 style={{marginBottom: '5px', color: '#a78bfa'}}>Destino</h4>
                <pre style={{fontSize:'0.85rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: 'var(--text-primary)', margin: 0, textAlign: 'left'}}>{tabDiffContents[tab.id].dest}</pre>
             </div>
          </div>
        )}
      </div>
    );
});
