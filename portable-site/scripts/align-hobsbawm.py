"""Align the provided text with measured ASR word timestamps; do not invent times for omitted passages."""
from pathlib import Path
import json,re,unicodedata,difflib,subprocess,hashlib
PORTABLE=Path(__file__).resolve().parents[1]
REPO=PORTABLE.parent
js="""import fs from 'node:fs'; import {buildHobsbawmReadingDocument as build} from './src/hobsbawm/buildReadingDocument.js'; console.log(JSON.stringify(build(fs.readFileSync('./src/hobsbawm/hobsbawm-source.txt','utf8'))));"""
doc=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],cwd=PORTABLE,text=True))
asr=json.loads((REPO/'data/hobsbawm-asr-words.json').read_text())
def norm(text):
 text=unicodedata.normalize('NFD',text.lower())
 text=''.join(c for c in text if unicodedata.category(c)!='Mn')
 text=re.sub(r'\burss\b','union sovietica',text)
 return re.findall(r'[a-z0-9]+',text)
words=[]
for w in asr['words']:
 for token in norm(w['word']): words.append({'token':token,'start':w['start'],'end':w['end']})
ref=[]
units=[]
sentences=doc['frontMatter']+[s for sec in doc['sections'] for p in sec['paragraphs'] for s in p['sentences']]
for sent in sentences:
 units.append({'id':sent['id'],'text':sent['text'],'a':len(ref)})
 ref.extend(norm(sent['text']))
 units[-1]['b']=len(ref)
alignment={}
for a,b,size in difflib.SequenceMatcher(None,ref,[w['token'] for w in words],autojunk=False).get_matching_blocks():
 for k in range(size): alignment[a+k]=b+k
expected_omissions={f'memoria-p5-s{i}' for i in range(7,12)}|{'triptico-p8-s6'}
report=[]
timings={}
prev=0
for unit in units:
 indices=[alignment[k] for k in range(unit['a'],unit['b']) if k in alignment]
 coverage=len(indices)/max(1,unit['b']-unit['a'])
 if indices:
  start,end=words[indices[0]]['start'],words[indices[-1]]['end']
  assert coverage>=.6,(unit['id'],coverage)
  assert start>=prev and end>start and end<=doc['duration']+.1,(unit['id'],start,end,prev)
  timings[unit['id']]={'start':round(start,3),'end':round(end,3)}
  prev=start
 else:
  assert unit['id'] in expected_omissions,unit['id']
  timings[unit['id']]={'audioUnavailable':True}
 report.append({'id':unit['id'],'matched':len(indices),'tokens':unit['b']-unit['a'],'coverage':round(coverage,4),**timings[unit['id']]})
assert {r['id'] for r in report if r.get('audioUnavailable')}==expected_omissions
metadata={'method':'ASR word timestamps + monotone lexical alignment to the provided text','engine':asr['engine'],'model':asr['model'],'sourceAudioSha256':asr['sourceAudioSha256'],'textSha256':hashlib.sha256((PORTABLE/'src/hobsbawm/hobsbawm-source.txt').read_bytes()).hexdigest(),'units':len(report),'spokenUnits':len(report)-len(expected_omissions),'omittedUnits':sorted(expected_omissions),'matchedTokenRatio':round(sum(r['matched'] for r in report)/sum(r['tokens'] for r in report),5),'reviewedBoundaries':[0,7.3,704.38,705.86,1341.02,1342,2941.68],'sentences':report}
(PORTABLE/'src/hobsbawm/timings.json').write_text(json.dumps(timings,ensure_ascii=False,indent=2)+'\n')
(REPO/'data/hobsbawm-alignment-report.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
cues=[]
for unit in units:
 t=timings[unit['id']]
 if 'start' not in t: continue
 cues.append(f"{len(cues)+1}\n{stamp(t['start'])} --> {stamp(t['end'])}\n{unit['text']}\n")
(PORTABLE/'public/assets/hobsbawm-alineacion.srt').write_text('\n'.join(cues),encoding='utf-8')
print(json.dumps({k:v for k,v in metadata.items() if k!='sentences'},ensure_ascii=False,indent=2))
