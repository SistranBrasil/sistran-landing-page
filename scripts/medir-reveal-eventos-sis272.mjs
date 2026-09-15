/**
 * SIS-272 — «/eventos-inovacao · reveal on scroll (docs/scroll.md)».
 *
 *   node scripts/medir-reveal-eventos-sis272.mjs
 *
 * O portão desta issue NÃO é «existe `data-reveal` no JSX». A issue proíbe uma
 * coisa nomeada — «todos no load» — e essa proibição só se verifica com uma LINHA
 * DO TEMPO: para cada escopo marcado, em que `scrollY` ele recebeu
 * `data-in="true"`. Captura isolada não distingue «entrou ao rolar» de «já estava
 * lá», e é por isso que a varredura existe.
 *
 * ── AS TRÊS COISAS QUE ESTA SONDA JÁ DERRUBOU ────────────────────────────────
 * Ficam registradas porque foram apuradas AQUI, contra a página, e nenhuma delas
 * era visível lendo o JSX:
 *
 * 1. O CONTADOR ACENDIA EM `scrollY` 7800 — no fim da cena, não no começo. Ele
 *    mora dentro do palco `sticky`, e nó preso em `sticky` não rola: ele congela
 *    a 827px do topo da janela, e a raiz encolhida pela margem de `-12%` tem
 *    792px. A raiz nunca o alcançava enquanto o palco estava preso. A correção
 *    está em `src/app/eventos-inovacao/reveal-calibre.ts`
 *    (`MARGEM_REVEAL_NO_PALCO`), e o número velho fica aqui para que a próxima
 *    pessoa que pensar em «padronizar todas as margens» saiba o que quebra.
 * 2. OS DOIS ESCOPOS DA DOBRA. A abertura desta rota mede 414px numa janela de
 *    900, então a cena começa em 558 e o que está no topo dela está DENTRO da
 *    primeira dobra. Foi essa medida que pôs `esperarRota` na régua e no
 *    cabeçalho estreito — sem ela, os dois acendem atrás da cortina do
 *    `RouteLoadGate` e a entrada existe sem ninguém ver. É o que `ordemCortina`
 *    confere, com um `MutationObserver` instalado antes de qualquer script.
 * 3. A AUSÊNCIA DE UM QUARTO BLOCO. `blocosAbaixoDaDobra` lista, por largura, o
 *    que nasce abaixo da dobra e quem já é dono da própria entrada. É o
 *    inventário que sustenta a decisão de marcar três nós e não mais.
 *
 * ── O QUE MAIS SE MEDE, E POR QUE CADA UM ────────────────────────────────────
 *
 * AS AUSÊNCIAS. A rota é feita de mecanismos que já são donos da própria entrada,
 * e o §6 de `docs/scroll.md` proíbe somar reveal a eles («não misture os dois no
 * mesmo elemento»): o hero (`#topo`, candidato a LCP), as previews
 * (`.eventos-vaga`, que flutuam e giram desde a SIS-167), o cartão central
 * (`aria-live`, remonta a cada troca), a faixa do carrossel estreito (dono do
 * estado por `scrollLeft`), a barra de controles (relógio do laço) e `#social`
 * (`whileInView`). Para todos, o portão é a contagem ZERO de `[data-reveal]`.
 *
 * O PALCO `STICKY` TEM PORTÃO PRÓPRIO, e ele NÃO é «nenhum `data-reveal` aqui
 * dentro» — o contador está lá dentro de propósito. O que quebraria o `sticky` é
 * `transform` num ANCESTRAL (ancestral transformado vira o bloco de contenção, e
 * o elemento passa a grudar dentro dele em vez de na janela). Então o que se
 * confere é: o palco não é marcado ELE MESMO, e nenhum ancestral dele tem
 * `transform` computado. Mais a prova direta — durante a varredura, quantos
 * passos o palco passou com o topo em 0.
 *
 * O SPOTLIGHT INTACTO. Na MESMA varredura que monta a linha do tempo lê-se o
 * número do contador. Se o `IntersectionObserver` das quinze sentinelas tivesse
 * quebrado, ele não sairia de `01`. Sai do mesmo instante que o resto: se cada
 * número viesse de uma corrida, a comparação seria entre duas páginas.
 *
 * O CONTADOR NUNCA ESCONDIDO EM QUADRO. O bloco marcado é o indicador de posição
 * e a instrução da cena, então a pergunta não é só «acende?», é «ficou apagado
 * enquanto estava em quadro?». A varredura conta os passos em que ele está dentro
 * da janela COM opacidade abaixo de 0.5 — a janela da própria entrada, e nada
 * além dela.
 *
 * AS DUAS SAÍDAS DE MOVIMENTO REDUZIDO, medidas separadamente porque são duas
 * chaves diferentes no `globals.css` e já houve issue perdida por mexer numa só:
 * `prefers-reduced-motion: reduce` (mídia) e `html[data-motion="reduce"]` (o
 * diálogo da própria página). Nas duas se lê opacidade, `transform` E
 * `transitionDuration`/`transitionDelay` — «só encurtar transições» é o erro que
 * o §9 do guia nomeia, e opacidade certa lida tarde demais esconderia um atraso.
 *
 * SEM JAVASCRIPT. `data-in` só existe depois do gatilho montar, então o HTML do
 * servidor tem de sair sem ele e com o conteúdo visível (§2.3 e item 2 do §8).
 *
 * A REGRESSÃO DE GEOMETRIA DA SIS-166/167/232/268 NÃO É MEDIDA AQUI de propósito:
 * quem mede é `scripts/medir-cena-eventos.mjs`, que já afere as cinco janelas, a
 * partitura dos quinze e as asserções de vaga/faixa. Reescrever aquilo aqui
 * criaria uma segunda definição da mesma invariante.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const ROTA = `${BASE}/eventos-inovacao`;
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

/* Os nós que a issue nomeia, pelos seletores que existem na página. NÃO inclui o
   palco `sticky`: ele tem portão próprio, pela razão do cabeçalho. */
