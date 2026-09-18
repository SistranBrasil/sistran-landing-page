/**
 * SIS-293 — deriva os WebP das três fotos do ambiente do Labs.
 *
 * `node scripts/gerar-fotos-ambiente-sis293.mjs`
 *
 * POR QUE DERIVAR, e não apontar o `next/image` para os JPGs entregues: o projeto
 * roda com `images: { unoptimized: true }` (SIS-154), então o `next/image` ENTREGA
 * O ARQUIVO CRU — sem redimensionar e sem reconverter. Os três JPGs somam 5,7 MiB
 * e vêm em 2383×1453, 3345×2026 e 3352×2019, ou seja de duas a quatro vezes mais
 * largos do que a caixa em que aparecem. Publicá-los como estão faria a seção
 * pesar mais que a rota inteira.
 *
 * LARGURA 1600, e não a nativa: a maior caixa desta galeria é a figura de ~68% do
 * `container-lp` a 1440 (≈ 760px de CSS, medido na sonda), então 1600 cobre tela
 * retina (DPR 2) com folga e nada acima disso chega a virar pixel na tela. A
 * ALTURA sai do `sharp` pela proporção original — nenhuma das três é recortada,
 * porque recortar foto de pessoas é decisão de quem responde pelo conteúdo.
 *
 * QUALIDADE 78, e não os 82 da arte da SIS-292: lá o material era um diagrama com
 * seis rótulos em texto pequeno, o conteúdo que o WebP com perda estraga primeiro.
 * Aqui são fotografias — sem glifo, sem aresta dura, sem área plana grande —, o
 * caso em que 78 é o degrau usual. A conferência abaixo mede a diferença por canal
 * contra a MESMA imagem reamostrada sem perda, para separar o que é custo da
 * redução de tamanho (inevitável, e é o que se quer) do que seria custo da
 * compressão (o que precisa ficar pequeno).
 *
 * Os JPGs de origem FICAM NO REPO como matriz, como a SIS-292 deixou o PNG da
 * arte: é o arquivo que a usuária entregou.
 *
 * Ferramenta de bancada; nada disto entra no bundle.
 */
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const PASTA = 'public/images/sistran-labs';
const LARGURA = 1600;
const FOTOS = ['1-aba-sistran-labs', '2-aba-sistran-labs', '3-aba-sistran-labs'];

const cru = (b) => sharp(b).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const saida = [];

for (const nome of FOTOS) {
  const origem = `${PASTA}/${nome}.jpg`;
  const destino = `${PASTA}/${nome}.webp`;

  const meta = await sharp(origem).metadata();
  const reduzida = sharp(origem).resize({ width: LARGURA, withoutEnlargement: true });

  const webp = await reduzida.clone().webp({ quality: 78, effort: 6 }).toBuffer();
  await sharp(webp).toFile(destino);

  /* A testemunha da qualidade: `semPerda` é a mesma reamostragem gravada em PNG,
     que não perde nada. A diferença entre ela e o WebP é SÓ da compressão. */
  const semPerda = await reduzida.clone().png({ compressionLevel: 9 }).toBuffer();
  const [a, z] = await Promise.all([cru(semPerda), cru(webp)]);
  let pior = 0;
  let soma = 0;
  for (let i = 0; i < a.data.length; i += 1) {
    if ((i + 1) % 4 === 0) continue; // salta o alfa
    const d = Math.abs(a.data[i] - z.data[i]);
    if (d > pior) pior = d;
    soma += d;
  }

  const metaDestino = await sharp(webp).metadata();
  const bytesOrigem = (await stat(origem)).size;
  saida.push({
    arquivo: `${nome}.webp`,
    origem: { w: meta.width, h: meta.height, bytes: bytesOrigem },
    destino: { w: metaDestino.width, h: metaDestino.height, bytes: webp.length },
    reducao: `${Math.round((1 - webp.length / bytesOrigem) * 1000) / 10}%`,
    piorCanal: pior,
    medioPorCanal: Math.round((soma / (a.data.length * 0.75)) * 100) / 100,
  });
}

console.log(JSON.stringify(saida, null, 1));
