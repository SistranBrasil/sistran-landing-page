/**
 * SIS-248 — a abertura de `/sistran-university` passa a ter capa full-bleed
 * (`HeroImageBackdrop` + `university-hero.webp`). Esta sonda mede o que a issue
 * cobra, nas duas larguras de referência (390 e 1440):
 *
 *  - CONTRASTE do `h1` e da descrição sobre o véu, pelo método da casa
 *    (`docs/medidas/COMO-MEDIR-CONTRASTE.md` §7): a letra é isolada pela
 *    diferença A−B entre duas abas, uma com a tinta e outra com a tinta apagada.
 *    Sai o par `razao` (corpo do glifo, cobertura >= 0,85 — é quem decide) e
 *    `rasterPior` (pior pixel, com a franja de antialiasing dentro). Piso 3:1
 *    para texto grande (>=24px, ou >=18,66px com peso >=700) e 4,5:1 no resto.
 *  - SOBREPOSIÇÃO do texto com o ASSUNTO da capa. O capelo/engrenagem/livro/
 *    escada/certificado não são nós do DOM (estão dentro da imagem), então o que
 *    se mede é a caixa deles em fração da própria imagem, calibrada uma vez a
 *    olho sobre `public/images/university/university-hero.webp` e anotada em
 *    `ASSUNTO` — projetada na tela pela conta de `cover` + `object-position`. O
 *    critério é a área de interseção com as linhas do texto: DEPOIS não pode ser
 *    pior que ANTES (antes é zero, porque não havia foto: então o alvo é zero).
 *  - VERBATIM da escrita: manchete e descrição comparadas caractere a caractere
 *    com `ESPERADO`, que é o texto publicado hoje. Serve de trava: a issue muda
 *    a moldura, não a palavra.
 *  - EMENDA com a seção seguinte (`#university-programa`): distância entre o pé
 *    da abertura e o topo da seção, mais a cor lida nos dois lados da junta —
 *    é como se prova que não nasceu listra na costura.
 *
 * Ferramenta de bancada; nada disso entra no bundle.
 *   node scripts/medir-abertura-university-sis248.mjs
 *   MARCA=depois LARGURAS=1440,390 node scripts/medir-abertura-university-sis248.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:3788';
const MARCA = process.env.MARCA ?? 'antes';
const LARGURAS = process.env.LARGURAS
  ? process.env.LARGURAS.split(',').map(Number)
  : [1440, 390];
const ALTURA = 900;
const DESTINO = 'docs/capturas/sis248-university';
const CORPO = 0.85;
const ROTA = '/sistran-university';

/* O texto publicado, palavra por palavra (`src/app/sistran-university/page.tsx`,
   travado em `copy-lock.json`). */
const ESPERADO = {
  h1: 'Autossuficiência em capacitação de recursos',
  descricao:
    'Somos um verdadeiro banco de talentos de primeira linha, prontos para atender às demandas específicas da sua seguradora com as mais avançadas tecnologias.',
};

/* Caixa do assunto na IMAGEM, em fração dela (x0,y0,x1,y1). Calibrada sobre
   `university-hero.webp` (1672×941): a composição inteira — capelo, engrenagem,
   livro, escada e certificado — vive da metade para a direita; a esquerda é campo
   escuro com partículas. */
const ASSUNTO = [0.48, 0.0, 1.0, 1.0];

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

