"""Monotone document->VTT->measured ASR word mapping. Never interpolates.
Outputs candidates and review flags; does not activate the reader.
"""
import argparse,re,json,unicodedata,difflib,hashlib
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--document',required=True);p.add_argument('--vtt',required=True);p.add_argument('--asr',required=True);p.add_argument('--outdir',required=True);a=p.parse_args()
out=Path(a.outdir);out.mkdir(parents=True,exist_ok=True);doc=json.loads(Path(a.document).read_text());asr=json.loads(Path(a.asr).read_text());assert asr['complete'];words=asr['words']
norm=lambda s:re.findall(r'\w+',''.join(c for c in unicodedata.normalize('NFD',s.lower()) if not unicodedata.combining(c)))
def seconds(t):h,m,s=t.split(':');return int(h)*3600+int(m)*60+float(s)
cues=[]
for block in re.split(r'\n\s*\n',Path(a.vtt).read_text()):
 m=re.search(r'(\d\d:\d\d:\d\d\.\d+) --> (\d\d:\d\d:\d\d\.\d+)\n([\s\S]*)',block)
 if m:cues.append({'start':seconds(m[1]),'end':seconds(m[2]),'text':re.sub('<[^>]*>','',m[3])})
def flattened(items,key):
 tokens=[];owners=[];bounds=[]
 for i,item in enumerate(items):
  t=norm(item[key]);bounds.append((len(tokens),len(tokens)+len(t)));tokens+=t;owners +=[i]*len(t)
 return tokens,owners,bounds
def match(a,b):return {m.a+i:m.b+i for m in difflib.SequenceMatcher(None,a,b,autojunk=False).get_matching_blocks() for i in range(m.size)}
v,vi,_=flattened(cues,'text');ac,ai,_=flattened(words,'word');va=match(v,ac)
units=[u for u in doc['frontMatter'] if not u.get('audioUnavailable')]+[u for s in doc['sections'] for u in [s['headingSentence']]+[u for p in s['paragraphs'] for u in p['sentences']]]
d,di,bounds=flattened(units,'text');dv=match(d,v);records=[];timings={};previous=0;windows=[]
for u,(lo,hi) in zip(units,bounds):
 matches=[(j,dv[j],va[dv[j]]) for j in range(lo,hi) if j in dv and dv[j] in va]
 if not matches:records.append({'id':u['id'],'flags':['unmatched']});continue
 first,last=matches[0],matches[-1];w0,w1=words[ai[first[2]]],words[ai[last[2]]];start,end=w0['start'],w1['end'];coverage=len(matches)/(hi-lo);flags=[]
 if first[0]-lo>1:flags.append('prefix-unmatched')
 if coverage<.75:flags.append('low-coverage')
 if start<previous:flags.append('overlap')
 if end<=start:flags.append('empty')
 if start<cues[vi[first[1]]]['start']-1.5 or start>cues[vi[first[1]]]['end']+1.5:flags.append('outside-cue')
 if min(w0['probability'],w1['probability'])<.5:flags.append('low-boundary-probability')
 r={'id':u['id'],'start':start,'end':end,'coverage':round(coverage,4),'matchedTokens':len(matches),'tokens':hi-lo,'prefixTokens':first[0]-lo,'suffixTokens':hi-1-last[0],'firstProbability':round(w0['probability'],4),'lastProbability':round(w1['probability'],4),'firstWordIndex':ai[first[2]],'lastWordIndex':ai[last[2]],'cueFirst':vi[first[1]]+1,'cueLast':vi[last[1]]+1,'flags':flags};records.append(r);timings[u['id']]={'start':start,'end':end};previous=end
 if flags or u['id'].endswith('-heading'):
  for t in [start,end]:windows.append([max(0,t-7),min(3113.331293,t+8)])
windows +=[[0,35],[1535,1585],[3080,3113.331293]];merged=[]
for start,end in sorted(windows):
 if merged and start<=merged[-1]['end']:merged[-1]['end']=max(end,merged[-1]['end'])
 else:merged.append({'start':start,'end':end})
summary={'method':'monotone exact normalized lexical mapping to measured ASR words via original VTT; no interpolation','audioSha256':asr['audioSha256'],'vttSha256':hashlib.sha256(Path(a.vtt).read_bytes()).hexdigest(),'documentSha256':hashlib.sha256(Path(a.document).read_bytes()).hexdigest(),'model':asr['model'],'units':len(units),'timedCandidates':len(timings),'reviewFlagged':sum(bool(r['flags']) for r in records),'status':'candidate-not-activated','humanListening':False,'records':records}
for name,data in [('acoustic-candidate.json',timings),('acoustic-audit.json',summary),('review-windows.json',merged)]: (out/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print({k:v for k,v in summary.items() if k!='records'});print('review windows',len(merged),'seconds',round(sum(w['end']-w['start'] for w in merged),2))
