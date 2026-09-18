/**
 * SIS-292 — «/sistran-labs · Principais Soluções: só arte nova (reta + dinâmica),
 * sem cards».
 *
 * `node scripts/medir-principais-labs-sis292.mjs`        (`next dev` em :3000)
 *
 * A issue tem cinco critérios, e QUATRO deles são invisíveis numa captura:
 *
 *  1. «NENHUM CARD NESTA SEÇÃO». Não basta eu ter apagado o `<ul>`: conto os
 *     descendentes com as classes de cartão DENTRO da seção medida, e conto
 *     também quantos deles a seção de cima (SIS-291, de outro agente) tem — se o
 *     número dela fosse zero, eu teria apagado a vitrine errada.
 *  2. «SEM TILT». Afirmação sobre TRANSFORMAÇÃO, e a única prova é a matriz
 *     computada. Leio `transform`/`perspective`/`rotate` do palco, do quadro e da
 *     imagem, em repouso E em hover, e decomponho a matriz: `matrix(a,b,c,d,e,f)`
 *     com `b` ou `c` diferentes de zero é rotação/inclinação; `matrix3d` com
 *     qualquer termo de perspectiva é o tilt da SIS-280. Um `scale` puro tem
 *     `b == c == 0`, e é por isso que a decomposição — e não a string — é o
 *     critério.
 *  3. «QUADRO DINÂMICO» é comparativo com O PROGRAMA. Então a sonda abre as DUAS
 *     rotas e imprime as peças do quadro de referência ao lado das minhas: borda,
 *     anel (`outline`), sombras, fio do topo. Sem o par, «tem borda ciano» é
 *     autoelogio.
 *  4. «PESO RAZOÁVEL». O byte servido, medido na REDE — não o tamanho do arquivo
 *     no disco. `images.unoptimized` faz o `next/image` entregar o cru, e é o
 *     `Content-Length` da resposta que o visitante paga. Confiro também que a
 *     rota NÃO baixa mais a arte antiga nem o PNG de 2 MiB.
 *  5. «REDUCE = SEM MOTION». As duas vias (a `@media` do sistema e o atributo
 *     `data-motion="reduce"` que o diálogo da página escreve), cada uma medida
 *     com hover REAL aplicado — verificar só o CSS não prova que a regra vence.
 *
 * E a11y: `alt` não vazio e `figcaption` presente e VISÍVEL (um figcaption com
 * `display: none` passaria em qualquer verificação de DOM e não resolveria nada
 * do que a issue pediu ao proibir «voltar à PNG muda»).
 *
 * Ferramenta de bancada; nada disto entra no bundle.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const LARGURAS = (process.env.LARGURAS ?? '1440,390').split(',').map(Number);

/* As classes de cartão em uso na rota. `glass-card`/`glass-card-hover` eram a base
   da vitrine de sete que saiu; `labs-solucao-cartao` é a da grade de «Já
   desenvolvemos…» LOGO ACIMA, que a issue põe fora de escopo.
   A primeira volta desta sonda não listava `labs-solucao-cartao` e devolvia
   `naSecaoDeCima: 0` — o contra-teste não testava nada, porque zero era o
   resultado tanto se a seção de cima estivesse intacta quanto se eu a tivesse
   apagado. Sem a classe certa, a guarda era decorativa. */
const CLASSES_DE_CARTAO = [
  'glass-card',
  'glass-card-hover',
  'card-solucao',
  'labs-card',
  'labs-solucao-cartao',
];

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

/* Decompõe a matriz computada. É o item 2 e o coração da issue: devolve `gira`
   true quando há QUALQUER termo fora da diagonal (rotação, skew) ou qualquer
   termo de perspectiva numa `matrix3d`. */
const GIRO = (transform) => {
  if (!transform || transform === 'none') return { matriz: 'none', gira: false, termos: null };
  const m = transform.match(/-?[\d.e+]+/g)?.map(Number) ?? [];
  if (transform.startsWith('matrix3d')) {
    /* Ordem coluna-maior. Fora da diagonal do bloco 3×3: índices 1,2,4,6,8,9.
       Perspectiva: 3,7,11. Um `translate3d`+`scale` puro zera todos eles. */
    const fora = [1, 2, 4, 6, 8, 9].map((i) => m[i]);
    const persp = [3, 7, 11].map((i) => m[i]);
    return {
      matriz: transform.slice(0, 90),
      gira: [...fora, ...persp].some((v) => Math.abs(v) > 1e-6),
      termos: { foraDaDiagonal: fora, perspectiva: persp, escala: [m[0], m[5], m[10]] },
    };
  }
  const [a, b, c, d, e, f] = m;
  return {
    matriz: transform,
    /* `b` e `c` são exatamente sin(θ) e −sin(θ) numa rotação, e os termos de skew.
       Zerados, sobra escala (a, d) e translação (e, f) — o que a issue permite. */
    gira: Math.abs(b) > 1e-6 || Math.abs(c) > 1e-6,
    termos: { b, c, escala: [a, d], translacao: [e, f] },
  };
};

