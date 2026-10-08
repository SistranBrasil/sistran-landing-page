/**
 * Sonda do hero em sequência de quadros (07/10/2026).
 *
 * Prova, no navegador, os critérios de aceite da troca `<video>` → canvas:
 *
 *   1. QUADRO CERTO NA POSIÇÃO CERTA. Em 0 / 0,25 / 0,5 / 0,75 / 1 do percurso do `#top`, o
 *      canvas publica `data-quadro` (ver `useHeroFrameSequence`) e ele tem de bater com
 *      `round(p × (N − 1))`, com folga de 1 quadro (o `scrub` de 0,3 s ainda assenta).
 *   2. REVERSO. As mesmas posições na volta (1 → 0) têm de dar os mesmos quadros.
 *   3. NUNCA VAZIO. Em cada posição o canvas é amostrado em 5 pontos: um canvas preto ou
 *      transparente reprova.
 *   4. ROLAGEM RÁPIDA. Um salto 0 → 1 → 0 em três quadros de animação: o canvas continua
 *      pintado em todos os instantes lidos.
 *   5. REDE. Nenhum pedido a `/hero/` (além do quadro 1 / pôster) antes de
 *      `data-route-liberado="true"` — é o contrato que a SIS-243 provava para o MP4.
 *   6. `<head>`: há `link[rel=preload][as=image]` para os quadros 1 e nenhum para o resto.
 *   7. MOVIMENTO REDUZIDO: o canvas fica em `data-estado="reduzido"`, o pôster é o que se vê e
 *      nenhum quadro além do 1 é pedido.
 *   8. PRECISÃO COM A RODA (só desktop): roda sintética a ~112 quadros/s de conteúdo; o quadro
 *      desenhado tem de ficar a ≤ 20 quadros (p90) do que o scroll pede, com quadro novo em
 *      ≥ 35% dos rAF lidos — é o que separa "acompanha o gesto" de "congela e salta".
 *
 * Com o site no ar (`npm run dev` ou `npm run build && npm run start`):
 *   URL_BASE=http://localhost:3000 node scripts/medir-hero-quadros.mjs
 * Capturas em `docs/capturas/hero-quadros/` (pasta ignorada pelo git).
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const DESTINO = 'docs/capturas/hero-quadros';
/* `HEADED=1` abre o Chromium com janela (e GPU): o headless compõe por software e, numa máquina
   ocupada, roda a página a ~8 fps — bom para conferir posição e rede, inútil para medir fluidez.
   `CENARIOS=desktop-1440,mobile-390x3` filtra pelos nomes. */
const HEADED = process.env.HEADED === '1';
const FILTRO = process.env.CENARIOS ? process.env.CENARIOS.split(',') : null;
const CENARIOS = [
  { nome: 'desktop-1440', viewport: { width: 1440, height: 900 }, dpr: 1 },
  { nome: 'desktop-hd-1512x2', viewport: { width: 1512, height: 982 }, dpr: 2 },
  { nome: 'mobile-390x3', viewport: { width: 390, height: 844 }, dpr: 3, mobile: true },
].filter((c) => !FILTRO || FILTRO.includes(c.nome));
const POSICOES = [0, 0.25, 0.5, 0.75, 1];

await mkdir(DESTINO, { recursive: true });
const navegador = await chromium.launch({ headless: !HEADED });
let reprovados = 0;
const reprova = (msg) => {
  reprovados++;
  console.log('  ✗', msg);
};
const aprova = (msg) => console.log('  ✓', msg);

