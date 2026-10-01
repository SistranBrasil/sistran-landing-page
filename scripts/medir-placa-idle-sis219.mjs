/**
 * SIS-219 — sonda da placa em repouso no tamanho do hover.
 *
 * POR QUE UMA SONDA NOVA, e não a da SIS-201
 * `scripts/medir-eco-hover-sis201.mjs` localizava cada card por
 * `.partner-terminal__card h3` — o `<h3>` saiu nesta issue, então ela não acha
 * card nenhum. E o critério dela («eco maior que a placa renderizada») virou o
 * oposto do pedido: a placa passou a TER o tamanho do hover. Reescrever era mais
 * honesto que afrouxar a antiga.
 *
 * OS CRITÉRIOS AQUI
 *  1. placa.bottom <= eyebrow.top em TODOS os cards — é o que prova que a placa
 *     maior não invadiu a copy. Mesmo critério da SIS-201: é a régua que não
 *     mudou.
 *  2. a altura renderizada da img da placa encosta na caixa do hover medida
 *     ANTES da mudança (193px no desktop, 107,5px a 390), com 2px de tolerância
 *     de arredondamento. Sem isto, «tamanho do hover» seria afirmação, não
 *     medida. A comparação usa o logo mais ALTO do conjunto — logo deitado bate
 *     no teto de largura antes de chegar ao de altura.
 *  3. nenhum `h3` dentro de `.partner-terminal__card`.
 *  4. exatamente 4 `a.partner-terminal__saiba-mais`, todos com `target=_blank`,
 *     `rel` com noopener e noreferrer, e alcançáveis por teclado (`focus()` e
 *     depois `document.activeElement`).
 *  5. as dezesseis placas com fundo branco calculado.
 *  6. sem barra horizontal em `documentElement` e sem erro de console.
 *  7. movimento reduzido: eco com `display: none` e a placa na MESMA caixa — o
 *     tamanho de repouso não pode depender de animação.
 *
 * Uso: URL_BASE=http://localhost:3000 node scripts/medir-placa-idle-sis219.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CAMINHO_PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const { chromium } = await import(CAMINHO_PLAYWRIGHT);

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const ROTA = '/parceiros-e-implementacoes';

/* A caixa do hover ANTES da mudança, medida na mesma máquina e nas mesmas
   larguras (eco-img: 9rem × 1,34 no desktop, 5,25rem × 1,28 a 390). É o alvo do
   critério 2 — número medido, não escolhido. */
const ALVO_ALTURA = { 1440: 193, 1280: 193, 768: 193, 390: 107.5 };

const CENARIOS = [
  { nome: '1440', largura: 1440, altura: 900 },
  { nome: '1280', largura: 1280, altura: 900 },
  { nome: '768', largura: 768, altura: 1024 },
  { nome: '390', largura: 390, altura: 844 },
  { nome: '1440-reduce', largura: 1440, altura: 900, reduzido: true },
];

const n = (v) => Number(v.toFixed(1));

async function medirCenario(nav, cenario) {
  const ctx = await nav.newContext({
    viewport: { width: cenario.largura, height: cenario.altura },
    deviceScaleFactor: 1,
    ...(cenario.reduzido ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));

  const erros = [];
  const pag = await ctx.newPage();
  pag.on('console', (m) => {
    if (m.type() === 'error') erros.push(m.text());
  });
  pag.on('pageerror', (e) => erros.push(String(e)));

  await pag.goto(`${URL_BASE}${ROTA}`, { waitUntil: 'load', timeout: 120000 });
  await pag.waitForSelector('.partner-terminal__card', { timeout: 120000 });
  await pag.locator('.partner-terminal__card').first().scrollIntoViewIfNeeded();
  await pag.waitForTimeout(2000);

  const medida = await pag.evaluate(() => {
    const cx = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        w: +b.width.toFixed(1),
        h: +b.height.toFixed(1),
        top: +b.top.toFixed(1),
        bottom: +b.bottom.toFixed(1),
      };
    };

    const cards = [...document.querySelectorAll('.partner-terminal__card')].map((card) => {
      const placa = card.querySelector('.partner-terminal__placa');
      const eco = card.querySelector('.partner-terminal__eco');
      const cta = card.querySelector('a.partner-terminal__saiba-mais');
      return {
        alt: card.querySelector('.partner-terminal__placa-img')?.getAttribute('alt') ?? null,
        placa: cx(placa),
        img: cx(card.querySelector('.partner-terminal__placa-img')),
        eyebrow: cx(card.querySelector('.partner-terminal__eyebrow')),
        fundoPlaca: placa ? getComputedStyle(placa).backgroundColor : null,
        ecoDisplay: eco ? getComputedStyle(eco).display : 'ausente',
        temH3: Boolean(card.querySelector('h3')),
        cta: cta
          ? {
              href: cta.getAttribute('href'),
              target: cta.getAttribute('target'),
              rel: cta.getAttribute('rel'),
              rotulo: cta.getAttribute('aria-label'),
            }
          : null,
      };
    });

    /* Teclado: focar cada CTA e conferir que ele virou o elemento ativo. */
    const ctas = [...document.querySelectorAll('a.partner-terminal__saiba-mais')];
    const focaveis = ctas.filter((a) => {
      a.focus();
      return document.activeElement === a;
    }).length;

    const raiz = document.documentElement;
    return {
      cards,
      ctasNoDom: ctas.length,
      ctasFocaveis: focaveis,
      overflowX: +(raiz.scrollWidth - raiz.clientWidth).toFixed(1),
    };
  });

  await ctx.close();
  return { ...medida, erros };
}

