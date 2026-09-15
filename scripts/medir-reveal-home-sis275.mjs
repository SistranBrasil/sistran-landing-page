/**
 * SIS-275 — «Home · reveal on scroll (docs/scroll.md)».
 *
 *   node scripts/medir-reveal-home-sis275.mjs
 *
 * Confere linha do tempo dos dois escopos da home que a SIS-197 marcou e a
 * SIS-275 recalibrou (`home-solucoes-cabecalho`, `home-impacto-legenda`): cada
 * um deve acender em `scrollY` distinto, e nenhum dos dois no load (scrollY 0)
 * depois da cortina — o hero e a BrandGrid ocupam a dobra.
 *
 * Também confere ausências (segundo reveal proibido) e sticky intacto.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const URL_ROTA = 'http://localhost:3000/';
const JANELA = { width: 1440, height: 900 };
const PASSO = 80;

const nav = await chromium.launch();
const res = {
  issue: 'SIS-275',
  viewport: `${JANELA.width}x${JANELA.height}`,
  passoDaSonda: PASSO,
  linhaDoTempo: [],
  primeiroAceso: {},
  ausencias: {},
  sticky: {},
  reduce: {},
  erros: [],
};

{
  const ctx = await nav.newContext({ viewport: JANELA });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran:intro-visto', '1');
  });
  const p = await ctx.newPage();
  p.on('console', (m) => {
    if (m.type() === 'error') res.erros.push(m.text());
  });
  await p.goto(URL_ROTA, { waitUntil: 'networkidle' });
  await p
    .waitForSelector('[data-route-content][data-route-liberado="true"]', {
      timeout: 40000,
    })
    .catch(() => null);
  await p.waitForTimeout(1500);

  const altura = await p.evaluate(() => document.documentElement.scrollHeight);
  res.alturaDoc = altura;

  const verEscopos = () =>
    p.evaluate(() => {
      const nos = [...document.querySelectorAll('[data-reveal-nome]')];
      return nos.map((el) => ({
        nome: el.getAttribute('data-reveal-nome'),
        dataIn: el.getAttribute('data-in'),
        topo: Math.round(el.getBoundingClientRect().top),
        altura: Math.round(el.getBoundingClientRect().height),
      }));
    });

  /* Estado logo após liberar, ainda no topo. */
  res.noLoad = await verEscopos();

  for (let y = 0; y <= altura; y += PASSO) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
    await p.waitForTimeout(90);
    const escopos = await verEscopos();
    for (const e of escopos) {
      if (e.dataIn === 'true' && res.primeiroAceso[e.nome] == null) {
        res.primeiroAceso[e.nome] = {
          scrollY: y,
          topo: e.topo,
          altura: e.altura,
        };
        res.linhaDoTempo.push({
          scrollY: y,
          nome: e.nome,
          topo: e.topo,
          altura: e.altura,
        });
      }
    }
  }

  /* Ausências: nós que NÃO podem ter data-reveal (segundo dono). */
  res.ausencias = await p.evaluate(() => {
    const contar = (sel) =>
      document.querySelectorAll(`${sel} [data-reveal]`).length;
    return {
      hero: contar('#top'),
      brandGridTitulo: document.querySelectorAll(
        '.marcas-grade-titulo [data-reveal]',
      ).length,
      metrics: contar('#resultados'),
      contact: contar('#contato'),
      social: contar('#social'),
    };
  });

  /* Sticky: nenhum ancestral de .sequence-sticky / mídia de soluções com transform. */
  res.sticky = await p.evaluate(() => {
    const ancestralTransformado = (el) => {
      let n = el?.parentElement;
      while (n && n !== document.documentElement) {
        const s = getComputedStyle(n);
        if (
          (s.transform && s.transform !== 'none') ||
          (s.filter && s.filter !== 'none') ||
          (s.perspective && s.perspective !== 'none')
        ) {
          return true;
        }
        n = n.parentElement;
      }
      return false;
    };
    const seq = document.querySelector('.sequence-sticky');
    const midia = document.querySelector('.story-solucoes__midia');
    const pj = document.querySelector('.pj-stage');
    return {
      sequenceStickyTemAncestralTransform: ancestralTransformado(seq),
      midiaTemAncestralTransform: ancestralTransformado(midia),
      pjStageTemAncestralTransform: ancestralTransformado(pj),
      sequenceStickyPosition: seq ? getComputedStyle(seq).position : null,
    };
  });

  await p.screenshot({
    path: 'docs/capturas/sis275-home-1440-fim.png',
    fullPage: false,
  });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(400);
  await p.screenshot({
    path: 'docs/capturas/sis275-home-1440-topo.png',
    fullPage: false,
  });

  await ctx.close();
}

/* Reduce: nós marcados já em opacity 1 com data-in ainda false. */
{
  const ctx = await nav.newContext({
    viewport: JANELA,
    reducedMotion: 'reduce',
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran:intro-visto', '1');
  });
  const p = await ctx.newPage();
  await p.goto(URL_ROTA, { waitUntil: 'networkidle' });
  await p
    .waitForSelector('[data-route-content][data-route-liberado="true"]', {
      timeout: 40000,
    })
    .catch(() => null);
  await p.waitForTimeout(800);
  res.reduce = await p.evaluate(() => {
    const nos = [...document.querySelectorAll('[data-reveal]')].map((el) => {
      const s = getComputedStyle(el);
      return {
        preset: el.getAttribute('data-reveal'),
        opacity: s.opacity,
        transform: s.transform,
      };
    });
    return { nosHome: nos.filter((_, i) => i < 20), total: nos.length };
  });
  await ctx.close();
}

await nav.close();

await writeFile(
  'docs/medidas/sis275-depois.json',
  JSON.stringify(res, null, 2),
);
console.log(JSON.stringify(res, null, 2));
