/**
 * Computa un hash FNV-1a de 32 bits por bloques de 64KB de forma asíncrona
 * para mantener un consumo de memoria constante O(1).
 */
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

/**
 * Calcula de forma ultrarrápida O(N) la cantidad estimada de líneas añadidas y eliminadas
 * utilizando mapas de conjuntos de frecuencias para evitar cuellos de botella cuadráticos O(N^2).
 */
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

self.onmessage = async (e) => {
    const { originFiles, destSlots } = e.data;
    const newMap = {};
    
    const destMaps = destSlots.map(slot => {
        const map = new Map();
        if (slot.files) {
            for (const f of slot.files) {
                map.set(f.path, f.file);
            }
        }
        return { id: slot.id, map };
    });

    const tasks = [];
    for (const oFile of originFiles) {
        for (const slot of destMaps) {
            const dFile = slot.map.get(oFile.path);
            if (dFile) {
                const key = `${slot.id}-${oFile.path}`;
                
                tasks.push(async () => {
                    try {
                        let nativeOFile = oFile.file;
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
                    } catch(_e) {
                        newMap[key] = { status: 'different', added: 0, deleted: 0 };
                    }
                });
            }
        }
    }
    
    // Procesar en lotes de 20 tareas concurrentes en paralelo
    const BATCH_SIZE = 20;
    for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
        const batch = tasks.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(fn => fn()));
    }
    
    self.postMessage(newMap);
};