const PROIBIDOS = {
  hero: '#topo',
  cartaoCentral: '.eventos-destaque-cartao',
  previews: '.eventos-destaque-coluna',
  faixaDoCarrossel: '.eventos-lista-itens',
  controlesDoCarrossel: '.eventos-lista-controles',
  social: '#social',
};

const nav = await chromium.launch();
const res = {
  rota: ROTA,
  desktop: { janela: DESKTOP },
  mobile: { janela: MOBILE },
  erros: [],
};

/** Dispensa o diálogo de preferência de movimento, que cobriria a cena. */
const semDialogo = (ctx) =>
  ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));

/**
 * Registra os dois instantes que provam que a entrada dos escopos da DOBRA foi
 * vista: quando a cortina do `RouteLoadGate` levantou, e quando o primeiro escopo
 * acendeu. Instalado antes de qualquer script da página; se um escopo acendesse
 * ANTES da cortina, a entrada teria acontecido no escuro — o defeito que a
 * SIS-263 (2ª volta) descreve e que `esperarRota` existe para evitar.
 */
const espiarCortina = (p) =>
  p.addInitScript(() => {
    window.__sis272 = { liberado: null, aceso: null, primeiro: null };
    const obs = new MutationObserver(() => {
      const m = window.__sis272;
      if (m.liberado === null && document.querySelector('[data-route-content][data-route-liberado="true"]')) {
        m.liberado = performance.now();
      }
      if (m.aceso === null) {
        const n = document.querySelector('[data-reveal-nome][data-in="true"]');
        if (n) {
          m.aceso = performance.now();
          m.primeiro = n.getAttribute('data-reveal-nome');
        }
      }
    });
    document.addEventListener('DOMContentLoaded', () =>
      obs.observe(document.documentElement, { subtree: true, attributes: true, childList: true }));
  });

async function abrir(p, url = ROTA) {
  await p.goto(url, { waitUntil: 'networkidle' });
  await p
    .waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 40000 })
    .catch(() => null);
  await p.waitForTimeout(1400);
}

const lerCortina = (p) =>
  p.evaluate(() => {
    const m = window.__sis272 ?? {};
    return {
      msCortinaLevantou: m.liberado === null || m.liberado === undefined ? null : Math.round(m.liberado),
      msPrimeiroEscopoAcendeu: m.aceso === null || m.aceso === undefined ? null : Math.round(m.aceso),
      primeiroEscopo: m.primeiro ?? null,
      acendeuDepoisDaCortina:
        m.liberado != null && m.aceso != null ? m.aceso >= m.liberado : null,
    };
  });

