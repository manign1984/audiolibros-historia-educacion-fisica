// Local-only materialization. Arguments are original verified inputs, never signed URLs.
// node tools/soares/prepare-local.mjs ACADEMIC_JSON PDF MP3 VTT [PORTRAIT]
import { readFile, mkdir, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildSoaresDocument } from '../../portable-site/src/soares/buildReadingDocument.js';
const [academicFile, ...paths] = process.argv.slice(2);
if (!academicFile || paths.length < 3) throw new Error('Faltan academic.json PDF MP3 VTT');
const expected = ['c81a7c039eb231ef183697761ea6e01fd7e0d4715309aff65ed769b5c8d10b45','f9c4226ec5794a959d77d6f97b523eabadb0dcdc272bbec9c9e1b04d9a019b37','ec0beaea889464cd05328c6e73fb80f36f3f8899ae99cc463fcefb82bc1e294f','aab6808fb2326b37f1437c17a23a645401e339fab674cfa69732e600dee2ad2f'];
// Validate the entire input set before writing anything.
for (let i=0;i<paths.length;i++) if (createHash('sha256').update(await readFile(paths[i])).digest('hex') !== expected[i]) throw new Error(`Hash distinto, entrada ${i+1}`);
const academic=JSON.parse(await readFile(academicFile,'utf8'));
if (academic.sourceSha256!==expected[0]) throw new Error('Edición académica distinta');
const directory=fileURLToPath(new URL('../../portable-site/.local/soares/',import.meta.url));
await mkdir(directory,{recursive:true});
const names=['chapter.pdf','audiobook.mp3','original.vtt','portrait.jpeg'];
for(let i=0;i<paths.length;i++) await copyFile(paths[i],directory+names[i]);
const doc=buildSoaresDocument(academic);
await writeFile(directory+'reader-document.json',JSON.stringify(doc,null,2)+'\n');
console.log(`Candidato LOCAL: ${doc.sections.length} apartados, ${doc.endnotes.length} notas. Materiales ignorados por Git; NO publicar dist.`);
