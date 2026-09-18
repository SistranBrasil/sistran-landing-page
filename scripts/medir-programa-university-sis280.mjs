/**
 * SIS-280 — a seção `#university-programa` de `/sistran-university` passa à
 * composição de `public/imagensexemplo/exemploprograma.png`: folha clara com
 * grade, escrita à esquerda, arte à direita num quadro inclinado.
 *
 * Esta sonda mede o que a issue cobra, nas QUATRO janelas que ela nomeia
 * (390×844, 768×1024, 1024×768 e 1440×900):
 *
 *  - A GRADE. `grid-template-columns` computado, caixa de cada coluna, vão entre
 *    elas e a fração que cada uma ocupa do container. É o que diz se as duas
 *    colunas estão equilibradas no desktop e se viraram pilha no telefone.
 *  - OVERFLOW HORIZONTAL. `scrollWidth` do documento contra `innerWidth`, mais a
 *    borda direita do quadro contra a da janela — o quadro é inclinado e é ele o
 *    candidato a vazar.
 *  - CONTRASTE, pelo método da casa (`docs/medidas/COMO-MEDIR-CONTRASTE.md` §7):
 *    a letra é isolada pela diferença A−B entre duas abas, uma com a tinta e
 *    outra com a tinta apagada. Sai o par `razao` (corpo do glifo, cobertura
 *    >= 0,85 — é quem decide) e `rasterPior` (pior pixel, com a franja de
 *    antialiasing dentro). Piso 3:1 para texto grande (>=24px, ou >=18,66px com
 *    peso >=700) e 4,5:1 no resto. Cinco alvos: o rótulo, as DUAS partes do
 *    título (a navy e o realce azul, que têm tintas diferentes), o parágrafo e o
 *    `strong` dentro dele.
 *  - O TRANSFORM em três regimes: repouso, hover e movimento reduzido — este
 *    último pelas duas vias (a `@media` do sistema, via emulação do Playwright, e
 *    o `html[data-motion="reduce"]` do diálogo da própria página). A matriz
 *    computada é lida como matriz, não como a string que o CSS declara.
 *  - O PARALLAX, conferido por conta e não por olho: de quanto a arte cresce e
 *    escorre no hover, e quanta folga sobra até a borda do recorte.
 *  - A MÍDIA: `alt` vazio, `loading`, `sizes`, medidas naturais e a caixa.
 *  - AS DUAS EMENDAS, com a capa em cima e com `#university-unidep` embaixo:
 *    distância entre as caixas e leitura de cor pixel a pixel numa coluna que
 *    atravessa a junta, para provar que não nasceu faixa nem listra.
 *  - VERBATIM da escrita: rótulo, título (as duas partes somadas) e parágrafo
 *    comparados caractere a caractere com `ESPERADO` — inclusive a frase sem
 *    verbo principal, que a issue manda não corrigir.
 *  - A REFERÊNCIA, lida do próprio PNG: cor do fundo em sete pontos, tinta de
 *    cada bloco de texto pela moda das cores da faixa, geometria do quadro
 *    (silhueta por linha e por coluna) e a inclinação do topo por ajuste de
 *    reta. É de onde saem os números citados no comentário do `globals.css`, e
 *    ela roda sem navegador — `SO_REFERENCIA=1` mede só isso.
 *
 * Ferramenta de bancada; nada disso entra no bundle.
 *   node scripts/medir-programa-university-sis280.mjs
 *   BASE_URL=http://localhost:3792 LARGURAS=1440 node scripts/…
 *
 * O padrão é a porta 3000 porque o `next dev` do Next 16 recusa um segundo
 * servidor no mesmo diretório: quando já houver um de pé, a sonda usa o que está
 * lá em vez de derrubá-lo.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
/* As quatro janelas da issue, largura×altura — e a altura importa aqui: a seção
   é mais alta que a janela a 390, e a emenda de baixo só entra no quadro nas
   larguras grandes. */
const JANELAS = (process.env.JANELAS ?? '390x844,768x1024,1024x768,1440x900')
  .split(',')
  .map((j) => {
    const [w, h] = j.split('x').map(Number);
    return { w, h };
  });
const DESTINO = 'docs/capturas/sis280-programa';
/* O número medido é gravado pelo próprio script, e não por redirecionamento de
   terminal: no PowerShell o `>` grava UTF-16 com BOM e o JSON sai ilegível para
   quem for reler depois. */
const MEDIDAS = 'docs/medidas/programa-university-sis280';
const CORPO = 0.85;
const ROTA = '/sistran-university';

/* O texto publicado, palavra por palavra (`src/app/sistran-university/page.tsx`,
   travado em `copy-lock.json`). `titulo` é a soma das duas partes: a issue
   permite PARTIR a frase em texto normal + realce, e proíbe mudar caractere. A
   terceira string é a frase sem verbo principal, reproduzida como está porque o
   teste é de identidade, não de gramática. */