const nav = await chromium.launch();
const relatorio = {};
let reprovas = 0;

for (const cenario of CENARIOS) {
  const m = await medirCenario(nav, cenario);
  const alvo = ALVO_ALTURA[cenario.largura];
  const comPlaca = m.cards.filter((c) => c.placa && c.img);

  const invadem = comPlaca.filter((c) => c.eyebrow && c.placa.bottom > c.eyebrow.top);
  const alturaMax = Math.max(...comPlaca.map((c) => c.img.h));
  const naAltura = Math.abs(alturaMax - alvo) <= 2;
  const comH3 = m.cards.filter((c) => c.temH3).length;
  const ctasOk =
    m.ctasNoDom === 4 &&
    m.ctasFocaveis === 4 &&
    comPlaca.every(
      (c) =>
        !c.cta ||
        (c.cta.target === '_blank' &&
          c.cta.rel?.includes('noopener') &&
          c.cta.rel?.includes('noreferrer') &&
          c.cta.href?.startsWith('https://partners.amazonaws.com/')),
    );
  const brancas = comPlaca.filter((c) => c.fundoPlaca === 'rgb(255, 255, 255)').length;
  const ecoOculto = cenario.reduzido
    ? m.cards.every((c) => c.ecoDisplay === 'none' || c.ecoDisplay === 'ausente')
    : true;

  const folga = n(
    Math.min(...comPlaca.filter((c) => c.eyebrow).map((c) => c.eyebrow.top - c.placa.bottom)),
  );

  const passou =
    invadem.length === 0 &&
    naAltura &&
    comH3 === 0 &&
    ctasOk &&
    brancas === comPlaca.length &&
    m.overflowX === 0 &&
    m.erros.length === 0 &&
    ecoOculto;
  if (!passou) reprovas += 1;

  relatorio[cenario.nome] = {
    cards: m.cards.length,
    comPlaca: comPlaca.length,
    placasBrancas: brancas,
    alturaImgMax: n(alturaMax),
    alturaAlvoHover: alvo,
    larguraImgMax: n(Math.max(...comPlaca.map((c) => c.img.w))),
    folgaMinimaPlacaEyebrow: folga,
    invademCopy: invadem.map((c) => c.alt),
    cardsComH3: comH3,
    ctasNoDom: m.ctasNoDom,
    ctasFocaveisPorTeclado: m.ctasFocaveis,
    ctasComAlvoERel: ctasOk,
    ecoDisplay: [...new Set(m.cards.map((c) => c.ecoDisplay))],
    overflowX: m.overflowX,
    errosConsole: m.erros,
    veredito: passou ? 'PASSOU' : 'REPROVOU',
  };

  console.log(
    `${cenario.nome.padEnd(12)} img ${n(alturaMax)}px (alvo ${alvo}) · brancas ${brancas}/${comPlaca.length} · ` +
      `folga ${folga}px · h3 ${comH3} · ctas ${m.ctasNoDom}/${m.ctasFocaveis} · ` +
      `overflowX ${m.overflowX} · erros ${m.erros.length} · ${passou ? 'PASSOU' : 'REPROVOU'}`,
  );
}

await nav.close();
await mkdir(resolve(RAIZ, 'docs/medidas'), { recursive: true });
await writeFile(
  resolve(RAIZ, 'docs/medidas/placa-idle-sis219.json'),
  `${JSON.stringify({ url: `${URL_BASE}${ROTA}`, em: new Date().toISOString(), relatorio }, null, 2)}\n`,
);
console.log(
  `\n${reprovas === 0 ? 'todos os cenários passaram' : `${reprovas} cenário(s) reprovaram`}`,
);
process.exitCode = reprovas === 0 ? 0 : 1;