/** Caixa absoluta de um seletor, ou `'sem caixa'` quando ele está sob `display: none`. */
const CAIXA = `(s) => {
  const n = document.querySelector(s);
  if (!n) return null;
  const r = n.getBoundingClientRect();
  if (!r.width && !r.height) return 'sem caixa';
  return {
    topoAbsoluto: Math.round(r.top + window.scrollY),
    altura: Math.round(r.height * 100) / 100,
    largura: Math.round(r.width),
  };
}`;

/**
 * A varredura. Passo de 100px: fino o bastante para separar dois escopos que
 * acendem em gestos diferentes, e grosso o bastante para uma seção de ~8.100px
 * caber num tempo de bancada.
 *
 * Cada passo devolve do MESMO instante: quais escopos já estão acesos, onde está
 * o topo do palco `sticky`, que número o contador mostra, e se o contador está em
 * quadro apagado. Lê-las juntas é o que permite dizer que o reveal aconteceu SEM
 * que o spotlight mudasse de comportamento.
 */
async function varrer(p, alturaTotal, passo = 100) {
  const linhaDoTempo = [];
  const jaAceso = new Set();
  const contadorVisto = new Set();
  let passosGrudado = 0;
  let passosComPalcoEmQuadro = 0;
  let passosContadorEmQuadroApagado = 0;

  for (let y = 0; y <= alturaTotal; y += passo) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(110);
    const lido = await p.evaluate(() => {
      const emQuadro = (r) => r.bottom > 0 && r.top < window.innerHeight && (r.width || r.height);
      const palco = document.querySelector('.eventos-destaque-palco');
      const contador = document.querySelector('.eventos-destaque-contador');
      const rc = contador?.getBoundingClientRect();
      return {
        scrollY: Math.round(window.scrollY),
        acesos: [...document.querySelectorAll('[data-reveal-nome]')]
          .filter((n) => n.dataset.in === 'true')
          .map((n) => n.dataset.revealNome),
        topoPalco:
          palco && palco.offsetParent ? Math.round(palco.getBoundingClientRect().top) : null,
        palcoEmQuadro: !!(palco && palco.offsetParent && emQuadro(palco.getBoundingClientRect())),
        contador: document
          .querySelector('.eventos-destaque-contador-numero')
          ?.textContent?.trim() ?? null,
        contadorEmQuadroApagado: !!(
          contador &&
          rc &&
          emQuadro(rc) &&
          Number(getComputedStyle(contador).opacity) < 0.5
        ),
      };
    });

    for (const nome of lido.acesos) {
      if (jaAceso.has(nome)) continue;
      jaAceso.add(nome);
      linhaDoTempo.push({ nome, scrollY: lido.scrollY });
    }
    if (lido.palcoEmQuadro) {
      passosComPalcoEmQuadro += 1;
      if (Math.abs(lido.topoPalco) <= 1) passosGrudado += 1;
    }
    if (lido.contador) contadorVisto.add(lido.contador.replace(/\s+/g, ' '));
    if (lido.contadorEmQuadroApagado) passosContadorEmQuadroApagado += 1;
  }

  return {
    linhaDoTempo,
    sticky: {
      passosComPalcoEmQuadro,
      passosGrudadoNoTopo: passosGrudado,
      pxDeRolagemComOPalcoPreso: passosGrudado * passo,
    },
    contadorDistintos: [...contadorVisto],
    passosContadorEmQuadroApagado,
  };
}

