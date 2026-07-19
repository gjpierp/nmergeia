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
 * Calcula de forma ligera la cantidad de líneas añadidas y eliminadas
 * usando el algoritmo LCS para archivos de tamaño razonable.
 */
function countLineChanges(oldText, newText) {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const m = oldLines.length;
    const n = newLines.length;
    
    if (m > 2000 || n > 2000) {
        return { added: Math.max(0, n - m), deleted: Math.max(0, m - n) };
    }

    const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (oldLines[i - 1].trim() === newLines[j - 1].trim()) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const lcsLength = dp[m][n];
    const deleted = m - lcsLength;
    const added = n - lcsLength;
    
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

    for (const oFile of originFiles) {
        for (const slot of destMaps) {
            const dFile = slot.map.get(oFile.path);
            if (dFile) {
                const key = `${slot.id}-${oFile.path}`;
                
                // Si el tamaño difiere, son diferentes (O(1))
                if (oFile.file.size !== dFile.size) {
                    newMap[key] = { status: 'different', added: 0, deleted: 0 };
                    continue;
                }

                // Si tienen el mismo tamaño
                if (oFile.file.size > 500 * 1024) {
                    try {
                        const oHash = await computeFileHash(oFile.file);
                        const dHash = await computeFileHash(dFile);
                        if (oHash === dHash) {
                            newMap[key] = { status: 'identical', added: 0, deleted: 0 };
                        } else {
                            newMap[key] = { status: 'different', added: 0, deleted: 0 };
                        }
                    } catch(_e) {
                        newMap[key] = { status: 'different', added: 0, deleted: 0 };
                    }
                } else {
                    // Para archivos pequeños, cargamos texto normalizado
                    try {
                        const oText = await oFile.file.text();
                        const dText = await dFile.text();
                        const normalize = t => t.replace(/^\uFEFF/, '').replace(/\s+/g, ' ').trim();
                        if (normalize(oText) === normalize(dText)) {
                            newMap[key] = { status: 'identical', added: 0, deleted: 0 };
                        } else {
                            const stats = countLineChanges(oText, dText);
                            newMap[key] = { status: 'different', added: stats.added, deleted: stats.deleted };
                        }
                    } catch(_e) {
                        newMap[key] = { status: 'different', added: 0, deleted: 0 };
                    }
                }
            }
        }
    }
    
    self.postMessage(newMap);
};
