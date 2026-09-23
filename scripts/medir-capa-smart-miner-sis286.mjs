/* SIS-286 — mede a capa de `/solucoes/smart-miner` no padrão `HeroImageBackdrop`.
   (Segundo corpo do identificador: o primeiro foi o «Fale com a Gente!», já Done.)

   O que cada leitura prova, e por que é esta:

   • A MÍDIA SERVIDA é a derivada WebP, e não o PNG. Com `images.unoptimized`
     ligado, `next/image` entrega o arquivo do disco byte a byte — então a única
     forma de saber o que a pessoa baixa é olhar a resposta de rede e o peso
     transferido, não o `src` do atributo.
   • O `object-position` COMPUTADO em 1440 e em 390. O valor está num bloco
     escopado (`.hero-backdrop--smart-miner`) com uma `@media` no meio; ler a folha
     de estilo não prova que a regra venceu o véu base da SIS-94. O computado prova.
   • O LOCKUP «Smart Miner», geometricamente. É o item 3, e a única leitura em que
     o binário não basta: o que não se pode aceitar é o MEIO-TERMO (letreiro
     cortado pela metade). Então converto a caixa renderizada de volta para
     coordenadas do arquivo e digo, com número, se a faixa y 76–237 entra inteira
     (desktop) ou se a coluna x≥965 fica inteiramente fora (390).
   • O CONTRASTE do `h1` e do lead pelo método da casa (SIS-192): duas abas iguais,
     uma com a tinta e outra sem, e o pixel de fundo lido da SEM. Reporto os dois
     números — `piorCorpo` (corpo da letra, cobertura ≥ 0,6) e `piorTudo` (pior
     pixel do recorte, franja de antialiasing inclusa) — porque o raster sozinho
     condena texto pequeno por franja e não pode ser o veredito (ver
     `medir-contraste-hero-pitch.mjs`). Piso 4,5:1.
   • AS OUTRAS SEIS SLUGS sem `.hero-backdrop` nenhum. É o item 4, e a prova é a
     ausência do nó — não do arquivo de imagem.

   Uso: node scripts/medir-capa-smart-miner-sis286.mjs  (dev server em :3000) */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const EXEC =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const BASE = 'http://localhost:3000';
const CAPTURAS = 'docs/capturas';
const ROTA = '/solucoes/smart-miner';

/* Geometria do ARQUIVO, medida na varredura de pixels claros restrita a
   x 880–1672 (a varredura do terço superior inteiro pegava a moldura do tablet e o
   brilho, não o letreiro): o ícone/letras do lockup começam em y≈76, as palavras
   ficam em y 130–190 / x 965–1372, e o lockup com o selo termina perto de y≈237. */
const ARTE = { w: 1672, h: 941 };
const LOCKUP = { x0: 965, y0: 76, x1: 1372, y1: 237 };

const OUTRAS = [
  'match-ai',
  'lumina-ai',
  'fast',
  'qa-integrado',
  'connect-api',
  'guru-de-seguros',
];

mkdirSync(CAPTURAS, { recursive: true });
const navegador = await chromium.launch({ executablePath: EXEC });

async function abrir(rota, largura, altura, { semTinta = false } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const p = await ctx.newPage();
  const rede = [];
  p.on('response', async (r) => {
    const u = r.url();
    if (/smart-min|\.webp|\.png/.test(u)) {
      let bytes = null;
      try {
        bytes = (await r.body()).length;
      } catch {
        /* resposta já descartada — o peso do cabeçalho ainda serve */
      }
      rede.push({
        url: u.replace(BASE, ''),
        status: r.status(),
        tipo: r.headers()['content-type'] ?? null,
        bytes: bytes ?? (Number(r.headers()['content-length'] ?? 0) || null),
      });
    }
  });
  await p.goto(BASE + rota, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 20000 }).catch(() => {});
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  if (semTinta) {
    /* APAGAR A TINTA, não esconder o bloco: `visibility:hidden` mudaria o layout de
       nada, mas `display:none` mudaria, e a comparação pixel a pixel exige as duas
       abas com a MESMA geometria. Cor transparente deixa o fundo (véu + arte)
       exatamente onde estava. */
    await p.addStyleTag({
      content:
        '.hero-backdrop--smart-miner .pagehero-entrada h1,' +
        '.hero-backdrop--smart-miner .pagehero-entrada h1 *,' +
        '.hero-backdrop--smart-miner .pagehero-entrada p,' +
        '.hero-backdrop--smart-miner .pagehero-entrada p *' +
        '{color:transparent!important;text-shadow:none!important;-webkit-text-fill-color:transparent!important}',
    });
  }
  await p.waitForTimeout(1200);
  return { ctx, p, rede };
}

