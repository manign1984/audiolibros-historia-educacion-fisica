import json
from pathlib import Path
base=Path(__file__).resolve().parents[2]/'documentation/obras/soares-corrientes-gimnasticas/evidencia'
c=json.loads((base/'correspondencia-work2.json').read_text());ev=c['evidence']
ids=['soa-title','soa-author']+[i for i in ev if i.endswith('-heading')]
ids+=[next(i for i,e in ev.items() if e.get('candidateStart',4000)<=1556.6889795<=e.get('candidateEnd',-1)),list(ev)[-1]]
ids+=sorted(ev,key=lambda i:ev[i].get('coverage',0))[:8]
r={'purpose':'Comienzo, encabezados, mitad, final y mayores diferencias textuales','listening':False,'semanticAcousticVerification':False,'samples':[{'id':i,**ev[i]} for i in dict.fromkeys(ids)]}
(base/'muestras-work2.json').write_text(json.dumps(r,indent=2)+'\n')
