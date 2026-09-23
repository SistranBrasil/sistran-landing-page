/**
 * SIS-279 (slot Guru) — sonda da rota DEPOIS de montar a cápsula. Os portões são os
 * CRITÉRIOS ESCRITOS na issue, um por linha:
 *
 *   1. O HERO DE `/solucoes/guru-de-seguros` MOSTRA A CÁPSULA DO GURU — e `carregou`
 *      (`naturalWidth > 0`), que é o que separa «a tag está no DOM» de «o arquivo
 *      chegou». O caminho é conferido nome por nome.
 *   2. NÃO PUBLICA NOME DE OUTRO PRODUTO: a cápsula é UMA só na rota, o `src` traz
 *      `carimbo-guru-de-seguros-ticket`, e nenhum nome das irmãs («Match AI», «Smart
 *      Miner», «Fast», «QA Integrado», «Connect API») aparece em nó de texto do hero.
 *      Medido em nós de texto FORA de `<script>`/`<style>`: o `innerHTML` carrega a
 *      carga RSC e acusaria nome de irmã só por estar no dado de «Conheça também».
 *   3. A CAIXA NÃO ACHATA e tem a MESMA ALTURA das irmãs — a conta que calibra
 *      `--carimbo-batida-w` é por ALTURA, então a altura medida nas seis rotas é o
 *      portão dela. As cinco irmãs entram como CONTROLE, no mesmo código.
 *   4. CONTRASTE da tinta branca contra o pixel REAL onde ela assenta. O fundo é a
 *      capa com dois véus declarados em `rgba`, então o número sai do PIXEL da
 *      captura e não de caminhada pelo DOM (`.section-light` e embrulhos com
 *      gradiente têm `backgroundColor` transparente e a caminhada cairia no `body`).
 *   5. ETIQUETA E NÃO MANCHETE: `alt` vazio e a peça ACIMA do `h1` na ordem do
 *      documento — o `h1` já diz o nome do produto no `alt` da marca desenhada.
 *   6. TRANSBORDO a 1440 e a 390: a cápsula é peça nova e larga no hero.
 *   7. MOVIMENTO REDUZIDO NOS DOIS CANAIS: VISÍVEL (`opacity: 1`) e em repouso (sem
 *      matriz do GSAP no `style`, nenhuma animação correndo). O componente não monta
 *      a linha do tempo nesse caso, e é isto que prova.
 *   8. AS IRMÃS INTACTAS: cada uma com a SUA cápsula, e zero `gurudeseguros-` fora
 *      desta rota.
 *
 * Uso: node scripts/medir-carimbo-guru-montado-sis279.mjs
 */

import { writeFileSync, readFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = 'http://localhost:3000';
const SAIDA = 'docs/medidas/sis279-guru-montado.json';

/* Rota → pedaço do nome de arquivo que a cápsula DELA tem de trazer. */
const ESPERADO = {
  '/solucoes/guru-de-seguros': 'carimbo-guru-de-seguros-ticket',
  /* CONTROLES: as cinco que já estavam montadas. */
  '/solucoes/match-ai': 'carimbo-match-ai-ticket',
  '/solucoes/smart-miner': 'carimbo-smart-miner-ticket',
  '/solucoes/fast': 'carimbo-fast-ticket',
  '/solucoes/qa-integrado': 'carimbo-qa-integrado-ticket',
  '/solucoes/connect-api': 'carimbo-connect-api-ticket',
};

/* Os nomes das irmãs, que NÃO podem aparecer no hero do Guru. */
const NOMES_DAS_IRMAS = ['Match AI', 'Smart Miner', 'Fast', 'QA Integrado', 'Connect API'];

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

async function abrir(rota, { largura = 1440, motion = 'full', reduceSistema } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    ...(reduceSistema ? { reducedMotion: 'reduce' } : {}),
  });
  /* Gravar a preferência `full` VENCE a media query do sistema — então o canal do
     SISTEMA só se mede SEM gravar preferência nenhuma. */
  await ctx.addInitScript(
    (pref) => {
      if (pref) {
        localStorage.setItem('sistran-motion-preference', pref);
        localStorage.setItem('sistran-motion-preference-seen', '1');
      }
      sessionStorage.setItem('sistran:intro-visto', 'true');
    },
    reduceSistema ? null : motion,
  );
  const p = await ctx.newPage();
  /* `domcontentloaded`: sob `next dev` o `networkidle` nunca chega (canal de HMR). */
  await p.goto(`${BASE}${rota}`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 90000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  /* A batida dura 0,42s e espera o `load`: 1,4s cobre as duas com folga. */
  await p.waitForTimeout(1400);
  return { ctx, p };
}

