import prepared from './readingDocument.generated.json';
import { levorattiReaderConfig } from './readerConfig.js';

// Únicamente datos académicos y temporales de esta obra.
// El SRT proporciona marcas para resaltar párrafos; no genera subtítulos visibles.
export const levorattiReadingDocument = prepared.document;
export const levorattiParagraphTimings = prepared.paragraphTimings;
export const levorattiLegacyPageMap = prepared.legacyPageMap;
export const levorattiIntegratedConfig = {
  ...levorattiReaderConfig,
  sync: {
    ...levorattiReaderConfig.sync,
    paragraphTimings: prepared.paragraphTimings,
  },
};
