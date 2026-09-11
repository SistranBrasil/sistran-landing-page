/**
 * SIS-214 — só a emenda Números -> sequência, repetida, para separar VARIAÇÃO DE
 * MEDIÇÃO de mudança de página.
 *
 * Por que existe separado da sonda de ordem: nas primeiras rodadas o pixel logo
 * abaixo de `#resultados` voltou BRANCO (`#f7feff`, degrau 247) e, na rodada
 * seguinte, navy (`#042244`, degrau 4) — com o mesmo código. Um número que muda
 * sozinho não prova nem regressão nem ausência dela. Aqui a leitura espera o dobro
 * do tempo e repete três vezes por largura, para o critério 3 ("sem nova listra
 * branca") ser afirmado sobre leitura estável.
 *
 *   node scripts/medir-emenda-numeros-sis214.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const LARGURAS = process.env.LARGURAS ? process.env.LARGURAS.split(',').map(Number) : [1440, 390];
const REPETICOES = Number(process.env.REPETICOES ?? 3);
const ALTURA = 900;

const hex = ([r, g, b]) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
const navegador = await chromium.launch();
const saida = {};

for (const largura of LARGURAS) {
  saida[largura] = [];
  for (let n = 0; n < REPETICOES; n += 1) {
    const contexto = await navegador.newContext({ viewport: { width: largura, height: ALTURA } });
    const pagina = await contexto.newPage();
    await pagina.addInitScript(() => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
    });
    await pagina.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 180_000 });
    await pagina.waitForSelector('.sequence-copy', { timeout: 180_000 });
    await pagina.evaluate(() => {
      window.dispatchEvent(new WheelEvent('wheel', { deltaY: 1, bubbles: true }));
    });
    await pagina.waitForTimeout(2400);
    const base = await pagina.evaluate(() =>
      Math.round(document.querySelector('#resultados').getBoundingClientRect().bottom + window.scrollY),
    );
    const destino = Math.max(0, base - 450);
    await pagina.evaluate(([v]) => {
      window.scrollTo({ top: v, behavior: 'auto' });
      window.__lenis?.scrollTo(v, { immediate: true, force: true });
    }, [destino]);
    await pagina.waitForTimeout(2000);
    const y = await pagina.evaluate(() =>
      Math.round(document.querySelector('#resultados').getBoundingClientRect().bottom),
    );
    const tiro = await pagina.screenshot({
      clip: { x: Math.round(largura * 0.03), y: y - 3, width: 2, height: 6 },
    });
    const { data, info } = await sharp(tiro).raw().toBuffer({ resolveWithObject: true });
    const cores = [];
    for (let i = 0; i < 6; i += 1) {
      const k = i * info.width * info.channels;
      cores.push([data[k], data[k + 1], data[k + 2]]);
    }
    saida[largura].push({
      y,
      acima: cores.slice(0, 3).map(hex),
      abaixo: cores.slice(3).map(hex),
      degrauRGB: Math.max(...[0, 1, 2].map((c) => Math.abs(cores[2][c] - cores[3][c]))),
    });
    await contexto.close();
  }
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