const LER_CAPSULA = (nomesDasIrmas) => {
  const nos = document.querySelectorAll('.carimbo-batida');
  const no = nos[0];
  if (!no) return { existe: false, quantas: 0 };
  const img = no.querySelector('img');
  const r = no.getBoundingClientRect();
  const ri = img.getBoundingClientRect();
  const naturais = [img.naturalWidth, img.naturalHeight];
  const h1 = document.querySelector('h1');
  /* Nós de texto FORA de `<script>`/`<style>`, dentro da seção do hero: o
     `innerHTML` traria a carga RSC e o `body` inteiro traria «Conheça também». */
  const hero = document.getElementById('topo');
  const textoDoHero = (() => {
    if (!hero) return '';
    const it = document.createTreeWalker(hero, NodeFilter.SHOW_TEXT);
    let acc = '';
    for (let n = it.nextNode(); n; n = it.nextNode()) {
      const pai = n.parentElement?.tagName;
      if (pai === 'SCRIPT' || pai === 'STYLE') continue;
      acc += ` ${n.nodeValue ?? ''}`;
    }
    return acc;
  })();
  return {
    existe: true,
    quantas: nos.length,
    classes: no.className,
    src: img.currentSrc ? new URL(img.currentSrc).pathname : img.getAttribute('src'),
    carregou: img.naturalWidth > 0,
    naturais,
    caixa: [Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10],
    renderizada: [Math.round(ri.width * 10) / 10, Math.round(ri.height * 10) / 10],
    /* ACHATAMENTO: a razão na tela contra a razão do arquivo. */
    razaoArquivo: Number((naturais[0] / naturais[1]).toFixed(3)),
    razaoNaTela: Number((ri.width / ri.height).toFixed(3)),
    /* ETIQUETA E NÃO MANCHETE. */
    altVazio: img.getAttribute('alt') === '',
    antesDoH1: h1 ? no.compareDocumentPosition(h1) === Node.DOCUMENT_POSITION_FOLLOWING : null,
    altDoLetreiro: h1?.querySelector('img')?.getAttribute('alt') ?? null,
    dentroDoHero: Boolean(hero?.contains(no)),
    opacidade: Number(getComputedStyle(no).opacity),
    styleInline: no.getAttribute('style'),
    animacoesCorrendo: no.getAnimations({ subtree: true }).filter((a) => a.playState === 'running')
      .length,
    /* NOME DE OUTRO PRODUTO no hero — a proibição explícita da issue. «Fast» é
       palavra curta e entra com fronteira de palavra para não casar dentro de
       outra. */
    nomesDeIrmasNoHero: nomesDasIrmas.filter((n) =>
      new RegExp(`\\b${n.replace(/ /g, '\\s+')}\\b`, 'i').test(textoDoHero),
    ),
    /* Posição da cápsula na tela, para amostrar o pixel do fundo na captura. */
    retangulo: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
  };
};

const resultado = { nota: 'gerado por scripts/medir-carimbo-guru-montado-sis279.mjs' };

/* ── 1 a 3, 5: a cápsula de cada rota, com as cinco irmãs como controle ────────── */
resultado.rotas = {};
for (const [rota, esperado] of Object.entries(ESPERADO)) {
  const { ctx, p } = await abrir(rota);
  const lido = await p.evaluate(LER_CAPSULA, NOMES_DAS_IRMAS);
  lido.arteEsperada = esperado;
  lido.arteCorreta = Boolean(lido.src?.includes(esperado));
  /* Vazamento de classe: `gurudeseguros-` só pode existir NA rota do Guru. */
  lido.classesGuru = await p.evaluate(
    () => document.querySelectorAll('[class*="gurudeseguros-"]').length,
  );
  resultado.rotas[rota] = lido;
  if (rota === '/solucoes/guru-de-seguros') {
    await p.screenshot({ path: 'docs/capturas/sis279-guru-1440-hero.png' });
  }
  await ctx.close();
}

/* ── 3b. A MESMA ALTURA DE CAIXA NAS SEIS ─────────────────────────────────────── */
resultado.alturasDeCaixa = Object.fromEntries(
  Object.entries(resultado.rotas).map(([r, v]) => [r, v.caixa?.[1] ?? null]),
);

