/**
 * SIS-188 — sonda da seção «Principais Soluções Sistran Labs» de `/sistran-labs`.
 *
 * `node scripts/medir-carimbo-labs-sis188.mjs antes|depois`
 *
 * O que ela responde, e por que cada bloco existe:
 *
 * 1. `alvo` — a peça no lugar da tag: classe, caixa a 1440, e (no «depois») a
 *    razão de aspecto EFETIVA contra a intrínseca do arquivo. Este é o portão
 *    principal desta issue: a folha `carimbo-batida.css` nasceu com
 *    `--carimbo-batida-ar: 640 / 200` chapado para a arte de `/parceiros`, e a
 *    daqui é 996x348. Se a razão de exibição não bater com a do arquivo, o
 *    desenho está ACHATADO — que é exatamente o defeito que o docblock daquela
 *    folha promete evitar.
 * 2. `linhaMenor` — a altura em px da linha «REALIZADO PELA» derivada da fração
 *    de tinta medida no arquivo. É o número que decide o tamanho, no mesmo
 *    critério da SIS-277: quem governa é a legibilidade da linha pequena.
 * 3. `titulo` — o h2 continua lá, com id e caixa. «h2 intacto» é critério.
 * 4. `batida` — estado inicial FORÇADO. Não dá para confiar no instante da
 *    montagem: a batida da casa dura 0,42s e a seção está ABAIXO DA DOBRA, então
 *    um `read` logo após o `goto` pega ora o começo ora o fim. Aqui a página é
 *    aberta com a seção fora de quadro, o carimbo é lido em repouso, a seção é
 *    rolada para dentro e o carimbo é lido DE NOVO por quadros seguidos — a
 *    escala máxima observada é a prova de que houve batida, e onde ela acontece
 *    prova que foi na entrada em quadro e não no load.
 * 5. `reduce` — os dois canais da casa, sempre juntos: a media query e
 *    `html[data-motion="reduce"]`. Em ambos o carimbo tem de NASCER assentado
 *    (`transform: none`, `opacity: 1`) — animação morta que deixasse
 *    `opacity: 0` esconderia a peça para sempre.
 * 6. `contraste` — a tinta é #0757c7 e o fundo é `section-light-blue`. Peça
 *    gráfica com texto embutido: a WCAG pede 4.5 para o texto e 3.0 para
 *    componente/gráfico, e aqui o que se lê é texto, então a régua é 4.5.
 * 7. `rede` — o que o navegador BAIXOU. Com `images: { unoptimized: true }`
 *    (SIS-154) o `next/image` entrega o arquivo cru, então o peso é o do disco e
 *    é preciso confirmar QUAL arquivo saiu.
 *
 * Ferramenta de bancada; nada disto entra no bundle.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const VOLTA = process.argv[2] === 'antes' ? 'antes' : 'depois';
const ROTA = 'http://localhost:3000/sistran-labs';

/* Fração da altura do arquivo ocupada pela cap-height de «REALIZADO PELA»,
   medida no alfa de `carimbo-sistran-labs.png` em janelas estreitas de 50px
   (janela larga somaria o tombo de -3,03° da arte à altura da letra): 32px de
   348px. É a constante que transforma «altura de exibição» em «px de letra». */
const FRACAO_LINHA_MENOR = 32 / 348;

const LUM = (r, g, b) => {
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

const navegador = await chromium.launch();
const erros = [];
const rede = [];

async function abrir(opcoes = {}) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 }, ...opcoes });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const pg = await ctx.newPage();
  pg.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  pg.on('response', (r) => {
    if (/carimbo/i.test(r.url())) {
      rede.push({
        url: r.url().replace('http://localhost:3000', ''),
        status: r.status(),
        tipo: r.headers()['content-type'],
        bytes: Number(r.headers()['content-length'] ?? 0),
      });
    }
  });
  return { ctx, pg };
}

/* O seletor do alvo cobre as duas voltas: «antes» é a tag textual, «depois» é o
   carimbo. Medir os dois com a MESMA pergunta é o que deixa o par comparável. */
const SELETOR_ALVO = '.labs-principais .carimbo-batida, .labs-principais .tag-section';

