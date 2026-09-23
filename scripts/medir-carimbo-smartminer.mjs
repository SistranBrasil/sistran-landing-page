/**
 * Mede a arte do carimbo do Smart Miner ANTES de montá-la: `CarimboBatida`
 * assume que o repouso da cápsula é giro ZERO porque as duas artes que ele já
 * serve vêm tombadas dentro do próprio arquivo (−3,05° e −3,03°, medidos no
 * docblock dele). Arte RETA exigiria um `tomboRepouso` novo no componente — então
 * o ângulo é portão de entrada, não detalhe.
 *
 * Também mede a TINTA: o nome do arquivo promete `ffffff`, e cápsula branca só
 * serve em faixa escura. Se a tinta for clara, o lugar dela é o hero navy.
 */
import { readFile, writeFile } from 'node:fs/promises';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const { chromium } = await import(PLAYWRIGHT);

const ARQUIVOS = {
  'smart-miner': 'public/carimbo-smart-miner-ticket-outline-ffffff.png',
  /* A do Match AI como CONTROLE: é a arte que o componente já serve medida pelo
     mesmo código, então o ângulo do Smart Miner é comparável a algo. */
  'match-ai': 'public/images/solucoes/carimbo-match-ai-ticket-outline-ffffff.png',
};

const navegador = await chromium.launch();
const page = await navegador.newPage();
const saida = {};

for (const [nome, caminho] of Object.entries(ARQUIVOS)) {
  const b64 = (await readFile(caminho)).toString('base64');
  saida[nome] = await page.evaluate(async (dados) => {
    const img = new Image();
    img.src = `data:image/png;base64,${dados}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
    const em = (x, y) => {
      const i = (y * width + x) * 4;
      return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
    };
    /* Primeiro pixel de tinta (alfa real) descendo numa coluna. */
    const topoDaTinta = (x) => {
      for (let y = 0; y < height; y += 1) if (em(x, y).a > 40) return y;
      return null;
    };
    /* Duas colunas bem separadas: a inclinação é a reta entre os dois topos. */
    const xA = Math.round(width * 0.18);
    const xB = Math.round(width * 0.82);
    const yA = topoDaTinta(xA);
    const yB = topoDaTinta(xB);
    const grausDeTombo =
      yA === null || yB === null
        ? null
        : Number(((Math.atan2(yB - yA, xB - xA) * 180) / Math.PI).toFixed(2));

    /* Tinta: média dos pixels opacos, para saber se a cápsula é clara ou escura. */
    let n = 0;
    let somaR = 0;
    let somaG = 0;
    let somaB = 0;
    let opacos = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 200) {
        opacos += 1;
        somaR += data[i];
        somaG += data[i + 1];
        somaB += data[i + 2];
        n += 1;
      }
    }
    const media = n ? [somaR / n, somaG / n, somaB / n].map((v) => Math.round(v)) : null;
    const lum = media
      ? Number(
          (
            0.2126 * (media[0] / 255) +
            0.7152 * (media[1] / 255) +
            0.0722 * (media[2] / 255)
          ).toFixed(3),
        )
      : null;
    return {
      largura: width,
      altura: height,
      razao: Number((width / height).toFixed(3)),
      colunaA: { x: xA, topoDaTinta: yA },
      colunaB: { x: xB, topoDaTinta: yB },
      grausDeTombo,
      fundoTransparente: em(0, 0).a === 0,
      pixelsOpacos: opacos,
      tintaMedia: media ? `rgb(${media.join(', ')})` : null,
      luminanciaDaTinta: lum,
    };
  }, b64);
}

await navegador.close();
await writeFile('docs/medidas/sis279-carimbo.json', `${JSON.stringify(saida, null, 2)}\n`);
console.log(JSON.stringify(saida, null, 2));
