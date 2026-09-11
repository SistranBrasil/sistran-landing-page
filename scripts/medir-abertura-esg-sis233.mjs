/**
 * SIS-233 — a abertura de `/esg` no MESMO PADRÃO VISUAL da de `/contato`:
 * manchete (`title` + `highlight`) + descrição de apoio (parágrafo), em vez da
 * cauda fingindo ser a segunda metade do `h1` (estado da SIS-138).
 *
 * O critério (a) diz "mesmo padrão visual de `/contato` (escala, peso, papel de
 * título vs parágrafo, colunas)". Padrão visual não se confere de olho: o que
 * esta sonda faz é medir os MESMOS campos nas DUAS rotas e pôr lado a lado —
 * corpo em px, peso, família, cor, `line-height`, medida da linha em px e em
 * caracteres, colunas da grade e o `gap`. A prova é a coincidência dos campos de
 * padrão (não dos textos: o texto de cada rota é o seu, e trocá-lo está fora de
 * escopo por escrito na issue).
 *
 * Mede também, porque são critérios:
 *  - (b) o texto da frase de ESG, verbatim, comparado com
 *    `.claude/conteudo-site/07-esg.md` (`ESPERADO` abaixo) — junção de manchete e
 *    descrição, para provar que a frase continua completa depois do recorte novo.
 *  - (c) SOBREPOSIÇÃO com o globo da foto. O globo não é um nó do DOM (está na
 *    imagem de fundo), então o que se mede é a caixa dele em fração da foto,
 *    calibrada uma vez a olho sobre `public/images/esg/esg-hero.webp` e anotada
 *    em `GLOBO` — e a interseção das caixas de texto com ela. Serve como
 *    não-regressão: o número DEPOIS não pode ser pior que o de ANTES.
 *  - (d) empilhamento em 390 e 1024: quantas colunas a grade tem de fato
 *    (`grid-template-columns` resolvido) em cada largura.
 *  - contraste da descrição sobre o véu, pelo método da casa
 *    (`docs/medidas/COMO-MEDIR-CONTRASTE.md` §7): a letra isolada pela diferença
 *    A−B entre duas abas, uma com a tinta e outra com a tinta apagada. Sai o par
 *    `razao` (corpo do glifo, cobertura >= 0,85 — é quem decide) e `rasterPior`
 *    (pior pixel, com a franja de antialiasing dentro). Piso 3:1 para texto
 *    grande (>=24px, ou >=18,66px com peso >=700) e 4,5:1 no resto.
 *
 * Ferramenta de bancada; nada disso entra no bundle.
 *   node scripts/medir-abertura-esg-sis233.mjs
 *   MARCA=depois node scripts/medir-abertura-esg-sis233.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const MARCA = process.env.MARCA ?? 'antes';
const LARGURAS = process.env.LARGURAS
  ? process.env.LARGURAS.split(',').map(Number)
  : [1440, 1024, 390];
const ALTURA = 900;
const DESTINO = 'docs/capturas/sis233-esg';
const CORPO = 0.85;
const MIUDO = 16;

/* A frase institucional de `/esg`, palavra por palavra, de
   `.claude/conteudo-site/07-esg.md:11`. A sonda compara com a JUNÇÃO de manchete e
   descrição depois de normalizar espaços e a maiúscula inicial da descrição — o
   recorte novo transforma ", integrando" em ". Integrando", e é exatamente essa a
   única diferença que se aceita (a descrição passa a ser oração própria). */
const ESPERADO =
  'A Sistran demonstra seu forte compromisso com o ESG, integrando práticas sustentáveis em suas operações e cultura corporativa.';

/* Caixa do globo na FOTO, em fração da própria imagem (x0,y0,x1,y1). Calibrada
   sobre `public/images/esg/esg-hero.webp` (1031×690): o globo ocupa a metade
   direita, do meio da altura para baixo. Com `object-position: 50% 42%` e
   `cover`, a projeção na tela é calculada abaixo a partir da caixa da <img>. */
const GLOBO = [0.52, 0.3, 0.98, 1.0];

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

