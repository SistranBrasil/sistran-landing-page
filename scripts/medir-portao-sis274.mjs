/**
 * SIS-274 — «RouteLoadGate · fundo #1273bc + logo HD no lugar de SISTRAN».
 *
 * `node scripts/medir-portao-sis274.mjs`  (precisa do `next dev` em :3000)
 *
 * Os critérios da issue e o que cada um exige para virar número:
 *
 *  • «Em QUALQUER navegação de rota, overlay = #1273bc» — não basta ler o CSS no
 *    primeiro carregamento. O portão é remontado por `key={usePathname()}`, então
 *    a segunda medição é feita CLICANDO num link de rota e lendo o overlay que
 *    nasce dessa troca. As duas medidas têm de dar o mesmo azul.
 *  • «Centro = logo HD, SEM texto SISTRAN» — dois fatos independentes: o `<img>`
 *    existe e carregou (`naturalWidth > 0`, senão um 404 daria uma tela azul
 *    vazia que passa por "sem texto"), e a palavra não está no overlay. A busca
 *    é pelo TEXTO do overlay, não pela classe `.wordmark`: apagar a classe e
 *    deixar a palavra passaria num portão que olhasse só o seletor.
 *  • «Sem caixa preta» — o teste que vale é sobre PIXEL RENDERIZADO, não sobre o
 *    arquivo (isso já está provado em `docs/medidas/logo-portao-sis274.json`).
 *    Recorta-se a caixa da logo com uma folga de 12px e conta-se quantos pixels
 *    da moldura dessa folga divergem do azul. Uma caixa preta, uma franja escura
 *    ou um retângulo de `background` do `<img>` apareceriam todos aqui.
 *  • «Nitidez OK» — o número é a razão entre o lado do arquivo (320) e o lado
 *    exibido em CSS: abaixo de 1 haveria ampliação de bitmap. Mede-se também com
 *    DPR 2, que é o caso que decidiu o 320.
 *  • «Reduce OK» — sem regressão: `transition` do overlay em `none`, `.signal`
 *    sem animação e com a barra inteira preenchida (a decoração morre VISÍVEL),
 *    nos dois canais da casa — a media query e `html[data-motion="reduce"]`.
 *  • Acessibilidade que a issue manda preservar: `alt=""` e o `role="status"`
 *    com «Carregando…» ainda no overlay.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const BASE = 'http://localhost:3000';
const JANELA = { width: 1440, height: 900 };
const AZUL_ESPERADO = 'rgb(18, 115, 188)'; /* #1273bc */

const nav = await chromium.launch();
const res = { janela: JANELA, azulEsperado: `${AZUL_ESPERADO} (#1273bc)`, erros: [] };

/** Lê tudo o que se pode ler enquanto o overlay está na tela. */
const lerOverlay = (p) =>
  p.evaluate(() => {
    const ov = document.querySelector('[data-route-loading]');
    if (!ov) return null;
    const img = ov.querySelector('img');
    const sinal = ov.querySelector('span:last-of-type');
    const est = getComputedStyle(ov);
    const cImg = img ? getComputedStyle(img) : null;
    const r = img ? img.getBoundingClientRect() : null;
    return {
      fundo: est.backgroundColor,
      /* `backgroundImage` do overlay tem de ser `none`: se sobrasse qualquer
         `linear-gradient`, o azul chapado estaria por baixo de uma camada. */
      fundoImagem: est.backgroundImage,
      /* Só o TEXTO. Vazio prova que «SISTRAN» saiu, sem depender de classe. */
      textoVisivelDoOverlay: (ov.textContent || '').replace(/\s+/g, ' ').trim(),
      logo: img
        ? {
            src: img.getAttribute('src'),
            /* `alt` presente e vazio — `null` seria atributo ausente, que é
               outra coisa para leitor de tela. */
            altVazio: img.getAttribute('alt') === '',
            /* Carregou de verdade: 404 daria 0 e a tela ficaria azul e vazia. */
            larguraNatural: img.naturalWidth,
            alturaNatural: img.naturalHeight,
            larguraCss: Math.round(r.width * 10) / 10,
            caixa: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
            cor: cImg.color,
            /* Um `background` no próprio `<img>` seria a caixa que a issue teme. */
            fundoDaImagem: cImg.backgroundColor,
            mixBlend: cImg.mixBlendMode,
          }
        : null,
      sinal: sinal
        ? {
            fundoDaTrilha: getComputedStyle(sinal).backgroundColor,
            corDaBarra: getComputedStyle(sinal, '::after').backgroundColor,
            larguraDaBarra: getComputedStyle(sinal, '::after').width,
            animacao: getComputedStyle(sinal, '::after').animationName,
          }
        : null,
      transicaoDoOverlay: est.transitionDuration,
      /* A saída acessível que a issue manda manter. */
      status: (() => {
        const s = ov.querySelector('[role="status"]');
        return s ? { texto: s.textContent.trim(), ariaLive: s.getAttribute('aria-live') } : null;
      })(),
      /* `aria-hidden` na marca é o que evita a logo ser lida junto do status. */
      marcaAriaHidden: ov.querySelector('[aria-hidden="true"]') !== null,
    };
  });