const PECAS = () => {
  const secao = document.querySelector('.labs-principais');
  const alvo = document.querySelector(
    '.labs-principais .carimbo-batida, .labs-principais .tag-section',
  );
  const img = alvo?.querySelector('img') ?? null;
  const h2 = document.getElementById('labs-principais');
  const cx = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
  };
  const est = (el, props) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    return Object.fromEntries(props.map((p) => [p, s.getPropertyValue(p)]));
  };
  return {
    secao: {
      classe: secao?.className ?? null,
      fundo: secao ? getComputedStyle(secao).backgroundColor : null,
      fundoImagem: secao ? getComputedStyle(secao).backgroundImage.slice(0, 120) : null,
    },
    alvo: alvo
      ? {
          etiqueta: alvo.tagName.toLowerCase(),
          classe: alvo.className,
          texto: alvo.textContent?.trim() || null,
          caixa: cx(alvo),
          ar: est(alvo, ['aspect-ratio', '--carimbo-batida-ar', '--carimbo-batida-w']),
          transform: getComputedStyle(alvo).transform,
          opacity: getComputedStyle(alvo).opacity,
        }
      : null,
    imagem: img
      ? {
          src: img.getAttribute('src'),
          alt: img.getAttribute('alt'),
          w: img.getAttribute('width'),
          h: img.getAttribute('height'),
          naturalW: img.naturalWidth,
          naturalH: img.naturalHeight,
          fetchpriority: img.getAttribute('fetchpriority'),
          loading: img.getAttribute('loading'),
          objectFit: getComputedStyle(img).objectFit,
          caixa: cx(img),
        }
      : null,
    titulo: h2
      ? {
          etiqueta: h2.tagName.toLowerCase(),
          id: h2.id,
          texto: h2.textContent?.trim(),
          fonte: getComputedStyle(h2).fontSize,
          peso: getComputedStyle(h2).fontWeight,
          cor: getComputedStyle(h2).color,
          caixa: cx(h2),
        }
      : null,
    /* Nomeia o que a seção usa como rótulo acessível. Se o carimbo tivesse
       entrado como `aria-labelledby` ou engolido o h2, é aqui que apareceria. */
    rotulo: secao?.getAttribute('aria-labelledby') ?? null,
    tagTextualSobrou: !!document.querySelector('.labs-principais .tag-section'),
  };
};

/* ── volta principal ───────────────────────────────────────────────────────── */
const { ctx, pg } = await abrir();
await pg.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
await pg.waitForTimeout(900);

const pecas = await pg.evaluate(PECAS);

/* ── a batida, por quadros ────────────────────────────────────────────────────
   A seção está abaixo da dobra. Rolo até ela e amostro a escala por ~900ms: se a
   batida acontece na ENTRADA EM QUADRO, a maior escala observada é > 1. Se ela
   tivesse acontecido no load (atrás da dobra), tudo já estaria em 1. */
