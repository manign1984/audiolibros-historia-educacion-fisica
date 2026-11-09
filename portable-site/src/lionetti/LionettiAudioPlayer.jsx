import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, RotateCw, Volume2 } from 'lucide-react';
import { findLionettiSubtitle, parseLionettiSubtitles, readableAudioTime } from './lionettiSubtitles.js';
import './lionetti-audio.css';

function readAudioProgress(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '{}');
    return {
      currentTime: Number.isFinite(value.currentTime) ? Math.max(0, value.currentTime) : 0,
      playbackRate: [0.9, 1, 1.1, 1.25, 1.5].includes(value.playbackRate) ? value.playbackRate : 1,
    };
  } catch { return { currentTime: 0, playbackRate: 1 }; }
}

export default function LionettiAudioPlayer({ open, config }) {
  const audioRef = useRef(null);
  const savedRef = useRef(readAudioProgress(config.audio.stateKey));
  const [src, setSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadedParts, setLoadedParts] = useState(0);
  const [error, setError] = useState('');
  const [subtitleError, setSubtitleError] = useState('');
  const [cues, setCues] = useState([]);
  const [showCaptions, setShowCaptions] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(savedRef.current.currentTime);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(savedRef.current.playbackRate);

  useEffect(() => {
    if (!open) return undefined;
    const controller = new AbortController();
    let objectUrl = '';

    setLoading(true);
    setLoadedParts(0);
    setError('');
    setSubtitleError('');
    setSrc('');
    setPlaying(false);
    setDuration(0);

    // Los subtítulos se cargan independientemente del MP3: el texto sigue
    // siendo accesible aunque el audio no se descargue.
    (async () => {
      try {
        const response = await fetch(config.audio.srtUrl, { signal: controller.signal });
        if (!response.ok) throw new Error('SRT ' + response.status);
        const subtitles = parseLionettiSubtitles(await response.text());
        if (!subtitles.length) throw new Error('El SRT no contiene subtítulos válidos.');
        if (!controller.signal.aborted) setCues(subtitles);
      } catch (failure) {
        if (!controller.signal.aborted) setSubtitleError('No se pudieron cargar los subtítulos. El texto académico sigue disponible.');
      }
    })();

    (async () => {
      try {
        const buffers = [];
        // Grupos acotados para no abrir 63 solicitudes simultáneas en móviles.
        for (let start = 0; start < config.audio.parts.length; start += 6) {
          const partUrls = config.audio.parts.slice(start, start + 6);
          const batch = await Promise.all(partUrls.map(async url => {
            const response = await fetch(url, { signal: controller.signal, cache: 'force-cache' });
            if (!response.ok) throw new Error('Fragmento del audio: HTTP ' + response.status);
            return response.arrayBuffer();
          }));
          if (controller.signal.aborted) return;
          buffers.push(...batch);
          setLoadedParts(buffers.length);
        }
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(new Blob(buffers, { type: 'audio/mpeg' }));
        setSrc(objectUrl);
      } catch (failure) {
        if (!controller.signal.aborted) setError('No fue posible cargar el audio. Podés seguir leyendo o abrir el original en Drive.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => {
      controller.abort();
      const player = audioRef.current;
      if (player) {
        // No resetear src/load al cerrar: puede disparar un timeupdate a 0
        // y borrar inadvertidamente el punto de reproducción recuperable.
        player.pause();
      }
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [open, config.audio.parts, config.audio.srtUrl]);

  useEffect(() => {
    if (!open || !src || !duration) return;
    // Permitir que una segunda apertura retome el último punto de la misma sesión.
    savedRef.current = { currentTime, playbackRate: rate };
    try { localStorage.setItem(config.audio.stateKey, JSON.stringify({ currentTime, playbackRate: rate })); }
    catch { /* El progreso sigue disponible durante la sesión. */ }
  }, [open, currentTime, rate, config.audio.stateKey]);

  const caption = useMemo(() => findLionettiSubtitle(cues, currentTime), [cues, currentTime]);

  function onMetadata(event) {
    const player = event.currentTarget;
    const audioDuration = Number.isFinite(player.duration) ? player.duration : 0;
    setDuration(audioDuration);
    player.playbackRate = rate;
    const resumeTime = Math.min(savedRef.current.currentTime, Math.max(0, audioDuration - 0.1));
    if (resumeTime > 0) {
      player.currentTime = resumeTime;
      setCurrentTime(resumeTime);
    }
  }
  function seek(seconds) {
    const player = audioRef.current;
    if (!player || !src || !Number.isFinite(seconds)) return;
    const target = Math.max(0, Math.min(duration || 0, seconds));
    player.currentTime = target;
    setCurrentTime(target);
  }
  function toggle() {
    const player = audioRef.current;
    if (!player || !src) return;
    if (player.paused) player.play().catch(() => setError('No se pudo iniciar la reproducción del audio.'));
    else player.pause();
  }
  function changeRate(event) {
    const next = Number(event.target.value);
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }

  return <section className="ln-audio" aria-label="Audiolibro y subtítulos de Lucía Lionetti">
    <audio
      ref={audioRef}
      src={src || undefined}
      preload="metadata"
      onLoadedMetadata={onMetadata}
      onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onEnded={() => setPlaying(false)}
      onError={() => { if (src) setError('El navegador no pudo reproducir el audio.'); }}
    />
    <div className="ln-audio-controls">
      <div className="ln-audio-buttons">
        <button type="button" onClick={() => seek(currentTime - 10)} disabled={!src || !duration} aria-label="Retroceder 10 segundos" title="Retroceder 10 segundos"><RotateCcw size={19}/><span>10 s</span></button>
        <button className="ln-audio-primary" type="button" onClick={toggle} disabled={!src || !duration} aria-label={playing ? 'Pausar audiolibro' : 'Reproducir audiolibro'}>{playing ? <Pause size={20}/> : <Play size={20}/>}<span>{playing ? 'Pausar' : 'Escuchar'}</span></button>
        <button type="button" onClick={() => seek(currentTime + 10)} disabled={!src || !duration} aria-label="Avanzar 10 segundos" title="Avanzar 10 segundos"><RotateCw size={19}/><span>10 s</span></button>
      </div>
      <div className="ln-audio-timeline">
        <input type="range" min="0" max={duration || 1} step="0.1" value={Math.min(currentTime, duration || 1)} disabled={!src || !duration}
          onChange={event => seek(Number(event.target.value))} aria-label="Posición del audiolibro"/>
        <div className="ln-audio-time"><span>{readableAudioTime(currentTime)}</span><span>{duration ? readableAudioTime(duration) : '--:--:--'}</span></div>
      </div>
      <label className="ln-audio-speed" htmlFor="ln-audio-speed"><Volume2 size={16}/> Velocidad
        <select id="ln-audio-speed" value={rate} onChange={changeRate}>
          <option value={0.9}>0,9×</option><option value={1}>1×</option><option value={1.1}>1,1×</option><option value={1.25}>1,25×</option><option value={1.5}>1,5×</option>
        </select>
      </label>
    </div>
    <div className="ln-audio-captions">
      <label><input type="checkbox" checked={showCaptions} onChange={event => setShowCaptions(event.target.checked)}/> Mostrar subtítulos</label>
      <div className="ln-audio-caption-text" aria-label="Subtítulo según tiempo del SRT">
        {showCaptions ? (caption?.text || (loading ? 'Preparando audiolibro…' : 'Subtítulos según las marcas de tiempo del archivo SRT.')) : 'Subtítulos ocultos'}
      </div>
    </div>
    {loading && <p className="ln-audio-status" role="status">Cargando audio: {loadedParts} de {config.audio.parts.length} fragmentos…</p>}
    {error && <p className="ln-audio-error" role="alert">{error} <a href={config.audio.externalUrl} target="_blank" rel="noreferrer">Audio original</a></p>}
    {subtitleError && <p className="ln-audio-error" role="status">{subtitleError}</p>}
    <div className="ln-audio-links"><a href={config.audio.srtUrl} download>Descargar subtítulos SRT</a><a href={config.audio.externalUrl} target="_blank" rel="noreferrer">Escuchar en Drive</a></div>
  </section>;
}
