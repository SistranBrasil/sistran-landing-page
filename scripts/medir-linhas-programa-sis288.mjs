/**
 * SIS-288 — «/sistran-university · O Programa: linhas de destaque do card Unidep
 * no quadro».
 *
 * `node scripts/medir-linhas-programa-sis288.mjs`   (`next dev` em :3000)
 *
 * A issue pede que o quadro da arte do Programa leia SEMPRE como o cartão Unidep
 * lê em destaque. «As mesmas linhas» é uma afirmação comparativa, então a sonda
 * mede OS DOIS LADOS na mesma passada e põe um ao lado do outro — o critério não
 * é «o quadro tem um anel», é «o anel do quadro é o do Unidep destacado».
 *
 * O que cada critério exige para virar número:
 *
 *  • «Leem-se as mesmas linhas/anéis» — as três peças do realce do Unidep, uma a
 *    uma: (a) `outline-width/style/color/offset` computados; (b) a borda; (c) o
 *    fio do topo, pelo `background-image` do pseudo (o degradê é a assinatura do
 *    fio: ponta transparente → `#0ed8f6` → ponta transparente). Do lado do
 *    Unidep as mesmas três são lidas COM O CURSOR EM CIMA, que é o único estado
 *    em que elas existem lá.
 *    `getComputedStyle(el, '::after')` devolve objeto vivo mesmo para pseudo
 *    inexistente — só `content` prova a existência, e por isso ele é lido.
 *  • «O quadrado azul/ciano atrás permanece visível» — o `::after` do palco:
 *    `content`, cor, `z-index` e a CAIXA. E a conta que a issue insinua no ponto
 *    2: o anel do quadro avança `outline-offset + outline-width` para fora da
 *    borda, e o quadradinho mora em `right: -0.5rem`; se o avanço alcançar o
 *    quadradinho os dois grafismos se cruzam. Sai `folgaAteOQuadradinho`, que
 *    tem de ser positiva.
 *  • «Hover tilt intacto» — a matriz computada do quadro e da arte em repouso e
 *    em hover. Lida como matriz e não como a string declarada; se as duas forem
 *    iguais, o tilt morreu.
 *    O ponteiro vai pelo `mouse.move()` ao centro da caixa e não por `hover()`:
 *    o `hover()` do Playwright espera caixa ESTÁVEL e a coluna vizinha tem
 *    cartões que flutuam — no bloco dos números isso deu `Timeout 30000ms`.
 *  • «Reduce intacto» — as duas vias (a `@media` do sistema e o
 *    `html[data-motion="reduce"]` do diálogo da página), conferindo que as linhas
 *    CONTINUAM (são estáticas, e a issue permite) e que o `transform` do quadro
 *    zera. Uma linha que desaparecesse no reduce tiraria o realce de quem
 *    justamente não vai ver o tilt.
 *  • Vazamento horizontal: o anel avança para fora de um quadro já inclinado e
 *    perto da borda da coluna. `scrollWidth` contra `clientWidth`, mais a borda
 *    direita PINTADA do quadro contra a da janela.
 *
 * Ferramenta de bancada; nada disso entra no bundle.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const ROTA = '/sistran-university';
const LARGURAS = (process.env.LARGURAS ?? '1440,1024,390').split(',').map(Number);

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

/* Ponteiro por coordenada: `hover()` exige caixa estável e esta rota tem cartões
   em flutuação infinita. `mouse.move()` produz `:hover` de CSS de verdade —
   despachar `mouseover` sintético não produziria. */
const apontar = async (p, sel) => {
  const b = await p.locator(sel).boundingBox();
  if (!b) throw new Error(`sem caixa para ${sel}`);
  await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
};

