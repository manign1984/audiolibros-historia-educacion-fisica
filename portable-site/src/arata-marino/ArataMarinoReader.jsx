import IntegratedReader from '../IntegratedReader.jsx';
import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import preparedReading from './readingDocument.generated.json';
import { createArataMarinoReaderConfig } from './readerConfig.js';

// Un único circuito. El PDF y el SRT originales se procesan durante la
// compilación y no se pide a quien estudia que seleccione archivos.
const assetBase = import.meta.env.BASE_URL + 'assets/arata-marino/';
const baseConfig = createArataMarinoReaderConfig(assetBase);
const config = {
  ...baseConfig,
  sync: { ...baseConfig.sync, paragraphTimings: preparedReading.paragraphTimings },
};

export default function ArataMarinoReader() {
  return <IntegratedReader
    readingDocument={preparedReading.document}
    config={config}
    Launcher={CanonicalReadingEntry}
  />;
}
