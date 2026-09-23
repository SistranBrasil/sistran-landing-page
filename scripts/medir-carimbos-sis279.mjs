/**
 * SIS-279 — mede as TRÊS artes de carimbo (Fast, QA Integrado, Connect API) ANTES
 * de montá-las, com o Smart Miner e o Match AI como CONTROLE (são as duas que o
 * componente já serve, medidas pelo mesmo código, então os números novos são
 * comparáveis a algo).
 *
 * O item 1 da issue é este: «Medir razão intrínseca de cada PNG (como Smart Miner)
 * e configurar `CarimboBatida` / `--carimbo-batida-w`». Os três portões de entrada
 * do `CarimboBatida` são os mesmos da 1ª volta do Smart Miner, e nenhum é detalhe:
 *
 *   1. TOMBO DE REPOUSO ≈ −3°/−5°. O componente assenta a peça em `rotation: 0`
 *      porque as artes servidas vêm tombadas DENTRO do arquivo. Arte RETA exigiria
 *      um `tomboRepouso` novo no componente — então o ângulo reprova ou aprova a
 *      arte.
 *   2. TINTA CLARA SOBRE TRANSPARÊNCIA. O nome promete `ffffff`; cápsula branca só
 *      se lê em faixa escura, e é isso que decide em qual faixa de cada rota ela
 *      pode entrar.
 *   3. RAZÃO INTRÍNSECA, que é o que monta `--carimbo-batida-ar` e impede a cápsula
 *      de achatar — e é o número que calibra `--carimbo-batida-w` por rota.
 *
 * A GRAFIA (o 3º item da conferência do Smart Miner, que a 5ª volta do Match AI
 * teve de fazer DEPOIS de a arte errada estar no ar) não se mede em número: a
 * sonda compõe cada arte sobre `#001A3D` e grava um PNG em `docs/capturas/`, para
 * ser lida com o olho antes de montar.
 *
 * Uso: node scripts/medir-carimbos-sis279.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const { chromium } = await import(PLAYWRIGHT);

/* Os três caminhos são os de DEPOIS da mudança de pasta. A issue nomeia as artes
   na raiz de `public/`, e elas desceram para `public/images/solucoes/` junto com as
   irmãs pela razão que o docblock do Smart Miner registra: ter a mesma família de
   cápsula em duas pastas foi o que produziu o defeito da 5ª volta do Match AI (a
   cópia da raiz escrevia «MACH AI» e foi ela que subiu para a tela). */
const ARQUIVOS = {
  fast: 'public/images/solucoes/carimbo-fast-ticket-outline-ffffff.png',
  'qa-integrado': 'public/images/solucoes/carimbo-qa-integrado-ticket-outline-ffffff.png',
  'connect-api': 'public/images/solucoes/carimbo-connect-api-ticket-outline-ffffff.png',
  /* CONTROLES: as duas artes que `CarimboBatida` já serve. */
  'smart-miner': 'public/images/solucoes/carimbo-smart-miner-ticket-outline-ffffff.png',
  'match-ai': 'public/images/solucoes/carimbo-match-ai-ticket-outline-ffffff.png',
};

const navegador = await chromium.launch({ executablePath: SHELL });
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

  /* A GRAFIA — composição sobre o navy da casa, para LER a arte. */
  await page.setContent(
    `<body style="margin:0;background:#001A3D;padding:24px;width:max-content">
       <img src="data:image/png;base64,${b64}" style="display:block;width:820px;height:auto">
     </body>`,
  );
  await page.locator('img').waitFor();
  await page
    .locator('body')
    .screenshot({ path: `docs/capturas/sis279-arte-${nome}.png` });
}

await navegador.close();
await writeFile('docs/medidas/sis279-carimbos.json', `${JSON.stringify(saida, null, 2)}\n`);
console.log(JSON.stringify(saida, null, 2));
