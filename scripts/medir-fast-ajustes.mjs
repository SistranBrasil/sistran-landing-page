/**
 * SIS-286 (ajustes do turno) — portões dos TRÊS pedidos, medidos na rota viva:
 *
 *  1. HERO — a ficha flutuante «Mais agilidade / para o seu negócio» existe, está
 *     DENTRO da coluna da foto, é texto de verdade (não `aria-hidden`) e a tinta
 *     dela fecha 4,5:1 contra o fundo COMPOSTO do cartão (recorte 1x1 do print);
 *  2. HUB — as quatro caixas com ícone AO LADO do título, o centro com halo, e
 *     TRÊS trilhos + tronco vertical a 1440 / NENHUM a 390 (empilhado). O tronco
 *     tem de cobrir de 25% a 75% da altura da coluna, que é onde os centros das
 *     duas caixas de destino caem;
 *  3. BENEFÍCIOS — três colunas alinhadas À ESQUERDA, disco de ícone na mesma
 *     linha do número, e a CONTAGEM acontecendo: amostro o `textContent` dos três
 *     números em rajada logo depois de a seção entrar, e exijo pelo menos um valor
 *     DIFERENTE do final (senão não houve contagem, só o texto estático do SSR).
 *     Com movimento reduzido exijo o contrário: o valor final desde o primeiro
 *     quadro, nunca um número intermediário preso. Os DOIS canais são a media
 *     query do SO e a PREFERÊNCIA GRAVADA (`localStorage`) — não o atributo
 *     `data-motion`, que é saída do script inline, não entrada; ver `abrir`.
 *
 * Uso: node scripts/medir-fast-ajustes.mjs   (com o `next dev` em :3000)
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

async function abrir({ largura, reduce, preferencia }) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
    ...(reduce ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(
    (pref) => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
      /* O SEGUNDO CANAL é a PREFERÊNCIA GRAVADA, e tem de ser gravada ANTES do
         load: o script inline de `app/layout.tsx` roda antes da primeira pintura,
         lê esta chave, escreve `html[data-motion]` E EMBRULHA `window.matchMedia`
         para devolver o valor resolvido. Daí o `data-motion` ser SAÍDA, não
         entrada — pôr o atributo à mão depois do load (o que esta sonda fazia)
         não alcança JS nenhum, e a contagem seguia rodando com razão. */
      if (pref) localStorage.setItem('sistran-motion-preference', pref);
    },
    preferencia ?? null,
  );
  const page = await ctx.newPage();
  const erros = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  page.on('pageerror', (e) => erros.push(String(e)));
  await page.goto(`${URL_BASE}/solucoes/fast`, { waitUntil: 'load', timeout: 90000 });
  return { ctx, page, erros };
}

