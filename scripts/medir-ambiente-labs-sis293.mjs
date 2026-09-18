/* SIS-293 — mede a galeria do ambiente de /sistran-labs: as três fotos presentes,
   o `y` de ignição de cada escopo na rampa de rolagem (o item 3 da issue: não
   dispara tudo no load), a alternância de lado a 1440, a pilha a 390 e os dois
   canais de reduce.

   A rampa mede por ESTADO DISCRETO, não por quadro em movimento: a cada passo de
   rolagem só se lê `data-in` do escopo e a posição do topo da figura NAQUELE
   instante. É o que evita medir a foto no meio da própria animação. */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXEC =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const URL = 'http://localhost:3000/sistran-labs';
const PASSO = 60; // px por passo da rampa

const navegador = await chromium.launch({ executablePath: EXEC });

async function abrir({ largura = 1440, altura = 900, reduce = false, motion = 'full' } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
    reducedMotion: reduce ? 'reduce' : 'no-preference',
  });
  await ctx.addInitScript(
    (m) => {
      localStorage.setItem('sistran-motion-preference', m);
      localStorage.setItem('sistran-motion-preference-seen', '1');
      sessionStorage.setItem('sistran:intro-visto', 'true');
    },
    motion,
  );
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 20000 }).catch(() => {});
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  return { ctx, p };
}

function estado() {
  return [...document.querySelectorAll('.labs-ambiente-item')].map((it) => {
    const fig = it.querySelector('.labs-ambiente-figura');
    const img = it.querySelector('img');
    const r = fig.getBoundingClientRect();
    const est = getComputedStyle(fig);
    return {
      dentro: it.getAttribute('data-in'),
      preset: fig.getAttribute('data-reveal'),
      arquivo: new URL(img.currentSrc || img.src).pathname,
      alt: img.getAttribute('alt'),
      l: Math.round(r.width),
      a: Math.round(r.height),
      x: Math.round(r.x),
      topoNaTela: Math.round(r.top),
      opacidade: est.opacity,
      transform: est.transform,
      duracao: est.transitionDuration,
      atraso: est.transitionDelay,
    };
  });
}

const saida = { rota: '/sistran-labs', secao: '#labs-ambiente', passoDaRampa: PASSO };

/* 1440 — estado no load e rampa de rolagem */
{
  const { ctx, p } = await abrir();
  const alturaJanela = 900;
  saida.noLoad1440 = (await p.evaluate(estado)).map((f) => ({
    dentro: f.dentro,
    opacidade: f.opacidade,
    transform: f.transform,
    topoNaTela: f.topoNaTela,
  }));

  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  const ignicao = [null, null, null];
  for (let y = 0; y <= total; y += PASSO) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(120);
    const st = await p.evaluate(estado);
    st.forEach((f, i) => {
      if (!ignicao[i] && f.dentro === 'true') {
        ignicao[i] = {
          scrollY: y,
          topoDaFiguraNaTela: f.topoNaTela,
          fracaoDaViewport: Math.round((f.topoNaTela / alturaJanela) * 1000) / 10,
          fimDaFiguraNaTela: f.topoNaTela + f.a <= alturaJanela,
        };
      }
    });
    if (ignicao.every(Boolean)) break;
  }
  saida.ignicao1440 = ignicao;

  await p.evaluate(() => document.querySelector('#labs-ambiente').closest('section').scrollIntoView());
  await p.waitForTimeout(1400);
  saida.repouso1440 = await p.evaluate(estado);
  saida.pilha1440 = await p.evaluate(() => {
    const e = getComputedStyle(document.querySelector('.labs-ambiente-pilha'));
    return { vao: e.rowGap, overflowX: e.overflowX, largura: Math.round(document.querySelector('.labs-ambiente-pilha').getBoundingClientRect().width) };
  });
  saida.barraHorizontal1440 = await p.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  await p.screenshot({ path: 'docs/capturas/sis293-1440-galeria.png' });
  await ctx.close();
}

/* 1440 — capturas no meio da rolagem, com uma foto entrando */
{
  const { ctx, p } = await abrir();
  const alvo = await p.evaluate(() => {
    const it = document.querySelectorAll('.labs-ambiente-item')[1];
    return it.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.9;
  });
  await p.evaluate((y) => window.scrollTo(0, y), alvo);
  await p.waitForTimeout(180);
  await p.screenshot({ path: 'docs/capturas/sis293-1440-entrando.png' });
  saida.duranteEntrada = await p.evaluate(estado);
  await ctx.close();
}

/* 390 — pilha, largura cheia, sem alternância */
{
  const { ctx, p } = await abrir({ largura: 390, altura: 844 });
  await p.evaluate(() => document.querySelector('#labs-ambiente').closest('section').scrollIntoView());
  await p.waitForTimeout(1400);
  saida.repouso390 = await p.evaluate(estado);
  saida.barraHorizontal390 = await p.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  await p.screenshot({ path: 'docs/capturas/sis293-390-galeria.png' });
  await ctx.close();
}

/* reduce canal 1: prefers-reduced-motion */
{
  const { ctx, p } = await abrir({ reduce: true });
  await p.evaluate(() => document.querySelector('#labs-ambiente').closest('section').scrollIntoView());
  await p.waitForTimeout(600);
  saida.reduceMidia = await p.evaluate(estado);
  await p.screenshot({ path: 'docs/capturas/sis293-1440-reduce.png' });
  await ctx.close();
}

/* reduce canal 2: html[data-motion="reduce"] (a preferência do próprio site) */
{
  const { ctx, p } = await abrir({ motion: 'reduce' });
  saida.motionAtributo = await p.evaluate(() => document.documentElement.getAttribute('data-motion'));
  await p.evaluate(() => document.querySelector('#labs-ambiente').closest('section').scrollIntoView());
  await p.waitForTimeout(600);
  saida.reduceAtributo = await p.evaluate(estado);
  await ctx.close();
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
