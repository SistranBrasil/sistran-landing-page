/**
 * Prepara o render da torre (escritorio de Sao Paulo) para ser servido.
 *
 * SIS-163. A fonte entregue é `public/imagensexemplo/substituiçãodo3d.png`, e ela
 * tem TRES defeitos que este script resolve de uma vez, porque servir o arquivo
 * como veio quebraria a cena:
 *
 *  1. NAO TEM TRANSPARENCIA. O xadrez cinza/branco que parece fundo vago é
 *     PINTADO: `sharp().metadata()` devolve `channels: 3`, `hasAlpha: false`.
 *     Posto sobre o fundo claro da secao, o xadrez apareceria como um tabuleiro
 *     atras do predio. O canal alfa é reconstruido aqui por preenchimento a
 *     partir das BORDAS — e nao por "toda cor parecida com o xadrez", que é a
 *     versao ingenua e come a torre: o corpo dela é prateado, ou seja cinza
 *     neutro, exatamente a cor de metade dos quadrados. Varrendo so o que se
 *     alcanca desde a moldura, o cinza que esta DENTRO do predio nunca é
 *     visitado.
 *  2. NOME COM CEDILHA E TIL. Vira `torre-sp`, ASCII, em
 *     `public/images/escritorios/`, junto das fotos.
 *  3. 1,86 MB de PNG, e o projeto roda com `images: { unoptimized: true }` — o
 *     que esta no disco chega ao visitante do jeito que esta. Sai em WebP com
 *     alfa, em duas larguras, como as fotos dos escritorios.
 *
 * A original fica onde esta, intacta: é a fonte para regerar.
 *
 * Uso: node scripts/preparar-render-torre.mjs
 *
 * `sharp` nao é dependencia declarada — vem junto com o Next. Serve para script
 * de build-time; nao serviria para codigo de runtime.
 */

import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const ORIGEM = 'public/imagensexemplo/substituiçãodo3d.png';
const DESTINO = 'public/images/escritorios';
const BASE = 'torre-sp';
const LARGURAS = [720, 1200];
const QUALIDADE = 82;

/* O xadrez tem dois tons, ambos cinzas NEUTROS: ~195 e ~251 (medidos na origem).
   O que separa o fundo da torre nao é o tom — a torre é prateada, ou seja cinza
   claro tambem — é a NEUTRALIDADE: o prateado do render é levemente azul (medido:
   [198,189,203], desvio 14 entre canais), e o xadrez tem desvio de 1 ou 2.
   Dai a tolerancia apertada de 6 e a faixa larga de valor.

   A FAIXA TEM DE SER LARGA, e isto foi medido, nao afrouxado por preguica: o
   xadrez da origem esta desfocado (foi ampliado antes de ser salvo), entao a
   fronteira entre dois quadrados passa por todos os tons de 195 a 251 ao longo de
   ~3px. Com as duas faixas estreitas que este script tinha antes (>=244 e
   180..204), o preenchimento nao conseguia ATRAVESSAR essas fronteiras e parava
   no primeiro quadrado: 3% da imagem virou transparente em vez dos ~60%
   esperados. */
const NEUTRO = 6;
const ehXadrez = (r, g, b) => {
  const desvio = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
  if (desvio > NEUTRO) return false;
  const v = (r + g + b) / 3;
  return v >= 176;
};

const { data, info } = await sharp(ORIGEM)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: L, height: A, channels: C } = info;
const alfa = new Uint8Array(L * A).fill(255);
const visitado = new Uint8Array(L * A);

/* Preenchimento a partir da borda, iterativo e com pilha propria: recursao em
   1254x1254 estoura a pilha do Node. */
const pilha = [];
const semear = (x, y) => {
  const i = y * L + x;
  if (visitado[i]) return;
  const p = i * C;
  if (!ehXadrez(data[p], data[p + 1], data[p + 2])) return;
  visitado[i] = 1;
  alfa[i] = 0;
  pilha.push(i);
};
for (let x = 0; x < L; x += 1) {
  semear(x, 0);
  semear(x, A - 1);
}
for (let y = 0; y < A; y += 1) {
  semear(0, y);
  semear(L - 1, y);
}
while (pilha.length) {
  const i = pilha.pop();
  const x = i % L;
  const y = (i - x) / L;
  if (x > 0) semear(x - 1, y);
  if (x < L - 1) semear(x + 1, y);
  if (y > 0) semear(x, y - 1);
  if (y < A - 1) semear(x, y + 1);
}

/* A borda do predio é antisserrilhada: uma casca de pixels que é mistura de
   xadrez com predio e ficou opaca. Sem tratar, ela vira um contorno cinza-claro
   sobre o fundo da secao. Cada pixel opaco vizinho de transparente cai para meia
   opacidade — uma casca de UM pixel, medida numa passada sobre o mapa ja
   fechado (nao em cascata, senao o predio inteiro iria desbotando). */
const alfaFinal = Uint8Array.from(alfa);
for (let y = 1; y < A - 1; y += 1) {
  for (let x = 1; x < L - 1; x += 1) {
    const i = y * L + x;
    if (alfa[i] === 0) continue;
    if (
      alfa[i - 1] === 0 ||
      alfa[i + 1] === 0 ||
      alfa[i - L] === 0 ||
      alfa[i + L] === 0
    )
      alfaFinal[i] = 128;
  }
}

/* Recorte pela caixa do que sobrou opaco: a origem é 1254x1254 com margem vaga
   em volta, e margem vaga em imagem servida é peso e, pior, é enquadramento
   errado — a torre ficaria pequena no meio da caixa que o CSS reservou. */
let x0 = L;
let y0 = A;
let x1 = -1;
let y1 = -1;
for (let y = 0; y < A; y += 1) {
  for (let x = 0; x < L; x += 1) {
    if (alfaFinal[y * L + x] === 0) continue;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
}

const rgba = Buffer.alloc(L * A * 4);
for (let i = 0; i < L * A; i += 1) {
  const p = i * C;
  rgba[i * 4] = data[p];
  rgba[i * 4 + 1] = data[p + 1];
  rgba[i * 4 + 2] = data[p + 2];
  rgba[i * 4 + 3] = alfaFinal[i];
}

await mkdir(DESTINO, { recursive: true });

const recortada = sharp(rgba, { raw: { width: L, height: A, channels: 4 } }).extract({
  left: x0,
  top: y0,
  width: x1 - x0 + 1,
  height: y1 - y0 + 1,
});

for (const largura of LARGURAS) {
  const info2 = await recortada
    .clone()
    .resize({ width: largura, withoutEnlargement: true })
    .webp({ quality: QUALIDADE, alphaQuality: 100 })
    .toFile(`${DESTINO}/${BASE}-${largura}.webp`);
  console.log(
    `${BASE}-${largura}.webp — ${info2.width}x${info2.height}, ${Math.round(info2.size / 1024)} kB`,
  );
}

console.log(`recorte: ${x1 - x0 + 1}x${y1 - y0 + 1} de ${L}x${A}`);
