/**
 * SIS-184 — mede o CONTRASTE do indicador lateral (`ui/ScrollSpy`) parada por
 * parada da home, contra o pixel que está atrás do rótulo naquele instante.
 *
 * Por que uma sonda, e não leitura de CSS: o `tom` de `pageSections.ts` só
 * descreve o fundo da margem esquerda, e depois da SIS-230 a home mostra ali o
 * PLANO da `<main>` (`background-attachment: fixed`), não a cor da seção. O
 * `backgroundColor` computado da faixa devolve `transparent` nesse arranjo — é a
 * mesma armadilha registrada na SIS-204 —, então quem responde «claro ou escuro
 * sob este rótulo» é o pixel da captura, na janela, com a parada ATIVA.
 *
 * Três decisões de método que mudam o número:
 *
 *   1. JANELA, nunca `fullPage`. O plano é ancorado na janela e o Chromium não o
 *      pinta ao longo de uma captura de página inteira (SIS-204): o resto do
 *      arquivo sai com o azul cru do `body` e inventaria uma regressão.
 *   2. A PARADA tem de estar ATIVA. Rótulo inativo é `opacity: 0` e, pior, o par
 *      de cores do ativo é outro. A sonda rola até a seção e confirma pelo
 *      `aria-current` antes de medir — não presume qual acendeu.
 *   3. PIOR PIXEL, além da média. O rótulo tem 11px com `tracking` largo: a média
 *      da vizinhança dilui a franja de antialiasing e SUPERESTIMA o contraste.
 *      Amostra-se a moldura ao redor da tinta (acima, abaixo e à esquerda), e
 *      reporta-se o par (pior, média). O portão de 4,5:1 vale sobre o PIOR.
 *
 * A largura é 1440 porque abaixo disso o CSS da SIS-170 RECOLHE o rótulo do
 * fluxo; o critério da issue fala em ≥1280, e 1280 entra como segunda largura só
 * para registrar que ali o rótulo não tem caixa a medir (o traço, sim).
 *
 * Uso: node scripts/medir-scrollspy-home-sis184.mjs [antes|depois]
 */

import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = 'http://localhost:3000';
const SUFIXO = process.argv[2] === 'depois' ? 'depois' : 'antes';
const SAIDA = `docs/medidas/scrollspy-home-sis184-${SUFIXO}.json`;

mkdirSync('docs/capturas', { recursive: true });

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

/* ── Contraste ────────────────────────────────────────────────────────────────
   Fórmula da WCAG 2.x. `razao` ordena sozinha, então serve para tinta clara
   sobre fundo escuro e o contrário sem o chamador se preocupar. */
