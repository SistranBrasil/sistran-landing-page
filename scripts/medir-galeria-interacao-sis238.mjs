/* SIS-238, segunda metade dos critérios: o que NÃO é geometria de rolagem.

   1. HOVER antecipa, CLIQUE fixa, ROLAGEM retoma — a sequência exata que a issue
      descreve, medida como três transições encadeadas no mesmo percurso.
   2. TECLADO: Tab alcança os quatro botões, `→`/`←`/`Home`/`End` andam, `Enter` e
      `Espaço` abrem, e o foco fica VISÍVEL (o anel é lido em pixel, nas duas
      superfícies: painel claro e painel marinho).
   3. MOVIMENTO REDUZIDO nos DOIS canais — a media query do sistema e o
      `html[data-motion='reduce']` que o alternador do site escreve. O que se prova
      é o que a receita da casa exige: nada fica preso no estado inicial da
      animação (arte com `opacity: 0`, fio com `scaleX(0)`), não há sticky longo, e
      nenhuma transição passa de 150ms.
   4. MOBILE: `scroll-snap` de 82vw com o painel seguinte parcialmente visível, e
      alvo de toque >= 44x44px.
   5. DESLOCAMENTO SEM SALTO DE LAYOUT: a altura do documento não muda durante o
      percurso da rampa (se mudasse, `flex-grow` estaria empurrando a página).

     node scripts/medir-galeria-interacao-sis238.mjs
*/
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROTA = 'http://localhost:3000/quem-somos';
const out = { rota: ROTA, quando: new Date().toISOString() };

const nav = await chromium.launch({ executablePath: EXE });
const sharp = (await import('sharp')).default;

async function abrir({ largura, reduzido = false, viaAtributo = false }) {
  const ctx = await nav.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
    /* O canal do SISTEMA. `viaAtributo` usa o outro canal, o do site. */
    reducedMotion: reduzido && !viaAtributo ? 'reduce' : 'no-preference',
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const pag = await ctx.newPage();
  await pag.goto(ROTA, { waitUntil: 'domcontentloaded' });
  await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  if (viaAtributo) {
    await pag.evaluate(() => {
      document.documentElement.dataset.motion = 'reduce';
    });
    await pag.waitForTimeout(400);
  }
  await pag.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[href="#conteudo"]{display:none!important}',
  });
  if (!(await pag.evaluate(() => !!document.querySelector('.rgal-secao')))) {
    throw new Error('a galeria não está montada — nada a medir');
  }
  return { ctx, pag };
}

const estado = (pag) =>
  pag.evaluate(() => {
    const paineis = [...document.querySelectorAll('.rgal-painel')];
    return {
      ativo: paineis.findIndex((p) => p.dataset.ativo === 'true'),
      expandido: paineis.map((p) => p.querySelector('.rgal-botao').getAttribute('aria-expanded')),
    };
  });

