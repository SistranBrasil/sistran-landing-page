/**
 * SIS-292 · 3ª volta — O FUNDO TÉCNICO de `/solucoes/match-ai` medido na rota viva.
 *
 * O pedido é «quadradinhos, linhas dinâmicas e linhas discretas atrás, em tudo
 * nessa página», e cada palavra dele é um portão aqui:
 *
 *  1. EM TUDO: quantos nós de grafismo existem por seção, e QUAIS seções ficaram
 *     sem — conferido pela contagem por `<section>`, não pelo total da página (um
 *     total certo esconde duas numa e nenhuma noutra).
 *  2. LINHAS DISCRETAS ATRÁS: a malha existe E ESTÁ ANCORADA NA JANELA. O portão
 *     é `background-attachment: fixed` continuar valendo depois da troca de
 *     `overflow-hidden` por `overflow-clip` — e o `overflow` computado de cada
 *     seção ser `clip`, porque `hidden` cria contêiner de rolagem e desancora.
 *  3. QUADRADINHOS: o aceso e os pálidos PINTAM. `naturalWidth` não existe para
 *     `<rect>`, então o portão é o pixel COMPOSTO no centro do quadrado contra o
 *     pixel do fundo da seção a 24px dele: se forem iguais, não há quadrado.
 *  4. LINHAS DINÂMICAS: `stroke-dashoffset` MUDANDO entre dois quadros do mesmo
 *     nó — é o que prova movimento, e não a presença de `animation-name`.
 *  5. ATRÁS, e não na frente: o `z-index` do grafismo contra o do miolo, e nenhum
 *     nó de conteúdo perdendo contraste (o pior pixel do texto de cada seção
 *     clara e escura, com o grafismo montado).
 *  6. Os DOIS canais de movimento reduzido: traço apagado (`opacity: 0`), linha
 *     base viva, quadrado aceso em opacidade cheia. `data-motion` é SAÍDA do
 *     script de `layout.tsx`; o segundo canal é a preferência no `localStorage`.
 *
 * Uso: node scripts/medir-fundo-tecnico-sis292.mjs   (com o `next dev` em :3000)
 */

import { writeFile } from 'node:fs/promises';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const { chromium } = await import(PLAYWRIGHT);
const URL_BASE = 'http://localhost:3000';
const ROTA = '/solucoes/match-ai';

const luminancia = (css) => {
  const [r, g, b] = css.match(/\d+/g).slice(0, 3).map(Number);
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contraste = (a, b) => {
  const [l1, l2] = [luminancia(a), luminancia(b)];
  return Number(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(3));
};

const navegador = await chromium.launch();

/* Recorte 1x1 decodificado no browser: o pixel COMPOSTO é o único número honesto
   quando há foto, véu, malha e SVG empilhados — é a mesma receita da sonda dos
   oito itens. */
async function pixel(page, x, y) {
  const buf = await page.screenshot({ animations: 'disabled', clip: { x, y, width: 1, height: 1 } });
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  }, buf.toString('base64'));
}

async function abrir({ largura, reduce, preferencia }) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
    ...(reduce ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(
    (pref) => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
      if (pref) localStorage.setItem('sistran-motion-preference', pref);
    },
    preferencia ?? null,
  );
  const page = await ctx.newPage();
  const erros = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  page.on('pageerror', (e) => erros.push(String(e)));
  await page.goto(`${URL_BASE}${ROTA}`, { waitUntil: 'load', timeout: 90000 });
  /* Hidratação: sem esta espera mede-se o HTML do servidor, sem observador
     montado. */
  await page.waitForTimeout(2500);
  return { ctx, page, erros };
}

const rampa = async (page) => {
  const altura = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < altura; y += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(2200);
};

const resultado = {};

