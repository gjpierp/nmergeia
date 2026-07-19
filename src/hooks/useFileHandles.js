import { useAppStore } from '../app/useAppStore.js';

/**
 * Hook que encapsula toda la interacción con los pickers de sistema de archivos
 * del navegador (showDirectoryPicker / showOpenFilePicker).
 */
export const useFileHandles = () => {
    const setOriginHandle = useAppStore(s => s.setOriginHandle);
    const setOriginPath = useAppStore(s => s.setOriginPath);
    const setDestSlots = useAppStore(s => s.setDestSlots);
    const setHasProcessed = useAppStore(s => s.setHasProcessed);

    const openOrigin = async (type) => {
        try {
            let handleObj;
            if (type === 'folder') {
                const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
                handleObj = dirHandle;
            } else {
                const fileHandles = await window.showOpenFilePicker({ multiple: true });
                handleObj = {
                    type: 'files',
                    handles: fileHandles,
                    name: fileHandles.length === 1 ? fileHandles[0].name : `${fileHandles.length} archivos`
                };
            }
            setOriginHandle(handleObj);
            setOriginPath(handleObj.name);
            setHasProcessed(false);
        } catch (_e) {}
    };

    const openDest = async (slotId, type) => {
        try {
            let handleObj;
            if (type === 'folder') {
                const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
                handleObj = dirHandle;
            } else {
                const fileHandles = await window.showOpenFilePicker({ multiple: true });
                handleObj = {
                    type: 'files',
                    handles: fileHandles,
                    name: fileHandles.length === 1 ? fileHandles[0].name : `${fileHandles.length} archivos`
                };
            }
            setDestSlots(prev => prev.map(s => s.id === slotId ? { ...s, handle: handleObj, path: handleObj.name } : s));
            setHasProcessed(false);
        } catch (_e) {}
    };

    const addDestSlot = () => {
        setDestSlots(prev => [...prev, { id: Date.now(), handle: null, files: [], path: '' }]);
    };

    const removeDestSlot = (id) => {
        setDestSlots(prev => prev.filter(s => s.id !== id));
    };

    return { openOrigin, openDest, addDestSlot, removeDestSlot };
};
