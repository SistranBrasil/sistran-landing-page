/* SIS-286 — mede as SEIS capas de `/solucoes/[slug]` no padrão `HeroImageBackdrop`.
   (O escopo foi ampliado de uma para quatro em 18/09 e para seis em 21/09, no terceiro
   corpo do mesmo identificador, que nomeia as artes do Match AI e do FAST. Esta sonda
   cresceu em vez de ganhar uma irmã porque o que ela mede é o arquivo de CSS inteiro:
   capa nova no mesmo `globals.css` pode desfazer o recorte das anteriores, e só medir
   as seis juntas prova que não desfez — foi assim que apareceu, no bloco do Match AI,
   uma `@media` perdendo para a regra de tela larga por ordem de fonte.)

   Irmão de `medir-capa-smart-miner-sis286.mjs`, que ficou como está por ser o que
   sustenta o comentário já publicado na issue para o Smart Miner. Aqui o mesmo
   procedimento roda nas seis rotas de uma vez — e a do Smart Miner é remedida
   junto de propósito: os números dela foram tirados quando ela era a única capa, e
   valem só se continuarem valendo depois de cinco blocos de CSS novos entrarem no
   mesmo arquivo.

   O que cada leitura prova, e por que é esta:

   • A MÍDIA SERVIDA é a derivada WebP, não o PNG. Com `images.unoptimized` ligado o
     `next/image` entrega o arquivo do disco byte a byte, então o que a pessoa baixa
     se lê na resposta de rede — não no atributo `src`.
   • O `object-position` COMPUTADO em 1440 e em 390. Cada rota tem o valor num bloco
     escopado com uma `@media` no meio; ler a folha não prova que a regra venceu o
     véu base da SIS-94. O computado prova.
   • O LETREIRO de cada arte, geometricamente. É o item 3, e é a única leitura em que
     o binário não basta: o que a issue recusa é o MEIO-TERMO — letreiro cortado pela
     metade. Converto a caixa renderizada de volta para coordenadas do arquivo e digo
     com número se a caixa entra inteira, fica inteiramente fora, ou está cortada.
     No Guru entram TRÊS caixas, porque a issue nomeia duas coisas a não cortar (o
     turbante e o Echo) e o letreiro é a terceira pela mesma regra; no Match AI
     também três, porque ali o assunto é um conjunto de três peças — pessoa, prisma
     e placa — e cortar qualquer uma seria o mesmo meio-termo; no FAST entram duas,
     a cápsula e as letras dentro dela, porque cápsula inteira com letra cortada não
     é uma leitura que a fração do objeto maior detecte.
   • O CONTRASTE do `h1` e do lead pelo método da casa (SIS-192): duas abas iguais,
     uma com a tinta e outra sem, o pixel de fundo lido da SEM. Reporto os dois
     números — `piorCorpo` (cobertura ≥ 0,6) e `piorTudo` (pior pixel, franja de
     antialiasing inclusa) — porque o raster sozinho condena texto pequeno por franja
     e não pode ser o veredito. Piso 4,5:1.
   • A OUTRA SLUG sem `.hero-backdrop` nenhum. É o item 4, e a prova é a
     ausência do nó.

   Uso: node scripts/medir-capas-solucoes-sis286.mjs  (dev server em :3000) */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const EXEC =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const BASE = 'http://localhost:3000';
const CAPTURAS = 'docs/capturas';

/* As seis artes têm as MESMAS dimensões (conferido nos otimizadores: 1672x941), o
   que é a razão de a geometria do recorte poder ser calculada com uma constante só. */
const ARTE = { w: 1672, h: 941 };

/* Caixas em coordenadas do ARQUIVO, medidas por perfil de coluna/linha de pixel
   quase branco (limiar 246, mais de 3 px por linha) em região apertada. A varredura
   larga não serve: ela pega moldura de tablet, brilho de tela e luz de cidade, e
   devolve valores presos às bordas da região. O caso do anel do QA não se isolou
   nem assim (as luzes da janela do escritório são azul-ciano como o anel) — ali o
   limite saiu de candidatos renderizados com `sharp.extract` e olhados. */
