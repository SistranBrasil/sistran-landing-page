/**
 * SIS-286 — derivada WebP da capa do Match AI (`/solucoes/match-ai`).
 *
 * Terceiro corpo do mesmo identificador, e terceiro script irmão: o da capa do
 * Smart Miner (`otimizar-capa-smart-miner-sis286.mjs`) é de quando a issue pedia
 * UMA capa, o das outras três (`otimizar-capas-solucoes-sis286.mjs`) é de quando o
 * escopo virou quatro, e este é da quinta. Os dois anteriores ficaram como estão
 * porque são o que sustenta os números já publicados nos comentários daqueles
 * corpos — reescrever um deles para caber a arte nova apagaria o rastro do que foi
 * medido quando cada comentário foi escrito.
 *
 * O nome de origem NÃO foi renormalizado: `machai.png` (sem o «t» de «match») é
 * como a arte foi entregue, e renomear em silêncio quebraria o rastro para o
 * arquivo original. A normalização acontece no DESTINO, que é onde o nome precisa
 * casar com a slug da rota.
 *
 * O motivo de converter é o de sempre aqui: `images: { unoptimized: true }` (ver
 * `docs/images-unoptimized.md`) faz o `next/image` entregar o arquivo EXATAMENTE
 * como está em `public/`, e esta imagem é `priority` dentro do `HeroImageBackdrop`
 * — isto é, está no caminho do LCP. Quase 2 MB ali seria o pior peso de abertura
 * da rota, e a conversão é a única coisa entre a arte e o LCP.
 *
 * A largura não é reduzida: 1672 é o que o arquivo tem e a caixa é full-bleed (a
 * 1440 a arte já é esticada, a 1920 mais ainda). O que se ganha aqui é o formato.
 *
 * `quality: 78` e `smartSubsample`: o mesmo par das outras quatro, e pelo mesmo
 * motivo — é render SINTÉTICO, não fotografia. A metade esquerda é degradê chapado
 * de navy (justamente onde a manchete é escrita) e ganha banda visível se a
 * qualidade cai; e o magenta/violeta aceso do prisma central é exatamente o tipo de
 * croma saturado que mostra franja sem o subsample inteligente.
 *
 * Uso: node scripts/otimizar-capa-match-ai-sis286.mjs
 *
 * `sharp` não é dependência declarada do projeto — vem junto com o Next, e serve
 * para script de build-time, não para código de runtime.
 */

import { mkdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

const QUALIDADE = 78;
const PASTA = 'public/images/solucoes';
const ORIGEM = 'public/machai.png';
const DESTINO = `${PASTA}/match-ai-hero.webp`;

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`;

await mkdir(PASTA, { recursive: true });

const antes = (await stat(ORIGEM)).size;
const { width, height } = await sharp(ORIGEM).metadata();
const info = await sharp(ORIGEM).webp({ quality: QUALIDADE, smartSubsample: true }).toFile(DESTINO);

console.log(`${ORIGEM} (${width}x${height}, ${kb(antes)})`);
console.log(`  -> ${DESTINO} (${info.width}x${info.height}, ${kb(info.size)})`);
console.log(`  reducao: ${Math.round((1 - info.size / antes) * 100)}%`);
