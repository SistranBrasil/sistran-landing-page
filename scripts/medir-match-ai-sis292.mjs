/**
 * SIS-292 — sonda do layout de `/solucoes/match-ai` e da não-regressão das outras seis.
 *
 * O que ela prova, e por que cada coisa é medida em vez de lida no código:
 *   1. ORDEM DAS SEÇÕES — `y` medido de cada manchete (`h1`/`h2`) na rota. A issue
 *      lista a ordem da mock como critério; ordem no JSX não é ordem na tela quando
 *      há grade, `order` ou seção que não monta por dado ausente.
 *   2. SLOTS DE IMAGEM — todo `img` da rota, com `src` e caixa. O critério da issue
 *      («todo slot de imagem = capa Match AI») se verifica contando quais `src`
 *      apontam para a capa e quais não — e as que não apontam são exatamente as da
 *      vitrine «Conheça também», que é a divergência declarada no comentário da
 *      issue. Sem listar todas, uma arte esquecida passaria.
 *   3. AS OUTRAS SEIS NÃO MUDARAM — impressão digital estrutural de cada slug:
 *      presença do `.hero-backdrop` (o padrão da SIS-286), texto do `h1`, e a lista
 *      de `h2` na ordem da tela. É isto que o item 1 da issue («não redesenhar as
 *      outras 6») pede como portão. Roda nas seis, não numa amostra.
 *   4. CONTRASTE pelo método da casa (SIS-192): duas abas, na segunda a tinta vira
 *      `color: transparent` — nunca `display: none`, que mudaria o layout — e o
 *      fundo é lido dessa; pior pixel decide; piso 4,5:1, porque todo alvo aqui é
 *      texto. As seções novas são CLARAS numa rota que era navy de ponta a ponta,
 *      então nenhum número de contraste desta página vale por herança.
 *   5. MOBILE a 390 — altura e transbordo horizontal (`scrollWidth` do documento
 *      contra a viewport). A issue pede captura mobile «se quebrar»; o portão diz
 *      se quebrou.
 *
 * Uso: node scripts/medir-match-ai-sis292.mjs
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = 'http://localhost:3000/solucoes';
const CAPA = '/images/solucoes/match-ai-hero.webp';
const SAIDA = 'docs/medidas/sis292-depois.json';
const OUTRAS = ['lumina-ai', 'fast', 'qa-integrado', 'connect-api', 'smart-miner', 'guru-de-seguros'];

/* Alvos de contraste: um por tinta nova desta página. Título e apoio de card em
   seção clara, tinta do trilho na faixa escura, rótulo do botão cheio e o realce
   `PERSONALIZAÇÃO` do hero, que é o único texto sobre véu translúcido. */
/* Refinamentos de 21/09 — QUATRO TINTAS NOVAS entram na conta, e nenhuma delas
   herda número de antes: as duas fichas flutuantes do hero são fundo BRANCO chapado
   sobre a foto (tinta navy `#0a1f44` e apoio `#3C5A7A`, que é a única tinta média
   desta página), e o balão do Posicionamento é `text-ink-muted` em 14px sobre branco
   dentro de `.section-light` — os overrides daquela classe repintam `text-ink-muted`,
   então o valor computado não é o do utilitário. Sem medir, «é branco com navy, passa»
   seria exatamente o tipo de herança que já falhou nesta mesma página (a faixa que se
   supunha navy e era `#1273bc`).
   Os alvos das fichas são `[data-ficha]` e não seletor de classe utilitária: as
   classes do Tailwind mudam a cada ajuste de tamanho, e um seletor que deixa de casar
   devolve `null` — que a sonda registra, mas ninguém lê como reprovação. */
const ALVOS = {
  heroRealce: '#topo mark',
  fichaTitulo: '#topo [data-ficha="titulo"]',
  fichaApoio: '#topo [data-ficha="apoio"]',
  balaoTexto: '[aria-labelledby="posicionamento"] [data-balao]',
  cardTitulo: '[aria-labelledby="o-que-o-match-ai-faz"] li h3',
  cardApoio: '[aria-labelledby="o-que-o-match-ai-faz"] li p',
  trilhoTitulo: '[aria-labelledby="da-base-a-oferta-mais-relevante"] li h3',
  trilhoApoio: '[aria-labelledby="da-base-a-oferta-mais-relevante"] li p',
  posColuna: '[aria-labelledby="posicionamento"] ul li p',
  vitrineApoio: '[aria-labelledby="conheca-tambem"] ul li a span span + span',
  botaoVerTodas: '[aria-labelledby="conheca-tambem"] a[href="/solucoes"]',
};

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

