/** Read a JSON value from browser storage and safely fall back to defaults. */
export function readLocalState(key, defaults, normalize) {
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw)
            return structuredClone(defaults);
        return normalize(JSON.parse(raw), structuredClone(defaults));
    }
    catch {
        return structuredClone(defaults);
    }
}
/** Persist the local workspace. The caller decides how to surface quota errors. */
export function writeLocalState(key, value) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return { ok: true };
    }
    catch (error) {
        return { ok: false, error };
    }
}
