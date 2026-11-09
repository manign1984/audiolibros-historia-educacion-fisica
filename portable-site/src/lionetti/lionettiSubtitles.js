// Subtítulos SRT aportados por el proyecto: respetar las marcas temporales recibidas.
export function subtitleSeconds(timestamp) {
  const match = String(timestamp).trim().match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
  if (!match) return null;
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(match[4]) / 1000;
}

export function parseLionettiSubtitles(raw) {
  return String(raw || '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim()
    .split(/\n\s*\n/)
    .map(block => {
      const lines = block.split('\n');
      const timeLine = lines.findIndex(line => line.includes(' --> '));
      if (timeLine < 0) return null;
      const match = lines[timeLine].trim().match(/^(\d\d:\d\d:\d\d,\d{3})\s*-->\s*(\d\d:\d\d:\d\d,\d{3})$/);
      if (!match) return null;
      const start = subtitleSeconds(match[1]);
      const end = subtitleSeconds(match[2]);
      const text = lines.slice(timeLine + 1).join(' ').trim();
      if (start === null || end === null || end <= start || !text) return null;
      return { start, end, text };
    })
    .filter(Boolean);
}

export function findLionettiSubtitle(cues, time) {
  if (!Array.isArray(cues) || !cues.length || !Number.isFinite(time)) return null;
  let lo = 0, hi = cues.length - 1, index = -1;
  while (lo <= hi) {
    const middle = (lo + hi) >> 1;
    if (cues[middle].start <= time) { index = middle; lo = middle + 1; }
    else hi = middle - 1;
  }
  return index >= 0 && time < cues[index].end ? cues[index] : null;
}

export function readableAudioTime(seconds) {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${String(Math.floor(safe / 3600)).padStart(2, '0')}:${String(Math.floor(safe % 3600 / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}
