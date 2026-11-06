"""Local acoustic alignment of the audited narration, not the academic apparatus.

Requires CPU torch==2.8.0, torchaudio==2.8.0, numpy==2.2.6,
num2words==0.5.14 and ffmpeg. TorchAudio 2.9 removes this API.
Private output includes source text; never publish without settled use conditions.
The VTT supplies words and coarse windows; CTC supplies measured token frames.
No time interpolation, no reader activation and no change to source files.
"""
import argparse, fcntl, hashlib, html, importlib.metadata, json, os, re, subprocess, time, unicodedata
from pathlib import Path

p = argparse.ArgumentParser()
p.add_argument('--audio', required=True); p.add_argument('--vtt', required=True)
p.add_argument('--output', required=True); p.add_argument('--model-dir', required=True)
p.add_argument('--threads', type=int, default=4); p.add_argument('--max-chunks', type=int)
a = p.parse_args()
os.environ['TORCH_HOME'] = str(Path(a.model_dir).resolve())
import numpy as np
import torch
from num2words import num2words
from torchaudio.pipelines import MMS_FA

audio, vtt, output = map(Path, (a.audio, a.vtt, a.output))
output.parent.mkdir(parents=True, exist_ok=True)
lock_handle = open(str(output)+'.lock', 'w')
fcntl.flock(lock_handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
digest = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
audio_sha, vtt_sha = digest(audio), digest(vtt)
assert audio_sha == 'f9c4226ec5794a959d77d6f97b523eabadb0dcdc272bbec9c9e1b04d9a019b37'
assert vtt_sha == 'ec0beaea889464cd05328c6e73fb80f36f3f8899ae99cc463fcefb82bc1e294f'

def seconds(value):
    h, m, s = value.split(':'); return int(h)*3600 + int(m)*60 + float(s)

def normalize(value):
    if value.isdigit(): value = num2words(int(value), lang='es')
    elif value in {'XVII', 'XVIII', 'XIX', 'XX', 'XXI'}:
        value = num2words({'XVII':17, 'XVIII':18, 'XIX':19, 'XX':20, 'XXI':21}[value], lang='es')
    folded = ''.join(c for c in unicodedata.normalize('NFD', value.lower()) if not unicodedata.combining(c))
    return re.findall(r"[a-z]+(?:'[a-z]+)*", folded)

cues, words = [], []
for block in re.split(r'\n\s*\n', vtt.read_text()):
    m = re.search(r'(\d\d:\d\d:\d\d\.\d+) --> (\d\d:\d\d:\d\d\.\d+)\n([\s\S]*)', block)
    if not m: continue
    text = html.unescape(re.sub('<[^>]*>', '', m[3])); ci = len(cues)
    cue = {'start':seconds(m[1]), 'end':seconds(m[2]), 'wordIndices':[]}
    for raw in re.findall(r"[^\W_]+(?:['’][^\W_]+)*", text):
        normalized = normalize(raw)
        if not normalized: continue
        cue['wordIndices'].append(len(words))
        words.append({'word':raw, 'normalized':normalized, 'cue':ci+1})
    cues.append(cue)
assert len(cues) == 593

plans, first = [], 0
for i, cue in enumerate(cues):
    if cue['end']-cues[first]['start'] >= 25 or i == len(cues)-1:
        plans.append({'firstCue':first+1, 'lastCue':i+1, 'start':max(0, cues[first]['start']-4), 'end':min(3113.331293, cue['end']+4), 'wordIndices':[wi for c in cues[first:i+1] for wi in c['wordIndices']]})
        first = i+1

settings = {'sampleRate':16000, 'chunkTargetSeconds':25, 'paddingSeconds':4, 'threads':a.threads, 'withStar':True, 'normalization':'NFD accents removed; ASCII letters; Spanish cardinal expansion of digit tokens and XVII–XXI; no source mutation'}
report = {'complete':False, 'audioSha256':audio_sha, 'vttSha256':vtt_sha, 'model':'torchaudio.pipelines.MMS_FA', 'engine':{n:importlib.metadata.version(n) for n in ['torch','torchaudio','numpy','num2words']}, 'settings':settings, 'chunks':[], 'words':words, 'humanListening':False, 'runtimeEnabled':False}
if output.exists():
    old = json.loads(output.read_text())
    assert old['audioSha256'] == audio_sha and old['vttSha256'] == vtt_sha and old['settings'] == settings
    assert [(w['word'],w['normalized'],w['cue']) for w in old['words']] == [(w['word'],w['normalized'],w['cue']) for w in words]
    report = old
    words = report['words']

def save():
    temp = output.with_suffix('.tmp'); temp.write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n'); temp.replace(output)

if report['complete']: print('REUSE', output); raise SystemExit(0)
torch.set_num_threads(a.threads); torch.set_num_interop_threads(1)
model = MMS_FA.get_model().eval(); tokenizer = MMS_FA.get_tokenizer(); aligner = MMS_FA.get_aligner()
model_file = next((Path(a.model_dir)/'hub/checkpoints').glob('*.pt'))
report['modelWeights'] = {'name':model_file.name, 'sha256':digest(model_file)}
data = np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(audio),'-f','f32le','-ac','1','-ar','16000','-']), dtype=np.float32).copy()
assert abs(len(data)/16000-3113.331293) < .001
print('ALIGN', len(plans), 'chunks', len(words), 'VTT words', flush=True)
for pi, plan in enumerate(plans):
    if pi < len(report['chunks']): continue
    if a.max_chunks is not None and pi >= a.max_chunks: break
    began = time.monotonic()
    lo, hi = round(plan['start']*16000), round(plan['end']*16000)
    waveform = torch.from_numpy(data[lo:hi]).unsqueeze(0)
    targets = ['*'] + [part for wi in plan['wordIndices'] for part in words[wi]['normalized']] + ['*']
    with torch.inference_mode():
        emission, _ = model(waveform)
        spans = aligner(emission[0], tokenizer(targets))
    assert len(spans) == len(targets)
    ratio = waveform.size(1)/emission.size(1)/16000
    cursor = 1
    for wi in plan['wordIndices']:
        count = len(words[wi]['normalized']); token_spans = [s for part in spans[cursor:cursor+count] for s in part]; cursor += count
        score = sum(s.score*len(s) for s in token_spans)/sum(len(s) for s in token_spans)
        words[wi].update({'start':round(lo/16000 + token_spans[0].start*ratio, 6), 'end':round(lo/16000 + token_spans[-1].end*ratio, 6), 'score':round(score,6), 'chunk':pi+1})
    assert cursor == len(spans)-1
    report['chunks'].append({**plan, 'frames':emission.size(1), 'frameSeconds':ratio, 'secondsToCompute':round(time.monotonic()-began,3)})
    report['words'] = words; save()
    print('CHUNK', pi+1, '/', len(plans), 'seconds', round(time.monotonic()-began,2), flush=True)
report['complete'] = len(report['chunks']) == len(plans); save()
print('COMPLETE', report['complete'], flush=True)