const LER = () => {
  const bd = document.querySelector('.hero-backdrop--smart-miner');
  const img = bd?.querySelector('img');
  const veu = bd?.querySelector('.hero-backdrop-veu');
  const h1 = bd?.querySelector('h1');
  const lead = bd?.querySelector('.pagehero-entrada p');
  const caixa = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x),
      y: Math.round(r.y),
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  };
  const estilo = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    return { cor: s.color, px: parseFloat(s.fontSize), peso: s.fontWeight };
  };
  return {
    montou: Boolean(bd),
    img: img
      ? {
          src: img.getAttribute('src'),
          currentSrc: img.currentSrc?.replace(location.origin, '') ?? null,
          natural: [img.naturalWidth, img.naturalHeight],
          objectFit: getComputedStyle(img).objectFit,
          objectPosition: getComputedStyle(img).objectPosition,
          fetchPriority: img.fetchPriority,
          alt: img.getAttribute('alt'),
          decorativa: img.getAttribute('alt') === '',
          caixa: caixa(img),
        }
      : null,
    veu: veu ? { background: getComputedStyle(veu).backgroundImage.slice(0, 260) } : null,
    h1: { caixa: caixa(h1), ...estilo(h1), texto: h1?.textContent ?? null },
    lead: { caixa: caixa(lead), ...estilo(lead) },
    /* O `<h1>` já nomeia o produto — é o que sustenta o `alt=""`. */
    tituloNomeiaOProduto: /smart\s*miner/i.test(h1?.textContent ?? ''),
  };
};

/* --- contraste, método SIS-192 ------------------------------------------- */
const canal = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
/* A tinta do título é branca opaca; a do lead é branca a 85% sobre o fundo. Compor
   é o que dá a cor REAL da letra cheia naquele pixel — sem isso o lead seria
   medido como se fosse branco puro, e o número sairia otimista. */
const compor = (tinta, alfa, fundo) => tinta.map((c, i) => c * alfa + fundo[i] * (1 - alfa));
const CORPO = 0.6;

function contraste(A, B, caixa, tinta, alfa) {
  const reg = { piorCorpo: null, piorTudo: null, pixels: 0, pixelsCorpo: 0 };
  const x1 = Math.min(caixa.x + caixa.w, A.info.width);
  const y1 = Math.min(caixa.y + caixa.h, A.info.height);
  for (let py = Math.max(0, caixa.y); py < y1; py += 1) {
    for (let px = Math.max(0, caixa.x); px < x1; px += 1) {
      const i = (py * A.info.width + px) * A.info.channels;
      const com = [A.data[i], A.data[i + 1], A.data[i + 2]];
      const bg = [B.data[i], B.data[i + 1], B.data[i + 2]];
      const mudou =
        Math.abs(com[0] - bg[0]) + Math.abs(com[1] - bg[1]) + Math.abs(com[2] - bg[2]);
      if (mudou < 12) continue; // não é letra: vão ou fundo parado
      const cheia = compor(tinta, alfa, bg);
      const total =
        Math.abs(cheia[0] - bg[0]) + Math.abs(cheia[1] - bg[1]) + Math.abs(cheia[2] - bg[2]);
      const cobertura = total > 0 ? Math.min(1, mudou / total) : 1;
      const r = razao(cheia, bg);
      const cand = {
        razao: Math.round(r * 100) / 100,
        fundo: bg,
        cobertura: Math.round(cobertura * 100) / 100,
        em: { x: px, y: py },
      };
      reg.pixels += 1;
      if (reg.piorTudo === null || r < reg.piorTudo.razao) reg.piorTudo = cand;
      if (cobertura >= CORPO) {
        reg.pixelsCorpo += 1;
        if (reg.piorCorpo === null || r < reg.piorCorpo.razao) reg.piorCorpo = cand;
      }
    }
  }
  return reg;
}

/* --- geometria do recorte ------------------------------------------------- */
/* Converte a caixa renderizada de volta para coordenadas do ARQUIVO: é a única
   forma de responder «o lockup entrou inteiro?» com número em vez de olho. */