/* ── 6. TRANSBORDO em duas larguras ───────────────────────────────────────────── */
resultado.transbordo = {};
for (const largura of [1440, 390]) {
  const { ctx, p } = await abrir('/solucoes/guru-de-seguros', { largura });
  resultado.transbordo[largura] = await p.evaluate(() => {
    const no = document.querySelector('.carimbo-batida');
    const r = no?.getBoundingClientRect();
    return {
      px: document.documentElement.scrollWidth - window.innerWidth,
      caixa: r ? [Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10] : null,
      vazaADireita: r ? Math.round(Math.max(0, r.right - window.innerWidth)) : null,
    };
  });
  if (largura === 390) {
    await p.screenshot({ path: 'docs/capturas/sis279-guru-390-hero.png' });
  }
  await ctx.close();
}

/* ── 7. MOVIMENTO REDUZIDO NOS DOIS CANAIS ────────────────────────────────────── */
const lerReduce = (p) =>
  p.evaluate(() => {
    const no = document.querySelector('.carimbo-batida');
    return {
      atributoMotion: document.documentElement.getAttribute('data-motion'),
      existe: Boolean(no),
      /* O PORTÃO QUE IMPORTA: a peça VISÍVEL. Um fallback errado a deixaria presa
         em `opacity: 0` para sempre. */
      opacidade: no ? Number(getComputedStyle(no).opacity) : null,
      styleInline: no?.getAttribute('style') ?? null,
      transformComputado: no ? getComputedStyle(no).transform : null,
      animacoesCorrendo: no
        ? no.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length
        : null,
      caixa: (() => {
        const r = no?.getBoundingClientRect();
        return r ? [Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10] : null;
      })(),
    };
  });
{
  const sistema = await abrir('/solucoes/guru-de-seguros', { reduceSistema: true });
  resultado.reducePorSistema = await lerReduce(sistema.p);
  await sistema.p.screenshot({ path: 'docs/capturas/sis279-guru-reduce-sistema.png' });
  await sistema.ctx.close();
  const atributo = await abrir('/solucoes/guru-de-seguros', { motion: 'reduce' });
  resultado.reducePorAtributo = await lerReduce(atributo.p);
  await atributo.ctx.close();
}

await navegador.close();

/* ── 4. CONTRASTE pelo PIXEL REAL da captura ──────────────────────────────────── */
{
  const sharp = (await import('sharp')).default;
  const arquivo = 'docs/capturas/sis279-guru-1440-hero.png';
  const [x, y, w, h] = resultado.rotas['/solucoes/guru-de-seguros'].retangulo;
  const img = sharp(readFileSync(arquivo));
  const meta = await img.metadata();
  const lum = ([r, g, b]) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const razao = (a, b) => {
    const [m, n] = [lum(a), lum(b)].sort((p, q) => q - p);
    return Number(((m + 0.05) / (n + 0.05)).toFixed(2));
  };
  /* Três pontos DENTRO da caixa da cápsula, nos vãos entre os traços do desenho:
     é o fundo contra o qual a tinta branca se lê. Cada um é a média de um bloco
     pequeno, para uma franja de antialiasing não decidir o número sozinha. */
  const pontos = [
    { nome: 'vao-esquerdo', px: Math.round(x + w * 0.08), py: Math.round(y + h * 0.5) },
    { nome: 'vao-central', px: Math.round(x + w * 0.42), py: Math.round(y + h * 0.78) },
    { nome: 'vao-direito', px: Math.round(x + w * 0.9), py: Math.round(y + h * 0.5) },
  ];
  const medidos = [];
  for (const pt of pontos) {
    const lado = 6;
    const left = Math.max(0, Math.min(pt.px, (meta.width ?? 1440) - lado));
    const top = Math.max(0, Math.min(pt.py, (meta.height ?? 900) - lado));
    const { data, info } = await sharp(readFileSync(arquivo))
      .extract({ left, top, width: lado, height: lado })
      .raw()
      .toBuffer({ resolveWithObject: true });
    let [sr, sg, sb, n] = [0, 0, 0, 0];
    for (let i = 0; i < data.length; i += info.channels) {
      sr += data[i];
      sg += data[i + 1];
      sb += data[i + 2];
      n += 1;
    }
    const fundo = [sr / n, sg / n, sb / n].map((v) => Math.round(v));
    medidos.push({
      ...pt,
      fundo: `rgb(${fundo.join(', ')})`,
      contrasteTintaBranca: razao([255, 255, 255], fundo),
    });
  }
  resultado.contrastePixel = {
    arquivo,
    caixaDaCapsula: [x, y, w, h],
    piso: 3,
    nota: 'piso 3:1 — a cápsula é traço grosso (componente gráfico grande), não texto de corpo',
    pontos: medidos,
    pior: Math.min(...medidos.map((m) => m.contrasteTintaBranca)),
  };
}

writeFileSync(SAIDA, `${JSON.stringify(resultado, null, 2)}\n`);
console.log(SAIDA);
console.log(JSON.stringify(resultado, null, 2));
