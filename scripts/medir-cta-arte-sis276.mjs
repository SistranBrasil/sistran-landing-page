/**
 * SIS-276 — «/esg · Fale com a Gente!: grafismo cortado/baixo demais no rodapé».
 *
 * `node scripts/medir-cta-arte-sis276.mjs`  (precisa do `next dev` em :3000)
 *
 * O passo 1 da issue é uma PERGUNTA COM TRÊS RESPOSTAS POSSÍVEIS — «posição final
 * baixa», «corte por overflow» ou «padding-bottom insuficiente» — e as três dão o
 * mesmo sintoma na captura. O que as separa são números diferentes, e é por isso
 * que este script mede quatro coisas e não uma:
 *
 *  • CAIXA DE LAYOUT da arte (`.cta-ref-arte`) contra o fundo da seção e o topo do
 *    rodapé. Se a caixa já passa do fundo da seção, é posição/altura; se ela cabe
 *    e o que falta é o que a arte PINTA fora dela, é overflow.
 *  • CAIXA PINTADA do blob — `getBBox()` do SVG não serve, porque o `feDropShadow`
 *    do filtro pinta muito além do `viewBox` (`y="-30%" height="160%"`). A região
 *    de filtro é calculada aqui à mão a partir da caixa do `<svg>`: é ela que o
 *    `overflow: hidden` da seção corta primeiro.
 *  • PIXEL: recorta-se a faixa da captura entre o fundo da arte e o topo do rodapé
 *    e conta-se se há tinta do blob dentro do rodapé (azul escuro do footer sob
 *    pixels do blob) e se a borda inferior da arte coincide com uma linha reta —
 *    corte por `overflow` deixa aresta reta; posição baixa deixa a curva inteira.
 *  • ROLAGEM HORIZONTAL: `scrollWidth > clientWidth` é a guarda que a issue exige
 *    de qualquer solução que solte o `overflow`. Medida ANTES para se saber que o
 *    número de partida é zero.
 *
 * Também se registra o estado do movimento da SIS-253 (posição do ponto do fio e
 * `animationName` do selo), porque o aceite proíbe regressão — e a comparação só
 * existe se houver um "antes".
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = 'http://localhost:3000';
const MOMENTO = process.argv[2] === 'depois' ? 'depois' : 'antes';
const LARGURAS = [1440, 1024];

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const nav = await chromium.launch();
const res = { issue: 'SIS-276', momento: MOMENTO, rota: '/esg', erros: [], porLargura: {} };

const sonda = (p) =>
  p.evaluate(() => {
    const r = (n) =>
      n
        ? (() => {
            const b = n.getBoundingClientRect();
            const y = window.scrollY;
            return {
              topo: Math.round(b.top + y),
              fundo: Math.round(b.bottom + y),
              esq: Math.round(b.left),
              dir: Math.round(b.right),
              w: Math.round(b.width),
              h: Math.round(b.height),
            };
          })()
        : null;

    const secao = document.querySelector('.cta-ref');
    const palco = document.querySelector('.cta-ref-palco');
    const arte = document.querySelector('.cta-ref-arte');
    const blob = document.querySelector('.cta-ref-blob');
    const selo = document.querySelector('.cta-ref-selo');
    const botao = document.querySelector('.cta-ref-botao');
    const ponto = document.querySelector('.cta-ref-fio-ponto');
    const rodape = document.querySelector('footer');
    if (!secao || !arte) return null;

    const eSecao = getComputedStyle(secao);
    const cArte = r(arte);
    const cSecao = r(secao);
    const cBlob = r(blob);

    /* A REGIÃO DE FILTRO, à mão. O `<svg>` declara `x/y = -30%` e
       `width/height = 160%` no `<filter>`, então a tinta possível vai de
       `caixa - 0,3 × lado` a `caixa + 1,3 × lado`. É o retângulo que o
       `overflow: hidden` da seção corta, e nenhuma API de layout o devolve. */
    const filtro = cBlob
      ? {
          topo: Math.round(cBlob.topo - 0.3 * cBlob.h),
          fundo: Math.round(cBlob.fundo + 0.3 * cBlob.h),
          esq: Math.round(cBlob.esq - 0.3 * cBlob.w),
          dir: Math.round(cBlob.dir + 0.3 * cBlob.w),
        }
      : null;

    return {
      secao: {
        caixa: cSecao,
        overflow: `${eSecao.overflowX} / ${eSecao.overflowY}`,
        padBaixo: eSecao.paddingBottom,
        padTopo: eSecao.paddingTop,
      },
      palco: r(palco),
      arte: { caixa: cArte, overflow: getComputedStyle(arte).overflow, top: getComputedStyle(arte).top, transform: getComputedStyle(arte).transform },
      blob: cBlob,
      blobRegiaoDeFiltro: filtro,
      selo: r(selo),
      botao: r(botao),
      rodape: r(rodape),
      /* Os três números que NOMEIAM a causa. Positivo = passa do limite. */
      folgas: {
        arteAlemDoFundoDaSecao: cArte ? cArte.fundo - cSecao.fundo : null,
        filtroAlemDoFundoDaSecao: filtro ? filtro.fundo - cSecao.fundo : null,
        arteAlemDoTopoDoRodape: rodape ? cArte.fundo - r(rodape).topo : null,
        respiroDaArteAoFundoDaSecao: cArte ? cSecao.fundo - cArte.fundo : null,
        /* Altura da arte contra a do palco: se a arte é MAIS ALTA que o palco e
           está centrada nele (`top: 50%` + `translateY(-50%)`), ela sobra em cima
           e embaixo por metade da diferença — sem nenhum erro de posição. */
        arteMenosPalco: cArte && r(palco) ? cArte.h - r(palco).h : null,
      },
      rolagemHorizontal: {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        vaza: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      },
      /* SIS-253 — o que não pode regredir. */
      motionSis253: {
        pontoCx: ponto ? ponto.getAttribute('cx') : null,
        pontoCy: ponto ? ponto.getAttribute('cy') : null,
        seloAnimacao: selo ? getComputedStyle(selo).animationName : null,
        orbitaAnimacao: (() => {
          const o = document.querySelector('.cta-ref-orbita');
          return o ? getComputedStyle(o).animationName : null;
        })(),
      },
      /* SIS-253 — O POUSO DO PONTO. O fio termina no CENTRO do círculo ciano do
         botão, e essa concordância depende da posição vertical do botão: ela é
         `--cta-ref-botao-y-topo` menos meia altura, e era justamente a meia altura
         que o `transform: none` do reveal estava comendo. `dx`/`dy` em pixels entre
         o centro do ponto e o centro do círculo — as voltas da SIS-253 fecharam
         em ~1–2px, então qualquer coisa maior é regressão. */
      pousoDoPonto: (() => {
        const c = document.querySelector('.cta-ref-botao-circulo');
        if (!ponto || !c) return null;
        const p = ponto.getBoundingClientRect();
        const q = c.getBoundingClientRect();
        return {
          dx: Math.round((p.left + p.width / 2 - (q.left + q.width / 2)) * 10) / 10,
          dy: Math.round((p.top + p.height / 2 - (q.top + q.height / 2)) * 10) / 10,
        };
      })(),
      /* SIS-265 — o logo HD do selo. */
      seloSrc: selo?.querySelector('img')?.getAttribute('src') ?? null,
      seloNaturalWidth: selo?.querySelector('img')?.naturalWidth ?? null,
    };
  });

for (const width of LARGURAS) {
  const ctx = await nav.newContext({ viewport: { width, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await ctx.newPage();
  p.on('console', (m) => { if (m.type() === 'error') res.erros.push(`${width}: ${m.text()}`); });
  await p.goto(`${BASE}/esg`, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 60000 }).catch(() => null);
  /* A seção é a última da página: sem rolar até ela o reveal não dispara e a arte
     seria medida no estado de entrada, não no final — que é justamente a confusão
     que a issue pede para descartar («mesmo depois do scroll/entrada correta»). */
  await p.evaluate(() => document.querySelector('.cta-ref')?.scrollIntoView({ block: 'end' }));
  await p.waitForTimeout(1800);
  res.porLargura[width] = await sonda(p);
  await p.screenshot({ path: `docs/capturas/sis276-cta-${width}-${MOMENTO}.png` });
  await ctx.close();
}

await nav.close();
await writeFile(`docs/medidas/sis276-${MOMENTO}.json`, `${JSON.stringify(res, null, 1)}\n`);
console.log(JSON.stringify(res, null, 1));
