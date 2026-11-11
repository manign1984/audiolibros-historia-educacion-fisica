import { useEffect, useMemo, useState } from 'react';
import IntegratedReader from '../IntegratedReader.jsx';
import CanonicalReadingEntry from '../shared/CanonicalReadingEntry.jsx';
import { buildArataMarinoReadingDocument } from './buildArataMarinoReadingDocument.js';
import { createArataMarinoReaderConfig } from './readerConfig.js';

// Esta vista se habilita únicamente en desarrollo, por decisión explícita.
// Los archivos de trabajo se mantienen locales y fuera del control de versiones.
export default function ArataMarinoReaderPreview({ assetBase }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const config = useMemo(() => createArataMarinoReaderConfig(assetBase), [assetBase]);
  useEffect(() => {
    const controller = new AbortController();
    const load = async (path) => {
      const response = await fetch(path, { signal: controller.signal });
      if (!response.ok) throw Error('No se pudo cargar el recurso de trabajo (' + response.status + ').');
      return response.text();
    };
    Promise.all([load(config.textUrl), load(assetBase + 'subtitulos.srt')])
      .then(([academic, srt]) => {
        if (!controller.signal.aborted) setData(buildArataMarinoReadingDocument(academic, srt));
      })
      .catch((cause) => {
        if (cause.name !== 'AbortError') setError('No pudo iniciarse el lector local: ' + cause.message);
      });
    return () => controller.abort();
  }, [assetBase, config.textUrl]);
  if (error) return <p role="status">{error}</p>;
  if (!data) return <p role="status">Preparando la lectura de prueba…</p>;
  return <IntegratedReader
    readingDocument={data.document}
    config={{ ...config, sync: { ...config.sync, paragraphTimings: data.paragraphTimings } }}
    Launcher={CanonicalReadingEntry}
  />;
}