/* ── 1. DESKTOP · linha do tempo, sticky, contador, geometria, ausências ───── */
{
  const ctx = await nav.newContext({ viewport: DESKTOP });
  await semDialogo(ctx);
  const p = await ctx.newPage();
  p.on('console', (m) => {
    if (m.type() === 'error') res.erros.push(`[desktop] ${m.text()}`);
  });
  await espiarCortina(p);
  await abrir(p);
  res.desktop.ordemCortina = await lerCortina(p);

  /* Estado NO TOPO da rota, antes de qualquer rolagem: o outro lado da proibição.
     Mede-se `data-in` E a opacidade computada do nó marcado, porque `data-in` é a
     marca e a opacidade é o efeito — os dois têm de contar a mesma história. */
  res.desktop.noTopo = await p.evaluate(() =>
    [...document.querySelectorAll('[data-reveal-nome]')].map((n) => {
      const alvo = n.querySelector('[data-reveal]');
      const r = n.getBoundingClientRect();
      return {
        nome: n.dataset.revealNome,
        dataIn: n.dataset.in ?? null,
        preset: alvo?.getAttribute('data-reveal') ?? null,
        opacidadeDoAlvo: alvo ? getComputedStyle(alvo).opacity : null,
        temCaixa: !!(r.width || r.height),
        dentroDaPrimeiraDobra: !!(r.width || r.height) && r.top < window.innerHeight,
      };
    }),
  );

  res.desktop.geometria = await p.evaluate((fn) => {
    const c = eval(fn);
    return {
      hero: c('#topo'),
      secao: c('.eventos-destaque'),
      escopoDaRegua: c('.eventos-destaque-fio-escopo'),
      regua: c('.eventos-destaque-fio'),
      palco: c('.eventos-destaque-palco'),
      contador: c('.eventos-destaque-contador'),
      social: c('#social'),
      alturaDaJanela: window.innerHeight,
      alturaDaPagina: document.documentElement.scrollHeight,
    };
  }, CAIXA);

  /* O PORTÃO DO `STICKY`: o palco não é marcado ele mesmo, e nenhum ancestral
     dele carrega `transform` computado — que é o que o transformaria em bloco de
     contenção e faria o `sticky` grudar dentro dele em vez de na janela. */
  res.desktop.stickyIntacto = await p.evaluate(() => {
    const palco = document.querySelector('.eventos-destaque-palco');
    const ancestraisComTransform = [];
    for (let n = palco?.parentElement; n; n = n.parentElement) {
      const t = getComputedStyle(n).transform;
      if (t && t !== 'none') ancestraisComTransform.push(`${n.tagName.toLowerCase()}.${n.className}`);
    }
    return {
      palcoMarcadoEleMesmo: document.querySelectorAll('.eventos-destaque-palco[data-reveal]').length,
      ancestraisComTransform,
      positionComputado: palco ? getComputedStyle(palco).position : null,
      /* Informativo: o contador está DENTRO do palco de propósito, e um
         `transform` em descendente não muda o bloco de contenção do `sticky`. */
      marcadosDentroDoPalco: document.querySelectorAll('.eventos-destaque-palco [data-reveal]').length,
    };
  });

  const v = await varrer(p, res.desktop.geometria.alturaDaPagina);
  res.desktop.linhaDoTempo = v.linhaDoTempo;
  res.desktop.sticky = v.sticky;
  res.desktop.contadorDistintos = v.contadorDistintos;
  res.desktop.passosContadorEmQuadroApagado = v.passosContadorEmQuadroApagado;

  res.desktop.semSegundoReveal = await p.evaluate(
    (sel) =>
      Object.fromEntries(
        Object.entries(sel).map(([k, s]) => [
          k,
          document.querySelectorAll(`${s} [data-reveal]`).length,
        ]),
      ),
    PROIBIDOS,
  );

  /* A CADÊNCIA DA SOCIAL, que NÃO é marcada. Mede-se o `<h2>`, e não o
     `.palco-copy` que o envolve: `vHeader` é variant de ORQUESTRAÇÃO
     (`hidden: {}`) e devolve opacidade 1 sempre — ler o invólucro aprovaria
     qualquer coisa. É a prova de que o fecho da rota já entra por rolagem, e de
     que somar `data-reveal` ali seria o segundo dono do mesmo `transform`. */
  res.desktop.fechoPorScroll = await (async () => {
    const p2 = await ctx.newPage();
    await abrir(p2);
    const op = () =>
      p2.evaluate(() => Number(getComputedStyle(document.querySelector('#social h2')).opacity));
    const saida = { opacidadeNoTopo: await op(), scrollYQuandoAcendeu: null };
    for (let y = 0; y <= res.desktop.geometria.alturaDaPagina; y += 100) {
      await p2.evaluate((t) => window.scrollTo(0, t), y);
      await p2.waitForTimeout(140);
      if ((await op()) > 0.9) {
        saida.scrollYQuandoAcendeu = y;
        break;
      }
    }
    await p2.close();
    return saida;
  })();

  /* Capturas do MESMO gesto, antes e depois. Uma captura só não distinguiria
     «entrou ao rolar» de «já estava lá», que é o que a issue proíbe. */
  const yDe = (nome) => res.desktop.linhaDoTempo.find((l) => l.nome === nome)?.scrollY ?? 0;
  for (const [rotulo, y, espera] of [
    ['topo', 0, 700],
    ['contador-antes', Math.max(0, yDe('eventos-contador') - 200), 500],
    ['contador-depois', yDe('eventos-contador') + 60, 1300],
    ['cena-no-meio', Math.round(res.desktop.geometria.secao.altura / 2), 900],
  ]) {
    await p.evaluate((t) => window.scrollTo(0, t), y);
    await p.waitForTimeout(espera);
    await p.screenshot({
      path: `docs/capturas/sis272-eventos-1440-${rotulo}.png`,
      clip: { x: 0, y: 0, ...DESKTOP },
    });
  }

  await ctx.close();
}