const ESPERADO = {
  rotulo: 'O PROGRAMA',
  titulo: 'Formar especialistas em tecnologia de ponta',
  realce: 'tecnologia de ponta',
  paragrafo:
    'O Sistran University, programa de capacitação intensiva da Sistran, dedicado a formar especialistas em tecnologia de ponta e desenvolvimento de sistemas.',
};

const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const compor = (fg, a, bg) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));

/* Rola a seção para um lugar DETERMINÍSTICO da janela: a medição compara duas
   abas pixel a pixel, e 1px de diferença de rolagem invalida a subtração. */
const ANCORAR = () => {
  const secao = document.querySelector('#university-programa');
  if (!secao) return -1;
  const y = secao.getBoundingClientRect().top + window.scrollY - 40;
  window.scrollTo({ top: Math.round(y), behavior: 'instant' });
  return Math.round(y);
};

const LEVANTAR = () => {
  const secao = document.querySelector('#university-programa');
  const grade = secao?.querySelector('.university-programa-grade');
  const escrita = secao?.querySelector('.university-programa-escrita');
  const palco = secao?.querySelector('.university-programa-palco');
  const quadro = secao?.querySelector('.university-programa-quadro');
  const rotulo = secao?.querySelector('.eyebrow');
  const h2 = secao?.querySelector('h2');
  const realce = secao?.querySelector('.university-programa-realce');
  const paragrafo = secao?.querySelector('p');
  const forte = paragrafo?.querySelector('strong');
  const foto = secao?.querySelector('img');
  const acentos = secao?.querySelector('.university-programa-acentos');
  const capa = document.querySelector('.hero-backdrop--university');
  const unidep = document.querySelector('#university-unidep');

  const caixa = (e) => {
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return {
      x: Math.round(r.left),
      y: Math.round(r.top),
      w: Math.round(r.width),
      h: Math.round(r.height),
      direita: Math.round(r.right),
      topoDoc: Math.round(r.top + window.scrollY),
      peDoc: Math.round(r.bottom + window.scrollY),
    };
  };

  const medir = (e, rotuloDoAlvo) => {
    if (!e) return null;
    const c = getComputedStyle(e);
    const range = document.createRange();
    range.selectNodeContents(e);
    const pedacos = [...range.getClientRects()].filter((b) => b.width > 1 && b.height > 1);
    // `getClientRects` corta um retângulo por FRAGMENTO inline, não por linha: no h2,
    // a linha que tem texto normal e o <span> do realce devolve dois. Agrupar por
    // topo (tolerância de 2px) é o que dá a contagem de linhas que se vê na tela.
    const porTopo = new Map();
    for (const b of pedacos) {
      const chave = [...porTopo.keys()].find((t) => Math.abs(t - b.top) < 2) ?? b.top;
      const atual = porTopo.get(chave);
      porTopo.set(
        chave,
        atual
          ? { esquerda: Math.min(atual.esquerda, b.left), direita: Math.max(atual.direita, b.right) }
          : { esquerda: b.left, direita: b.right },
      );
    }
    const linhas = [...porTopo.values()].map((l) => l.direita - l.esquerda);
    return {
      rotulo: rotuloDoAlvo,
      texto: (e.textContent ?? '').replace(/\s+/g, ' ').trim(),
      px: Math.round(parseFloat(c.fontSize) * 100) / 100,
      peso: c.fontWeight,
      cor: c.color,
      caixaDeTexto: caixa(e),
      linhas: linhas.length,
      linhaMaisLarga: Math.round(Math.max(0, ...linhas)),
      sombra: c.textShadow,
    };
  };

  let fotoInfo = null;
  if (foto) {
    const r = foto.getBoundingClientRect();
    const c = getComputedStyle(foto);
    fotoInfo = {
      src: foto.currentSrc || foto.getAttribute('src'),
      alt: foto.getAttribute('alt'),
      altVazio: foto.getAttribute('alt') === '',
      loading: foto.getAttribute('loading'),
      fetchpriority: foto.getAttribute('fetchpriority'),
      decoding: foto.getAttribute('decoding'),
      /* `sizes` e `srcset` saem do DOM porque `images.unoptimized` os descarta —
         ver `docs/images-unoptimized.md`. Aqui a leitura é do ATRIBUTO. */
      sizes: foto.getAttribute('sizes'),
      srcset: foto.getAttribute('srcset'),
      width: foto.getAttribute('width'),
      height: foto.getAttribute('height'),
      natural: { w: foto.naturalWidth, h: foto.naturalHeight },
      /* Sem `fill` não há `object-fit`/`object-position` a calibrar: a arte entra
         inteira, e é a proporção declarada que reserva a caixa. */
      objectFit: c.objectFit,
      razaoDaCaixa: Math.round((r.width / r.height) * 1000) / 1000,
      razaoDoArquivo: foto.naturalHeight
        ? Math.round((foto.naturalWidth / foto.naturalHeight) * 1000) / 1000
        : null,
      caixa: caixa(foto),
      transform: c.transform,
      transition: c.transitionProperty + ' ' + c.transitionDuration,
    };
  }

  const container = secao?.querySelector('.container-lp');
  const colunas = grade
    ? [...grade.children].map((f) => ({
        classe: f.className,
        ...caixa(f),
      }))
    : null;

  return {
    janela: { w: window.innerWidth, h: window.innerHeight },
    overflow: {
      scrollWidthDoDoc: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      /* Positivo = vazou. */
      excesso: document.documentElement.scrollWidth - window.innerWidth,
    },
    secao: {
      caixa: caixa(secao),
      classes: secao?.className ?? null,
      position: secao ? getComputedStyle(secao).position : null,
      isolation: secao ? getComputedStyle(secao).isolation : null,
      overflowX: secao ? getComputedStyle(secao).overflowX : null,
      fundo: secao ? getComputedStyle(secao).backgroundImage.slice(0, 220) : null,
      sombraDeSangria: secao ? getComputedStyle(secao).boxShadow : null,
      paddingTopo: secao ? getComputedStyle(secao).paddingTop : null,
      paddingPe: secao ? getComputedStyle(secao).paddingBottom : null,
    },
    grade: grade
      ? {
          display: getComputedStyle(grade).display,
          templateColunas: getComputedStyle(grade).gridTemplateColumns,
          vao: getComputedStyle(grade).columnGap,
          alinhamento: getComputedStyle(grade).alignItems,
          caixa: caixa(grade),
          colunas,
          /* Empilhado = as duas colunas começam no mesmo x. */
          empilhado: colunas && colunas.length === 2 ? colunas[0].x === colunas[1].x : null,
          fracoes:
            colunas && colunas.length === 2 && caixa(grade).w
              ? colunas.map((c) => Math.round((c.w / caixa(grade).w) * 1000) / 10)
              : null,
        }
      : null,
    escrita: escrita ? { caixa: caixa(escrita), maxWidth: getComputedStyle(escrita).maxWidth } : null,
    container: container ? caixa(container) : null,
    palco: palco
      ? {
          caixa: caixa(palco),
          perspective: getComputedStyle(palco).perspective,
          transformStyle: getComputedStyle(palco).transformStyle,
        }
      : null,
    quadro: quadro
      ? {
          caixa: caixa(quadro),
          transform: getComputedStyle(quadro).transform,
          transition: `${getComputedStyle(quadro).transitionProperty} ${getComputedStyle(quadro).transitionDuration}`,
          borda: getComputedStyle(quadro).border,
          raio: getComputedStyle(quadro).borderRadius,
          sombra: getComputedStyle(quadro).boxShadow,
          filtro: getComputedStyle(quadro).filter,
          overflow: getComputedStyle(quadro).overflow,
          /* A folga que sobra entre a borda direita do quadro e a da janela. */
          folgaAteAJanela: window.innerWidth - caixa(quadro).direita,
          /* Foco: um quadro decorativo não pode capturar tabulação. */
          tabindex: quadro.getAttribute('tabindex'),
          role: quadro.getAttribute('role'),
          focavel: quadro.matches(
            'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])',
          ),
        }
      : null,
    acentos: acentos
      ? {
          display: getComputedStyle(acentos).display,
          ariaHidden: acentos.getAttribute('aria-hidden'),
          pointerEvents: getComputedStyle(acentos).pointerEvents,
          zIndex: getComputedStyle(acentos).zIndex,
        }
      : null,
    /* Quantos nós da seção podem receber foco: o esperado é ZERO (a seção não tem
       link nem botão), e é isso que prova que o quadro não finge ser botão. */
    focaveis: secao
      ? [
          ...secao.querySelectorAll(
            'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])',
          ),
        ].length
      : null,
    foto: fotoInfo,
    rotulo: medir(rotulo, 'rotulo'),
    h2: medir(h2, 'h2'),
    realce: medir(realce, 'realce'),
    paragrafo: medir(paragrafo, 'paragrafo'),
    forte: medir(forte, 'forte'),
    emendas: {
      capa: capa
        ? {
            peDaCapa: caixa(capa).peDoc,
            topoDaSecao: caixa(secao).topoDoc,
            folga: caixa(secao).topoDoc - caixa(capa).peDoc,
          }
        : null,
      unidep: unidep
        ? {
            peDaSecao: caixa(secao).peDoc,
            topoDoUnidep: caixa(unidep).topoDoc,
            folga: caixa(unidep).topoDoc - caixa(secao).peDoc,
          }
        : null,
    },
    junta: {
      /* Em coordenada de JANELA, para recortar a captura e ler os pixels. */
      topo: secao ? Math.round(secao.getBoundingClientRect().top) : null,
      pe: secao ? Math.round(secao.getBoundingClientRect().bottom) : null,
    },
  };
};