for (const largura of [390, 1440]) {
  const { ctx, page, erros } = await abrir({ largura, reduce: false });
  await rampa(page);

  const inventario = await page.evaluate(() => {
    /* A `<nav>` de «Conheça também» conta como faixa: ela é uma das cinco e
       também recebeu grafismo. Por isso o seletor é o conjunto das faixas de
       primeiro nível do corpo da rota, e não só `section`. */
    const faixas = [...document.querySelectorAll('main section, main nav[aria-labelledby]')];
    return faixas.map((s) => {
      const cs = getComputedStyle(s);
      const grade = s.querySelector(':scope > .grade-tecnica');
      const csGrade = grade && getComputedStyle(grade);
      const acentos = s.querySelector(':scope > .matchai-acentos');
      const csAcentos = acentos && getComputedStyle(acentos);
      const circuito = s.querySelector(':scope > .matchai-circuito');
      const csCirc = circuito && getComputedStyle(circuito);
      const rc = circuito?.getBoundingClientRect();
      const miolo = s.querySelector(':scope > [data-reveal-nome]');
      return {
        id: s.id || s.getAttribute('aria-labelledby') || s.tagName,
        clara: s.classList.contains('section-light'),
        overflow: cs.overflow,
        malha: csGrade
          ? { zIndex: csGrade.zIndex, ancora: csGrade.backgroundAttachment, modulo: csGrade.backgroundSize }
          : null,
        acentos: csAcentos ? { exibe: csAcentos.display, zIndex: csAcentos.zIndex } : null,
        circuito: csCirc
          ? {
              exibe: csCirc.display,
              zIndex: csCirc.zIndex,
              largura: Math.round(rc.width),
              altura: Math.round(rc.height),
              /* Quadrado é quadrado: o portão do `viewBox` fixo (se a razão
                 escorregar, a arte esticou). */
              quadrado: Math.abs(rc.width - rc.height) <= 1,
            }
          : null,
        zIndexDoMiolo: miolo ? getComputedStyle(miolo).zIndex : null,
      };
    });
  });

  /* LINHAS DINÂMICAS — dois quadros do MESMO nó. Cada traço é levado ao centro da
     tela antes de medir, porque `animation` de nó fora de quadro continua a
     correr mas o valor lido seria o de um elemento que ninguém vê. */
  const fluxo = await page.evaluate(async () => {
    const out = [];
    for (const p of document.querySelectorAll('.matchai-circuito-pulso')) {
      p.closest('section, nav')?.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 350));
      const cs = getComputedStyle(p);
      const a = cs.strokeDashoffset;
      await new Promise((r) => setTimeout(r, 400));
      const b = getComputedStyle(p).strokeDashoffset;
      out.push({
        animacao: cs.animationName,
        duracao: cs.animationDuration,
        atraso: cs.animationDelay,
        tracejado: cs.strokeDasharray,
        quadroA: a,
        quadroB: b,
        moveu: a !== b,
        traco: cs.stroke,
      });
    }
    return out;
  });

  /* QUADRADINHOS — o pixel composto do quadrado aceso contra o do fundo ao lado.
     O ponto do fundo é calculado DENTRO do `evaluate` e limitado à viewport: foi
     o defeito que estourou o recorte 1x1 a 390 na sonda anterior («Clipped area
     is outside the resulting image»). */
  const quadrados = [];
  const pontos = await page.evaluate(async () => {
    const out = [];
    for (const r of document.querySelectorAll('.matchai-circuito-aceso')) {
      const svg = r.closest('svg');
      svg.closest('section, nav')?.scrollIntoView({ block: 'center' });
      await new Promise((res) => setTimeout(res, 350));
      const c = r.getBoundingClientRect();
      if (c.width < 2 || c.top < 0 || c.bottom > window.innerHeight) continue;
      out.push({
        secao: svg.closest('section, nav')?.id || 'sem-id',
        dentro: { x: Math.round(c.left + c.width / 2), y: Math.round(c.top + c.height / 2) },
        fora: {
          x: Math.max(2, Math.min(window.innerWidth - 3, Math.round(c.left - 26))),
          y: Math.round(c.top + c.height / 2),
        },
        scroll: window.scrollY,
      });
    }
    return out;
  });
  for (const p of pontos) {
    await page.evaluate((y) => window.scrollTo(0, y), p.scroll);
    await page.waitForTimeout(250);
    const dentro = await pixel(page, p.dentro.x, p.dentro.y);
    const fora = await pixel(page, p.fora.x, p.fora.y);
    quadrados.push({
      secao: p.secao,
      pixelDoQuadrado: dentro,
      pixelDoFundo: fora,
      pintou: dentro !== fora,
      contraste: contraste(dentro, fora),
    });
  }

  /* ATRÁS E NÃO NA FRENTE: nenhum texto pode ter perdido contraste com o grafismo
     montado. O alvo é o `h2` de cada faixa, medido por pixel composto da tinta
     contra o fundo 24px à direita do fim do título. */
  const textos = await page.evaluate(async () => {
    const out = [];
    for (const h of document.querySelectorAll('main h2')) {
      h.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 300));
      const r = h.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) continue;
      out.push({
        texto: h.textContent.trim().slice(0, 34),
        tinta: getComputedStyle(h).color,
        fundo: {
          x: Math.max(2, Math.min(window.innerWidth - 3, Math.round(r.right + 24))),
          y: Math.round(r.top + r.height / 2),
        },
        scroll: window.scrollY,
      });
    }
    return out;
  });
  const contrastes = [];
  for (const t of textos) {
    await page.evaluate((y) => window.scrollTo(0, y), t.scroll);
    await page.waitForTimeout(250);
    const fundo = await pixel(page, t.fundo.x, t.fundo.y);
    contrastes.push({
      texto: t.texto,
      tinta: t.tinta,
      fundoComposto: fundo,
      contraste: contraste(t.tinta, fundo),
    });
  }

  await page.screenshot({
    path: `docs/capturas/sis292-fundo-tecnico-${largura}.png`,
    fullPage: true,
    animations: 'disabled',
  });

  resultado[`w${largura}`] = { inventario, fluxo, quadrados, contrastes, erros };
  await ctx.close();
}

