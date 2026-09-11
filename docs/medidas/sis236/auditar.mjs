/* SIS-236 — PROVA: a tarja azul clara da junta hero → `#parceiros` sumiu, a capa
 * continua legível e nenhuma outra emenda da rota ganhou listra no lugar.
 *
 * O DIAGNÓSTICO que apontou o culpado está em `diagnostico.mjs`, ao lado: na
 * coluna x=8 a 1440 o pé do hero morre em y=666 e `#parceiros` abria em y=722,
 * com 56px de `body` (`#1273bc`) no meio — os `mt-14` da montagem. A faixa lia em
 * DEGRADÊ (`#1b81c7` → `#4d9bd2`) porque a sombra da SIS-93 da variante
 * `section-light-blue` clareia de baixo para cima o que estiver acima da borda.
 *
 * ── COMO O "ANTES" É PRODUZIDO ──────────────────────────────────────────────
 * O código não é revertido. A sonda injeta, só naquela aba, `margin-top: 3.5rem`
 * em `#parceiros` — que é exatamente o que `mt-14` escrevia. É o mesmo recurso da
 * sonda da SIS-218 nesta rota, e ele é fiel aqui porque a mudança desta issue É
 * uma linha de margem: não há JavaScript nem outra regra envolvida.
 *
 * ── CRITÉRIO 1 · COMO A TARJA É MEDIDA, e por que não basta "achar azul" ────
 * Atravessar navy até azul-claro passa por tons médios por obrigação — o que
 * denuncia a TARJA não é a luminância intermediária, é a SATURAÇÃO. Os tons em
 * jogo, em HSL:
 *   · pé do hero   `#092347`  L 0,16  S 0,78  (escuro)
 *   · tarja        `#1b81c7`  L 0,44  S 0,76  (médio E saturado)  ← o alvo
 *   · emenda certa  ~rgb(107,128,152)  L 0,51  S 0,17  (a sombra da SIS-93
 *     composta sobre o navy: azul acinzentado, dessaturado)
 *   · seção        `#dfeffa`  L 0,93  S 0,71  (claro)
 * Daí o critério: linha "de tarja" é a que tem luminância de 0,30 a 0,65 E
 * saturação acima de 0,40. A emenda dissolvida pela sombra não dispara; a faixa
 * do body dispara em todas as suas linhas.
 *
 * ── CRITÉRIO 2 · LEGIBILIDADE DA CAPA, e o instrumento que foi DESCARTADO ───
 * A primeira volta desta sonda comparava as duas capturas do topo pixel a pixel,
 * apostando que "o hero não foi tocado" se traduziria em imagens idênticas. Não
 * se traduz, e a razão é boa: a abertura tem animação PERPÉTUA (o degradê do
 * destaque), então dois quadros da MESMA aba nunca chegam a ser iguais — a
 * espera por estabilidade estourou as 40 tentativas nas quatro abas. Igualdade
 * de pixel é o instrumento errado para uma cena que se move.
 *
 * No lugar entram as duas medidas que respondem à pergunta de verdade:
 *   a) CONTRASTE dos cinco trechos de escrita, antes e depois, pelo método de
 *      `docs/medidas/COMO-MEDIR-CONTRASTE.md` — o mesmo de
 *      `scripts/medir-contraste-abertura-parceiros-sis225.mjs`, com os mesmos
 *      seletores, tintas e pisos. O que se cobra é NÃO-REGRESSÃO (a issue diz
 *      "continua legível"); o valor absoluto contra o piso sai ao lado, e uma
 *      reprovação que já existia no "antes" é relatada como dívida herdada, não
 *      creditada a esta mudança.
 *   b) ALCANCE DA SOMBRA contra o pé da escrita. A única coisa nova que toca o
 *      hero é a sombra da SIS-93 sangrando para cima a partir da borda da seção
 *      (54px de desfoque + 18px de espalhamento = 72px). Se o pé do último
 *      parágrafo está acima disso, nenhum pixel de texto muda — e aí a alínea (a)
 *      tem de dar empate, que é o cruzamento que fecha o argumento.
 *
 * Uso:  node docs/medidas/sis236/auditar.mjs
 *       SIS236_BASE_URL=http://localhost:3999 node docs/medidas/sis236/auditar.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const baseURL = process.env.SIS236_BASE_URL ?? 'http://localhost:3000';
const route = `${baseURL}/parceiros-e-implementacoes`;
const DIR = 'docs/medidas/sis236';
const COLUNA_X = 8;
const CSS_ANTES = '#parceiros { margin-top: 3.5rem !important; }';
/* 54px de desfoque + 18px de espalhamento, de `.section-light.section-light-blue`. */
const ALCANCE_SOMBRA = 72;