function janelaDaArte(caixa, objectPosition) {
  const [pxStr, pyStr] = objectPosition.split(/\s+/);
  const fx = parseFloat(pxStr) / 100;
  const fy = parseFloat(pyStr) / 100;
  const escala = Math.max(caixa.w / ARTE.w, caixa.h / ARTE.h); // cover
  const visivelW = caixa.w / escala;
  const visivelH = caixa.h / escala;
  const sobraX = ARTE.w - visivelW;
  const sobraY = ARTE.h - visivelH;
  const x0 = sobraX * fx;
  const y0 = sobraY * fy;
  return {
    escala: Math.round(escala * 1000) / 1000,
    visivel: { w: Math.round(visivelW), h: Math.round(visivelH) },
    sobra: { x: Math.round(sobraX), y: Math.round(sobraY) },
    janela: {
      x0: Math.round(x0),
      y0: Math.round(y0),
      x1: Math.round(x0 + visivelW),
      y1: Math.round(y0 + visivelH),
    },
  };
}

function lockup(j) {
  const { x0, y0, x1, y1 } = j.janela;
  const interX = Math.max(0, Math.min(x1, LOCKUP.x1) - Math.max(x0, LOCKUP.x0));
  const interY = Math.max(0, Math.min(y1, LOCKUP.y1) - Math.max(y0, LOCKUP.y0));
  const area = interX * interY;
  const total = (LOCKUP.x1 - LOCKUP.x0) * (LOCKUP.y1 - LOCKUP.y0);
  const fracao = area / total;
  return {
    fracaoVisivel: Math.round(fracao * 1000) / 1000,
    /* O meio-termo é o que a issue proíbe: qualquer valor entre 0,02 e 0,98 é
       letreiro cortado — inteiro ou fora, nada no meio. */
    veredito: fracao >= 0.98 ? 'inteiro' : fracao <= 0.02 ? 'fora do quadro' : 'CORTADO',
  };
}

const saida = { issue: 'SIS-286', rota: ROTA, capturas: [] };

for (const [rotulo, largura, altura] of [
  ['a1440', 1440, 900],
  ['a390', 390, 844],
]) {
  const comTinta = await abrir(ROTA, largura, altura);
  const semTinta = await abrir(ROTA, largura, altura, { semTinta: true });

  const l = await comTinta.p.evaluate(LER);
  const j = janelaDaArte(l.img.caixa, l.img.objectPosition);

  const [a, b] = await Promise.all([
    comTinta.p.screenshot(),
    semTinta.p.screenshot(),
  ]);
  const [A, B] = await Promise.all(
    [a, b].map((buf) => sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })),
  );

  const arq = `${CAPTURAS}/sis286-capa-${largura}.png`;
  await comTinta.p.screenshot({ path: arq });
  saida.capturas.push(arq);

  saida[rotulo] = {
    ...l,
    recorte: j,
    lockup: lockup(j),
    /* O lead é `text-white/85`: alfa 0,85 na composição. O h1 é branco opaco. */
    contraste: {
      h1: contraste(A, B, l.h1.caixa, [255, 255, 255], 1),
      lead: contraste(A, B, l.lead.caixa, [255, 255, 255], 0.85),
    },
    rede: comTinta.rede,
  };
  await comTinta.ctx.close();
  await semTinta.ctx.close();
}

/* Item 4 — as outras seis sem capa nenhuma. */
saida.outrasSeis = {};
for (const slug of OUTRAS) {
  const { ctx, p } = await abrir(`/solucoes/${slug}`, 1440, 900);
  saida.outrasSeis[slug] = await p.evaluate(() => ({
    heroBackdrop: document.querySelectorAll('[class*="hero-backdrop"]').length,
    imagensNaAbertura: document.querySelectorAll('.pagehero-entrada img, header img').length,
    h1: document.querySelector('h1')?.textContent ?? null,
  }));
  await ctx.close();
}
saida.outrasSeisIntactas = Object.values(saida.outrasSeis).every((o) => o.heroBackdrop === 0);

const piso = 4.5;
saida.veredito = {
  pisoContraste: piso,
  h1_1440: saida.a1440.contraste.h1.piorCorpo?.razao,
  lead_1440: saida.a1440.contraste.lead.piorCorpo?.razao,
  h1_390: saida.a390.contraste.h1.piorCorpo?.razao,
  lead_390: saida.a390.contraste.lead.piorCorpo?.razao,
  lockup1440: saida.a1440.lockup.veredito,
  lockup390: saida.a390.lockup.veredito,
  outrasSeisIntactas: saida.outrasSeisIntactas,
};

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
