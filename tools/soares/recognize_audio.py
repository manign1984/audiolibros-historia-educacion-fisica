"""Local acoustic evidence. Does not change narration, reader text or sync status.
Requires faster-whisper==1.2.1, ctranslate2==4.8.5 and ffmpeg.
Use --windows JSON for [{start,end},...] instead of the whole recording.
Outputs contain transcription text: keep private until use conditions are settled.
"""
import argparse,json,hashlib,subprocess,importlib.metadata
from pathlib import Path
import numpy as np
from faster_whisper import WhisperModel
p=argparse.ArgumentParser();p.add_argument('--audio',required=True);p.add_argument('--output',required=True);p.add_argument('--model',default='tiny');p.add_argument('--model-dir',required=True);p.add_argument('--windows');p.add_argument('--threads',type=int,default=4);a=p.parse_args()
audio=Path(a.audio);out=Path(a.output);out.parent.mkdir(parents=True,exist_ok=True)
sha=hashlib.sha256(audio.read_bytes()).hexdigest();assert sha=='f9c4226ec5794a959d77d6f97b523eabadb0dcdc272bbec9c9e1b04d9a019b37'
windows=json.loads(Path(a.windows).read_text()) if a.windows else [{'start':0,'end':3113.331293}]
if out.exists():
 old=json.loads(out.read_text())
 if old.get('complete') and old['audioSha256']==sha and old['model']==a.model:print('REUSE',out);raise SystemExit(0)
print('LOAD',a.model,'windows',len(windows),flush=True)
model=WhisperModel(a.model,device='cpu',compute_type='int8',cpu_threads=a.threads,download_root=a.model_dir)
report={'complete':False,'audioSha256':sha,'model':a.model,'engine':{n:importlib.metadata.version(n) for n in ['faster-whisper','ctranslate2','huggingface-hub']},'decoding':'ffmpeg mono 16000 Hz float32','settings':{'language':'es','beam_size':5,'word_timestamps':True,'vad_filter':True,'condition_on_previous_text':False,'cpu_threads':a.threads},'windows':[],'words':[]}
for wi,win in enumerate(windows):
 start,end=win['start'],win['end'];data=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-ss',str(start),'-i',str(audio),'-t',str(end-start),'-f','f32le','-ac','1','-ar','16000','-']),dtype=np.float32)
 segments,info=model.transcribe(data,**{k:v for k,v in report['settings'].items() if k!='cpu_threads'})
 record={'start':start,'end':end,'segments':[]};report['windows'].append(record)
 for i,seg in enumerate(segments):
  record['segments'].append({'start':round(start+seg.start,3),'end':round(start+seg.end,3),'text':seg.text})
  report['words'] += [{'word':w.word,'start':round(start+w.start,3),'end':round(start+w.end,3),'probability':w.probability} for w in seg.words or []]
  if i%50==0:print(wi,i,round(start+seg.end),flush=True);out.with_suffix('.progress.json').write_text(json.dumps(report,ensure_ascii=False))
 out.with_suffix('.progress.json').write_text(json.dumps(report,ensure_ascii=False));print('WINDOW',wi+1,'/',len(windows),flush=True)
report['complete']=True;out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print('DONE',len(report['words']),flush=True)
