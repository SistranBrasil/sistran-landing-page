/**
 * SIS-286 — derivadas WebP das outras três capas de `/solucoes/[slug]`.
 *
 * Irmão de `otimizar-capa-smart-miner-sis286.mjs`, que ficou separado por ser de
 * quando a issue pedia UMA capa (o escopo foi ampliado para quatro em 18/09).
 * Aqui vêm as três que entraram depois, num laço só: o procedimento é idêntico e
 * três arquivos com o mesmo corpo seria pior de manter que uma lista.
 *
 * Os nomes de origem NÃO foram renormalizados — `conectapi.png` (sem o duplo n de
 * «connect») e `capa-guru.png` são como foram entregues, e renomear em silêncio
 * quebraria o rastro para a arte original. A normalização acontece no DESTINO, que
 * é onde o nome precisa casar com a slug da rota.
 *
 * O motivo de converter é o de sempre neste repositório: `images: { unoptimized:
 * true }` (ver `docs/images-unoptimized.md`) faz o `next/image` entregar o arquivo
 * EXATAMENTE como está em `public/`, e estas imagens são `priority` dentro do
 * `HeroImageBackdrop` — isto é, estão no caminho do LCP. Quase 2 MB por rota ali
 * seria o pior peso de abertura de cada uma delas.
 *
 * A largura não é reduzida: 1672 é o que os arquivos têm e a caixa é full-bleed (a
 * 1440 a arte já é esticada, a 1920 mais ainda). O que se ganha aqui é o formato.
 *
 * `quality: 78` e `smartSubsample`: o mesmo par da capa do Smart Miner, e pelo
 * mesmo motivo — são renders SINTÉTICOS, não fotografias. Degradê chapado de navy
 * (que é justamente a metade onde a manchete é escrita) ganha banda visível se a
 * qualidade cai, e os tons saturados destas três — o laranja da nuvem AWS no Guru,
 * o verde dos painéis do QA e do Connect — são exatamente onde aparece franja de
 * croma sem o subsample inteligente.
 *
 * Uso: node scripts/otimizar-capas-solucoes-sis286.mjs
 *
 * `sharp` não é dependência declarada do projeto — vem junto com o Next, e serve
 * para script de build-time, não para código de runtime.
 */

import { mkdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

const QUALIDADE = 78;
const PASTA = 'public/images/solucoes';

const CAPAS = [
  { origem: 'public/qa-integrado.png', destino: `${PASTA}/qa-integrado-hero.webp` },
  { origem: 'public/conectapi.png', destino: `${PASTA}/connect-api-hero.webp` },
  { origem: 'public/capa-guru.png', destino: `${PASTA}/guru-de-seguros-hero.webp` },
];

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`;

await mkdir(PASTA, { recursive: true });

for (const { origem, destino } of CAPAS) {
  const antes = (await stat(origem)).size;
  const { width, height } = await sharp(origem).metadata();
  const info = await sharp(origem)
    .webp({ quality: QUALIDADE, smartSubsample: true })
    .toFile(destino);
  console.log(`${origem} (${width}x${height}, ${kb(antes)})`);
  console.log(`  -> ${destino} (${info.width}x${info.height}, ${kb(info.size)})`);
  console.log(`  reducao: ${Math.round((1 - info.size / antes) * 100)}%`);
}
