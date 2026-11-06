"""Censo sin pérdida/duplicación. No sustituye cotejo visual o escucha.
Uso: python audit_reconstruction.py PDF ACADEMIC_JSON DOCUMENT_JSON REPORT_JSON
"""
import sys,json,re,collections,hashlib
from pathlib import Path
import fitz
pdf,academic,document,out=map(Path,sys.argv[1:]);a=json.loads(academic.read_text());d=json.loads(document.read_text())
source=''.join(page.get_text() for page in fitz.open(pdf))
render=''.join(a['frontSource'])+''.join(s['title']+''.join(str(n) for n in s['headingNotes'])+''.join(p['text'] for p in s['paragraphs']) for s in a['sections'])+''.join(str(n['number'])+n['text'] for n in a['endnotes'])+'Referencias bibliográficas'+''.join(a['bibliography'])
render=re.sub(r'\[\[note:(\d+)\]\]',r'\1',render)
norm=lambda s:re.sub(r'\s|\xad','',s)
assert collections.Counter(norm(source))==collections.Counter(norm(render)),'Pérdida o duplicación de caracteres'
units=d['frontMatter']+[u for s in d['sections'] for u in [s['headingSentence']]+[u for p in s['paragraphs'] for u in p['sentences']]]
assert len(set(u['id'] for u in units))==len(units)
assert [n['number'] for n in d['endnotes']]==list(range(1,30))
assert all(n['sentenceId'] in {u['id'] for u in units} for n in d['endnotes'])
assert all('start' not in u and 'end' not in u for u in units+d['endnotes'])
assert all(re.search(r'\w',u['text']) for u in units),'Fragmento de puntuación aislado'
report={'pdfSha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'academicSha256':hashlib.sha256(academic.read_bytes()).hexdigest(),'documentSha256':hashlib.sha256(document.read_bytes()).hexdigest(),'characterCensus':'equal excluding whitespace and discretionary hyphens','bodySentences':sum(len(p['sentences']) for s in d['sections'] for p in s['paragraphs']),'paragraphs':sum(len(s['paragraphs']) for s in d['sections']),'sections':len(d['sections']),'notes':len(d['endnotes']),'bibliography':len(d['bibliography']),'allNoteCallsResolved':True,'activeTimings':0,'visualProof':False,'humanListening':False}
out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report))