const PECAS = (arg) =>
  ((doc, win, { selSecao, selPalco, selQuadro, selArte, classesDeCartao }) => {
    const n = (v) => Math.round(v * 10) / 10;
    const secao = doc.querySelector(selSecao);
    if (!secao) return null;

    const cartoesEm = (raiz) =>
      raiz
        ? classesDeCartao.reduce(
            (t, c) => t + raiz.querySelectorAll(`.${c}`).length,
            0,
          )
        : null;

    const est = (sel, props) => {
      const el = doc.querySelector(sel);
      if (!el) return null;
      const e = win.getComputedStyle(el);
      const b = el.getBoundingClientRect();
      const o = { existe: true, w: n(b.width), h: n(b.height) };
      for (const p of props) o[p] = e[p];
      return o;
    };

    const pseudo = (sel, qual, props) => {
      const el = doc.querySelector(sel);
      if (!el) return null;
      const e = win.getComputedStyle(el, qual);
      const o = { existe: e.content !== 'none' };
      for (const p of props) o[p] = e[p];
      return o;
    };

    const img = doc.querySelector(selArte);
    const legenda = doc.querySelector(`${selPalco} figcaption`);

    return {
      /* Item 1 */
      cartoes: {
        nestaSecao: cartoesEm(secao),
        naSecaoDeCima: cartoesEm(secao.previousElementSibling),
        listasNestaSecao: secao.querySelectorAll('ul').length,
      },
      figura: {
        tag: doc.querySelector(selPalco)?.tagName ?? null,
        temQuadro: Boolean(doc.querySelector(selQuadro)),
      },
      arte: img
        ? {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            altVazio: !img.getAttribute('alt')?.trim(),
            sizes: img.getAttribute('sizes'),
            atributos: { width: img.getAttribute('width'), height: img.getAttribute('height') },
            /* O que o navegador REALMENTE decodificou. `naturalWidth` divergente
               do par de atributos seria CLS. */
            natural: { w: img.naturalWidth, h: img.naturalHeight },
            pintada: { w: n(img.getBoundingClientRect().width), h: n(img.getBoundingClientRect().height) },
            completa: img.complete,
          }
        : null,
      legenda: legenda
        ? {
            texto: legenda.textContent.trim(),
            /* VISÍVEL, não só presente. */
            display: win.getComputedStyle(legenda).display,
            cor: win.getComputedStyle(legenda).color,
            altura: n(legenda.getBoundingClientRect().height),
          }
        : null,
      palco: est(selPalco, ['position', 'transform', 'perspective', 'marginTop']),
      placaDeSombra: pseudo(selPalco, '::before', ['transform', 'filter', 'backgroundColor', 'borderRadius']),
      quadradinho: pseudo(selPalco, '::after', ['backgroundColor', 'width', 'right', 'bottom', 'boxShadow']),
      quadro: est(selQuadro, [
        'overflow',
        'border',
        'borderRadius',
        'backgroundColor',
        'boxShadow',
        'filter',
        'outline',
        'outlineOffset',
        'transform',
        'rotate',
        'transition',
      ]),
      fioDoTopo: pseudo(selQuadro, '::after', ['backgroundImage', 'boxShadow', 'height', 'width']),
      imagem: est(selArte, ['transform', 'display', 'filter', 'transition']),
      vaza: doc.documentElement.scrollWidth > doc.documentElement.clientWidth,
      motion: doc.documentElement.getAttribute('data-motion'),
    };
  })(document, window, arg);

