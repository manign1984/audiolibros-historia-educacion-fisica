import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import { createArataMarinoReaderConfig } from './readerConfig.js';

// Acceso legítimo a la edición oficial mientras no sea distribuible el
// texto académico con su audio. No se hace pasar un enlace por lector.
export const ARATA_MARINO_OFFICIAL_EDITION =
  'https://digital.noveduc.com/library/publication/la-educacion-en-la-argentina';
const entryConfig = createArataMarinoReaderConfig('/lectura-restringida/');
const initialProgress = { currentTime: 0, currentPage: 1 };

export default function ArataMarinoEditorialAccess() {
  return <CanonicalReadingEntry
    config={entryConfig}
    progress={initialProgress}
    noteCount={0}
    onOpen={() => window.open(ARATA_MARINO_OFFICIAL_EDITION, '_blank', 'noopener,noreferrer')}
    buttonLabel="CONSULTAR EDICIÓN"
    buttonAriaLabel="Consultar la edición digital oficial (se abre en otra pestaña)"
    hasDialog={false}
  />;
}
