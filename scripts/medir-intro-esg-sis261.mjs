/**
 * SIS-261 — a seção intro de `/esg` (`#esg-introducao`).
 *
 * Os cinco itens da issue são afirmações verificáveis, e duas delas NÃO se conferem
 * de olho, que é a razão desta sonda existir:
 *
 *   · «arte sem caixa opaca atrás» / «sem placa branca». Uma captura solta não
 *     distingue "PNG com fundo branco sobre faixa clara" de "PNG transparente sobre
 *     faixa clara" — os dois parecem claros. A prova é por DIFERENÇA: fotografa-se a
 *     seção com a arte e outra vez com ela escondida (`visibility: hidden`, que não
 *     mexe no layout), e nos cantos da caixa da imagem — que o alfa derivado deixou
 *     vagos — os pixels têm de ser IDÊNTICOS. Idênticos significa que ali não há
 *     tinta nenhuma da imagem: o que se vê é a faixa e a malha atravessando. No
 *     centro da arte, ao contrário, têm de DIFERIR (senão a imagem não carregou e o
 *     teste dos cantos passaria vazio).
 *     De quebra isto mata o xadrez: se o `src` fosse `esg2.png`, os cantos seriam o
 *     tabuleiro cinza opaco e difeririam da faixa.
 *
 *   · «grade fina» e «uma grade só». A linha da malha é 8% de alfa vezes 32% de
 *     opacidade, ~2,5% de tinta — invisível numa comparação a olho. Mede-se o
 *     PERÍODO em pixels por diferença contra o `::before` desligado, e confere-se
 *     contra `--grade-fina-modulo` lido da própria página, não contra um 64 digitado
 *     aqui. É o teste que pega o defeito do `background-size: 6rem` herdado
 *     recortando o padrão. Mesmo método da SIS-260, onde ele está justificado
 *     em detalhe — ver `scripts/medir-grade-sis260.mjs`.
 *
 * Contraste pelo método da casa (`docs/medidas/COMO-MEDIR-CONTRASTE.md`): esconde-se
 * a tinta, compõe-se o alfa declarado sobre CADA pixel de fundo e vale o pior. O
 * número calculado é o veredito; o raster vai junto porque subestima texto pequeno
 * (franja de antisserrilhado) — e o eyebrow aqui é de 12px.
 *
 * Rodar com o dev de pé:  node scripts/medir-intro-esg-sis261.mjs
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const VIEWPORTS = [
  { w: 1440, h: 900 },
  { w: 390, h: 844 },
];
const SECAO = '#esg-introducao';
const ARTE = '#esg-introducao img';
const COPY = '[data-esg-intro-copy]';
const EYEBROW = '#esg-introducao .eyebrow';
const SEM_MALHA = `${SECAO}.section-light::before{display:none!important}`;
const SEM_ARTE = `${ARTE}{visibility:hidden!important}`;
const LIMPEZA = `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
  header.fixed{display:none!important}`;

const luminancia = ({ r, g, b }) => {
  const c = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const razao = (a, b) => {
  const [x, y] = [luminancia(a) + 0.05, luminancia(b) + 0.05].sort((p, q) => q - p);
  return x / y;
};
const compor = (tinta, fundo) => ({
  r: tinta.r * tinta.a + fundo.r * (1 - tinta.a),
  g: tinta.g * tinta.a + fundo.g * (1 - tinta.a),
  b: tinta.b * tinta.a + fundo.b * (1 - tinta.a),
});
const lerTinta = (css) => {
  const n = css.match(/[\d.]+/g).map(Number);
  return { r: n[0], g: n[1], b: n[2], a: n[3] ?? 1 };
};

/* Duas armadilhas medidas nas sondas anteriores desta rota: o véu do
   `RouteLoadGate` volta a cada carga e o Lenis continua deslizando depois de um
   `scrollIntoViewIfNeeded`. Ver `scripts/medir-grade-sis260.mjs`. */
