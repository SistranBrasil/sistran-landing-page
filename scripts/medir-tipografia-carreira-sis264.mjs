/**
 * SIS-264 — tipografia da abertura de `/trabalhe-conosco` e copy do formulário.
 * Bancada; não entra no bundle.
 *   node scripts/medir-tipografia-carreira-sis264.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const DESTINO = 'docs/medidas/sis264';

const browser = await chromium.launch();
await mkdir(DESTINO, { recursive: true });

async function medir(largura, altura) {
  const ctx = await browser.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await ctx.newPage();
  await p.goto(`${BASE}/trabalhe-conosco`, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(1200);
  const dados = await p.evaluate(() => {
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const px = (el) => (el ? Number.parseFloat(cs(el).fontSize) : null);
    const h1 = document.querySelector('.hero-backdrop--carreira .pagehero-entrada h1');
    const eye = document.querySelector('.hero-backdrop--carreira .pagehero-entrada .eyebrow');
    const desc = document.querySelector('.hero-backdrop--carreira .pagehero-entrada h1 + div');
    const ben = document.querySelector('.carreira-beneficios li span');
    const slog = document.querySelector('.carreira-slogan');
    const titulo = document.querySelector('.cv-titulo');
    const btn = document.querySelector('.cv-form button[type="submit"], .cv-form button');
    const texto = document.body.innerText;
    const h1Box = h1?.getBoundingClientRect();
    const line = h1 ? Number.parseFloat(cs(h1).lineHeight) : 0;
    return {
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      h1Lines: h1 && line ? Number((h1Box.height / line).toFixed(2)) : null,
      sizes: {
        eyebrow: px(eye),
        h1: px(h1),
        h1Weight: h1 ? cs(h1).fontWeight : null,
        desc: px(desc),
        beneficios: px(ben),
        slogan: px(slog),
        cvTitulo: px(titulo),
        cvTituloWeight: titulo ? cs(titulo).fontWeight : null,
      },
      cvTitulo: titulo?.textContent?.trim() ?? null,
      cta: btn?.textContent?.trim() ?? null,
      checkboxes: document.querySelectorAll('.cv-form input[type="checkbox"]').length,
      faixas: document.querySelectorAll('.carreira-vertical').length,
      temApoio: texto.includes('Leva menos de 2 minutos'),
      temLiEConcordo: texto.includes('Li e concordo'),
      temPrivacyNote: texto.includes('este envio é uma demonstração'),
    };
  });
  await p.screenshot({ path: `${DESTINO}/${largura}.png` });
  await ctx.close();
  return dados;
}

const resultado = {
  r1440: await medir(1440, 900),
  r390: await medir(390, 844),
};
await writeFile(`${DESTINO}/medidas.json`, JSON.stringify(resultado, null, 2));
console.log(JSON.stringify(resultado, null, 2));
await browser.close();