let batida = null;
if (pecas.alvo) {
  const recarrega = await abrir();
  await recarrega.pg.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  await recarrega.pg.waitForTimeout(600);
  const antesDeRolar = await recarrega.pg.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      transform: getComputedStyle(el).transform,
      opacity: getComputedStyle(el).opacity,
      /* Prova de que a peça estava FORA de quadro quando a página carregou —
         sem isto, «a batida foi na entrada» seria afirmação sem lastro. */
      foraDeQuadro: r.top > window.innerHeight || r.bottom < 0,
      topo: +r.top.toFixed(0),
      viewport: window.innerHeight,
    };
  }, SELETOR_ALVO);

  /* O GRAVADOR FICA SOLTO NA PÁGINA, e a espera acontece no Node. A primeira
     versão desta sonda fazia `while (…) { await new Promise(rAF) }` DENTRO de um
     `evaluate` e devolveu 8 quadros em 950ms com `escalaMaxima: 1` — ou seja, não
     mediu nada: o `evaluate` mantém uma promessa pendente no protocolo e a
     rajada de `getComputedStyle` a cada quadro força reflow síncrono, então os
     quadros em que a batida acontece são justamente os que a amostragem come.
     Aqui o rAF é instalado e o controle volta ao navegador; o Node só dorme e
     depois LÊ o array. E o gravador começa ANTES do scroll, senão o instante em
     que o observador dispara pode cair fora da janela. */
  await recarrega.pg.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    window.__sis188 = [];
    const t0 = performance.now();
    /* DUAS CORREÇÕES, as duas de defeito medido nesta sonda:

       1. `el.style`, NÃO `getComputedStyle` — é o GSAP que escreve inline, e ler o
          computado a cada amostra força reflow síncrono. Antes do tween o inline
          está vazio; vazio significa repouso, que é o que o CSS diz.
       2. `setInterval`, NÃO `requestAnimationFrame`. O GSAP escreve no seu ticker,
          que é rAF; amostrar TAMBÉM em rAF é amostrar na mesma cadência de quem
          escreve, e o resultado é aliasing — duas voltas seguidas devolveram 13 e
          11 quadros em 1,6s (a página de `next dev` roda a ~7fps na entrada da
          seção) e a maior escala vista foi 0,947, ou seja apenas o rabo do repique,
          nunca o pico. Um temporizador de 8ms roda entre os quadros e por isso
          registra TODO valor que o GSAP chegou a escrever, qualquer que seja a taxa
          de quadros da página. */
    const rel = setInterval(() => {
      window.__sis188.push({
        t: Math.round(performance.now() - t0),
        transform: el.style.transform || 'none',
        opacity: el.style.opacity || '1',
      });
      if (performance.now() - t0 >= 1600) clearInterval(rel);
    }, 8);
  }, SELETOR_ALVO);
  await recarrega.pg.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ block: 'center' });
  }, SELETOR_ALVO);
  await recarrega.pg.waitForTimeout(1900);
  const amostras = await recarrega.pg.evaluate(() => window.__sis188 ?? null);

  /* Escala a partir da matriz: `matrix(a,b,c,d,e,f)` → a escala uniforme é
     hypot(a,b), que já absorve a rotação e por isso não confunde tombo com
     tamanho. */
  /* DUAS GRAMÁTICAS, porque a amostragem passou a ler o estilo INLINE: o GSAP
     escreve funções nomeadas (`translate(…) scale(…) rotate(…)`), enquanto
     `getComputedStyle` devolve sempre `matrix(a,b,c,d,e,f)`. Ler inline com o
     parser de matriz daria escala 0 (pegaria os dois zeros do `translate`), então
     as funções nomeadas vêm primeiro e a matriz é o caminho de trás. */
  const escalaDe = (t) => {
    const s = t.match(/scale(?:3d)?\(\s*(-?\d+(?:\.\d+)?)/);
    if (s) return +Number(s[1]).toFixed(3);
    const n = (t.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
    return /^matrix/.test(t) && n.length >= 4 ? +Math.hypot(n[0], n[1]).toFixed(3) : 1;
  };
  const giroDe = (t) => {
    const r = t.match(/rotate(?:Z)?\(\s*(-?\d+(?:\.\d+)?)deg/);
    if (r) return +Number(r[1]).toFixed(2);
    const n = (t.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
    return /^matrix/.test(t) && n.length >= 4
      ? +((Math.atan2(n[1], n[0]) * 180) / Math.PI).toFixed(2)
      : 0;
  };
  const escalas = (amostras ?? []).map((a) => escalaDe(a.transform));
  batida = {
    antesDeRolar,
    quadros: (amostras ?? []).length,
    escalaMaxima: escalas.length ? Math.max(...escalas) : null,
    escalaFinal: escalas.length ? escalas[escalas.length - 1] : null,
    giroMaximoAbs: (amostras ?? []).length
      ? Math.max(...amostras.map((a) => Math.abs(giroDe(a.transform))))
      : null,
    giroFinal: amostras?.length ? giroDe(amostras[amostras.length - 1].transform) : null,
    opacidadeMinima: amostras?.length ? Math.min(...amostras.map((a) => Number(a.opacity))) : null,
    opacidadeFinal: amostras?.length ? Number(amostras[amostras.length - 1].opacity) : null,
    /* Só as amostras em que ALGO MUDOU. Com o temporizador de 8ms são ~200 leituras
       em 1,6s e a maioria repete o valor do quadro anterior (a página desenha muito
       mais devagar do que a sonda lê); guardar as repetições engordaria o JSON sem
       acrescentar um dado. O que resta é a trajetória escrita pelo GSAP, quadro a
       quadro de verdade. */
    trilha: (amostras ?? [])
      .map((a) => ({ t: a.t, escala: escalaDe(a.transform), giro: giroDe(a.transform), op: +a.opacity }))
      .filter((a, i, todas) => {
        const ant = todas[i - 1];
        return !ant || ant.escala !== a.escala || ant.giro !== a.giro || ant.op !== a.op;
      }),
  };
  await recarrega.ctx.close();
}

/* ── contraste da tinta contra o fundo REALMENTE PINTADO ──────────────────────
   Aqui NÃO SERVE ler as paradas do `background-image`. O fundo desta seção é uma
   pilha de QUATRO camadas — três radiais translúcidas (uma delas a pluma navy
   `rgb(5 31 70 / 18%)` centrada em `50% 25rem`, ou seja justamente na altura em
   que o carimbo fica) sobre um degradê linear. As paradas isoladas são cores que
   ninguém vê: o que existe na tela é a COMPOSIÇÃO delas. Uma primeira versão
   desta sonda listava as paradas e devolvia razões de 1,15 e 3,20 para camadas
   translúcidas e para `transparent` — números sem qualquer relação com o que a
   pessoa enxerga.

   Então a medição é do RASTER: recorto a faixa onde o carimbo está e leio os
   pixels de fundo em volta dele. Vale o pixel MAIS ESCURO da vizinhança, que é o
   pior caso para tinta escura. */
const faixa = await pg.evaluate(() => {
  const el = document.querySelector('.labs-principais .carimbo-batida, .labs-principais .tag-section');
  if (!el) return null;
  el.scrollIntoView({ block: 'center' });
  return true;
});
await pg.waitForTimeout(700);
/* A CAIXA EXATA DA PEÇA, e tirada pelo PRÓPRIO ELEMENTO.
   Duas correções aqui, ambas de defeito medido:

   1. Sem moldura em volta. A primeira versão pegava 24px em torno «para ver o
      fundo que a tinta encosta» e devolveu `fundoMaisEscuro: rgb(10, 31, 68)` com
      razão 2,47 — que é o navy de `--text-ink`, isto é, os PRÓPRIOS GLIFOS DO H2
      logo abaixo, contados como se fossem fundo. Dentro da caixa do carimbo só
      existem duas coisas: a tinta da arte (o interior da cápsula é transparente) e
      o fundo da seção atravessando o alfa — que é exatamente o fundo contra o qual
      as duas linhas de texto são lidas.
   2. `elementoAlvo.screenshot()` em vez de `page.screenshot({ clip })`. Com o
      `clip` montado a partir de `getBoundingClientRect()` o arquivo saiu 596x270
      para uma caixa de 311x108,9 — proporção que não é escala nenhuma da peça, e
      sim região errada: o retângulo do `clip` é do documento e o do rect é do
      quadro. Pedir a foto AO ELEMENTO não tem esse encontro de sistemas de
      coordenadas. */
const elementoAlvo = faixa ? await pg.$(SELETOR_ALVO) : null;
if (elementoAlvo) {
  await elementoAlvo.screenshot({ path: `docs/capturas/sis188-${VOLTA}-recorte.png` });
}
const recorte = elementoAlvo ? await elementoAlvo.boundingBox() : null;

/* ── O FUNDO DA SEÇÃO, LONGE DA PEÇA ──────────────────────────────────────────
   O recorte da peça responde «a tinta contra o que ela encosta», mas dentro dela
   há pixels que não são nem tinta cheia nem fundo puro: a arte tem linhas-guia
   diagonais em alfa PARCIAL, e uma tinta translúcida sobre o azul claro devolve um
   azul intermediário que qualquer classificador por cor vai chamar de fundo. Sem
   este segundo bloco não há como dizer se um «fundo escuro» achado ali é a página
   ou é a própria arte.
   Então mede-se o fundo onde ele é indiscutível: uma amostra de 40x40 ao LADO do
   carimbo, na mesma altura, dentro da mesma seção. A leitura é feita sobre uma foto
   do QUADRO inteiro e indexada pelo rect do elemento — as duas coisas são
   viewport-relativas, o que evita o encontro de coordenadas que estragou o `clip`. */
const patch = elementoAlvo
  ? await pg.evaluate(() => {
      const el = document.querySelector(
        '.labs-principais .carimbo-batida, .labs-principais .tag-section',
      );
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.right + 80), y: Math.round(r.top + r.height / 2), lado: 40 };
    })
  : null;
if (patch) {
  await pg.screenshot({ path: `docs/capturas/sis188-${VOLTA}-quadro.png` });
}
const contraste = await pg.evaluate(() => {
  const secao = document.querySelector('.labs-principais');
  const s = secao ? getComputedStyle(secao) : null;
  return s ? { backgroundColor: s.backgroundColor, backgroundImage: s.backgroundImage.slice(0, 220) } : null;
});

await pg.screenshot({ path: `docs/capturas/sis188-${VOLTA}-1440.png`, fullPage: false });
await pg.evaluate(() => document.querySelector('.labs-principais')?.scrollIntoView({ block: 'start' }));
await pg.waitForTimeout(1200);
await pg.screenshot({ path: `docs/capturas/sis188-${VOLTA}-secao-1440.png` });

const vaza = await pg.evaluate(() => ({
  scroll: document.documentElement.scrollWidth,
  cliente: document.documentElement.clientWidth,
  vaza: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
}));
await ctx.close();

/* ── reduce, os dois canais ───────────────────────────────────────────────── */
async function medirReduce(canal) {
  const { ctx: c, pg: p } = await abrir(
    canal === 'media' ? { reducedMotion: 'reduce' } : {},
  );
  await p.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  if (canal === 'atributo') {
    await p.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
  }
  await p.waitForTimeout(400);
  const r = await p.evaluate(async (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    await new Promise((res) => setTimeout(res, 500));
    const s = getComputedStyle(el);
    const r2 = el.getBoundingClientRect();
    return {
      transform: s.transform,
      opacity: s.opacity,
      visivel: r2.width > 0 && r2.height > 0 && Number(s.opacity) > 0.99,
      caixa: { w: +r2.width.toFixed(1), h: +r2.height.toFixed(1) },
    };
  }, SELETOR_ALVO);
  await p.screenshot({ path: `docs/capturas/sis188-${VOLTA}-reduce-${canal}.png` });
  await c.close();
  return r;
}
const reduceMedia = await medirReduce('media');
const reduceAtributo = await medirReduce('atributo');

await navegador.close();

/* ── derivados ────────────────────────────────────────────────────────────── */
const caixa = pecas.alvo?.caixa ?? null;
const nat = pecas.imagem ? pecas.imagem.naturalW / pecas.imagem.naturalH : null;
const arEfetiva = caixa && caixa.h ? caixa.w / caixa.h : null;

const relatorio = {
  volta: VOLTA,
  rota: ROTA,
  viewport: '1440x900',
  ...pecas,
  razaoDeAspecto: {
    intrinsecaDoArquivo: nat ? +nat.toFixed(4) : null,
    exibida: arEfetiva ? +arEfetiva.toFixed(4) : null,
    /* Meia porcentagem de folga cobre o arredondamento subpixel do layout; acima
       disso o desenho já achata de forma visível. */
    bate: nat && arEfetiva ? Math.abs(nat - arEfetiva) / nat < 0.005 : null,
  },
  linhaMenor: caixa
    ? {
        fracaoNoArquivo: +FRACAO_LINHA_MENOR.toFixed(4),
        alturaExibida: +caixa.h.toFixed(1),
        pxDaLetra: +(caixa.h * FRACAO_LINHA_MENOR).toFixed(2),
        /* 10px é o alvo que a SIS-277 fixou para a linha pequena da arte de
           `/parceiros` — mesma casa, mesmo critério. */
        alvoDaCasa: 10,
      }
    : null,
  larguraRelativaAoTitulo:
    caixa && pecas.titulo ? +((caixa.w / pecas.titulo.caixa.w) * 100).toFixed(1) : null,
  batida,
  reduce: { media: reduceMedia, atributo: reduceAtributo },
  contraste: await (async () => {
    if (!recorte) return null;
    /* A tinta é UMA cor chapada no arquivo: `rgb(7, 87, 199)`, medida no PNG
       (39.684 pixels totalmente opacos nela, contra 25 pixels em variações de
       ±1 de antialiasing). */
    const tinta = [7, 87, 199];
    const { data, info } = await sharp(`docs/capturas/sis188-${VOLTA}-recorte.png`)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width: W, height: H, channels: C } = info;
    /* TRÊS POPULAÇÕES, e não duas, porque com duas o número não quer dizer nada.
       Um pixel do recorte é tinta, é fundo, ou é a MISTURA dos dois na borda das
       letras — a franja de antialiasing. A franja é, por construção, mais escura
       que o fundo e mais clara que a tinta, então tomar «o pixel mais escuro que
       não é tinta» sempre devolve franja: numa volta anterior deu
       `rgb(96, 149, 221)` com razão 2,14, que não é o fundo de ninguém. É o
       defeito que a nota `raster-subestima-texto-pequeno` descreve, e a saída dela
       é pedir DOIS números em vez de um só pior-caso.

       O corte: a mistura meio a meio entre a tinta `rgb(7,87,199)` e o azul claro
       da seção fica a ~137 unidades da tinta, então tudo abaixo de 200 pode ser
       mistura e só acima disso é fundo sem dúvida. */
    const distanciaDaTinta = (r, g, b) =>
      Math.hypot(r - tinta[0], g - tinta[1], b - tinta[2]);
    let maisEscuro = null;
    const amostrados = [];
    let franja = 0;
    let pixelsDeTinta = 0;
    for (let y = 0; y < H; y += 1) {
      for (let x = 0; x < W; x += 1) {
        const i = (y * W + x) * C;
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        const d = distanciaDaTinta(r, g, b);
        if (d < 110) {
          pixelsDeTinta += 1;
          continue;
        }
        if (d < 200) {
          franja += 1;
          continue;
        }
        const l = LUM(r, g, b);
        amostrados.push(l);
        if (!maisEscuro || l < maisEscuro.l) maisEscuro = { r, g, b, l };
      }
    }
    const medio = amostrados.length
      ? amostrados.reduce((a, b) => a + b, 0) / amostrados.length
      : null;
    const razaoDe = (l) => +((Math.max(l, LUM(...tinta)) + 0.05) / (Math.min(l, LUM(...tinta)) + 0.05)).toFixed(2);
    return {
      tinta: 'rgb(7, 87, 199)',
      pilhaDeFundo: contraste,
      pixelsDeTinta,
      pixelsDeFranja: franja,
      /* O fundo puro da seção, medido AO LADO da peça — ver a nota do `patch`. É
         este o número que responde «a linha se lê contra o fundo desta seção?»;
         o `fundoMaisEscuro` de dentro do recorte pode ser linha-guia da própria
         arte em alfa parcial, e não a página. */
      fundoDaSecaoAoLado: await (async () => {
        if (!patch) return null;
        const { data: d2, info: i2 } = await sharp(`docs/capturas/sis188-${VOLTA}-quadro.png`)
          .extract({
            left: Math.max(0, patch.x),
            top: Math.max(0, patch.y - patch.lado / 2),
            width: patch.lado,
            height: patch.lado,
          })
          .raw()
          .toBuffer({ resolveWithObject: true });
        let escuro = null;
        let soma = 0;
        let n = 0;
        for (let i = 0; i < d2.length; i += i2.channels) {
          const [r, g, b] = [d2[i], d2[i + 1], d2[i + 2]];
          const l = LUM(r, g, b);
          soma += l;
          n += 1;
          if (!escuro || l < escuro.l) escuro = { r, g, b, l };
        }
        return {
          amostra: `${patch.lado}x${patch.lado} em x=${patch.x}, y=${patch.y}`,
          pixels: n,
          maisEscuro: { cor: `rgb(${escuro.r}, ${escuro.g}, ${escuro.b})`, razao: razaoDe(escuro.l) },
          medio: { razao: razaoDe(soma / n) },
        };
      })(),
      pixelsDeFundoAmostrados: amostrados.length,
      fundoMaisEscuro: maisEscuro
        ? { cor: `rgb(${maisEscuro.r}, ${maisEscuro.g}, ${maisEscuro.b})`, razao: razaoDe(maisEscuro.l) }
        : null,
      fundoMedio: medio !== null ? { razao: razaoDe(medio) } : null,
      /* Régua: o que se lê aqui é TEXTO dentro de uma peça gráfica, então vale
         4.5 (WCAG 1.4.3), e não os 3.0 de componente/gráfico. */
      exigido: 4.5,
    };
  })(),
  rede,
  vaza,
  erros,
};

await mkdir('docs/medidas', { recursive: true });
await writeFile(`docs/medidas/sis188-${VOLTA}.json`, `${JSON.stringify(relatorio, null, 1)}\n`);
console.log(JSON.stringify(relatorio, null, 1));
