/* SIS-132 — publica o worker do MapLibre em `public/maplibre/`.
 *
 * Por que existe: o MapLibre 6 descobre o próprio worker por `import.meta.url`
 * (`defaultWorkerUrl()` em `dist/maplibre-gl-dev.mjs:2053`) e, se essa URL não
 * começar com `http`, devolve string VAZIA — o que acontece tanto no `next dev`
 * quanto no bundle de produção deste projeto. O resultado medido é insidioso:
 * `new Worker('')`, um erro de worker que a biblioteca não propaga para o evento
 * `error` do mapa, `isStyleLoaded()` preso em `false`, ZERO requisições de tile e
 * um mapa que pinta só a cor de fundo. Nenhum erro no console, nenhum degrau de
 * fallback disparado — porque, do ponto de vista do componente, nada falhou.
 *
 * A saída é apontar o worker para um arquivo nosso, servido pela própria origem
 * (`setWorkerUrl` em `UnitsMap.tsx`). Ele é copiado daqui em vez de versionado
 * porque tem de acompanhar a versão de `maplibre-gl` no `package.json` — cópia
 * versionada envelheceria em silêncio no primeiro `npm update`, que é o mesmo
 * tipo de defeito que este script conserta.
 *
 * O `maplibre-gl-shared.mjs` vai junto porque o worker o importa por caminho
 * relativo (`from"./maplibre-gl-shared.mjs"`) — sem o irmão ao lado, o worker
 * volta a morrer no import, com o mesmo silêncio.
 */
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const origem = join(raiz, 'node_modules', 'maplibre-gl', 'dist');
const destino = join(raiz, 'public', 'maplibre');

const ARQUIVOS = ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'];

await mkdir(destino, { recursive: true });
for (const arquivo of ARQUIVOS) {
  await copyFile(join(origem, arquivo), join(destino, arquivo));
}

const { version } = JSON.parse(
  await readFile(join(raiz, 'node_modules', 'maplibre-gl', 'package.json'), 'utf8'),
);
console.log(`worker do MapLibre ${version} copiado para public/maplibre/ (${ARQUIVOS.join(', ')})`);
