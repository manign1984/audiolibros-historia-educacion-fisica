"""Numeric, text-free CTC evidence for the fixed academic reader.
Usage: evaluate_ctc.py DOCUMENT CTC TINY OUTPUT [PRIVATE_DIFFERENCES]
Requires a COMPLETE CTC report. Does not activate or rewrite the reader.
"""
import difflib, hashlib, json, re, statistics, sys, unicodedata
from pathlib import Path

document, ctc_path, tiny_path, output = map(Path, sys.argv[1:5])
doc, ctc, tiny = [json.loads(p.read_text()) for p in (document, ctc_path, tiny_path)]
assert ctc['complete'] and tiny['complete']
assert ctc['audioSha256'] == tiny['audioSha256']
assert all(all(k in w for k in ['start','end','score','chunk']) for w in ctc['words'])
assert ctc['settings']['paddingSeconds'] == 4

def norm(s):
    return re.findall(r'\w+', ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if not unicodedata.combining(c)))

def flatten(items, key):
    tokens, owners, bounds = [], [], []
    for i, item in enumerate(items):
        value = norm(item[key]); bounds.append((len(tokens),len(tokens)+len(value)))
        tokens.extend(value); owners.extend([i]*len(value))
    return tokens, owners, bounds

def mapping(x, y):
    return {m.a+i:m.b+i for m in difflib.SequenceMatcher(None,x,y,autojunk=False).get_matching_blocks() for i in range(m.size)}

units = [u for u in doc['frontMatter'] if not u.get('audioUnavailable')] + [u for s in doc['sections'] for u in [s['headingSentence']] + [u for p in s['paragraphs'] for u in p['sentences']]]
d, _, bounds = flatten(units, 'text')
v, vi, _ = flatten(ctc['words'], 'word')
t, ti, _ = flatten(tiny['words'], 'word')
dv, vt = mapping(d,v), mapping(v,t)
records = []; private_differences = []; previous_end = 0
for unit, (lo,hi) in zip(units,bounds):
    matches = [(j,dv[j]) for j in range(lo,hi) if j in dv]
    r = {'id':unit['id'], 'flags':[], 'runtimeEnabled':False}
    if not matches:
        r['flags'].append('no-narrated-token-match'); records.append(r); continue
    first, last = matches[0], matches[-1]
    fragment = v[first[1]:last[1]+1]
    operations = [{'operation':tag, 'academicNormalizedTokens':d[lo+i:lo+j], 'vttNormalizedTokens':fragment[k:l]} for tag,i,j,k,l in difflib.SequenceMatcher(None,d[lo:hi],fragment,autojunk=False).get_opcodes() if tag != 'equal']
    private_differences.append({'id':unit['id'], 'academicText':unit['text'], 'vttFragment':' '.join(w['word'] for w in ctc['words'][vi[first[1]]:vi[last[1]]+1]), 'literalCorrespondenceDifferences':operations, 'label':'VTT supplied for narration; lexical differences are not silent corrections; CTC diagnostics remain separate'})
    start_word, end_word = ctc['words'][vi[first[1]]], ctc['words'][vi[last[1]]]
    start, end = start_word['start'], end_word['end']
    r.update({'candidateStart':start, 'candidateEnd':end, 'matchedAcademicTokens':len(matches), 'academicTokens':hi-lo, 'lexicalCoverage':round(len(matches)/(hi-lo),4), 'academicPrefixTokensUnmatched':first[0]-lo, 'academicSuffixTokensUnmatched':hi-1-last[0], 'firstVttWordIndex':vi[first[1]], 'lastVttWordIndex':vi[last[1]], 'cueFirst':start_word['cue'], 'cueLast':end_word['cue'], 'startCtcScore':start_word['score'], 'endCtcScore':end_word['score'], 'startChunk':start_word['chunk'], 'endChunk':end_word['chunk'], 'sameTokenWhisperComparison':{}})
    if not 0 <= start < end <= 3113.331293: r['flags'].append('invalid-interval')
    if start < previous_end-.06:
        r['flags'].append('overlap-over-60ms')
        if records: records[-1]['flags'].append('overlap-with-next-over-60ms')
    if min(start_word['score'],end_word['score']) < .5: r['flags'].append('ctc-boundary-score-below-0.5')
    if r['lexicalCoverage'] < .75: r['flags'].append('academic-narration-coverage-below-0.75')
    if r['academicPrefixTokensUnmatched'] > 1: r['flags'].append('academic-prefix-unmatched')
    for edge, pair, word in [('start',first,start_word),('end',last,end_word)]:
        chunk = ctc['chunks'][word['chunk']-1]
        if edge == 'start' and word['start']-chunk['start'] < .1: r['flags'].append('near-start-of-crop')
        if edge == 'end' and chunk['end']-word['end'] < .1: r['flags'].append('near-end-of-crop')
        if pair[1] in vt:
            observed = tiny['words'][ti[vt[pair[1]]]][edge]
            delta = round(word[edge]-observed,6)
            r['sameTokenWhisperComparison'][edge] = {'ctc':word[edge], 'whisperTiny':observed, 'deltaSeconds':delta, 'within300ms':abs(delta)<=.3}
    r['ctcVsWhisperBothWithin300ms'] = len(r['sameTokenWhisperComparison']) == 2 and all(b['within300ms'] for b in r['sameTokenWhisperComparison'].values())
    previous_end = end; records.append(r)

for r in records:
    r['machineCorroboratedCandidate'] = not r['flags'] and r.get('ctcVsWhisperBothWithin300ms',False)
    r['requiresReview'] = not r['machineCorroboratedCandidate']
scores = [w['score'] for w in ctc['words']]
report = {'status':'candidate-not-activated', 'method':'MMS_FA CTC frame alignment of VTT narration; monotone exact lexical mapping to academic units; same-token comparison with preserved Whisper tiny', 'inputs':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [document,ctc_path,tiny_path]}, 'audioSha256':ctc['audioSha256'], 'vttSha256':ctc['vttSha256'], 'model':ctc['model'], 'modelWeights':ctc['modelWeights'], 'engine':ctc['engine'], 'settings':ctc['settings'], 'chunks':len(ctc['chunks']), 'narratedVttWords':len(ctc['words']), 'academicUnits':len(records), 'timedCandidates':sum('candidateStart' in r for r in records), 'machineCorroboratedCandidates':sum(r['machineCorroboratedCandidate'] for r in records), 'requiresReview':sum(r['requiresReview'] for r in records), 'flagCounts':{flag:sum(flag in r['flags'] for r in records) for flag in sorted({f for r in records for f in r['flags']})}, 'scoreDiagnostics':{'medianWordScore':statistics.median(scores), 'wordsBelow0_5':sum(s<.5 for s in scores)}, 'thresholdsAreTriageOnly':True, 'humanListening':False, 'runtimeEnabled':False, 'notesOrBibliographyTimed':False, 'records':records}
output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
if len(sys.argv) > 5:
    Path(sys.argv[5]).write_text(json.dumps({'units':private_differences, 'nonNarratedApparatus':{'academicNotes':len(doc['endnotes']),'bibliographyEntries':len(doc['bibliography'])}, 'humanListening':False, 'runtimeEnabled':False},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['records','inputs','settings','engine']},ensure_ascii=False))