const LINHAS = () =>
  /* Sem `eslint-disable no-undef` aqui: `document`/`window` entram como PARÂMETRO
     desta função, avaliada dentro do navegador pelo `page.evaluate`. A diretiva
     que eu havia deixado virou aviso de «unused eslint-disable» e subiu o lint de
     79 para 80 problemas. */
  ((doc, win) => {
    const num = (v) => Math.round(parseFloat(v) * 10) / 10;
    const cx = (b) => ({
      esq: Math.round(b.left * 10) / 10,
      dir: Math.round(b.right * 10) / 10,
      topo: Math.round(b.top * 10) / 10,
      w: Math.round(b.width * 10) / 10,
      h: Math.round(b.height * 10) / 10,
    });

    /* As TRÊS PEÇAS do realce, no mesmo formato para os dois lados — é o formato
       que permite comparar sem interpretar. */
    const realce = (el, pseudoDoFio) => {
      if (!el) return null;
      const e = win.getComputedStyle(el);
      const f = win.getComputedStyle(el, pseudoDoFio);
      return {
        anel: {
          largura: e.outlineWidth,
          estilo: e.outlineStyle,
          cor: e.outlineColor,
          offset: e.outlineOffset,
          /* O quanto o anel avança para fora da borda: é a conta que decide se
             ele cruza o quadradinho ciano do palco. */
          avanco: num(e.outlineOffset) + num(e.outlineWidth),
        },
        borda: `${e.borderTopWidth} ${e.borderTopStyle} ${e.borderTopColor}`,
        raio: e.borderTopLeftRadius,
        glow: e.boxShadow,
        filtro: e.filter === 'none' ? null : e.filter,
        fio: {
          pseudo: pseudoDoFio,
          /* `content: none` é a ÚNICA prova de que o pseudo não existe: o objeto
             computado vem vivo de qualquer jeito. */
          existe: f.content !== 'none' && f.content !== '',
          content: f.content,
          fundo: f.backgroundImage,
          altura: f.height,
          largura: f.width,
          topo: f.top,
          opacidade: f.opacity,
        },
      };
    };

    const quadro = doc.querySelector('.university-programa-quadro');
    const palco = doc.querySelector('.university-programa-palco');
    const arte = doc.querySelector('.university-programa-arte');
    const unidep = doc.querySelector('.university-unidep-cartao');

    const eq = quadro && win.getComputedStyle(quadro);
    const bq = quadro && quadro.getBoundingClientRect();

    /* O QUADRADINHO CIANO do palco, o grafismo que a issue manda preservar. */
    const quadradinho = (() => {
      if (!palco) return null;
      const a = win.getComputedStyle(palco, '::after');
      const bp = palco.getBoundingClientRect();
      /* O pseudo não tem caixa própria via API; a posição é reconstruída da
         declaração computada, que é o que o navegador de fato usou. */
      const direita = bp.right - num(a.right);
      return {
        existe: a.content !== 'none' && a.content !== '',
        content: a.content,
        fundo: a.backgroundColor,
        zIndex: a.zIndex,
        glow: a.boxShadow,
        lado: `${a.width} x ${a.height}`,
        /* Positiva = o anel do quadro para antes do quadradinho e os dois não se
           cruzam. `right` negativo do pseudo é o quanto ele sai da caixa. */
        folgaAteOQuadradinho: quadro
          ? Math.round((-num(a.right) - (num(eq.outlineOffset) + num(eq.outlineWidth))) * 10) / 10
          : null,
        bordaDireitaPintada: Math.round(direita * 10) / 10,
      };
    })();

    return {
      /* O ALVO da issue: o quadro do Programa, em repouso ou em hover conforme
         quem chamou. */
      programa: realce(quadro, '::after'),
      programaCaixa: bq ? cx(bq) : null,
      transformDoQuadro: eq ? eq.transform : null,
      transformDaArte: arte ? win.getComputedStyle(arte).transform : null,
      quadradinho,
      /* A FONTE do vocabulário, para a comparação ser medida e não afirmada. */
      unidep: realce(unidep, '::before'),
      vazamento: {
        scrollWidth: doc.documentElement.scrollWidth,
        clientWidth: doc.documentElement.clientWidth,
        vaza: doc.documentElement.scrollWidth > doc.documentElement.clientWidth,
        folgaDoQuadroAteAJanela: bq ? Math.round((win.innerWidth - bq.right) * 10) / 10 : null,
      },
    };
  })(document, window);

const res = { issue: 'SIS-288', rota: ROTA, erros: [], porLargura: {} };

const abrir = async (nav, width, { reduce = false, atributo = false } = {}) => {
  const ctx = await nav.newContext({
    viewport: { width, height: 900 },
    reducedMotion: reduce ? 'reduce' : 'no-preference',
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  if (atributo) {
    /* A via do DIÁLOGO da própria página. `localStorage` e não só o atributo: o
       script da rota reescreve `data-motion` na hidratação a partir da chave
       gravada, então plantar o atributo sozinho seria desfeito. */
    await ctx.addInitScript(() => {
      localStorage.setItem('sistran-motion-preference', 'reduce');
    });
  }
  const p = await ctx.newPage();
  p.on('console', (m) => {
    if (m.type() === 'error') res.erros.push(`${width}: ${m.text()}`);
  });
  await p.goto(`${BASE}${ROTA}`, { waitUntil: 'networkidle' });
  await p
    .waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 60000 })
    .catch(() => null);
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() =>
    document.querySelector('#university-programa')?.scrollIntoView({ block: 'center' }),
  );
  await p.waitForTimeout(1400);
  return { ctx, p };
};

