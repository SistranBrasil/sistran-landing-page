/**
 * SIS-213 — as duas emendas da seção Números em quadro, para decidir com o olho o
 * que a medição já localizou: a faixa clara de cima (`.impact-scroll::before`) e a
 * de baixo (`.impact-saida`). Cada foto centra uma das bordas na janela, porque a
 * pergunta não é "como está a seção" e sim "o que a vizinha põe dentro dela".
 *
 * Uso: MARCA=antes URL_BASE=http://localhost:3999 node scripts/capturar-emendas-numeros-sis213.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const MARCA = process.env.MARCA ?? 'antes';
const PASTA = 'docs/capturas';
await mkdir(PASTA, { recursive: true });

const navegador = await chromium.launch();
const contexto = await navegador.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
const pagina = await contexto.newPage();
await pagina.goto(URL_BASE, { waitUntil: 'domcontentloaded', timeout: 180_000 });
await pagina.waitForSelector('#resultados', { timeout: 180_000 });
await pagina.addStyleTag({
  content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}`,
});
await pagina.waitForTimeout(2500);

const caixa = await pagina.evaluate(() => {
  const el = document.querySelector('#resultados');
  const r = el.getBoundingClientRect();
  return { topo: r.top + window.scrollY, base: r.bottom + window.scrollY };
});

for (const [nome, y] of [
  ['topo', Math.max(0, caixa.topo - 450)],
  ['base', Math.max(0, caixa.base - 450)],
]) {
  await pagina.evaluate((alvo) => window.scrollTo(0, alvo), y);
  await pagina.waitForTimeout(800);
  await pagina.screenshot({ path: `${PASTA}/sis213-${MARCA}-emenda-${nome}-1440.png` });
  console.log(`emenda ${nome}: y=${Math.round(y)}`);
}
await navegador.close();
