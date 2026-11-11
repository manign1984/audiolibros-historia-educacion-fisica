function parseMelanoSrt(source) {
  function toSeconds(timestamp) {
    const m = timestamp.match(/^(\d\d):(\d\d):(\d\d),(\d{3})$/);
    if (!m) throw Error('Tiempo SRT inválido');
    return +m[1]*3600 + +m[2]*60 + +m[3] + +m[4]/1000;
  }
  return source.trim().replace(/\r/g,'').split(/\n\s*\n/).map(block=>{
    const lines=block.split('\n'), match=lines[1]?.match(/^(.+?) --> (.+)$/);
    if(!match) throw Error('Subtítulo SRT inválido');
    return {start:toSeconds(match[1]),end:toSeconds(match[2]),text:lines.slice(2).join(' ').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()};
  }).filter(c=>c.text);
}

function melanoWords(text) {
  return String(text).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
    .replace(/\[nota\s+\d+\]/gi,' ')
    .replace(/<[^>]*>/g,' ')
    .replace(/[^\p{L}\p{N}]+/gu,' ').trim().split(/\s+/).filter(Boolean);
}

function buildMelanoReadingDocument(raw,srt) {
  const cues=parseMelanoSrt(srt);
  const split=raw.indexOf('Notas al pie de la edición original');
  if(split<0) throw Error('Falta aparato de notas de Melano');
  const main=raw.slice(0,split);
  const endnotesRaw=raw.slice(split+'Notas al pie de la edición original'.length);
  const endnotes=endnotesRaw.trim().split(/(?=^\d{3}\.\s)/m).map(block=>{
    const match=block.trim().match(/^(\d{3})\.\s+([\s\S]+)/);
    return match?{number:+match[1],page:'131–149',text:match[2].replace(/\s*\n\s*/g,' ').trim()}:null;
  }).filter(Boolean);
  const headings=new Map([
    ['La creación del INEF','creacion'],
    ['El traslado','traslado'],
    ['Juramentados, actores y constelaciones de poder.','juramentados'],
    ['Militares al gobierno, Juramentados al poder.','militares'],
    ['La reapertura','reapertura'],
    ['Conclusiones','conclusiones']
  ]);
  const pages=main.split('\f');
  const blocks=[];
  for(const [index,pageText] of pages.entries()){
    const pageNo=Number(pageText.match(/Página impresa (\d+)/)?.[1]||131+index);
    const chunks=pageText.replace(/Página impresa \d+\s*/g,'').trim()
      .split(/\n\s*\n/).map(b=>b.replace(/\s*\n\s*/g,' ').trim()).filter(Boolean);
    for(const chunk of chunks){
      const last=blocks.at(-1);
      const pageContinuation=index>0 && !blocks.some(b=>b.page===pageNo);
      if(last && pageContinuation && !/[.!?…»”]$/.test(last.text) && !headings.has(last.text) && !headings.has(chunk)){
        last.text+=' '+chunk;
      } else blocks.push({text:chunk,page:pageNo});
    }
  }
  const first=blocks.shift()?.text||'';
  const firstLine=first.split(/(?=Ignacio Melano$)/m);
  const title=firstLine[0].trim().replace(/^6\.\s*/,'');
  const author='Ignacio Melano';
  if(!title.includes('Militares al gobierno'))throw Error('Portada incompleta');
  const sections=[{id:'apertura',title:'Apertura',shortTitle:'Apertura',paragraphs:[]}];
  let current=sections[0];
  const endnoteOwners=new Map(), legacyPageMap={};
  for(const block of blocks){
    if(headings.has(block.text)){
      const id=headings.get(block.text);
      current={id,title:block.text,shortTitle:block.text,paragraphs:[]};
      sections.push(current);
      continue;
    }
    const id=`melano-${current.id}-p${current.paragraphs.length+1}`;
    const segments=block.text.split(/(\[nota\s+\d+\])/gi);
    const sentences=[];
    for(const segment of segments){
      const marker=segment.match(/^\[nota\s+(\d+)\]$/i);
      if(marker){
        if(sentences.length)endnoteOwners.set(+marker[1],sentences.at(-1).id);
        continue;
      }
      const text=segment.trim();
      if(text)sentences.push({id:`${id}-s${sentences.length+1}`,text});
    }
    if(!sentences.length)continue;
    current.paragraphs.push({id,kind:'body',sentences});
    const pageIndex=block.page-131;
    if(!(pageIndex in legacyPageMap))legacyPageMap[pageIndex]=id;
  }
  for(const note of endnotes){if(endnoteOwners.has(note.number))note.sentenceId=endnoteOwners.get(note.number);}
  const cueWords=cues.flatMap((cue,cueIndex)=>melanoWords(cue.text).map(word=>({word,start:cue.start,cueIndex})));
  const paragraphTimings=[];
  let cursor=0;
  for(const paragraph of sections.flatMap(s=>s.paragraphs)){
    const plain=paragraph.sentences.map(x=>x.text).join(' ');
    const withoutParentheticalCitations=plain.replace(/\([^)]*(?:19\d{2}|20\d{2}|p\.\s*\d+)[^)]*\)/g,' ');
    const tokens=melanoWords(withoutParentheticalCitations);
    let matchAt=-1;
    for(const span of [6,5,4,3]){
      if(tokens.length<span)continue;
      for(let offset=0;offset<=Math.min(28,tokens.length-span) && matchAt<0;offset++){
        const target=tokens.slice(offset,offset+span);
        for(let j=cursor;j<=cueWords.length-span;j++){
          if(cueWords[j].word!==target[0])continue;
          let matched=true;
          for(let k=1;k<span;k++){if(cueWords[j+k].word!==target[k]){matched=false;break;}}
          if(matched){matchAt=j;break;}
        }
      }
      if(matchAt>=0)break;
    }
    if(matchAt>=0){
      paragraphTimings.push({id:paragraph.id,start:cueWords[matchAt].start});
      cursor=matchAt+1;
    }
  }
  paragraphTimings.forEach((p,i)=>{
    p.end=i<paragraphTimings.length-1?Math.max(p.start,paragraphTimings[i+1].start-0.001):cues.at(-1).end;
  });
  const document={
    id:'melano-militares-juramentados',title,subtitle:'Capítulo 6 · Formar líderes y salvar a los jóvenes',
    author,duration:cues.at(-1).end,
    versionLabel:'Capítulo 6 · EdUNLu · edición impresa 2025',
    source:{kind:'ElevenLabs SRT',cueCount:cues.length,finalCueEnd:cues.at(-1).end},
    frontMatter:[{id:'melano-portada-titulo',role:'title',text:title},{id:'melano-portada-subtitulo',role:'subtitle',text:'La reapertura del INEF Gral. Belgrano en la década del 70'},{id:'melano-portada-autor',role:'author',text:author}],
    sections,endnotes,bibliography:[],
    sourceNote:'El capítulo académico conserva las referencias y sus notas de la edición impresa. Las notas no forman parte de la narración.'
  };
  return {document,cues,paragraphTimings,legacyPageMap};
}

export { parseMelanoSrt, buildMelanoReadingDocument };