/* Lê a matriz do `transform` como NÚMERO, e não como a string declarada: é o que
   permite comparar repouso e hover e dizer de quanto o quadro se mexeu. */
const TRANSFORMS = () => {
  const ler = (sel) => {
    const e = document.querySelector(sel);
    if (!e) return null;
    const c = getComputedStyle(e);
    return {
      transform: c.transform,
      transition: c.transitionDuration,
      boxShadow: c.boxShadow,
      filter: c.filter,
    };
  };
  return {
    quadro: ler('.university-programa-quadro'),
    arte: ler('.university-programa-arte'),
  };
};

/* Apaga a tinta da SEÇÃO inteira: um glifo vizinho que sobrevivesse entraria no
   recorte como se fosse fundo. */
const APAGAR = () => {
  const raiz = document.querySelector('#university-programa');
  if (!raiz) return -1;
  for (const f of [raiz, ...raiz.querySelectorAll('*')]) {
    const a = getComputedStyle(f);
    if (a.webkitBackgroundClip === 'text' || a.backgroundClip === 'text')
      f.style.setProperty('background-image', 'none', 'important');
    f.style.setProperty('color', 'transparent', 'important');
    f.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
    f.style.setProperty('fill', 'transparent', 'important');
    f.style.setProperty('text-shadow', 'none', 'important');
  }
  return [...raiz.querySelectorAll('*')].filter((f) => {
    const a = getComputedStyle(f);
    return (a.webkitTextFillColor || a.color).replace(/\s/g, '') !== 'rgba(0,0,0,0)';
  }).length;
};