const CAPAS = [
  {
    slug: 'smart-miner',
    /* letras em y 130..190 / x 965..1372; com o selo o lockup fecha em y≈237 */
    manter: [{ nome: 'lockup «Smart Miner»', x0: 965, y0: 76, x1: 1372, y1: 237 }],
  },
  {
    slug: 'qa-integrado',
    manter: [{ nome: 'selo «QA Integrado»', x0: 969, y0: 271, x1: 1204, y1: 348 }],
  },
  {
    slug: 'connect-api',
    manter: [{ nome: 'hub «Connect API»', x0: 931, y0: 414, x1: 1219, y1: 475 }],
  },
  {
    slug: 'guru-de-seguros',
    /* Três alvos, porque a issue nomeia duas coisas a não cortar (turbante e Echo) e
       o letreiro é a terceira pela mesma regra das outras rotas. As caixas foram
       medidas uma a uma, e a primeira leitura estava ERRADA nas duas que importam —
       fica registrado porque foi o que mudou a conclusão:
       • «turbante» não é o topo do letreiro: é a figura acesa em forma de turbante
         ACIMA dele. Varredura de azul aceso (b>200, b−r>90, g>110) restrita a
         x 870..1180 dá a primeira linha em y=38.
       • o Echo não está na borda direita (ali está a pessoa de terno, que a varredura
         por silhueta escura confundia com ele): o aparelho vive em x 1192..1382,
         y 600..815, medido em recorte renderizado e olhado. */
    manter: [
      { nome: 'turbante aceso', x0: 865, y0: 38, x1: 1155, y1: 280 },
      { nome: 'letreiro «Guru de Seguros»', x0: 905, y0: 280, x1: 1121, y1: 383 },
      /* `toleraCorte` não é afrouxamento do critério: é o registro de uma
         IMPOSSIBILIDADE medida. O turbante começa em y=38 e o pé do Echo termina em
         y=815; a janela de tela larga tem 773 linhas, então as duas pontas distam 777
         — quatro linhas mais do que cabe, em qualquer Y. O Y que salva o turbante
         (15%, janela y 25..798) deixa 17 linhas do pé do Echo de fora: 0,92 do objeto.
         Entre perder o ápice do turbante e perder a sombra da base do aparelho, é a
         base. Sem a exceção declarada aqui, o portão desta sonda seria impossível de
         passar e a próxima pessoa o afrouxaria inteiro para fazê-lo verde. */
      {
        nome: 'Echo',
        x0: 1192,
        y0: 600,
        x1: 1382,
        y1: 815,
        toleraCorte: 'pé do aparelho: a arte é 4 linhas mais alta que a janela (ver CSS)',
      },
    ],
  },
  {
    slug: 'match-ai',
    /* QUATRO alvos, e nenhum deles saiu de varredura: a cromagem do pódio é tão branca
       quanto as letras da placa, e a varredura devolvia bordas de região — o mesmo
       engano do anel do QA. As caixas saíram de recorte `sharp.extract` olhado.
       O TABLET entrou na lista depois, quando o corpo da issue ficou legível e se leu
       nele «não cortar hub/tablet». Enquanto ele não era alvo, a sonda dava verde com um
       recorte que partia o tablet ao meio — é o exemplo mais limpo de que portão só
       prova o que lhe foi dado para provar. */
    manter: [
      { nome: 'prisma central', x0: 873, y0: 200, x1: 1152, y1: 455 },
      { nome: 'placa «MATCH AI»', x0: 877, y0: 450, x1: 1145, y1: 507 },
      { nome: 'tablet', x0: 915, y0: 755, x1: 1330, y1: 860 },
      /* Mesma natureza do `toleraCorte` do Echo: IMPOSSIBILIDADE medida, não critério
         afrouxado. Pessoa (x 558) e tablet (até x 1330) distam 772 colunas e a janela de
         390 tem 734 — 38 a menos, em qualquer X. Com o tablet protegido pela issue, a
         pessoa é a que cede; a alternativa (X≈93%) a tiraria inteira do quadro mas
         passaria a fatiar o cubo de vidro, trocando um corte por outro. Derivação
         completa no `.hero-backdrop--match-ai` da `@media` no globals.css. */
      {
        nome: 'pessoa com a pilha de perfis',
        x0: 558,
        y0: 105,
        x1: 855,
        y1: 475,
        toleraCorte: 'borda esquerda a 390: pessoa e tablet distam 38 colunas mais do que cabe (ver CSS)',
      },
    ],
  },
  {
    slug: 'fast',
    /* TRÊS caixas, todas de recorte `sharp.extract` olhado e não de varredura — a
       cromagem da cápsula é do mesmo branco das letras dentro dela. Cápsula e letras
       entram separadas porque cápsula inteira com letra cortada não é leitura que a
       fração do objeto maior detecte; o TABLET entra porque o corpo da issue, quando
       ficou legível, diz «não cortar o hub nem o tablet» — mesma correção feita na
       rota do Match AI.
       O leque de cartões do topo NÃO entra como alvo, e é decisão, não esquecimento:
       ele atravessa a arte de x≈730 a x≈1560 e nenhuma janela de 734 colunas o contém,
       então exigi-lo inteiro a 390 seria um portão impossível de passar. E ele TAMBÉM
       não sobrevive em tela larga: a primeira linha do cartão mais alto está em y≈58 e
       a base do tablet em y≈885 — 827 linhas para uma janela de 773. Uma das duas
       pontas tem de sair, e quem escolhe é a issue, que protege o hub e o tablet e não
       protege as vinhetas do topo. Por isso o Y é 72% e não os 15% de antes: aos 15% o
       leque entrava inteiro e o tablet saía partido, que é exatamente o meio-termo
       recusado. A derivação está no `.hero-backdrop--fast` do globals.css. */
    manter: [
      { nome: 'cápsula «FAST»', x0: 743, y0: 279, x1: 1059, y1: 474 },
      { nome: 'letras «FAST»', x0: 818, y0: 362, x1: 1032, y1: 437 },
      { nome: 'tablet', x0: 972, y0: 652, x1: 1430, y1: 885 },
    ],
  },
];

