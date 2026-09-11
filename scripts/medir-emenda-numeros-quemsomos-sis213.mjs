/**
 * SIS-213 — o segundo consumidor de `.impact-saida`: /quem-somos também monta
 * `<Metrics />`. Retirar a tinta `--paper` de uma regra base obriga a conferir a
 * outra rota, senão a correção da home reabre um degrau ali.
 *
 * Compara o estado novo com o antigo reposto por CSS injetado, na mesma fronteira.
 *
 * Uso: URL_BASE=http://localhost:3999 node scripts/medir-emenda-numeros-quemsomos-sis213.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const PASTA = 'docs/capturas';
await mkdir(PASTA, { recursive: true });

const navegador = await chromium.launch();
for (const [nome, css] of [
  ['depois (sem tinta)', ''],
  [
    'antes (--paper reposto)',
    '.impact-saida{background:linear-gradient(to bottom,transparent 0,var(--paper) 100%)!important}',
  ],
]) {
  const contexto = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/quem-somos`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('#resultados', { timeout: 180_000 });
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
      header{display:none!important}
      ${css}`,
  });
  await pagina.waitForTimeout(2500);
  const base = await pagina.evaluate(() => {
    const r = document.querySelector('#resultados').getBoundingClientRect();
    return r.bottom + window.scrollY;
  });
  await pagina.evaluate((y) => window.scrollTo(0, y - 450), base);
  await pagina.waitForTimeout(1000);
  const foto = await pagina.screenshot({
    path: `${PASTA}/sis213-quemsomos-${nome.startsWith('depois') ? 'depois' : 'antes'}-1440.png`,
  });
  const { data, info } = await sharp(foto).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, channels } = info;
  const ler = (y) => {
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
  const linha = await pagina.evaluate(() =>
    Math.round(document.querySelector('#resultados').getBoundingClientRect().bottom),
  );
  console.log(`\n— ${nome} — fronteira em y=${linha}`);
  for (const d of [-96, -40, -6, 6, 40, 120]) {
    const [r, g, b] = ler(linha + d);
    console.log(`  ${d > 0 ? '+' : ''}${d}px\trgb(${r} ${g} ${b})`);
  }
  await contexto.close();
}
await navegador.close();