const nav = await chromium.launch();

for (const width of LARGURAS) {
  const medido = {};

  const { ctx, p } = await abrir(nav, width);
  medido.repouso = await p.evaluate(LINHAS);
  if (width === 1440) {
    const no = await p.$('#university-programa');
    if (no) await no.screenshot({ path: 'docs/capturas/sis288-repouso-1440.png' });
  }

  /* O ponteiro vai no PALCO, que é a caixa reta da coluna — o quadro está
     inclinado e sua área de ponteiro é o paralelogramo projetado. */
  await apontar(p, '.university-programa-palco');
  await p.waitForTimeout(900);
  medido.hover = await p.evaluate(LINHAS);
  if (width === 1440) {
    const no = await p.$('#university-programa');
    if (no) await no.screenshot({ path: 'docs/capturas/sis288-hover-1440.png' });
  }

  /* O Unidep destacado, que é a REFERÊNCIA da issue: só existe com o cursor
     nele, e é uma seção abaixo. */
  await p.evaluate(() =>
    document.querySelector('#university-unidep')?.scrollIntoView({ block: 'center' }),
  );
  await p.waitForTimeout(1000);
  /* `.first()`: são três cartões e o `locator` em modo estrito recusa o seletor
     ambíguo. Qualquer um serve — desde a 3ª volta da SIS-285 o realce é de quem
     estiver sob o cursor, e os três têm as mesmas regras. */
  await apontar(p, '.university-unidep-cartao >> nth=0');
  await p.waitForTimeout(900);
  medido.unidepEmDestaque = (await p.evaluate(LINHAS)).unidep;
  if (width === 1440) {
    const no = await p.$('#university-unidep');
    if (no) await no.screenshot({ path: 'docs/capturas/sis288-unidep-hover-1440.png' });
  }
  await ctx.close();

  for (const [chave, opcoes] of [
    ['reduceSistema', { reduce: true }],
    ['reduceAtributo', { atributo: true }],
  ]) {
    const a = await abrir(nav, width, opcoes);
    medido[chave] = await a.p.evaluate(LINHAS);
    await apontar(a.p, '.university-programa-palco');
    await a.p.waitForTimeout(600);
    medido[`${chave}ComHover`] = await a.p.evaluate(LINHAS);
    if (width === 1440 && chave === 'reduceAtributo') {
      const no = await a.p.$('#university-programa');
      if (no) await no.screenshot({ path: 'docs/capturas/sis288-reduce-1440.png' });
    }
    await a.ctx.close();
  }

  res.porLargura[width] = medido;
}

await nav.close();
await writeFile('docs/medidas/sis288-depois.json', `${JSON.stringify(res, null, 1)}\n`, 'utf8');

for (const width of LARGURAS) {
  const m = res.porLargura[width];
  console.log(`\n== ${width}`);
  console.log(` quadro anel   ${JSON.stringify(m.repouso.programa.anel)}`);
  console.log(` unidep anel   ${JSON.stringify(m.unidepEmDestaque.anel)}`);
  console.log(` quadro fio    ${JSON.stringify(m.repouso.programa.fio)}`);
  console.log(` unidep fio    ${JSON.stringify(m.unidepEmDestaque.fio)}`);
  console.log(` quadradinho   ${JSON.stringify(m.repouso.quadradinho)}`);
  console.log(` anel hover    ${m.hover.programa.anel.cor}`);
  console.log(` tilt repouso  ${m.repouso.transformDoQuadro}`);
  console.log(` tilt hover    ${m.hover.transformDoQuadro}`);
  console.log(` reduce sist.  tilt ${m.reduceSistemaComHover.transformDoQuadro} · anel ${m.reduceSistema.programa.anel.largura} ${m.reduceSistema.programa.anel.cor} · fio ${m.reduceSistema.programa.fio.existe}`);
  console.log(` reduce attr.  tilt ${m.reduceAtributoComHover.transformDoQuadro} · anel ${m.reduceAtributo.programa.anel.largura} ${m.reduceAtributo.programa.anel.cor} · fio ${m.reduceAtributo.programa.fio.existe}`);
  console.log(` vazamento     ${JSON.stringify(m.repouso.vazamento)}`);
}
console.log(`\nerros ${JSON.stringify(res.erros)}`);
