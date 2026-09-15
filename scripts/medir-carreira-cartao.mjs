/**
 * Cartão «Como chegar até nós» de `/trabalhe-conosco` — o pedido era que ele
 * DEIXASSE DE SER TRANSPARENTE e virasse azul claro. Duas coisas têm de ser
 * medidas, e a segunda é consequência inevitável da primeira:
 *
 *  1. OPACIDADE REAL. Não basta ler `background-color`: o defeito relatado era o
 *     vídeo do hero aparecendo através do cartão, e isso depende de `alpha` E de
 *     `backdrop-filter`. Prova-se comparando o MESMO recorte em dois quadros
 *     distintos do vídeo: se o cartão fosse translúcido, os pixels dele mudariam
 *     entre os dois. Fundo opaco = diferença zero.
 *  2. CONTRASTE das quatro tintas escuras que tiveram de entrar junto (texto
 *     branco sobre `#e6f2fd` daria ~1,1:1), pelo método p5×p95 das outras issues
 *     do time, com o recorte de glifos via `Range` — a mesma armadilha de moldura
 *     registrada em `medir-cta-sis253.mjs`.
 */

import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';
import { mkdir, rm, writeFile } from 'node:fs/promises';

const T = 'docs/medidas/.tmpcar';
await mkdir(T, { recursive: true });
await mkdir('docs/capturas', { recursive: true });

const canal = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const raz = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
async function bruto(f) {
  const { data, info } = await sharp(f).raw().toBuffer({ resolveWithObject: true });
  return { data, n: info.channels };
}
async function medir(f) {
  const { data, n } = await bruto(f);
  const a = [];
  for (let i = 0; i < data.length; i += n) a.push({ l: lum(data[i], data[i + 1], data[i + 2]), c: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})` });
  a.sort((x, y) => x.l - y.l);
  const p = (q) => a[Math.round(q * (a.length - 1))];
  return { razao: Number(raz(p(0.05).l, p(0.95).l).toFixed(2)), tinta: p(0.05).c, fundo: p(0.95).c };
}

const nav = await chromium.launch();
const res = {};
for (const largura of [1440, 390]) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: largura === 1440 ? 900 : 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000/trabalhe-conosco', { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 30000 });
  await p.waitForSelector('[data-route-loading]', { state: 'detached', timeout: 30000 });
  await p.locator('#como-chegar').evaluate((n) => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await p.waitForTimeout(1500);

  const chave = `w${largura}`;
  res[chave] = {};
  res[chave].estilo = await p.locator('#como-chegar .glass-card').evaluate((n) => {
    const c = getComputedStyle(n);
    return {
      background: c.backgroundColor,
      backdropFilter: c.backdropFilter,
      border: c.borderTopColor,
      antesOpacidade: getComputedStyle(n, '::before').opacity,
    };
  });

  /* Prova de opacidade: dois quadros do vídeo, mesmo recorte. */
  const caixa = await p.locator('#como-chegar .glass-card').boundingBox();
  const dentro = { x: caixa.x + 12, y: caixa.y + caixa.height - 60, width: Math.min(200, caixa.width - 24), height: 40 };
  const f1 = `${T}/${chave}-q1.png`; const f2 = `${T}/${chave}-q2.png`;
  await p.screenshot({ path: f1, clip: dentro });
  await p.waitForTimeout(1400);
  await p.screenshot({ path: f2, clip: dentro });
  {
    const a = await bruto(f1); const b = await bruto(f2);
    let max = 0; let dif = 0;
    for (let i = 0; i < a.data.length; i += 1) { const d = Math.abs(a.data[i] - b.data[i]); if (d > max) max = d; if (d > 2) dif += 1; }
    res[chave].opacidade = { maxDeltaCanal: max, canaisAcima2: dif, opaco: max <= 2 };
  }

  /* Contraste dos quatro textos, recortando só os glifos. */
  const alvos = {
    titulo: '#como-chegar-titulo',
    paragrafo1: '#como-chegar .glass-card p:nth-of-type(1)',
    paragrafo2: '#como-chegar .glass-card p:nth-of-type(2)',
    letraMiuda: '#como-chegar .glass-card p:nth-of-type(3)',
    botao: '#como-chegar .btn-primary',
  };
  res[chave].contraste = {};
  for (const [k, s] of Object.entries(alvos)) {
    const cx = await p.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const no = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
      const r = document.createRange();
      if (no) r.selectNodeContents(no); else r.selectNodeContents(el);
      const q = r.getBoundingClientRect();
      return { x: q.x, y: q.y, width: q.width, height: q.height, cor: getComputedStyle(el).color };
    }, s);
    if (!cx || cx.width < 2) { res[chave].contraste[k] = null; continue; }
    const f = `${T}/${chave}-${k}.png`;
    await p.screenshot({ path: f, clip: { x: cx.x, y: cx.y, width: cx.width, height: cx.height } });
    res[chave].contraste[k] = { ...(await medir(f)), cor: cx.cor, caixa: `${Math.round(cx.width)}x${Math.round(cx.height)}` };
  }

  await p.screenshot({ path: `docs/capturas/carreira-cartao-${largura}-depois.png`, clip: caixa });
  if (largura === 1440) {
    await p.screenshot({ path: 'docs/capturas/carreira-abertura-1440-depois.png', clip: await p.locator('.carreira-abertura').boundingBox() });
  }
  await ctx.close();
}
await writeFile('docs/medidas/carreira-cartao.json', `${JSON.stringify(res, null, 1)}\n`);
console.log(JSON.stringify(res, null, 1));
await rm(T, { recursive: true, force: true });
await nav.close();
