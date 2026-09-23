/**
 * SIS-279 (slot reaproveitado) — mede a arte do carimbo do GURU DE SEGUROS **antes**
 * de montá-la, com o Smart Miner como CONTROLE: é a arte cuja altura de caixa a
 * família toda passou a herdar (o bloco `SIS-279` do `globals.css` deriva as cinco
 * larguras de `12,5rem ÷ 2,835`), então medir as duas pelo mesmo código é o que faz
 * o número novo comparável a algo.
 *
 * É o item 1 da issue («medir tombo/tinta antes de montar»). Os três portões de
 * entrada do `CarimboBatida` são os mesmos que o script da família já registra:
 *
 *   1. TOMBO DE REPOUSO ≈ −3°. O componente assenta a peça em `rotation: 0` porque
 *      as artes servidas vêm tombadas DENTRO do arquivo. Arte RETA exigiria um
 *      `tomboRepouso` novo no componente — então o ângulo reprova ou aprova a arte.
 *   2. TINTA CLARA SOBRE TRANSPARÊNCIA. O nome promete `ffffff`; cápsula branca só
 *      se lê em faixa escura, e é isso que decide que ela entra no hero (que tem
 *      véu navy) e não nas faixas claras desta rota.
 *   3. RAZÃO INTRÍNSECA, que monta `--carimbo-batida-ar` (impede achatar) e calibra
 *      `--carimbo-batida-w`.
 *
 * A GRAFIA não se mede em número — e é o defeito que a 5ª volta do Match AI
 * produziu (cápsula com o nome de outro produto no ar). A sonda compõe a arte sobre
 * o navy da casa e grava `docs/capturas/sis279-arte-guru-de-seguros.png` para ser
 * LIDA com o olho antes de montar.
 *
 * Uso: node scripts/medir-carimbo-guru-sis279.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const { chromium } = await import(PLAYWRIGHT);

/* A arte da issue chegou na RAIZ de `public/images/` com o nome `carimbo-seguros-…`.
   Ela desceu para `public/images/solucoes/` com o nome da família e não ficou uma
   cópia atrás: ter a mesma família de cápsula em duas pastas foi exatamente o que
   produziu o defeito da 5ª volta do Match AI (a cópia da raiz escrevia «MACH AI» e
   foi ela que subiu para a tela). Nenhum arquivo do repositório referenciava o nome
   antigo — conferido com `grep` antes de mover. */
const ARQUIVOS = {
  'guru-de-seguros': 'public/images/solucoes/carimbo-guru-de-seguros-ticket-outline-ffffff.png',
  /* CONTROLE: a arte de que a altura de caixa da família toda é derivada. */
  'smart-miner': 'public/images/solucoes/carimbo-smart-miner-ticket-outline-ffffff.png',
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
  await page.locator('body').screenshot({ path: `docs/capturas/sis279-arte-${nome}.png` });
}

/* A CONTA DA LARGURA, feita aqui e não de cabeça: a altura de caixa da família é a
   do Smart Miner (`12,5rem ÷ razão` no teto, `10,5rem ÷ razão` no piso,
   `13,5vw ÷ razão` no meio), e a largura de cada irmã é essa altura MULTIPLICADA
   pela razão da própria arte. É o que faz as cápsulas do site terem a mesma altura
   de caixa em qualquer largura de tela. */
{
  const ref = saida['smart-miner'].razao;
  const alturaTeto = 12.5 / ref;
  const alturaPiso = 10.5 / ref;
  const alturaMeio = 13.5 / ref;
  const r = saida['guru-de-seguros'].razao;
  saida.contaDaLargura = {
    razaoDeReferencia: ref,
    alturaDeCaixaRem: {
      teto: Number(alturaTeto.toFixed(3)),
      piso: Number(alturaPiso.toFixed(3)),
      meioVw: Number(alturaMeio.toFixed(3)),
    },
    guruDeSeguros: {
      razao: r,
      tetoRem: Number((alturaTeto * r).toFixed(2)),
      pisoRem: Number((alturaPiso * r).toFixed(2)),
      meioVw: Number((alturaMeio * r).toFixed(2)),
    },
  };
}

await navegador.close();
await writeFile('docs/medidas/sis279-guru-arte.json', `${JSON.stringify(saida, null, 2)}\n`);
console.log(JSON.stringify(saida, null, 2));
