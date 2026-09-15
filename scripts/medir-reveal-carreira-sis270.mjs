/**
 * SIS-270 — «/trabalhe-conosco · reveal on scroll (docs/scroll.md)».
 *
 * `node scripts/medir-reveal-carreira-sis270.mjs`
 *
 * O portão desta issue não é "existe `data-reveal` no JSX". A issue proíbe uma
 * coisa específica — «tudo dispara após o load» — e essa proibição só se verifica
 * com uma LINHA DO TEMPO: para cada bloco marcado, em que `scrollY` ele recebeu
 * `data-in="true"`. Dois blocos acendendo no mesmo `scrollY` é a cadência
 * quebrada da 2ª volta de `/contato` (SIS-269) reproduzida aqui.
 *
 * Também se mede o que NÃO pode ganhar reveal:
 *  • `CurriculoCard` (`.cv-secao`) tem cortina GSAP — um `data-reveal` no mesmo
 *    nó violaria o §6 de `docs/scroll.md` («não misture os dois no mesmo
 *    elemento»);
 *  • `Social` (`#social`) já entra por `whileInView` de `motion/react`;
 *  • o `<h1>` do `PageHero` já tem entrada de montagem e é candidato a LCP.
 * Para os três, o portão é a AUSÊNCIA de `[data-reveal]` dentro deles.
 *
 * E as duas saídas de acessibilidade: com `html[data-motion="reduce"]` e com
 * JavaScript desligado, todo bloco marcado tem de estar visível (opacidade 1).
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const URL_ROTA = 'http://localhost:3000/trabalhe-conosco';
const JANELA = { width: 1440, height: 900 };

/* Os nós que a issue nomeia, pelos seletores que existem na página. */
const BLOCOS = {
  beneficios: '.carreira-beneficios',
  slogan: '.carreira-slogan',
  curriculo: '.cv-secao',
  social: '#social',
};

const nav = await chromium.launch();
const res = { janela: JANELA, geometria: {}, linhaDoTempo: [], semSegundoReveal: {}, reduce: {}, semJs: {}, erros: [] };

/* ── 1. Geometria e linha do tempo ──────────────────────────────────────────
   Rola em passos e registra, a cada passo, quais escopos marcados já estão em
   `data-in="true"`. É isso que separa "acendeu ao rolar" de "acendeu tudo no
   load": o número que importa é o `scrollY` da PRIMEIRA vez que cada um acende. */
{
  const ctx = await nav.newContext({ viewport: JANELA });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await ctx.newPage();
  p.on('console', (m) => { if (m.type() === 'error') res.erros.push(m.text()); });
  /* O `esperarRota` só cumpre o que promete se o escopo ainda estiver ESCONDIDO no
     instante em que a cortina do `RouteLoadGate` levanta. Um `MutationObserver`
     instalado antes de qualquer script da página registra os dois instantes; se
     `data-in` virasse `true` ANTES de `data-route-liberado`, a entrada teria
     acontecido atrás da cortina — o defeito que a SIS-263 (2ª volta) descreve. */
  await p.addInitScript(() => {
    window.__sis270 = { liberado: null, aceso: null };
    const obs = new MutationObserver(() => {
      if (window.__sis270.liberado === null
        && document.querySelector('[data-route-content][data-route-liberado="true"]')) {
        window.__sis270.liberado = performance.now();
      }
      if (window.__sis270.aceso === null
        && document.querySelector('[data-reveal-nome][data-in="true"]')) {
        window.__sis270.aceso = performance.now();
      }
    });
    document.addEventListener('DOMContentLoaded', () =>
      obs.observe(document.documentElement, { subtree: true, attributes: true, childList: true }));
  });
  await p.goto(URL_ROTA, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 40000 }).catch(() => null);
  await p.waitForTimeout(1200);

  res.ordemCortina = await p.evaluate(() => {
    const m = window.__sis270;
    return {
      msCortinaLevantou: m.liberado === null ? null : Math.round(m.liberado),
      msEscopoAcendeu: m.aceso === null ? null : Math.round(m.aceso),
      acendeuDepoisDaCortina: m.liberado !== null && m.aceso !== null && m.aceso >= m.liberado,
    };
  });

  res.geometria = await p.evaluate((sel) => {
    const fora = {};
    for (const [k, s] of Object.entries(sel)) {
      const n = document.querySelector(s);
      fora[k] = n ? { topoAbsoluto: Math.round(n.getBoundingClientRect().top + window.scrollY), altura: Math.round(n.getBoundingClientRect().height) } : null;
    }
    fora.alturaDaPagina = document.documentElement.scrollHeight;
    return fora;
  }, BLOCOS);

  /* Um passo de 150px: fino o bastante para distinguir dois blocos que acendem
     em gestos diferentes, e grosso o bastante para a página inteira caber. */
  const alturaTotal = res.geometria.alturaDaPagina;
  const jaAceso = new Set();
  for (let y = 0; y <= alturaTotal; y += 150) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(120);
    const acesos = await p.evaluate(() =>
      [...document.querySelectorAll('[data-reveal-nome]')]
        .filter((n) => n.dataset.in === 'true')
        .map((n) => n.dataset.revealNome),
    );
    for (const nome of acesos) {
      if (jaAceso.has(nome)) continue;
      jaAceso.add(nome);
      res.linhaDoTempo.push({ nome, scrollY: Math.round(await p.evaluate(() => window.scrollY)) });
    }
  }

  /* O bloco de fecho não é marcado (`Social` já entra por `whileInView`), mas ele
     é o único bloco desta rota que se alcança ROLANDO — então é ele que prova que
     a página tem cadência de scroll em vez de acender tudo no load.
     Mede-se o `<h2>`, e NÃO o `.palco-copy` que o envolve: `vHeader` é variant de
     ORQUESTRAÇÃO (`hidden: {}`, `visible: { transition: { staggerChildren } }`) e
     nunca toca em opacidade. Ler o invólucro devolveria `1` sempre e o portão
     aprovaria qualquer calibre — foi o que aconteceu na primeira medição.

     Este número mede um bloco que a SIS-270 NÃO alterou, e é de propósito: foi ele
     que derrubou a hipótese de que o fecho nascia pronto. Com `git stash` do
     trabalho da issue, `scrollYQuandoAcendeu` dá o MESMO 400 — o `VP` da casa já
     era entrada por rolagem aqui, e o `VP_SCROLL` que chegou a existir era um
     segundo calibre reproduzindo o primeiro. Se alguém for recalibrar o fecho, é
     este par de números (com e sem a mudança) que precisa divergir. */
  {
    const p2 = await ctx.newPage();
    await p2.goto(URL_ROTA, { waitUntil: 'networkidle' });
    await p2.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 40000 }).catch(() => null);
    await p2.waitForTimeout(1200);
    res.fechoPorScroll = { opacidadeNoTopo: null, scrollYQuandoAcendeu: null };
    res.fechoPorScroll.opacidadeNoTopo = await p2.evaluate(
      () => getComputedStyle(document.querySelector('#social h2')).opacity,
    );
    for (let y = 0; y <= res.geometria.alturaDaPagina; y += 100) {
      await p2.evaluate((v) => window.scrollTo(0, v), y);
      await p2.waitForTimeout(150);
      const op = await p2.evaluate(
        () => Number(getComputedStyle(document.querySelector('#social h2')).opacity),
      );
      if (op > 0.9) { res.fechoPorScroll.scrollYQuandoAcendeu = y; break; }
    }
    await p2.close();
  }

  /* Ausência de segundo reveal onde já há animação própria. */
  res.semSegundoReveal = await p.evaluate((sel) => ({
    curriculo: document.querySelectorAll(`${sel.curriculo} [data-reveal]`).length,
    social: document.querySelectorAll(`${sel.social} [data-reveal]`).length,
    tituloDoHero: document.querySelectorAll('#topo [data-reveal]').length,
  }), BLOCOS);

  /* Captura com a página no topo e outra no meio da abertura. */
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(400);
  await p.screenshot({ path: 'docs/capturas/sis270-carreira-1440-topo.png', clip: { x: 0, y: 0, ...JANELA } });
  await p.evaluate(() => window.scrollTo(0, 700));
  await p.waitForTimeout(900);
  await p.screenshot({ path: 'docs/capturas/sis270-carreira-1440-abertura.png', clip: { x: 0, y: 0, ...JANELA } });
  await ctx.close();
}

