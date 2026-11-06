"""Independent lexical order against the original full TXT, not the narration.
Usage: collate_academic.py ACADEMIC_JSON TXT REPORT_JSON.
Digits/punctuation excluded from lexical comparison because calls are displaced;
PDF character census separately controls numeric content.
"""
import json,re,sys,hashlib
from pathlib import Path
afile,tfile,out=map(Path,sys.argv[1:]);a=json.loads(afile.read_text());raw=tfile.read_bytes();assert hashlib.sha256(raw).hexdigest()=='52f8ef8fe5b41624dc8f51f844d247f0c9f962e47f78ca19e8967b792d4d5dae'
t=raw.decode('utf-8-sig').replace('207)21 Ver','207)\n21 Ver').replace('2005. 25 Percibimos','2005.\n25 Percibimos');before,bib=t.split('Referencias bibliográficas',1);body=[];notes=[]
for line in before.splitlines():
 m=re.match(r'^(\d{1,2})\s+(.*)',line)
 if m and int(m[1])==len(notes)+1:notes.append(m[2])
 else:body.append(line)
lex=lambda s:re.findall(r'[^\W\d_]+',s.replace('\xad','').lower(),re.UNICODE)
reader=' '.join(a['frontSource'])+' '+' '.join(s['title']+' '+' '.join(p['text'] for p in s['paragraphs']) for s in a['sections']);reader=re.sub(r'\[\[note:\d+\]\]','',reader)
assert lex(' '.join(body))==lex(reader)
assert len(notes)==29 and all(lex(n)==lex(a['endnotes'][i]['text']) for i,n in enumerate(notes))
assert lex(bib)==lex(' '.join(a['bibliography']))
r={'method':'Independent ordered lexical collation against original full TXT, excluding digits/punctuation; PDF character census remains separate','txtSha256':hashlib.sha256(raw).hexdigest(),'academicSha256':hashlib.sha256(afile.read_bytes()).hexdigest(),'bodyLexicalTokens':len(lex(reader)),'bodySequenceEqual':True,'notesCompared':29,'allNotesEqual':True,'bibliographyLexicalTokens':len(lex(bib)),'bibliographySequenceEqual':True,'txtLayoutRepairs':['separate notes 20/21','separate notes 24/25'],'humanListening':False}
out.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(json.dumps(r))
