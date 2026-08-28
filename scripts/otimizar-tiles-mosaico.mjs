/**
 * Converte as imagens dos tiles do mosaico da home para WebP na largura de exibição.
 *
 * SIS-70. Irmão de `otimizar-fotos-escritorios.mjs`, e pelo mesmo motivo: o
 * projeto roda com `images: { unoptimized: true }` (`next.config.mjs`), então o
 * `next/image` NÃO comprime nada em tempo de execução — se a foto for grande no
 * disco, ela chega grande no visitante. O comentário no `StackScenes` dizendo
 * que "o otimizador entra aqui" estava errado por causa dessa flag.
 *
 * O tile é `clamp(6rem, 11vw, 11rem)` com `aspect-ratio: 3/4` (`legacy.css`) —
 * no máximo 176 CSS px de largura, 352 em DPR 2. Os originais têm ~1024 px de
 * largura e somam 10,7 MB para cinco cartões.
 *
 * 440 px, e não 352: sobra folga para o `45vw` do mobile em telas largas de
 * telefone sem chegar perto do peso do original.
 *
 * As originais ficam onde estão, intactas: são a fonte para regerar.
 *
 * Uso: node scripts/otimizar-tiles-mosaico.mjs
 *
 * `sharp` não é dependência declarada do projeto — vem junto com o Next. Isso
 * vale para um script de build-time, mas não serviria para código de runtime.
 */

import { mkdir, stat, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

/* Só os tiles do mosaico. `escritoriosp.jpg` (294 kB) fica fora: já está no
   tamanho certo, e é a MESMA imagem do card 01 de "Soluções de Negócios" —
   trocar por uma versão de 440 px degradaria o card, que é grande. */
const ORIGENS = [
  'public/imagens/assement.png',
  'public/imagens/aws.png',
  'public/imagens/tecnologias.png',
  'public/imagens/dbsapre.png',
  'public/imagens/ela.png',
];
const DESTINO = 'public/imagens/tiles';
const LARGURA = 440;
const QUALIDADE = 74;

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`;

await mkdir(DESTINO, { recursive: true });

let pesoOriginal = 0;
let pesoFinal = 0;

for (const caminho of ORIGENS) {
  pesoOriginal += (await stat(caminho)).size;

  const destino = join(DESTINO, `${parse(caminho).name}.webp`);
  /* `withoutEnlargement` para o dia em que alguém trocar o original por um
     arquivo menor que 440 px: sem isso o sharp faria upscale e entregaria um
     arquivo maior e mais borrado que a fonte. */
  const saida = await sharp(caminho)
    .resize({ width: LARGURA, withoutEnlargement: true })
    .webp({ quality: QUALIDADE })
    .toBuffer();

  await writeFile(destino, saida);
  pesoFinal += saida.length;
  console.log(`${caminho} → ${destino}  ${kb((await stat(caminho)).size)} → ${kb(saida.length)}`);
}

console.log(`\nTotal: ${kb(pesoOriginal)} → ${kb(pesoFinal)}`);
