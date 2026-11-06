"""Compare measured word boundaries from two ASR sizes at identical VTT tokens.

This is machine corroboration, not human listening or forced alignment.
Usage: compare_acoustic.py DOCUMENT VTT TINY BASE AUDIT OUTPUT
"""
import json, re, sys, unicodedata, difflib, hashlib
from pathlib import Path

document, vtt, tiny, base, audit, output = map(Path, sys.argv[1:])
doc, t, b, report = [json.loads(p.read_text()) for p in (document, tiny, base, audit)]
assert t['complete'] and b['complete'] and t['audioSha256'] == b['audioSha256']
assert t['model'] == 'tiny' and b['model'] == 'base'

def norm(s):
    return re.findall(r'\w+', ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if not unicodedata.combining(c)))

def flatten(items, key):
    tokens, owners, bounds = [], [], []
    for i, item in enumerate(items):
        value = norm(item[key]); bounds.append((len(tokens), len(tokens) + len(value)))
        tokens.extend(value); owners.extend([i] * len(value))
    return tokens, owners, bounds

def match(x, y):
    return {m.a+i: m.b+i for m in difflib.SequenceMatcher(None, x, y, autojunk=False).get_matching_blocks() for i in range(m.size)}

def seconds(value):
    h, m, s = value.split(':'); return int(h)*3600 + int(m)*60 + float(s)

cues = []
for block in re.split(r'\n\s*\n', vtt.read_text()):
    m = re.search(r'(\d\d:\d\d:\d\d\.\d+) --> (\d\d:\d\d:\d\d\.\d+)\n([\s\S]*)', block)
    if m: cues.append({'start': seconds(m[1]), 'end': seconds(m[2]), 'text': re.sub('<[^>]*>', '', m[3])})
v, vi, _ = flatten(cues, 'text')
ac, ai, _ = flatten(t['words'], 'word'); vt = match(v, ac)
vb = {}
for window in b['windows']:
    indices = [i for i, cue in enumerate(cues) if cue['end'] > window['start'] and cue['start'] < window['end']]
    token_indices = [i for i, owner in enumerate(vi) if owner in indices]
    words = [w for w in b['words'] if w['start'] >= window['start']-.001 and w['end'] <= window['end']+.001]
    tokens, owners, _ = flatten(words, 'word')
    vb.update({token_indices[i]: words[owners[j]] for i, j in match([v[k] for k in token_indices], tokens).items()})
units = [u for u in doc['frontMatter'] if not u.get('audioUnavailable')] + [u for s in doc['sections'] for u in [s['headingSentence']] + [u for p in s['paragraphs'] for u in p['sentences']]]
d, _, bounds = flatten(units, 'text'); dv = match(d, v)
records = []
for u, (lo, hi), prior in zip(units, bounds, report['records']):
    assert u['id'] == prior['id']
    matches = [(j, dv[j], vt[dv[j]]) for j in range(lo, hi) if j in dv and dv[j] in vt]
    r = {'id': u['id'], 'priorFlags': prior['flags'], 'boundaries': {}}
    for key, token in [('start', matches[0] if matches else None), ('end', matches[-1] if matches else None)]:
        if token is None or token[1] not in vb: continue
        tw, bw = t['words'][ai[token[2]]], vb[token[1]]
        delta = round(bw[key]-tw[key], 4)
        if abs(delta) > 4: continue  # lexical match displaced outside the target passage
        r['boundaries'][key] = {'tiny': tw[key], 'base': bw[key], 'delta': delta, 'baseProbability': round(bw['probability'], 4), 'agreementWithin450ms': abs(delta) <= .45}
    r['bothCompared'] = len(r['boundaries']) == 2
    r['needsHumanReview'] = bool(r['priorFlags']) or any(not x['agreementWithin450ms'] for x in r['boundaries'].values())
    records.append(r)
result = {'status': 'candidate-not-activated', 'method': 'Two ASR sizes, exact normalized VTT-token identity, measured endpoints; no interpolation', 'models': ['tiny', 'base'], 'reviewWindows': len(b['windows']), 'reviewSeconds': round(sum(w['end']-w['start'] for w in b['windows']), 3), 'audioSha256': t['audioSha256'], 'inputs': {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in [document, vtt, tiny, base, audit]}, 'units': len(records), 'comparedBoundaries': sum(len(r['boundaries']) for r in records), 'bothCompared': sum(r['bothCompared'] for r in records), 'disagreements': sum(not x['agreementWithin450ms'] for r in records for x in r['boundaries'].values()), 'needsHumanReview': sum(r['needsHumanReview'] for r in records), 'humanListening': False, 'runtimeEnabled': False, 'records': records}
output.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k != 'records'}))
