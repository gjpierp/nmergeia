import { useEffect } from 'react';
import { useAppStore } from '../app/useAppStore.js';
import { getRelativePath } from '../utils/pathUtils.js';

async function computeFileHash(file) {
    const CHUNK_SIZE = 64 * 1024;
    let offset = 0;
    let hash = 2166136261;
    
    while (offset < file.size) {
        const slice = file.slice(offset, offset + CHUNK_SIZE);
        const buffer = await slice.arrayBuffer();
        const view = new Uint8Array(buffer);
        for (let i = 0; i < view.length; i++) {
            hash ^= view[i];
            hash = Math.imul(hash, 16777619);
        }
        offset += CHUNK_SIZE;
    }
    return hash >>> 0;
}

function countLineChanges(oldText, newText) {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    
    if (oldLines.length > 5000 || newLines.length > 5000) {
        return { added: Math.max(0, newLines.length - oldLines.length), deleted: Math.max(0, oldLines.length - newLines.length) };
    }

    const oldFreq = new Map();
    for (let i = 0; i < oldLines.length; i++) {
        const trimmed = oldLines[i].trim();
        if (!trimmed) continue;
        oldFreq.set(trimmed, (oldFreq.get(trimmed) || 0) + 1);
    }

    let commonCount = 0;
    for (let j = 0; j < newLines.length; j++) {
        const trimmed = newLines[j].trim();
        if (!trimmed) continue;
        const count = oldFreq.get(trimmed);
        if (count && count > 0) {
            commonCount++;
            oldFreq.set(trimmed, count - 1);
        }
    }

    const deleted = Math.max(0, oldLines.length - commonCount);
    const added = Math.max(0, newLines.length - commonCount);
    
    return { added, deleted };
}

/**
 * Hook que encapsula la comparación de igualdad de archivos de forma asíncrona
 * en el hilo principal utilizando yield (setTimeout) para no bloquear la UI.
 * Esto evita el DataCloneError en entornos polyfilleados.
 */
export const useEqualityWorker = () => {
    const hasProcessed = useAppStore(s => s.hasProcessed);
    const activeTab = useAppStore(s => s.activeTab);
    const tabs = useAppStore(s => s.tabs);
    const setFileEqualityMap = useAppStore(s => s.setFileEqualityMap);

    useEffect(() => {
        if (!hasProcessed) return;

        const tab = tabs.find(t => t.id === activeTab);
        if (!tab || tab.type !== 'matrix' || !tab.originHandle) return;

        const currentOriginHandle = tab.originHandle;
        const currentProcessedOrigin = tab.processedOrigin;
        const currentProcessedDestSlots = tab.processedDestSlots;

        let isCancelled = false;

        const processEquality = async () => {
            const newMap = {};
            const destMaps = currentProcessedDestSlots.map(slot => {
                const map = new Map();
                if (slot.files) {
                    for (const f of slot.files) {
                        const relPath = getRelativePath(f.webkitRelativePath, slot.handle.name);
                        map.set(relPath, f);
                    }
                }
                return { id: slot.id, map };
            });

            const tasks = [];
            for (const oFile of currentProcessedOrigin) {
                const oPath = getRelativePath(oFile.webkitRelativePath, currentOriginHandle.name);
                for (const slot of destMaps) {
                    const dFile = slot.map.get(oPath);
                    if (dFile) {
                        const key = `${slot.id}-${oPath}`;
                        tasks.push(async () => {
                            if (isCancelled) return;
                            try {
                                let nativeOFile = oFile;
                                let nativeDFile = dFile;

                                if (nativeOFile.fileHandle && typeof nativeOFile.fileHandle.getFile === 'function') {
                                    nativeOFile = await nativeOFile.fileHandle.getFile();
                                }
                                if (nativeDFile.fileHandle && typeof nativeDFile.fileHandle.getFile === 'function') {
                                    nativeDFile = await nativeDFile.fileHandle.getFile();
                                }

                                if (nativeOFile.size !== nativeDFile.size) {
                                    newMap[key] = { status: 'different', added: 0, deleted: 0 };
                                    return;
                                }

                                if (nativeOFile.size > 500 * 1024) {
                                    const [oHash, dHash] = await Promise.all([computeFileHash(nativeOFile), computeFileHash(nativeDFile)]);
                                    if (oHash === dHash) {
                                        newMap[key] = { status: 'identical', added: 0, deleted: 0 };
                                    } else {
                                        newMap[key] = { status: 'different', added: 0, deleted: 0 };
                                    }
                                } else {
                                    const [oText, dText] = await Promise.all([nativeOFile.text(), nativeDFile.text()]);
                                    const normalize = t => t.replace(/^\uFEFF/, '').replace(/\s+/g, ' ').trim();
                                    if (normalize(oText) === normalize(dText)) {
                                        newMap[key] = { status: 'identical', added: 0, deleted: 0 };
                                    } else {
                                        const stats = countLineChanges(oText, dText);
                                        newMap[key] = { status: 'different', added: stats.added, deleted: stats.deleted };
                                    }
                                }
                            } catch(e) {
                                newMap[key] = { status: 'different', added: 0, deleted: 0 };
                            }
                        });
                    }
                }
            }

            const BATCH_SIZE = 5; 
            const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

            for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
                if (isCancelled) return;
                const batch = tasks.slice(i, i + BATCH_SIZE);
                await Promise.all(batch.map(fn => fn()));
                await yieldToMain();
            }

            if (!isCancelled) {
                setFileEqualityMap(newMap);
            }
        };

        processEquality();

        return () => {
            isCancelled = true;
        };
    }, [hasProcessed, activeTab, tabs, setFileEqualityMap]);
};
