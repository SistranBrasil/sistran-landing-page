/**
 * SIS-292 — portões dos OITO itens, medidos na rota viva `/solucoes/match-ai`.
 *
 *  1. CARIMBO no lugar da tag: «Tecnologia Disruptiva» não existe mais em texto
 *     nenhum da rota; o carimbo está montado no hero; a arte é BRANCA sobre
 *     transparência, então mede-se se há LETREIRO de fato (amostragem de pixels
 *     compostos dentro da caixa: se todos forem iguais ao navy, a arte não pintou);
 *     «Match AI» visível com peso 700; e a CAPA do topo menor que a das outras
 *     slugs — comparo com a largura da mídia de abertura de `/solucoes/fast`.
 *  2. REVEAL: cinco escopos, todos em `data-in="true"` depois da rampa, e nenhum
 *     nó de conteúdo preso em opacidade ~0 na tela.
 *  3. NEGRITOS da lista fechada: peso computado 700 em cada alvo, por TEXTO (não
 *     por seletor posicional, que sobrevive a um título trocado).
 *  4. CONHEÇA TAMBÉM: seis cartões, nenhuma descrição publicada, logo com `alt` =
 *     nome do produto, e altura do cartão bem menor (portão: < 130px a 1440).
 *  5. POSICIONAMENTO: os três em laço (`animation-name` não-`none`) e o hover
 *     mudando a escala.
 *  6. BALÃO ISG: sombra atrás (duas camadas) e o pop — mede-se o `translate`
 *     computado com o escopo em `data-in="false"` (antes de entrar) e depois.
 *  7. TRILHO: fio com `matchai-fluxo` e `background-position` MUDANDO entre dois
 *     quadros (é o que prova «sempre em movimento»), e os três discos com
 *     `matchai-pulso` em atrasos distintos.
 *  8. FICHAS do hero: laço, `pointer-events: auto` e hover alterando a escala.
 *
 * E os DOIS canais de movimento reduzido: nenhuma animação em laço, nada invisível,
 * e o balão nascendo no estado final. O segundo canal é a PREFERÊNCIA GRAVADA em
 * `localStorage` — `data-motion` é SAÍDA do script inline de `layout.tsx`, não
 * entrada (ver `scripts/medir-fast-ajustes.mjs`).
 *
 * Uso: node scripts/medir-matchai-sis292.mjs   (com o `next dev` em :3000)
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

const navegador = await chromium.launch();

/* Recorte 1x1 do print decodificado no browser: é o pixel COMPOSTO, o único
   número honesto quando há véu, blur e imagem empilhados. */
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
    const [r, g, bl] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${bl})`;
  }, buf.toString('base64'));
}

async function abrir({ largura, reduce, preferencia, rota = '/solucoes/match-ai' }) {
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
  /* Hidratação: sem esta espera mede-se o HTML do servidor, sem observador de
     viewport montado — o defeito que a sonda da SIS-286 já cometeu. */
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

/* ── REFERÊNCIA: a abertura de outra slug, para o item 1 («capa menor que a
   abertura normal das outras slugs») ser um número comparado, e não uma
   impressão. ─────────────────────────────────────────────────────────────── */
{
  const { ctx, page } = await abrir({ largura: 1440, reduce: false, rota: '/solucoes/fast' });
  resultado.referenciaFast = await page.evaluate(() => {
    const hero = document.getElementById('topo');
    const img = hero?.querySelector('img');
    const r = img?.getBoundingClientRect();
    return r ? { largura: Math.round(r.width), altura: Math.round(r.height) } : null;
  });
  await ctx.close();
}

for (const largura of [390, 1440]) {
  const { ctx, page, erros } = await abrir({ largura, reduce: false });

  /* ITEM 6 e a ignição: o estado ANTES de entrar tem de ser `data-in="false"` com
     o balão deslocado. Lido antes da rampa, no topo da página. */
  const antesDaEntrada = await page.evaluate(() => {
    const esc = [...document.querySelectorAll('[data-reveal-nome]')].map((e) => ({
      nome: e.dataset.revealNome,
      dataIn: e.dataset.in ?? null,
    }));
    const balao = document.querySelector('.matchai-balao');
    const cs = balao && getComputedStyle(balao);
    return {
      escopos: esc,
      balao: cs
        ? { translate: cs.translate, scale: cs.scale, opacidade: cs.opacity, sombra: cs.boxShadow }
        : null,
    };
  });

  /* ITEM 7: «linha sempre em movimento» só se prova com DOIS quadros do mesmo nó.
     Para isso a seção precisa estar em cena, então o trilho é medido antes da
     rampa completa, com um scroll dirigido. */
  const fio = await page.evaluate(async () => {
    const f = document.querySelector('.matchai-fio');
    if (!f) return null;
    f.scrollIntoView({ block: 'center' });
    await new Promise((r) => setTimeout(r, 400));
    const cs = getComputedStyle(f);
    const a = cs.backgroundPosition;
    await new Promise((r) => setTimeout(r, 350));
    const b = getComputedStyle(f).backgroundPosition;
    const passos = [...document.querySelectorAll('.matchai-passo')].map((p) => {
      const c = getComputedStyle(p);
      return { animacao: c.animationName, atraso: c.animationDelay, duracao: c.animationDuration };
    });
    return {
      animacao: cs.animationName,
      duracao: cs.animationDuration,
      posicaoA: a,
      posicaoB: b,
      moveu: a !== b,
      visivel: f.offsetParent !== null,
      passos,
    };
  });

  await rampa(page);

  const dados = await page.evaluate(() => {
    const peso = (el) => (el ? getComputedStyle(el).fontWeight : null);
    const porTexto = (sel, texto) =>
      [...document.querySelectorAll(sel)].find((e) => e.textContent.trim().startsWith(texto)) ??
      null;

    /* 1. CARIMBO */
    const carimbo = document.querySelector('.carimbo-batida');
    const rc = carimbo?.getBoundingClientRect();
    const tagAntiga = document.body.innerText.includes('Tecnologia Disruptiva');
    const h1 = document.querySelector('#topo h1');
    const nome = h1?.querySelector('strong');
    const fotoHero = document.querySelector('#topo [data-route-critical-media]');
    const rf = fotoHero?.getBoundingClientRect();

    /* 9. ARTES DOS QUATRO CARDS — o portão não é «o `src` está escrito», é «o
       arquivo PINTOU»: `naturalWidth > 0` só é verdade depois de o browser decodificar
       o bitmap, então um caminho errado (404) aparece aqui como 0. E os quatro `src`
       têm de ser DISTINTOS entre si, senão voltou-se ao placeholder repetido. */
    const artes = [...document.querySelectorAll('ol li .rounded-xl img')].map((img) => ({
      src: new URL(img.currentSrc || img.src, location.href).pathname,
      largura: img.naturalWidth,
      altura: img.naturalHeight,
      alt: img.getAttribute('alt'),
      recorte: getComputedStyle(img).objectFit,
    }));

    /* 2. REVEAL */
    const escopos = [...document.querySelectorAll('[data-reveal-nome]')].map((e) => ({
      nome: e.dataset.revealNome,
      dataIn: e.dataset.in ?? null,
      filhosComPreset: e.querySelectorAll('[data-reveal]').length,
    }));
    const invisiveisNaTela = [...document.querySelectorAll('main *')]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        return (
          Number(getComputedStyle(e).opacity) < 0.05 && r.height > 4 && r.top > -900 && r.top < 1800
        );
      })
      .map((e) => `${e.tagName}.${e.className?.toString?.().slice(0, 40) ?? ''}`);

    /* 3. NEGRITOS — a lista fechada da issue, por texto */
    const ALVOS = [
      ['#topo h1 strong', 'Ofertas inteligentes.'],
      ['h2', 'O que o Match AI faz?'],
      ['h3', 'Gera ofertas hiperpersonalizadas'],
      ['h3', 'Define personas'],
      ['h3', 'Aumenta as vendas'],
      ['h3', 'Valida ofertas'],
      ['h2', 'Da base à oferta mais relevante'],
      ['h2', 'Posicionamento'],
      ['h3', 'Complementa o ecossistema'],
      ['h3', 'Reconhecimento ISG'],
      ['h3', 'Inovação Sistran Labs'],
      ['h2', 'Conheça também'],
    ];
    const negritos = ALVOS.map(([sel, txt]) => {
      const el = porTexto(sel, txt);
      return { texto: txt, achado: !!el, peso: peso(el) };
    });

    /* 4. CONHEÇA TAMBÉM */
    const nav = document.querySelector('[aria-labelledby="conheca-tambem"]');
    const cartoes = [...(nav?.querySelectorAll('ul:last-of-type > li') ?? [])].map((li) => {
      const a = li.querySelector('a');
      const r = a.getBoundingClientRect();
      const logo = li.querySelector('img[alt]:not([alt=""])');
      return {
        altura: Math.round(r.height),
        largura: Math.round(r.width),
        textoVisivel: a.innerText.trim(),
        logoAlt: logo?.getAttribute('alt') ?? null,
        href: a.getAttribute('href'),
      };
    });

    /* 5. POSICIONAMENTO */
    const colunas = [...document.querySelectorAll('.matchai-coluna')].map((c) => {
      const cs = getComputedStyle(c);
      return { animacao: cs.animationName, atraso: cs.animationDelay, escala: cs.scale };
    });

    /* 6. BALÃO depois de entrar */
    const balao = document.querySelector('.matchai-balao');
    const cb = balao && getComputedStyle(balao);

    /* 8. FICHAS */
    const fichas = [...document.querySelectorAll('.matchai-ficha')].map((f) => {
      const cs = getComputedStyle(f);
      return {
        animacao: cs.animationName,
        atraso: cs.animationDelay,
        ponteiro: cs.pointerEvents,
        escala: cs.scale,
      };
    });

    return {
      carimbo: rc
        ? {
            largura: Math.round(rc.width),
            altura: Math.round(rc.height),
            alt: carimbo.querySelector('img')?.getAttribute('alt'),
            caixa: { x: Math.round(rc.left), y: Math.round(rc.top) },
          }
        : null,
      tagAntigaAindaNaPagina: tagAntiga,
      nomeDoProduto: nome
        ? { texto: nome.textContent.trim(), peso: peso(nome), tinta: getComputedStyle(nome).color }
        : null,
      fotoDoHero: rf ? { largura: Math.round(rf.width), altura: Math.round(rf.height) } : null,
      artesDosCards: artes,
      artesDistintas: new Set(artes.map((a) => a.src)).size,
      escopos,
      invisiveisNaTela,
      negritos,
      cartoesConheca: cartoes,
      colunasPosicionamento: colunas,
      balaoDepois: cb
        ? { translate: cb.translate, scale: cb.scale, opacidade: cb.opacity, sombra: cb.boxShadow }
        : null,
      fichas,
    };
  });

  /* CONTRASTE do nome do produto contra o navy composto do hero, e a AMOSTRAGEM do
     carimbo: a arte é branca sobre transparência, logo se TODOS os pixels lidos
     dentro da caixa forem iguais, não há letreiro — é o único jeito de conferir uma
     arte que o visualizador mostra como retângulo branco. */
  let tintaDoNome = null;
  let amostrasDoCarimbo = null;
  if (dados.nomeDoProduto && dados.carimbo) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    const pos = await page.evaluate(() => {
      const n = document.querySelector('#topo h1 strong');
      const r = n.getBoundingClientRect();
      const c = document.querySelector('.carimbo-batida').getBoundingClientRect();
      return {
        nome: { x: Math.round(r.left + 60), y: Math.round(r.top + r.height / 2) },
        /* O fundo é amostrado À DIREITA do letreiro, dentro da mesma faixa — e o
           ponto é limitado à viewport porque a 390 o `+400` caía fora do print e o
           recorte 1x1 estourava («Clipped area is outside the resulting image»). */
        fundo: {
          x: Math.min(window.innerWidth - 3, Math.round(r.right + 24)),
          y: Math.round(r.top + r.height / 2),
        },
        carimbo: { x: Math.round(c.left), y: Math.round(c.top), w: Math.round(c.width), h: Math.round(c.height) },
      };
    });
    const fundo = await pixel(page, pos.fundo.x, pos.fundo.y);
    tintaDoNome = {
      fundoComposto: fundo,
      tinta: dados.nomeDoProduto.tinta,
      contraste: Number(contraste(luminancia(fundo), luminancia(dados.nomeDoProduto.tinta)).toFixed(2)),
    };
    const amostras = [];
    for (let fx = 0.1; fx <= 0.9; fx += 0.1) {
      for (const fy of [0.35, 0.5, 0.65]) {
        amostras.push(
          await pixel(
            page,
            Math.round(pos.carimbo.x + pos.carimbo.w * fx),
            Math.round(pos.carimbo.y + pos.carimbo.h * fy),
          ),
        );
      }
    }
    amostrasDoCarimbo = {
      total: amostras.length,
      distintas: [...new Set(amostras)].length,
      claras: amostras.filter((c) => luminancia(c) > 0.5).length,
      amostras: [...new Set(amostras)].slice(0, 8),
    };
  }

  /* ITENS 5 e 8 — «ação no hover». Estado discreto: a escala computada antes e
     depois do ponteiro sobre o nó. Só a 1440 (hover pede `pointer: fine`). */
  let hover = null;
  if (largura === 1440) {
    hover = await (async () => {
      const medir = async (seletor) => {
        const antes = await page.evaluate(
          (s) => getComputedStyle(document.querySelector(s)).scale,
          seletor,
        );
        /* `page.hover` NÃO SERVE AQUI, e a razão é o próprio portão: ele espera o
           nó ficar «estável» (duas medições de caixa iguais) e estes nós flutuam em
           laço para sempre — o alvo nunca para, e a chamada estourava em 30s com
           «element is not stable». Mover o ponteiro na mão dispensa a espera, e o
           timeout que aconteceu é, de lambuja, prova de que o laço roda. */
        const centro = await page.evaluate((s) => {
          const r = document.querySelector(s).getBoundingClientRect();
          return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
        }, seletor);
        await page.mouse.move(centro.x, centro.y);
        await page.waitForTimeout(700);
        const depois = await page.evaluate(
          (s) => getComputedStyle(document.querySelector(s)).scale,
          seletor,
        );
        await page.mouse.move(2, 2);
        await page.waitForTimeout(400);
        return { antes, depois, mudou: antes !== depois };
      };
      const out = {};
      await page.evaluate(() =>
        document.querySelector('.matchai-coluna').scrollIntoView({ block: 'center' }),
      );
      await page.waitForTimeout(500);
      out.coluna = await medir('.matchai-coluna');
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(700);
      out.ficha = await medir('.matchai-ficha');
      return out;
    })();
  }

  await page.screenshot({
    path: `docs/capturas/sis292-matchai-${largura}.png`,
    fullPage: true,
    animations: 'disabled',
  });

  resultado[`w${largura}`] = {
    antesDaEntrada,
    fio,
    ...dados,
    tintaDoNome,
    amostrasDoCarimbo,
    hover,
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
    const lacos = [
      ...document.querySelectorAll('.matchai-ficha, .matchai-coluna, .matchai-fio, .matchai-passo, .matchai-cartao'),
    ].map((e) => {
      const cs = getComputedStyle(e);
      return {
        classe: e.className.toString().split(' ')[0],
        animacao: cs.animationName,
        translate: cs.translate,
      };
    });
    const balao = document.querySelector('.matchai-balao');
    const cb = balao && getComputedStyle(balao);
    const invisiveis = [...document.querySelectorAll('main *')]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        return (
          Number(getComputedStyle(e).opacity) < 0.05 && r.height > 4 && r.top > -900 && r.top < 1800
        );
      })
      .map((e) => `${e.tagName}.${e.className?.toString?.().slice(0, 40) ?? ''}`);
    return {
      lacosComAnimacao: lacos.filter((l) => l.animacao !== 'none'),
      totalDeLacos: lacos.length,
      balao: cb ? { translate: cb.translate, scale: cb.scale, opacidade: cb.opacity } : null,
      invisiveisNaTela: invisiveis,
    };
  });
  resultado[`reduce-${canal}`] = { atributoNoHtml: atributo, ...d, erros };
  await ctx.close();
}

await navegador.close();
await writeFile('docs/medidas/sis292-matchai.json', `${JSON.stringify(resultado, null, 2)}\n`);
console.log(JSON.stringify(resultado, null, 2));
