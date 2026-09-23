/**
 * SIS-216 — sonda dos três pedidos: azul `#1273bc`, logo sem eco no hover e float idle.
 *
 * O que ela prova, e por que cada coisa é medida e não lida no CSS:
 *   1. AZUL — lê `border-color`, `box-shadow` e o par borda/fundo do CTA no estado
 *      computado. `rgb(18, 115, 188)` é `#1273bc`; qualquer `14, 216, 246` que
 *      sobrasse aparece aqui. Também varre a seção inteira procurando ciano em
 *      qualquer propriedade de cor, porque o item 1 pede a troca «em borda, CTA,
 *      sombras/halos e acentos» — e uma tinta esquecida num nó que eu não listei
 *      passaria por um portão que só olha os alvos.
 *   2. LOGO SEM DUPLICATA — conta os `<img>` dentro de `.accel-logo` (tem de ser 1)
 *      e grava o `transform` da arte em repouso e no hover. Contar nós é o portão
 *      certo: um eco escondido por CSS daria «sem duplicata visível» e ainda estaria
 *      no documento.
 *   3. FLOAT — `animation-name` do `.accel-item` nos três canais (normal, mídia de
 *      reduce, atributo `data-motion`), mais o `transform` do `.accel-card` no hover,
 *      que é a prova de que os −6px NÃO foram engolidos pela animação: é para isso
 *      que o float mora no item e o hover no card.
 *   4. CONTRASTE do rótulo do CTA no HOVER, pelo método da casa (SIS-192): duas abas,
 *      na segunda a tinta vira `color: transparent` e o fundo é lido dessa; pior
 *      pixel decide; piso 4,5:1. Este é o número que a troca de cor pôs em risco —
 *      `#1273bc` é escuro onde o ciano era claro, e a tinta do rótulo teve de virar.
 *      A caixa vem de um `Range` sobre o nó de texto, e não do botão, pela razão
 *      registrada na sonda da SIS-290.
 *
 * Uso: node scripts/medir-cards-azul-sis216.mjs
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const ROTA = 'http://localhost:3000/solucoes';
const SAIDA = 'docs/medidas/sis216-azul-depois.json';

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

/* O FLOAT QUEBRA A ACIONABILIDADE DO PLAYWRIGHT, e isto é achado da sonda, não
   contorno cosmético: `scrollIntoViewIfNeeded`, `click` e `hover` esperam o alvo
   ficar ESTÁVEL (duas leituras iguais de caixa em quadros consecutivos), e um
   elemento que se move para sempre nunca fica. A chamada estoura em 30s com
   «element is not stable». Por isso aqui o scroll é por `scrollIntoView` no DOM e o
   hover é `{ force: true }`, que pula a verificação. Vale para qualquer sonda futura
   desta seção — e é o motivo de eu ter reexecutado a sonda de cards da SIS-216
   antiga para conferir que ela não dependia dessas esperas. */
async function hoverForcado(p, seletor) {
  await p.locator(seletor).hover({ force: true });
}