const VIEWPORTS = [
  { nome: '1440', width: 1440, height: 900 },
  { nome: '390', width: 390, height: 844 },
];

const RAIZ = '.hero-backdrop--parceiros .pagehero-entrada';
const BRANCO = { r: 255, g: 255, b: 255 };
const CIANO = { r: 0xa5, g: 0xf0, b: 0xff };
/* Os mesmos cinco trechos, tintas e pisos da sonda da SIS-225 — a abertura não
   mudou de estrutura, então mudar a régua aqui seria medir outra coisa. */
const TRECHOS = [
  { rotulo: 'eyebrow', sel: `${RAIZ} .eyebrow`, tinta: CIANO, alfa: 1, minimo: 4.5 },
  { rotulo: 'titulo branco', sel: `${RAIZ} h1`, tinta: BRANCO, alfa: 1, minimo: 3 },
  { rotulo: 'destaque ciano', sel: `${RAIZ} h1 span`, tinta: CIANO, alfa: 1, minimo: 3 },
  { rotulo: 'descricao p1', sel: `${RAIZ} h1 + div p:first-child`, tinta: BRANCO, alfa: 0.85, minimo: 4.5 },
  { rotulo: 'descricao p2', sel: `${RAIZ} h1 + div p:last-child`, tinta: BRANCO, alfa: 0.85, minimo: 4.5 },
];

const falhas = [];
const capturas = [];
function assert(condicao, mensagem) {
  if (!condicao) falhas.push(mensagem);
  return Boolean(condicao);
}

