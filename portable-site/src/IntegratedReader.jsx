'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  BookmarkPlus,
  Check,
  ChevronDown,
  Download,
  ExternalLink,
  FastForward,
  FileJson,
  FileText,
  Headphones,
  List,
  Minus,
  NotebookPen,
  Pause,
  Pencil,
  Play,
  Plus,
  Rewind,
  Share2,
  SkipForward,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { readingDocument } from './readingDocument.js';

const AUDIOBOOK_DRIVE_ID = '17w1Pw25aGLXu_cR9mRBZgIOnCG2qNAEm';
const AUDIOBOOK_DRIVE_URL = `https://drive.google.com/file/d/${AUDIOBOOK_DRIVE_ID}/view`;
const AUDIOBOOK_URL = '/assets/pineau-audiolibro.mp3';
const PDF_URL = '/assets/pineau-renovacion-represion-cooptacion.pdf';
const NOTES_KEY = 'fresco-noble-reader-notes-v1';
const STATE_KEY = 'fresco-noble-reader-state-v1';

const EMPTY_STATE = {
  currentTime: 0,
  playbackRate: 1,
  volume: 1,
  followText: true,
  fontScale: 1,
};

function readStoredValue(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = JSON.parse(window.localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function migrateStoredNotes(notes) {
  if (!Array.isArray(notes)) return [];
  const mapping = readingDocument.legacySentenceMap || {};

  return notes.map((note) => {
    let sentenceId = note.sentenceId;
    const visited = new Set();
    while (mapping[sentenceId] && !visited.has(sentenceId)) {
      visited.add(sentenceId);
      sentenceId = mapping[sentenceId];
    }
    return sentenceId === note.sentenceId ? note : { ...note, sentenceId };
  });
}

function formatTime(seconds = 0) {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safe / 60);
  const remainder = Math.floor(safe % 60);
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function excerpt(text, length = 132) {
  if (!text || text.length <= length) return text || '';
  return `${text.slice(0, length).trimEnd()}…`;
}

function findActiveSentence(sentences, currentTime) {
  if (!sentences.length) return null;
  let low = 0;
  let high = sentences.length - 1;
  let candidate = sentences[0];

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (sentences[middle].start <= currentTime) {
      candidate = sentences[middle];
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return candidate;
}

function buildNotesText(notes, sentenceMap) {
  const lines = [
    'CUADERNO DE LECTURA',
    'Pablo Pineau · Renovación, represión, cooptación',
    `Exportado: ${new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date())}`,
    '',
  ];

  notes.forEach((note, index) => {
    const sentence = sentenceMap.get(note.sentenceId);
    lines.push(`${index + 1}. ${sentence?.sectionTitle || 'Texto'} · ${formatTime(sentence?.start || 0)}`);
    lines.push(`“${sentence?.text || 'Oración no disponible'}”`);
    lines.push(note.text);
    lines.push('');
  });

  lines.push('Las notas fueron creadas en el lector integrado de la experiencia Reforma Fresco–Noble.');
  return lines.join('\n');
}

function NoteCard({ note, sentence, onGo, onEdit, onDelete, compact = false }) {
  return (
    <article className={`margin-note ${compact ? 'margin-note--compact' : ''}`}>
      <button className="margin-note__jump" type="button" onClick={() => onGo(note)}>
        <span>{sentence?.sectionTitle || 'Texto'} · {formatTime(sentence?.start || 0)}</span>
        <q>{excerpt(sentence?.text, compact ? 92 : 118)}</q>
      </button>
      <p>{note.text}</p>
      <footer>
        <button type="button" onClick={() => onEdit(note)} aria-label="Editar nota">
          <Pencil size={14} aria-hidden="true" /> Editar
        </button>
        <button type="button" onClick={() => onDelete(note)} aria-label="Eliminar nota">
          <Trash2 size={14} aria-hidden="true" /> Eliminar
        </button>
      </footer>
    </article>
  );
}

function ReaderLauncher({ onOpen, progress, noteCount }) {
  const hasProgress = progress.currentTime > 3;
  const progressPercent = Math.min(100, (progress.currentTime / readingDocument.duration) * 100);

  return (
    <aside className="reader-launcher" aria-labelledby="reader-launcher-title">
      <div className="reader-launcher__masthead">
        <div className="reader-launcher__stamp" aria-hidden="true">
          <Headphones size={31} />
          <BookOpen size={25} />
        </div>
        <div className="reader-launcher__copy">
          <p className="eyebrow">Lector integrado · texto + audiolibro</p>
          <h3 id="reader-launcher-title">Leé, escuchá y anotá sin salir del recorrido</h3>
          <p>
            El texto sigue el audiolibro oración por oración. Podés detenerte, dejar una nota y volver a
            escuchar exactamente desde ese lugar.
          </p>
        </div>
      </div>

      <ul className="reader-launcher__features" aria-label="Funciones del lector">
        <li><span>01</span><strong>Oración activa</strong><small>El resaltado acompaña la voz sin convertir la lectura en un karaoke.</small></li>
        <li><span>02</span><strong>Anotaciones propias</strong><small>Se guardan solamente en este dispositivo.</small></li>
        <li><span>03</span><strong>Cuaderno portátil</strong><small>Descargá todo o compartilo con las aplicaciones instaladas.</small></li>
      </ul>

      <div className="reader-launcher__footer">
        <div className="reader-launcher__resume" aria-label={hasProgress ? `Lectura guardada en ${formatTime(progress.currentTime)}` : 'Lectura lista para comenzar'}>
          <div><span>{hasProgress ? 'Tu último punto' : 'Punto de partida'}</span><strong>{formatTime(progress.currentTime)}</strong></div>
          <div className="reader-launcher__progress"><i style={{ width: `${progressPercent}%` }} /></div>
          <span>{noteCount} {noteCount === 1 ? 'nota' : 'notas'}</span>
        </div>

        <div className="reader-launcher__actions">
          <button className="button button--dark" type="button" onClick={onOpen}>
            {hasProgress ? <SkipForward size={18} /> : <BookOpen size={18} />}
            {hasProgress ? `Continuar desde ${formatTime(progress.currentTime)}` : 'Entrar al lector integrado'}
          </button>
          <nav aria-label="Abrir los recursos originales">
            <a href={PDF_URL} target="_blank" rel="noreferrer">PDF <ExternalLink size={13} /></a>
            <a href={AUDIOBOOK_DRIVE_URL} target="_blank" rel="noreferrer">Audio <ExternalLink size={13} /></a>
          </nav>
        </div>
      </div>

      <p className="reader-launcher__privacy">
        <Check size={14} aria-hidden="true" /> No pide datos personales ni envía tus notas a ningún servidor.
      </p>
    </aside>
  );
}

export default function IntegratedReader({ showToast }) {
  const dialogRef = useRef(null);
  const audioRef = useRef(null);
  const textScrollRef = useRef(null);
  const resumeAfterEditorRef = useRef(false);
  const statusTimerRef = useRef(null);
  const restoredRef = useRef(false);
  const audioObjectUrlRef = useRef(null);
  const pendingSeekRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioSource, setAudioSource] = useState('');
  const [audioError, setAudioError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => readStoredValue(STATE_KEY, EMPTY_STATE).currentTime || 0);
  const [duration, setDuration] = useState(readingDocument.duration);
  const [playbackRate, setPlaybackRate] = useState(() => readStoredValue(STATE_KEY, EMPTY_STATE).playbackRate || 1);
  const [volume, setVolume] = useState(() => readStoredValue(STATE_KEY, EMPTY_STATE).volume ?? 1);
  const [muted, setMuted] = useState(false);
  const [followText, setFollowText] = useState(() => readStoredValue(STATE_KEY, EMPTY_STATE).followText ?? true);
  const [fontScale, setFontScale] = useState(() => readStoredValue(STATE_KEY, EMPTY_STATE).fontScale || 1);
  const [selectedSentenceId, setSelectedSentenceId] = useState(null);
  const [notes, setNotes] = useState(() => migrateStoredNotes(readStoredValue(NOTES_KEY, [])));
  const [editor, setEditor] = useState(null);
  const [editorText, setEditorText] = useState('');
  const [localStatus, setLocalStatus] = useState('');

  const sentences = useMemo(() => [
    ...(readingDocument.frontMatter || []).map((sentence) => ({
      ...sentence,
      sectionId: 'frontmatter',
      sectionTitle: 'Portada',
    })),
    ...readingDocument.sections.flatMap((section) => [
      ...(section.headingSentence ? [{ ...section.headingSentence, sectionId: section.id, sectionTitle: section.title }] : []),
      ...section.paragraphs.flatMap((paragraph) =>
        paragraph.sentences.map((sentence) => ({ ...sentence, sectionId: section.id, sectionTitle: section.title })),
      ),
    ]),
  ], []);

  const sentenceMap = useMemo(() => new Map(sentences.map((sentence) => [sentence.id, sentence])), [sentences]);
  const activeSentence = useMemo(() => findActiveSentence(sentences, currentTime), [sentences, currentTime]);
  const selectedSentence = sentenceMap.get(selectedSentenceId) || null;
  const annotationTarget = selectedSentence || activeSentence || sentences[0];
  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => (sentenceMap.get(a.sentenceId)?.start || 0) - (sentenceMap.get(b.sentenceId)?.start || 0)),
    [notes, sentenceMap],
  );
  const leftNotes = sortedNotes.filter((_, index) => index % 2 === 0);
  const rightNotes = sortedNotes.filter((_, index) => index % 2 === 1);

  const notify = useCallback((message) => {
    setLocalStatus(message);
    window.clearTimeout(statusTimerRef.current);
    statusTimerRef.current = window.setTimeout(() => setLocalStatus(''), 3200);
    showToast?.(message);
  }, [showToast]);

  useEffect(() => () => window.clearTimeout(statusTimerRef.current), []);

  useEffect(() => {
    if (!open || audioSource) return undefined;

    const controller = new AbortController();
    setAudioLoading(true);
    setAudioError(false);

    const prepareSeekableAudio = async () => {
      try {
        const response = await fetch(AUDIOBOOK_URL, {
          cache: 'force-cache',
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`No se pudo cargar el audio (${response.status})`);

        const blob = await response.blob();
        if (controller.signal.aborted) return;

        const objectUrl = URL.createObjectURL(blob);
        audioObjectUrlRef.current = objectUrl;
        setAudioSource(objectUrl);
      } catch (error) {
        if (error?.name !== 'AbortError') setAudioError(true);
      } finally {
        if (!controller.signal.aborted) setAudioLoading(false);
      }
    };

    prepareSeekableAudio();
    return () => controller.abort();
  }, [audioSource, open]);

  useEffect(() => () => {
    if (audioObjectUrlRef.current) URL.revokeObjectURL(audioObjectUrlRef.current);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    try {
      window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch {
      // El lector sigue funcionando si el navegador bloquea el almacenamiento local.
    }
  }, [notes]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STATE_KEY, JSON.stringify({
          currentTime,
          playbackRate,
          volume,
          followText,
          fontScale,
          updatedAt: new Date().toISOString(),
        }));
      } catch {
        // El progreso sigue en memoria durante la visita actual.
      }
    }, 450);
    return () => window.clearTimeout(timer);
  }, [currentTime, playbackRate, volume, followText, fontScale]);

  useEffect(() => {
    if (!open || !playing || !followText || !activeSentence) return;
    const target = document.querySelector(`[data-reader-sentence="${activeSentence.id}"]`);
    if (!target) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  }, [activeSentence?.id, followText, open, playing]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      const target = event.target;
      const editing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
      if (editing) return;
      if (event.code === 'Space') {
        event.preventDefault();
        if (playing) audioRef.current?.pause();
        else audioRef.current?.play().catch(() => setAudioError(true));
      }
      if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        openNoteEditor(annotationTarget?.id);
      }
      if (event.key === 'ArrowLeft' && event.altKey) {
        event.preventDefault();
        seekBy(-10);
      }
      if (event.key === 'ArrowRight' && event.altKey) {
        event.preventDefault();
        seekBy(10);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const closeReader = () => {
    audioRef.current?.pause();
    setPlaying(false);
    setEditor(null);
    setDrawerOpen(false);
    setOpen(false);
  };

  const handleAudioReady = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioReady(true);
    setAudioError(false);
    setDuration(Number.isFinite(audio.duration) ? audio.duration : readingDocument.duration);
    audio.playbackRate = playbackRate;
    audio.volume = volume;
    const pendingSeek = pendingSeekRef.current;
    if (!restoredRef.current || pendingSeek) {
      const requestedTime = pendingSeek?.time ?? currentTime;
      const targetTime = Math.min(requestedTime, Math.max(0, (audio.duration || readingDocument.duration) - 0.5));
      audio.currentTime = targetTime;
      setCurrentTime(targetTime);
      pendingSeekRef.current = null;
      restoredRef.current = true;
      if (pendingSeek?.shouldPlay) audio.play().catch(() => setAudioError(true));
    }
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) audio.pause();
    else audio.play().catch(() => setAudioError(true));
  };

  const seekTo = (time, shouldPlay = false) => {
    const nextTime = Math.max(0, Math.min(duration || readingDocument.duration, time));
    pendingSeekRef.current = { time: nextTime, shouldPlay };
    setCurrentTime(nextTime);
    const audio = audioRef.current;
    if (!audio || !audioSource || audio.readyState < 1) return;

    try {
      audio.currentTime = nextTime;
      pendingSeekRef.current = null;
      if (shouldPlay) audio.play().catch(() => setAudioError(true));
    } catch {
      // El salto se aplicará cuando el archivo local esté listo para reproducirse.
    }
  };

  const seekBy = (amount) => seekTo((audioRef.current?.currentTime ?? currentTime) + amount);

  const changeRate = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) audioRef.current.playbackRate = rate;
  };

  const changeVolume = (nextVolume) => {
    setVolume(nextVolume);
    setMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = nextVolume;
      audioRef.current.muted = false;
    }
  };

  const toggleMuted = () => {
    const next = !muted;
    setMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
  };

  const openNoteEditor = (sentenceId, note = null) => {
    if (!sentenceId) return;
    const audio = audioRef.current;
    resumeAfterEditorRef.current = Boolean(audio && !audio.paused);
    audio?.pause();
    setPlaying(false);
    setSelectedSentenceId(sentenceId);
    setEditor({ sentenceId, noteId: note?.id || null });
    setEditorText(note?.text || '');
    setDrawerOpen(false);
  };

  const closeNoteEditor = (resume = true) => {
    setEditor(null);
    setEditorText('');
    if (resume && resumeAfterEditorRef.current) {
      audioRef.current?.play().catch(() => setAudioError(true));
    }
    resumeAfterEditorRef.current = false;
  };

  const saveNote = () => {
    const text = editorText.trim();
    if (!text || !editor) return;
    const timestamp = new Date().toISOString();
    setNotes((current) => {
      if (editor.noteId) {
        return current.map((note) => note.id === editor.noteId ? { ...note, text, updatedAt: timestamp } : note);
      }
      return [...current, {
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sentenceId: editor.sentenceId,
        text,
        createdAt: timestamp,
        updatedAt: timestamp,
      }];
    });
    notify(editor.noteId ? 'Nota actualizada' : 'Nota guardada en este dispositivo');
    closeNoteEditor(true);
  };

  const editNote = (note) => openNoteEditor(note.sentenceId, note);

  const deleteNote = (note) => {
    if (!window.confirm('¿Eliminar esta nota? Esta acción no se puede deshacer.')) return;
    setNotes((current) => current.filter((item) => item.id !== note.id));
    notify('Nota eliminada');
  };

  const goToNote = (note) => {
    const sentence = sentenceMap.get(note.sentenceId);
    if (!sentence) return;
    setSelectedSentenceId(sentence.id);
    seekTo(sentence.start);
    setDrawerOpen(false);
    window.requestAnimationFrame(() => {
      document.querySelector(`[data-reader-sentence="${sentence.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const jumpToSection = (sectionId) => {
    const sentence = sentences.find((item) => item.sectionId === sectionId);
    if (!sentence) return;
    setSelectedSentenceId(sentence.id);
    seekTo(sentence.start);
    document.querySelector(`[data-reader-sentence="${sentence.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const downloadFile = (contents, name, type) => {
    const url = URL.createObjectURL(new Blob([contents], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const downloadNotes = (format = 'txt') => {
    if (!notes.length) {
      notify('Todavía no hay notas para descargar');
      return;
    }
    if (format === 'json') {
      downloadFile(JSON.stringify({ version: 1, document: readingDocument.title, notes }, null, 2), 'notas-fresco-noble.json', 'application/json');
    } else {
      downloadFile(buildNotesText(sortedNotes, sentenceMap), 'cuaderno-lectura-fresco-noble.txt', 'text/plain;charset=utf-8');
    }
    notify('Cuaderno descargado');
  };

  const shareNotes = async () => {
    if (!notes.length) {
      notify('Todavía no hay notas para compartir');
      return;
    }
    const text = buildNotesText(sortedNotes, sentenceMap);
    const file = new File([text], 'cuaderno-lectura-fresco-noble.txt', { type: 'text/plain' });
    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'Cuaderno de lectura · Fresco–Noble', text: 'Mis notas de lectura', files: [file] });
        notify('Cuaderno compartido');
      } else if (navigator.share) {
        await navigator.share({ title: 'Cuaderno de lectura · Fresco–Noble', text });
        notify('Notas compartidas');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        notify('Tu navegador no ofrece el menú de compartir: copiamos las notas');
      } else {
        downloadNotes('txt');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') notify('No se pudo abrir el menú de compartir');
    }
  };

  const noteCountFor = useCallback(
    (sentenceId) => notes.filter((note) => note.sentenceId === sentenceId).length,
    [notes],
  );

  const renderSentence = (sentence, appendSpace = false) => {
    if (!sentence) return null;
    const count = noteCountFor(sentence.id);
    const active = activeSentence?.id === sentence.id;
    const selected = selectedSentenceId === sentence.id;
    return (
      <span
        key={sentence.id}
        data-reader-sentence={sentence.id}
        className={`reader-sentence ${active ? 'is-active' : ''} ${selected ? 'is-selected' : ''} ${count ? 'has-note' : ''}`}
        role="button"
        tabIndex={0}
        aria-current={active ? 'true' : undefined}
        aria-label={`${sentence.text}${count ? `. ${count} ${count === 1 ? 'nota' : 'notas'}.` : ''}`}
        onClick={() => setSelectedSentenceId(sentence.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setSelectedSentenceId(sentence.id);
          }
        }}
      >
        {sentence.text}
        {count > 0 && <> <sup title={`${count} ${count === 1 ? 'nota' : 'notas'}`}>{count}</sup></>}
        {appendSpace ? ' ' : null}
      </span>
    );
  };

  const editorSentence = editor ? sentenceMap.get(editor.sentenceId) : null;
  const readerProgress = { currentTime, playbackRate, volume, followText, fontScale };

  return (
    <>
      <ReaderLauncher onOpen={() => setOpen(true)} progress={readerProgress} noteCount={notes.length} />

      <dialog
        ref={dialogRef}
        className="integrated-reader"
        onClose={() => setOpen(false)}
        onCancel={(event) => { event.preventDefault(); closeReader(); }}
      >
        <div className="reader-app" style={{ '--reader-font-scale': fontScale }}>
          <audio
            ref={audioRef}
            src={audioSource || undefined}
            preload={audioSource ? 'auto' : 'none'}
            onLoadedMetadata={handleAudioReady}
            onCanPlay={handleAudioReady}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => setAudioError(true)}
          />

          <header className="reader-app__header">
            <div className="reader-app__identity">
              <span className="reader-app__mark" aria-hidden="true">FN</span>
              <div>
                <p>Modo lectura</p>
                <strong>Renovación, represión, cooptación</strong>
              </div>
            </div>

            <label className="reader-section-select">
              <span><BookOpen size={13} aria-hidden="true" /> Capítulo</span>
              <select
                aria-label="Elegir capítulo del texto"
                value={activeSentence?.sectionId || readingDocument.sections[0].id}
                onChange={(event) => jumpToSection(event.target.value)}
              >
                {(readingDocument.frontMatter || []).length > 0 && <option value="frontmatter">Portada</option>}
                {readingDocument.sections.map((section) => <option key={section.id} value={section.id}>{section.shortTitle || section.title}</option>)}
              </select>
              <ChevronDown size={14} aria-hidden="true" />
            </label>

            <div className="reader-app__header-tools">
              <div className="reader-font-controls" aria-label="Tamaño del texto">
                <button type="button" onClick={() => setFontScale((value) => Math.max(0.88, +(value - 0.08).toFixed(2)))} aria-label="Reducir tamaño del texto"><Minus size={15} /> A</button>
                <button type="button" onClick={() => setFontScale((value) => Math.min(1.32, +(value + 0.08).toFixed(2)))} aria-label="Aumentar tamaño del texto">A <Plus size={15} /></button>
              </div>

              <button className="reader-header-button" type="button" onClick={() => setDrawerOpen(true)}>
                <NotebookPen size={17} /> <span>Cuaderno</span><b>{notes.length}</b>
              </button>
              <a className="reader-header-button reader-header-button--link" href={PDF_URL} target="_blank" rel="noreferrer">
                <FileText size={17} /> <span>PDF</span>
              </a>
              <button className="reader-close" type="button" onClick={closeReader} aria-label="Cerrar modo lectura"><X size={22} /></button>
            </div>
          </header>

          <div className="reader-app__progress" aria-hidden="true">
            <i style={{ width: `${Math.min(100, (currentTime / (duration || readingDocument.duration)) * 100)}%` }} />
          </div>

          <div className="reader-app__layout">
            <aside className="reader-margin reader-margin--left" aria-label="Margen izquierdo de anotaciones">
              <header><span>Margen A</span><b>{leftNotes.length}</b></header>
              <div>
                {leftNotes.length ? leftNotes.map((note) => (
                  <NoteCard key={note.id} note={note} sentence={sentenceMap.get(note.sentenceId)} onGo={goToNote} onEdit={editNote} onDelete={deleteNote} />
                )) : <p className="reader-margin__empty">Tus primeras notas aparecerán en este margen.</p>}
              </div>
            </aside>

            <main
              ref={textScrollRef}
              className="reader-text-scroll"
              onWheel={() => playing && setFollowText(false)}
              onTouchMove={() => playing && setFollowText(false)}
            >
              <article className="reader-document" aria-labelledby="reader-document-title">
                <header className="reader-document__cover">
                  <p>Texto completo · versión accesible</p>
                  <h1 id="reader-document-title">{renderSentence(readingDocument.frontMatter?.find((sentence) => sentence.role === 'title'))}</h1>
                  <h2>{renderSentence(readingDocument.frontMatter?.find((sentence) => sentence.role === 'subtitle'))}</h2>
                  <span>{renderSentence(readingDocument.frontMatter?.find((sentence) => sentence.role === 'author'))}</span>
                  <div>
                    <Headphones size={17} /> El resaltado acompaña la oración que se está escuchando.
                  </div>
                </header>

                {readingDocument.sections.map((section) => (
                  <section key={section.id} id={`reader-section-${section.id}`} className="reader-document__section">
                    {section.title && <h2>{section.headingSentence ? renderSentence(section.headingSentence) : section.title}</h2>}
                    {section.paragraphs.map((paragraph) => {
                      const Tag = paragraph.kind === 'quote' ? 'blockquote' : 'p';
                      return (
                        <Tag key={paragraph.id} className={paragraph.kind === 'note' ? 'reader-document__note' : undefined}>
                          {paragraph.sentences.map((sentence) => renderSentence(sentence, true))}
                        </Tag>
                      );
                    })}
                  </section>
                ))}

                <section className="reader-document__apparatus" aria-labelledby="reader-apparatus-title">
                  <h2 id="reader-apparatus-title">Notas y bibliografía</h2>
                  <p>El audiolibro recorre el cuerpo principal del artículo. Las notas académicas y la bibliografía se conservan aquí para completar la versión textual.</p>
                  <details>
                    <summary><span>Notas del texto</span><b>{readingDocument.endnotes.length}</b></summary>
                    <ol>{readingDocument.endnotes.map((note) => <li key={note.number}><span>{note.number}</span><p>{note.text}</p></li>)}</ol>
                  </details>
                  <details>
                    <summary><span>Bibliografía</span><b>{readingDocument.bibliography.length}</b></summary>
                    <ul>{readingDocument.bibliography.map((entry, index) => <li key={`${index}-${entry.slice(0, 20)}`}>{entry}</li>)}</ul>
                  </details>
                </section>
              </article>
            </main>

            <aside className="reader-margin reader-margin--right" aria-label="Margen derecho de anotaciones">
              <header><span>Margen B</span><b>{rightNotes.length}</b></header>
              <div>
                {rightNotes.length ? rightNotes.map((note) => (
                  <NoteCard key={note.id} note={note} sentence={sentenceMap.get(note.sentenceId)} onGo={goToNote} onEdit={editNote} onDelete={deleteNote} />
                )) : <p className="reader-margin__empty">Las notas se distribuyen entre ambos márgenes.</p>}
              </div>
            </aside>
          </div>

          <footer className="reader-player">
            {audioLoading && !audioReady && !audioError && (
              <div className="reader-player__loading" role="status">
                Preparando el audio para habilitar saltos precisos…
              </div>
            )}
            {audioError && (
              <div className="reader-player__error" role="alert">
                El navegador no pudo cargar el audio. Podés seguir leyendo y anotando, o <a href={AUDIOBOOK_DRIVE_URL} target="_blank" rel="noreferrer">abrir el audiolibro aparte</a>.
              </div>
            )}

            <div className="reader-player__context">
              <span>{selectedSentence ? 'Oración elegida' : 'Oración activa'}</span>
              <q>{excerpt(annotationTarget?.text, 118)}</q>
              {selectedSentence && (
                <button type="button" onClick={() => { seekTo(selectedSentence.start, true); setSelectedSentenceId(null); }}>
                  <Play size={13} /> Escuchar desde aquí
                </button>
              )}
            </div>

            <div className="reader-player__main">
              <div className="reader-player__transport">
                <button type="button" onClick={() => seekBy(-10)} aria-label="Retroceder 10 segundos"><Rewind size={19} /><span>10</span></button>
                <button className="reader-player__play" type="button" onClick={togglePlayback} disabled={!audioReady && !audioError} aria-label={playing ? 'Pausar audiolibro' : 'Reproducir audiolibro'}>
                  {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>
                <button type="button" onClick={() => seekBy(10)} aria-label="Avanzar 10 segundos"><FastForward size={19} /><span>10</span></button>
              </div>

              <span className="reader-player__time">{formatTime(currentTime)}</span>
              <input
                className="reader-player__range"
                type="range"
                min="0"
                max={duration || readingDocument.duration}
                step="0.1"
                value={Math.min(currentTime, duration || readingDocument.duration)}
                onChange={(event) => seekTo(Number(event.target.value))}
                aria-label="Posición del audiolibro"
              />
              <span className="reader-player__time">{formatTime(duration || readingDocument.duration)}</span>

              <label className="reader-player__speed">
                <span>Velocidad</span>
                <select value={playbackRate} onChange={(event) => changeRate(Number(event.target.value))}>
                  {[0.75, 1, 1.25, 1.5, 2].map((rate) => <option key={rate} value={rate}>{rate}×</option>)}
                </select>
              </label>

              <div className="reader-player__volume">
                <button type="button" onClick={toggleMuted} aria-label={muted ? 'Activar sonido' : 'Silenciar'}>{muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
                <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => changeVolume(Number(event.target.value))} aria-label="Volumen" />
              </div>

              <button className={`reader-player__follow ${followText ? 'is-active' : ''}`} type="button" aria-pressed={followText} onClick={() => setFollowText((value) => !value)}>
                <List size={17} /> <span>{followText ? 'Siguiendo texto' : 'Seguir texto'}</span>
              </button>

              <button className="reader-player__annotate" type="button" onClick={() => openNoteEditor(annotationTarget?.id)}>
                <BookmarkPlus size={18} /> <span>Anotar</span>
              </button>
            </div>
          </footer>

          {drawerOpen && (
            <div className="reader-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawerOpen(false); }}>
              <aside className="notes-drawer" aria-labelledby="notes-drawer-title">
                <header>
                  <div><p>Cuaderno de lectura</p><h2 id="notes-drawer-title">{notes.length} {notes.length === 1 ? 'anotación' : 'anotaciones'}</h2></div>
                  <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Cerrar cuaderno"><X size={21} /></button>
                </header>
                <div className="notes-drawer__actions">
                  <button type="button" onClick={shareNotes}><Share2 size={16} /> Compartir</button>
                  <button type="button" onClick={() => downloadNotes('txt')}><Download size={16} /> Descargar TXT</button>
                  <button type="button" onClick={() => downloadNotes('json')}><FileJson size={16} /> Copia JSON</button>
                </div>
                <p className="notes-drawer__privacy">Las notas permanecen en este navegador. Descargar una copia evita perderlas si se borran los datos del dispositivo.</p>
                <div className="notes-drawer__list">
                  {sortedNotes.length ? sortedNotes.map((note) => (
                    <NoteCard key={note.id} compact note={note} sentence={sentenceMap.get(note.sentenceId)} onGo={goToNote} onEdit={editNote} onDelete={deleteNote} />
                  )) : (
                    <div className="notes-drawer__empty"><NotebookPen size={34} /><strong>Tu cuaderno está listo</strong><p>Elegí una oración o reproducí el audio y tocá “Anotar”.</p></div>
                  )}
                </div>
              </aside>
            </div>
          )}

          {editor && (
            <div className="reader-overlay reader-overlay--editor" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeNoteEditor(true); }}>
              <section className="note-editor" role="dialog" aria-modal="true" aria-labelledby="note-editor-title">
                <header>
                  <div><p>{editor.noteId ? 'Editar anotación' : 'Nueva anotación'}</p><h2 id="note-editor-title">El audio quedó en pausa</h2></div>
                  <button type="button" onClick={() => closeNoteEditor(true)} aria-label="Cancelar anotación"><X size={21} /></button>
                </header>
                <blockquote><span>{formatTime(editorSentence?.start || currentTime)}</span>{editorSentence?.text}</blockquote>
                <label>
                  <span>Tu comentario</span>
                  <textarea autoFocus rows="6" maxLength="3000" value={editorText} onChange={(event) => setEditorText(event.target.value)} placeholder="¿Qué te hace pensar esta oración? ¿Con qué concepto, fuente o experiencia la relacionás?" />
                  <small>{editorText.length}/3000</small>
                </label>
                <footer>
                  <button type="button" onClick={() => closeNoteEditor(true)}>Cancelar</button>
                  <button className="note-editor__save" type="button" onClick={saveNote} disabled={!editorText.trim()}><Check size={17} /> Guardar {resumeAfterEditorRef.current ? 'y continuar' : 'nota'}</button>
                </footer>
              </section>
            </div>
          )}

          <div className={`reader-live-status ${localStatus ? 'is-visible' : ''}`} role="status" aria-live="polite">{localStatus}</div>
        </div>
      </dialog>
    </>
  );
}
