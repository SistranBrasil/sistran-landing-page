/**
 * SIS-286 — portões medidos da `/solucoes/fast`, item da issue por item.
 *
 *  1. as SEIS faixas na ordem da mock, com as âncoras que `pageSections.ts`
 *     deriva dos blocos (uma parada sem âncora é a bolinha que não leva a nada);
 *  2. os quatro cards de «O que o Fast oferece?» numa fileira a 1440 e empilhados
 *     a 390; as três colunas de «Benefícios» com os números 95% / 0% / 450;
 *  3. o diagrama de hub: as quatro caixas presentes e os conectores SÓ a 1440;
 *  4. todo slot de imagem aponta para a capa do Fast (nenhuma arte nova);
 *  5. contraste medido no COMPOSTO (recorte 1x1 do print, decodificado no
 *     próprio navegador) para a tinta branca da faixa escura e para a pílula
 *     «Conheça o dashboard» dentro de `.section-light`;
 *  6. o tom de fundo das três paradas que passaram a `claro` em
 *     `pageSections.ts`, amostrado na margem do indicador lateral;
 *  7. as outras SEIS slugs continuam no caminho genérico (abertura com
 *     `.hero-backdrop` e o `<nav>` «Outras soluções» escuro);
 *  + os dois canais de movimento reduzido: nada preso em `opacity: 0`;
 *  + 0 erro de console em todas as passagens.
 *
 * POR QUE RAMPA DE SCROLL E NÃO `scrollIntoView`: as seções entram por variants
 * do `motion/react`. Um salto único deixa os nós no transform inicial com
 * `opacity: 0`, e toda geometria lida ali é lixo silencioso.
 *
 * Uso: node scripts/medir-fast-sis286.mjs   (com o `next dev` em :3000)
 */

import { writeFile } from 'node:fs/promises';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const { chromium } = await import(PLAYWRIGHT);
const URL_BASE = 'http://localhost:3000';