/* ── 1440: hover, clique, rolagem, teclado ─────────────────────────────────── */
{
  const { ctx, pag } = await abrir({ largura: 1440 });
  const rampa = await pag.evaluate(() => {
    const b = document.querySelector('.rgal-rampa').getBoundingClientRect();
    return { topoDoc: b.top + window.scrollY, altura: b.height };
  });
  const irPara = async (frac) => {
    await pag.evaluate((y) => window.scrollTo(0, y), rampa.topoDoc + (rampa.altura - 900) * frac);
    await pag.waitForTimeout(900);
  };

  /* A sequência da issue, no mesmo percurso e sem recarregar. */
  await irPara(0.02);
  const seq = { porRolagem: await estado(pag) };
  await pag.hover('.rgal-painel:nth-child(3) .rgal-botao');
  await pag.waitForTimeout(800);
  seq.aoApontar = await estado(pag);
  await pag.mouse.move(2, 2);
  await pag.waitForTimeout(800);
  seq.aoSairDoPonteiro = await estado(pag);
  await pag.click('.rgal-painel:nth-child(4) .rgal-botao');
  await pag.waitForTimeout(800);
  seq.aoClicar = await estado(pag);
  await irPara(0.51);
  seq.rolagemRetoma = await estado(pag);
  out.sequencia1440 = seq;

  /* TECLADO. `Tab` a partir do documento até cair no primeiro botão da galeria. */
  await irPara(0.02);
  const tab = { paradasAteAGaleria: 0, alcancou: false };
  await pag.evaluate(() => document.body.focus());
  for (let i = 0; i < 80; i++) {
    await pag.keyboard.press('Tab');
    const ondeEstou = await pag.evaluate(() => {
      const a = document.activeElement;
      return { rgal: !!a?.classList?.contains('rgal-botao'), tag: a?.tagName };
    });
    tab.paradasAteAGaleria = i + 1;
    if (ondeEstou.rgal) {
      tab.alcancou = true;
      break;
    }
  }
  const teclas = {};
  for (const [nome, tecla] of [
    ['setaDireita', 'ArrowRight'],
    ['setaDireita2', 'ArrowRight'],
    ['setaEsquerda', 'ArrowLeft'],
    ['end', 'End'],
    ['home', 'Home'],
  ]) {
    await pag.keyboard.press(tecla);
    await pag.waitForTimeout(700);
    teclas[nome] = {
      ...(await estado(pag)),
      focoNoIndice: await pag.evaluate(() =>
        [...document.querySelectorAll('.rgal-botao')].findIndex((b) => b === document.activeElement),
      ),
    };
  }
  /* `Enter` e `Espaço` são nativos do `button` — e provar isso exige que o botão
     com foco NÃO seja o painel já ativo, senão a tecla "funciona" sem fazer nada.
     As setas fixam o painel ao mover o foco, então elas não servem de transporte
     aqui: o transporte é `Tab`, que move o foco e não mexe no estado. */
  const isolarTecla = async (tecla, passosDeTab) => {
    await pag.evaluate(() => {
      document.querySelectorAll('.rgal-botao')[0].click();
    });
    /* O clique deixa o ponteiro sobre o painel; sem tirá-lo daqui, `apontado`
       mandaria no estado e a leitura seria do hover, não da tecla. */
    await pag.mouse.move(2, 2);
    await pag.waitForTimeout(700);
    await pag.evaluate(() => document.querySelectorAll('.rgal-botao')[0].focus());
    for (let i = 0; i < passosDeTab; i++) await pag.keyboard.press('Tab');
    await pag.waitForTimeout(400);
    const antes = await estado(pag);
    const focoEm = await pag.evaluate(() =>
      [...document.querySelectorAll('.rgal-botao')].findIndex((b) => b === document.activeElement),
    );
    await pag.keyboard.press(tecla);
    await pag.waitForTimeout(700);
    return { antesAtivo: antes.ativo, focoEm, depois: await estado(pag) };
  };
  teclas.enter = await isolarTecla('Enter', 2);
  teclas.espaco = await isolarTecla('Space', 3);
  out.teclado1440 = { tab, teclas };

  /* O ANEL DE FOCO, nas DUAS superfícies. Tem de ser foco por TECLADO: um
     `.focus()` programático não acende `:focus-visible` no Chromium, e a leitura
     sairia `outline-style: none` — que é um falso negativo, não um defeito.
     O caminho é `Tab` de verdade, e depois `→` para andar entre os painéis; o
     painel com foco fica ativo (marinho) e o vizinho à esquerda fica fechado
     (claro), então uma volta de setas cobre as duas superfícies. */
  await irPara(0.02);
  await pag.mouse.move(2, 2);
  await pag.evaluate(() => document.body.focus());
  for (let i = 0; i < 80; i++) {
    await pag.keyboard.press('Tab');
    if (await pag.evaluate(() => document.activeElement?.classList?.contains('rgal-botao'))) break;
  }
  /* Três leituras, porque há três situações e não duas: (0) o painel aberto
     alcançado por Tab; (1) o painel aberto alcançado por seta; (2) um painel
     FECHADO com foco — que só existe via `Tab`, porque as setas fixam o painel
     que recebem. É esse terceiro caso que exercita o ramo `--rgal-azul` da regra;
     sem ele, metade da regra de foco nunca seria medida. */
  const anel = [];
  for (const passo of [0, 1, 2]) {
    if (passo === 1) await pag.keyboard.press('ArrowRight');
    if (passo === 2) await pag.keyboard.press('Tab');
    await pag.waitForTimeout(800);
    const caixa = await pag.evaluate(() => {
      const b = document.activeElement;
      const p = b.closest('.rgal-painel');
      const r = b.getBoundingClientRect();
      /* O anel vive no `::after` (o alvo esticado), NÃO no botão — ler o botão
         devolve `none`, que é falso negativo. E `outline-offset` é NEGATIVO: o
         anel é desenhado para DENTRO da caixa. */
      const cs = getComputedStyle(b, '::after');
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
        ativo: p.dataset.ativo === 'true',
        tinta: p.dataset.tinta,
        outlineColor: cs.outlineColor,
        outlineWidth: cs.outlineWidth,
        outlineStyle: cs.outlineStyle,
        outlineOffset: cs.outlineOffset,
        alvo: { largura: Math.round(r.width), altura: Math.round(r.height) },
      };
    });
    /* E o anel tem de estar na TELA, não só no `computed style`: o pixel mais
       distante da cor do anel é comparado com a superfície do painel. */
    const png = await pag.screenshot();
    const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    const px = (x, y) => {
      const k = (y * info.width + x) * info.channels;
      return [data[k], data[k + 1], data[k + 2]];
    };
    const alvoCor = caixa.outlineColor.match(/\d+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
    /* Com `outline-offset: -3px` o anel corre pelas colunas x..x+3 e
       x+w-3..x+w, e pela linha de baixo. A borda de CIMA não aparece: o `::after`
       começa em `-100vh` e o painel recorta — o anel é visto como um colchete
       alto, que é o efeito pretendido (o alvo é o painel inteiro). */
    const conta = (pontos) => {
      let n = 0;
      for (const [x, y] of pontos) {
        if (x < 0 || y < 0 || x >= info.width || y >= info.height) continue;
        if (px(x, y).every((v, i) => Math.abs(v - alvoCor[i]) <= 28)) n += 1;
      }
      return n;
    };
    const laterais = [];
    const base = [];
    for (let dy = 4; dy <= caixa.h - 4; dy += 1) {
      for (const x of [caixa.x + 1, caixa.x + 2, caixa.x + caixa.w - 2, caixa.x + caixa.w - 3]) {
        laterais.push([x, caixa.y + dy]);
      }
    }
    for (let dx = 4; dx <= caixa.w - 4; dx += 1) {
      for (const dy of [caixa.h - 1, caixa.h - 2, caixa.h - 3]) base.push([caixa.x + dx, caixa.y + dy]);
    }
    anel.push({
      passo,
      ...caixa,
      pixelsDoAnelNasLaterais: conta(laterais),
      pixelsDoAnelNaBase: conta(base),
      amostrasLaterais: laterais.length,
      amostrasBase: base.length,
    });
    await pag.screenshot({ path: `docs/capturas/sis238-foco-${passo}.png` });
  }
  out.anelDeFoco1440 = anel;

  /* SALTO DE LAYOUT: a altura do documento ao longo do percurso. */
  const alturas = [];
  for (const frac of [0.02, 0.26, 0.51, 0.76, 0.98]) {
    await irPara(frac);
    alturas.push(await pag.evaluate(() => document.documentElement.scrollHeight));
  }
  out.alturaDoDocumento1440 = { amostras: alturas, variacao: Math.max(...alturas) - Math.min(...alturas) };

  await ctx.close();
}

