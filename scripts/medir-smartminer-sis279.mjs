/**
 * SIS-279 — `/solucoes/smart-miner` medida na rota viva.
 *
 * Os portões são os critérios da issue, um a um:
 *
 *  1. MESMA ARQUITETURA DE SEÇÕES do Match AI: as faixas de primeiro nível da rota,
 *     com id/âncora e tom, conferidas contra as da `/solucoes/match-ai` medida no
 *     mesmo passe — arquitetura igual é contagem e sequência iguais, não parecença.
 *  2. IDENTIDADE PRÓPRIA: nenhum nó `matchai-*` nesta rota e nenhum `smartminer-*`
 *     na outra (o portão do vazamento de classe), o letreiro do hero apontando para
 *     o logo do Smart Miner, e a arte de canto sendo a esteira e não o circuito.
 *  3. CONTRASTE MEDIDO por pixel COMPOSTO (foto + véu + malha + SVG empilhados):
 *     o `h1`/`h2` de cada faixa e o botão do hero. É o número que decide se a menta
 *     podia entrar na faixa, e por isso ele existe aqui e não no chat.
 *  4. MOVIMENTO: `stroke-dashoffset` do traço da esteira MUDANDO entre dois quadros
 *     do mesmo nó, e `background-position` do fio do trilho idem — presença de
 *     `animation-name` não prova movimento.
 *  5. ÂNCORAS: os `id` das faixas contra o que `pageSections.ts` espera, para o
 *     indicador não apontar para parada que não existe.
 *  6. OS DOIS CANAIS de movimento reduzido, com o balão obrigado a ficar visível —
 *     é o portão de conteúdo, não de movimento.
 *
 * Uso: node scripts/medir-smartminer-sis279.mjs   (com o `next dev` em :3000)
 */

import { writeFile } from 'node:fs/promises';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const { chromium } = await import(PLAYWRIGHT);
const URL_BASE = 'http://localhost:3000';
const ROTA = '/solucoes/smart-miner';

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
   quando há foto, véu, malha e SVG empilhados. */
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

