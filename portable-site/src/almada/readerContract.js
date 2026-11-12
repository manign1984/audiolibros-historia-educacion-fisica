import prepared from './readingDocument.generated.json';
import { createAlmadaReaderConfig } from './readerConfig.js';

// BASE_URL asegura una única implementación para raíz y GitHub Pages.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const assetBase = base + '/assets/almada/';
const config = createAlmadaReaderConfig(assetBase);

export const almadaReaderConfig = {
  ...config,
  sync: { ...config.sync, paragraphTimings: prepared.paragraphTimings },
};
export const almadaReadingDocument = prepared.document;
export const almadaLegacyPageMap = prepared.legacyPageMap;
