'use client';

import JourneyReadingEntry from './shared/JourneyReadingEntry.jsx';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Trash2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

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

function migrateStoredNotes(notes, readingDocument, paragraphMode = false) {
  if (!Array.isArray(notes)) return [];
  const mapping = { ...(readingDocument.legacySentenceMap || {}) };
  // Mantener las anotaciones existentes sin pérdida de texto, asociándolas
  // al párrafo al que pertenecía su oración en la versión anterior.
  if (paragraphMode) {
    const firstParagraphId = readingDocument.sections.flatMap((section) => section.paragraphs)[0]?.id;
    for (const sentence of readingDocument.frontMatter || []) {
      if (firstParagraphId) mapping[sentence.id] = firstParagraphId;
    }
    for (const section of readingDocument.sections) {
      if (section.headingSentence && section.paragraphs[0]) {
        mapping[section.headingSentence.id] = section.paragraphs[0].id;
      }
      for (const paragraph of section.paragraphs) {
        for (const sentence of paragraph.sentences) mapping[sentence.id] = paragraph.id;
      }
    }
  }

  return notes.map((note) => {
    let sentenceId = note.sentenceId;
    const visited = new Set();
    while (mapping[sentenceId] && !visited.has(sentenceId)) {
      visited.add(sentenceId);
      sentenceId = mapping[sentenceId];
    }
    return sentenceId === note.sentenceId ? note : { ...note, sentenceId, originalSentenceId: note.originalSentenceId || note.sentenceId };
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

function noteAudioTime(note, sentence) {
  if (Number.isFinite(sentence?.start)) return sentence.start;
  return Number.isFinite(note?.audioTime) ? note.audioTime : null;
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

function buildNotesText(notes, sentenceMap, config) {
  const lines = [
    'CUADERNO DE LECTURA',
    config.authorAndTitle,
    `Exportado: ${new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date())}`,
    '',
  ];

  notes.forEach((note, index) => {
    const sentence = sentenceMap.get(note.sentenceId);
    const audioTime = noteAudioTime(note, sentence);
    if (Number.isFinite(sentence?.start)) {
      lines.push(`${index + 1}. ${sentence?.sectionTitle || 'Texto'} · ${formatTime(sentence.start)}`);
    } else {
      lines.push(`${index + 1}. ${sentence?.sectionTitle || 'Texto'}`);
      if (Number.isFinite(audioTime)) {
        lines.push(config.sync.unit === 'paragraph'
          ? `Momento de reproducción al crear la nota: ${formatTime(audioTime)}`
          : `Momento real del audio al crear la nota (sin alineación oración–audio): ${formatTime(audioTime)}`);
      }
    }
    lines.push(`“${sentence?.text || (config.sync.unit === 'paragraph' ? 'Párrafo no disponible' : 'Oración no disponible')}”`);
    lines.push(note.text);
    lines.push('');
  });

  lines.push(`Las notas fueron creadas en el lector integrado de la experiencia ${config.experienceName}.`);
  return lines.join('\n');
}

function NoteCard({ note, sentence, onGo, onEdit, onDelete, compact = false }) {
  const audioTime = noteAudioTime(note, sentence);
  return (
    <article className={`margin-note ${compact ? 'margin-note--compact' : ''}`}>
      <button className="margin-note__jump" type="button" onClick={() => onGo(note)}>
        <span>{sentence?.sectionTitle || 'Texto'}{Number.isFinite(audioTime) ? ` · ${formatTime(audioTime)}${Number.isFinite(sentence?.start) ? '' : ' · audio al anotar'}` : ''}</span>
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

export default function IntegratedReader({ showToast, readingDocument, config, Launcher = JourneyReadingEntry }) {
  // Esta modalidad se activa solo para la obra que la solicita.
  const paragraphMode = config.sync.unit === 'paragraph';
  const syncInteractive = config.sync.status === 'ready' || (paragraphMode && config.sync.status === 'paragraph-preview');
  const dialogRef = useRef(null);
  const audioRef = useRef(null);
  const textScrollRef = useRef(null);
  const endnotesDetailsRef = useRef(null);
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
  const [currentTime, setCurrentTime] = useState(() => readStoredValue(config.storage.stateKey, EMPTY_STATE).currentTime || 0);
  const [duration, setDuration] = useState(readingDocument.duration);
  const [playbackRate, setPlaybackRate] = useState(() => readStoredValue(config.storage.stateKey, EMPTY_STATE).playbackRate || 1);
  const [volume, setVolume] = useState(() => readStoredValue(config.storage.stateKey, EMPTY_STATE).volume ?? 1);
  const [muted, setMuted] = useState(false);
  const [followText, setFollowText] = useState(() => readStoredValue(config.storage.stateKey, EMPTY_STATE).followText ?? true);
  const [fontScale, setFontScale] = useState(() => readStoredValue(config.storage.stateKey, EMPTY_STATE).fontScale || 1);
  const [selectedSentenceId, setSelectedSentenceId] = useState(null);
  const [browsingCover, setBrowsingCover] = useState(false);
  const [notes, setNotes] = useState(() => migrateStoredNotes(readStoredValue(config.storage.notesKey, []), readingDocument, paragraphMode));
  const [editor, setEditor] = useState(null);
  const [editorText, setEditorText] = useState('');
  const [localStatus, setLocalStatus] = useState('');

  const sentences = useMemo(() => {
    if (paragraphMode) {
      const timings = new Map((config.sync.paragraphTimings || []).map((item) => [item.id, item]));
      return readingDocument.sections.flatMap((section) =>
        section.paragraphs.map((paragraph) => {
          const timing = timings.get(paragraph.id);
          return {
            id: paragraph.id,
            text: paragraph.sentences.map((sentence) => sentence.text).join(' '),
            sectionId: section.id,
            sectionTitle: section.title,
            start: timing?.start,
            end: timing?.end,
            audioUnavailable: timing?.audioUnavailable === true,
          };
        }),
      ).map((paragraph, order) => ({ ...paragraph, order }));
    }
    return [
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
    ].map((sentence, order) => ({ ...sentence, order }));
  }, [readingDocument, paragraphMode, config.sync.paragraphTimings]);
  const paragraphForSentence = useMemo(() => new Map(
    readingDocument.sections.flatMap((section) =>
      section.paragraphs.flatMap((paragraph) => paragraph.sentences.map((sentence) => [sentence.id, paragraph.id])),
    ),
  ), [readingDocument]);

  const sentenceMap = useMemo(() => new Map(sentences.map((sentence) => [sentence.id, sentence])), [sentences]);
  // Referencias de la edición (no son notas personales ni pasajes del audio).
  // Solo se muestra el enlace si la obra trae una ubicación editorial verificada.
  const editorialFootnotes = useMemo(
    () => {
      const references = new Map();
      for (const note of readingDocument.endnotes || []) {
        if (!note.sentenceId) continue;
        const inHeading = paragraphMode && (
          readingDocument.frontMatter?.some(item => item.id === note.sentenceId)
          || readingDocument.sections.some(section => section.headingSentence?.id === note.sentenceId)
        );
        if (!(paragraphMode ? paragraphForSentence.has(note.sentenceId) || inHeading : sentenceMap.has(note.sentenceId))) continue;
        references.set(note.sentenceId, [...(references.get(note.sentenceId) || []), note]);
      }
      return references;
    },
    [readingDocument, sentenceMap, paragraphForSentence, paragraphMode],
  );
  const showEditorialFootnote = (note) => {
    if (!endnotesDetailsRef.current) return;
    if (paragraphMode) setFollowText(false);
    endnotesDetailsRef.current.open = true;
    window.requestAnimationFrame(() => {
      const target = document.getElementById(`reader-editorial-note-${note.number}`);
      target?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      target?.focus({ preventScroll: true });
    });
  };
  const returnToEditorialReference = (note) => {
    const targetId = paragraphMode ? paragraphForSentence.get(note.sentenceId) : note.sentenceId;
    let target = textScrollRef.current?.querySelector(`[data-reader-sentence="${targetId}"]`);
    if (paragraphMode && !target) {
      const cover = readingDocument.frontMatter?.some(item => item.id === note.sentenceId);
      const section = readingDocument.sections.find(item => item.headingSentence?.id === note.sentenceId);
      target = cover ? textScrollRef.current?.querySelector('#reader-document-title')
        : section ? textScrollRef.current?.querySelector(`#reader-section-${section.id} h2`) : null;
    }
    target?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    (paragraphMode ? target?.querySelector('[role="button"]') || target : target)?.focus({ preventScroll: true });
  };
  const timedSentences = useMemo(
    () => sentences.filter((sentence) => Number.isFinite(sentence.start)),
    [sentences],
  );
  const activeSentence = useMemo(
    () => syncInteractive && (!paragraphMode || (currentTime >= (timedSentences[0]?.start ?? Infinity) && currentTime <= (timedSentences.at(-1)?.end ?? -Infinity)))
      ? findActiveSentence(timedSentences, currentTime) : null,
    [syncInteractive, paragraphMode, currentTime, timedSentences],
  );
  const selectedSentence = sentenceMap.get(selectedSentenceId) || null;
  const annotationTarget = selectedSentence || activeSentence || sentences[0];
  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => {
      const left = sentenceMap.get(a.sentenceId);
      const right = sentenceMap.get(b.sentenceId);
      return (Number.isFinite(left?.start) ? left.start : left?.order || 0)
        - (Number.isFinite(right?.start) ? right.start : right?.order || 0);
    }),
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

    // Algunas obras ofrecen su MP3 desde un servicio externo: permitir al
    // elemento de audio reproducirlo sin exigir CORS a un fetch binario.
    if (config.audioMode === 'direct') {
      setAudioLoading(false);
      setAudioError(false);
      setAudioSource(config.audiobookUrl);
      return undefined;
    }

    const controller = new AbortController();
    setAudioLoading(true);
    setAudioError(false);

    const prepareSeekableAudio = async () => {
      try {
        // Recursos largos: los fragmentos forman partes consecutivas del mismo
        // MP3 binario. Se reconstruyen en memoria, sin alterar sus bytes.
        let blob;
        if (config.audiobookParts?.length) {
          const parts = await Promise.all(config.audiobookParts.map(async (url) => {
            const response = await fetch(url, { cache: 'force-cache', signal: controller.signal });
            if (!response.ok) throw new Error('No se pudo cargar un fragmento del audio (' + response.status + ')');
            return response.arrayBuffer();
          }));
          blob = new Blob(parts, { type: 'audio/mpeg' });
        } else {
          const response = await fetch(config.audiobookUrl, {
            cache: 'force-cache',
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(`No se pudo cargar el audio (${response.status})`);
          blob = await response.blob();
        }
        if (controller.signal.aborted) return;
        if (Number.isFinite(config.expectedAudioBytes) && blob.size !== config.expectedAudioBytes) {
          throw new Error('El audio no coincide con el tamaño del archivo original');
        }

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
  }, [audioSource, config.audiobookUrl, config.audiobookParts, config.audioMode, config.expectedAudioBytes, open]);

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
    if (!(paragraphMode || config.modalAccessibility) || !open) return undefined;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => { root.style.overflow = previousOverflow; };
  }, [paragraphMode, config.modalAccessibility, open]);

  useEffect(() => {
    if (!(paragraphMode || config.modalAccessibility) || !open || (!editor && !drawerOpen)) return undefined;
    const overlay = dialogRef.current?.querySelector(editor ? '.note-editor' : '.notes-drawer');
    if (!overlay) return undefined;
    const previousFocus = document.activeElement;
    const controls = () => [...overlay.querySelectorAll('button:not(:disabled), textarea, a[href]')];
    const frame = window.requestAnimationFrame(() => (overlay.querySelector('textarea') || controls()[0])?.focus());
    const trapFocus = (event) => {
      if (event.key !== 'Tab') return;
      const items = controls();
      const next = event.shiftKey ? items.at(-1) : items[0];
      if (!overlay.contains(document.activeElement)
        || (event.shiftKey && document.activeElement === items[0])
        || (!event.shiftKey && document.activeElement === items.at(-1))) {
        event.preventDefault();
        next?.focus();
      }
    };
    overlay.addEventListener('keydown', trapFocus);
    return () => {
      window.cancelAnimationFrame(frame);
      overlay.removeEventListener('keydown', trapFocus);
      (previousFocus?.isConnected ? previousFocus : dialogRef.current?.querySelector('.reader-player__annotate'))?.focus();
    };
  }, [paragraphMode, config.modalAccessibility, open, Boolean(editor), drawerOpen]);

  useEffect(() => {
    try {
      window.localStorage.setItem(config.storage.notesKey, JSON.stringify(notes));
    } catch {
      // El lector sigue funcionando si el navegador bloquea el almacenamiento local.
    }
  }, [config.storage.notesKey, notes]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(config.storage.stateKey, JSON.stringify({
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
  }, [config.storage.stateKey, currentTime, playbackRate, volume, followText, fontScale]);

  useEffect(() => {
    if (!open || (!playing && !paragraphMode) || !followText || !activeSentence || (paragraphMode && browsingCover)) return;
    const target = document.querySelector(`[data-reader-sentence="${activeSentence.id}"]`);
    if (!target) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: paragraphMode ? 'start' : 'center' });
  }, [activeSentence?.id, followText, open, playing, paragraphMode, browsingCover]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      const target = event.target;
      const editing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
      if (editing) return;
      if (paragraphMode && (editor || drawerOpen || target.closest('button, a, [role="button"], summary'))) return;
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
    const sentence = sentenceMap.get(sentenceId);
    resumeAfterEditorRef.current = Boolean(audio && !audio.paused);
    audio?.pause();
    setPlaying(false);
    setSelectedSentenceId(sentenceId);
    setEditor({
      sentenceId,
      noteId: note?.id || null,
      audioTime: noteAudioTime(note, sentence) ?? currentTime,
    });
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
        ...(!Number.isFinite(sentenceMap.get(editor.sentenceId)?.start)
          ? { audioTime: editor.audioTime, audioTimeSource: 'playback-position-at-annotation' }
          : {}),
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
    if (paragraphMode) setBrowsingCover(false);
    setSelectedSentenceId(sentence.id);
    const audioTime = noteAudioTime(note, sentence);
    if (Number.isFinite(audioTime)) seekTo(audioTime);
    setDrawerOpen(false);
    window.requestAnimationFrame(() => {
      document.querySelector(`[data-reader-sentence="${sentence.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const jumpToSection = (sectionId) => {
    if (paragraphMode) {
      setBrowsingCover(sectionId === 'frontmatter');
      if (sectionId === 'frontmatter') {
        setSelectedSentenceId(null);
        setFollowText(false);
        textScrollRef.current?.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        return;
      }
    }
    const sentence = sentences.find((item) => item.sectionId === sectionId);
    if (!sentence) return;
    setSelectedSentenceId(sentence.id);
    if (Number.isFinite(sentence.start)) seekTo(sentence.start);
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
      const exportedAt = new Date().toISOString();
      const entries = sortedNotes.map((note) => {
        const sentence = sentenceMap.get(note.sentenceId);
        const audioTime = noteAudioTime(note, sentence);
        return {
          id: note.id,
          section: sentence?.sectionTitle || 'Texto',
          audioTime,
          audioTimeBasis: Number.isFinite(sentence?.start)
            ? (paragraphMode ? 'paragraph-sync-preview' : 'sentence-sync')
            : Number.isFinite(note?.audioTime)
              ? 'playback-position-at-annotation'
              : 'unavailable',
          selectedText: sentence?.text || null,
          note: note.text,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        };
      });
      downloadFile(
        JSON.stringify({
          version: 1,
          workId: config.workId,
          author: readingDocument.author,
          title: readingDocument.title,
          authorAndTitle: config.authorAndTitle,
          document: readingDocument.title,
          exportedAt,
          entries,
          notes,
        }, null, 2),
        config.export.jsonFileName,
        'application/json',
      );
    } else {
      downloadFile(
        buildNotesText(sortedNotes, sentenceMap, config),
        config.export.textFileName,
        'text/plain;charset=utf-8',
      );
    }
    notify('Cuaderno descargado');
  };

  const shareNotes = async () => {
    if (!notes.length) {
      notify('Todavía no hay notas para compartir');
      return;
    }
    const text = buildNotesText(sortedNotes, sentenceMap, config);
    const file = new File([text], config.export.textFileName, { type: 'text/plain' });
    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: config.export.shareTitle, text: 'Mis notas de lectura', files: [file] });
        notify('Cuaderno compartido');
      } else if (navigator.share) {
        await navigator.share({ title: config.export.shareTitle, text });
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
    const editorialNotes = editorialFootnotes.get(sentence.id) || [];
    return (
      <Fragment key={sentence.id}>
        <span
          data-reader-sentence={sentence.id}
          data-audio-unavailable={sentence.audioUnavailable || undefined}
          title={sentence.audioUnavailable ? 'Este fragmento no se lee en la grabación.' : undefined}
          className={`reader-sentence ${active ? 'is-active' : ''} ${selected ? 'is-selected' : ''} ${count ? 'has-note' : ''}`}
          role="button"
          tabIndex={0}
          aria-current={active ? 'true' : undefined}
          aria-label={`${sentence.text}${sentence.audioUnavailable ? ' Fragmento sin audio.' : ''}${count ? `. ${count} ${count === 1 ? 'nota' : 'notas'} personales.` : ''}`}
          onClick={() => setSelectedSentenceId(sentence.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setSelectedSentenceId(sentence.id);
            }
          }}
        >
          {sentence.text}
          {count > 0 && <> <sup title={`${count} ${count === 1 ? 'nota personal' : 'notas personales'}`}>{count}</sup></>}
        </span>
        {editorialNotes.map(editorialNote => <button
          key={editorialNote.number}
          type="button"
          className="reader-editorial-reference"
          aria-label={`Consultar nota editorial ${editorialNote.number} ${config.editorialReferenceLabel || 'de la edición de Marcaida y Scaltritti'}`}
          onClick={() => showEditorialFootnote(editorialNote)}
          title={`Nota académica ${editorialNote.number}, página ${editorialNote.page}; no forma parte del audiolibro`}
        ><sup>{editorialNote.number}</sup></button>)}
        {appendSpace ? ' ' : null}
      </Fragment>
    );
  };
  const renderHeadingEditorialNotes = sentenceId => (editorialFootnotes.get(sentenceId) || []).map(note => (
    <button
      key={note.number} type="button" className="reader-editorial-reference"
      aria-label={`Consultar nota editorial ${note.number} ${config.editorialReferenceLabel || 'de la edición'}`}
      onClick={() => showEditorialFootnote(note)}
      title={`Nota académica ${note.number}, página ${note.page}; no forma parte del audiolibro`}
    ><sup>{note.number}</sup></button>
  ));
  const renderParagraph = (paragraph, Tag) => {
    const entry = sentenceMap.get(paragraph.id);
    const active = activeSentence?.id === paragraph.id;
    const selected = selectedSentenceId === paragraph.id;
    const count = noteCountFor(paragraph.id);
    const choose = () => { setBrowsingCover(false); setSelectedSentenceId(paragraph.id); };
    return (
      <Tag
        key={paragraph.id}
        data-reader-sentence={paragraph.id}
        className={`reader-paragraph-unit ${active ? 'is-active' : ''} ${selected ? 'is-selected' : ''} ${paragraph.kind === 'note' ? 'reader-document__note' : ''}`}
        aria-current={active ? 'true' : undefined}
      >
        {paragraph.sentences.map((sentence, index) => {
          const editorialNotes = editorialFootnotes.get(sentence.id) || [];
          return (
            <Fragment key={sentence.id}>
              <span
                className="reader-paragraph-unit__text"
                role={index === 0 ? 'button' : undefined}
                tabIndex={index === 0 ? 0 : undefined}
                aria-label={index === 0 ? `Seleccionar párrafo: ${entry?.text || ''}` : undefined}
                onClick={choose}
                onKeyDown={index === 0 ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    choose();
                  }
                } : undefined}
              >{sentence.text}</span>
              {editorialNotes.map(editorialNote => <button
                key={editorialNote.number}
                type="button"
                className="reader-editorial-reference"
                aria-label={`Consultar nota editorial ${editorialNote.number} ${config.editorialReferenceLabel || 'de la edición de Marcaida y Scaltritti'}`}
                onClick={() => showEditorialFootnote(editorialNote)}
                title={`Nota académica ${editorialNote.number}, página ${editorialNote.page}; no forma parte del audiolibro`}
              ><sup>{editorialNote.number}</sup></button>)}
              {' '}
            </Fragment>
          );
        })}
        {count > 0 && <sup className="reader-paragraph-unit__notes" title={`${count} ${count === 1 ? 'nota personal' : 'notas personales'}`}>{count}</sup>}
      </Tag>
    );
  };
  const editorSentence = editor ? sentenceMap.get(editor.sentenceId) : null;
  const readerProgress = { currentTime, playbackRate, volume, followText, fontScale };

  return (
    <>
      <Launcher
        onOpen={() => setOpen(true)}
        progress={readerProgress}
        noteCount={notes.length}
        readingDocument={readingDocument}
        config={config}
      />

      <dialog
        ref={dialogRef}
        className={`integrated-reader${paragraphMode ? ' integrated-reader--paragraph' : ''}`}
        aria-label={`Lector integrado: ${config.shortTitle}`}
        onClose={() => setOpen(false)}
        onCancel={(event) => {
          event.preventDefault();
          if ((paragraphMode || config.modalAccessibility) && editor) closeNoteEditor(true);
          else if ((paragraphMode || config.modalAccessibility) && drawerOpen) setDrawerOpen(false);
          else closeReader();
        }}
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
              <span className="reader-app__mark" aria-hidden="true">{config.mark}</span>
              <div>
                <p>Modo lectura</p>
                <strong>{config.shortTitle}</strong>
              </div>
            </div>

            <label className="reader-section-select">
              <span><BookOpen size={13} aria-hidden="true" /> Capítulo</span>
              <select
                aria-label="Elegir capítulo del texto"
                value={paragraphMode && browsingCover ? 'frontmatter' : selectedSentence?.sectionId || activeSentence?.sectionId || readingDocument.sections[0].id}
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

              <button className="reader-header-button" type="button" aria-label="Abrir cuaderno" onClick={() => setDrawerOpen(true)}>
                <NotebookPen size={17} /> <span>Cuaderno</span><b>{notes.length}</b>
              </button>
              {config.pdfUrl && <a className="reader-header-button reader-header-button--link" href={config.pdfUrl} target="_blank" rel="noreferrer">
                <FileText size={17} /> <span>PDF</span>
              </a>}
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
                  <p>{readingDocument.versionLabel || 'Texto completo · versión accesible'}</p>
                  <h1 id="reader-document-title" tabIndex={paragraphMode ? -1 : undefined}>{paragraphMode ? <>
                    {readingDocument.frontMatter?.find((sentence) => sentence.role === 'title')?.text}
                    {renderHeadingEditorialNotes(readingDocument.frontMatter?.find((sentence) => sentence.role === 'title')?.id)}
                  </> : renderSentence(readingDocument.frontMatter?.find((sentence) => sentence.role === 'title'))}</h1>
                  <h2>{paragraphMode ? readingDocument.frontMatter?.find((sentence) => sentence.role === 'subtitle')?.text : renderSentence(readingDocument.frontMatter?.find((sentence) => sentence.role === 'subtitle'))}</h2>
                  <span>{paragraphMode ? readingDocument.frontMatter?.find((sentence) => sentence.role === 'author')?.text : renderSentence(readingDocument.frontMatter?.find((sentence) => sentence.role === 'author'))}</span>
                  <div>
                    <Headphones size={17} /> {config.sync.coverMessage}
                  </div>
                </header>

                {readingDocument.sections.map((section) => (
                  <section key={section.id} id={`reader-section-${section.id}`} className="reader-document__section">
                    {section.title && <h2 tabIndex={paragraphMode ? -1 : undefined}>{paragraphMode ? <>
                      {section.title}{renderHeadingEditorialNotes(section.headingSentence?.id)}
                    </> : section.headingSentence ? renderSentence(section.headingSentence) : section.title}</h2>}
                    {section.paragraphs.map((paragraph) => {
                      const Tag = paragraph.kind === 'quote' ? 'blockquote' : 'p';
                      return paragraphMode
                        ? renderParagraph(paragraph, Tag)
                        : (
                          <Tag key={paragraph.id} className={paragraph.kind === 'note' ? 'reader-document__note' : undefined}>
                            {paragraph.sentences.map((sentence) => renderSentence(sentence, true))}
                          </Tag>
                        );
                    })}
                  </section>
                ))}

                {((readingDocument.endnotes || []).length > 0
                  || (readingDocument.bibliography || []).length > 0
                  || readingDocument.sourceNote) && (
                  <section className="reader-document__apparatus" aria-labelledby="reader-apparatus-title">
                    <h2 id="reader-apparatus-title">Notas y bibliografía</h2>
                    {readingDocument.sourceNote && <p>{readingDocument.sourceNote}</p>}
                    {(readingDocument.endnotes || []).length > 0 && (
                      <details ref={endnotesDetailsRef}>
                        <summary><span>Notas académicas de la edición · no narradas</span><b>{readingDocument.endnotes.length}</b></summary>
                        <ol>{readingDocument.endnotes.map((note) => <li key={note.number} id={`reader-editorial-note-${note.number}`} tabIndex={-1}>
                          <span aria-hidden="true">{note.number}</span>
                          <div className="reader-editorial-note-body">
                            <p>{note.text}</p>
                            {note.kind && <small>{note.kind === 'sintesis' ? 'Síntesis editorial del contenido de la nota original' : note.kind === 'incorporada-al-cuerpo' ? 'Referencia histórica' : 'Referencia bibliográfica de la nota original'}</small>}
                            <div className="reader-editorial-note-links">
                              {note.sourceUrl && <a href={note.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Consultar nota ${note.number} en página ${note.page} de la edición original`}>Ver original · p. {note.page}</a>}
                              {note.sentenceId && <button type="button" onClick={() => returnToEditorialReference(note)}>Volver al pasaje</button>}
                            </div>
                          </div>
                        </li>)}</ol>
                      </details>
                    )}
                    {(readingDocument.bibliography || []).length > 0 && (
                      <details>
                        <summary><span>Bibliografía</span><b>{readingDocument.bibliography.length}</b></summary>
                        <ul>{readingDocument.bibliography.map((entry, index) => <li key={`${index}-${entry.slice(0, 20)}`}>{entry}</li>)}</ul>
                      </details>
                    )}
                  </section>
                )}
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
                {syncInteractive ? (paragraphMode ? 'Preparando la lectura por párrafos…' : 'Preparando el audio para habilitar saltos precisos…') : 'Preparando el audio para escuchar…'}
              </div>
            )}
            {audioError && (
              <div className="reader-player__error" role="alert">
                El navegador no pudo cargar el audio. Podés seguir leyendo y anotando.
                {config.audiobookExternalUrl && <> También podés <a href={config.audiobookExternalUrl} target="_blank" rel="noreferrer">abrir el audiolibro aparte</a>.</>}
              </div>
            )}

            <div className="reader-player__context">
              <span>{selectedSentence?.audioUnavailable ? 'Fragmento sin audio' : selectedSentence ? (paragraphMode ? 'Párrafo elegido' : 'Oración elegida') : syncInteractive ? (paragraphMode ? 'Párrafo activo' : 'Oración activa') : 'Texto listo para anotar'}</span>
              <q>{excerpt(annotationTarget?.text, 118)}</q>
              {selectedSentence && Number.isFinite(selectedSentence.start) && (
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
                  {[0.75, 0.9, 1, 1.1, 1.25, 1.5, 2].map((rate) => (
                    <option key={rate} value={rate}>{String(rate).replace('.', ',')}×</option>
                  ))}
                </select>
              </label>

              <div className="reader-player__volume">
                <button type="button" onClick={toggleMuted} aria-label={muted ? 'Activar sonido' : 'Silenciar'}>{muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
                <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => changeVolume(Number(event.target.value))} aria-label="Volumen" />
              </div>

              {syncInteractive && (
                <button className={`reader-player__follow ${followText ? 'is-active' : ''}`} type="button" aria-label={followText ? 'Dejar de seguir el texto' : 'Seguir el texto'} aria-pressed={followText} onClick={() => setFollowText((value) => !value)}>
                  <List size={17} /> <span>{followText ? 'Siguiendo texto' : 'Seguir texto'}</span>
                </button>
              )}

              <button className="reader-player__annotate" type="button" aria-label="Anotar" onClick={() => openNoteEditor(annotationTarget?.id)}>
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
                    <div className="notes-drawer__empty"><NotebookPen size={34} /><strong>Tu cuaderno está listo</strong><p>{paragraphMode ? 'Elegí un párrafo o reproducí el audio y tocá “Anotar”.' : 'Elegí una oración o reproducí el audio y tocá “Anotar”.'}</p></div>
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
                <blockquote>
                  <span>
                    {Number.isFinite(editorSentence?.start)
                      ? formatTime(editorSentence.start)
                      : Number.isFinite(editor.audioTime)
                        ? `${formatTime(editor.audioTime)} · posición del audio al anotar`
                        : 'Sin tiempo asignado'}
                  </span>
                  {editorSentence?.text}
                </blockquote>
                <label>
                  <span>Tu comentario</span>
                  <textarea autoFocus rows="6" maxLength="3000" value={editorText} onChange={(event) => setEditorText(event.target.value)} placeholder={paragraphMode ? "¿Qué te hace pensar este párrafo? ¿Con qué concepto, fuente o experiencia lo relacionás?" : "¿Qué te hace pensar esta oración? ¿Con qué concepto, fuente o experiencia la relacionás?"} />
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