/* ── 2. DESKTOP · movimento reduzido pela MÍDIA ────────────────────────────── */
const lerReduce = (p) =>
  p.evaluate(() =>
    [...document.querySelectorAll('[data-reveal]')].map((n) => {
      const e = getComputedStyle(n);
      return {
        preset: n.getAttribute('data-reveal'),
        opacidade: e.opacity,
        transform: e.transform,
        transitionDuration: e.transitionDuration,
        transitionDelay: e.transitionDelay,
      };
    }),
  );

{
  const ctx = await nav.newContext({ viewport: DESKTOP, reducedMotion: 'reduce' });
  await semDialogo(ctx);
  const p = await ctx.newPage();
  await abrir(p);
  res.desktop.reduceMidia = await lerReduce(p);
  /* Também no fim da rota: um bloco que só aparece depois de rolar não pode ficar
     escondido para quem pediu menos movimento (item 6 do §8). */
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(700);
  res.desktop.reduceMidiaNoFim = await lerReduce(p);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(500);
  await p.screenshot({
    path: 'docs/capturas/sis272-eventos-1440-reduce-midia.png',
    clip: { x: 0, y: 0, ...DESKTOP },
  });
  await ctx.close();
}

/* ── 3. DESKTOP · movimento reduzido pelo ATRIBUTO (diálogo da página) ─────── */
{
  const ctx = await nav.newContext({ viewport: DESKTOP });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', 'reduce');
  });
  const p = await ctx.newPage();
  await abrir(p);
  await p.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
  await p.waitForTimeout(500);
  res.desktop.reduceAtributo = {
    atributoNoHtml: await p.evaluate(() => document.documentElement.getAttribute('data-motion')),
    nos: await lerReduce(p),
  };
  await p.screenshot({
    path: 'docs/capturas/sis272-eventos-1440-reduce-atributo.png',
    clip: { x: 0, y: 0, ...DESKTOP },
  });
  await ctx.close();
}

