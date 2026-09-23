/**
 * SIS-290 — sonda do estilo mobile do «Fale com a Gente!» (`layoutReferencia`).
 *
 * Mede TRÊS larguras e não duas, e a do meio é a que importa: o override de desktop
 * deste componente começa em `min-width: 1024px`, então a faixa 768–1023 renderiza as
 * regras BASE. Para o critério da issue («≥ 768 idêntico ao de hoje») essa faixa é
 * desktop tanto quanto 1440. Sem 768 na lista, um bloco mobile escrito na base daria
 * verde aqui e teria mudado o tablet — é o mesmo tipo de portão cego que a SIS-286
 * pagou quando o tablet não era alvo.
 *
 * O que ela prova:
 *   1. ORDEM VISUAL a 390: arte acima, texto no meio, botão no fim (`offsetTop`
 *      medido, não inferido do `order`).
 *   2. O rótulo «CONTATO» existe a 390 e NÃO existe a 768 nem a 1440.
 *   3. CONTRASTE pelo método da casa (SIS-192): duas abas, na segunda a tinta vira
 *      `color: transparent` (nunca `display: none`, que mudaria o layout) e o fundo é
 *      lido dessa. Piso 4,5:1 — todo alvo aqui é texto.
 *   4. Que a 768 e a 1440 a caixa de cada peça é a MESMA de antes da issue: a sonda
 *      grava as caixas e o `--antes` serve para comparar contra o depois.
 *
 * Uso: node scripts/medir-cta-mobile-sis290.mjs [--antes]
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const ROTA = 'http://localhost:3000/esg';
const LARGURAS = [390, 768, 1440];
const ANTES = process.argv.includes('--antes');
const SAIDA = `docs/medidas/sis290-${ANTES ? 'antes' : 'depois'}.json`;

const ALVOS = {
  rotulo: '.cta-ref-rotulo',
  titulo: '.cta-ref-titulo',
  texto: '.cta-ref-texto',
  botao: '.cta-ref-botao',
};

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

async function abrir(largura, { semTinta } = {}) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 } });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const p = await ctx.newPage();
  await p.goto(ROTA, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  /* O reveal desta rota é por scroll: sem chegar no bloco, ele fica em `opacity: 0`
     e toda leitura de fundo sairia do que está atrás dele. */
  await p.locator('.cta-ref').scrollIntoViewIfNeeded();
  await p.waitForTimeout(1400);
  if (semTinta) {
    await p.addStyleTag({
      content: `${Object.values(ALVOS).join(',')}{color:transparent!important}`,
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
/* Tinta translúcida compõe sobre o fundo antes de virar razão. */
const compor = (tinta, alfa, fundo) => tinta.map((c, i) => Math.round(c * alfa + fundo[i] * (1 - alfa)));

const resultado = {};

for (const largura of LARGURAS) {
  const A = await abrir(largura);
  const B = await abrir(largura, { semTinta: true });

  const caixas = {};
  const tintas = {};
  for (const [nome, sel] of Object.entries(ALVOS)) {
    const n = await A.p.locator(sel).count();
    if (!n) {
      caixas[nome] = null;
      continue;
    }
    caixas[nome] = await A.p.locator(sel).first().evaluate((el) => {
      /* A CAIXA DO BOTÃO NÃO É A CAIXA DA TINTA: a pílula contém o disco ciano da
         seta, e medir contraste na caixa inteira lê o fundo do disco contra a cor do
         RÓTULO, que não está lá. Dava 3,35:1 a 1440 na linha de base — número de uma
         combinação que não existe na tela. Com um `Range` sobre o nó de texto, a
         caixa é a das letras. (A seta em si é ícone redundante: o caso está medido e
         assumido na nota de `.cta-ref-botao-circulo`.) */
      const texto = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
      let r = el.getBoundingClientRect();
      if (texto) {
        const range = document.createRange();
        range.selectNodeContents(texto);
        r = range.getBoundingClientRect();
      }
      const cs = getComputedStyle(el);
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
        display: cs.display,
        fontSize: cs.fontSize,
      };
    });
    tintas[nome] = await A.p.locator(sel).first().evaluate((el) => getComputedStyle(el).color);
  }

  /* Ordem visual: `offsetTop` de cada peça dentro do palco. */
  const ordem = await A.p.evaluate(() => {
    const y = (s) => {
      const el = document.querySelector(s);
      return el ? Math.round(el.getBoundingClientRect().y) : null;
    };
    return { fio: y('.cta-ref-fio'), arte: y('.cta-ref-arte'), cartao: y('.cta-ref-cartao'), botao: y('.cta-ref-botao') };
  });

  /* Contraste: pixel a pixel na caixa da tinta, lendo o fundo da aba sem tinta. */
  const contrastes = {};
  for (const [nome, caixa] of Object.entries(caixas)) {
    if (!caixa || caixa.w < 2 || caixa.h < 2) continue;
    const clipe = { x: caixa.x, y: caixa.y, width: caixa.w, height: caixa.h };
    const fundo = await B.p.screenshot({ clip: clipe });
    /* `sharp` lê o PNG cru; o PIOR PIXEL do fundo é o que decide, e «pior» aqui é o
       que dá a MENOR razão contra a tinta composta sobre ele — não o mais claro nem o
       mais escuro em absoluto, porque a tinta translúcida muda junto com o fundo. */
    const sharp = (await import('sharp')).default;
    const { data, info } = await sharp(fundo).raw().toBuffer({ resolveWithObject: true });
    const cor = tintas[nome].match(/[\d.]+/g).map(Number);
    const alfa = cor.length > 3 ? cor[3] : 1;
    let pior = null;
    for (let i = 0; i < data.length; i += info.channels) {
      const px = [data[i], data[i + 1], data[i + 2]];
      const m = razao(compor(cor.slice(0, 3), alfa, px), px);
      if (pior === null || m < pior.m) pior = { px, m };
    }
    contrastes[nome] = { tinta: tintas[nome], piorFundo: pior.px, razao: pior.m };
  }

  resultado[largura] = { caixas, ordem, contrastes };
  await A.ctx.close();
  await B.ctx.close();
}

await navegador.close();
writeFileSync(SAIDA, JSON.stringify(resultado, null, 2));
console.log(SAIDA);
console.log(JSON.stringify(resultado, null, 2));
