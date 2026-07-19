const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    readFilter: (filename) => ipcRenderer.invoke('read-filter', filename),
    writeFilter: (filename, content) => ipcRenderer.invoke('write-filter', filename, content),
    verifyLicense: (key) => ipcRenderer.invoke('verify-license', key),
    callAIResolver: (args) => ipcRenderer.invoke('call-ai-resolver', args)
});