const LEVANTAR = (assunto) => {
  const abertura = document.querySelector('.pagehero-entrada');
  const h1 = abertura?.querySelector('h1');
  const desc = h1?.nextElementSibling;
  const foto = document.querySelector('.hero-backdrop img, .pagehero-entrada img');

  /* Projeção da caixa do assunto na tela: `cover` escala pelo maior lado e
     `object-position` decide o que sobra fora do recorte. Sem esta conta,
     comparar a caixa do texto com uma fração da IMAGEM seria comparar dois
     sistemas de coordenadas diferentes. */
  let caixaAssunto = null;
  let fotoInfo = null;
  if (foto) {
    const r = foto.getBoundingClientRect();
    const nw = foto.naturalWidth || r.width;
    const nh = foto.naturalHeight || r.height;
    const escala = Math.max(r.width / nw, r.height / nh);
    const [pw, ph] = [nw * escala, nh * escala];
    const c = getComputedStyle(foto);
    const pos = c.objectPosition.match(/-?[\d.]+/g)?.map(Number) ?? [50, 50];
    const ox = r.left - ((pw - r.width) * (pos[0] ?? 50)) / 100;
    const oy = r.top - ((ph - r.height) * (pos[1] ?? 50)) / 100;
    caixaAssunto = {
      x0: Math.round(ox + assunto[0] * pw),
      y0: Math.round(oy + assunto[1] * ph),
      x1: Math.round(ox + assunto[2] * pw),
      y1: Math.round(oy + assunto[3] * ph),
    };
    fotoInfo = {
      src: foto.currentSrc || foto.getAttribute('src'),
      alt: foto.getAttribute('alt'),
      altVazio: foto.getAttribute('alt') === '',
      loading: foto.getAttribute('loading'),
      fetchpriority: foto.getAttribute('fetchpriority'),
      decoding: foto.getAttribute('decoding'),
      sizes: foto.getAttribute('sizes'),
      objectFit: c.objectFit,
      objectPosition: c.objectPosition,
      natural: { w: foto.naturalWidth, h: foto.naturalHeight },
      caixa: {
        x: Math.round(r.left),
        y: Math.round(r.top),
        w: Math.round(r.width),
        h: Math.round(r.height),
      },
      /* Fatia da imagem que sobrevive ao recorte, em fração — é o que diz se o
         foco escolhido está de fato mostrando o campo escuro. */
      janela: {
        x0: Math.round(((r.left - ox) / pw) * 1000) / 1000,
        x1: Math.round(((r.right - ox) / pw) * 1000) / 1000,
        y0: Math.round(((r.top - oy) / ph) * 1000) / 1000,
        y1: Math.round(((r.bottom - oy) / ph) * 1000) / 1000,
      },
    };
  }

  const medir = (e, rotulo) => {
    if (!e) return null;
    const c = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(e);
    const linhas = [...range.getClientRects()].filter((b) => b.width > 1 && b.height > 1);
    let sobre = 0;
    if (caixaAssunto)
      for (const b of linhas) {
        const w = Math.max(0, Math.min(b.right, caixaAssunto.x1) - Math.max(b.left, caixaAssunto.x0));
        const h = Math.max(0, Math.min(b.bottom, caixaAssunto.y1) - Math.max(b.top, caixaAssunto.y0));
        sobre += w * h;
      }
    return {
      rotulo,
      texto: (e.textContent ?? '').replace(/\s+/g, ' ').trim(),
      px: Math.round(parseFloat(c.fontSize) * 100) / 100,
      peso: c.fontWeight,
      cor: c.color,
      alturaLinha: Math.round(parseFloat(c.lineHeight) * 100) / 100,
      caixa: {
        x: Math.round(r.left),
        y: Math.round(r.top),
        w: Math.round(r.width),
        h: Math.round(r.height),
      },
      linhas: linhas.length,
      linhaMaisLarga: Math.round(Math.max(0, ...linhas.map((b) => b.width))),
      medidaMaxima: c.maxWidth,
      sombra: c.textShadow,
      sobreAssuntoPx2: Math.round(sobre),
    };
  };

  /* A EMENDA: pé da abertura contra topo da seção seguinte. */
  const secao = document.querySelector('#university-programa');
  const abre = abertura?.getBoundingClientRect();
  const wrapper = document.querySelector('.hero-backdrop');
  const emenda =
    secao && abre
      ? {
          peDaAbertura: Math.round(abre.bottom),
          topoDaSecao: Math.round(secao.getBoundingClientRect().top),
          folga: Math.round(secao.getBoundingClientRect().top - abre.bottom),
          fundoDaSecao: getComputedStyle(secao).backgroundImage.slice(0, 120),
        }
      : null;

  return {
    wrapper: wrapper
      ? { classe: wrapper.className, isolation: getComputedStyle(wrapper).isolation }
      : null,
    foto: fotoInfo,
    assunto: caixaAssunto,
    h1: medir(h1, 'h1'),
    descricao: medir(desc && desc.tagName !== 'H1' ? desc : null, 'descricao'),
    emenda,
  };
};

/* Apaga a tinta da ABERTURA inteira: um glifo vizinho que sobrevivesse entraria
   no recorte como se fosse fundo escuro. */
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
    f.style.setProperty('text-shadow', 'none', 'important');
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

/* Duas capturas consecutivas iguais = quadro parado. */
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

const abrir = async (navegador, largura, apagar) => {
  const pagina = await navegador.newPage({ viewport: { width: largura, height: ALTURA } });
  await pagina.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  await pagina.goto(`${BASE}${ROTA}`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('.pagehero-entrada h1', { timeout: 180_000 });
  await pagina.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[class*=motion-banner],[class*=motion-dialog]{display:none!important}',
  });
  /* A abertura entra por variantes de `motion`: medir antes de a entrada
     terminar devolveria `opacity` do meio do caminho. */
  await pagina.waitForTimeout(2200);
  /* Esperar a foto E o quadro parar: a diferença A−B subtrai duas ABAS, e um par
     em que só uma decodificou a imagem mede o fundo de uma página que não é a
     medida (armadilha registrada na sonda da SIS-233). */
  await pagina
    .waitForFunction(
      () => {
        const i = document.querySelector('.hero-backdrop img, .pagehero-entrada img');
        return !i || (i.complete && i.naturalWidth > 0);
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
  const comTinta = await abrir(navegador, largura, false);
  const medido = await comTinta.pagina.evaluate(LEVANTAR, ASSUNTO);
  medido['#verbatim'] = {
    h1: medido.h1?.texto === ESPERADO.h1,
    descricao: medido.descricao?.texto === ESPERADO.descricao,
  };
  await comTinta.pagina.screenshot({ path: `${DESTINO}/${MARCA}-${largura}.png` });
  /* A emenda com a seção Programa quer o olho na junta, e não a dobra inteira. */
  const junta = medido.emenda?.peDaAbertura ?? 0;
  await comTinta.pagina.screenshot({
    path: `${DESTINO}/${MARCA}-emenda-${largura}.png`,
    clip: {
      x: 0,
      y: Math.max(0, junta - 220),
      width: largura,
      height: Math.min(440, ALTURA - Math.max(0, junta - 220)),
    },
  });

  const semTinta = await abrir(navegador, largura, true);
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
      passa: piorCorpo ? piorCorpo.razao >= piso : false,
    };
  }
  medido['#contraste'] = contraste;
  await comTinta.pagina.close();
  await semTinta.pagina.close();
  saida[largura] = medido;
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
