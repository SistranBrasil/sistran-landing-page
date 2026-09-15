/**
 * SIS-249 — a seção `#university-programa` de `/sistran-university` passa a ter
 * fundo composto (`university-programa.webp` + véu + pluma). Esta sonda mede o
 * que a issue cobra, nas duas larguras de referência (390 e 1440):
 *
 *  - CONTRASTE do `h2` e do parágrafo sobre o fundo, pelo método da casa
 *    (`docs/medidas/COMO-MEDIR-CONTRASTE.md` §7): a letra é isolada pela
 *    diferença A−B entre duas abas, uma com a tinta e outra com a tinta apagada.
 *    Sai o par `razao` (corpo do glifo, cobertura >= 0,85 — é quem decide) e
 *    `rasterPior` (pior pixel, com a franja de antialiasing dentro). Piso 3:1
 *    para texto grande (>=24px, ou >=18,66px com peso >=700) e 4,5:1 no resto.
 *    O `strong` do parágrafo é medido à parte: ele é branco cheio, não `white/85`.
 *  - ANTES e DEPOIS na mesma execução. `MODOS=antes,depois`: em `antes` a sonda
 *    NEUTRALIZA as três camadas novas (mídia, véu e pluma) e a sombra do `h2` por
 *    CSS, o que devolve a pintura que a seção tinha antes desta issue — a seção
 *    sem fundo próprio, sobre o `#1273bc` do `body` com o navy da emenda da
 *    SIS-248 no topo. Serve para provar que o DEPOIS não é pior que o ANTES sem
 *    mexer no git (há trabalho concorrente na árvore).
 *  - VERBATIM da escrita: título e parágrafo comparados caractere a caractere com
 *    `ESPERADO`, que é o texto publicado hoje — inclusive a frase sem verbo
 *    principal. A issue muda a moldura, não a palavra.
 *  - A MÍDIA: `alt` vazio, `loading`, `object-position` e a JANELA (que fração do
 *    arquivo sobrevive ao `cover`) — é como se confere o foco calibrado.
 *  - AS DUAS EMENDAS: com a capa da SIS-248 em cima e com `#university-unidep`
 *    embaixo. Distância entre as caixas e leitura de cor pixel a pixel numa
 *    coluna que atravessa a junta, para provar que não nasceu listra.
 *
 * Ferramenta de bancada; nada disso entra no bundle.
 *   node scripts/medir-programa-university-sis249.mjs
 *   BASE_URL=http://localhost:3792 LARGURAS=1440,390 MODOS=antes,depois \
 *     node scripts/medir-programa-university-sis249.mjs
 *
 * O padrão é a porta 3000 porque o `next dev` do Next 16 recusa um segundo
 * servidor no mesmo diretório: quando já houver um de pé, a sonda usa o que está
 * lá em vez de derrubá-lo.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const LARGURAS = process.env.LARGURAS ? process.env.LARGURAS.split(',').map(Number) : [1440, 390];
const MODOS = process.env.MODOS ? process.env.MODOS.split(',') : ['antes', 'depois'];
const ALTURA = 900;
const DESTINO = 'docs/capturas/sis249-programa';
/* O número medido é gravado pelo próprio script, e não por redirecionamento de
   terminal: no PowerShell o `>` grava UTF-16 com BOM e o JSON sai ilegível para
   quem for reler depois. */
const MEDIDAS = 'docs/medidas/programa-university-sis249';
const CORPO = 0.85;
const ROTA = '/sistran-university';

/* O texto publicado, palavra por palavra (`src/app/sistran-university/page.tsx`,
   travado em `copy-lock.json`). A segunda string é a frase sem verbo principal:
   ela é reproduzida aqui como está, porque o teste é de identidade, não de
   gramática. */
const ESPERADO = {
  h2: 'Formar especialistas em tecnologia de ponta',
  paragrafo:
    'O Sistran University, programa de capacitação intensiva da Sistran, dedicado a formar especialistas em tecnologia de ponta e desenvolvimento de sistemas.',
};