const luminancia = (css) => {
  const [r, g, b] = css.match(/\d+/g).slice(0, 3).map(Number);
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contraste = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

const rampa = async (page) => {
  const altura = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < altura; y += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(2200);
};

const navegador = await chromium.launch();

async function pixel(page, x, y) {
  const buf = await page.screenshot({
    animations: 'disabled',
    clip: { x, y, width: 1, height: 1 },
  });
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const [r, g, bl] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${bl})`;
  }, buf.toString('base64'));
}

async function abrir(rota, { largura, reduce }) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
    ...(reduce ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const page = await ctx.newPage();
  const erros = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  page.on('pageerror', (e) => erros.push(String(e)));
  await page.goto(`${URL_BASE}${rota}`, { waitUntil: 'load', timeout: 90000 });
  await rampa(page);
  return { ctx, page, erros };
}

const ANCORAS = [
  'topo',
  'o-que-e-o-fast',
  'o-que-o-fast-oferece',
  'integracao-sem-fronteiras',
  'beneficios',
  'monitore-e-aprimore-seus-processos',
  'outras-solucoes',
];

const lerPagina = (page) =>
  page.evaluate((ancoras) => {
    const secoes = [...document.querySelectorAll('main section, main nav')].map((s) => {
      const r = s.getBoundingClientRect();
      const t = s.querySelector('h1, h2');
      return {
        titulo: t?.textContent?.trim() ?? null,
        id: t?.id || s.id || null,
        topoDoc: Math.round(r.top + window.scrollY),
        claro: s.classList.contains('section-light'),
        fundo: getComputedStyle(s).backgroundColor,
      };
    });
    const ausentes = ancoras.filter((a) => !document.getElementById(a));
    const oferece = [
      ...document.querySelectorAll('[aria-labelledby="o-que-o-fast-oferece"] li'),
    ].map((li) => {
      const r = li.getBoundingClientRect();
      return {
        termo: li.querySelector('h3')?.textContent?.trim(),
        left: Math.round(r.left),
        largura: Math.round(r.width),
      };
    });
    const benef = [...document.querySelectorAll('[aria-labelledby="beneficios"] li')].map((li) => {
      const r = li.getBoundingClientRect();
      const spans = [...li.querySelectorAll('span')].map((s) => s.textContent.trim());
      return {
        numero: spans[0] ?? null,
        rotulo: spans[1] ?? null,
        left: Math.round(r.left),
        largura: Math.round(r.width),
        bordaEsq: getComputedStyle(li).borderLeftWidth,
      };
    });
    const hub = [...document.querySelectorAll('[aria-labelledby="integracao-sem-fronteiras"] .rounded-2xl')]
      .map((c) => c.querySelector('span')?.textContent?.trim())
      .filter(Boolean);
    const conectores = [
      ...document.querySelectorAll('[aria-labelledby="integracao-sem-fronteiras"] [aria-hidden="true"]'),
    ].filter((s) => s.offsetParent !== null && s.querySelector('span')).length;
    const imagens = [...document.querySelectorAll('main img')].map((i) => ({
      src: new URL(i.currentSrc || i.src).pathname,
      alt: i.getAttribute('alt'),
    }));
    const invisiveis = [...document.querySelectorAll('main *')]
      .filter((e) => Number(getComputedStyle(e).opacity) < 0.05 && e.getBoundingClientRect().height > 4)
      .map((e) => e.tagName + '.' + (e.className?.toString?.().slice(0, 40) ?? ''));
    const pilula = document.querySelector('[aria-labelledby="monitore-e-aprimore-seus-processos"] a[href="/contato"]');
    const pr = pilula?.getBoundingClientRect();
    return {
      secoes,
      ancorasAusentes: ausentes,
      oferece,
      benef,
      hub,
      conectoresVisiveis: conectores,
      imagens,
      invisiveis,
      pilula: pilula
        ? {
            texto: pilula.textContent.trim(),
            tinta: getComputedStyle(pilula).color,
            fundo: getComputedStyle(pilula).backgroundColor,
            x: Math.round(pr.left + pr.width / 2),
            y: Math.round(pr.top + pr.height / 2),
          }
        : null,
    };
  }, ANCORAS);

const resultado = {};

for (const largura of [390, 1440]) {
  const { ctx, page, erros } = await abrir('/solucoes/fast', { largura, reduce: false });
  const dados = await lerPagina(page);

  /* Composto: tinta branca da faixa escura, e a pílula azul dentro da faixa
     clara. Amostro o pixel já pintado — é o único jeito de saber o que o olho
     recebe quando há véu, sombra e gradiente empilhados. */
  const composto = {};
  const pontoEscuro = await page.evaluate(() => {
    const s = document.querySelector('[aria-labelledby="integracao-sem-fronteiras"]');
    s.scrollIntoView({ block: 'center' });
    const p = s.querySelector('p').getBoundingClientRect();
    return { x: Math.round(p.right - 6), y: Math.round(p.top + 4) };
  });
  await page.waitForTimeout(500);
  {
    const css = await pixel(page, pontoEscuro.x, pontoEscuro.y);
    const L = luminancia(css);
    composto.faixaEscura = {
      css,
      contrasteBranco085: Number(contraste(L, luminancia('rgb(217, 217, 217)')).toFixed(2)),
    };
  }
  {
    const pos = await page.evaluate(() => {
      const a = document.querySelector('[aria-labelledby="monitore-e-aprimore-seus-processos"] a[href="/contato"]');
      a.scrollIntoView({ block: 'center' });
      const r = a.getBoundingClientRect();
      return { x: Math.round(r.left + 6), y: Math.round(r.top + r.height / 2) };
    });
    await page.waitForTimeout(500);
    const css = await pixel(page, pos.x, pos.y);
    const L = luminancia(css);
    composto.pilulaDashboard = {
      fundoComposto: css,
      tintaComputada: dados.pilula?.tinta,
      contraste: Number(contraste(L, luminancia(dados.pilula?.tinta ?? 'rgb(255,255,255)')).toFixed(2)),
    };
  }

  /* Tom das três paradas que viraram `claro`: amostro na faixa de 24px da margem
     esquerda, que é onde o indicador lateral desenha o rótulo. */
  const tons = {};
  for (const id of ['o-que-o-fast-oferece', 'beneficios', 'monitore-e-aprimore-seus-processos']) {
    const pos = await page.evaluate((alvo) => {
      const s = document.getElementById(alvo).closest('section');
      s.scrollIntoView({ block: 'center' });
      const r = s.getBoundingClientRect();
      return { x: 24, y: Math.round(r.top + Math.min(r.height / 2, 400)) };
    }, id);
    await page.waitForTimeout(400);
    const css = await pixel(page, pos.x, Math.max(1, Math.min(899, pos.y)));
    tons[id] = { css, luminancia: Number(luminancia(css).toFixed(4)) };
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({
    path: `docs/capturas/sis286-fast-${largura}.png`,
    fullPage: true,
    animations: 'disabled',
  });

  resultado[`w${largura}`] = { ...dados, composto, tons, erros };
  await ctx.close();
}

/* MOVIMENTO REDUZIDO — os dois canais. Não há animação em laço nesta página, então
   o que se mede é o que importa: nada preso invisível. */
for (const canal of ['media', 'atributo']) {
  const { ctx, page, erros } = await abrir('/solucoes/fast', {
    largura: 1440,
    reduce: canal === 'media',
  });
  if (canal === 'atributo') {
    await page.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
    await page.waitForTimeout(400);
  }
  const d = await lerPagina(page);
  resultado[`reduce-${canal}`] = {
    secoes: d.secoes.length,
    invisiveis: d.invisiveis,
    ancorasAusentes: d.ancorasAusentes,
    erros,
  };
  await ctx.close();
}

/* AS OUTRAS SEIS: o caminho genérico não mudou — abertura com `.hero-backdrop`
   (exceto `lumina-ai`, que segue sem capa por decisão da própria SIS-286) e o
   `<nav>` «Outras soluções» sobre o navy, sem `.section-light`. */
resultado.outrasSlugs = {};
for (const slug of ['match-ai', 'lumina-ai', 'qa-integrado', 'connect-api', 'smart-miner', 'guru-de-seguros']) {
  const { ctx, page, erros } = await abrir(`/solucoes/${slug}`, { largura: 1440, reduce: false });
  resultado.outrasSlugs[slug] = {
    ...(await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-labelledby="outras-solucoes"]');
      return {
        temBackdrop: !!document.querySelector('.hero-backdrop'),
        navClaro: nav ? nav.classList.contains('section-light') : null,
        h2Outras: nav?.querySelector('h2')?.className ?? null,
      };
    })),
    erros,
  };
  await ctx.close();
}

await navegador.close();
await writeFile('docs/medidas/sis286-fast-depois.json', `${JSON.stringify(resultado, null, 2)}\n`);
console.log(JSON.stringify(resultado, null, 2));