const LEVANTAR = (globo) => {
  const corDe = (bruto) => bruto.match(/-?[\d.]+/g).map(Number);
  const abertura = document.querySelector('.pagehero-entrada');
  const bloco = abertura?.querySelector(':scope > .container-lp > div');
  const h1 = abertura?.querySelector('h1');
  const desc = h1?.nextElementSibling;
  const foto = document.querySelector('.pagehero-entrada img, .hero-backdrop img');

  /* Projeção da caixa do globo na tela. `object-fit: cover` escala pelo maior
     lado e `object-position` decide o que sobra fora — sem esta conta, comparar a
     caixa do texto com uma fração da IMAGEM seria comparar dois sistemas de
     coordenadas diferentes. */
  let caixaGlobo = null;
  if (foto) {
    const r = foto.getBoundingClientRect();
    const nw = foto.naturalWidth || r.width;
    const nh = foto.naturalHeight || r.height;
    const escala = Math.max(r.width / nw, r.height / nh);
    const [pw, ph] = [nw * escala, nh * escala];
    const pos = getComputedStyle(foto).objectPosition.match(/-?[\d.]+/g)?.map(Number) ?? [50, 50];
    const ox = r.left - ((pw - r.width) * (pos[0] ?? 50)) / 100;
    const oy = r.top - ((ph - r.height) * (pos[1] ?? 50)) / 100;
    caixaGlobo = {
      x0: Math.round(ox + globo[0] * pw),
      y0: Math.round(oy + globo[1] * ph),
      x1: Math.round(ox + globo[2] * pw),
      y1: Math.round(oy + globo[3] * ph),
    };
  }

  const medir = (e, rotulo) => {
    if (!e) return null;
    const c = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    /* A LINHA, não a caixa: `getClientRects` de um Range devolve uma caixa por
       linha renderizada, então daqui saem a contagem de linhas e a largura real do
       texto — que é o que "medida de leitura" quer dizer. */
    const range = document.createRange();
    range.selectNodeContents(e);
    const linhas = [...range.getClientRects()].filter((b) => b.width > 1 && b.height > 1);
    const px = Math.round(parseFloat(c.fontSize) * 100) / 100;
    let sobre = 0;
    if (caixaGlobo)
      for (const b of linhas) {
        const w = Math.max(0, Math.min(b.right, caixaGlobo.x1) - Math.max(b.left, caixaGlobo.x0));
        const h = Math.max(0, Math.min(b.bottom, caixaGlobo.y1) - Math.max(b.top, caixaGlobo.y0));
        sobre += w * h;
      }
    return {
      rotulo,
      texto: (e.textContent ?? '').replace(/\s+/g, ' ').trim(),
      px,
      peso: c.fontWeight,
      familia: c.fontFamily.split(',')[0].replace(/["']/g, ''),
      alturaLinha: Math.round(parseFloat(c.lineHeight) * 100) / 100,
      cor: c.color,
      caixa: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width) },
      linhas: linhas.length,
      /* Medida em caracteres: largura da linha mais larga dividida pela largura de
         um `0` no mesmo corpo — é a régua de `ch` que o Tailwind usa. */
      linhaMaisLarga: Math.round(Math.max(0, ...linhas.map((b) => b.width))),
      espacoBranco: c.whiteSpace,
      medidaMaxima: c.maxWidth,
      margemTopo: Math.round(parseFloat(c.marginTop)),
      sobreGloboPx2: Math.round(sobre),
    };
  };

  const b = bloco ? getComputedStyle(bloco) : null;
  return {
    grade: b
      ? {
          display: b.display,
          colunas: b.gridTemplateColumns,
          quantasColunas: b.display === 'grid' ? b.gridTemplateColumns.split(' ').length : 1,
          gap: b.columnGap,
          alinhamento: b.alignItems,
        }
      : null,
    globo: caixaGlobo,
    h1: medir(h1, 'h1'),
    descricao: medir(desc?.tagName === 'DIV' ? desc : null, 'descricao'),
  };
};

/* Apaga a tinta da ABERTURA inteira: um glifo vizinho que sobrevivesse entraria no
   recorte como se fosse fundo escuro. */
const APAGAR = () => {
  const raiz = document.querySelector('.pagehero-entrada');
  if (!raiz) return -1;
  for (const f of [raiz, ...raiz.querySelectorAll('*')]) {
    const a = getComputedStyle(f);
    if (a.webkitBackgroundClip === 'text' || a.backgroundClip === 'text')
      f.style.setProperty('background-image', 'none', 'important');
    f.style.setProperty('color', 'transparent', 'important');
    f.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
    f.style.setProperty('fill', 'transparent', 'important');
  }
  return [...raiz.querySelectorAll('*')].filter((f) => {
    const a = getComputedStyle(f);
    return (a.webkitTextFillColor || a.color).replace(/\s/g, '') !== 'rgba(0,0,0,0)';
  }).length;
};

const CAIXAS = (seletor) => {
  const abertura = document.querySelector('.pagehero-entrada');
  const h1 = abertura?.querySelector('h1');
  const e = seletor === 'h1' ? h1 : h1?.nextElementSibling;
  if (!e) return null;
  const c = getComputedStyle(e);
  const n = (c.webkitTextFillColor || c.color).match(/-?[\d.]+/g).map(Number);
  let alfa = n.length > 3 ? n[3] : 1;
  for (let p = e; p; p = p.parentElement) {
    const o = Number(getComputedStyle(p).opacity);
    if (!Number.isNaN(o)) alfa *= o;
  }
  const r = document.createRange();
  r.selectNodeContents(e);
  return {
    tinta: n.slice(0, 3),
    alfa: Math.round(alfa * 1000) / 1000,
    px: Math.round(parseFloat(c.fontSize) * 100) / 100,
    peso: c.fontWeight,
    caixas: [...r.getClientRects()]
      .filter((b) => b.width > 1 && b.height > 1 && b.bottom > 0 && b.top < window.innerHeight)
      .map((b) => ({
        x: Math.floor(b.left),
        y: Math.floor(b.top),
        w: Math.ceil(b.width) + 1,
        h: Math.ceil(b.height) + 1,
      })),
  };
};