const ALVOS = {
  labs: {
    rota: '/sistran-labs',
    selSecao: 'section[aria-labelledby="labs-principais"]',
    selPalco: '.labs-principais-palco',
    selQuadro: '.labs-principais-quadro',
    selArte: '.labs-principais-imagem',
    classesDeCartao: CLASSES_DE_CARTAO,
  },
  programa: {
    rota: '/sistran-university',
    selSecao: '#university-programa',
    selPalco: '.university-programa-palco',
    selQuadro: '.university-programa-quadro',
    selArte: '.university-programa-arte',
    classesDeCartao: CLASSES_DE_CARTAO,
  },
};

const res = { issue: 'SIS-292', erros: [], rede: {}, porLargura: {} };
const nav = await chromium.launch();

for (const width of LARGURAS) {
  res.porLargura[width] = {};

  for (const [nome, alvo] of Object.entries(ALVOS)) {
    const ctx = await nav.newContext({ viewport: { width, height: 900 } });
    await ctx.addInitScript(() => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
    });
    const p = await ctx.newPage();
    p.on('console', (m) => {
      if (m.type() === 'error') res.erros.push(`${width} ${alvo.rota}: ${m.text()}`);
    });

    /* Item 4 — o byte da REDE. Só as respostas de imagem desta rota interessam. */
    if (nome === 'labs') {
      res.rede[width] = [];
      p.on('response', async (r) => {
        const u = r.url();
        if (!/\.(webp|png|jpg|jpeg|avif|svg)(\?|$)/i.test(u)) return;
        if (!u.includes('/images/sistran-labs/')) return;
        res.rede[width].push({
          arquivo: u.split('/').pop(),
          status: r.status(),
          bytes: Number(r.headers()['content-length'] ?? 0),
          tipo: r.headers()['content-type'] ?? null,
        });
      });
    }

    await p.goto(`${BASE}${alvo.rota}`, { waitUntil: 'networkidle' });
    await p
      .waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 60000 })
      .catch(() => null);
    await p.evaluate(() => document.fonts.ready);
    /* `data-reveal` nasce em `opacity: 0`: sem trazer a seção para a tela, a peça
       seria medida invisível e o hover não teria o que mover. */
    await p.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'center' }), alvo.selSecao);
    await p.waitForTimeout(1400);

    const m = await p.evaluate(PECAS, alvo);
    if (!m) {
      res.erros.push(`${width} ${alvo.rota}: seção ${alvo.selSecao} não encontrada`);
      await ctx.close();
      continue;
    }

    /* Item 2 e 3 — repouso, hover, e as duas vias de reduce. */
    const lerPose = () =>
      p.evaluate(
        ({ selPalco, selQuadro, selArte }) => {
          const g = (sel) => {
            const el = document.querySelector(sel);
            if (!el) return null;
            const e = getComputedStyle(el);
            return { transform: e.transform, rotate: e.rotate, translate: e.translate };
          };
          const antes = (() => {
            const el = document.querySelector(selPalco);
            if (!el) return null;
            const e = getComputedStyle(el, '::before');
            return { transform: e.transform, filter: e.filter };
          })();
          const q = document.querySelector(selQuadro);
          const eq = q ? getComputedStyle(q) : null;
          return {
            palco: g(selPalco),
            quadro: g(selQuadro),
            imagem: g(selArte),
            placa: antes,
            borda: eq?.borderTopColor ?? null,
            anel: eq?.outlineColor ?? null,
            sombra: eq?.filter ?? null,
          };
        },
        alvo,
      );

    m.repouso = await lerPose();

    const caixa = await p.locator(alvo.selQuadro).boundingBox().catch(() => null);
    if (caixa) {
      await p.mouse.move(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
      await p.waitForTimeout(900);
      m.hover = await lerPose();
      if (nome === 'labs') {
        const el = await p.$(alvo.selPalco);
        if (el) await el.screenshot({ path: `docs/capturas/sis292-labs-hover-${width}.png` });
      }
      await p.mouse.move(2, 2);
      await p.waitForTimeout(700);
    }

    if (nome === 'labs') {
      const el = await p.$(alvo.selPalco);
      if (el) await el.screenshot({ path: `docs/capturas/sis292-labs-repouso-${width}.png` });
    }

    /* Item 5 — via ATRIBUTO, com hover aplicado de verdade. */
    if (caixa) {
      await p.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
      await p.mouse.move(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
      await p.waitForTimeout(900);
      m.reduceAtributo = await lerPose();
      await p.mouse.move(2, 2);
      await p.evaluate(() => document.documentElement.removeAttribute('data-motion'));
    }
    await ctx.close();

    /* Item 5 — via @MEDIA do sistema, em contexto próprio (é um flag de contexto,
       não algo que dê para ligar numa página já aberta). */
    if (caixa) {
      const ctxR = await nav.newContext({
        viewport: { width, height: 900 },
        reducedMotion: 'reduce',
      });
      await ctxR.addInitScript(() => {
        localStorage.setItem('sistran-motion-preference-seen', '1');
      });
      const pr = await ctxR.newPage();
      await pr.goto(`${BASE}${alvo.rota}`, { waitUntil: 'networkidle' });
      await pr
        .waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 60000 })
        .catch(() => null);
      await pr.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'center' }), alvo.selSecao);
      await pr.waitForTimeout(1400);
      const cr = await pr.locator(alvo.selQuadro).boundingBox().catch(() => null);
      if (cr) {
        await pr.mouse.move(cr.x + cr.width / 2, cr.y + cr.height / 2);
        await pr.waitForTimeout(900);
        m.reduceMedia = await pr.evaluate(
          ({ selPalco, selQuadro, selArte }) => {
            const g = (sel) => {
              const el = document.querySelector(sel);
              return el ? getComputedStyle(el).transform : null;
            };
            return {
              palco: g(selPalco),
              quadro: g(selQuadro),
              imagem: g(selArte),
              placa: (() => {
                const el = document.querySelector(selPalco);
                return el ? getComputedStyle(el, '::before').transform : null;
              })(),
            };
          },
          alvo,
        );
      }
      await ctxR.close();
    }

    res.porLargura[width][nome] = m;
  }
}

