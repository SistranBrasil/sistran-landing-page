/**
 * SIS-279 — sonda das TRÊS rotas depois de montar as cápsulas. Os portões são os
 * CRITÉRIOS ESCRITOS na issue, um por linha:
 *
 *   1. A CÁPSULA CERTA EM CADA ROTA — e `carregou` (`naturalWidth > 0`), que é o que
 *      separa «a tag está no DOM» de «o arquivo chegou». O caminho é conferido nome
 *      por nome: cápsula de outro produto no topo da rota foi o defeito da 5ª volta
 *      do Match AI, e é o erro que este portão existe para pegar.
 *   2. «SEM TECNOLOGIA DISRUPTIVA» no Fast e no Connect API — medido no `innerText`
 *      E no `innerHTML`, porque nó escondido também devolveria a tag.
 *      E O CONTRAPORTÃO: a tag CONTINUA no `lumina-ai`, que é a outra slug do
 *      caminho genérico. «Não redesenhar a página» inclui não mexer na irmã.
 *   3. A CAIXA NÃO ACHATA e as cinco têm a MESMA ALTURA DE CAIXA — a conta que
 *      calibra `--carimbo-batida-w` no `globals.css` é por altura, então a altura
 *      medida nas cinco rotas é o portão dela. Smart Miner e Match AI entram como
 *      CONTROLE.
 *   4. CONTRASTE da cápsula contra o fundo real onde ela assenta: tinta branca só se
 *      lê em faixa escura, e é a razão de ela estar no hero e não nas faixas claras.
 *   5. TRANSBORDO a 1440 e a 390 nas três rotas — a cápsula é peça nova e larga.
 *   6. MOVIMENTO REDUZIDO NOS DOIS CANAIS: a peça tem de estar VISÍVEL e em repouso
 *      (`opacity: 1`, sem `transform` inline do GSAP, nenhuma animação correndo). O
 *      componente não monta a linha do tempo nesse caso, e é isto que prova.
 *
 * Uso: node scripts/medir-carimbos-montados-sis279.mjs
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = 'http://localhost:3000';
const SAIDA = 'docs/medidas/sis279-montados.json';

/* Rota → pedaço do nome de arquivo que a cápsula DELA tem de trazer. */
const ESPERADO = {
  '/solucoes/fast': 'carimbo-fast-ticket',
  '/solucoes/qa-integrado': 'carimbo-qa-integrado-ticket',
  '/solucoes/connect-api': 'carimbo-connect-api-ticket',
  /* CONTROLES: as duas que já estavam montadas. */
  '/solucoes/smart-miner': 'carimbo-smart-miner-ticket',
  '/solucoes/match-ai': 'carimbo-match-ai-ticket',
};

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

async function abrir(rota, { largura = 1440, motion = 'full', reduceSistema } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    ...(reduceSistema ? { reducedMotion: 'reduce' } : {}),
  });
  /* MEDIDO nesta volta: gravar a preferência `full` VENCE a media query do sistema
     — com `reducedMotion: 'reduce'` no contexto E `full` no armazenamento, o
     `matchMedia('(prefers-reduced-motion: reduce)')` da página devolve `false`. É a
     precedência do seletor de movimento do site (escolha explícita ganha do SO), não
     defeito. Então o canal do SISTEMA só se mede SEM gravar preferência nenhuma:
     gravar `full` seria pedir o contrário do que se quer medir. */
  await ctx.addInitScript((pref) => {
    if (pref) {
      localStorage.setItem('sistran-motion-preference', pref);
      localStorage.setItem('sistran-motion-preference-seen', '1');
    }
    sessionStorage.setItem('sistran:intro-visto', 'true');
  }, reduceSistema ? null : motion);
  const p = await ctx.newPage();
  /* `domcontentloaded`: sob `next dev` o `networkidle` nunca chega (canal de HMR
     aberto) e a sonda morre em timeout. */
  await p.goto(`${BASE}${rota}`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 90000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  /* A batida dura 0,42s e espera o `load` da página: 1,4s cobre as duas com folga. */
  await p.waitForTimeout(1400);
  return { ctx, p };
}