const hex = ([r, g, b]) => `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;

function hsl([r, g, b]) {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const d = max - min;
  return { l, s: d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)) };
}

/* A assinatura da tarja: médio de luminância E saturado. Ver o cabeçalho. */
const ehTarja = (rgb) => {
  const { l, s } = hsl(rgb);
  return l >= 0.3 && l <= 0.65 && s >= 0.4;
};

const luminancia = ({ r, g, b }) => {
  const c = [r, g, b].map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const razao = (a, b) => {
  const [x, y] = [luminancia(a) + 0.05, luminancia(b) + 0.05];
  return x > y ? x / y : y / x;
};
/* Tinta translúcida composta sobre o fundo medido — o que o olho recebe. */
const compor = (tinta, fundo, alfa) => ({
  r: tinta.r * alfa + fundo.r * (1 - alfa),
  g: tinta.g * alfa + fundo.g * (1 - alfa),
  b: tinta.b * alfa + fundo.b * (1 - alfa),
});

async function rolarPara(page, y) {
  await page.evaluate((alvo) => {
    if (window.__lenis?.scrollTo) window.__lenis.scrollTo(alvo, { immediate: true, force: true });
    else window.scrollTo(0, alvo);
  }, y);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));
  await page.waitForTimeout(200);
}

async function abrir(browser, viewport, { antes = false } = {}) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  await context.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  if (antes) {
    await context.addInitScript((css) => {
      addEventListener('DOMContentLoaded', () => {
        const folha = document.createElement('style');
        folha.dataset.sis236 = 'override-antes';
        folha.textContent = css;
        document.head.append(folha);
      });
    }, CSS_ANTES);
  }
  const page = await context.newPage();
  await page.goto(route, { waitUntil: 'networkidle' });
  /* Espera longa pela mesma razão da sonda da SIS-225: a entrada tem animação de
     aparição e no `next dev` a capa ainda está sendo baixada no primeiro acesso.
     Medir antes disso mede o navy da base da mídia, não a capa. */
  await page.waitForSelector(`${RAIZ} h1`, { timeout: 180_000 });
  await page.waitForTimeout(3000);
  return { context, page };
}

const geometria = (page) =>
  page.evaluate(
    ({ raiz }) => {
      const caixa = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { topo: Math.round(r.top + scrollY), base: Math.round(r.bottom + scrollY) };
      };
      const escritas = [...document.querySelectorAll(`${raiz} .eyebrow, ${raiz} h1, ${raiz} h1 + div p`)];
      return {
        hero: caixa('.hero-backdrop--parceiros'),
        parceiros: caixa('#parceiros'),
        implementacoes: caixa('#implementacoes'),
        faixaLogos: caixa('.implementacoes-faixa'),
        linhaDoTempo: caixa('#linha-do-tempo'),
        margemParceiros: getComputedStyle(document.querySelector('#parceiros')).marginTop,
        peDaEscrita: Math.round(Math.max(...escritas.map((e) => e.getBoundingClientRect().bottom + scrollY))),
      };
    },
    { raiz: RAIZ },
  );

/* Lê a coluna de pixels de uma janela do documento, rolando de modo que ela caiba
   inteira no viewport. Devolve `y do documento → rgb`. */
async function lerColuna(page, deY, ateY, alturaViewport) {
  const alvo = Math.max(0, Math.round((deY + ateY) / 2 - alturaViewport / 2));
  await rolarPara(page, alvo);
  const scrollReal = await page.evaluate(() => Math.round(window.scrollY));
  const png = await page.screenshot();
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const linhas = [];
  for (let y = deY; y <= ateY; y += 1) {
    const linha = y - scrollReal;
    if (linha < 0 || linha >= info.height) continue;
    const i = (linha * info.width + COLUNA_X) * info.channels;
    linhas.push({ y, rgb: [data[i], data[i + 1], data[i + 2]] });
  }
  return linhas;
}

/* A maior sequência CONTÍNUA de linhas com assinatura de tarja. Contínua porque
   uma listra é uma faixa, não pixels espalhados. */
function maiorCorrida(linhas) {
  let melhor = { altura: 0 };
  let atual = null;
  for (const { y, rgb } of linhas) {
    if (!ehTarja(rgb)) {
      atual = null;
      continue;
    }
    atual = atual ?? { inicio: y, de: hex(rgb) };
    Object.assign(atual, { fim: y, ate: hex(rgb), altura: y - atual.inicio + 1 });
    if (atual.altura > melhor.altura) melhor = { ...atual };
  }
  return melhor;
}

/* Contraste do pior pixel de miolo, trecho a trecho. Método e limiares idênticos
   aos da sonda da SIS-225 (`dif >= 200` é miolo, o resto é franja de
   antialiasing e fica registrado à parte para não parecer escondido). */
async function medirContraste(page) {
  /* O cabeçalho fixo passa POR CIMA do eyebrow em algumas larguras e a sua pílula
     translúcida entraria na foto do fundo como se fosse a capa. */
  await page.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
      header{display:none!important}`,
  });
  await page.waitForTimeout(200);

  const saida = {};
  for (const { rotulo, sel, tinta, alfa, minimo } of TRECHOS) {
    const pintar = async (cor) => {
      await page.evaluate(
        ([s, c]) => {
          document.querySelector('#sis236-tinta')?.remove();
          const st = document.createElement('style');
          st.id = 'sis236-tinta';
          st.textContent = `${s}, ${s} * { color: ${c} !important; -webkit-text-fill-color: ${c} !important; }`;
          document.head.append(st);
        },
        [sel, cor],
      );
      await page.waitForTimeout(150);
      return page.locator(sel).screenshot();
    };
    /* `transparent` e não `visibility: hidden`: esconder muda o layout e a foto
       sairia de outra caixa. */
    const fundoPng = await pintar('transparent');
    const brancoPng = await pintar('#fff');
    const pretoPng = await pintar('#000');
    await page.evaluate(() => document.querySelector('#sis236-tinta')?.remove());

    const ler = (p) => sharp(p).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const fundo = await ler(fundoPng);
    const branco = await ler(brancoPng);
    const preto = await ler(pretoPng);
    const { width, height, channels } = fundo.info;

    let pior = { r: Infinity };
    let piorFranja = { r: Infinity };
    let pixels = 0;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * channels;
        const dif = Math.min(
          branco.data[i] - preto.data[i],
          branco.data[i + 1] - preto.data[i + 1],
          branco.data[i + 2] - preto.data[i + 2],
        );
        if (dif < 24) continue;
        const px = { r: fundo.data[i], g: fundo.data[i + 1], b: fundo.data[i + 2] };
        const r = razao(compor(tinta, px, alfa), px);
        if (dif >= 200) {
          pixels += 1;
          if (r < pior.r) pior = { r, px, x, y };
        } else if (r < piorFranja.r) {
          piorFranja = { r, px, x, y };
        }
      }
    }
    saida[rotulo] = {
      minimo,
      pixelsDeMiolo: pixels,
      miolo: Number.isFinite(pior.r) ? Number(pior.r.toFixed(2)) : null,
      franja: Number.isFinite(piorFranja.r) ? Number(piorFranja.r.toFixed(2)) : null,
    };
  }
  return saida;
}