/* ── MOVIMENTO REDUZIDO, nos dois canais ───────────────────────────────────── */
const lerReduzido = async (pag) =>
  pag.evaluate(() => {
    const quadro = document.querySelector('.rgal-quadro');
    const rampa = document.querySelector('.rgal-rampa');
    const lista = document.querySelector('.rgal-lista');
    const ms = (v) => v.split(',').map((s) => parseFloat(s) * (s.includes('ms') ? 1 : 1000));
    const durs = [];
    for (const el of document.querySelectorAll('.rgal-secao *')) {
      const cs = getComputedStyle(el);
      for (const d of cs.transitionDuration.split(',')) {
        const n = d.trim().endsWith('ms') ? parseFloat(d) : parseFloat(d) * 1000;
        if (!Number.isNaN(n)) durs.push(n);
      }
    }
    void ms;
    const artes = [...document.querySelectorAll('.rgal-arte')].map((a) => {
      const cs = getComputedStyle(a);
      return { opacity: cs.opacity, transform: cs.transform, visivel: a.getBoundingClientRect().height > 8 };
    });
    const fios = [...document.querySelectorAll('.rgal-fio')].map((f) => getComputedStyle(f).transform);
    return {
      posicaoDoQuadro: getComputedStyle(quadro).position,
      alturaDaRampa: Math.round(rampa.getBoundingClientRect().height),
      alturaDaJanela: window.innerHeight,
      colunasDaLista: getComputedStyle(lista).gridTemplateColumns,
      displayDaLista: getComputedStyle(lista).display,
      overflowXdaLista: getComputedStyle(lista).overflowX,
      transicaoMaisLongaMs: durs.length ? Math.max(...durs) : 0,
      artes,
      fios,
    };
  });

