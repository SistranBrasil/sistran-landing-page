/**
 * SIS-225 — capturas da abertura de /parceiros-e-implementacoes.
 *
 * Duas fotos por largura: a abertura no topo e a EMENDA com a seção clara
 * `#parceiros` logo abaixo (item 5 da issue). A emenda não aparece na foto do
 * topo a 1440 — a abertura ocupa a janela quase toda — então ela é fotografada
 * rolando até o pé do véu.
 *
 * Uso (com o site no ar):
 *   ROTULO=antes node scripts/capturar-abertura-parceiros-sis225.mjs
 *   ROTULO=depois node scripts/capturar-abertura-parceiros-sis225.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const ROTULO = process.env.ROTULO ?? 'depois';
const LARGURAS = process.env.LARGURAS ? process.env.LARGURAS.split(',').map(Number) : [1440, 390];
const DIR = 'docs/capturas';
await mkdir(DIR, { recursive: true });

const navegador = await chromium.launch();
for (const w of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: w, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  /* O diálogo de preferência de movimento abre na primeira visita e cobre o
     centro da tela; marcá-lo como visto é o que a sonda da SIS-206 já faz. */
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/parceiros-e-implementacoes`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  });
  await pagina.waitForSelector('.pagehero-entrada h1', { timeout: 180_000 });
  /* Espera longa: a entrada tem animação de aparição (`vTitle`/`vSubtitle`) e o
     arquivo da capa ainda está sendo baixado no primeiro acesso do `next dev`. */
  await pagina.waitForTimeout(3500);
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}`,
  });

  await pagina.screenshot({ path: `${DIR}/sis225-${ROTULO}-${w}-abertura.png` });

  /* A emenda: o topo da seção clara alinhado a 2/3 da janela, para caber o pé do
     véu inteiro acima dela. */
  await pagina.evaluate(() => {
    const secao = document.querySelector('#parceiros');
    window.scrollTo(0, secao.offsetTop - window.innerHeight * 0.66);
  });
  await pagina.waitForTimeout(1200);
  await pagina.screenshot({ path: `${DIR}/sis225-${ROTULO}-${w}-emenda.png` });

  const medida = await pagina.evaluate(() => {
    const arred = (n) => Math.round(n * 10) / 10;
    const hero = document.querySelector('.pagehero-entrada').getBoundingClientRect();
    const h1 = document.querySelector('.pagehero-entrada h1').getBoundingClientRect();
    const desc = document.querySelector('.pagehero-entrada h1 + div')?.getBoundingClientRect();
    const midia = document.querySelector('.hero-backdrop-midia')?.getBoundingClientRect();
    const img = document.querySelector('.hero-backdrop-video');
    return {
      abertura: `${arred(hero.width)}×${arred(hero.height)}`,
      caixaDaMidia: midia ? `${arred(midia.width)}×${arred(midia.height)}` : null,
      razaoDaCaixa: midia ? arred(midia.width / midia.height) : null,
      objectPosition: img ? getComputedStyle(img).objectPosition : null,
      titulo: `x ${arred(h1.left)}–${arred(h1.right)}`,
      descricao: desc ? `x ${arred(desc.left)}–${arred(desc.right)}` : null,
    };
  });
  console.log(`${w} · ${JSON.stringify(medida)}`);
  await contexto.close();
}
await navegador.close();
