# Diagnostico de solo lectura sobre fuentes; escribe informes en el directorio de entrada.
# Uso: python AUDITAR_INSUMOS.py /ruta/soares; requiere PyMuPDF, ffprobe y pdf-layout.txt de pdftotext -layout.
import re,json,hashlib,html,unicodedata,difflib,subprocess,sys
from pathlib import Path
import fitz
p=Path(sys.argv[1]) if len(sys.argv)>1 else Path.cwd()
def tok(s):
    s=unicodedata.normalize('NFKD',s.lower())
    return re.findall(r'[a-z0-9]+',''.join(c for c in s if not unicodedata.combining(c)))
def diff(a,b):
    aa,bb=tok(a),tok(b)
    sm=difflib.SequenceMatcher(None,aa,bb,autojunk=False)
    changes=[dict(kind=t,a_range=[i,j],b_range=[k,l],a=' '.join(aa[i:j]),b=' '.join(bb[k:l])) for t,i,j,k,l in sm.get_opcodes() if t!='equal']
    return dict(a_tokens=len(aa),b_tokens=len(bb),matched=sum(x.size for x in sm.get_matching_blocks()),ratio=sm.ratio(),changes=changes)
v=(p/'subtitles.vtt').read_text(encoding='utf-8-sig')
def seconds(s):
    h,m,z=s.split(':'); return int(h)*3600+int(m)*60+float(z)
cues=[]
for block in re.split(r'\n\s*\n',v.strip()):
    lines=block.splitlines()
    ti=next((i for i,l in enumerate(lines) if '-->' in l),None)
    if ti is None: continue
    a,b=lines[ti].split(' --> ')
    text=html.unescape(re.sub(r'<[^>]*>','',' '.join(lines[ti+1:])))
    cues.append(dict(index=len(cues)+1,start=seconds(a),end=seconds(b.split()[0]),text=text))
a=(p/'editable-a.txt').read_text(encoding='utf-8-sig'); b=(p/'editable-b.txt').read_text(encoding='utf-8-sig')
transcript=' '.join(c['text'] for c in cues)
(p/'vtt-transcript.txt').write_text(transcript,encoding='utf-8')
doc=fitz.open(p/'academic.pdf')
pages=[pg.get_text() for pg in doc]
(p/'pdf-pages.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf-8')
report={'scope':'diagnostico Work 1; no certifica alineacion acustica ni crea pagina', 'files':{},'audio':json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(p/'audio.mp3')])),'vtt':{'count':len(cues),'first':cues[0],'last':cues[-1],'invalid':[c for c in cues if c['end']<=c['start']],'overlaps':[c for prev,c in zip(cues,cues[1:]) if c['start']<prev['end']-0.0001],'reversedStarts':[c for prev,c in zip(cues,cues[1:]) if c['start']<prev['start']],'gapsOver1s':[{'afterCue':prev['index'],'start':prev['end'],'end':c['start'],'gap':c['start']-prev['end']} for prev,c in zip(cues,cues[1:]) if c['start']-prev['end']>1],'sumCueSeconds':sum(c['end']-c['start'] for c in cues)},'diffs':{'editable_a_vs_b':diff(a,b),'editable_a_vs_vtt':diff(a,transcript),'editable_b_vs_vtt':diff(b,transcript),'pdf_vs_txt':diff((p/'pdf-layout.txt').read_text(),(p/'txt-1.txt').read_text(encoding='utf-8-sig'))},'pageStarts':[{'page':i+1,'start':pg[:190]} for i,pg in enumerate(pages)],'headings':[]}
for name in ['academic.pdf','audio.mp3','subtitles.vtt','txt-1.txt','txt-2.txt','editable-a.txt','editable-b.txt','directrices.txt']:
    data=(p/name).read_bytes(); report['files'][name]={'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
for phrase in ['Introducción','Corrientes gimnásticas: un modo inédito de educar el cuerpo','LA CORRIENTE FRANCESA','LA CORRIENTE SUECA','LA GIMNÁSTICA ALEMANA','LAS CORRIENTES GIMNÁSTICAS Y LOS MOVIMIENTOS','Algunas ideas finales']:
    needle=' '.join(tok(phrase)); match=next((c for c in cues if needle in ' '.join(tok(c['text']))),None)
    report['headings'].append({'heading':phrase,'cue':match,'pdfPages':[i+1 for i,s in enumerate(pages) if needle in ' '.join(tok(s))]})
(p/'audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
(p/'cues.json').write_text(json.dumps(cues,ensure_ascii=False,indent=2),encoding='utf-8')
summary={k:report[k] for k in ['files','vtt','headings']}
summary['diffs']={k:{**{kk:vv for kk,vv in val.items() if kk!='changes'},'change_count':len(val['changes']),'changes':val['changes'][:12]} for k,val in report['diffs'].items()}
print(json.dumps(summary,ensure_ascii=False,indent=2))
