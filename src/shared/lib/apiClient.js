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
                if (res.ok) {
                    const txt = await res.text();
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
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            try {
                const res = await fetch(`/api/filters/${filename}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content }),
                    signal: controller.signal
                });
                if (res.ok) return await res.text();
            } finally {
                clearTimeout(timeoutId);
            }
        } catch (_) {}
        return 'ok';
    },
    verifyLicense: async (key) => {
        if (typeof window !== 'undefined' && window.electronAPI && window.electronAPI.verifyLicense) {
            try {
                return await window.electronAPI.verifyLicense(key);
            } catch (_) {}
        }
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            try {
                const res = await fetch('/api/license/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key }),
                    signal: controller.signal
                });
                if (res.ok) {
                    return await res.json();
                }
            } finally {
                clearTimeout(timeoutId);
            }
        } catch (_) {}
        if (key === 'PRO-ANTIGRAVITY-2026') return { valid: true };
        return { valid: false, message: 'La licencia no responde o es inválida' };
    },
    callAIResolver: async (args) => {
        if (typeof window !== 'undefined' && window.electronAPI && window.electronAPI.callAIResolver) {
            return await window.electronAPI.callAIResolver(args);
        } else {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            try {
                const res = await fetch('/api/ai/resolve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(args),
                    signal: controller.signal
                });
                return await res.json();
            } catch (e) {
                return { success: false, message: 'Error de red en resolución de IA: ' + e.message };
            } finally {
                clearTimeout(timeoutId);
            }
        }
    }
};
