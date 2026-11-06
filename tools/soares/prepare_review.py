"""Build a PRIVATE listening packet from existing evidence; never changes runtime.
Usage: prepare_review.py DOCUMENT AUDIO CANDIDATES AUDIT COMPARISON OUTDIR
Or: prepare_review.py --ctc DOCUMENT AUDIO CTC_REPORT OUTDIR
"""
import concurrent.futures, hashlib, html, json, subprocess, sys
from pathlib import Path
ctc_mode = sys.argv[1] == '--ctc'
if ctc_mode:
    document, audio, report, out = map(Path, sys.argv[2:])
    doc, source = [json.loads(p.read_text()) for p in (document,report)]
    assert source['timedCandidates'] == source['academicUnits'] and source['runtimeEnabled'] is False
    times = {r['id']:{'start':r['candidateStart'],'end':r['candidateEnd']} for r in source['records']}
    a = source
    c = {'audioSha256':source['audioSha256'],'needsHumanReview':source['requiresReview'],'records':[{'id':r['id'],'needsHumanReview':r['requiresReview'],'boundaries':{edge:{**b,'ctcScore':r[edge+'CtcScore']} for edge,b in r['sameTokenWhisperComparison'].items()}} for r in source['records']]}
else:
    document, audio, candidates, audit, comparison, out = map(Path, sys.argv[1:])
    doc, times, a, c = [json.loads(p.read_text()) for p in (document, candidates, audit, comparison)]
assert hashlib.sha256(audio.read_bytes()).hexdigest() == a['audioSha256'] == c['audioSha256']
out.mkdir(parents=True, exist_ok=True); (out/'clips').mkdir(exist_ok=True)
units = {u['id']:u for u in doc['frontMatter']}
for section in doc['sections']:
    for unit in [section['headingSentence']] + [u for p in section['paragraphs'] for u in p['sentences']]: units[unit['id']] = unit
selected = {r['id'] for r in c['records'] if r['needsHumanReview']}
selected.update(r['id'] for r in a['records'] if r['id'].endswith('-heading'))
selected.update(['soa-title', 'soa-introduccion-p1-s1'])
if ctc_mode:
    samples = Path(__file__).resolve().parents[2]/'documentation/obras/soares-corrientes-gimnasticas/evidencia/muestras-work2.json'
    selected.update(r['id'] for r in json.loads(samples.read_text())['samples'])
    selected.update(key for key,u in units.items() if any(term in u['text'] for term in ['Jahn (1778', 'Marc Bloch', 'corno']))
# Always include the actual midpoint-containing unit and last narrative unit.
selected.update(k for k,v in times.items() if v['start'] <= 1556.6656465 <= v['end'])
selected.add(next(reversed(times)))
selected &= times.keys()
rows = []
ar = {r['id']:r for r in a['records']}; cr = {r['id']:r for r in c['records']}
for key in sorted(selected, key=lambda k:times[k]['start']):
    start, end = max(0, times[key]['start']-3), min(3113.331293, times[key]['end']+3)
    rows.append({'id':key, 'clip':f'clips/{key}.mp3', 'clipStart':start, 'clipEnd':end, 'candidate':times[key], 'text':units[key]['text'], 'initialFlags':ar[key]['flags'], 'comparison':cr[key]['boundaries'], 'humanReviewed':False})
def encode(row):
    subprocess.run(['ffmpeg','-nostdin','-v','error','-ss',str(row['clipStart']),'-i',str(audio),'-t',str(row['clipEnd']-row['clipStart']),'-map_metadata','-1','-ac','1','-codec:a','libmp3lame','-q:a','3','-y',str(out/row['clip'])],check=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: list(pool.map(encode, rows))
(out/'revision.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
parts=['<!doctype html><html lang="es"><meta charset="utf-8"><title>Soares · Revisión pendiente</title><style>body{font:18px/1.6 system-ui;max-width:850px;margin:3rem auto;padding:1rem;background:#eeeae1;color:#252b2f}article{border-top:1px solid #888;padding:1rem 0}code{overflow-wrap:anywhere}audio{width:100%}small{display:block}label{display:block}</style><h1>Revisión acústica pendiente</h1><p>Paquete privado. No acredita permiso de redistribución. Ningún intervalo está activado. Abrí este archivo junto a la carpeta clips; los controles reproducen extractos reales. Las marcas son candidatos medidos por ASR, no aceptación humana. Cada clip incluye tres segundos de contexto a cada lado cuando existen. No se alteró el MP3 original.</p><p>Para cada pasaje: escuchar el principio y el final, anotar el tiempo absoluto observado (inicio del clip + tiempo del reproductor), las diferencias audibles y la decisión. Conservar las variantes del documento académico. No asignar tiempos a notas ni bibliografía. Los casilleros son una ayuda visual: guardá decisiones en una copia de revision.json o en un informe; no se guardan automáticamente.</p>']
for row in rows:
    parts.append(f'<article><h2><code>{row["id"]}</code></h2><p>{html.escape(row["text"])}</p><audio controls preload="none" src="{row["clip"]}"></audio><small>Origen absoluto del clip: {row["clipStart"]:.3f} s. Candidato: {row["candidate"]["start"]:.3f}–{row["candidate"]["end"]:.3f} s.</small><pre>{html.escape(json.dumps({"alertas":row["initialFlags"],"comparacion":row["comparison"]},ensure_ascii=False,indent=2))}</pre><label><input type="checkbox"> Inicio comprobado por escucha</label><label><input type="checkbox"> Final comprobado por escucha</label><label><input type="checkbox"> Diferencias léxicas registradas</label></article>')
parts.append('</html>')
if ctc_mode:
    parts[0] = parts[0].replace('candidatos medidos por ASR','candidatos medidos por CTC y contrastados con Whisper').replace('<h1>Revisión acústica pendiente</h1>','<h1>Revisión acústica pendiente · CTC</h1>')
(out/'ABRIR_REVISION.html').write_text('\n'.join(parts))
print(json.dumps({'clips':len(rows),'flaggedUnits':c['needsHumanReview'],'clipSeconds':round(sum(r['clipEnd']-r['clipStart'] for r in rows),3),'audioSha256':a['audioSha256']}))