/* ── 1. Primeiro carregamento (o overlay vem no HTML do servidor) ─────────── */
{
  const ctx = await nav.newContext({ viewport: JANELA });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await ctx.newPage();
  p.on('console', (m) => { if (m.type() === 'error') res.erros.push(m.text()); });
  p.on('response', (r) => {
    /* Um 404 no asset é o modo de falha mais silencioso desta issue. */
    if (r.url().includes('logo-sistran-portao') && !r.ok()) res.erros.push(`asset ${r.status()} em ${r.url()}`);
  });
  await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-route-loading]', { timeout: 10000 });
  /* Um instante para o WebP decodificar — `naturalWidth` só é confiável depois. */
  await p.waitForTimeout(600);
  res.noCarregamento = await lerOverlay(p);
  await p.screenshot({ path: 'docs/capturas/sis274-portao-1440-carregamento.png', clip: { x: 0, y: 0, ...JANELA } });
  await ctx.close();
}

/* ── 2. Troca de rota por CLIQUE ───────────────────────────────────────────
   O critério diz «em qualquer navegação de rota». O portão é remontado por
   `key={usePathname()}`, então este é um overlay DIFERENTE do de cima — e é o
   caso que o usuário vê mais vezes. A rota é lenta o suficiente para o overlay
   ficar na tela; se não estivesse, o `waitForSelector` falharia e o número
   apareceria como `null` em vez de passar por engano. */
{
  const ctx = await nav.newContext({ viewport: JANELA });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await ctx.newPage();
  await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 40000 }).catch(() => null);
  await p.waitForTimeout(800);
  res.naTrocaDeRota = { alvo: '/trabalhe-conosco', lido: null };

  /* Um `waitForSelector` depois do clique NÃO serve aqui, e a primeira versão
     deste script errou por isso (devolveu `null`): o overlay da troca pode nascer
     e morrer entre duas idas ao navegador, e a espera falhando silenciosamente é
     indistinguível de "o overlay não apareceu". Um `MutationObserver` instalado
     ANTES do clique captura o estado no instante em que o nó entra no DOM —
     mesmo que ele dure um quadro. */
  await p.evaluate(() => {
    window.__sis274 = null;
    const ler = (ov) => {
      const est = getComputedStyle(ov);
      const img = ov.querySelector('img');
      return {
        fundo: est.backgroundColor,
        fundoImagem: est.backgroundImage,
        textoVisivelDoOverlay: (ov.textContent || '').replace(/\s+/g, ' ').trim(),
        logoSrc: img ? img.getAttribute('src') : null,
        logoAltVazio: img ? img.getAttribute('alt') === '' : null,
        temStatusCarregando: /Carregando/.test(ov.textContent || ''),
      };
    };
    const jaTem = document.querySelector('[data-route-loading]');
    if (jaTem) window.__sis274 = ler(jaTem);
    new MutationObserver(() => {
      if (window.__sis274) return;
      const ov = document.querySelector('[data-route-loading]');
      if (ov) window.__sis274 = ler(ov);
    }).observe(document.documentElement, { subtree: true, childList: true });
  });

  const link = p.locator('a[href="/trabalhe-conosco"]').first();
  await link.evaluate((n) => n.scrollIntoView({ block: 'center' })).catch(() => null);
  await link.click({ force: true }).catch((e) => res.erros.push(`clique: ${e.message}`));
  await p.waitForTimeout(1500);
  res.naTrocaDeRota.lido = await p.evaluate(() => window.__sis274);
  /* A URL confirma que houve navegação de verdade: um overlay lido sem a rota ter
     mudado seria o overlay do primeiro carregamento medido duas vezes. */
  res.naTrocaDeRota.urlDepois = p.url().replace(BASE, '');
  await p.screenshot({ path: 'docs/capturas/sis274-portao-1440-troca-de-rota.png', clip: { x: 0, y: 0, ...JANELA } });
  await ctx.close();
}