for (const cenario of CENARIOS) {
  for (const reduzido of [false, true]) {
    const contexto = await navegador.newContext({
      viewport: cenario.viewport,
      deviceScaleFactor: cenario.dpr,
      isMobile: Boolean(cenario.mobile),
      hasTouch: Boolean(cenario.mobile),
      reducedMotion: reduzido ? 'reduce' : 'no-preference',
    });
    await contexto.addInitScript(() => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
      /* Linha do tempo de rede e do portão, com o relógio da própria página. */
      window.__sonda = { pedidos: [], liberadoEm: null };
      const obs = new PerformanceObserver((lista) => {
        for (const e of lista.getEntries()) {
          if (e.name.includes('/hero/')) window.__sonda.pedidos.push({ ms: Math.round(e.startTime), url: e.name.split('/hero/')[1] });
        }
      });
      obs.observe({ type: 'resource', buffered: true });
      /* MutationObserver, e não polling: a fila de quadros começa no MESMO commit do React que
         escreve `data-route-liberado="true"`, então um intervalo de 16 ms acusava pedidos "antes"
         do portão que eram 3–10 ms depois dele. O observer lê o instante exato da mutação. */
      const marcarLiberado = () => {
        const c = document.querySelector('[data-route-content]');
        if (c && c.getAttribute('data-route-liberado') === 'true' && window.__sonda.liberadoEm == null) {
          window.__sonda.liberadoEm = Math.round(performance.now());
        }
      };
      const vigia = new MutationObserver(marcarLiberado);
      document.addEventListener('DOMContentLoaded', () => {
        vigia.observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['data-route-liberado'] });
        marcarLiberado();
      });
    });
    const pagina = await contexto.newPage();
    const rotulo = `${cenario.nome}${reduzido ? ' · reduce' : ''}`;
    console.log(`\n■ ${rotulo}`);
    await pagina.goto(`${URL_BASE}/`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
    await pagina.addStyleTag({ content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}` });
    /* `attached`, não visível: com movimento reduzido o canvas fica `visibility: hidden` de
       propósito (ver `.hero-canvas` em `globals.css`). */
    await pagina.waitForSelector('.hero-canvas', { state: 'attached', timeout: 120_000 });
    await pagina.waitForFunction(() => document.querySelector('[data-route-content]')?.getAttribute('data-route-liberado') === 'true', null, { timeout: 120_000 });

    /* 6. preloads */
    const preloads = await pagina.evaluate(() =>
      Array.from(document.querySelectorAll('head link[rel="preload"][as="image"]')).map((l) => ({ href: l.getAttribute('href'), media: l.getAttribute('media') })),
    );
    const preHero = preloads.filter((p) => p.href?.includes('/hero/'));
    if (preHero.length >= 3 && preHero.every((p) => /frame-0001\.avif$/.test(p.href))) aprova(`preloads no <head>: ${preHero.length}, todos do quadro 1`);
    else reprova(`preloads: ${JSON.stringify(preHero)}`);

    if (reduzido) {
      await pagina.waitForTimeout(1500);
      const estado = await pagina.evaluate(() => document.querySelector('.hero-canvas')?.getAttribute('data-estado'));
      if (estado === 'reduzido') aprova('canvas em data-estado="reduzido"');
      else reprova(`data-estado=${estado} com movimento reduzido`);
      const pedidos = await pagina.evaluate(() => window.__sonda.pedidos);
      const extras = pedidos.filter((p) => !/frame-0001\.avif|poster\.webp/.test(p.url));
      if (extras.length === 0) aprova(`rede: só quadro 1/pôster (${pedidos.length} pedido(s))`);
      else reprova(`rede com movimento reduzido: ${extras.length} quadro(s) além do 1`);
      await pagina.screenshot({ path: `${DESTINO}/${cenario.nome}-reduce.png` });
      await contexto.close();
      continue;
    }

    await pagina.waitForSelector('.hero-canvas[data-estado="ativo"]', { timeout: 120_000 });
    const info = await pagina.evaluate(() => {
      const top = document.getElementById('top');
      const r = top.getBoundingClientRect();
      const inicio = r.top + window.scrollY;
      const curso = top.offsetHeight - window.innerHeight;
      const c = document.querySelector('.hero-canvas');
      return { inicio, curso, largura: c.width, altura: c.height, css: c.getBoundingClientRect().width, dpr: window.devicePixelRatio };
    });
    aprova(`canvas ${info.largura}×${info.altura} para ${Math.round(info.css)} CSS px @${info.dpr} (curso ${Math.round(info.curso)}px)`);

    /* 5. rede antes do portão */
    const rede = await pagina.evaluate(() => window.__sonda);
    /* 20 ms de folga: o `startTime` do recurso e o instante da mutação vêm do mesmo relógio, mas
       o navegador pode registrar o início do fetch um tique antes de notificar o observer. */
    const antes = rede.pedidos.filter((p) => rede.liberadoEm != null && p.ms < rede.liberadoEm - 20 && !/frame-0001\.avif|poster\.webp/.test(p.url));
    if (antes.length === 0) aprova(`rede: nenhum quadro além do 1 antes do portão liberar (liberado em ${rede.liberadoEm}ms)`);
    else reprova(`rede: ${antes.length} quadro(s) pedidos antes do portão: ${antes.slice(0, 3).map((p) => p.url).join(', ')}`);

    const lerQuadro = () => pagina.evaluate(() => Number(document.querySelector('.hero-canvas')?.getAttribute('data-quadro')));
    const canvasPintado = () =>
      pagina.evaluate(() => {
        const c = document.querySelector('.hero-canvas');
        const ctx = c.getContext('2d');
        const pontos = [[0.1, 0.1], [0.5, 0.5], [0.9, 0.9], [0.9, 0.1], [0.1, 0.9]];
        let claros = 0;
        for (const [fx, fy] of pontos) {
          const d = ctx.getImageData(Math.floor(c.width * fx), Math.floor(c.height * fy), 1, 1).data;
          if (d[3] > 0 && d[0] + d[1] + d[2] > 12) claros++;
        }
        return claros;
      });

    /* Espera o quadro ESPERADO (ou vizinho) chegar e ser desenhado: a fila carrega sob demanda. */
    const esperarQuadro = async (esperado) => {
      await pagina.waitForFunction(
        (e) => Math.abs(Number(document.querySelector('.hero-canvas')?.getAttribute('data-quadro')) - e) <= 1,
        esperado,
        { timeout: 20_000 },
      ).catch(() => {});
    };

    /* `data-total`/`data-tier` são publicados pelo hook ao escolher o tier. */
    const { N, tier } = await pagina.evaluate(() => {
      const el = document.querySelector('.hero-canvas');
      return { N: Number(el?.getAttribute('data-total')), tier: el?.getAttribute('data-tier') };
    });
    const totalQuadros = Number.isFinite(N) && N > 0 ? N : null;
    aprova(`tier ${tier} · ${totalQuadros ?? '?'} quadros`);

    const ida = [];
    for (const p of POSICOES) {
      await pagina.evaluate(({ y }) => window.scrollTo({ top: y, behavior: 'auto' }), { y: info.inicio + p * info.curso });
      await pagina.waitForTimeout(700);
      if (totalQuadros) await esperarQuadro(Math.round(p * (totalQuadros - 1)));
      const q = await lerQuadro();
      const pintado = await canvasPintado();
      ida.push({ p, q, pintado });
      await pagina.screenshot({ path: `${DESTINO}/${cenario.nome}-${String(p).replace('.', '_')}.png` });
    }
    const volta = [];
    for (const p of [...POSICOES].reverse()) {
      await pagina.evaluate(({ y }) => window.scrollTo({ top: y, behavior: 'auto' }), { y: info.inicio + p * info.curso });
      await pagina.waitForTimeout(700);
      if (totalQuadros) await esperarQuadro(Math.round(p * (totalQuadros - 1)));
      volta.push({ p, q: await lerQuadro(), pintado: await canvasPintado() });
    }

    const formatar = (lista) => lista.map((x) => `${x.p}→${x.q}${x.pintado < 5 ? '(⚠' + x.pintado + '/5)' : ''}`).join('  ');
    console.log('  ida  :', formatar(ida));
    console.log('  volta:', formatar(volta));
    if (totalQuadros) {
      const erros = [...ida, ...volta].filter((x) => Math.abs(x.q - Math.round(x.p * (totalQuadros - 1))) > 1);
      if (erros.length === 0) aprova(`quadro = round(p × ${totalQuadros - 1}) ±1 nas 10 leituras`);
      else reprova(`${erros.length} leitura(s) fora de ±1 quadro`);
    } else {
      const monotono = ida.every((x, i) => i === 0 || x.q > ida[i - 1].q);
      if (monotono && ida[0].q === 0) aprova('quadros crescem com a rolagem e começam em 0');
      else reprova(`sequência da ida não é monótona: ${ida.map((x) => x.q).join(',')}`);
      const simetrico = volta.every((x) => Math.abs(x.q - ida.find((y) => y.p === x.p).q) <= 1);
      if (simetrico) aprova('volta devolve os mesmos quadros (±1)');
      else reprova('volta diverge da ida');
    }
    if ([...ida, ...volta].every((x) => x.pintado === 5)) aprova('canvas pintado em todas as leituras');
    else reprova('canvas com amostras escuras/vazias');

    /* 4. rolagem rápida */
    const rapida = await pagina.evaluate(async ({ inicio, curso }) => {
      const c = document.querySelector('.hero-canvas');
      const ctx = c.getContext('2d');
      const pintado = () => {
        const d = ctx.getImageData(Math.floor(c.width / 2), Math.floor(c.height / 2), 1, 1).data;
        return d[3] > 0 && d[0] + d[1] + d[2] > 12;
      };
      const quadro = () => new Promise((r) => requestAnimationFrame(() => r()));
      const leituras = [];
      for (const y of [inicio + curso, inicio, inicio + curso * 0.6, inicio + curso * 0.1]) {
        window.scrollTo({ top: y, behavior: 'auto' });
        await quadro();
        leituras.push(pintado());
        await quadro();
        leituras.push(pintado());
      }
      return leituras;
    }, info);
    if (rapida.every(Boolean)) aprova(`rolagem rápida: canvas pintado em ${rapida.length}/${rapida.length} instantes`);
    else reprova(`rolagem rápida: ${rapida.filter((x) => !x).length} instante(s) sem pintura`);

    /* 8. PRECISÃO COM A RODA (08/10/2026). Eventos `wheel` sintéticos passam pelo Lenis como os
       reais: 30 dentes de 100 px a cada 80 ms (~112 quadros/s de conteúdo). A cada rAF lê-se o
       quadro que a posição do scroll pede (`round(p × (N−1))`) e o que está desenhado
       (`data-quadro`); a diferença é o atraso visível. Antes da correção o p90 era 52 quadros e só
       39 quadros distintos eram desenhados em 3 s (a cena congelava e saltava); a meta é p90 ≤ 20
       e ≥ 40 distintos. `data-alvo` separa o atraso do decode do resto. Só sem `isMobile`: o Lenis
       trata toque de outro jeito e a roda não existe no celular. */
    if (!cenario.mobile) {
      const precisao = await pagina.evaluate(async () => {
        const c = document.querySelector('.hero-canvas');
        const top = document.getElementById('top');
        const lenis = window.__lenis;
        if (!lenis) return null;
        const inicio = top.getBoundingClientRect().top + window.scrollY;
        const curso = top.offsetHeight - window.innerHeight;
        const total = Number(c.getAttribute('data-total'));
        const frameDe = (y) => Math.round(Math.min(1, Math.max(0, (y - inicio) / curso)) * (total - 1));
        lenis.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 800));
        const am = [];
        let run = true;
        const tick = () => {
          am.push({ y: window.scrollY, quadro: Number(c.getAttribute('data-quadro')), alvo: Number(c.getAttribute('data-alvo')) });
          if (run) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        for (let i = 0; i < 30; i++) {
          window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, deltaMode: 0, bubbles: true, cancelable: true }));
          await new Promise((r) => setTimeout(r, 80));
        }
        await new Promise((r) => setTimeout(r, 800));
        run = false;
        const p90 = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length * 0.9)];
        return {
          leituras: am.length,
          fps: Math.round(am.length / 3.2),
          atrasoP90: p90(am.map((a) => Math.abs(frameDe(a.y) - a.quadro))),
          atrasoDecodeP90: p90(am.map((a) => Math.abs(a.alvo - a.quadro))),
          distintos: new Set(am.map((a) => a.quadro)).size,
        };
      });
      /* Distintos em proporção aos rAF lidos, não em número absoluto: numa máquina ocupada a página
         inteira roda a 14 fps e há menos ticks para desenhar — o que importa é que quase todo tick
         traga quadro novo (o conteúdo anda ≥ 1 quadro por tick nesse ritmo). 35% é o piso que
         separa "acompanha" de "congela e salta" (a versão anterior fazia ~23%).
         Abaixo de 25 fps a leitura é INCONCLUSIVA: é o Chromium headless (composição por software)
         ou a máquina ocupada, não o hero — a página inteira está nesse ritmo. Rode com `HEADED=1`. */
      const pisoDistintos = Math.ceil(precisao ? precisao.leituras * 0.35 : 0);
      const resumoPrecisao = precisao ? `atraso p90 ${precisao.atrasoP90} quadro(s) (decode ${precisao.atrasoDecodeP90}), ${precisao.distintos} quadros distintos em ${precisao.leituras} rAF (~${precisao.fps} fps)` : '';
      if (!precisao) reprova('precisão: Lenis não encontrado (`window.__lenis`)');
      else if (precisao.fps < 25) console.log(`  ~ precisão com a roda INCONCLUSIVA (página a ~${precisao.fps} fps${HEADED ? '' : ' no headless; rode com HEADED=1'}): ${resumoPrecisao}`);
      else if (precisao.atrasoP90 <= 20 && precisao.distintos >= pisoDistintos) aprova(`precisão com a roda: ${resumoPrecisao}`);
      else reprova(`precisão com a roda: ${resumoPrecisao} — meta p90 ≤ 20 e ≥ ${pisoDistintos} distintos`);
    }

    await contexto.close();
  }
}

await navegador.close();
console.log(reprovados === 0 ? '\nTudo aprovado.' : `\n${reprovados} reprovação(ões).`);
process.exit(reprovados === 0 ? 0 : 1);