/* Duas capturas consecutivas iguais = quadro parado. Mesmo mecanismo da sonda de
   SIS-215; aqui basta a faixa da abertura. */
const estabilizar = async (pagina, tentativas = 14) => {
  const { width } = pagina.viewportSize();
  const recorte = { x: 0, y: 0, width: Math.min(900, width), height: ALTURA };
  let anterior = null;
  for (let i = 0; i < tentativas; i += 1) {
    const agora = await pagina.screenshot({ clip: recorte });
    if (anterior && anterior.equals(agora)) return true;
    anterior = agora;
    await new Promise((res) => setTimeout(res, 350));
  }
  return false;
};

const abrir = async (navegador, rota, largura, apagar) => {
  const pagina = await navegador.newPage({ viewport: { width: largura, height: ALTURA } });
  await pagina.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  await pagina.goto(`${BASE}${rota}`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('.pagehero-entrada h1', { timeout: 180_000 });
  await pagina.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[class*=motion-banner],[class*=motion-dialog]{display:none!important}',
  });
  /* A abertura entra por variantes de `motion` (`vHeader`/`vTitle`/`vSubtitle`):
     medir antes de a entrada terminar devolveria `opacity` e `y` do meio do
     caminho, e o contraste sairia menor do que o real. */
  await pagina.waitForTimeout(2200);
  /* ⚠️ ESPERAR A FOTO, E DEPOIS ESPERAR O QUADRO PARAR. Sem os dois, a medição de
     390 voltou três números diferentes em três voltas com o MESMO código: 8,64 /
     3,97 / 2,58, e o "pior fundo" saía uma vez em `rgb(24,133,206)` (o azul do
     corpo da página, sem foto) e outra em `rgb(144,164,179)` (um trecho claro do
     quadro). A causa é a diferença A−B: ela subtrai duas ABAS, e se numa a foto já
     decodificou e na outra não, o que entra na conta como "fundo" é o fundo de uma
     página que não é a medida. Não era defeito de contraste — era par desalinhado.
     `estabilizar` fecha o resto (o `motion` ainda assentando no último quadro). */
  await pagina
    .waitForFunction(
      () => {
        const i = document.querySelector('.pagehero-entrada img, .hero-backdrop img');
        return !!i && i.complete && i.naturalWidth > 0;
      },
      { timeout: 60_000 },
    )
    .catch(() => undefined);
  await estabilizar(pagina);
  const teimosos = apagar ? await pagina.evaluate(APAGAR) : 0;
  return { pagina, teimosos };
};

await mkdir(DESTINO, { recursive: true });
const navegador = await chromium.launch();
const saida = {};

for (const largura of LARGURAS) {
  const bloco = {};
  for (const [rotulo, rota] of [
    ['esg', '/esg'],
    ['contato', '/contato'],
  ]) {
    const { pagina } = await abrir(navegador, rota, largura, false);
    const medido = await pagina.evaluate(LEVANTAR, GLOBO);
    if (rotulo === 'esg') {
      const junta = `${medido.h1?.texto ?? ''} ${medido.descricao?.texto ?? ''}`
        .replace(/\s+/g, ' ')
        .trim();
      /* Normaliza só o que o recorte novo muda de propósito: o ponto que fecha a
         manchete e a maiúscula que abre a descrição voltam a ser vírgula e
         minúscula para a comparação. Qualquer outra diferença reprova. */
      const normal = junta
        .replace(/\.\s+([A-ZÀ-Ú])/g, (_, l) => `, ${l.toLowerCase()}`)
        .replace(/\s+,/g, ',');
      medido['#fraseCompleta'] = normal === ESPERADO;
      medido['#fraseLida'] = normal;
    }
    await pagina.screenshot({ path: `${DESTINO}/${MARCA}-${rotulo}-${largura}.png` });
    bloco[rotulo] = medido;
    await pagina.close();
  }

  /* Contraste só de `/esg` — é o que o critério pede ("descrição legível sobre o
     véu"), e o `h1` entra de carona porque o recorte novo mexe nos dois. */
  const comTinta = await abrir(navegador, '/esg', largura, false);
  const semTinta = await abrir(navegador, '/esg', largura, true);
  const contraste = { '#tintaTeimosa': semTinta.teimosos };
  const [a, b] = await Promise.all([
    comTinta.pagina.screenshot(),
    semTinta.pagina.screenshot(),
  ]);
  const [A, B] = await Promise.all(
    [a, b].map((buf) => sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })),
  );
  for (const alvo of ['h1', 'descricao']) {
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
      miudo: m.px < MIUDO,
      passa: piorCorpo ? piorCorpo.razao >= piso : false,
    };
  }
  bloco['#contrasteEsg'] = contraste;
  await comTinta.pagina.close();
  await semTinta.pagina.close();

  saida[largura] = bloco;
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