/* Rampa: as seções entram por `variants` do `motion/react`. Salto único deixa os
   nós no transform inicial e toda geometria lida ali é lixo silencioso. */
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

  /* A CONTAGEM primeiro, e antes da rampa: `once: true` dispara uma única vez,
     então se a rampa passar pela seção antes eu perco a janela.
     A ESPERA DE 2,5s NÃO É ZELO — é o defeito que esta sonda já cometeu: medida
     logo depois do `load`, a página ainda é o HTML do servidor, sem observador de
     viewport nenhum montado. O primeiro laudo disse «não conta» porque mediu antes
     da hidratação, com a contagem intacta. */
  await page.waitForTimeout(2500);
  const contagem = await page.evaluate(async () => {
    const sec = document.querySelector('[aria-labelledby="beneficios"]');
    const nos = () => [...sec.querySelectorAll('li span.font-mono > span')];
    const ler = () => nos().map((s) => `${s.textContent.trim()}/${s.dataset.contagem ?? '-'}`);
    const antes = ler();
    sec.scrollIntoView({ block: 'center' });
    /* Duas leituras por ESTADO DISCRETO (`data-contagem`), e não corrida de
       quadros: no meio do percurso o estado tem de ser `ativa` e o texto pode ser
       qualquer valor da curva; ao fim, `fim` e o valor exato. */
    await new Promise((r) => setTimeout(r, 400));
    const meio = ler();
    await new Promise((r) => setTimeout(r, 2500));
    return { antesDeEntrar: antes, meio, fim: ler() };
  });

  await rampa(page);

  const dados = await page.evaluate(() => {
    /* 1. FICHA FLUTUANTE */
    const hero = document.getElementById('topo');
    const foto = hero.querySelector('img').closest('div').parentElement;
    const fichaTitulo = [...hero.querySelectorAll('span')].find(
      (s) => s.textContent.trim() === 'Mais agilidade',
    );
    const ficha = fichaTitulo?.closest('div');
    const rf = ficha?.getBoundingClientRect();
    const rFoto = foto?.getBoundingClientRect();

    /* 2. HUB */
    const sec = document.querySelector('[aria-labelledby="integracao-sem-fronteiras"]');
    const grade = sec.querySelector('.grid.items-stretch');
    const caixas = [...grade.querySelectorAll('.rounded-2xl')].map((c) => {
      const r = c.getBoundingClientRect();
      const spans = [...c.querySelectorAll('span')].map((s) => s.textContent.trim()).filter(Boolean);
      return {
        titulo: spans[0] ?? null,
        apoio: spans[1] ?? null,
        left: Math.round(r.left),
        largura: Math.round(r.width),
        /* ícone AO LADO = disco e texto na mesma linha: o topo do disco e o do
           texto têm de coincidir dentro de poucos px. */
        display: getComputedStyle(c).display,
      };
    });
    const centro = sec.querySelector('.rounded-\\[28px\\]');
    const rc = centro?.getBoundingClientRect();
    const halo = sec.querySelector('.blur-\\[42px\\]');
    const trilhos = [...sec.querySelectorAll('span.h-px')].filter((s) => s.offsetParent !== null);
    const tronco = [...sec.querySelectorAll('span.w-px')].filter((s) => s.offsetParent !== null);
    /* O que importa não é a altura do tronco, é o ENCONTRO: as pontas das duas
       metades têm de coincidir entre si e cada trilho tem de estar na linha do
       centro da caixa de destino da sua fileira. Em px, não em porcentagem. */
    const metades = tronco.map((t) => {
      const r = t.getBoundingClientRect();
      return { topo: Math.round(r.top), base: Math.round(r.bottom) };
    });
    const destinos = [...sec.querySelectorAll('ul > li')].map((li) => {
      const r = li.getBoundingClientRect();
      return Math.round(r.top + r.height / 2);
    });
    const eixoDosTrilhos = trilhos
      .slice(1)
      .map((t) => Math.round(t.getBoundingClientRect().top));

    /* 3. BENEFÍCIOS */
    const bsec = document.querySelector('[aria-labelledby="beneficios"]');
    const colunas = [...bsec.querySelectorAll('li')].map((li) => {
      const r = li.getBoundingClientRect();
      const disco = li.querySelector('span > span[aria-hidden="true"]');
      const numero = li.querySelector('span:first-child > span:last-child');
      const rd = disco?.getBoundingClientRect();
      const rn = numero?.getBoundingClientRect();
      return {
        left: Math.round(r.left),
        largura: Math.round(r.width),
        alinhamento: getComputedStyle(li).textAlign,
        bordaEsq: getComputedStyle(li).borderLeftWidth,
        numero: numero?.textContent.trim(),
        /* mesma linha: centros verticais do disco e do número dentro de 4px */
        deltaEixoY: rd && rn ? Math.round(rd.top + rd.height / 2 - (rn.top + rn.height / 2)) : null,
        discoAntesDoNumero: rd && rn ? rd.right <= rn.left + 1 : null,
      };
    });

    return {
      ficha: ficha
        ? {
            texto: ficha.textContent.trim(),
            ariaHidden: ficha.closest('[aria-hidden="true"]') !== null,
            tinta: getComputedStyle(fichaTitulo).color,
            left: Math.round(rf.left),
            largura: Math.round(rf.width),
            dentroDaColunaDaFoto: rf.left >= rFoto.left - 30 && rf.right <= rFoto.right + 30,
            amostra: { x: Math.round(rf.left + 12), y: Math.round(rf.top + rf.height / 2) },
          }
        : null,
      hub: {
        caixas,
        centro: rc
          ? { texto: centro.textContent.trim(), largura: Math.round(rc.width), temHalo: !!halo }
          : null,
        trilhosVisiveis: trilhos.length,
        troncosVisiveis: tronco.length,
        metadesDoTronco: metades,
        /* emenda das duas metades: base da primeira == topo da segunda */
        emenda: metades.length === 2 ? metades[0].base - metades[1].topo : null,
        eixoDosTrilhosDeRamo: eixoDosTrilhos,
        centrosDosDestinos: destinos,
        /* cada trilho de ramo na linha do centro da sua caixa, em px */
        desvioTrilhoVsCaixa: eixoDosTrilhos.map((y, i) => y - destinos[i]),
      },
      beneficios: colunas,
    };
  });

  /* Composto da ficha: tinta escura sobre o branco 0,95 do cartão, que por sua vez
     está sobre a foto — é o empilhamento que o olho recebe. */
  let fichaComposto = null;
  if (dados.ficha) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(700);
    const pos = await page.evaluate(() => {
      const t = [...document.querySelectorAll('#topo span')].find(
        (s) => s.textContent.trim() === 'Mais agilidade',
      );
      const r = t.closest('div').getBoundingClientRect();
      return { x: Math.round(r.right - 10), y: Math.round(r.top + 8) };
    });
    const css = await pixel(page, pos.x, pos.y);
    fichaComposto = {
      fundoComposto: css,
      tinta: dados.ficha.tinta,
      contraste: Number(contraste(luminancia(css), luminancia(dados.ficha.tinta)).toFixed(2)),
    };
  }

  await page.screenshot({
    path: `docs/capturas/sis286-ajustes-${largura}.png`,
    fullPage: true,
    animations: 'disabled',
  });

  resultado[`w${largura}`] = { ...dados, fichaComposto, contagem, erros };
  await ctx.close();
}