/* ── 4. DESKTOP · sem JavaScript ───────────────────────────────────────────── */
{
  const ctx = await nav.newContext({ viewport: DESKTOP, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(ROTA, { waitUntil: 'load' });
  const html = await p.content();
  res.semJs = {
    nosMarcadosNoHtmlDoServidor: html.split('data-reveal=').length - 1,
    escoposNoHtmlDoServidor: html.split('data-reveal-nome=').length - 1,
    /* `data-in` no HTML do servidor seria o defeito: o estado escondido só pode
       existir quando há JavaScript vivo para desfazê-lo (§2.3 de `docs/scroll.md`). */
    dataInNoHtmlDoServidor: html.split('data-in=').length - 1,
    opacidades: await p
      .evaluate(() =>
        [...document.querySelectorAll('[data-reveal]')].map((n) => getComputedStyle(n).opacity),
      )
      .catch(() => 'evaluate indisponível sem JS'),
  };
  await p.screenshot({
    path: 'docs/capturas/sis272-eventos-1440-sem-js.png',
    clip: { x: 0, y: 0, ...DESKTOP },
  });
  await ctx.close();
}

/* ── 5. MOBILE 390×844 · linha do tempo e carrossel intacto ────────────────── */
/**
 * ⚠️ `hasTouch: true` SEM `isMobile: true`, e isto não é descuido — é uma
 * armadilha que esta sonda já caiu dentro e que invalidaria TODA a leitura de
 * mobile. Com `isMobile: true` o Chromium emulado abre a rota num viewport de
 * LAYOUT de 1560×3376 (quatro vezes o pedido), enquanto `visualViewport` continua
 * em 844. A geometria dos elementos não muda — `#social` fica em 1397 nos dois
 * casos —, mas a RAIZ de todo `IntersectionObserver` da página passa a ter 3.376px
 * de altura. Consequência medida: tudo intersecta no carregamento, o `whileInView`
 * da Social acende com opacidade 1 no topo, e a sonda aprovaria uma rota em que
 * nada entra por rolagem. Sem `isMobile`, os mesmos nós dão 844 de janela e a
 * Social nasce em `opacity: 0`, como deve.
 * `hasTouch` fica porque o carrossel responde a `pointer*` e a faixa é rolada com
 * o dedo; ele não mexe no viewport de layout (conferido nos três arranjos).
 */
{
  const ctx = await nav.newContext({ viewport: MOBILE, hasTouch: true });
  await semDialogo(ctx);
  const p = await ctx.newPage();
  p.on('console', (m) => {
    if (m.type() === 'error') res.erros.push(`[mobile] ${m.text()}`);
  });
  await espiarCortina(p);
  await abrir(p);
  res.mobile.ordemCortina = await lerCortina(p);

  res.mobile.geometria = await p.evaluate((fn) => {
    const c = eval(fn);
    return {
      hero: c('#topo'),
      cenaDesktop: c('.eventos-destaque'),
      lista: c('.eventos-lista'),
      cabecalho: c('.eventos-lista-cabecalho'),
      faixa: c('.eventos-lista-itens'),
      controles: c('.eventos-lista-controles'),
      social: c('#social'),
      alturaDaJanela: window.innerHeight,
      alturaDaPagina: document.documentElement.scrollHeight,
    };
  }, CAIXA);

  res.mobile.noTopo = await p.evaluate(() =>
    [...document.querySelectorAll('[data-reveal-nome]')].map((n) => {
      const alvo = n.querySelector('[data-reveal]');
      const r = n.getBoundingClientRect();
      return {
        nome: n.dataset.revealNome,
        dataIn: n.dataset.in ?? null,
        opacidadeDoAlvo: alvo ? getComputedStyle(alvo).opacity : null,
        /* Só o escopo da versão estreita tem caixa aqui: os dois da cena estão sob
           o `display: none` do desktop, e é isso que `temCaixa: false` diz. */
        temCaixa: !!(r.width || r.height),
        dentroDaPrimeiraDobra: !!(r.width || r.height) && r.top < window.innerHeight,
      };
    }),
  );

  const v = await varrer(p, res.mobile.geometria.alturaDaPagina, 80);
  res.mobile.linhaDoTempo = v.linhaDoTempo;

  res.mobile.semSegundoReveal = await p.evaluate(
    (sel) =>
      Object.fromEntries(
        Object.entries(sel).map(([k, s]) => [
          k,
          document.querySelectorAll(`${s} [data-reveal]`).length,
        ]),
      ),
    PROIBIDOS,
  );

  /* A CADÊNCIA QUE A ROTA TEM ABAIXO DE 1024px, e que não é desta issue: o fecho.
     Ele começa em 1397 numa janela de 844, então é o bloco que se alcança
     ROLANDO — e ele já entra por `whileInView`. Fica medido para que a ausência de
     um quarto `data-reveal` aqui não seja lida como esquecimento. */
  res.mobile.fechoPorScroll = await (async () => {
    const p2 = await ctx.newPage();
    await abrir(p2);
    const op = () =>
      p2.evaluate(() => Number(getComputedStyle(document.querySelector('#social h2')).opacity));
    const saida = { opacidadeNoTopo: await op(), scrollYQuandoAcendeu: null };
    for (let y = 0; y <= res.mobile.geometria.alturaDaPagina; y += 80) {
      await p2.evaluate((t) => window.scrollTo(0, t), y);
      await p2.waitForTimeout(140);
      if ((await op()) > 0.9) {
        saida.scrollYQuandoAcendeu = y;
        break;
      }
    }
    await p2.close();
    return saida;
  })();

  /* O CARROSSEL CONTINUA ANDANDO SOZINHO. A faixa é trazida à janela (o autoplay
     só corre com ela em quadro, por `emQuadro`) e espera-se mais que o intervalo
     de 6s do laço. `scrollLeft` saindo de 0 é a prova de que nem o escopo novo nem
     a marcação do cabeçalho tocaram o dono do estado da faixa. */
  await p.evaluate(() => {
    const faixa = document.querySelector('.eventos-lista-itens');
    if (faixa) faixa.scrollIntoView({ block: 'center', behavior: 'auto' });
  });
  await p.waitForTimeout(700);
  const lerFaixa = () =>
    p.evaluate(() => ({
      scrollLeft: Math.round(document.querySelector('.eventos-lista-itens')?.scrollLeft ?? -1),
      marcaAtiva: [...document.querySelectorAll('.eventos-lista-bussola-marca')].findIndex(
        (n) => n.dataset.estado === 'ativo',
      ),
    }));
  const antes = await lerFaixa();
  await p.waitForTimeout(8200);
  const depois = await lerFaixa();
  res.mobile.carrossel = {
    antes,
    depoisDe8s: depois,
    autoplayAndou: depois.scrollLeft > antes.scrollLeft,
    marcaAcompanhou: depois.marcaAtiva > antes.marcaAtiva,
  };

  const yCab = res.mobile.linhaDoTempo.find((l) => l.nome === 'eventos-lista-cabecalho')?.scrollY ?? 0;
  for (const [rotulo, y, espera] of [
    ['topo', 0, 700],
    ['cabecalho', yCab, 1200],
    ['carrossel', Math.max(0, res.mobile.geometria.faixa.topoAbsoluto - 120), 900],
    ['fecho', Math.max(0, res.mobile.geometria.social.topoAbsoluto - 200), 1200],
  ]) {
    await p.evaluate((t) => window.scrollTo(0, t), y);
    await p.waitForTimeout(espera);
    await p.screenshot({
      path: `docs/capturas/sis272-eventos-390-${rotulo}.png`,
      clip: { x: 0, y: 0, ...MOBILE },
    });
  }
  await ctx.close();
}

/* ── 6. MOBILE · movimento reduzido pela MÍDIA ─────────────────────────────── */
{
  /* Sem `isMobile`, pela mesma razão do bloco 5. */
  const ctx = await nav.newContext({
    viewport: MOBILE,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  await semDialogo(ctx);
  const p = await ctx.newPage();
  await abrir(p);
  res.mobile.reduceMidia = await lerReduce(p);
  await p.screenshot({
    path: 'docs/capturas/sis272-eventos-390-reduce-midia.png',
    clip: { x: 0, y: 0, ...MOBILE },
  });
  await ctx.close();
}

await nav.close();

/* ── VEREDITO ──────────────────────────────────────────────────────────────── */
const y = (lista, nome) => lista.find((l) => l.nome === nome)?.scrollY ?? null;
const yRegua = y(res.desktop.linhaDoTempo, 'eventos-fio');
const yContador = y(res.desktop.linhaDoTempo, 'eventos-contador');
const yCabecalho = y(res.mobile.linhaDoTempo, 'eventos-lista-cabecalho');
const todosReduce = [
  ...res.desktop.reduceMidia,
  ...res.desktop.reduceMidiaNoFim,
  ...res.desktop.reduceAtributo.nos,
  ...res.mobile.reduceMidia,
];
const paradoNoLugar = (t) => t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)';
const ms = (v) =>
  Math.max(
    ...String(v)
      .split(',')
      .map((s) => (s.trim().endsWith('ms') ? parseFloat(s) : parseFloat(s) * 1000)),
  );

res.veredito = {
  /* ── Critério 1 · cadência, não «tudo no load» ─────────────────────────── */
  contadorAcendeuAoRolar: yContador !== null && yContador > 0,
  reguaEContadorEmGestosDiferentes:
    yRegua !== null && yContador !== null && yContador - yRegua >= 240,
  distanciaEntreOsDoisEscoposDesktop:
    yRegua !== null && yContador !== null ? yContador - yRegua : null,
  /* Os escopos da DOBRA acendem em 0 por geometria da rota (abertura de 414px),
     e o que prova que a entrada deles foi VISTA é a ordem contra a cortina. */
  escoposDaDobraEsperaramACortina:
    res.desktop.ordemCortina.acendeuDepoisDaCortina === true &&
    res.mobile.ordemCortina.acendeuDepoisDaCortina === true,
  cabecalhoEstreitoAcendeu: yCabecalho !== null,

  /* ── Critério 2 · spotlight intacto ───────────────────────────────────── */
  palcoNaoFoiMarcado: res.desktop.stickyIntacto.palcoMarcadoEleMesmo === 0,
  nenhumAncestralDoPalcoComTransform:
    res.desktop.stickyIntacto.ancestraisComTransform.length === 0,
  palcoContinuaSticky: res.desktop.stickyIntacto.positionComputado === 'sticky',
  palcoGrudouNoTopo: res.desktop.sticky.passosGrudadoNoTopo > 0,
  contadorPercorreuOsQuinze:
    res.desktop.contadorDistintos.some((t) => t.startsWith('01')) &&
    res.desktop.contadorDistintos.some((t) => t.startsWith('15')),
  contadorNaoFicouApagadoEmQuadro: res.desktop.passosContadorEmQuadroApagado <= 2,

  /* ── Critério 3 · carrossel ───────────────────────────────────────────── */
  carrosselAndouSozinho: res.mobile.carrossel.autoplayAndou,
  marcasAcompanharam: res.mobile.carrossel.marcaAcompanhou,

  /* ── Ausências ────────────────────────────────────────────────────────── */
  semRevealNosProibidos: Object.entries(res.desktop.semSegundoReveal)
    .concat(Object.entries(res.mobile.semSegundoReveal))
    .every(([, n]) => n === 0),

  /* ── Régua no lugar ───────────────────────────────────────────────────── */
  reguaNoTopoDaSecao:
    res.desktop.geometria.regua?.topoAbsoluto === res.desktop.geometria.secao?.topoAbsoluto &&
    res.desktop.geometria.regua?.altura === 3 &&
    res.desktop.geometria.regua?.largura === res.desktop.geometria.secao?.largura,
  escopoDaReguaTemArea: (res.desktop.geometria.escopoDaRegua?.altura ?? 0) > 0,

  /* ── Critério 4 · acessibilidade ──────────────────────────────────────── */
  reduceMostraTudoSemMovimento: todosReduce.every(
    (n) => Number(n.opacidade) === 1 && paradoNoLugar(n.transform),
  ),
  reduceSemEspera: todosReduce.every((n) => ms(n.transitionDuration) <= 1),
  semJsMostraConteudo:
    res.semJs.dataInNoHtmlDoServidor === 0 && res.semJs.nosMarcadosNoHtmlDoServidor > 0,

  semErrosDeConsole: res.erros.length === 0,
};

await writeFile('docs/medidas/reveal-eventos-sis272.json', `${JSON.stringify(res, null, 1)}\n`);
console.log(
  JSON.stringify(
    {
      linhaDoTempoDesktop: res.desktop.linhaDoTempo,
      linhaDoTempoMobile: res.mobile.linhaDoTempo,
      ordemCortina: { desktop: res.desktop.ordemCortina, mobile: res.mobile.ordemCortina },
      fechoPorScroll: { desktop: res.desktop.fechoPorScroll, mobile: res.mobile.fechoPorScroll },
      sticky: res.desktop.sticky,
      stickyIntacto: res.desktop.stickyIntacto,
      carrossel: res.mobile.carrossel,
      veredito: res.veredito,
      erros: res.erros,
    },
    null,
    1,
  ),
);