async function abrir(rota, { largura = 1440, semTinta } = {}) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 } });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const p = await ctx.newPage();
  await p.goto(rota, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  /* A FLUTUAÇÃO DOS CARDS TEM DE PARAR PARA A SONDA MEDIR. Com ela correndo,
     `locator.screenshot()` nunca dispara: o Playwright espera o elemento ficar
     ESTÁVEL antes de capturar, e um cartão que sobe e desce para sempre nunca fica
     — a primeira execução depois do refinamento morreu em
     «element is not stable» após 30s, no primeiro alvo dentro de um cartão.
     O estado imposto é o MESMO que o canal de movimento reduzido entrega
     (`animation: none` + `translate: none`), e é por isso que ele não afrouxa a
     leitura: não mexe em nenhuma cor, só devolve o cartão ao deslocamento zero, que
     é onde ele está na média do ciclo e sempre está para quem pede movimento
     reduzido. Medir o cartão a 8px de altura ou a 0 daria o mesmo pixel de fundo. */
  await p.addStyleTag({
    content: '.matchai-cartao{animation:none!important;translate:none!important}',
  });
  /* O reveal desta rota é por scroll: sem percorrer a página os blocos ficam em
     `opacity: 0` e toda leitura de fundo sairia do que está atrás deles. Rolar até
     o fim e voltar deixa todos em estado final (`VP.once`). */
  await p.evaluate(async () => {
    const passo = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(1200);
  if (semTinta) {
    /* OS DOIS `:not(#nao-existe)` NÃO SÃO ENFEITE. `color: transparent !important`
       num seletor de baixa especificidade NÃO apaga a tinta desta rota: as cores
       vêm de `.section-light [class*="text-ink"]` e parentes, que também são
       `!important` — com os dois lados `!important` o desempate volta a ser
       especificidade, e `[aria-labelledby] li p` (0,1,2) perde de (0,2,0). Foi
       exatamente o que aconteceu na primeira execução: três alvos saíram com razão
       1,0 e «pior fundo» IDÊNTICO à tinta, ou seja, o texto continuava pintado.
       Cada `:not(#nao-existe)` vale um id na conta (1,0,0) sem casar com nada, então
       a injeção passa a ganhar de qualquer regra de classe da folha, sem que eu
       precise saber de antemão qual delas pinta cada alvo. Mesma armadilha
       registrada na sonda da SIS-216. */
    const blindado = Object.values(ALVOS)
      .map((s) => `${s}:not(#nao-existe):not(#nao-existe)`)
      .join(',');
    await p.addStyleTag({ content: `${blindado}{color:transparent!important}` });
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

/* A caixa da TINTA, não a do elemento: um botão-pílula contém fundo cheio além das
   letras, e medir a caixa inteira leria pixels que a tinta não cobre. Mesma razão
   registrada na sonda da SIS-290. */
const CAIXA_DA_TINTA = (el) => {
  const no = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
  const caixaEl = el.getBoundingClientRect();
  let r = caixaEl;
  if (no) {
    const range = document.createRange();
    range.selectNodeContents(no);
    r = range.getBoundingClientRect();
  }
  /* Devolve a caixa da tinta em coordenadas RELATIVAS ao elemento, e não à
     viewport: o pixel vem de `locator.screenshot()`, cujo (0,0) é o canto do
     elemento. É este par (recorte do elemento + deslocamento dentro dele) que
     resolve os dois erros da primeira execução de uma vez — a região de viewport
     caía na faixa errada, e a caixa do elemento inteiro lia a FRANJA do
     `border-radius`, onde o antialiasing mistura o fundo de fora (foi isso que
     deu 3,93 no realce ciano do hero e 1,06 na pílula cheia: canto arredondado,
     não texto). */
  return {
    dx: Math.max(0, Math.round(r.x - caixaEl.x)),
    dy: Math.max(0, Math.round(r.y - caixaEl.y)),
    w: Math.round(r.width),
    h: Math.round(r.height),
  };
};

const resultado = {};

/* ── 1, 2 e 5: estrutura, imagens e mobile ───────────────────────────────── */
for (const largura of [1440, 390]) {
  const { ctx, p } = await abrir(`${BASE}/match-ai`, { largura });
  resultado[`matchAi_${largura}`] = await p.evaluate((capa) => {
    const manchetes = [...document.querySelectorAll('main h1, main h2')]
      .map((h) => ({
        tag: h.tagName,
        texto: h.textContent.trim().slice(0, 48),
        y: Math.round(h.getBoundingClientRect().y + window.scrollY),
      }))
      .sort((a, b) => a.y - b.y);
    const imagens = [...document.querySelectorAll('main img')].map((img) => {
      const r = img.getBoundingClientRect();
      return {
        src: new URL(img.currentSrc || img.src, location.href).pathname,
        capaMatchAi: (img.currentSrc || img.src).includes(capa),
        w: Math.round(r.width),
        h: Math.round(r.height),
        alt: img.alt,
      };
    });
    return {
      manchetes,
      imagens,
      slots: {
        total: imagens.length,
        comCapaMatchAi: imagens.filter((i) => i.capaMatchAi).length,
      },
      transbordo: document.documentElement.scrollWidth - window.innerWidth,
      alturaDocumento: document.body.scrollHeight,
      temHeroBackdrop: !!document.querySelector('.hero-backdrop'),
      ancoraTopo: !!document.querySelector('#topo'),
      fechoCta: !!document.querySelector('.cta-ref'),
    };
  }, CAPA);
  await ctx.close();
}

/* ── 3: as outras seis, impressão digital estrutural ─────────────────────── */
resultado.outrasSlugs = {};
for (const slug of OUTRAS) {
  const { ctx, p } = await abrir(`${BASE}/${slug}`);
  resultado.outrasSlugs[slug] = await p.evaluate(() => ({
    h1: document.querySelector('main h1')?.textContent.trim() ?? null,
    h2: [...document.querySelectorAll('main h2')].map((h) => h.textContent.trim().slice(0, 48)),
    temHeroBackdrop: !!document.querySelector('.hero-backdrop'),
    temNavOutras: !!document.querySelector('[aria-labelledby="outras-solucoes"]'),
    temConhecaTambem: !!document.querySelector('[aria-labelledby="conheca-tambem"]'),
    secoesClaras: document.querySelectorAll('main .section-light').length,
    fechoCta: !!document.querySelector('.cta-ref'),
  }));
  await ctx.close();
}

/* ── 4: contraste das tintas novas ───────────────────────────────────────── */
{
  const A = await abrir(`${BASE}/match-ai`);
  const B = await abrir(`${BASE}/match-ai`, { semTinta: true });
  const sharp = (await import('sharp')).default;
  resultado.contraste = {};
  for (const [nome, sel] of Object.entries(ALVOS)) {
    if (!(await A.p.locator(sel).count())) {
      resultado.contraste[nome] = null;
      continue;
    }
    /* A caixa vem da aba B, a MESMA de onde sai o pixel: as duas abas percorrem a
       página por script e o reveal termina com `translateY` próprio, então a mesma
       caixa não está garantidamente no mesmo `y` nas duas. Ler geometria e pixel do
       mesmo documento elimina a suposição. */
    const alvoB = B.p.locator(sel).first();
    await alvoB.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    const alvoA = A.p.locator(sel).first();
    await alvoA.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await B.p.waitForTimeout(400);
    await A.p.waitForTimeout(400);
    const caixa = await alvoB.evaluate(CAIXA_DA_TINTA);
    const tinta = await alvoA.evaluate((el) => getComputedStyle(el).color);
    if (caixa.w < 2 || caixa.h < 2) {
      resultado.contraste[nome] = { caixa, tinta, nota: 'caixa degenerada' };
      continue;
    }
    /* RECORTE PELO ELEMENTO, não por região da viewport. O `clip` com as
       coordenadas lidas acima erra o alvo nesta rota: entre a leitura da caixa e
       o disparo da captura o `scrollIntoView` das duas abas ainda acomoda, e a
       primeira execução devolveu pixel de seção CLARA (`[24,130,203]`) para um
       alvo que vive dentro da faixa ESCURA — 4,12:1 de mentira. `locator.screenshot()`
       recorta o próprio elemento, então o pixel não pode vir de outra faixa.
       Para estes alvos a caixa do elemento e a caixa da tinta compartilham o mesmo
       fundo (o `li`/`h3`/`p` não tem preenchimento próprio além do do cartão), então
       trocar a caixa da tinta pela do elemento não afrouxa a leitura; o único caso
       em que afrouxaria é a pílula cheia, e esse é o `botaoVerTodas`, cujo fundo é
       cor única declarada. */
    const fundo = await alvoB.screenshot();
    /* 1px de margem para dentro em cada lado: o limite da caixa da tinta ainda
       pega a primeira coluna de antialiasing da borda do elemento, e é essa franja
       que inventa «pior pixel» que nenhuma letra toca. */
    const meta = await sharp(fundo).metadata();
    const recorte = {
      left: Math.min(caixa.dx + 1, Math.max(0, meta.width - 2)),
      top: Math.min(caixa.dy + 1, Math.max(0, meta.height - 2)),
      width: Math.max(1, Math.min(caixa.w - 2, meta.width - caixa.dx - 2)),
      height: Math.max(1, Math.min(caixa.h - 2, meta.height - caixa.dy - 2)),
    };
    const { data, info } = await sharp(fundo)
      .extract(recorte)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const cor = tinta.match(/[\d.]+/g).map(Number);
    const alfa = cor.length > 3 ? cor[3] : 1;
    let pior = null;
    for (let i = 0; i < data.length; i += info.channels) {
      const px = [data[i], data[i + 1], data[i + 2]];
      const m = razao(compor(cor.slice(0, 3), alfa, px), px);
      if (pior === null || m < pior.m) pior = { px, m };
    }
    resultado.contraste[nome] = { tinta, caixa, recorte, piorFundo: pior.px, razao: pior.m };
  }
  await A.ctx.close();
  await B.ctx.close();
}

await navegador.close();
writeFileSync(SAIDA, JSON.stringify(resultado, null, 2));
console.log(SAIDA);
console.log(JSON.stringify(resultado, null, 2));