/* O que se lê da cápsula montada, na rota em que ela está. */
const LER_CAPSULA = () => {
  const lum = (c) => {
    const [r, g, b] = c.match(/[\d.]+/g).slice(0, 3).map(Number);
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const razao = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
  };
  /* Sobe até o primeiro ancestral com fundo NÃO transparente: é o pixel contra o
     qual a tinta branca da cápsula realmente se lê. */
  const fundoReal = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && c !== 'rgba(0, 0, 0, 0)' && !/,\s*0\)$/.test(c)) return c;
      n = n.parentElement;
    }
    return getComputedStyle(document.body).backgroundColor;
  };

  const no = document.querySelector('.carimbo-batida');
  if (!no) return { existe: false };
  const img = no.querySelector('img');
  const r = no.getBoundingClientRect();
  const ri = img.getBoundingClientRect();
  const naturais = [img.naturalWidth, img.naturalHeight];
  return {
    existe: true,
    classes: no.className,
    src: img.currentSrc ? new URL(img.currentSrc).pathname : img.getAttribute('src'),
    /* `naturalWidth > 0` separa «a tag está lá» de «o arquivo chegou». */
    carregou: img.naturalWidth > 0,
    naturais,
    caixa: [Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10],
    renderizada: [Math.round(ri.width * 10) / 10, Math.round(ri.height * 10) / 10],
    /* ACHATAMENTO: a razão na tela contra a razão do arquivo. Divergir é a cápsula
       esmagada que `--carimbo-batida-ar` existe para impedir. */
    razaoArquivo: Number((naturais[0] / naturais[1]).toFixed(3)),
    razaoNaTela: Number((ri.width / ri.height).toFixed(3)),
    /* ETIQUETA E NÃO MANCHETE: `alt` vazio, e a peça ACIMA do `h1` na ordem do
       documento. Um `alt` com o nome do produto o diria duas vezes. */
    altVazio: img.getAttribute('alt') === '',
    antesDoH1: (() => {
      const h1 = document.querySelector('h1');
      return h1 ? no.compareDocumentPosition(h1) === Node.DOCUMENT_POSITION_FOLLOWING : null;
    })(),
    opacidade: Number(getComputedStyle(no).opacity),
    /* O GSAP limpa o que escreveu no desmonte (`clearProps`); em repouso o `style`
       não pode carregar `transform` nem `opacity` — só o `--carimbo-batida-ar`. */
    styleInline: no.getAttribute('style'),
    animacoesCorrendo: no.getAnimations({ subtree: true }).filter((a) => a.playState === 'running')
      .length,
    fundoReal: fundoReal(no),
    contrasteTintaBranca: razao('rgb(255, 255, 255)', fundoReal(no)),
    /* «SEM TECNOLOGIA DISRUPTIVA»: nos dois lugares, porque nó escondido sai do
       `innerText` mas continua no `innerHTML` — e é o `innerHTML` que prova que a
       tag não existe, não que está apenas invisível.
       MEDIDO nesta volta: o `innerText` APLICA `text-transform`, e a tag é servida
       em caixa alta. A comparação sensível a caixa devolvia `false` até em rota que
       AINDA TEM a tag (o `lumina-ai` deste mesmo arquivo), ou seja, passava o portão
       pelo motivo errado. Daí o `toUpperCase()` nos dois lados. */
    tagTextualNoTexto: document.body.innerText.toUpperCase().includes('TECNOLOGIA DISRUPTIVA'),
    tagTextualNoHTML: document.body.innerHTML.toUpperCase().includes('TECNOLOGIA DISRUPTIVA'),
    /* MEDIDO nesta volta: no `connect-api` o `innerHTML` acusa a tag UMA vez, e ela
       está dentro de um `<script>` — é a carga RSC (`self.__next_f.push`) com a prop
       `eyebrow` SERIALIZADA. O `[slug]/page.tsx` passa `eyebrow` E `eyebrowArte`, e
       quem escolhe é o `PageHero`; a string viaja na carga de qualquer jeito. Não é
       nó de texto, não é alcançável e não se lê na tela. Então o portão que vale é
       este: nós de texto FORA de `<script>`/`<style>`. O `innerHTML` fica registrado
       ao lado justamente para a diferença entre os dois não voltar como suspeita. */
    tagTextualEmMarcacao: (() => {
      const it = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = it.nextNode(); n; n = it.nextNode()) {
        const pai = n.parentElement?.tagName;
        if (pai === 'SCRIPT' || pai === 'STYLE') continue;
        if (/tecnologia disruptiva/i.test(n.nodeValue ?? '')) return true;
      }
      return false;
    })(),
  };
};