async function abrir({ largura = 1440, canal, motion = 'full', semTinta, semFloat } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    ...(canal === 'midia' ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript((pref) => {
    localStorage.setItem('sistran-motion-preference', pref);
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  }, motion);
  const p = await ctx.newPage();
  await p.goto(ROTA, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  /* O reveal desta seção é por scroll: sem chegar nela os cards ficam em
     `opacity: 0` e toda leitura de fundo sairia do que está atrás. */
  await p.locator('.accel-item').first().evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(1500);
  if (semFloat) {
    /* A MEDIÇÃO DE CONTRASTE PRECISA DAS DUAS ABAS EM FASE: o método da casa lê a
       caixa numa aba e o pixel na outra, e o float não está sincronizado entre elas
       — até 4px de defasagem faria o recorte cair meia linha acima do rótulo. O
       float não é o que está sob teste aqui (ele tem portão próprio, com o
       `animation-name` e a amplitude medidos acima), então as duas abas o congelam
       do mesmo jeito. */
    await p.addStyleTag({ content: '.accel-item{animation:none!important}' });
  }
  if (semTinta) {
    /* O SELETOR TEM DE SER O DE QUATRO CLASSES. `.accel-card__cta{color:transparent
       !important}` NÃO apaga a tinta: a cor do hover mora em
       `.section-light .accel-card.on-dark:hover .accel-card__cta` (0,4,0) e também é
       `!important` — com os dois lados `!important` o desempate volta a ser
       especificidade, e 0,1,0 perde. Foi exatamente o que aconteceu na primeira
       execução: o recorte mostrava as letras brancas ainda pintadas e a razão saía
       1,0 (branco contra branco). Aqui o seletor empata em 0,4,0 e ganha por vir
       depois na ordem de fonte. É a MESMA armadilha que o comentário de
       `.accel-card__cta` no CSS documenta — só que agora do lado da sonda. */
    await p.addStyleTag({
      content:
        '.section-light .accel-card.on-dark .accel-card__cta,' +
        '.section-light .accel-card.on-dark:hover .accel-card__cta' +
        '{color:transparent!important}',
    });
  }
  return { ctx, p };
}

const lum = ([r, g, b]) => {
  const f = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
const compor = (tinta, alfa, fundo) =>
  tinta.map((c, i) => Math.round(c * alfa + fundo[i] * (1 - alfa)));

const resultado = {};

/* ── 1 e 2: tintas e nós, no estado de repouso e no de hover ─────────────── */
{
  const { ctx, p } = await abrir({});
  const card = p.locator('.accel-item--destaque .accel-card');

  const leituras = async () =>
    card.evaluate((el) => {
      const cs = getComputedStyle(el);
      const cta = el.querySelector('.accel-card__cta');
      const csCta = getComputedStyle(cta);
      const logo = el.querySelector('.accel-logo__img');
      return {
        card: { borderColor: cs.borderTopColor, boxShadow: cs.boxShadow, transform: cs.transform },
        cta: {
          borderColor: csCta.borderTopColor,
          background: csCta.backgroundColor,
          color: csCta.color,
        },
        logo: {
          imgs: el.querySelectorAll('.accel-logo img').length,
          transform: getComputedStyle(logo).transform,
          placa: getComputedStyle(el.querySelector('.accel-logo')).transform,
        },
        item: getComputedStyle(el.closest('.accel-item')).animationName,
      };
    });

  resultado.repouso = await leituras();
  await hoverForcado(p, '.accel-item--destaque .accel-card');
  await p.waitForTimeout(900);
  resultado.hover = await leituras();

  /* Varredura por ciano remanescente em QUALQUER nó da seção. */
  resultado.cianoRemanescente = await p.evaluate(() => {
    const achados = [];
    const secao = document.querySelector('.accel-item').closest('section');
    for (const el of secao.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      for (const prop of [
        'color',
        'backgroundColor',
        'backgroundImage',
        'borderTopColor',
        'borderRightColor',
        'borderBottomColor',
        'borderLeftColor',
        'boxShadow',
        'filter',
        'outlineColor',
      ]) {
        const v = cs[prop];
        if (/14,\s*216,\s*246|0ed8f6/i.test(v)) {
          achados.push({ classe: el.className?.toString?.().slice(0, 60), prop, valor: v });
        }
      }
    }
    return achados;
  });

  /* Amplitude do float: o `transform` do item ao longo de uma volta. */
  resultado.floatAmostras = await p.evaluate(async () => {
    const item = document.querySelector('.accel-item');
    const ys = [];
    for (let i = 0; i < 24; i += 1) {
      const m = new DOMMatrixReadOnly(getComputedStyle(item).transform);
      ys.push(Math.round(m.f * 100) / 100);
      await new Promise((r) => setTimeout(r, 250));
    }
    return { min: Math.min(...ys), max: Math.max(...ys), amostras: ys };
  });

  await ctx.close();
}

/* ── 3: os dois canais de movimento reduzido ─────────────────────────────── */
for (const [nome, opcoes] of [
  ['midia', { canal: 'midia' }],
  ['atributo', { motion: 'reduce' }],
]) {
  const { ctx, p } = await abrir(opcoes);
  const card = p.locator('.accel-item--destaque .accel-card');
  await hoverForcado(p, '.accel-item--destaque .accel-card');
  await p.waitForTimeout(700);
  resultado[`reduce_${nome}`] = await card.evaluate((el) => {
    const item = el.closest('.accel-item');
    return {
      dataMotion: document.documentElement.dataset.motion ?? null,
      itemAnimation: getComputedStyle(item).animationName,
      itemTransform: getComputedStyle(item).transform,
      cardTransform: getComputedStyle(el).transform,
      logoTransform: getComputedStyle(el.querySelector('.accel-logo__img')).transform,
      ctaFundo: getComputedStyle(el.querySelector('.accel-card__cta')).backgroundColor,
    };
  });
  await ctx.close();
}

/* ── 4: contraste do rótulo do CTA no hover ──────────────────────────────── */
{
  const A = await abrir({ semFloat: true });
  const B = await abrir({ semFloat: true, semTinta: true });
  const alvo = '.accel-item--destaque .accel-card__cta';
  for (const { p } of [A, B]) {
    await hoverForcado(p, '.accel-item--destaque .accel-card');
    await p.waitForTimeout(900);
  }
  /* A CAIXA VEM DA ABA B, a mesma de onde sai o pixel. Na primeira versão ela vinha
     de A e o recorte caía no branco da seção: as duas abas rolam por `scrollIntoView`
     e o reveal desta seção termina com um `translateY` próprio, então a MESMA caixa
     não está no mesmo lugar da viewport nas duas. Ler geometria e pixel do mesmo
     documento elimina a suposição; a tinta continua vindo de A, que é a única coisa
     que muda entre as abas. */
  const caixa = await B.p.locator(alvo).evaluate((el) => {
    const no = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
    let r = el.getBoundingClientRect();
    if (no) {
      const range = document.createRange();
      range.selectNodeContents(no);
      r = range.getBoundingClientRect();
    }
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  });
  const tinta = await A.p.locator(alvo).evaluate((el) => getComputedStyle(el).color);
  const clipe = { x: caixa.x, y: caixa.y, width: caixa.w, height: caixa.h };
  const fundo = await B.p.screenshot({ clip: clipe });
  writeFileSync('docs/capturas/sis216-cta-hover-fundo.png', fundo);
  const sharp = (await import('sharp')).default;
  const { data, info } = await sharp(fundo).raw().toBuffer({ resolveWithObject: true });
  const cor = tinta.match(/[\d.]+/g).map(Number);
  const alfa = cor.length > 3 ? cor[3] : 1;
  let pior = null;
  for (let i = 0; i < data.length; i += info.channels) {
    const px = [data[i], data[i + 1], data[i + 2]];
    const m = razao(compor(cor.slice(0, 3), alfa, px), px);
    if (pior === null || m < pior.m) pior = { px, m };
  }
  resultado.contrasteCtaHover = { caixa, tinta, piorFundo: pior.px, razao: pior.m };
  await A.ctx.close();
  await B.ctx.close();
}

await navegador.close();
writeFileSync(SAIDA, JSON.stringify(resultado, null, 2));
console.log(SAIDA);
console.log(JSON.stringify(resultado, null, 2));
