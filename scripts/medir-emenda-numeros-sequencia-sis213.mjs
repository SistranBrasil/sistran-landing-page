/**
 * SIS-213 — as duas cores que a emenda Números → ImpactSequence tem de ligar.
 *
 * Com os dois véus brancos desligados (`.impact-saida` e `.sequence::after`),
 * amostra a linha de pixels imediatamente ACIMA e imediatamente ABAIXO da
 * fronteira. É isso que decide a tinta da passagem: hoje ela é `--paper`, escrita
 * quando a vizinha de baixo era clara. Se as duas leituras vierem escuras, a
 * ponte branca não liga nada — ela é o degrau.
 *
 * Uso: URL_BASE=http://localhost:3999 node scripts/medir-emenda-numeros-sequencia-sis213.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const SEM_VEUS = `.impact-saida{background:none!important}.sequence::after{background:none!important}`;

const navegador = await chromium.launch();
for (const [nome, css] of [
  ['com os véus (estado atual)', ''],
  ['sem os véus', SEM_VEUS],
]) {
  const contexto = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const pagina = await contexto.newPage();
  await pagina.goto(URL_BASE, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('#resultados', { timeout: 180_000 });
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
      header{display:none!important}
      ${css}`,
  });
  await pagina.waitForTimeout(2500);

  /* A fronteira é a base de `#resultados`. Rola de modo que ela caia no meio da
     janela, e só então lê os pixels: a `.sequence` tem interior `sticky` e vídeo,
     e medir fora do quadro daria outro frame. */
  const base = await pagina.evaluate(() => {
    const r = document.querySelector('#resultados').getBoundingClientRect();
    return r.bottom + window.scrollY;
  });
  await pagina.evaluate((y) => window.scrollTo(0, y - 450), base);
  await pagina.waitForTimeout(1200);
  const linhaFronteira = await pagina.evaluate(() => {
    const r = document.querySelector('#resultados').getBoundingClientRect();
    return Math.round(r.bottom);
  });
  const foto = await pagina.screenshot();
  const { data, info } = await sharp(foto).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, channels } = info;
  const ler = (y) => {
    /* Média de uma faixa central de 200px, longe das curvas cianas das laterais. */
    let r = 0;
    let g = 0;
    let b = 0;
    for (let x = 620; x < 820; x += 1) {
      const i = (y * width + x) * channels;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    return [r, g, b].map((v) => Math.round(v / 200));
  };
  console.log(`\n— ${nome} — fronteira em y=${linhaFronteira}`);
  for (const d of [-240, -160, -96, -40, -6, 6, 40, 120, 200, 300]) {
    const y = linhaFronteira + d;
    const [r, g, b] = ler(y);
    console.log(`  ${d > 0 ? '+' : ''}${d}px\trgb(${r} ${g} ${b})`);
  }
  await contexto.close();
}
await navegador.close();
