/**
 * SIS-238 — derivada WebP da capa Celent de /quem-somos.
 *
 * `public/cele.png` tem ~1,5 MB. Como o projeto roda com
 * `images: { unoptimized: true }` (ver `docs/images-unoptimized.md`), o
 * `next/image` NAO recomprime nada em tempo de execucao: o arquivo do disco é o
 * arquivo que chega no visitante. Mesmo procedimento da SIS-225
 * (`otimizar-capa-parceiros-sis225.mjs`) e da SIS-230: converter uma vez,
 * versionar o resultado, manter o PNG como fonte para regerar.
 *
 * A largura NAO é reduzida: a caixa é full-bleed e a 1440 o arquivo nativo ja é
 * esticado. O que se ganha é so o formato.
 *
 * O script tambem SONDA a metade esquerda da arte, que é onde as escritas vao
 * ser ancoradas. Sem esse numero nao ha como escolher a tinta do texto nem medir
 * o contraste: a capa é um render claro, e o navy do resto da secao nao vale
 * aqui (a issue diz "nao forcar navy se a capa for clara").
 *
 * Uso: node scripts/otimizar-capa-celent-sis238.mjs
 *
 * `sharp` nao é dependencia declarada do projeto — vem junto com o Next. Serve
 * para script de build-time, nao serviria para codigo de runtime.
 */

import { mkdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

const ORIGEM = 'public/cele.png';
const DESTINO = 'public/images/quem-somos/celent-capa.webp';
const QUALIDADE = 80;

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`;

await mkdir('public/images/quem-somos', { recursive: true });

const antes = (await stat(ORIGEM)).size;
const { width, height } = await sharp(ORIGEM).metadata();

/* `quality: 80`, acima dos 78 da capa de parceiros: esta arte é um render
   sintetico de degrades MUITO chapados (azul claro quase liso na metade
   esquerda). É o caso classico de banda visivel no WebP com perda — e a metade
   esquerda é exatamente onde o titulo e as frases vao ser escritos.
   `smartSubsample` preserva o croma dos rotulos coloridos do quadrante
   (Luminaries em amarelo, Technology Standouts em ciano). */
const info = await sharp(ORIGEM).webp({ quality: QUALIDADE, smartSubsample: true }).toFile(DESTINO);

console.log(`${ORIGEM} (${width}x${height}, ${kb(antes)})`);
console.log(`  -> ${DESTINO} (${info.width}x${info.height}, ${kb(info.size)})`);
console.log(`  reducao: ${Math.round((1 - info.size / antes) * 100)}%`);

/* --- Sonda da coluna tipografica ---------------------------------------- */

/* A faixa 0–26% da largura é a que fica livre de troféu e de painel na arte
   (conferido na referencia `exemplcelent.png`, onde o texto da mock ocupa
   justamente essa fatia). Interessa o pixel MAIS ESCURO dela, nao a media: é
   contra ele que o texto escuro tem o pior contraste. */
const faixaW = Math.round(info.width * 0.26);
const { data, info: bruto } = await sharp(DESTINO)
  .extract({ left: 0, top: 0, width: faixaW, height: info.height })
  .raw()
  .toBuffer({ resolveWithObject: true });

const canais = bruto.channels;
let somaR = 0;
let somaG = 0;
let somaB = 0;
let piorLum = 1;
let piorPx = null;
const total = bruto.width * bruto.height;

const canalLinear = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminancia = (r, g, b) =>
  0.2126 * canalLinear(r) + 0.7152 * canalLinear(g) + 0.0722 * canalLinear(b);

for (let i = 0; i < total; i += 1) {
  const p = i * canais;
  const r = data[p];
  const g = data[p + 1];
  const b = data[p + 2];
  somaR += r;
  somaG += g;
  somaB += b;
  const lum = luminancia(r, g, b);
  if (lum < piorLum) {
    piorLum = lum;
    piorPx = [r, g, b];
  }
}

const media = [somaR / total, somaG / total, somaB / total].map(Math.round);
const razao = (lum) => (Math.max(lum, 0) + 0.05) / (0 + 0.05);

console.log(`\ncoluna tipografica (0–26% = ${faixaW}px de largura):`);
console.log(`  media   rgb(${media.join(' ')}) lum=${luminancia(...media).toFixed(4)}`);
console.log(`  pior px rgb(${piorPx.join(' ')}) lum=${piorLum.toFixed(4)}`);
console.log(`  razao maxima contra tinta preta: ${razao(piorLum).toFixed(2)}:1 (pior pixel)`);