const CAIXAS = (seletor) => {
  const secao = document.querySelector('#university-programa');
  const alvos = {
    rotulo: secao?.querySelector('.eyebrow'),
    /* O `h2` sem o realce: o realce tem tinta própria e é medido à parte, senão a
       caixa do pior pixel misturaria as duas cores. */
    titulo: secao?.querySelector('h2'),
    realce: secao?.querySelector('.university-programa-realce'),
    paragrafo: secao?.querySelector('p'),
    forte: secao?.querySelector('p strong'),
  };
  const e = alvos[seletor];
  if (!e) return null;
  const c = getComputedStyle(e);
  const n = (c.webkitTextFillColor || c.color).match(/-?[\d.]+/g).map(Number);
  let alfa = n.length > 3 ? n[3] : 1;
  for (let p = e; p; p = p.parentElement) {
    const o = Number(getComputedStyle(p).opacity);
    if (!Number.isNaN(o)) alfa *= o;
  }
  /* Para o título, as caixas do realce são SUBTRAÍDAS: o `h2` inteiro inclui o
     trecho azul, e o pior pixel dele seria atribuído à tinta navy. */
  const excluir =
    seletor === 'titulo' && alvos.realce
      ? (() => {
          const r = document.createRange();
          r.selectNodeContents(alvos.realce);
          return [...r.getClientRects()].filter((b) => b.width > 1 && b.height > 1);
        })()
      : [];
  const dentro = (b) =>
    excluir.some(
      (x) => b.left >= x.left - 1 && b.right <= x.right + 1 && b.top >= x.top - 1 && b.bottom <= x.bottom + 1,
    );
  const r = document.createRange();
  r.selectNodeContents(e);
  return {
    tinta: n.slice(0, 3),
    alfa: Math.round(alfa * 1000) / 1000,
    px: Math.round(parseFloat(c.fontSize) * 100) / 100,
    peso: c.fontWeight,
    caixas: [...r.getClientRects()]
      .filter((b) => b.width > 1 && b.height > 1 && b.bottom > 0 && b.top < window.innerHeight)
      .filter((b) => !dentro(b))
      .map((b) => ({
        x: Math.floor(b.left),
        y: Math.floor(b.top),
        w: Math.ceil(b.width) + 1,
        h: Math.ceil(b.height) + 1,
      })),
  };
};

/* Duas capturas consecutivas iguais = quadro parado. */
const estabilizar = async (pagina, tentativas = 14) => {
  const { width, height } = pagina.viewportSize();
  const recorte = { x: 0, y: 0, width: Math.min(900, width), height };
  let anterior = null;
  for (let i = 0; i < tentativas; i += 1) {
    const agora = await pagina.screenshot({ clip: recorte });
    if (anterior && anterior.equals(agora)) return true;
    anterior = agora;
    await new Promise((res) => setTimeout(res, 350));
  }
  return false;
};

