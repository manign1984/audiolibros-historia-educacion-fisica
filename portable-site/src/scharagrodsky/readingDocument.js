import source from './narration.txt?raw';
const headings = [
 ['introduccion', 'Introducción'],
 ['sistema', 'El Sistema Argentino de Educación Física'],
 ['antecedentes', 'Las disputas con la educación física militarizada: sus antecedentes'],
 ['fisiologia', 'Hacia una fisiología ‘política’ del ejercicio. Consecuencias pedagógicas'],
 ['inef', 'El ‘combate’ por el Instituto Nacional de Educación Física'],
 ['treinta', 'Doble golpe: el golpe militar de 1930 y el golpe a la propuesta ‘romerista’'],
 ['finales', 'Consideraciones finales']
];
const segmenter = new Intl.Segmenter('es', { granularity: 'sentence' });
const sections = [];
let current;
for (const line of source.replace(/^\uFEFF/, '').replace(/\r/g, '').split('\n').map(x=>x.trim()).filter(Boolean)) {
 const found = headings.find(([id,title])=>title===line);
 if(found){ current={id:found[0],title:found[1],shortTitle:found[1],paragraphs:[]}; sections.push(current); continue; }
 if(!current) continue;
 const id='sch-'+current.id+'-p'+(current.paragraphs.length+1);
 const sentences=[...segmenter.segment(line)].map(({segment},i)=>({id:id+'-s'+(i+1),text:segment.trim()})).filter(x=>x.text);
 if(sentences.length) current.paragraphs.push({id,kind:'body',sentences});
}
export const scharagrodskyReadingDocument={
 title:'La constitución de la educación física escolar en la Argentina',
 subtitle:'Tensiones, conflictos y disputas con la matriz militar en las primeras décadas del siglo XX',
 author:'Pablo Ariel Scharagrodsky',
 duration:3083.755,
 frontMatter:[
  {id:'sch-title',role:'title',text:'La constitución de la educación física escolar en la Argentina'},
  {id:'sch-author',role:'author',text:'Pablo Ariel Scharagrodsky'},
 ],
 sections,
 sourceNote:'Guion de narración accesible. Las notas, citas y referencias de la edición académica se conservan en el PDF; la alineación temporal por oración está pendiente de revisión.'
};