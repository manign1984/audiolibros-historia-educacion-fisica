import { normalizeNotes, resolvePage } from '../shared/textOnlyReaderModel.js';
import { audioDuration, legacyPageMap, readerConfig } from './readerConfig.js';

const oldNotesKey = 'torre-pastoriza-bienestar-text-notes-v1';
const oldPageKey = 'torre-pastoriza-bienestar-text-page-v1';

export function migrateTextReaderState() {
  try {
    const storage = window.localStorage;
    const { notesKey, stateKey } = readerConfig.storage;
    if (storage.getItem(notesKey) === null) {
      const notes = normalizeNotes(JSON.parse(storage.getItem(oldNotesKey) || '[]'));
      const migrated = notes.filter(note => legacyPageMap[note.page]).map(note => ({
        id: note.id,
        sentenceId: legacyPageMap[note.page],
        text: note.text,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      }));
      if (migrated.length) storage.setItem(notesKey, JSON.stringify(migrated));
    }

    const oldPage = storage.getItem(oldPageKey);
    if (storage.getItem(stateKey) === null && oldPage !== null) {
      const page = resolvePage(oldPage, legacyPageMap.length);
      const timings = new Map(readerConfig.sync.paragraphTimings
        .filter(item => Number.isFinite(item.start)).map(item => [item.id, item]));
      const timing = timings.get(legacyPageMap[page])
        ?? legacyPageMap.slice(page + 1)
          .map(id => timings.get(id)).find(Boolean);
      storage.setItem(stateKey, JSON.stringify({ currentTime: timing?.start ?? audioDuration }));
    }
  } catch {
    // El lector sigue disponible con el almacenamiento local deshabilitado.
  }
}