const abrir = async (navegador, { w, h }, apagar, opcoes = {}) => {
  const pagina = await navegador.newPage({
    viewport: { width: w, height: h },
    reducedMotion: opcoes.reduce ? 'reduce' : 'no-preference',
  });
  await pagina.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  await pagina.goto(`${BASE}${ROTA}`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('#university-programa h2', { timeout: 180_000 });
  await pagina.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[class*=motion-banner],[class*=motion-dialog]{display:none!important}',
  });
  if (opcoes.atributoReduce) {
    await pagina.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
  }
  await pagina.waitForTimeout(1500);
  const ancora = await pagina.evaluate(ANCORAR);
  await pagina.waitForTimeout(800);
  /* Esperar TODAS as imagens da rota: a subtração A−B compara duas abas, e um par
     em que só uma decodificou a arte mede o fundo de uma página que não é a
     medida (armadilha registrada na sonda da SIS-233). */
  await pagina
    .waitForFunction(
      () => [...document.images].every((i) => i.complete && (i.naturalWidth > 0 || !i.src)),
      { timeout: 60_000 },
    )
    .catch(() => undefined);
  await estabilizar(pagina);
  const teimosos = apagar ? await pagina.evaluate(APAGAR) : 0;
  return { pagina, teimosos, ancora };
};

/* Lê uma coluna de pixels atravessando uma junta — é assim que se prova que não
   há faixa: a cor tem de andar em passos pequenos. */
const coluna = (raster, x, y0, y1) => {
  const saida = [];
  for (let y = Math.max(0, y0); y < Math.min(y1, raster.info.height); y += 4) {
    const k = (y * raster.info.width + x) * raster.info.channels;
    saida.push({ y, cor: [raster.data[k], raster.data[k + 1], raster.data[k + 2]] });
  }
  return saida;
};

/* ─────────────────────────────────────────────────────────────────────────────
   A REFERÊNCIA. Lida do arquivo, sem navegador: é o lado "alvo" da comparação,
   e ter o número dela gravado é o que permite conferir a composição sem abrir o
   PNG no olho de ninguém. */
const REFERENCIA = 'public/imagensexemplo/exemploprograma.png';

const hex = ([R, G, B]) => `#${[R, G, B].map((c) => c.toString(16).padStart(2, '0')).join('')}`;