async function abrir({ largura, reduce, preferencia, rota = ROTA }) {
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
  await page.goto(`${URL_BASE}${rota}`, { waitUntil: 'load', timeout: 90000 });
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

const arquitetura = (page) =>
  page.evaluate(() => {
    /* A `<nav>` de «Conheça também» conta como faixa: é uma das cinco. */
    const faixas = [...document.querySelectorAll('main > section, main > nav[aria-labelledby]')];
    return faixas.map((s) => ({
      id: s.id || s.getAttribute('aria-labelledby') || s.tagName,
      tag: s.tagName,
      clara: s.classList.contains('section-light'),
      overflow: getComputedStyle(s).overflow,
      titulo: s.querySelector('h1, h2')?.textContent.trim().slice(0, 40) ?? null,
      cards: s.querySelectorAll('ol > li').length,
      grafismos: {
        acentos: s.querySelector(':scope > .smartminer-acentos') ? 1 : 0,
        esteira: s.querySelector(':scope > .smartminer-esteira') ? 1 : 0,
        malha: s.querySelector(':scope > .grade-tecnica') ? 1 : 0,
      },
    }));
  });

const resultado = {};

for (const largura of [390, 1440]) {
  const { ctx, page, erros } = await abrir({ largura, reduce: false });
  await rampa(page);

  const faixas = await arquitetura(page);

  /* IDENTIDADE — vazamento de classe nos dois sentidos e a marca do hero. */
  const identidade = await page.evaluate(() => ({
    nosMatchai: document.querySelectorAll('[class*="matchai-"]').length,
    nosSmartminer: document.querySelectorAll('[class*="smartminer-"]').length,
    marcaDoHero: document.querySelector('#topo h1 img')?.getAttribute('src') ?? null,
    altDaMarca: document.querySelector('#topo h1 img')?.getAttribute('alt') ?? null,
    carimbo: document.querySelectorAll('.carimbo-batida').length,
    /* A CÁPSULA (arte entregue depois da primeira volta). Era 0 aqui e o portão
       registrava a ausência; agora o portão é o inverso — a peça tem de existir, ter
       o tamanho da regra do `globals.css` (e não o da folha do componente, que é o
       empate de especificidade que a irmã já pegou), estar FORA do `h1` e ter
       `alt=""`, senão o nome do produto é anunciado duas vezes. */
    capsula: (() => {
      const no = document.querySelector('#topo .smartminer-carimbo');
      if (!no) return null;
      const img = no.querySelector('img');
      const r = img.getBoundingClientRect();
      return {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
        largura: Math.round(r.width),
        altura: Math.round(r.height),
        razao: Number((r.width / r.height).toFixed(3)),
        temAsDuasClasses: no.classList.contains('carimbo-batida'),
        dentroDoH1: Boolean(no.closest('h1')),
        /* Ordem no documento: a etiqueta vem ANTES da manchete. */
        antesDoH1:
          no.compareDocumentPosition(document.querySelector('#topo h1')) &
            Node.DOCUMENT_POSITION_FOLLOWING
            ? true
            : false,
        /* Assentada: sem resto de `transform` do GSAP e em opacidade cheia. */
        repouso: getComputedStyle(no).transform,
        opacidade: getComputedStyle(no).opacity,
      };
    })(),
    capaDoHero:
      document.querySelector('#topo [data-route-critical-media]')?.getAttribute('src') ?? null,
    passos: document.querySelectorAll('.smartminer-passo').length,
    fios: document.querySelectorAll('.smartminer-fio').length,
    balao: document.querySelectorAll('.smartminer-balao').length,
  }));

  /* MOVIMENTO — dois quadros do MESMO nó, com o nó levado ao centro da tela antes
     de medir: laço de elemento fora de quadro corre, mas o valor lido seria de algo
     que ninguém vê. */
  const movimento = await page.evaluate(async () => {
    const dois = async (el, prop) => {
      el.closest('section, nav')?.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 350));
      const cs = getComputedStyle(el);
      const a = cs[prop];
      await new Promise((r) => setTimeout(r, 420));
      return { animacao: cs.animationName, quadroA: a, quadroB: getComputedStyle(el)[prop] };
    };
    const traco = [];
    for (const p of document.querySelectorAll('.smartminer-esteira-pulso')) {
      const d = await dois(p, 'strokeDashoffset');
      traco.push({ ...d, moveu: d.quadroA !== d.quadroB, tracejado: getComputedStyle(p).strokeDasharray });
    }
    const fio = [];
    for (const f of document.querySelectorAll('.smartminer-fio')) {
      const d = await dois(f, 'backgroundPositionX');
      fio.push({ ...d, moveu: d.quadroA !== d.quadroB });
    }
    return { traco, fio };
  });

  /* CONTRASTE — tinta do título contra o pixel composto ao lado dele, mais o botão
     do hero (fundo menta com tinta navy). */
  const alvos = await page.evaluate(async () => {
    const out = [];
    for (const n of document.querySelectorAll('main h1, main h2, #topo button')) {
      n.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 300));
      const r = n.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight || r.width < 4) continue;
      const cs = getComputedStyle(n);
      out.push({
        alvo: (n.textContent.trim() || n.querySelector('img')?.alt || n.tagName).slice(0, 34),
        tinta: cs.color,
        /* No botão o fundo é o dele mesmo; nos títulos é a faixa 24px à direita. */
        ponto:
          n.tagName === 'BUTTON'
            ? { x: Math.round(r.left + 6), y: Math.round(r.top + r.height / 2) }
            : {
                x: Math.max(2, Math.min(window.innerWidth - 3, Math.round(r.right + 24))),
                y: Math.round(r.top + r.height / 2),
              },
        scroll: window.scrollY,
      });
    }
    return out;
  });
  const contrastes = [];
  for (const t of alvos) {
    await page.evaluate((y) => window.scrollTo(0, y), t.scroll);
    await page.waitForTimeout(250);
    const fundo = await pixel(page, t.ponto.x, t.ponto.y);
    contrastes.push({ alvo: t.alvo, tinta: t.tinta, fundoComposto: fundo, contraste: contraste(t.tinta, fundo) });
  }

  /* A CÁPSULA é tinta BRANCA sobre a capa + os três véus. Ela não é texto, então
     não entra no laço dos títulos — mas «cápsula branca só se lê em faixa escura» é
     afirmação que precisa de número: o fundo composto lido DENTRO da caixa da arte
     (num ponto vazio da cápsula) contra `#ffffff`, que é a tinta medida no IHDR. */
  let capsulaContraste = null;
  {
    const caixa = await page.evaluate(() => {
      window.scrollTo(0, 0);
      const img = document.querySelector('#topo .smartminer-carimbo img');
      if (!img) return null;
      const r = img.getBoundingClientRect();
      /* Ponto vazio: dentro da moldura, mas no vão entre o ícone e a borda de baixo. */
      return { x: Math.round(r.left + r.width * 0.5), y: Math.round(r.top + r.height * 0.86) };
    });
    if (caixa) {
      await page.waitForTimeout(250);
      const fundo = await pixel(page, caixa.x, caixa.y);
      capsulaContraste = {
        ponto: caixa,
        tinta: 'rgb(255, 255, 255)',
        fundoComposto: fundo,
        contraste: contraste('rgb(255, 255, 255)', fundo),
      };
    }
  }

  await page.screenshot({
    path: `docs/capturas/sis279-smart-miner-${largura}.png`,
    fullPage: true,
    animations: 'disabled',
  });

  resultado[`w${largura}`] = { faixas, identidade, movimento, contrastes, capsulaContraste, erros };
  await ctx.close();
}