/* Item 4 — só esta UMA fica sem capa, e é a lista inteira do que precisa estar
   intacto. (Quando a issue pedia uma capa, esta lista tinha seis; com quatro, três; o
   `match-ai` e o `fast` saíram dela em 21/09, quando as artes dos dois chegaram.) */
const SEM_CAPA = ['lumina-ai'];

mkdirSync(CAPTURAS, { recursive: true });
const navegador = await chromium.launch({ executablePath: EXEC });

async function abrir(rota, largura, altura, { semTinta = null } = {}) {
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
    if (/\.webp|\.png/.test(u)) {
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
    /* APAGAR A TINTA, não esconder o bloco: `display:none` mudaria o layout, e a
       comparação pixel a pixel exige as duas abas com a MESMA geometria. Cor
       transparente deixa o fundo (véu + arte) exatamente onde estava. */
    const raiz = `.hero-backdrop--${semTinta} .pagehero-entrada`;
    await p.addStyleTag({
      content:
        [`${raiz} h1`, `${raiz} h1 *`, `${raiz} p`, `${raiz} p *`].join(',') +
        '{color:transparent!important;text-shadow:none!important;-webkit-text-fill-color:transparent!important}',
    });
  }
  await p.waitForTimeout(1200);
  return { ctx, p, rede };
}

