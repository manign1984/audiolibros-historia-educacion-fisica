import preparedReading from './readingDocument.generated.json';
import { createArataMarinoReaderConfig } from './readerConfig.js';

// Contrato consumido por la página y el validador compartido.
// BASE_URL permite compilar sin cambios para raíz o GitHub Pages.
const assetBase = `${import.meta.env.BASE_URL}assets/arata-marino/`;
const baseConfig = createArataMarinoReaderConfig(assetBase);

export const arataReaderConfig = {
  ...baseConfig,
  sync: { ...baseConfig.sync, paragraphTimings: preparedReading.paragraphTimings },
};
export const arataReadingDocument = preparedReading.document;