async function liberarRota(page) {
  await page.waitForSelector(SECAO, { timeout: 180_000 });
  await page.waitForSelector('[data-route-liberado="true"]', { timeout: 180_000 });
  await page.waitForSelector('[data-route-loading]', { state: 'detached', timeout: 180_000 });
}
async function assentar(page, seletor) {
  await page.locator(seletor).scrollIntoViewIfNeeded();
  let anterior = null;
  for (let tentativa = 0; tentativa < 40; tentativa += 1) {
    const topo = await page.evaluate(async (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
      return Math.round(el.getBoundingClientRect().top);
    }, seletor);
    if (topo !== null && topo === anterior) return true;
    anterior = topo;
    await page.waitForTimeout(120);
  }
  return false;
}
const cru = async (buf) => {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, info };
};
const pixel = ({ data, info }, x, y) => {
  const i = (y * info.width + x) * info.channels;
  return { r: data[i], g: data[i + 1], b: data[i + 2] };
};

const navegador = await chromium.launch();
const relatorio = { issue: 'SIS-261', base: BASE, quando: new Date().toISOString(), viewports: {} };

for (const { w, h } of VIEWPORTS) {
  const ctx = await navegador.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', 'system');
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/esg`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await liberarRota(page);
  await page.addStyleTag({ content: LIMPEZA });
  await page.evaluate(() => document.fonts.ready);
  /* As fotos comparadas têm de sair do MESMO quadro geométrico, senão a diferença
     acusa deslocamento como se fosse tinta. */
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await assentar(page, SECAO);
  await page.waitForTimeout(900);
  await page.evaluate(
    (sel) => document.querySelectorAll(sel).forEach((i) => i.decode?.().catch(() => {})),
    ARTE,
  );
  await page.waitForTimeout(400);

  // ── Itens 1, 3 e 5: o que a página declara ────────────────────────────────
  const declarado = await page.evaluate(
    ({ secao, arte, copy, eyebrow }) => {
      const s = document.querySelector(secao);
      const img = document.querySelector(arte);
      const p = document.querySelector(copy);
      const eb = document.querySelector(eyebrow);
      const antes = getComputedStyle(s, '::before');
      const depois = getComputedStyle(s, '::after');
      const ebAntes = eb ? getComputedStyle(eb, '::before') : null;
      const raiz = getComputedStyle(document.documentElement);
      const eGrade = (t) =>
        /repeating-linear-gradient/.test(t) ||
        (/linear-gradient/.test(t) && !/radial-gradient/.test(t) && /1px/.test(t));
      const descendentesComGrade = [...s.querySelectorAll('*')].filter((el) => {
        const bi = getComputedStyle(el).backgroundImage;
        return bi !== 'none' && eGrade(bi);
      }).length;
      /* Item 5: `esg1` não pode sobrar em NENHUM lugar da rota — nem em `src`, nem
         em `srcset`, nem em `background-image` de qualquer elemento. */
      const esg1NoDom = [...document.querySelectorAll('*')].filter((el) => {
        const bi = getComputedStyle(el).backgroundImage;
        return (
          /esg1/.test(el.getAttribute('src') ?? '') ||
          /esg1/.test(el.getAttribute('srcset') ?? '') ||
          /esg1/.test(bi)
        );
      }).length;
      const rect = (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height, top: r.top, bottom: r.bottom };
      };
      return {
        arte: {
          src: img?.getAttribute('src') ?? null,
          currentSrc: img?.currentSrc ?? null,
          completo: img?.complete ?? null,
          naturalW: img?.naturalWidth ?? null,
          naturalH: img?.naturalHeight ?? null,
          alt: img?.getAttribute('alt') ?? null,
          /* «sem caixa opaca atrás» também tem lado declarado: nem a imagem nem
             nenhum ancestral dentro da seção pode pintar superfície. */
          background: img ? getComputedStyle(img).backgroundColor : null,
          boxShadow: img ? getComputedStyle(img).boxShadow : null,
          paiBackground: img ? getComputedStyle(img.parentElement).backgroundColor : null,
        },
        // Item 3: o `alt` não pode repetir o parágrafo.
        altRepeteParagrafo:
          img && p
            ? (() => {
                const norm = (t) => t.replace(/\s+/g, ' ').trim().toLowerCase();
                const a = norm(img.getAttribute('alt') ?? '');
                const b = norm(p.textContent ?? '');
                const palavras = b.split(' ');
                // qualquer trecho de 5 palavras do parágrafo aparecendo no alt
                return palavras.some(
                  (_, i) => i + 5 <= palavras.length && a.includes(palavras.slice(i, i + 5).join(' ')),
                );
              })()
            : null,
        eyebrow: eb
          ? {
              texto: eb.textContent.trim(),
              classe: eb.className,
              cor: getComputedStyle(eb).color,
              fontSize: getComputedStyle(eb).fontSize,
              letterSpacing: getComputedStyle(eb).letterSpacing,
              textTransform: getComputedStyle(eb).textTransform,
              traco: {
                width: ebAntes.width,
                height: ebAntes.height,
                backgroundImage: ebAntes.backgroundImage,
                animationName: ebAntes.animationName,
                boxShadow: ebAntes.boxShadow,
                temCiano: /14,\s*216,\s*246/.test(ebAntes.backgroundImage),
              },
            }
          : null,
        paragrafo: p
          ? {
              cor: getComputedStyle(p).color,
              fontSize: getComputedStyle(p).fontSize,
              fontWeight: getComputedStyle(p).fontWeight,
              fontFamily: getComputedStyle(p).fontFamily.split(',')[0],
            }
          : null,
        secao: {
          classe: s.className,
          background: getComputedStyle(s).background.slice(0, 200),
          backgroundColor: getComputedStyle(s).backgroundColor,
          boxShadow: getComputedStyle(s).boxShadow,
          isolation: getComputedStyle(s).isolation,
        },
        malha: {
          moduloDeclarado: raiz.getPropertyValue('--grade-fina-modulo').trim(),
          linhaDeclarada: raiz.getPropertyValue('--grade-fina-linha').trim(),
          opacidadeDeclarada: raiz.getPropertyValue('--grade-fina-opacidade').trim(),
          moduloTecnico: raiz.getPropertyValue('--grade-modulo').trim(),
          backgroundImage: antes.backgroundImage,
          backgroundSize: antes.backgroundSize,
          opacity: antes.opacity,
          repeticoes: (antes.backgroundImage.match(/repeating-linear-gradient/g) ?? []).length,
          usaMalhaTecnica: /121,\s*203/.test(antes.backgroundImage),
          maskImage: antes.maskImage.slice(0, 120),
        },
        pontilhadoDesligado: depois.display === 'none' || depois.content === 'none',
        // Item 2, «não haver duas grades»: o alvo é UMA camada.
        camadasDeGrade:
          (antes.backgroundImage !== 'none' && eGrade(antes.backgroundImage) ? 1 : 0) +
          (depois.display !== 'none' && depois.backgroundImage !== 'none' && eGrade(depois.backgroundImage)
            ? 1
            : 0) +
          descendentesComGrade,
        esg1NoDom,
        // Item 4: ordem no empilhamento.
        geometria: { secao: rect(s), copy: p ? rect(p) : null, arte: img ? rect(img) : null },
      };
    },
    { secao: SECAO, arte: ARTE, copy: COPY, eyebrow: EYEBROW },
  );

  /* Item 4, «mobile: texto → imagem». Não se afere por classe: afere-se por
     geometria. Em uma coluna a arte começa DEPOIS que o texto termina; em duas
     colunas elas se sobrepõem verticalmente e ficam lado a lado. */
  const g = declarado.geometria;
  const umaColuna = g.arte && g.copy ? g.arte.top >= g.copy.bottom - 1 : null;
  declarado.empilhamento = {
    umaColuna,
    textoAntesDaImagem: g.arte && g.copy ? g.copy.top < g.arte.top : null,
    artePorBaixo: umaColuna === true ? g.arte.top >= g.copy.bottom - 1 : 'lado a lado',
  };

  // ── Fotos ──────────────────────────────────────────────────────────────────
  const clip = {
    x: Math.max(0, Math.floor(g.secao.x)),
    y: Math.max(0, Math.floor(g.secao.y)),
    width: Math.min(Math.ceil(g.secao.w), w),
    height: Math.min(Math.ceil(g.secao.h), h - Math.max(0, Math.floor(g.secao.y))),
  };
  const desloca = (r) => ({ x: r.x - clip.x, y: r.y - clip.y, w: r.w, h: r.h });

  const fotoCheia = await page.screenshot({ clip });
  mkdirSync('docs/capturas', { recursive: true });
  writeFileSync(`docs/capturas/sis261-${w}-intro.png`, fotoCheia);
  writeFileSync(
    `docs/capturas/sis261-${w}-pagina.png`,
    await page.screenshot({ fullPage: false }),
  );

  /* Prova da transparência: mesma cena sem a arte. `visibility: hidden` e não
     `display: none` de propósito — o layout não pode mexer, senão a comparação
     compara quadros diferentes. */
  const tiraArte = await page.addStyleTag({ content: SEM_ARTE });
  await page.waitForTimeout(400);
  const fotoSemArte = await page.screenshot({ clip });
  writeFileSync(`docs/capturas/sis261-${w}-sem-arte.png`, fotoSemArte);
  await tiraArte.evaluate((el) => el.remove());
  await page.waitForTimeout(400);
  const fotoCheia2 = await page.screenshot({ clip });

  const A = await cru(fotoCheia);
  const B = await cru(fotoSemArte);
  const C = await cru(fotoCheia2);
  const cxArte = desloca(g.arte);

  /* Os cantos da caixa da imagem são justamente onde o alfa derivado deixou vago
     (o componente que toca a borda, ver `scripts/gerar-esg2-alfa.mjs`). Amostra
     recuada 4px para não cair no arredondamento da borda do layout. */
  const R = 4;
  const cantos = [
    ['sup-esq', Math.round(cxArte.x + R), Math.round(cxArte.y + R)],
    ['sup-dir', Math.round(cxArte.x + cxArte.w - R), Math.round(cxArte.y + R)],
    ['inf-esq', Math.round(cxArte.x + R), Math.round(cxArte.y + cxArte.h - R)],
    ['inf-dir', Math.round(cxArte.x + cxArte.w - R), Math.round(cxArte.y + cxArte.h - R)],
  ].filter(([, x, y]) => x >= 0 && y >= 0 && x < A.info.width && y < A.info.height);

  const semCaixa = cantos.map(([nome, x, y]) => {
    const com = pixel(A, x, y);
    const sem = pixel(B, x, y);
    const com2 = pixel(C, x, y);
    const delta = Math.max(
      Math.abs(com.r - sem.r),
      Math.abs(com.g - sem.g),
      Math.abs(com.b - sem.b),
    );
    return {
      canto: nome,
      x,
      y,
      comArte: com,
      semArte: sem,
      comArteRepetido: com2,
      delta,
      /* Zero significa: naquele ponto a imagem não pinta NADA. Nem placa branca,
         nem xadrez, nem sombra. */
      transparente: delta === 0,
    };
  });
  const centro = (() => {
    const x = Math.round(cxArte.x + cxArte.w / 2);
    const y = Math.round(cxArte.y + cxArte.h / 2);
    if (x < 0 || y < 0 || x >= A.info.width || y >= A.info.height) return null;
    const com = pixel(A, x, y);
    const sem = pixel(B, x, y);
    const delta = Math.max(
      Math.abs(com.r - sem.r),
      Math.abs(com.g - sem.g),
      Math.abs(com.b - sem.b),
    );
    // Controle: se isto for 0, a arte não carregou e o teste dos cantos é vazio.
    return { x, y, comArte: com, semArte: sem, delta, artePinta: delta > 8 };
  })();

  /* Xadrez residual: a assinatura do tabuleiro é um par de tons na razão ~1,42
     alternando com período ~9px. Varre-se uma linha dentro da faixa vaga do topo da
     arte e conta-se quantas transições grandes existem. Numa faixa transparente
     sobre a malha (linha de 2,5% de tinta) o número tem de ser baixo; num xadrez
     achatado seriam dezenas. */
  const linhaXadrez = (() => {
    const y = Math.round(cxArte.y + R);
    if (y < 0 || y >= A.info.height) return null;
    const x0 = Math.max(0, Math.round(cxArte.x + R));
    const x1 = Math.min(A.info.width - 1, Math.round(cxArte.x + cxArte.w - R));
    let transicoes = 0;
    let maxDelta = 0;
    for (let x = x0 + 1; x <= x1; x += 1) {
      const a = pixel(A, x - 1, y);
      const b = pixel(A, x, y);
      const d = Math.max(Math.abs(a.r - b.r), Math.abs(a.g - b.g), Math.abs(a.b - b.b));
      maxDelta = Math.max(maxDelta, d);
      if (d > 20) transicoes += 1;
    }
    return { y, de: x0, ate: x1, transicoes, maxDelta, semXadrez: transicoes === 0 };
  })();

  // ── Período da malha, por diferença ────────────────────────────────────────
  const apagaMalha = await page.addStyleTag({ content: SEM_MALHA });
  await page.waitForTimeout(400);
  const fotoSemMalha = await page.screenshot({ clip });
  await apagaMalha.evaluate((el) => el.remove());
  const M = await cru(fotoSemMalha);
  const malhaMedida = (() => {
    /* Amostra numa banda VAGA — acima do conteúdo — para a malha não estar coberta
       por texto nem por arte. */
    const y0 = 2;
    const y1 = Math.max(3, Math.min(A.info.height - 2, Math.round(desloca(g.copy).y) - 6));
    /* O LIMIAR NÃO É PRECAUÇÃO, É UM DEFEITO MEDIDO. A primeira volta contou
       «coluna alterada = tem ao menos 1 pixel diferente» e devolveu 1440 de 1440,
       com período nulo. O motivo: a malha tem linhas HORIZONTAIS também, e cada uma
       delas atravessa TODAS as colunas — então toda coluna tem pixel alterado e não
       sobra intervalo para medir. Uma coluna de linha VERTICAL difere em quase toda
       a altura da banda; uma coluna qualquer difere só nas ~3 horizontais que a
       cruzam. Metade da altura separa os dois casos com folga enorme. */
    const alturaBanda = y1 - y0;
    const MIN_ALTURA = alturaBanda * 0.5;
    const colunas = [];
    for (let x = 0; x < A.info.width; x += 1) {
      let mudou = 0;
      for (let y = y0; y < y1; y += 1) {
        const a = pixel(A, x, y);
        const b = pixel(M, x, y);
        /* DELTA MÍNIMO DE 3, e também por defeito medido: com «qualquer diferença
           conta» ainda saíram 1440 de 1440 colunas. O `::before` carrega
           `opacity: 0.32`, o que faz dele uma CAMADA composta; ligar e desligar a
           camada muda o arredondamento do gradiente do fundo por ±1 em toda a área.
           A linha da malha, por conta própria, vale ~5,7 por canal
           (`rgba(4,58,99,0.08)` × 0,32 sobre um claro na casa de 226). Então 3
           separa a linha do arredondamento com folga nas duas direções. */
        const d = Math.max(Math.abs(a.r - b.r), Math.abs(a.g - b.g), Math.abs(a.b - b.b));
        if (d >= 3) mudou += 1;
      }
      if (mudou >= MIN_ALTURA) colunas.push(x);
    }
    const saltos = [];
    for (let i = 1; i < colunas.length; i += 1) {
      const d = colunas[i] - colunas[i - 1];
      if (d > 1) saltos.push(d);
    }
    const conta = {};
    saltos.forEach((d) => {
      conta[d] = (conta[d] ?? 0) + 1;
    });
    const periodo = Object.entries(conta).sort((a, b) => b[1] - a[1])[0];
    return {
      bandaAmostrada: { y0, y1, minAlturaParaContarColuna: Math.round(MIN_ALTURA) },
      colunasAlteradas: colunas.length,
      colunas: colunas.slice(0, 30),
      periodoModa: periodo ? Number(periodo[0]) : null,
      periodoOcorrencias: periodo ? periodo[1] : 0,
      malhaPinta: colunas.length > 0,
    };
  })();

  // ── Contraste, método da casa ─────────────────────────────────────────────
  const contraste = {};
  for (const [nome, seletor] of [
    ['paragrafo', COPY],
    ['eyebrow', '#esg-introducao [data-esg-intro-eyebrow]'],
  ]) {
    const info = await page.evaluate(
      ({ sel }) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          cor: cs.color,
          fontSize: parseFloat(cs.fontSize),
          fontWeight: Number(cs.fontWeight) || 400,
          caixa: { x: r.x, y: r.y, w: r.width, h: r.height },
        };
      },
      { sel: seletor },
    );
    if (!info) continue;
    // Esconde a tinta com `important` inline — é como a casa mede.
    await page.evaluate(
      ({ sel }) => {
        const el = document.querySelector(sel);
        el.style.setProperty('color', 'transparent', 'important');
        el.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
      },
      { sel: seletor },
    );
    await page.waitForTimeout(250);
    const fundoClip = {
      x: Math.max(0, Math.floor(info.caixa.x)),
      y: Math.max(0, Math.floor(info.caixa.y)),
      width: Math.max(1, Math.min(Math.ceil(info.caixa.w), w - Math.floor(info.caixa.x))),
      height: Math.max(1, Math.min(Math.ceil(info.caixa.h), h - Math.floor(info.caixa.y))),
    };
    const fundoFoto = await cru(await page.screenshot({ clip: fundoClip }));
    await page.evaluate(
      ({ sel }) => {
        const el = document.querySelector(sel);
        el.style.removeProperty('color');
        el.style.removeProperty('-webkit-text-fill-color');
      },
      { sel: seletor },
    );
    const tinta = lerTinta(info.cor);
    let pior = Infinity;
    let piorPixel = null;
    const n = fundoFoto.info.width * fundoFoto.info.height;
    for (let p = 0; p < n; p += 1) {
      const i = p * fundoFoto.info.channels;
      const fundo = { r: fundoFoto.data[i], g: fundoFoto.data[i + 1], b: fundoFoto.data[i + 2] };
      const rz = razao(compor(tinta, fundo), fundo);
      if (rz < pior) {
        pior = rz;
        piorPixel = fundo;
      }
    }
    const grande = info.fontSize >= 24 || (info.fontSize >= 18.66 && info.fontWeight >= 700);
    const piso = grande ? 3 : 4.5;
    contraste[nome] = {
      cor: info.cor,
      fontSize: info.fontSize,
      fontWeight: info.fontWeight,
      textoGrande: grande,
      piso,
      piorFundo: piorPixel,
      // O veredito é este: alfa declarado composto sobre o pior pixel de fundo.
      calculado: Number(pior.toFixed(2)),
      passa: pior >= piso,
      pixeisDeFundo: n,
    };
  }

  /* ── O TRILHO DO ScrollSpy SOBRE A FAIXA CLARA ─────────────────────────────
     Isto NÃO é um item da issue: é uma consequência dela que precisa de número. O
     trilho é `position: fixed` e se colore pelo TOM DA SEÇÃO ATIVA, não pela
     superfície que passa por baixo dele (`ScrollSpy.tsx:130` — `secao.tom ??
     (el.closest('.section-light') ? 'claro' : 'escuro')`). No mapa de `/esg`
     (`src/data/pageSections.ts:125`) a intro não é âncora: entre `topo` (a capa,
     escura) e `esg-environment` não há entrada nenhuma. Então enquanto a intro
     preenche a tela o ativo continua sendo «Início», o trilho continua no par de
     cores de fundo ESCURO — e agora tem faixa CLARA por baixo.
     Antes da SIS-261 isso não existia porque a intro era escura. Mede-se aqui com o
     mesmo método de contraste da casa para a decisão não sair de impressão. */
  const trilho = await (async () => {
    const alvo = await page.evaluate((sel) => {
      const s = document.querySelector(sel);
      window.scrollTo({ top: window.scrollY + s.getBoundingClientRect().top, behavior: 'instant' });
      return true;
    }, SECAO);
    if (!alvo) return null;
    await page.waitForTimeout(1200);
    const info = await page.evaluate((sel) => {
      const rot = [...document.querySelectorAll('.scrollspy-rotulo')].find(
        (r) => getComputedStyle(r).opacity === '1' && r.getBoundingClientRect().width > 0,
      );
      if (!rot) return null;
      const s = document.querySelector(sel);
      const r = rot.getBoundingClientRect();
      const cs = getComputedStyle(rot);
      const sr = s.getBoundingClientRect();
      return {
        texto: rot.textContent.trim(),
        cor: cs.color,
        fontSize: parseFloat(cs.fontSize),
        fontWeight: Number(cs.fontWeight) || 400,
        caixa: { x: r.x, y: r.y, w: r.width, h: r.height },
        // O rótulo está de fato sobre a faixa clara?
        sobreAFaixa: r.top >= sr.top && r.bottom <= sr.bottom,
        secaoAtiva: document.querySelector('[aria-current="true"]')?.textContent?.trim() ?? null,
      };
    }, SECAO);
    if (!info || !info.sobreAFaixa) return { ...(info ?? {}), medido: false };
    await page.evaluate(() => {
      const rot = [...document.querySelectorAll('.scrollspy-rotulo')].find(
        (r) => getComputedStyle(r).opacity === '1' && r.getBoundingClientRect().width > 0,
      );
      rot.style.setProperty('color', 'transparent', 'important');
      rot.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
    });
    await page.waitForTimeout(250);
    const cl = {
      x: Math.max(0, Math.floor(info.caixa.x)),
      y: Math.max(0, Math.floor(info.caixa.y)),
      width: Math.max(1, Math.min(Math.ceil(info.caixa.w), w - Math.floor(info.caixa.x))),
      height: Math.max(1, Math.min(Math.ceil(info.caixa.h), h - Math.floor(info.caixa.y))),
    };
    const foto = await cru(await page.screenshot({ clip: cl }));
    const tinta = lerTinta(info.cor);
    let pior = Infinity;
    let piorPixel = null;
    const n = foto.info.width * foto.info.height;
    for (let p = 0; p < n; p += 1) {
      const i = p * foto.info.channels;
      const fundo = { r: foto.data[i], g: foto.data[i + 1], b: foto.data[i + 2] };
      const rz = razao(compor(tinta, fundo), fundo);
      if (rz < pior) {
        pior = rz;
        piorPixel = fundo;
      }
    }
    const grande = info.fontSize >= 24 || (info.fontSize >= 18.66 && info.fontWeight >= 700);
    const piso = grande ? 3 : 4.5;
    return {
      ...info,
      medido: true,
      piso,
      piorFundo: piorPixel,
      calculado: Number(pior.toFixed(2)),
      passa: pior >= piso,
    };
  })();

  relatorio.viewports[w] = {
    ...declarado,
    trilhoSobreAFaixa: trilho,
    semCaixaOpaca: { cantos: semCaixa, centro, linhaXadrez },
    malhaMedida,
    contraste,
  };
  await ctx.close();
}

await navegador.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/intro-esg-sis261.json', `${JSON.stringify(relatorio, null, 2)}\n`);
console.log(JSON.stringify(relatorio, null, 2));
