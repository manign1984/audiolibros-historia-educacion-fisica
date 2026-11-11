import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpenText, ExternalLink, X } from 'lucide-react';
import IntegratedReader from '../IntegratedReader.jsx';
import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import { buildArataMarinoReadingDocument } from './buildArataMarinoReadingDocument.js';
import { createArataMarinoReaderConfig } from './readerConfig.js';

// El sitio público NO almacena ni distribuye el texto, audio o SRT protegidos.
// La lectura se construye exclusivamente desde archivos elegidos en el navegador.
const EDITION_URL = 'https://digital.noveduc.com/library/publication/la-educacion-en-la-argentina';
const EMPTY_PROGRESS = { currentTime: 0, currentPage: 1 };
const EXPECTED_AUDIO_BYTES = 36125008;

export default function ArataMarinoPrivateReader() {
  const access = useRef(null);
  const academicFile = useRef(null);
  const srtFile = useRef(null);
  const audioFile = useRef(null);
  const [prepared, setPrepared] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const config = useMemo(() => createArataMarinoReaderConfig('/lectura-privada/'), []);
  const audioUrl = prepared?.audioUrl;

  // El audio se conserva solamente en este navegador y se libera al salir.
  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  useEffect(() => {
    if (!prepared) return undefined;
    // Abrir el modal canónico en cuanto termine la selección, sin crear otro lector.
    const frame = window.requestAnimationFrame(() => {
      document.querySelector('#lectura .hb-material-open')?.click();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [prepared]);

  async function openFromOwnFiles(event) {
    event.preventDefault();
    if (loading) return;
    setError('');
    const academic = academicFile.current?.files?.[0];
    const srt = srtFile.current?.files?.[0];
    const audio = audioFile.current?.files?.[0];
    if (!academic || !srt || !audio) {
      setError('Seleccioná el texto académico, el archivo SRT y el audio MP3.');
      return;
    }
    if (audio.size !== EXPECTED_AUDIO_BYTES) {
      setError('El archivo de audio no coincide con la exportación de esta lectura.');
      return;
    }
    setLoading(true);
    try {
      const [academicText, subtitleText] = await Promise.all([academic.text(), srt.text()]);
      const result = buildArataMarinoReadingDocument(academicText, subtitleText);
      if (result.cues.length !== 796 || result.metrics.paragraphs < 79 ||
          result.metrics.timed < 78) {
        throw Error('Los archivos de texto y subtítulos no corresponden a esta edición.');
      }
      // audioMode=direct evita descargar desde GitHub el MP3; se usa el archivo local.
      const objectUrl = URL.createObjectURL(audio);
      setPrepared({
        audioUrl: objectUrl,
        document: result.document,
        timings: result.paragraphTimings,
      });
      access.current?.close();
    } catch (cause) {
      setError(cause.message || 'No pudieron abrirse los archivos seleccionados.');
    } finally {
      setLoading(false);
    }
  }

  const readerConfig = prepared ? {
    ...config,
    audioMode: 'direct',
    audiobookUrl: prepared.audioUrl,
    audiobookParts: [],
    sync: { ...config.sync, paragraphTimings: prepared.timings },
    readingEntry: {
      ...config.readingEntry,
      // La ficha conserva su redacción editorial canónica.
    },
  } : null;

  return prepared ? (
    <IntegratedReader
      readingDocument={prepared.document}
      config={readerConfig}
      Launcher={CanonicalReadingEntry}
    />
  ) : (
    <>
      <CanonicalReadingEntry
        onOpen={() => access.current?.showModal()}
        progress={EMPTY_PROGRESS}
        noteCount={0}
        config={config}
        buttonAriaLabel="Abrir lector con materiales guardados en este dispositivo"
      />
      <dialog
        ref={access}
        className="am-access-dialog am-private-reading-dialog"
        aria-labelledby="am-private-reading-title"
        aria-describedby="am-private-reading-help"
        onClose={() => setError('')}
      >
        <div className="am-access-dialog__head">
          <span><BookOpenText size={19} aria-hidden="true" /> LECTURA EN TU DISPOSITIVO</span>
          <form method="dialog">
            <button className="am-access-dialog__close" type="submit" aria-label="Cerrar"><X size={23} aria-hidden="true" /></button>
          </form>
        </div>
        <h2 id="am-private-reading-title">Abrí tu ejemplar en el lector</h2>
        <p id="am-private-reading-help">Seleccioná los materiales de lectura que ya tenés. El texto, los subtítulos y el audio se abren exclusivamente en este navegador, sin enviarse a servidores.</p>
        <form onSubmit={openFromOwnFiles} className="am-private-reading-form">
          <label htmlFor="am-academic-file">Texto académico (.txt preparado desde la edición)</label>
          <input ref={academicFile} id="am-academic-file" type="file" accept=".txt,text/plain" required />
          <label htmlFor="am-srt-file">Marcas temporales (.srt)</label>
          <input ref={srtFile} id="am-srt-file" type="file" accept=".srt,text/plain" required />
          <label htmlFor="am-audio-file">Audiolibro (.mp3)</label>
          <input ref={audioFile} id="am-audio-file" type="file" accept=".mp3,audio/mpeg" required />
          {error && <p className="am-private-reading-error" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className="am-access-dialog__link">
            {loading ? 'Abriendo los materiales…' : 'Continuar al lector integrado'}
          </button>
        </form>
        <a className="am-access-dialog__secondary" href={EDITION_URL} target="_blank" rel="noopener noreferrer">
          Consultar la edición digital oficial <ExternalLink size={15} aria-hidden="true" />
        </a>
      </dialog>
    </>
  );
}