const LER = (slug) => {
  const bd = document.querySelector(`.hero-backdrop--${slug}`);
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
    veu: veu ? { background: getComputedStyle(veu).backgroundImage.slice(0, 300) } : null,
    h1: { caixa: caixa(h1), texto: h1?.textContent ?? null },
    lead: { caixa: caixa(lead) },
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
/* A tinta do título é branca opaca; a do lead é branca a 85% SOBRE o fundo. Compor é
   o que dá a cor real da letra cheia naquele pixel — sem isso o lead seria medido
   como branco puro e o número sairia otimista. */
const compor = (tinta, alfa, fundo) => tinta.map((c, i) => c * alfa + fundo[i] * (1 - alfa));
const CORPO = 0.6;

function contraste(A, B, caixa, tinta, alfa) {
  const reg = { piorCorpo: null, piorTudo: null, pixels: 0, pixelsCorpo: 0 };
  if (!caixa) return reg;
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
/* Converte a caixa renderizada de volta para coordenadas do ARQUIVO: é a única forma
   de responder «o letreiro entrou inteiro?» com número em vez de olho. */
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

function preservada(j, alvo) {
  const { x0, y0, x1, y1 } = j.janela;
  const interX = Math.max(0, Math.min(x1, alvo.x1) - Math.max(x0, alvo.x0));
  const interY = Math.max(0, Math.min(y1, alvo.y1) - Math.max(y0, alvo.y0));
  const fracao = (interX * interY) / ((alvo.x1 - alvo.x0) * (alvo.y1 - alvo.y0));
  return {
    nome: alvo.nome,
    fracaoVisivel: Math.round(fracao * 1000) / 1000,
    toleraCorte: alvo.toleraCorte ?? null,
    /* O meio-termo é o que a issue proíbe: qualquer valor entre 0,02 e 0,98 é
       letreiro cortado — inteiro ou fora, nada no meio. */
    veredito: fracao >= 0.98 ? 'inteiro' : fracao <= 0.02 ? 'fora do quadro' : 'CORTADO',
  };
}

const saida = { issue: 'SIS-286', capas: {}, capturas: [] };

for (const { slug, manter } of CAPAS) {
  const rota = `/solucoes/${slug}`;
  saida.capas[slug] = { rota };

  for (const [rotulo, largura, altura] of [
    ['a1440', 1440, 900],
    ['a390', 390, 844],
  ]) {
    const comTinta = await abrir(rota, largura, altura);
    const semTinta = await abrir(rota, largura, altura, { semTinta: slug });

    const l = await comTinta.p.evaluate(LER, slug);
    const j = janelaDaArte(l.img.caixa, l.img.objectPosition);

    const [a, b] = await Promise.all([comTinta.p.screenshot(), semTinta.p.screenshot()]);
    const [A, B] = await Promise.all(
      [a, b].map((buf) => sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })),
    );

    /* Item 7 — as capturas 390/1440 das seis rotas. */
    const arq = `${CAPTURAS}/sis286-${slug}-${largura}.png`;
    await comTinta.p.screenshot({ path: arq });
    saida.capturas.push(arq);

    saida.capas[slug][rotulo] = {
      ...l,
      recorte: j,
      preservar: manter.map((alvo) => preservada(j, alvo)),
      contraste: {
        h1: contraste(A, B, l.h1.caixa, [255, 255, 255], 1),
        lead: contraste(A, B, l.lead.caixa, [255, 255, 255], 0.85),
      },
      rede: comTinta.rede,
    };
    await comTinta.ctx.close();
    await semTinta.ctx.close();
  }
}

/* Item 4 — a que fica sem capa nenhuma. */
saida.semCapa = {};
for (const slug of SEM_CAPA) {
  const { ctx, p } = await abrir(`/solucoes/${slug}`, 1440, 900);
  saida.semCapa[slug] = await p.evaluate(() => ({
    heroBackdrop: document.querySelectorAll('[class*="hero-backdrop"]').length,
    imagensNaAbertura: document.querySelectorAll('.pagehero-entrada img, header img').length,
    h1: document.querySelector('h1')?.textContent ?? null,
  }));
  await ctx.close();
}
saida.semCapaIntactas = Object.values(saida.semCapa).every((o) => o.heroBackdrop === 0);

const piso = 4.5;
saida.veredito = {
  pisoContraste: piso,
  porRota: Object.fromEntries(
    CAPAS.map(({ slug }) => {
      const c = saida.capas[slug];
      const r = (larg) => ({
        h1: c[larg].contraste.h1.piorCorpo?.razao ?? null,
        lead: c[larg].contraste.lead.piorCorpo?.razao ?? null,
        preservar: c[larg].preservar,
        objectPosition: c[larg].img.objectPosition,
        servido: c[larg].img.currentSrc,
      });
      return [slug, { a1440: r('a1440'), a390: r('a390') }];
    }),
  ),
  semCapaIntactas: saida.semCapaIntactas,
};
/* O binário que interessa: nenhuma leitura de corpo abaixo do piso e nenhum alvo com
   veredito CORTADO em nenhuma das duas larguras — exceto os que declaram
   `toleraCorte`, que saem listados abaixo para que a exceção seja visível em vez de
   embutida no verdadeiro. */
const alvos = Object.values(saida.veredito.porRota).flatMap((r) =>
  [r.a1440, r.a390].flatMap((m) => m.preservar),
);
saida.veredito.cortesTolerados = alvos
  .filter((p) => p.veredito === 'CORTADO' && p.toleraCorte)
  .map((p) => `${p.nome}: ${p.fracaoVisivel} — ${p.toleraCorte}`);
saida.veredito.tudoAcimaDoPiso = Object.values(saida.veredito.porRota).every((r) =>
  [r.a1440, r.a390].every(
    (m) =>
      m.h1 !== null &&
      m.lead !== null &&
      m.h1 >= piso &&
      m.lead >= piso &&
      m.preservar.every((p) => p.veredito !== 'CORTADO' || p.toleraCorte),
  ),
);

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
