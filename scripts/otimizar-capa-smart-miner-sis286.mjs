/**
 * SIS-286 — derivada WebP da capa de /solucoes/smart-miner.
 *
 * `public/capa-smart-mine.png` (o nome do arquivo entregue diz «mine», a rota diz
 * «miner»; o arquivo NÃO foi renomeado — quem o entregou o nomeou assim e um
 * rename silencioso quebraria o rastro para a arte original) tem 1,7 MB em
 * 1672x941.
 *
 * O motivo de converter é o mesmo das capas anteriores, e não zelo: o projeto roda
 * com `images: { unoptimized: true }` (ver `docs/images-unoptimized.md`), então o
 * `next/image` entrega o arquivo EXATAMENTE como está em `public/` — e esta imagem
 * é marcada `priority` dentro do `HeroImageBackdrop`, isto é, está no caminho do
 * LCP. 1,7 MB ali seria o pior peso de abertura de toda a rota.
 *
 * Mesmo procedimento de `otimizar-capa-parceiros-sis225.mjs` e das capas do Labs e
 * da University: converter uma vez, versionar o resultado, manter o PNG onde está
 * como fonte para regerar.
 *
 * A largura NÃO é reduzida. 1672 é o que o arquivo tem e a caixa é full-bleed: a
 * 1440 ele já é esticado, a 1920 mais ainda. O que se ganha aqui é só o formato.
 *
 * Uso: node scripts/otimizar-capa-smart-miner-sis286.mjs
 *
 * `sharp` não é dependência declarada do projeto — vem junto com o Next. Serve
 * para script de build-time, não serviria para código de runtime.
 */

import { mkdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

const ORIGEM = 'public/capa-smart-mine.png';
const DESTINO = 'public/images/solucoes/smart-miner-hero.webp';
const QUALIDADE = 78;

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`;

await mkdir('public/images/solucoes', { recursive: true });

const antes = (await stat(ORIGEM)).size;
const { width, height } = await sharp(ORIGEM).metadata();

/* `quality: 78`, o número das outras artes SINTÉTICAS (parceiros, Labs,
   University), e não os 72/74 das fotografias de escritório. Render 3D com muito
   degradê chapado e muito traço aceso é o pior caso do WebP com perda: o navy do
   fundo ganha banda visível — e é justamente a metade onde a manchete é escrita —
   e os fios de luz azul ganham franja.
   `smartSubsample` pelo mesmo motivo de lá: corrige a franja de croma nos tons
   saturados, que aqui são o laranja da nuvem da AWS e o verde do selo de check. */
const info = await sharp(ORIGEM).webp({ quality: QUALIDADE, smartSubsample: true }).toFile(DESTINO);

console.log(`${ORIGEM} (${width}x${height}, ${kb(antes)})`);
console.log(`  -> ${DESTINO} (${info.width}x${info.height}, ${kb(info.size)})`);
console.log(`  reducao: ${Math.round((1 - info.size / antes) * 100)}%`);
