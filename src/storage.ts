export interface StorageWriteResult {
  ok: boolean;
  error?: unknown;
}

/** Read a JSON value from browser storage and safely fall back to defaults. */
export function readLocalState<T>(
  key: string,
  defaults: T,
  normalize: (stored: unknown, defaults: T) => T,
): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return structuredClone(defaults);
    return normalize(JSON.parse(raw) as unknown, structuredClone(defaults));
  } catch {
    return structuredClone(defaults);
  }
}

/** Persist the local workspace. The caller decides how to surface quota errors. */
export function writeLocalState<T>(key: string, value: T): StorageWriteResult {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}
