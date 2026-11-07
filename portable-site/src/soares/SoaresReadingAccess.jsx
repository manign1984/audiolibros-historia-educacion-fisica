import { useRef } from 'react';
import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import { soaresParagraphPreviewConfig } from './paragraphPreviewConfig.js';

const PDF_URL = 'https://drive.google.com/file/d/1xOnn6jLmUI5wj72noq18J53oh5-nkyOT/view';
const AUDIO_URL = 'https://drive.google.com/file/d/1KAthUKiHsNqHg8sYIwPqzvJNgbGGbkt-/view';

// La presentación emplea el componente canónico; solo la modalidad de acceso
// cambia mientras el capítulo y la narración no estén alojados para el lector común.
export default function SoaresReadingAccess() {
  const dialog = useRef(null);
  return <>
    <CanonicalReadingEntry
      onOpen={() => dialog.current?.showModal()}
      progress={{ currentTime: 0 }}
      noteCount={0}
      config={soaresParagraphPreviewConfig}
      buttonLabel="CONSULTAR EL TEXTO"
      buttonAriaLabel="Consultar texto y audiolibro de Carmen Lucia Soares"
    />
    <dialog ref={dialog} className="so-reading-dialog" aria-labelledby="so-reading-access-title">
      <div className="so-reading-dialog__body">
        <p className="so-reading-dialog__eyebrow">Carmen Lucia Soares · Capítulo académico</p>
        <h3 id="so-reading-access-title">Lectura y audiolibro</h3>
        <p>Consultá el capítulo en su carpeta de cátedra y escuchá el audiolibro desde el espacio institucional del proyecto.</p>
        <nav className="so-reading-dialog__links" aria-label="Recursos de lectura">
          <a href={PDF_URL} target="_blank" rel="noreferrer">Abrir capítulo de cátedra</a>
          <a href={AUDIO_URL} target="_blank" rel="noreferrer">Abrir audiolibro</a>
        </nav>
        <p className="so-reading-dialog__note">El audiolibro puede requerir acceso institucional. Las anotaciones y el seguimiento aproximado por párrafos estarán disponibles en el lector integrado cuando se habiliten sus archivos.</p>
        <button className="so-reading-dialog__close" type="button" onClick={() => dialog.current?.close()}>Cerrar</button>
      </div>
    </dialog>
  </>;
}
