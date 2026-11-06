import json,re,unicodedata,difflib, pathlib
# Editorial helper; writes candidates, never overwrites the validated alignment.
# First export an untimed document with buildScharagrodskyDocument(academic, {}).
import argparse
parser=argparse.ArgumentParser()
parser.add_argument('--document',required=True,help='JSON exported by the actual JS document builder')
parser.add_argument('--output-dir',required=True,help='Separate candidate directory')
args=parser.parse_args()
root=pathlib.Path(__file__).resolve().parents[2]
output=pathlib.Path(args.output_dir);output.mkdir(parents=True,exist_ok=True)
def tokens(s):
 s=unicodedata.normalize('NFD',s.lower())
 s=''.join(c for c in s if not unicodedata.combining(c))
 s=s.replace('alumno/a','alumno').replace('maestras/os','maestros')
 return re.findall(r'[a-z0-9]+',s)
def sec(s):
 h,m,v=s.split(':');return int(h)*3600+int(m)*60+float(v)
vtt=(root/'portable-site/src/scharagrodsky/sync.vtt').read_text()
cues=[]
for block in re.split(r'\n\s*\n',vtt.replace('\r','')):
 lines=block.splitlines(); ti=next((i for i,l in enumerate(lines) if '-->' in l),None)
 if ti is None:continue
 a,b=lines[ti].split(' --> ')
 cues.append({'start':sec(a),'end':sec(b),'text':re.sub('<[^>]*>','', ' '.join(lines[ti+1:]))})
vt=[]; vi=[]
for i,c in enumerate(cues):
 t=tokens(c['text']);vt+=t;vi += [i]*len(t)
words=json.load(open(root/'data/scharagrodsky-voice-words.json'))
at=[]; ai=[]
for i,w in enumerate(words):
 t=tokens(w['word']);at+=t;ai +=[i]*len(t)
def mapping(a,b):
 result={}
 for m in difflib.SequenceMatcher(None,a,b,autojunk=False).get_matching_blocks():
  for k in range(m.size):result[m.a+k]=m.b+k
 return result
va=mapping(vt,at)
doc=json.load(open(args.document))
units=doc['frontMatter'][:]
for s in doc['sections']:
 if s.get('headingSentence'):units.append(s['headingSentence'])
 units += [u for p in s['paragraphs'] for u in p['sentences']]
dt=[]; di=[]; bounds=[]
for i,u in enumerate(units):
 start=len(dt); t=tokens(u['text']); dt+=t;di+=[i]*len(t);bounds.append((start,len(dt)))
dv=mapping(dt,vt)
result={}; audit=[]
for u,(a,b) in zip(units,bounds):
 v=[(j,dv[j]) for j in range(a,b) if j in dv]
 matched=[(j,vj,va[vj]) for j,vj in v if vj in va]
 # Epigraphs and unsaid citations have no manufactured times.
 ratio=len(v)/max(1,b-a)
 if ratio<.30 or len(v)<min(3,b-a) or not matched:
  audit.append({'id':u['id'],'unavailable':True,'ratio':round(ratio,3),'vttRange':([cues[vi[v[0][1]]]['start'],cues[vi[v[-1][1]]]['end']] if v else None),'text':u['text']})
  continue
 first,last=matched[0],matched[-1]
 w0,w1=words[ai[first[2]]],words[ai[last[2]]]
 start,end=w0['start'],w1['end']
 prefix=' '.join(dt[a:first[0]])
 suffix=' '.join(dt[last[0]+1:b])
 flags=[]
 if first[0]-a>1:flags.append('start-unmatched')
 if start < cues[vi[first[1]]]['start']-1 or start>cues[vi[first[1]]]['end']+1:flags.append('asr-vtt-discrepancy')
 if end<=start:flags.append('empty')
 result[u['id']]={'start':round(start,3),'end':round(end,3)}
 audit.append({'id':u['id'],'start':round(start,3),'end':round(end,3),'firstWord':w0,'lastWord':w1,'vttStartCue':vi[first[1]]+1,'vttStartRange':[cues[vi[first[1]]]['start'],cues[vi[first[1]]]['end']],'matchedVttRatio':round(ratio,3),'prefix':prefix,'suffix':suffix,'flags':flags,'text':u['text']})
json.dump(result,open(output/'alignment-candidate.json','w'),ensure_ascii=False,indent=2)
json.dump(audit,open(output/'alignment-audit.json','w'),ensure_ascii=False,indent=2)
json.dump(words,open(output/'voice-words.json','w'),ensure_ascii=False)
print('VTT',len(cues),'VTT words',len(vt),'ASR words',len(at),'ASR matched',len(va))
print('Document',len(units),'timed',len(result),'no audio',len(units)-len(result),'flagged',sum(bool(x.get('flags')) for x in audit))
for x in audit:
 if x.get('flags'):print(x['id'],x['start'],x['flags'],'prefix:',x['prefix'],x['text'][:90])