/* A ARQUITETURA DA IRMÃ, medida no mesmo passe: «mesma estrutura» só é portão se os
   dois lados forem lidos pelo mesmo código. */
{
  const { ctx, page } = await abrir({ largura: 1440, reduce: false, rota: '/solucoes/match-ai' });
  await rampa(page);
  resultado.matchaiParaComparar = await arquitetura(page);
  resultado.vazamentoNaIrma = await page.evaluate(
    () => document.querySelectorAll('[class*="smartminer-"]').length,
  );
  await ctx.close();
}

/* Uma slug genérica intacta (critério: «outras slugs genéricas intactas»). */
{
  const { ctx, page, erros } = await abrir({ largura: 1440, reduce: false, rota: '/solucoes/lumina-ai' });
  resultado.genericaIntacta = {
    faixas: await arquitetura(page),
    temPageHero: await page.evaluate(() => Boolean(document.querySelector('#topo'))),
    corposProprios: await page.evaluate(
      () => document.querySelectorAll('[class*="smartminer-"], [class*="matchai-"]').length,
    ),
    erros,
  };
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
        return { animacao: cs.animationName, opacidade: cs.opacity, fundo: cs.backgroundImage.slice(0, 18) };
      });
    return {
      traco: ler('.smartminer-esteira-pulso'),
      linhaBase: ler('.smartminer-esteira-linha'),
      doc: ler('.smartminer-esteira-doc'),
      fio: ler('.smartminer-fio'),
      cartao: ler('.smartminer-cartao'),
      passo: ler('.smartminer-passo'),
      /* A CÁPSULA nos dois canais: a batida não é montada, então o CSS já tem de
         SER o estado final. Animação morta que parte de `opacity: 0` é como a peça
         desaparece para sempre — o modo de falha que o docblock do componente nomeia. */
      capsula: [...document.querySelectorAll('.smartminer-carimbo')].map((c) => {
        const cs = getComputedStyle(c);
        return {
          opacidade: cs.opacity,
          transform: cs.transform,
          largura: Math.round(c.querySelector('img').getBoundingClientRect().width),
        };
      }),
      balao: [...document.querySelectorAll('.smartminer-balao')].map((b) => ({
        opacidade: getComputedStyle(b).opacity,
        escopoDentro: b.closest('[data-in]')?.dataset.in ?? null,
      })),
    };
  });
  resultado[`reduce-${canal}`] = {
    atributoNoHtml: atributo,
    animacoesVivas: ['traco', 'fio', 'cartao', 'passo', 'doc'].reduce((acc, k) => {
      acc[k] = d[k].filter((x) => x.animacao !== 'none').length;
      return acc;
    }, {}),
    capsulaVisivel: d.capsula.every(
      (c) => Number(c.opacidade) === 1 && (c.transform === 'none' || c.transform.startsWith('matrix(1, 0, 0, 1')),
    ),
    capsula: d.capsula,
    tracosApagados: d.traco.filter((t) => Number(t.opacidade) === 0).length,
    totalDeTracos: d.traco.length,
    linhaBaseViva: d.linhaBase.every((l) => Number(l.opacidade) === 1),
    docOpaco: d.doc.every((x) => Number(x.opacidade) === 1),
    fioSemTracejado: d.fio.every((f) => f.fundo.startsWith('none')),
    balaoVisivel: d.balao.every((b) => Number(b.opacidade) === 1),
    balao: d.balao,
    erros,
  };
  await ctx.close();
}

await navegador.close();
await writeFile('docs/medidas/sis279-smart-miner.json', `${JSON.stringify(resultado, null, 2)}\n`);
console.log(JSON.stringify(resultado, null, 2));
