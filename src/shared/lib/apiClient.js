export const apiClient = {
    readFilter: async (filename) => {
        if (window.electronAPI) {
            return await window.electronAPI.readFilter(filename);
        } else {
            const res = await fetch(`/api/filters/${filename}?t=${Date.now()}`);
            if (!res.ok) throw new Error('Not found');
            return await res.text();
        }
    },
    writeFilter: async (filename, content) => {
        if (window.electronAPI) {
            return await window.electronAPI.writeFilter(filename, content);
        } else {
            const res = await fetch(`/api/filters/${filename}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            if (!res.ok) throw new Error('Error saving');
            return await res.text();
        }
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
