import prepared from './readingDocument.generated.json';
import { pineauDictaduraReaderConfig } from './readerConfig.js';

// El texto procede del documento académico de trabajo; el SRT aporta solo tiempos.
export const pineauDictaduraReadingDocument = prepared.document;
export const pineauDictaduraReader = {
  ...pineauDictaduraReaderConfig,
  sync: {
    ...pineauDictaduraReaderConfig.sync,
    paragraphTimings: prepared.paragraphTimings,
  },
};