/* ── 3. Sem caixa preta: moldura de folga ao redor da logo, em pixel ──────── */
{
  const cx = res.noCarregamento?.logo?.caixa;
  if (!cx) {
    res.semCaixaPreta = 'logo não encontrada — nada a medir';
  } else {
    const FOLGA = 12;
    const img = sharp('docs/capturas/sis274-portao-1440-carregamento.png');
    const { data, info } = await img
      .extract({
        left: Math.max(0, cx.x - FOLGA),
        top: Math.max(0, cx.y - FOLGA),
        width: cx.w + FOLGA * 2,
        height: cx.h + FOLGA * 2,
      })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width: w, height: h, channels: c } = info;
    /* Tolerância de ±6 por canal: a grade de 48px do `::before` passa por dentro
       desta moldura de propósito (ela é textura, não caixa) e desvia o azul em
       poucos níveis. Um preto ou uma franja escura desviaria em dezenas.

       O que se mediu: `pixelsForaDoAzul: 144` e `piorDesvioPorCanal: 16` — e os
       144 são CONTÁVEIS de antemão, o que é o que os torna inofensivos. A moldura
       tem 152px de lado e a grade tem passo de 48px, então 3 linhas verticais e 3
       horizontais a cruzam; cada uma atravessa a faixa de 12px em dois lados:
       6 × 12 × 2 = 144. Todos CLAREIAM (branco a 8%), e o desvio de 16 é o do
       branco somado ao azul. O número que fecha o critério é outro:
       `pixelMaisEscuroDaMoldura` volta exatamente `[18, 115, 188]`, ou seja o
       pixel mais escuro de toda a moldura é o próprio azul do fundo. Não existe
       nada mais escuro que o fundo ao redor da logo — que é a definição de "sem
       caixa preta". */
    const TOL = 6;
    const alvo = [18, 115, 188];
    let foraDoAzul = 0;
    let piorDesvio = 0;
    let maisEscuro = { lum: 999, px: null };
    const olhar = (x, y) => {
      const o = (y * w + x) * c;
      const p = [data[o], data[o + 1], data[o + 2]];
      const d = Math.max(...p.map((v, i) => Math.abs(v - alvo[i])));
      if (d > TOL) foraDoAzul += 1;
      if (d > piorDesvio) piorDesvio = d;
      const lum = (p[0] + p[1] + p[2]) / 3;
      if (lum < maisEscuro.lum) maisEscuro = { lum: Math.round(lum), px: p };
    };
    /* Só a moldura da folga — o interior é a própria logo, que É branca. */
    for (let x = 0; x < w; x += 1) {
      for (let d = 0; d < FOLGA; d += 1) { olhar(x, d); olhar(x, h - 1 - d); }
    }
    for (let y = 0; y < h; y += 1) {
      for (let d = 0; d < FOLGA; d += 1) { olhar(d, y); olhar(w - 1 - d, y); }
    }
    res.semCaixaPreta = {
      moldura: `${FOLGA}px ao redor de ${cx.w}×${cx.h}`,
      toleranciaPorCanal: TOL,
      pixelsForaDoAzul: foraDoAzul,
      piorDesvioPorCanal: piorDesvio,
      /* O número decisivo: se houvesse caixa preta, este seria perto de 0. */
      pixelMaisEscuroDaMoldura: maisEscuro,
    };
  }
}

/* ── 4. Nitidez: arquivo vs. lado exibido, em DPR 1 e 2 ───────────────────── */
{
  res.nitidez = {};
  for (const dpr of [1, 2]) {
    const ctx = await nav.newContext({ viewport: JANELA, deviceScaleFactor: dpr });
    await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
    const p = await ctx.newPage();
    await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await p.waitForSelector('[data-route-loading] img', { timeout: 10000 }).catch(() => null);
    await p.waitForTimeout(500);
    const m = await p.evaluate(() => {
      const i = document.querySelector('[data-route-loading] img');
      if (!i) return null;
      return { arquivo: i.naturalWidth, css: Math.round(i.getBoundingClientRect().width * 10) / 10 };
    });
    res.nitidez[`dpr${dpr}`] = m
      ? { ...m, pixelsDeDispositivo: Math.round(m.css * dpr), razaoArquivoSobreDispositivo: Number((m.arquivo / (m.css * dpr)).toFixed(2)) }
      : null;
    await ctx.close();
  }
}

/* ── 5. Movimento reduzido — os DOIS canais da casa ───────────────────────── */
{
  res.reduce = {};
  /* (a) preferência do sistema */
  const ctx = await nav.newContext({ viewport: JANELA, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await ctx.newPage();
  await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-route-loading]', { timeout: 10000 }).catch(() => null);
  await p.waitForTimeout(500);
  res.reduce.mediaQuery = await lerOverlay(p);
  await p.screenshot({ path: 'docs/capturas/sis274-portao-1440-reduce.png', clip: { x: 0, y: 0, ...JANELA } });
  await ctx.close();

  /* (b) o atributo do seletor de movimento do site, sem a preferência do SO:
     é canal independente e a casa muda os dois juntos. */
  const ctx2 = await nav.newContext({ viewport: JANELA });
  await ctx2.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    document.documentElement.setAttribute('data-motion', 'reduce');
  });
  const p2 = await ctx2.newPage();
  await p2.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await p2.waitForSelector('[data-route-loading]', { timeout: 10000 }).catch(() => null);
  await p2.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
  await p2.waitForTimeout(400);
  res.reduce.atributoDataMotion = await lerOverlay(p2);
  await ctx2.close();
}

await nav.close();
await writeFile('docs/medidas/portao-sis274.json', `${JSON.stringify(res, null, 1)}\n`);
console.log(JSON.stringify(res, null, 1));
