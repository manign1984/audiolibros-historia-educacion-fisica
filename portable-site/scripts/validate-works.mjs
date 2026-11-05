import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalog, collections } from '../src/biblioteca/catalog.js';
import { LIST_KEY } from '../src/biblioteca/libraryState.js';
import { loadWorkContracts } from './lib/load-work-contracts.mjs';
import { checkManifest, validateWorks, validateReferences } from './lib/validate-work-contracts.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
let manifestPath = resolve(root, '../validation/works.json');
let dist;
let json = false;
for (let index = 0; index < args.length; index += 1) {
  if (args[index] === '--json') json = true;
  else if (['--manifest', '--dist'].includes(args[index]) && args[index + 1] && !args[index + 1].startsWith('--')) {
    const flag = args[index++];
    if (flag === '--manifest') manifestPath = resolve(args[index]); else dist = resolve(args[index]);
  } else throw new Error(`Argumento desconocido o incompleto: ${args[index]}`);
}
try {
  const manifest = checkManifest(JSON.parse(await readFile(manifestPath, 'utf8')));
  const contracts = await loadWorkContracts(root, manifest.works);
  const report = await validateWorks({ root, manifest, contracts, catalog, collections, reservedStorageKeys: [LIST_KEY] });
  const references = await validateReferences({ directory: resolve(root, 'src'), source: true });
  report.errors.push(...references.errors);
  report.referencesChecked = references.checked;
  if (dist) {
    const built = await validateReferences({ directory: dist, base: process.env.GITHUB_PAGES_BASE || '/' });
    report.errors.push(...built.errors);
    report.builtReferencesChecked = built.checked;
    for (const entry of catalog) {
      try { await readFile(resolve(dist, entry.path, 'index.html')); }
      catch { report.errors.push({ code: 'built-route', location: entry.id, message: 'Ruta ausente de la compilación.' }); }
    }
  }
  report.ok = report.errors.length === 0;
  report.scope = 'Integridad y contratos locales; no certifica fidelidad editorial, voz, diseño, derechos ni disponibilidad de enlaces externos.';
  if (json) console.log(JSON.stringify(report, null, 2));
  else {
    for (const work of report.works) console.log(`${work.id}: ${work.units} unidades ${work.unit}, ${work.timed} temporizadas, ${work.materials} materiales.`);
    for (const item of report.warnings) console.log(`AVISO [${item.code}] ${item.location}: ${item.message}`);
    for (const item of report.errors) console.error(`ERROR [${item.code}] ${item.location}: ${item.message}`);
    console.log(`${report.ok ? 'APROBADO' : 'FALLÓ'}: ${report.works.length} recorridos; ${catalog.length} fichas; ${report.referencesChecked} referencias fuente${dist ? ` y ${report.builtReferencesChecked} compiladas` : ''}; ${report.errors.length} errores, ${report.warnings.length} avisos. ${report.scope}`);
  }
  if (!report.ok) process.exitCode = 1;
} catch (cause) {
  if (json) console.log(JSON.stringify({ ok: false, errors: [{ code: 'validation-setup', message: cause.message }] }, null, 2));
  else console.error(`No se pudo validar: ${cause.message}`);
  process.exitCode = 1;
}
