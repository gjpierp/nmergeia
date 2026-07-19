import { useEffect } from 'react';
import { useAppStore } from '../app/useAppStore.js';
import { getRelativePath } from '../utils/pathUtils.js';

/**
 * Hook que encapsula la comparación de igualdad de archivos en un Web Worker
 * para no bloquear el hilo principal de la UI durante comparaciones grandes.
 * Se activa automáticamente cuando cambia el tab activo o el estado de procesamiento.
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

        const originFilesPayload = currentProcessedOrigin.map(f => ({
            path: getRelativePath(f.webkitRelativePath, currentOriginHandle.name),
            file: f
        }));
        const destSlotsPayload = currentProcessedDestSlots.map(slot => ({
            id: slot.id,
            files: slot.files
                ? slot.files.map(f => ({ path: getRelativePath(f.webkitRelativePath, slot.handle.name), file: f }))
                : null
        }));

        const worker = new Worker(new URL('../workers/equalityWorker.js', import.meta.url), { type: 'module' });

        worker.onmessage = (e) => {
            if (!isCancelled) {
                setFileEqualityMap(e.data);
            }
            worker.terminate();
        };

        worker.onerror = (err) => {
            console.error("Worker error:", err);
            worker.terminate();
        };

        worker.postMessage({ originFiles: originFilesPayload, destSlots: destSlotsPayload });

        return () => {
            isCancelled = true;
            worker.terminate();
        };
    }, [hasProcessed, activeTab, tabs, setFileEqualityMap]);
};