const lum = ([r, g, b]) => {
  const f = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const razao = (a, b) => {
  const [m, n] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Number(((m + 0.05) / (n + 0.05)).toFixed(2));
};
/* A tinta do rótulo vem com alfa (`text-[#0a1f44]/70` nos inativos). Sobre o
   fundo medido, a cor efetiva é a composição — ignorar o alfa daria um contraste
   melhor do que o olho recebe. */
const corDoTexto = (css, fundo) => {
  const m = css?.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(',').map((v) => Number(v.trim()));
  const [r, g, b] = p;
  const a = p.length > 3 ? p[3] : 1;
  if (a >= 1 || !fundo) return [r, g, b];
  return [r, g, b].map((c, i) => Math.round(c * a + fundo[i] * (1 - a)));
};

async function abrir(largura) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 } });
  await ctx.addInitScript(() => {
    /* `full` gravado de propósito: o alvo é o arranjo visual normal, e a
       preferência do sistema no headless viria como `reduce`, que troca
       componentes de cena na home. */
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const p = await ctx.newPage();
  /* `domcontentloaded`: sob `next dev` o `networkidle` nunca chega (canal HMR). */
  await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 90000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  await p.waitForTimeout(1800);
  return { ctx, p };
}

/* Amostra um bloco quadrado da captura e devolve (média, pior) — «pior» é o
   pixel de luminância mais distante da tinta, isto é o que derruba a razão. */
async function amostrar(sharp, arquivo, left, top, largura, altura, tinta) {
  const meta = await sharp(readFileSync(arquivo)).metadata();
  const L = Math.max(0, Math.min(Math.round(left), (meta.width ?? 1) - 2));
  const T = Math.max(0, Math.min(Math.round(top), (meta.height ?? 1) - 2));
  const W = Math.max(1, Math.min(Math.round(largura), (meta.width ?? 1) - L));
  const H = Math.max(1, Math.min(Math.round(altura), (meta.height ?? 1) - T));
  const { data, info } = await sharp(readFileSync(arquivo))
    .extract({ left: L, top: T, width: W, height: H })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let [sr, sg, sb, n] = [0, 0, 0, 0];
  let pior = null;
  let piorRazao = Infinity;
  for (let i = 0; i < data.length; i += info.channels) {
    const px = [data[i], data[i + 1], data[i + 2]];
    sr += px[0];
    sg += px[1];
    sb += px[2];
    n += 1;
    if (tinta) {
      const r = razao(tinta, px);
      if (r < piorRazao) {
        piorRazao = r;
        pior = px;
      }
    }
  }
  const media = [sr / n, sg / n, sb / n].map((v) => Math.round(v));
  return { media, pior: pior ?? media, pixels: n };
}

const resultado = {
  issue: 'SIS-184',
  momento: SUFIXO,
  nota: 'gerado por scripts/medir-scrollspy-home-sis184.mjs',
  portao: 'rótulo ativo ≥ 4,5:1 (WCAG 1.4.3) e traço ativo ≥ 3:1 (1.4.11), sobre o PIOR pixel',
};

const sharp = (await import('sharp')).default;

for (const largura of [1440, 1280]) {
  const { ctx, p } = await abrir(largura);

  const paradas = await p.evaluate(() =>
    Array.from(document.querySelectorAll('nav[aria-label] a[href^="#"]'))
      .filter((a) => a.closest('nav')?.className.includes('fixed'))
      .map((a) => ({ id: a.getAttribute('href').slice(1), rotulo: a.textContent.trim() })),
  );

  const medidas = [];
  for (const parada of paradas) {
    /* Rolar para a seção e deixar o `IntersectionObserver` assentar. O alvo é o
       MEIO da seção: o topo dela costuma disputar a ativação com a vizinha. */
    await p.evaluate((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const alvo = r.top + window.scrollY + Math.min(r.height / 2, window.innerHeight);
      window.scrollTo(0, Math.max(0, alvo - window.innerHeight / 2));
    }, parada.id);
    /* ESPERAR A TRANSIÇÃO, não um número de ms. O traço tem
       `transition-all duration-300` e o rótulo `transition-opacity`, e a troca de
       `tom` muda as duas cores — uma captura tirada no meio lê a cor
       INTERPOLADA. A primeira versão desta sonda esperava 1200ms fixos e a
       releitura pós-mudança devolveu `rgb(10, 149, 182)` no traço (ciano a meio
       caminho) e `opacity: 0.97` num rótulo que estava indo para 1: números que
       não descrevem estado nenhum da página. Então a espera é por ESTABILIDADE —
       duas leituras iguais seguidas, sem animação correndo no nav. */
    /* A espera EXIGE a parada alvo ativa, e não só «estável». Sem esta condição a
       sonda assentava num vizinho quando a rolagem calculada caía na zona em que o
       `IntersectionObserver` ainda prefere a seção de cima, e media a parada errada
       com aparência de medida boa. Se o alvo não acende em 20s a sonda ESTOURA, em
       vez de gravar um número de outra parada. */
    await p.waitForFunction(
      (alvo) => {
        const nav = Array.from(document.querySelectorAll('nav[aria-label]')).find((n) =>
          n.className.includes('fixed'),
        );
        if (!nav) return false;
        if (nav.querySelector('a[aria-current="true"]')?.getAttribute('href') !== `#${alvo}`)
          return false;
        if (nav.getAnimations({ subtree: true }).some((a) => a.playState === 'running'))
          return false;
        const marca = Array.from(nav.querySelectorAll('a'))
          .map((a) => {
            const r = a.querySelector('.scrollspy-rotulo');
            const t = a.querySelector('span[aria-hidden]');
            return [
              a.getAttribute('aria-current'),
              r && getComputedStyle(r).color,
              r && getComputedStyle(r).opacity,
              t && getComputedStyle(t).backgroundColor,
              t && getComputedStyle(t).width,
            ].join('/');
          })
          .join('|');
        const w = window;
        const estavel = w.__sis184marca === marca ? (w.__sis184n ?? 0) + 1 : 0;
        w.__sis184marca = marca;
        w.__sis184n = estavel;
        return estavel >= 3;
      },
      parada.id,
      { timeout: 20000, polling: 250 },
    );
    await p.waitForTimeout(250);

    const leitura = await p.evaluate((id) => {
      const nav = Array.from(document.querySelectorAll('nav[aria-label]')).find((n) =>
        n.className.includes('fixed'),
      );
      if (!nav) return null;
      const ativo = nav.querySelector('a[aria-current="true"]');
      const link = nav.querySelector(`a[href="#${id}"]`);
      if (!link) return null;
      const rotulo = link.querySelector('.scrollspy-rotulo');
      const traco = link.querySelector('span[aria-hidden]');
      const cx = (n) => (n ? getComputedStyle(n) : null);
      const cxRotulo = cx(rotulo);
      const cxTraco = cx(traco);
      const cxRot = (n) => {
        const r = n.getBoundingClientRect();
        return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];
      };
      return {
        idAtivo: ativo?.getAttribute('href')?.slice(1) ?? null,
        estaAtivo: ativo === link,
        /* O NAV INTEIRO junto de cada medida. Sem isto a leitura não se explica:
           numa rodada desta issue o `solucoes` saiu com `aria-current="true"` e ao
           mesmo tempo com a tinta do estado INATIVO, o que não pode coexistir num
           render — e sem o retrato do nav não havia como dizer se o defeito era da
           página ou da sonda. Quem lê o JSON depois tem o estado das cinco paradas
           no instante exato da captura, e a contradição (se voltar) fica provada
           no arquivo em vez de virar suspeita. */
        navNoInstante: Array.from(nav.querySelectorAll('a')).map((a) => {
          const r = a.querySelector('.scrollspy-rotulo');
          const t = a.querySelector('span[aria-hidden]');
          return {
            id: a.getAttribute('href')?.slice(1),
            current: a.getAttribute('aria-current'),
            rotuloOpacidade: r ? getComputedStyle(r).opacity : null,
            rotuloCor: r ? getComputedStyle(r).color : null,
            tracoLargura: t ? getComputedStyle(t).width : null,
            tracoCor: t ? getComputedStyle(t).backgroundColor : null,
          };
        }),
        /* Quantos navs a rota tem, e se este é o único `fixed`. A home também traz
           a nav de âncoras da própria página, e ela casa com `nav[aria-label]`. */
        navsNaRota: document.querySelectorAll('nav[aria-label]').length,
        rolagem: Math.round(window.scrollY),
        rotulo: rotulo
          ? {
              cor: cxRotulo.color,
              opacidade: Number(cxRotulo.opacity),
              tamanho: cxRotulo.fontSize,
              /* `position: absolute` + largura 0 = recolhido pela regra da
                 SIS-170; não há caixa de tinta a medir nesta largura. */
              posicao: cxRotulo.position,
              caixa: cxRot(rotulo),
            }
          : null,
        traco: traco
          ? { cor: cxTraco.backgroundColor, caixa: cxRot(traco) }
          : null,
      };
    }, parada.id);

    if (!leitura) continue;

    const arquivo = `docs/capturas/sis184-${parada.id}-${largura}-${SUFIXO}.png`;
    await p.screenshot({ path: arquivo });

    const medida = { ...parada, largura, ...leitura, arquivo };

    /* ── Fundo sob o RÓTULO ────────────────────────────────────────────────
       A moldura ao redor da tinta, não a caixa dela: dentro da caixa os pixels
       são a própria tinta, e amostrá-los mediria o texto contra si mesmo.
       Três faixas — acima, abaixo e à esquerda — cobrem o que o olho vê como
       «papel» daquele rótulo. */
    if (leitura.rotulo && leitura.rotulo.caixa[2] > 0) {
      const [x, y, w, h] = leitura.rotulo.caixa;
      const faixas = [
        ['acima', x, y - 5, w, 4],
        ['abaixo', x, y + h + 1, w, 4],
        ['esquerda', Math.max(0, x - 6), y, 5, h],
      ];
      /* Primeira passada só para ter um fundo com que compor o alfa da tinta. */
      const grosseiro = await amostrar(sharp, arquivo, x, y - 5, w, 4, null);
      const tinta = corDoTexto(leitura.rotulo.cor, grosseiro.media);
      const amostras = [];
      for (const [nome, L, T, W, H] of faixas) {
        const a = await amostrar(sharp, arquivo, L, T, W, H, tinta);
        amostras.push({
          faixa: nome,
          media: `rgb(${a.media.join(', ')})`,
          pior: `rgb(${a.pior.join(', ')})`,
          contrasteMedio: razao(tinta, a.media),
          contrastePior: razao(tinta, a.pior),
        });
      }
      medida.fundoDoRotulo = {
        tintaEfetiva: `rgb(${tinta.join(', ')})`,
        amostras,
        contrasteMedio: Math.min(...amostras.map((a) => a.contrasteMedio)),
        contrastePior: Math.min(...amostras.map((a) => a.contrastePior)),
      };
      medida.fundoDoRotulo.passa = medida.fundoDoRotulo.contrastePior >= 4.5;
    }

    /* ── Fundo ao redor do TRAÇO (elemento gráfico: portão 3:1) ───────────── */
    if (leitura.traco && leitura.traco.caixa[2] > 0) {
      const [x, y, w, h] = leitura.traco.caixa;
      const g = await amostrar(sharp, arquivo, x, y - 6, w, 4, null);
      const tinta = corDoTexto(leitura.traco.cor, g.media);
      const acima = await amostrar(sharp, arquivo, x, y - 6, w, 4, tinta);
      const abaixo = await amostrar(sharp, arquivo, x, y + h + 2, w, 4, tinta);
      const pior = Math.min(razao(tinta, acima.pior), razao(tinta, abaixo.pior));
      medida.fundoDoTraco = {
        tintaEfetiva: `rgb(${tinta.join(', ')})`,
        acima: `rgb(${acima.media.join(', ')})`,
        abaixo: `rgb(${abaixo.media.join(', ')})`,
        contrasteMedio: Math.min(razao(tinta, acima.media), razao(tinta, abaixo.media)),
        contrastePior: pior,
        passa: pior >= 3,
      };
    }

    medidas.push(medida);
  }

  resultado[largura] = { paradas: medidas };
  await ctx.close();
}

await navegador.close();

writeFileSync(SAIDA, `${JSON.stringify(resultado, null, 2)}\n`);
console.log(SAIDA);
for (const largura of [1440, 1280]) {
  console.log(`\n── ${largura} ──`);
  for (const m of resultado[largura].paradas) {
    const r = m.fundoDoRotulo;
    const t = m.fundoDoTraco;
    console.log(
      [
        m.id.padEnd(12),
        m.estaAtivo ? 'ATIVO ' : `inativo(${m.idAtivo})`,
        `rotulo=${m.rotulo?.cor ?? '-'} op=${m.rotulo?.opacidade ?? '-'} pos=${m.rotulo?.posicao ?? '-'}`,
        r ? `fundo=${r.amostras[0].media} pior=${r.contrastePior} medio=${r.contrasteMedio} ${r.passa ? 'ok' : 'FALHA'}` : 'rotulo recolhido',
        t ? `traco=${t.tintaEfetiva} pior=${t.contrastePior} ${t.passa ? 'ok' : 'FALHA'}` : '',
      ].join(' | '),
    );
  }
}