const resultado = { nota: 'gerado por scripts/medir-carimbos-montados-sis279.mjs' };

/* ── 1 a 4: a cápsula de cada rota, mais os dois controles ────────────────────── */
resultado.rotas = {};
for (const [rota, esperado] of Object.entries(ESPERADO)) {
  const { ctx, p } = await abrir(rota);
  const lido = await p.evaluate(LER_CAPSULA);
  lido.arteEsperada = esperado;
  lido.arteCorreta = Boolean(lido.src?.includes(esperado));
  resultado.rotas[rota] = lido;
  await p.screenshot({ path: `docs/capturas/sis279-1440-${rota.split('/').pop()}.png` });
  await ctx.close();
}

/* ── 2b. O CONTRAPORTÃO: a slug genérica que NÃO recebeu cápsula ───────────────── */
{
  const { ctx, p } = await abrir('/solucoes/lumina-ai');
  resultado.luminaAi = await p.evaluate(() => ({
    capsulas: document.querySelectorAll('.carimbo-batida').length,
    tagTextual: document.body.innerHTML.toUpperCase().includes('TECNOLOGIA DISRUPTIVA'),
    tagTextualVisivel: document.body.innerText.toUpperCase().includes('TECNOLOGIA DISRUPTIVA'),
  }));
  await ctx.close();
}

/* ── 3b. A MESMA ALTURA DE CAIXA NAS CINCO ────────────────────────────────────── */
resultado.alturasDeCaixa = Object.fromEntries(
  Object.entries(resultado.rotas).map(([r, v]) => [r, v.caixa?.[1] ?? null]),
);

/* ── 5. TRANSBORDO nas três rotas tocadas, em duas larguras ───────────────────── */
resultado.transbordo = {};
for (const rota of ['/solucoes/fast', '/solucoes/qa-integrado', '/solucoes/connect-api']) {
  resultado.transbordo[rota] = {};
  for (const largura of [1440, 390]) {
    const { ctx, p } = await abrir(rota, { largura });
    resultado.transbordo[rota][largura] = await p.evaluate(() => ({
      px: document.documentElement.scrollWidth - window.innerWidth,
      capsula: (() => {
        const no = document.querySelector('.carimbo-batida');
        if (!no) return null;
        const r = no.getBoundingClientRect();
        return {
          caixa: [Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10],
          vazaADireita: Math.round(Math.max(0, r.right - window.innerWidth)),
        };
      })(),
    }));
    if (largura === 390) {
      await p.screenshot({ path: `docs/capturas/sis279-390-${rota.split('/').pop()}.png` });
    }
    await ctx.close();
  }
}

/* ── 6. MOVIMENTO REDUZIDO NOS DOIS CANAIS ────────────────────────────────────── */
const lerReduce = (p) =>
  p.evaluate(() => {
    const no = document.querySelector('.carimbo-batida');
    return {
      atributoMotion: document.documentElement.getAttribute('data-motion'),
      existe: Boolean(no),
      /* O PORTÃO QUE IMPORTA: a peça VISÍVEL. Um fallback errado (um `from`/`fromTo`
         morto por reset global) a deixaria presa em `opacity: 0` para sempre. */
      opacidade: no ? Number(getComputedStyle(no).opacity) : null,
      /* E EM REPOUSO: sem matriz do GSAP no `style` e sem animação correndo — o
         componente simplesmente não monta a linha do tempo nesse canal. */
      styleInline: no?.getAttribute('style') ?? null,
      transformComputado: no ? getComputedStyle(no).transform : null,
      animacoesCorrendo: no
        ? no.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length
        : null,
    };
  });
resultado.reduce = {};
for (const rota of ['/solucoes/fast', '/solucoes/qa-integrado', '/solucoes/connect-api']) {
  const sistema = await abrir(rota, { reduceSistema: true });
  const porSistema = await lerReduce(sistema.p);
  await sistema.ctx.close();
  const atributo = await abrir(rota, { motion: 'reduce' });
  const porAtributo = await lerReduce(atributo.p);
  await atributo.ctx.close();
  resultado.reduce[rota] = { porSistema, porAtributo };
}

await navegador.close();
writeFileSync(SAIDA, `${JSON.stringify(resultado, null, 2)}\n`);
console.log(SAIDA);
console.log(JSON.stringify(resultado, null, 2));