await nav.close();
await writeFile('docs/medidas/sis292-depois.json', `${JSON.stringify(res, null, 1)}\n`, 'utf8');

const linhaDeGiro = (rot, pose) =>
  ['palco', 'quadro', 'imagem'].map((k) => {
    const t = GIRO(pose?.[k]?.transform);
    return `${k}:${t.gira ? 'GIRA' : 'reto'}`;
  }).join(' ') + `  placa:${GIRO(pose?.placa?.transform).gira ? 'GIRA' : 'reto'}  (${rot})`;

for (const width of LARGURAS) {
  console.log(`\n======== ${width}`);
  for (const nome of Object.keys(ALVOS)) {
    const m = res.porLargura[width][nome];
    if (!m) continue;
    console.log(` ${nome}`);
    console.log(`    cartoes  ${JSON.stringify(m.cartoes)}`);
    console.log(`    figura   ${JSON.stringify(m.figura)} vaza ${m.vaza}`);
    console.log(`    arte     ${JSON.stringify(m.arte)}`);
    console.log(`    legenda  ${JSON.stringify(m.legenda)}`);
    console.log(`    palco    ${JSON.stringify(m.palco)}`);
    console.log(`    placa    ${JSON.stringify(m.placaDeSombra)}`);
    console.log(`    quadrad. ${JSON.stringify(m.quadradinho)}`);
    console.log(`    quadro   ${JSON.stringify(m.quadro)}`);
    console.log(`    fio      ${JSON.stringify(m.fioDoTopo)}`);
    console.log(`    imagem   ${JSON.stringify(m.imagem)}`);
    console.log(`    repouso  ${linhaDeGiro('repouso', m.repouso)}`);
    console.log(`             borda ${m.repouso?.borda} anel ${m.repouso?.anel}`);
    if (m.hover) {
      console.log(`    hover    ${linhaDeGiro('hover', m.hover)}`);
      console.log(`             quadro ${m.hover.quadro?.transform}`);
      console.log(`             imagem ${m.hover.imagem?.transform}`);
      console.log(`             placa  ${m.hover.placa?.transform} ${m.hover.placa?.filter}`);
      console.log(`             borda ${m.hover.borda} anel ${m.hover.anel}`);
    }
    if (m.reduceAtributo) {
      console.log(
        `    reduce[attr] quadro ${m.reduceAtributo.quadro?.transform} · imagem ${m.reduceAtributo.imagem?.transform} · placa ${m.reduceAtributo.placa?.transform}`,
      );
      console.log(`                 borda ${m.reduceAtributo.borda} anel ${m.reduceAtributo.anel}`);
    }
    if (m.reduceMedia) console.log(`    reduce[@media] ${JSON.stringify(m.reduceMedia)}`);
  }
  console.log(`    rede ${JSON.stringify(res.rede[width])}`);
}
console.log(`\nerros ${JSON.stringify(res.erros)}`);