for (const [nome, opc] of [
  ['sistema', { largura: 1440, reduzido: true }],
  ['atributoDoSite', { largura: 1440, reduzido: true, viaAtributo: true }],
]) {
  const { ctx, pag } = await abrir(opc);
  await pag.$eval('.rgal-secao', (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await pag.waitForTimeout(900);
  out[`movimentoReduzido_${nome}`] = await lerReduzido(pag);
  mkdirSync('docs/capturas', { recursive: true });
  await pag.screenshot({ path: `docs/capturas/sis238-reduzido-${nome}.png`, fullPage: false });
  await ctx.close();
}

/* ── MOBILE: snap, 82vw, vizinho visível, alvo de toque ────────────────────── */
{
  const { ctx, pag } = await abrir({ largura: 390 });
  await pag.$eval('.rgal-lista', (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await pag.waitForTimeout(900);
  out.mobile390 = await pag.evaluate(() => {
    const lista = document.querySelector('.rgal-lista');
    const cs = getComputedStyle(lista);
    const paineis = [...document.querySelectorAll('.rgal-painel')];
    const caixaLista = lista.getBoundingClientRect();
    const p0 = paineis[0].getBoundingClientRect();
    const p1 = paineis[1].getBoundingClientRect();
    const botoes = paineis.map((p) => {
      const r = p.querySelector('.rgal-botao').getBoundingClientRect();
      return { largura: Math.round(r.width), altura: Math.round(r.height) };
    });
    return {
      scrollSnapType: cs.scrollSnapType,
      overflowX: cs.overflowX,
      snapAlignDoPainel: getComputedStyle(paineis[0]).scrollSnapAlign,
      larguraDoPainelEmVw: +((100 * p0.width) / window.innerWidth).toFixed(1),
      /* «o próximo painel parcialmente visível»: quanto do painel 2 cabe na
         janela da lista antes de qualquer rolagem horizontal. */
      pixelsVisiveisDoProximo: Math.round(Math.max(0, caixaLista.right - p1.left)),
      larguraDoProximo: Math.round(p1.width),
      alvosDeToque: botoes,
      rolagemHorizontalDaLista: Math.round(lista.scrollWidth - lista.clientWidth),
    };
  });
  await pag.screenshot({ path: 'docs/capturas/sis238-mobile-390.png' });
  await ctx.close();
}

await nav.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/galeria-interacao-sis238.json', JSON.stringify(out, null, 2));
void sharp;
console.log('gravado docs/medidas/galeria-interacao-sis238.json');
