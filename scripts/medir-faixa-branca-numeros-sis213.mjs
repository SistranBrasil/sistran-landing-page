/**
 * SIS-213 — a faixa/sombra branca no fundo da seção Números da home.
 *
 * Duas saídas, e a segunda é a que decide:
 *   1. capturas de 1440 da cena, para o antes/depois que a issue pede;
 *   2. o PERFIL DE LUMINÂNCIA por linha da seção — média e máximo de cada linha
 *      de pixels. Uma "faixa branca horizontal" é, por definição, um trecho de
 *      linhas com luminância muito acima das vizinhas; olhar a captura diz que
 *      ela existe, o perfil diz ONDE começa, onde acaba e quão clara é. Sem isso
 *      não há como afirmar que a camada certa foi desligada.
 *
 * Uso (com o site no ar):
 *   MARCA=antes URL_BASE=http://localhost:3999 node scripts/medir-faixa-branca-numeros-sis213.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, readFile } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const MARCA = process.env.MARCA ?? 'antes';
const PASTA = 'docs/capturas';
await mkdir(PASTA, { recursive: true });

const luminancia = (r, g, b) => {
  const c = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

const navegador = await chromium.launch();
const contexto = await navegador.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
await contexto.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference-seen', '1');
});
const pagina = await contexto.newPage();
await pagina.goto(URL_BASE, { waitUntil: 'domcontentloaded', timeout: 180_000 });
await pagina.waitForSelector('#resultados', { timeout: 180_000 });
await pagina.addStyleTag({
  content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
    header{display:none!important}`,
});
/* A arte do fundo é `next/image` sem `priority`: sem esta espera a foto sai com o
   navy chapado por baixo, que é justamente o estado que a issue quer alcançar —
   mediria o alvo em vez do defeito. */
await pagina.waitForTimeout(2500);

/* Foto da SEÇÃO inteira, e não da janela: a faixa é uma banda horizontal e só o
   recorte completo mostra onde ela cai dentro da cena. */
const alvo = pagina.locator('#resultados');
const caminho = `${PASTA}/sis213-${MARCA}-1440.png`;
await alvo.scrollIntoViewIfNeeded();
await pagina.waitForTimeout(600);
await alvo.screenshot({ path: caminho });

const { data, info } = await sharp(await readFile(caminho))
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
console.log(`seção: ${width}x${height}`);

const linhas = [];
for (let y = 0; y < height; y += 1) {
  let soma = 0;
  let max = 0;
  for (let x = 0; x < width; x += 1) {
    const i = (y * width + x) * channels;
    const l = luminancia(data[i], data[i + 1], data[i + 2]);
    soma += l;
    if (l > max) max = l;
  }
  linhas.push({ y, media: soma / width, max });
}

/* O relatório em passos de 2% da altura: perfil legível sem despejar milhares de
   linhas. O pico é reportado separado, porque é ele que a issue chama de faixa. */
const passo = Math.max(1, Math.round(height / 50));
console.log('y\tmédia\tmáx');
for (let y = 0; y < height; y += passo) {
  const l = linhas[y];
  console.log(`${l.y}\t${l.media.toFixed(4)}\t${l.max.toFixed(4)}`);
}
const pico = linhas.reduce((a, b) => (b.media > a.media ? b : a));
console.log(`\npico de média: y=${pico.y} média=${pico.media.toFixed(4)} máx=${pico.max.toFixed(4)}`);
const mediana = [...linhas].sort((a, b) => a.media - b.media)[Math.floor(height / 2)];
console.log(`mediana das linhas: ${mediana.media.toFixed(4)}`);

await navegador.close();
