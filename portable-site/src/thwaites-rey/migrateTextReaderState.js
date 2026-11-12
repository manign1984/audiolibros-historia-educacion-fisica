import { normalizeNotes, resolvePage } from '../shared/textOnlyReaderModel.js';
import { legacyPageMap, readerConfig } from './readerConfig.js';

const oldNotesKey = 'thwaites-rey-democracia-argentina-text-notes-v1';
const oldPageKey = 'thwaites-rey-democracia-argentina-text-page-v1';

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
      const timing = readerConfig.sync.paragraphTimings.find(({ id }) => id === legacyPageMap[page]);
      if (timing) storage.setItem(stateKey, JSON.stringify({ currentTime: page === 0 ? 0 : timing.start }));
    }
  } catch {
    // El lector sigue disponible si el almacenamiento local no está disponible.
  }
}