async function medirReferencia() {
  const meta = await sharp(REFERENCIA).metadata();
  const r = await sharp(REFERENCIA).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = r.info.width;
  const H = r.info.height;
  const px = (x, y) => {
    const k = (y * W + x) * r.info.channels;
    return [r.data[k], r.data[k + 1], r.data[k + 2]];
  };
  /* Tudo em FRAÇÃO da caixa: a referência tem 1672×941 (a mesma caixa da arte),
     e fração é o que se compara com a seção renderizada em qualquer largura. */
  const pf = (fx, fy) => px(Math.round(fx * W), Math.round(fy * H));

  const fundo = {};
  for (const [fx, fy] of [
    [0.02, 0.03],
    [0.02, 0.5],
    [0.02, 0.95],
    [0.2, 0.03],
    [0.2, 0.96],
    [0.38, 0.95],
    [0.33, 0.06],
  ]) {
    fundo[`${fx}/${fy}`] = { rgb: pf(fx, fy), hex: hex(pf(fx, fy)) };
  }

  /* A tinta chapada de um glifo antialiasado é a MODA das cores da faixa, e não
     o pixel mais escuro: o mais escuro de um trecho azul pode ser a franja sobre
     a letra navy vizinha. */
  const moda = (x0, x1, y0, y1, filtro) => {
    const conta = new Map();
    for (let y = Math.round(y0 * H); y < Math.round(y1 * H); y += 1) {
      for (let x = Math.round(x0 * W); x < Math.round(x1 * W); x += 1) {
        const c = px(x, y);
        if (!filtro(c)) continue;
        const k = c.join(',');
        conta.set(k, (conta.get(k) ?? 0) + 1);
      }
    }
    const top = [...conta.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    return top.map(([k, n]) => ({ rgb: k.split(',').map(Number), hex: hex(k.split(',').map(Number)), pixels: n }));
  };
  const azul = (c) => c[2] > 150 && c[2] - c[0] > 80 && c[1] > 80 && c[1] < 210;
  const escuro = (c) => c[0] + c[1] + c[2] < 200;

  const tintas = {
    rotulo: moda(0.095, 0.2, 0.338, 0.355, azul),
    tracoDoRotulo: moda(0.065, 0.09, 0.34, 0.352, (c) => c[2] > 200 && c[2] - c[0] > 60),
    tituloNavy: moda(0.05, 0.35, 0.39, 0.45, escuro),
    tituloRealce: moda(0.145, 0.37, 0.455, 0.495, azul),
    paragrafo: moda(0.05, 0.35, 0.545, 0.575, (c) => c[0] + c[1] + c[2] < 330),
    bordaDoQuadro: moda(0.35, 0.42, 0.25, 0.8, (c) => c[2] > 215 && c[1] > 180 && c[2] - c[0] > 90),
    quadradoPalido: [{ rgb: pf(0.175, 0.8), hex: hex(pf(0.175, 0.8)) }],
    quadradoCiano: [{ rgb: pf(0.888, 0.845), hex: hex(pf(0.888, 0.845)) }],
  };

  /* A SILHUETA do quadro: primeiro pixel, varrendo da coluna de texto para a
     direita, que deixa de ser o fundo chapado. Dá a borda com o halo dentro —
     que é o bastante para a inclinação, porque o halo acompanha a borda. */
  const FUNDO = [243, 249, 254];
  const dif = (c) => Math.abs(c[0] - FUNDO[0]) + Math.abs(c[1] - FUNDO[1]) + Math.abs(c[2] - FUNDO[2]);
  const esquerda = [];
  for (let fy = 0.2; fy <= 0.85; fy += 0.05) {
    const y = Math.round(fy * H);
    for (let x = Math.round(0.33 * W); x < Math.round(0.62 * W); x += 1) {
      if (dif(px(x, y)) > 26) {
        esquerda.push({ fy: Math.round(fy * 1000) / 1000, fx: Math.round((x / W) * 10000) / 10000 });
        break;
      }
    }
  }
  const topo = [];
  const pe = [];
  for (let fx = 0.44; fx <= 0.99; fx += 0.06) {
    const x = Math.round(fx * W);
    for (let y = Math.round(0.04 * H); y < Math.round(0.5 * H); y += 1) {
      if (dif(px(x, y)) > 26) {
        topo.push({ fx: Math.round(fx * 1000) / 1000, x, y });
        break;
      }
    }
    for (let y = H - 2; y > Math.round(0.5 * H); y -= 1) {
      if (dif(px(x, y)) > 26) {
        pe.push({ fx: Math.round(fx * 1000) / 1000, x, y });
        break;
      }
    }
  }
  const reta = (pares) => {
    const n = pares.length;
    if (n < 2) return null;
    const sx = pares.reduce((a, p) => a + p.x, 0);
    const sy = pares.reduce((a, p) => a + p.y, 0);
    const sxy = pares.reduce((a, p) => a + p.x * p.y, 0);
    const sxx = pares.reduce((a, p) => a + p.x * p.x, 0);
    const m = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    return { inclinacao: Math.round(m * 10000) / 10000, graus: Math.round(((Math.atan(m) * 180) / Math.PI) * 100) / 100 };
  };

  const arte = await sharp('public/images/university/university-programa.webp').metadata();
  return {
    arquivo: REFERENCIA,
    caixa: { w: meta.width, h: meta.height, razao: Math.round((meta.width / meta.height) * 1000) / 1000 },
    arte: {
      arquivo: 'public/images/university/university-programa.webp',
      w: arte.width,
      h: arte.height,
      razao: Math.round((arte.width / arte.height) * 1000) / 1000,
    },
    fundo,
    tintas,
    quadro: {
      bordaEsquerda: esquerda,
      /* A moda da borda esquerda, em fração: é a coluna em que o quadro começa. */
      comecaEmX: esquerda.length
        ? esquerda.map((p) => p.fx).sort((a, b) => a - b)[Math.floor(esquerda.length / 2)]
        : null,
      topo,
      pe,
      inclinacaoDoTopo: reta(topo),
      inclinacaoDoPe: reta(pe),
    },
  };
}

await mkdir(DESTINO, { recursive: true });
await mkdir(MEDIDAS, { recursive: true });

const referencia = await medirReferencia();
await writeFile(`${MEDIDAS}/referencia.json`, `${JSON.stringify(referencia, null, 2)}\n`, 'utf8');
console.log(
  `referência ${referencia.caixa.w}×${referencia.caixa.h} · fundo ${referencia.fundo['0.02/0.5'].hex}` +
    ` · realce do título ${referencia.tintas.tituloRealce[0]?.hex}` +
    ` · rótulo ${referencia.tintas.rotulo[0]?.hex}` +
    ` · traço ${referencia.tintas.tracoDoRotulo[0]?.hex}` +
    ` · quadro começa em x ${referencia.quadro.comecaEmX}` +
    ` · topo ${referencia.quadro.inclinacaoDoTopo?.graus}° / pé ${referencia.quadro.inclinacaoDoPe?.graus}°`,
);
if (process.env.SO_REFERENCIA) {
  console.log(`\nleitura da referência: ${MEDIDAS}/referencia.json`);
  process.exit(0);
}

const navegador = await chromium.launch();
const saida = {};

for (const janela of JANELAS) {
  const rot = `${janela.w}x${janela.h}`;
  const comTinta = await abrir(navegador, janela, false);
  const medido = await comTinta.pagina.evaluate(LEVANTAR);
  medido['#verbatim'] = {
    rotulo: medido.rotulo?.texto === ESPERADO.rotulo,
    titulo: medido.h2?.texto === ESPERADO.titulo,
    realce: medido.realce?.texto === ESPERADO.realce,
    paragrafo: medido.paragrafo?.texto === ESPERADO.paragrafo,
  };
  medido['#ancora'] = comTinta.ancora;

  /* ── TRANSFORM em repouso, em hover e nas duas vias de movimento reduzido ── */
  const repouso = await comTinta.pagina.evaluate(TRANSFORMS);
  await comTinta.pagina.hover('.university-programa-palco');
  await comTinta.pagina.waitForTimeout(1000);
  const hover = await comTinta.pagina.evaluate(TRANSFORMS);
  await comTinta.pagina.screenshot({ path: `${DESTINO}/hover-${rot}.png` });
  /* Sai de cima do quadro para as capturas de repouso não pegarem o estado. */
  await comTinta.pagina.mouse.move(2, 2);
  await comTinta.pagina.waitForTimeout(1000);
  medido['#transform'] = { repouso, hover };

  await comTinta.pagina.screenshot({ path: `${DESTINO}/repouso-${rot}.png` });
  /* A seção inteira, do topo ao pé, mesmo que passe da janela. */
  await comTinta.pagina.screenshot({
    path: `${DESTINO}/secao-${rot}.png`,
    clip: {
      x: 0,
      y: Math.max(0, medido.junta.topo),
      width: janela.w,
      height: Math.min(
        medido.junta.pe - medido.junta.topo,
        janela.h - Math.max(0, medido.junta.topo),
      ),
    },
    fullPage: false,
  });

  /* ── CONTRASTE: A (com tinta) menos B (tinta apagada) ── */
  const semTinta = await abrir(navegador, janela, true);
  const contraste = {
    '#tintaTeimosa': semTinta.teimosos,
    '#ancoraIgual': semTinta.ancora === comTinta.ancora,
  };
  const [a, b] = await Promise.all([comTinta.pagina.screenshot(), semTinta.pagina.screenshot()]);
  const [A, B] = await Promise.all(
    [a, b].map((buf) => sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })),
  );

  for (const alvo of ['rotulo', 'titulo', 'realce', 'paragrafo', 'forte']) {
    const m = await comTinta.pagina.evaluate(CAIXAS, alvo);
    if (!m || !m.caixas.length) {
      contraste[alvo] = null;
      continue;
    }
    let piorTudo = null;
    let piorCorpo = null;
    let pixels = 0;
    let pixelsCorpo = 0;
    for (const { x, y, w, h } of m.caixas) {
      const x1 = Math.min(x + w, A.info.width);
      const y1 = Math.min(y + h, A.info.height);
      for (let py = Math.max(0, y); py < y1; py += 1) {
        for (let px = Math.max(0, x); px < x1; px += 1) {
          const k = (py * A.info.width + px) * A.info.channels;
          const comA = [A.data[k], A.data[k + 1], A.data[k + 2]];
          const bg = [B.data[k], B.data[k + 1], B.data[k + 2]];
          const mudou =
            Math.abs(comA[0] - bg[0]) + Math.abs(comA[1] - bg[1]) + Math.abs(comA[2] - bg[2]);
          if (mudou < 12) continue;
          const cheio =
            Math.abs(m.tinta[0] - bg[0]) +
            Math.abs(m.tinta[1] - bg[1]) +
            Math.abs(m.tinta[2] - bg[2]);
          const cobertura = cheio > 0 ? Math.min(1, mudou / cheio) : 1;
          const r = razao(compor(m.tinta, m.alfa, bg), bg);
          const cand = {
            razao: Math.round(r * 100) / 100,
            fundo: bg,
            cobertura: Math.round(cobertura * 100) / 100,
            em: { x: px, y: py },
          };
          pixels += 1;
          if (piorTudo === null || r < piorTudo.razao) piorTudo = cand;
          if (cobertura >= CORPO) {
            pixelsCorpo += 1;
            if (piorCorpo === null || r < piorCorpo.razao) piorCorpo = cand;
          }
        }
      }
    }
    const grande = m.px >= 24 || (m.px >= 18.66 && Number(m.peso) >= 700);
    const piso = grande ? 3 : 4.5;
    contraste[alvo] = {
      px: m.px,
      peso: m.peso,
      tinta: m.tinta,
      alfa: m.alfa,
      caixas: m.caixas.length,
      piso,
      razao: piorCorpo?.razao ?? null,
      rasterPior: piorTudo?.razao ?? null,
      piorCorpo,
      pixels,
      pixelsCorpo,
      passa: piorCorpo ? piorCorpo.razao >= piso : false,
    };
  }
  medido['#contraste'] = contraste;

  /* As duas juntas, lidas na aba SEM TINTA (a coluna passa longe do texto, mas
     ler o fundo puro evita qualquer chance de pegar glifo). */
  const x = Math.round(janela.w * 0.03);
  medido['#juntaTopo'] = coluna(B, x, medido.junta.topo - 28, medido.junta.topo + 28);
  medido['#juntaPe'] =
    medido.junta.pe < janela.h
      ? coluna(B, x, medido.junta.pe - 28, medido.junta.pe + 28)
      : 'fora da janela';

  await comTinta.pagina.close();
  await semTinta.pagina.close();

  /* ── MOVIMENTO REDUZIDO, pelas duas vias ── */
  const viaSistema = await abrir(navegador, janela, false, { reduce: true });
  medido['#reduceSistema'] = await viaSistema.pagina.evaluate(TRANSFORMS);
  await viaSistema.pagina.hover('.university-programa-palco');
  await viaSistema.pagina.waitForTimeout(700);
  medido['#reduceSistemaComHover'] = await viaSistema.pagina.evaluate(TRANSFORMS);
  await viaSistema.pagina.screenshot({ path: `${DESTINO}/reduce-sistema-${rot}.png` });
  await viaSistema.pagina.close();

  const viaAtributo = await abrir(navegador, janela, false, { atributoReduce: true });
  medido['#reduceAtributo'] = await viaAtributo.pagina.evaluate(TRANSFORMS);
  await viaAtributo.pagina.hover('.university-programa-palco');
  await viaAtributo.pagina.waitForTimeout(700);
  medido['#reduceAtributoComHover'] = await viaAtributo.pagina.evaluate(TRANSFORMS);
  await viaAtributo.pagina.close();

  saida[rot] = medido;
}

