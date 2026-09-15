/**
 * SIS-249 — derivada WebP do banner da seção "Programa" de /sistran-university.
 *
 * `public/images/university/1-Sistran-university.png` tem 1,9 MB em 1672x941. O
 * projeto roda com `images: { unoptimized: true }` (ver `docs/images-unoptimized.md`),
 * então o `next/image` NAO recomprime nada em runtime: o arquivo que está no
 * disco é o arquivo que chega no visitante. Pôr o PNG na rota seria 1,9 MB para
 * uma imagem que vive atrás de um véu de 34% a 86% de alfa.
 *
 * Mesmo procedimento da SIS-225 (`parceiros-hero.webp`) e da SIS-248
 * (`university-hero.webp`): converter uma vez, versionar o resultado, MANTER o
 * PNG onde está como fonte para regerar.
 *
 * A largura não é reduzida: 1672 é o que o arquivo tem e a caixa é full-bleed —
 * a 1440 a arte já é reduzida, a 1920 é esticada. O que se ganha é só o formato.
 *
 * `quality: 74` e não os 78 da capa de parceiros: aquela arte tem degradê grande
 * e chapado de navy, onde o WebP com perda deixa banda visível; esta é foto
 * sintética de escritório, com ruído fino de luz e de vidro, que é o caso em que
 * o WebP rende mais por byte. E ela nunca aparece crua na tela — o véu desta
 * seção cobre a arte inteira, o que apaga qualquer franja que sobrasse nos logos
 * dos painéis. Medido: 70 → 111 kB, 74 → 114 kB, 78 → 129 kB, 82 → 150 kB; os
 * três primeiros são indistinguíveis sob o véu, então o que decide é o byte.
 * `smartSubsample` fica: os logos coloridos (vermelho do Java e do redis, laranja
 * do aws, verde do spring) são exatamente onde o croma 4:2:0 borra.
 *
 * Uso: node scripts/otimizar-programa-university-sis249.mjs
 *
 * `sharp` não é dependência declarada do projeto — vem junto com o Next. Serve
 * para script de bancada, não serviria para código de runtime.
 */

import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const ORIGEM = 'public/images/university/1-Sistran-university.png';
const DESTINO = 'public/images/university/university-programa.webp';
const QUALIDADE = 74;

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`;

const antes = (await stat(ORIGEM)).size;
const { width, height } = await sharp(ORIGEM).metadata();

const info = await sharp(ORIGEM).webp({ quality: QUALIDADE, smartSubsample: true }).toFile(DESTINO);

console.log(`${ORIGEM} (${width}x${height}, ${kb(antes)})`);
console.log(`  -> ${DESTINO} (${info.width}x${info.height}, q=${QUALIDADE}, ${kb(info.size)})`);
console.log(`  reducao: ${Math.round((1 - info.size / antes) * 100)}%`);