/* Desliga as três camadas desta issue. Não remove nós: só apaga a pintura, que é
   o que a medição vê. */
const NEUTRALIZAR = `
  .university-programa-midia { display: none !important; }
  .university-programa::before,
  .university-programa::after { background: none !important; }
  .university-programa h2 { text-shadow: none !important; }
`;

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
  const h2 = secao?.querySelector('h2');
  const paragrafo = secao?.querySelector('p');
  const forte = paragrafo?.querySelector('strong');
  const foto = secao?.querySelector('img');
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
      topoDoc: Math.round(r.top + window.scrollY),
      peDoc: Math.round(r.bottom + window.scrollY),
    };
  };

  const medir = (e, rotulo) => {
    if (!e) return null;
    const c = getComputedStyle(e);
    const range = document.createRange();
    range.selectNodeContents(e);
    const linhas = [...range.getClientRects()].filter((b) => b.width > 1 && b.height > 1);
    return {
      rotulo,
      texto: (e.textContent ?? '').replace(/\s+/g, ' ').trim(),
      px: Math.round(parseFloat(c.fontSize) * 100) / 100,
      peso: c.fontWeight,
      cor: c.color,
      caixa: caixa(e),
      linhas: linhas.length,
      linhaMaisLarga: Math.round(Math.max(0, ...linhas.map((b) => b.width))),
      sombra: c.textShadow,
    };
  };

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
    fotoInfo = {
      src: foto.currentSrc || foto.getAttribute('src'),
      alt: foto.getAttribute('alt'),
      altVazio: foto.getAttribute('alt') === '',
      loading: foto.getAttribute('loading'),
      fetchpriority: foto.getAttribute('fetchpriority'),
      decoding: foto.getAttribute('decoding'),
      objectFit: c.objectFit,
      objectPosition: c.objectPosition,
      natural: { w: foto.naturalWidth, h: foto.naturalHeight },
      caixa: caixa(foto),
      /* Fatia do arquivo que sobrevive ao recorte, em fração — é o que diz se o
         foco escolhido está mostrando o pedaço pretendido da arte. */
      janela: {
        x0: Math.round(((r.left - ox) / pw) * 1000) / 1000,
        x1: Math.round(((r.right - ox) / pw) * 1000) / 1000,
        y0: Math.round(((r.top - oy) / ph) * 1000) / 1000,
        y1: Math.round(((r.bottom - oy) / ph) * 1000) / 1000,
      },
    };
  }

  const camada = (seletor, pseudo) => {
    const alvo = document.querySelector(seletor);
    if (!alvo) return null;
    const c = getComputedStyle(alvo, pseudo);
    return {
      zIndex: c.zIndex,
      pointerEvents: c.pointerEvents,
      background: c.backgroundImage.slice(0, 260),
      mascara: (c.maskImage || c.webkitMaskImage || 'none').slice(0, 200),
    };
  };

  return {
    secao: {
      caixa: caixa(secao),
      position: secao ? getComputedStyle(secao).position : null,
      isolation: secao ? getComputedStyle(secao).isolation : null,
      fundo: secao ? getComputedStyle(secao).backgroundImage.slice(0, 120) : null,
      paddingTopo: secao ? getComputedStyle(secao).paddingTop : null,
      paddingPe: secao ? getComputedStyle(secao).paddingBottom : null,
    },
    camadas: {
      midia: camada('.university-programa-midia', null),
      veu: camada('.university-programa', '::before'),
      pluma: camada('.university-programa', '::after'),
      conteudo: camada('.university-programa-conteudo', null),
    },
    foto: fotoInfo,
    h2: medir(h2, 'h2'),
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
    h2: secao?.querySelector('h2'),
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

const abrir = async (navegador, largura, modo, apagar) => {
  const pagina = await navegador.newPage({ viewport: { width: largura, height: ALTURA } });
  await pagina.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  await pagina.goto(`${BASE}${ROTA}`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('#university-programa h2', { timeout: 180_000 });
  await pagina.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[class*=motion-banner],[class*=motion-dialog]{display:none!important}',
  });
  if (modo === 'antes') await pagina.addStyleTag({ content: NEUTRALIZAR });
  await pagina.waitForTimeout(1800);
  const ancora = await pagina.evaluate(ANCORAR);
  await pagina.waitForTimeout(900);
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
   há listra: a cor tem de andar em passos pequenos. */
const coluna = (raster, x, y0, y1) => {
  const saida = [];
  for (let y = Math.max(0, y0); y < Math.min(y1, raster.info.height); y += 4) {
    const k = (y * raster.info.width + x) * raster.info.channels;
    saida.push({ y, cor: [raster.data[k], raster.data[k + 1], raster.data[k + 2]] });
  }
  return saida;
};

await mkdir(DESTINO, { recursive: true });
await mkdir(MEDIDAS, { recursive: true });
const navegador = await chromium.launch();
const saida = {};

for (const largura of LARGURAS) {
  saida[largura] = {};
  for (const modo of MODOS) {
    const comTinta = await abrir(navegador, largura, modo, false);
    const medido = await comTinta.pagina.evaluate(LEVANTAR);
    medido['#verbatim'] = {
      h2: medido.h2?.texto === ESPERADO.h2,
      paragrafo: medido.paragrafo?.texto === ESPERADO.paragrafo,
    };
    medido['#ancora'] = comTinta.ancora;

    await comTinta.pagina.screenshot({ path: `${DESTINO}/${modo}-${largura}.png` });
    /* A seção inteira, do topo ao pé, mesmo que passe da janela. */
    await comTinta.pagina.screenshot({
      path: `${DESTINO}/${modo}-secao-${largura}.png`,
      clip: {
        x: 0,
        y: Math.max(0, medido.junta.topo),
        width: largura,
        height: Math.min(medido.junta.pe - medido.junta.topo, ALTURA - Math.max(0, medido.junta.topo)),
      },
      fullPage: false,
    });

    const semTinta = await abrir(navegador, largura, modo, true);
    const contraste = { '#tintaTeimosa': semTinta.teimosos, '#ancoraIgual': semTinta.ancora === comTinta.ancora };
    const [a, b] = await Promise.all([comTinta.pagina.screenshot(), semTinta.pagina.screenshot()]);
    const [A, B] = await Promise.all(
      [a, b].map((buf) => sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })),
    );

    for (const alvo of ['h2', 'paragrafo', 'forte']) {
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
    const x = Math.round(largura * 0.06);
    medido['#juntaTopo'] = coluna(B, x, medido.junta.topo - 24, medido.junta.topo + 24);
    medido['#juntaPe'] =
      medido.junta.pe < ALTURA ? coluna(B, x, medido.junta.pe - 24, medido.junta.pe + 24) : 'fora da janela';

    await comTinta.pagina.close();
    await semTinta.pagina.close();
    saida[largura][modo] = medido;
  }
}

await navegador.close();

const arquivo = `${MEDIDAS}/medicao-${LARGURAS.join('-')}.json`;
await writeFile(arquivo, `${JSON.stringify(saida, null, 2)}\n`, 'utf8');

/* No terminal fica só o veredito; o número inteiro está no arquivo. */
for (const largura of LARGURAS) {
  for (const modo of MODOS) {
    const m = saida[largura][modo];
    const c = m['#contraste'];
    const linha = ['h2', 'paragrafo', 'forte']
      .map((k) => (c[k] ? `${k} ${c[k].razao}:1 (piso ${c[k].piso}, ${c[k].passa ? 'passa' : 'REPROVA'})` : `${k} —`))
      .join(' · ');
    console.log(`${largura} ${modo}: ${linha}`);
    console.log(
      `${' '.repeat(String(largura).length)} verbatim h2=${m['#verbatim'].h2} paragrafo=${m['#verbatim'].paragrafo}` +
        ` · foco ${m.foto?.objectPosition ?? '—'} · janela x ${m.foto?.janela.x0}–${m.foto?.janela.x1}` +
        ` y ${m.foto?.janela.y0}–${m.foto?.janela.y1}`,
    );
  }
}
console.log(`\nmedição completa: ${arquivo}`);
