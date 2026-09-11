/**
 * SIS-225 — derivada WebP da capa de /parceiros-e-implementacoes.
 *
 * `public/fundocapaparceiros.png` tem 1,7 MB em 1672x941. Como o projeto roda com
 * `images: { unoptimized: true }` (ver `docs/images-unoptimized.md`), o
 * `next/image` NAO recomprime nada em tempo de execucao: o arquivo que esta no
 * disco é o arquivo que chega no visitante. E esta imagem é marcada `priority`,
 * isto é, ela entra no caminho critico do LCP — 1,7 MB ali seria o pior peso de
 * abertura do site.
 *
 * Mesmo procedimento da SIS-126 (`contato-hero.webp`) e de
 * `otimizar-fotos-escritorios.mjs`: converter uma vez, versionar o resultado,
 * manter o original onde esta como fonte para regerar.
 *
 * A largura NAO é reduzida (1672 é o que o arquivo tem, e a caixa é full-bleed:
 * a 1440 ele ja é esticado, a 1920 mais ainda). O que se ganha é so o formato.
 *
 * Uso: node scripts/otimizar-capa-parceiros-sis225.mjs
 *
 * `sharp` nao é dependencia declarada do projeto — vem junto com o Next. Serve
 * para script de build-time, nao serviria para codigo de runtime.
 */

import { mkdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

const ORIGEM = 'public/fundocapaparceiros.png';
const DESTINO = 'public/images/parceiros/parceiros-hero.webp';
const QUALIDADE = 78;

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`;

await mkdir('public/images/parceiros', { recursive: true });

const antes = (await stat(ORIGEM)).size;
const { width, height } = await sharp(ORIGEM).metadata();

/* `quality: 78` e nao os 72/74 das fotos: esta arte é sintetica (render 3D com
   degrade grande e chapado de navy, mais texto de logo nitido). Nesse tipo de
   imagem o WebP com perda deixa banda visivel no ceu do lado esquerdo — que é
   exatamente a metade onde o titulo é escrito — e franja em volta das letras dos
   cartoes. `smartSubsample` corrige a franja do croma nos vermelhos/laranjas do
   earnix e do aws. */
const info = await sharp(ORIGEM).webp({ quality: QUALIDADE, smartSubsample: true }).toFile(DESTINO);

console.log(`${ORIGEM} (${width}x${height}, ${kb(antes)})`);
console.log(`  -> ${DESTINO} (${info.width}x${info.height}, ${kb(info.size)})`);
console.log(`  reducao: ${Math.round((1 - info.size / antes) * 100)}%`);