async function fotografar(page, nome) {
  const destino = path.join(DIR, `${nome}.png`);
  await page.screenshot({ path: destino });
  capturas.push(destino);
}

await mkdir(DIR, { recursive: true });
const browser = await chromium.launch();
const r = {};

try {
  for (const vp of VIEWPORTS) {
    const bloco = {};

    for (const fase of ['antes', 'depois']) {
      const { context, page } = await abrir(browser, vp, { antes: fase === 'antes' });
      const geo = await geometria(page);

      /* A JUNTA DA ISSUE: 120px de hero acima da borda e 160px de seção abaixo —
         folga suficiente para a sombra de 54+18px caber inteira dos dois lados. */
      const de = geo.hero.base - 120;
      const ate = geo.parceiros.topo + 160;
      const tarja = maiorCorrida(await lerColuna(page, de, ate, vp.height));

      /* A captura enquadra a junta, não o topo da página. */
      await rolarPara(page, Math.max(0, Math.round((de + ate) / 2 - vp.height / 2)));
      await fotografar(page, `${fase}-emenda-${vp.nome}`);

      /* As OUTRAS emendas da rota (critério 3). A de implementações → linha do
         tempo é a que a issue nomeia como candidata alternativa. */
      const outras = {};
      for (const [nome, y] of [
        ['implementacoesTopo', geo.implementacoes.topo],
        ['faixaLogosTopo', geo.faixaLogos.topo],
        ['linhaDoTempoTopo', geo.linhaDoTempo.topo],
      ]) {
        outras[nome] = { y, tarja: maiorCorrida(await lerColuna(page, y - 120, y + 120, vp.height)) };
      }

      /* A capa, fotografada e medida por último: `medirContraste` esconde o
         cabeçalho e repinta a tinta, então nada depois dela mede a página real. */
      await rolarPara(page, 0);
      await fotografar(page, `${fase}-capa-${vp.nome}`);
      const contraste = await medirContraste(page);

      bloco[fase] = {
        margemParceiros: geo.margemParceiros,
        heroBase: geo.hero.base,
        parceirosTopo: geo.parceiros.topo,
        vao: geo.parceiros.topo - geo.hero.base,
        peDaEscrita: geo.peDaEscrita,
        folgaAteASombra: geo.parceiros.topo - ALCANCE_SOMBRA - geo.peDaEscrita,
        tarjaNaJunta: tarja,
        outrasEmendas: outras,
        contraste,
      };
      await context.close();
    }

    /* CRITÉRIO 1 — a tarja sumiu da junta apontada. */
    assert(
      bloco.antes.tarjaNaJunta.altura >= 20,
      `${vp.nome}: o ANTES não reproduziu a tarja (a sonda perdeu o defeito, não o conserto)`,
    );
    assert(
      bloco.depois.tarjaNaJunta.altura === 0,
      `${vp.nome}: sobrou tarja de ${bloco.depois.tarjaNaJunta.altura}px na junta hero → #parceiros`,
    );
    assert(bloco.depois.vao === 0, `${vp.nome}: ainda há ${bloco.depois.vao}px de vão entre o hero e #parceiros`);
    assert(bloco.depois.margemParceiros === '0px', `${vp.nome}: #parceiros ainda tem margem de topo`);

    /* CRITÉRIO 2a — o alcance da sombra contra o pé da escrita.
       ISTO NÃO É UM VETO, e a razão está medida. `folgaAteASombra` compara o pé
       da escrita com a EXTENSÃO MÁXIMA da sombra (72px), que é onde ela termina —
       não onde ela ainda pinta alguma coisa. Num desfoque de 54px a intensidade
       na ponta é praticamente zero, então tratar os 72px como "alcance efetivo"
       condena sobreposições que não existem no pixel. Foi o que aconteceu a 390:
       folga de −8px, isto é, a caixa do último parágrafo entra 8px na ponta da
       sombra — e o contraste dos dois parágrafos ali é IDÊNTICO antes e depois
       (6,16:1 e 8,81:1), porque a caixa inclui a entrelinha e os glifos ficam
       acima dela.
       O que fica valendo como veto é a alínea (b): quando a folga é negativa, a
       exigência de contraste sobe de "não piorou" para "não mudou". */
    bloco.sombraAlcancaACaixaDaEscrita = bloco.depois.folgaAteASombra <= 0;

    /* CRITÉRIO 2b — contraste sem regressão. Dívida herdada é relatada, não
       creditada a esta mudança. */
    bloco.dividaHerdada = [];
    for (const [rotulo, depois] of Object.entries(bloco.depois.contraste)) {
      const antes = bloco.antes.contraste[rotulo];
      assert(
        depois.miolo !== null && antes.miolo !== null,
        `${vp.nome}: trecho "${rotulo}" não produziu pixel de miolo — medida inválida`,
      );
      if (depois.miolo === null || antes.miolo === null) continue;
      const tolerancia = bloco.sombraAlcancaACaixaDaEscrita ? 0 : 0.05;
      assert(
        depois.miolo >= antes.miolo - tolerancia,
        `${vp.nome}: contraste de "${rotulo}" caiu de ${antes.miolo}:1 para ${depois.miolo}:1`,
      );
      if (depois.miolo < depois.minimo) {
        bloco.dividaHerdada.push(
          `${rotulo}: ${depois.miolo}:1 contra piso de ${depois.minimo}:1 (antes desta issue: ${antes.miolo}:1)`,
        );
      }
    }

    /* CRITÉRIO 3 — sem listra nova nas outras emendas. */
    for (const [nome, dados] of Object.entries(bloco.depois.outrasEmendas)) {
      const antes = bloco.antes.outrasEmendas[nome].tarja.altura;
      assert(
        dados.tarja.altura <= antes,
        `${vp.nome}: emenda ${nome} ganhou tarja (${antes}px → ${dados.tarja.altura}px)`,
      );
    }

    r[vp.nome] = bloco;
  }
} finally {
  await browser.close();
}

const saida = { baseURL, alcanceDaSombra: ALCANCE_SOMBRA, capturas, falhas, medidas: r };
await writeFile(path.join(DIR, 'resultado.json'), `${JSON.stringify(saida, null, 2)}\n`);
console.log(JSON.stringify(saida, null, 2));
console.log(falhas.length ? `\nREPROVADO: ${falhas.length} falha(s)` : '\nAPROVADO: nenhuma falha');
process.exitCode = falhas.length ? 1 : 0;
