// Opt-in local build only. Default builds keep the preparation route and never copy private inputs.
import { cp, access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
export function soaresLocalCandidate() {
  let config;
  const active=process.env.SOARES_LOCAL_CANDIDATE==='1';
  return {
    name:'soares-local-candidate',
    configResolved(value){config=value;},
    async buildStart(){
      if(!active)return;
      const dir=fileURLToPath(new URL('../.local/soares/',import.meta.url));
      for(const [file,hash] of Object.entries({'chapter.pdf':'c81a7c039eb231ef183697761ea6e01fd7e0d4715309aff65ed769b5c8d10b45','audiobook.mp3':'f9c4226ec5794a959d77d6f97b523eabadb0dcdc272bbec9c9e1b04d9a019b37','original.vtt':'ec0beaea889464cd05328c6e73fb80f36f3f8899ae99cc463fcefb82bc1e294f','portrait.jpeg':'aab6808fb2326b37f1437c17a23a645401e339fab674cfa69732e600dee2ad2f'})) {
        if(createHash('sha256').update(await readFile(dir+file)).digest('hex')!==hash)throw new Error(`Soares: integridad de ${file}`);
      }
      const record=JSON.parse(await readFile(fileURLToPath(new URL('../../documentation/obras/soares-corrientes-gimnasticas/evidencia/documento-work2.json',import.meta.url)),'utf8'));
      if(createHash('sha256').update(await readFile(dir+'reader-document.json')).digest('hex')!==record.documentSha256)throw new Error('Soares: documento candidato distinto del auditado');
      await access(dir+'portrait.jpeg');
      config.logger.warn('SOARES: candidato local con materiales sin permiso de redistribución acreditado. NO publicar esta compilación.');
    },
    transformIndexHtml:{order:'pre',handler(html,context){
      if(active && context.filename.replaceAll('\\','/').endsWith('/textos/soares-corrientes-gimnasticas/index.html'))return html.replace('/src/biblioteca/main.jsx','/src/soares/main.jsx');
      return html;
    }},
    async closeBundle(){
      if(active)await cp(fileURLToPath(new URL('../.local/soares/',import.meta.url)),`${config.build.outDir}/assets/soares-private`,{recursive:true});
    },
  };
}
