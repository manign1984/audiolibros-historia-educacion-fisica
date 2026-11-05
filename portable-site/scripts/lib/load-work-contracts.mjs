import { build } from 'vite';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { resolve, relative, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';

export function within(root, path) {
  if (typeof path !== 'string' || !path || isAbsolute(path)) throw new Error(`Ruta relativa inválida: ${path}`);
  const target = resolve(root, path);
  if (relative(root, target).startsWith('..')) throw new Error(`Ruta fuera del proyecto: ${path}`);
  return target;
}

// Usa exactamente los módulos del lector, incluidos ?raw y JSON; no mantiene
// una segunda transcripción ni vuelve a implementar los constructores de texto.
// Solo admite módulos del checkout. No inicia servidor ni navegador.
export async function loadWorkContracts(root, works) {
  const cache = resolve(root, 'node_modules/.cache');
  await mkdir(cache, { recursive: true });
  const temporary = await mkdtemp(resolve(cache, 'work-contracts-'));
  try {
    const imports = [], entries = [];
    works.forEach((work, index) => {
      for (const [kind, descriptor] of Object.entries({ config: work.config, document: work.document })) {
        if (!descriptor || !/^(?:default|[A-Za-z_$][\w$]*)$/.test(descriptor.export)) throw new Error(`${work.id}: export de ${kind} inválido`);
        const path = within(root, descriptor.module);
        imports.push(`import * as ${kind}${index} from ${JSON.stringify(path)};`);
      }
      entries.push(`{ id: ${JSON.stringify(work.id)}, config: config${index}[${JSON.stringify(work.config.export)}], document: document${index}[${JSON.stringify(work.document.export)}] }`);
    });
    const entry = resolve(temporary, 'entry.js');
    await writeFile(entry, `${imports.join('\n')}\nexport const contracts = [${entries.join(',\n')}];\n`);
    await build({
      configFile: false, root, publicDir: false, logLevel: 'silent',
      build: { outDir: resolve(temporary, 'out'), emptyOutDir: true, minify: false,
        lib: { entry, formats: ['es'], fileName: () => 'contracts.mjs' } },
    });
    return (await import(pathToFileURL(resolve(temporary, 'out/contracts.mjs')).href)).contracts;
  } finally { await rm(temporary, { recursive: true, force: true }); }
}
