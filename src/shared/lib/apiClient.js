export const FILTER_LOCAL_KEY = 'nmerge_filter_local';

export const apiClient = {
    readFilter: async (filename) => {
        // 1. Electron primero
        if (typeof window !== 'undefined' && window.electronAPI && window.electronAPI.readFilter) {
            try {
                const val = await window.electronAPI.readFilter(filename);
                if (val !== null && val !== undefined) return val;
            } catch (_) {}
        }
        // 2. localStorage unificado (siempre disponible, sin depender del servidor)
        if (typeof window !== 'undefined') {
            const local = localStorage.getItem(FILTER_LOCAL_KEY);
            if (local !== null) return local; // Even if empty, return it (user deleted all filters)
        }
        // 3. Servidor (con timeout de 3s como fallback remoto)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            try {
                const res = await fetch(`/api/filters/${filename}?t=${Date.now()}`, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (res.ok) {
                    const txt = await res.text();
                    // Persistir en local para la próxima vez
                    if (typeof window !== 'undefined' && txt && txt.trim() !== '') {
                        localStorage.setItem(FILTER_LOCAL_KEY, txt);
                    }
                    return txt;
                }
            } finally {
                clearTimeout(timeoutId);
            }
        } catch (_) {}
        return '';
    },
    writeFilter: async (filename, content) => {
        // 1. Siempre persistir en localStorage PRIMERO (disponible offline, sin servidor)
        if (typeof window !== 'undefined') {
            localStorage.setItem(FILTER_LOCAL_KEY, content);
        }
        // 2. Electron
        if (typeof window !== 'undefined' && window.electronAPI && window.electronAPI.writeFilter) {
            try {
                return await window.electronAPI.writeFilter(filename, content);
            } catch (_) {}
        }
        // 3. Servidor (best-effort, sin bloquear si falla)
        try {
            const res = await fetch(`/api/filters/${filename}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            if (res.ok) return await res.text();
        } catch (_) {}
        return 'ok';
    },
    verifyLicense: async (key) => {
        if (window.electronAPI) {
            return await window.electronAPI.verifyLicense(key);
        } else {
            const res = await fetch('/api/license/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key })
            });
            return await res.json();
        }
    },
    callAIResolver: async (args) => {
        if (window.electronAPI) {
            return await window.electronAPI.callAIResolver(args);
        } else {
            const res = await fetch('/api/ai/resolve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(args)
            });
            return await res.json();
        }
    }
};