/* MOVIMENTO REDUZIDO — os dois canais. O que se mede aqui é o valor FINAL desde o
   primeiro quadro: contagem é enfeite, e enfeite desligado não pode deixar número
   intermediário na tela. */
for (const canal of ['media', 'preferencia']) {
  const { ctx, page, erros } = await abrir({
    largura: 1440,
    reduce: canal === 'media',
    preferencia: canal === 'preferencia' ? 'reduce' : null,
  });
  await page.waitForTimeout(2500); /* hidratação — ver a nota acima */
  const atributo = await page.evaluate(() => document.documentElement.dataset.motion ?? null);
  const d = await page.evaluate(async () => {
    const sec = document.querySelector('[aria-labelledby="beneficios"]');
    const numeros = () =>
      [...sec.querySelectorAll('li span.font-mono > span')].map(
        (s) => `${s.textContent.trim()}/${s.dataset.contagem ?? '-'}`,
      );
    sec.scrollIntoView({ block: 'center' });
    const amostras = [];
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => requestAnimationFrame(r));
      amostras.push(numeros().join('|'));
    }
    await new Promise((r) => setTimeout(r, 1500));
    amostras.push(numeros().join('|'));
    const invisiveis = [...document.querySelectorAll('main *')]
      .filter(
        (e) =>
          Number(getComputedStyle(e).opacity) < 0.05 &&
          e.getBoundingClientRect().height > 4 &&
          e.getBoundingClientRect().top > -900 &&
          e.getBoundingClientRect().top < 1800,
      )
      .map((e) => e.tagName + '.' + (e.className?.toString?.().slice(0, 40) ?? ''));
    return { distintos: [...new Set(amostras)], final: numeros(), invisiveisNaTela: invisiveis };
  });
  resultado[`reduce-${canal}`] = { atributoNoHtml: atributo, ...d, erros };
  await ctx.close();
}

await navegador.close();
await writeFile('docs/medidas/sis286-ajustes.json', `${JSON.stringify(resultado, null, 2)}\n`);
console.log(JSON.stringify(resultado, null, 2));