/* ── 2. Movimento reduzido ─────────────────────────────────────────────────── */
{
  const ctx = await nav.newContext({ viewport: JANELA, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await ctx.newPage();
  await p.goto(URL_ROTA, { waitUntil: 'networkidle' });
  /* Esperar a cortina também aqui: sem isso o que se mede pode ser conteúdo ainda
     atrás do `RouteLoadGate`, e QUALQUER opacidade lida seria indistinguível de
     uma falha real. */
  await p.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 40000 }).catch(() => null);
  await p.waitForTimeout(1500);
  /* ATENÇÃO ao ler este número: `reduceFecho` dá `"0"` — o título do fecho fica
     invisível no topo da rota com movimento reduzido, o que é um defeito de
     acessibilidade real (decoração tem de morrer VISÍVEL). Ele NÃO é da SIS-270:
     medido com `git stash` do trabalho da issue, dá `"0"` igual. A causa está em
     `Social`/`CartaoDuasFaces` — `initial={rm ? false : 'hidden'}` não desfaz o
     estado escondido, porque `useReducedMotion` nasce `false` (snapshot de
     servidor) e só converge depois de montar, quando `initial` já não é lido.
     Corrigir isso é mexer no fecho de mais de uma rota: pede issue própria. Este
     número fica medido aqui para que ela não precise redescobri-lo. */
  res.reduceFecho = await p.evaluate(
    () => getComputedStyle(document.querySelector('#social h2')).opacity,
  );
  res.reduce = await p.evaluate(() =>
    [...document.querySelectorAll('[data-reveal]')].map((n) => ({
      preset: n.getAttribute('data-reveal'),
      opacidade: getComputedStyle(n).opacity,
      transform: getComputedStyle(n).transform,
    })),
  );
  await ctx.close();
}

/* ── 3. Sem JavaScript ─────────────────────────────────────────────────────── */
{
  const ctx = await nav.newContext({ viewport: JANELA, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(URL_ROTA, { waitUntil: 'load' });
  res.semJs = await p.evaluate(() =>
    [...document.querySelectorAll('[data-reveal]')].map((n) => ({
      preset: n.getAttribute('data-reveal'),
      opacidade: getComputedStyle(n).opacity,
    })),
  ).catch(() => 'evaluate indisponível sem JS');
  /* Sem JS o `evaluate` não roda: o que se mede é o HTML do servidor. */
  res.semJsMarcados = (await p.content()).split('data-reveal=').length - 1;
  await ctx.close();
}

await nav.close();
await writeFile('docs/medidas/reveal-carreira-sis270.json', `${JSON.stringify(res, null, 1)}\n`);
console.log(JSON.stringify(res, null, 1));
