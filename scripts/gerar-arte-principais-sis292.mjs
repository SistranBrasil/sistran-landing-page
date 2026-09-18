/**
 * SIS-292 — deriva o WebP da arte nova de «Principais Soluções Sistran Labs».
 *
 * `node scripts/gerar-arte-principais-sis292.mjs`
 *
 * POR QUE DERIVAR em vez de apontar o `Image` para o arquivo entregue: este
 * projeto roda com `images: { unoptimized: true }` (SIS-154), então o `next/image`
 * ENTREGA O ARQUIVO CRU. O PNG da entrega tem 2,08 MiB e é o LCP da seção —
 * mesmo peso que a rota inteira antes dela. O WebP com o MESMO conteúdo e as
 * MESMAS dimensões (1672×941) resolve isso sem tocar no desenho.
 *
 * O PNG DE ORIGEM FICA NO REPO como matriz, exatamente como a SIS-229 deixou o
 * par anterior (`principais-solucoes.webp` derivado de um PNG). O nome híbrido do
 * arquivo entregue (`principais-solucoes1.webp.png` — extensão dupla, conteúdo
 * PNG) não é renomeado: renomear arquivo que a usuária colocou no repo é apagar
 * o rastro de qual arquivo ela mandou.
 *
 * QUALIDADE 82 e não 75: a arte é um diagrama com SEIS RÓTULOS em texto pequeno
 * («DATA MINING & ENRICHMENT» é o mais longo, ~18px na altura entregue, e o
 * subtítulo «Data Science para Seguradoras» é menor ainda). Texto em raster é
 * exatamente o conteúdo que o WebP com perda estraga primeiro — franja em volta
 * dos glifos. 82 é o degrau em que o script mediu diferença máxima por canal
 * aceitável mantendo o arquivo abaixo do PNG por mais de uma ordem de grandeza.
 * `effort: 6` é tempo de compressão, não de decodificação — sai de graça no
 * cliente.
 *
 * `alphaQuality` não entra: o PNG não tem canal alfa (`hasAlpha: false`).
 *
 * Ferramenta de bancada; nada disto entra no bundle.
 */
import { readFile, stat, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const ORIGEM = 'public/images/sistran-labs/principais-solucoes1.webp.png';
const DESTINO = 'public/images/sistran-labs/principais-solucoes1.webp';

const bruto = await readFile(ORIGEM);
const meta = await sharp(bruto).metadata();

const webp = await sharp(bruto).webp({ quality: 82, effort: 6 }).toBuffer();
await writeFile(DESTINO, webp);

/* A CONFERÊNCIA que justifica a qualidade escolhida: as duas imagens são lidas
   cruas e comparadas pixel a pixel. `piorCanal` é a maior diferença absoluta em
   um único canal, e `medio` a média — se o 82 tivesse comido os rótulos, o pior
   canal estouraria nas bordas dos glifos. */
const cru = (b) => sharp(b).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const [a, z] = await Promise.all([cru(bruto), cru(webp)]);
let pior = 0;
let soma = 0;
for (let i = 0; i < a.data.length; i += 1) {
  if ((i + 1) % 4 === 0) continue; // salta o alfa
  const d = Math.abs(a.data[i] - z.data[i]);
  if (d > pior) pior = d;
  soma += d;
}

const metaDestino = await sharp(webp).metadata();
console.log(
  JSON.stringify(
    {
      origem: { formato: meta.format, w: meta.width, h: meta.height, bytes: (await stat(ORIGEM)).size },
      destino: {
        formato: metaDestino.format,
        w: metaDestino.width,
        h: metaDestino.height,
        bytes: webp.length,
      },
      reducao: `${Math.round((1 - webp.length / (await stat(ORIGEM)).size) * 1000) / 10}%`,
      piorCanal: pior,
      medioPorCanal: Math.round((soma / (a.data.length * 0.75)) * 100) / 100,
    },
    null,
    1,
  ),
);
