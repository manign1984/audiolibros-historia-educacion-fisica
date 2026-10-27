export const LIST_KEY = 'tec-library-list-v1';

export function readList(storage, validIds) {
  try {
    const value = JSON.parse(storage.getItem(LIST_KEY) || '[]');
    return Array.isArray(value) ? [...new Set(value.filter((id) => validIds.includes(id)))] : [];
  } catch { return []; }
}

export function saveList(storage, ids) {
  try { storage.setItem(LIST_KEY, JSON.stringify(ids)); return true; }
  catch { return false; }
}

export function readProgress(storage, entry) {
  if (!entry.stateKey || !entry.duration) return 0;
  try {
    const seconds = JSON.parse(storage.getItem(entry.stateKey) || '{}')?.currentTime;
    return Number.isFinite(seconds) ? Math.min(entry.duration, Math.max(0, seconds)) : 0;
  } catch { return 0; }
}

export function formatDuration(seconds) {
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
