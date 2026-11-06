"""Correspondencia textual monotónica; ventanas de cues, NO alineación forzada.
Uso: python align.py DOCUMENT_JSON VTT SILENCE_LOG OUTPUT_JSON
Silence log: ffmpeg -af silencedetect=noise=-35dB:d=0.15 -f null -
"""
import sys,json,re,unicodedata,difflib,hashlib
from pathlib import Path
D,V,S,O=map(Path,sys.argv[1:]);doc=json.loads(D.read_text())
assert hashlib.sha256(V.read_bytes()).hexdigest()=='ec0beaea889464cd05328c6e73fb80f36f3f8899ae99cc463fcefb82bc1e294f'
norm=lambda t:re.findall(r'\w+', ''.join(c for c in unicodedata.normalize('NFKD',t.lower()) if not unicodedata.combining(c)))
def sec(t):
 a,b,c=t.split(':');return int(a)*3600+int(b)*60+float(c)
cues=[]
for block in re.split(r'\n\s*\n',V.read_text()):
 m=re.search(r'(\d\d:\d\d:\d\d\.\d+) --> (\d\d:\d\d:\d\d\.\d+)\n([\s\S]*)',block)
 if m:
  cues.append({'start':sec(m[1]),'end':sec(m[2]),'tokens':norm(re.sub('<[^>]*>','',m[3]))})
assert len(cues)==593
units=[u for u in doc['frontMatter'] if not u.get('audioUnavailable')]
for s in doc['sections']:
 units.append(s['headingSentence']);units.extend(u for p in s['paragraphs'] for u in p['sentences'])
a=[];unitranges=[]
for u in units:
 t=norm(u['text']);unitranges.append((len(a),len(a)+len(t)));a.extend(t)
b=[];owners=[]
for ci,c in enumerate(cues):
 for ti,t in enumerate(c['tokens']):b.append(t);owners.append((ci,ti))
matcher=difflib.SequenceMatcher(None,a,b,autojunk=False);mapping={}
for ai,bi,n in matcher.get_matching_blocks():mapping.update({ai+i:bi+i for i in range(n)})
silences=[]
for line in S.read_text().splitlines():
 m=re.search(r'silence_end: ([\d.]+) \| silence_duration: ([\d.]+)',line)
 if m:
  end,d=map(float,m.groups());silences.append((round(end-d,6),end))
evidence={}
for u,(lo,hi) in zip(units,unitranges):
 mapped=[mapping[i] for i in range(lo,hi) if i in mapping]
 if not mapped:
  evidence[u['id']]={'status':'unmatched','tokens':hi-lo};continue
 first,last=owners[mapped[0]],owners[mapped[-1]]
 c0,c1=cues[first[0]],cues[last[0]]
 startExact=lo in mapping and first[1]==0
 endExact=hi-1 in mapping and last[1]==len(c1['tokens'])-1
 nearest=lambda t:[list(x) for x in silences if x[0]-.25<=t<=x[1]+.25]
 evidence[u['id']]={'status':'cue-envelope','cueFirst':first[0]+1,'cueLast':last[0]+1,'candidateStart':c0['start'],'candidateEnd':c1['end'],'matchedTokens':len(mapped),'tokens':hi-lo,'coverage':round(len(mapped)/(hi-lo),4),'startAtCueBoundary':startExact,'endAtCueBoundary':endExact,'startSilences':nearest(c0['start']),'endSilences':nearest(c1['end']),'acousticallyVerified':False,'runtimeEnabled':False}
summary={'sourceVttSha256':hashlib.sha256(V.read_bytes()).hexdigest(),'documentSha256':hashlib.sha256(D.read_bytes()).hexdigest(),'method':'normalized-token-sequence + cue envelopes + silence detection; no word-time interpolation','acousticMethod':'ffmpeg silencedetect -35dB / minimum 0.15 seconds; silence is not semantic confirmation','units':len(units),'cueCount':len(cues),'matchedAcademicTokens':len(mapping),'academicTokens':len(a),'vttTokens':len(b),'bothCueBoundaries':sum(x.get('startAtCueBoundary',False) and x.get('endAtCueBoundary',False) for x in evidence.values()),'uncertainUnits':len(units),'syncStatus':'pending','humanListening':False,'forcedAlignment':False,'silences':len(silences),'evidence':evidence}
O.parent.mkdir(parents=True,exist_ok=True);O.write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in summary.items() if k!='evidence'},ensure_ascii=False))
