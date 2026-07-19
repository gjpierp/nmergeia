import { useAppStore } from '../app/useAppStore.js';
import { verifyPermission } from '../features/directory-sync/api/FileSystemService.js';
import { apiClient } from '../shared/lib/apiClient.js';
import { showModal } from '../shared/ui/CustomModal.jsx';
import { saveHandle } from '../shared/lib/DatabaseService.js';

/**
 * Hook que gestiona la carga y el guardado de perfiles de comparación (Historial).
 */
export const useProfiles = () => {
    const setOriginHandle = useAppStore(s => s.setOriginHandle);
    const setOriginPath = useAppStore(s => s.setOriginPath);
    const setDestSlots = useAppStore(s => s.setDestSlots);
    const setHasProcessed = useAppStore(s => s.setHasProcessed);
    const setLoadedProfileId = useAppStore(s => s.setLoadedProfileId);
    const setLoadedProfileName = useAppStore(s => s.setLoadedProfileName);
    const setSavedProfiles = useAppStore(s => s.setSavedProfiles);
    const addToast = useAppStore(s => s.addToast);

    const originHandle = useAppStore(s => s.originHandle);
    const destSlots = useAppStore(s => s.destSlots);

    const loadProfile = async (profile) => {
        setLoadedProfileName(profile.name);
        try {
            if (profile.originHandle) {
                setOriginHandle(profile.originHandle);
                setOriginPath(profile.originHandle.name);
                if (profile.originHandle.type === 'files') {
                    await Promise.all(profile.originHandle.handles.map(h => verifyPermission(h)));
                } else {
                    await verifyPermission(profile.originHandle);
                }
            }
            const newSlots = [];
            for (const slot of profile.destSlots) {
                if (slot.handle) {
                    newSlots.push({ id: slot.id, handle: slot.handle, path: slot.handle.name, files: [] });
                    if (slot.handle.type === 'files') {
                        await Promise.all(slot.handle.handles.map(h => verifyPermission(h)));
                    } else {
                        await verifyPermission(slot.handle);
                    }
                } else {
                    newSlots.push({ id: slot.id, handle: null, path: '', files: [] });
                }
            }
            setDestSlots(newSlots);

            if (profile.filterContent) {
                await apiClient.writeFilter('filtro.txt', profile.filterContent).catch(_e => {});
            }

            setLoadedProfileId(profile.id);
            setHasProcessed(false);
        } catch (_e) {
            alert("No se pudieron cargar los permisos de las carpetas guardadas.");
        }
    };

    const saveCurrentProfile = async () => {
        if (!originHandle && destSlots.every(s => !s.handle)) {
            await showModal('alert', 'Aviso', "Selecciona al menos una carpeta antes de guardar.");
            return;
        }
        const customName = await showModal('prompt', 'Guardar Historial', "Ingresa un nombre para este historial (ej. Proyecto X):", "");
        if (!customName) return;

        let currentFilter = '';
        try {
            currentFilter = await apiClient.readFilter('filtro.txt');
        } catch (_e) {}

        const newProfile = {
            id: Date.now().toString(),
            name: customName,
            originHandle,
            destSlots: destSlots.map(s => ({ id: s.id, handle: s.handle })),
            filterContent: currentFilter
        };

        setSavedProfiles(prev => {
            const updated = [newProfile, ...prev].slice(0, 20);
            saveHandle('savedProfiles', updated);
            return updated;
        });
        setLoadedProfileId(newProfile.id);
        setLoadedProfileName(customName);
        addToast("Historial guardado exitosamente.", "success");
    };

    const renameProfile = async (profile) => {
        const newName = await showModal('prompt', 'Renombrar', "Nuevo nombre para el historial:", profile.name);
        if (newName && newName !== profile.name) {
            setSavedProfiles(prev => {
                const updated = prev.map(p => p.id === profile.id ? { ...p, name: newName } : p);
                saveHandle('savedProfiles', updated);
                return updated;
            });
        }
    };

    const deleteProfile = async (profile) => {
        const conf = await showModal('confirm', 'Eliminar', `Seguro que quieres eliminar "${profile.name}"?`);
        if (conf) {
            setSavedProfiles(prev => {
                const updated = prev.filter(p => p.id !== profile.id);
                saveHandle('savedProfiles', updated);
                return updated;
            });
        }
    };

    return { loadProfile, saveCurrentProfile, renameProfile, deleteProfile };
};