await navegador.close();

const arquivo = `${MEDIDAS}/medicao.json`;
await writeFile(arquivo, `${JSON.stringify(saida, null, 2)}\n`, 'utf8');

/* No terminal fica só o veredito; o número inteiro está no arquivo. */
for (const rot of Object.keys(saida)) {
  const m = saida[rot];
  const c = m['#contraste'];
  console.log(`\n── ${rot} ──`);
  console.log(
    ['rotulo', 'titulo', 'realce', 'paragrafo', 'forte']
      .map((k) =>
        c[k] ? `${k} ${c[k].razao}:1 (piso ${c[k].piso}, ${c[k].passa ? 'passa' : 'REPROVA'})` : `${k} —`,
      )
      .join(' · '),
  );
  console.log(
    `colunas ${m.grade?.templateColunas ?? '—'} · frações ${m.grade?.fracoes?.join('/') ?? '—'}` +
      ` · empilhado ${m.grade?.empilhado}`,
  );
  console.log(
    `overflow ${m.overflow.excesso}px · quadro até x=${m.quadro?.caixa.direita} (folga ${m.quadro?.folgaAteAJanela}px)` +
      ` · focáveis na seção ${m.focaveis}`,
  );
  console.log(`repouso  ${m['#transform'].repouso.quadro?.transform}`);
  console.log(`hover    ${m['#transform'].hover.quadro?.transform}`);
  console.log(`arte rep ${m['#transform'].repouso.arte?.transform} · hover ${m['#transform'].hover.arte?.transform}`);
  console.log(
    `reduce sistema ${m['#reduceSistemaComHover'].quadro?.transform} / arte ${m['#reduceSistemaComHover'].arte?.transform}`,
  );
  console.log(
    `reduce atributo ${m['#reduceAtributoComHover'].quadro?.transform} / arte ${m['#reduceAtributoComHover'].arte?.transform}`,
  );
  console.log(
    `verbatim rótulo=${m['#verbatim'].rotulo} título=${m['#verbatim'].titulo} realce=${m['#verbatim'].realce} parágrafo=${m['#verbatim'].paragrafo}`,
  );
  console.log(
    `emendas capa=${m.emendas.capa?.folga}px · unidep=${m.emendas.unidep?.folga}px · alt vazio=${m.foto?.altVazio} · loading=${m.foto?.loading}`,
  );
}
console.log(`\nmedição completa: ${arquivo}`);
