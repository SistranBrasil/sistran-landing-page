/**
 * SIS-288 — prova de que só o slot do Posicionamento em `/solucoes/match-ai`
 * passou a servir `match.png`. Os demais `img` da rota ficam no inventário.
 *
 * Uso: node scripts/medir-match-ai-posicionamento-sis288.mjs
 * (next dev em :3000)
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const URL = 'http://localhost:3000/solucoes/match-ai';
const SAIDA = 'docs/medidas/sis288-match-ai-posicionamento.json';
const PNG = 'docs/medidas/sis288-match-ai-posicionamento-1440.png';
const ALVO = '/images/solucoes/match.png';
const CAPA = '/images/solucoes/match-ai-hero.webp';

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference', 'full');
  localStorage.setItem('sistran-motion-preference-seen', '1');
  sessionStorage.setItem('sistran:intro-visto', 'true');
});
const page = await ctx.newPage();
const erros = [];
page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
page.on('pageerror', (e) => erros.push(String(e)));

const resp = await page.goto(URL, { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(2500);

const altura = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < altura; y += 400) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(80);
}
await page.waitForTimeout(800);

const dados = await page.evaluate(({ alvo, capa }) => {
  const secao = document.querySelector('[aria-labelledby="posicionamento"]');
  const imgs = [...document.querySelectorAll('img')].map((img) => {
    const secaoMaisProxima =
      img.closest('[aria-labelledby]')?.getAttribute('aria-labelledby') ||
      img.closest('section')?.id ||
      img.closest('#topo')?.id ||
      null;
    return {
      secao: secaoMaisProxima,
      src: img.currentSrc || img.getAttribute('src'),
      alt: img.getAttribute('alt'),
      ariaHidden: img.getAttribute('aria-hidden'),
      loading: img.getAttribute('loading'),
      sizes: img.getAttribute('sizes'),
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    };
  });
  const slot = secao?.querySelector('.matchai-midia img');
  const balao = secao?.querySelector('[data-balao]');
  const reveal = secao?.querySelector('[data-reveal-nome="matchai-posicionamento"]');
  return {
    statusOk: true,
    temSecao: !!secao,
    slot: slot
      ? {
          src: slot.currentSrc || slot.getAttribute('src'),
          alt: slot.getAttribute('alt'),
          ariaHidden: slot.getAttribute('aria-hidden'),
          loading: slot.getAttribute('loading'),
          sizes: slot.getAttribute('sizes'),
          naturalWidth: slot.naturalWidth,
          naturalHeight: slot.naturalHeight,
          className: slot.className,
        }
      : null,
    balaoExiste: !!balao,
    revealNome: reveal?.getAttribute('data-reveal-nome') ?? null,
    imgs,
    matchPngForaDoPosicionamento: imgs.filter((i) => {
      try {
        return new URL(i.src, location.origin).pathname === '/images/solucoes/match.png' && i.secao !== 'posicionamento';
      } catch {
        return false;
      }
    }),
    capaAindaNoPosicionamento: imgs.filter(
      (i) => i.secao === 'posicionamento' && (i.src || '').includes(capa.split('/').pop()),
    ),
    alvo,
  };
}, { alvo: ALVO, capa: CAPA });

const secao = page.locator('[aria-labelledby="posicionamento"]');
await secao.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await secao.screenshot({ path: PNG, animations: 'disabled' });

const saida = {
  issue: 'SIS-288',
  rota: '/solucoes/match-ai',
  http: resp?.status() ?? null,
  erros,
  slotPosicionamento: dados.slot,
  balaoExiste: dados.balaoExiste,
  revealNome: dados.revealNome,
  prova: {
    slotUsaMatchPng: (dados.slot?.src || '').includes('/images/solucoes/match.png'),
    naturalWidth: dados.slot?.naturalWidth,
    matchPngForaDoPosicionamento: dados.matchPngForaDoPosicionamento,
    capaAindaNoPosicionamento: dados.capaAindaNoPosicionamento,
    altVazio: dados.slot?.alt === '',
    loadingLazy: dados.slot?.loading === 'lazy',
    sizesPreservado: dados.slot?.sizes === '(min-width: 1180px) 500px, 100vw',
  },
  inventarioImgs: dados.imgs,
};

writeFileSync(SAIDA, JSON.stringify(saida, null, 2));
await navegador.close();
console.log(JSON.stringify({ arquivo: SAIDA, png: PNG, prova: saida.prova, http: saida.http, erros }, null, 2));
