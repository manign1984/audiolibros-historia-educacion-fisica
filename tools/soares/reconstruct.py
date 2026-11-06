"""Reconstruye la copia académica sin distribuir sus materiales. Requiere PyMuPDF.
Uso: python tools/soares/reconstruct.py PDF DESTINO_JSON
No descarga, corrige léxico ni publica archivos.
"""
import sys,json,re,hashlib
from pathlib import Path
import fitz
pdf=Path(sys.argv[1]);out=Path(sys.argv[2])
assert hashlib.sha256(pdf.read_bytes()).hexdigest()=='c81a7c039eb231ef183697761ea6e01fd7e0d4715309aff65ed769b5c8d10b45'
pages=fitz.open(pdf)
def clean(t):return re.sub(r'\s+',' ',t.replace('\xad','')).strip()
rows=[];notes=[];bib=[];note=None
for pi,p in enumerate(pages):
 lines=[l for b in p.get_text('dict')['blocks'] for l in b.get('lines',[])]
 body=[];foot=[]
 for l in lines:
  spans=l['spans'];size=max(s['size'] for s in spans)
  if size>=10.9 or (pi==0 and l['bbox'][1]<260):
   text=''.join('[[note:'+s['text']+']]' if s['size']<8 and s['text'].isdigit() else s['text'] for s in sorted(spans,key=lambda s:s['bbox'][0]))
   body.append({'y':min(s['bbox'][1] for s in spans if s['size']>=10.9 or (pi==0 and l['bbox'][1]<260)),'x':l['bbox'][0],'text':text,'size':size,'right':l['bbox'][2]})
  elif pi==9 and size<8 and ''.join(s['text'] for s in spans).strip()=='22' and l['bbox'][1]<650:
   body.append({'y':l['bbox'][1],'x':l['bbox'][0],'text':'[[note:22]]','size':size,'right':l['bbox'][2]})
  elif size<8 and ''.join(s['text'] for s in spans).strip().isdigit() and l['bbox'][1]<700:
   body.append({'y':l['bbox'][1]+.5,'x':l['bbox'][0],'text':'[[note:'+''.join(s['text'] for s in spans).strip()+']]','size':size,'right':l['bbox'][2]})
  else:foot.append(l)
 for l in sorted(foot,key=lambda l:(round(l['bbox'][1]),l['bbox'][0])):
  text=clean(''.join(s['text'] for s in l['spans']))
  m=re.match(r'^(\d{1,2})\s+(.*)',text)
  if m and int(m[1])==len(notes)+1:
   note={'number':int(m[1]),'page':pi+1,'text':m[2]};notes.append(note)
  elif text:
   assert note is not None,(pi,text)
   note['text']+=' '+text
 # Coalesce line fragments that extraction separated at superscripts.
 merged=[]
 for l in sorted(body,key=lambda l:(round(l['y']),l['x'])):
  if merged and abs(l['y']-merged[-1]['y'])<2:
   merged[-1]['text']+=' '+l['text']
  else:merged.append(l)
 for i,l in enumerate(merged):
  l['page']=pi+1;l['gap']=l['y']-merged[i-1]['y'] if i else 100
  rows.append(l)
# Fixed seven headings, transcribed from this PDF, identified in order.
heads=[('introduccion','Introducción'),('sistematizacion','Corrientes gimnásticas: un modo inédito de educar el cuerpo'),('francesa','LA CORRIENTE FRANCESA'),('sueca','LA CORRIENTE SUECA'),('alemana','LA GIMNÁSTICA ALEMANA'),('minoritarios','LAS CORRIENTES GIMNÁSTICAS Y LOS MOVIMIENTOS MINORITARIOS EN SU INTERIOR'),('finales','Algunas ideas finales')]
sections=[];current=None;pending=None;front=[];biblio=False;heading_buffer=''
for l in rows:
 text=clean(l['text'])
 if text=='Referencias bibliográficas':biblio=True;pending=None;continue
 if biblio:
  # Entry starts are transcribed from the source, including repeated-author dashes.
  authors=('ARNAULD,','AMORÓS y','ANDRIEU,','BARBOSA,','BERNAL,','BONORINO,','BLOCH,','COURTINE,','DEL POZO,','DEMENY,','FOUCAULT,','GLEYSE,','GONZÁLEZ,','GOELLNER,','HASSE,','LABBÉ,','LANGLADE,','Laty,','MADUREIA,','MARINHO,','MORENO,','PAIVA,','PEREIRA,','ROCKER,',"SANT'ANNA,",'SOAR.Es,','TESCHE,','VIGARELLO,')
  if not bib or text.startswith(authors) or re.match(r'^-\s*(?:\(|y )',text):bib.append(text)
  else:bib[-1]+=' '+text
  continue
 if text=='Corrientes gimnásticas:':heading_buffer=text;continue
 if heading_buffer:
  text=heading_buffer+' '+text;heading_buffer=''
 plain=re.sub(r'\[\[note:\d+\]\]','',text)
 match=next(((sid,title) for sid,title in heads if plain==title),None)
 if match:
  current={'id':match[0],'title':match[1],'headingNotes':[int(n) for n in re.findall(r'\[\[note:(\d+)\]\]',text)],'paragraphs':[]};sections.append(current);pending=None;continue
 if text=='[[note:22]]':current['headingNotes']=[22];continue
 if current is None:front.append(text);continue
 # Keep source paragraph/quotation boundaries; join only continuations across physical pages.
 if pending is not None and ((l['gap']<=19 and not (prev_line['right']<510 and re.search(r'[.!?:][”\"]?(?:\[\[note:\d+\]\])?$',prev_line['text']))) or (l['page']!=pending['lastPage'] and not re.search(r'[.!?][”\"]?$',pending['text']))):
  pending['text']+=' '+text;pending['lastPage']=l['page']
 else:
  pending={'text':text,'kind':'quote' if text.startswith(('"','“','[...]')) else 'body','page':l['page'],'lastPage':l['page']};current['paragraphs'].append(pending)
 prev_line=l
assert len(sections)==7
assert sorted(n['number'] for n in notes)==list(range(1,30)),[n['number'] for n in notes]
# Preserve source spelling, malformed references and factual dates; editorial note separate.
academic={'id':'soares-corrientes-gimnasticas','title':'Las corrientes gimnásticas europeas y su contenido:','subtitle':'una historia de rupturas y permanencias.','author':'Carmen Lucia Soares','frontSource':front,'sections':sections,'endnotes':sorted(notes,key=lambda n:n['number']),'bibliography':bib,'editorialClarification':{'text':'Aclaración editorial: la copia de cátedra consigna 1778–1825 para Friedrich Ludwig Jahn. El catálogo de autoridades de la Bibliothèque nationale de France registra 1778–1852. Se conserva la fecha de la fuente.','url':'https://catalogue.bnf.fr/ark:/12148/cb13014309p'},'sourceSha256':hashlib.sha256(pdf.read_bytes()).hexdigest()}
out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(academic,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'sections':[(s['id'],len(s['paragraphs'])) for s in sections],'notes':len(notes),'bibGroups':len(bib),'front':front},ensure_ascii=False))