/* MOVIMENTO REDUZIDO — os dois canais. */
for (const canal of ['media', 'preferencia']) {
  const { ctx, page, erros } = await abrir({
    largura: 1440,
    reduce: canal === 'media',
    preferencia: canal === 'preferencia' ? 'reduce' : null,
  });
  const atributo = await page.evaluate(() => document.documentElement.dataset.motion ?? null);
  await rampa(page);
  const d = await page.evaluate(() => {
    const ler = (sel) =>
      [...document.querySelectorAll(sel)].map((e) => {
        const cs = getComputedStyle(e);
        return { animacao: cs.animationName, opacidade: cs.opacity, traco: cs.stroke };
      });
    return {
      traco: ler('.matchai-circuito-pulso'),
      linhaBase: ler('.matchai-circuito-linha'),
      aceso: ler('.matchai-circuito-aceso'),
    };
  });
  resultado[`reduce-${canal}`] = {
    atributoNoHtml: atributo,
    tracosAnimando: d.traco.filter((t) => t.animacao !== 'none').length,
    tracosApagados: d.traco.filter((t) => Number(t.opacidade) === 0).length,
    totalDeTracos: d.traco.length,
    linhaBaseViva: d.linhaBase.every((l) => Number(l.opacidade) === 1),
    acesoAnimando: d.aceso.filter((a) => a.animacao !== 'none').length,
    acesoOpaco: d.aceso.every((a) => Number(a.opacidade) === 1),
    erros,
  };
  await ctx.close();
}

await navegador.close();
await writeFile('docs/medidas/sis292-fundo-tecnico.json', `${JSON.stringify(resultado, null, 2)}\n`);
console.log(JSON.stringify(resultado, null, 2));
