/**
 * SIS-280 — PORTÕES do cabeçalho dos aceleradores em `/solucoes`.
 *
 * Três critérios, três medições, todas no DOM computado da rota:
 *   1. a tag textual «Tecnologia Disruptiva» NÃO existe mais na seção, e no lugar dela
 *      há um `.carimbo-batida` montado, com a arte CARREGADA (`naturalWidth > 0` — um
 *      `<img>` com 404 continua no DOM e passaria por um portão de presença);
 *   2. a string «aceleradores» precedida de número NÃO aparece no texto da seção;
 *   3. o `font-weight` COMPUTADO do `h2` «Soluções» — negrito é o número, não a classe.
 *
 * A seção vive abaixo da dobra, então há rampa de rolagem: sem ela o carimbo de
 * `gatilho="viewport"` nunca entra em cena e a batida não teria como ser medida.
 *
 * Receita de navegador da casa (Playwright do cache do `npx`, :3000, preferência de
 * movimento semeada, canal `reduce` em CONTEXTO NOVO).
 *
 *   node scripts/medir-carimbo-accel-sis280.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const { chromium } = await import(
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
);

const ROTA = 'http://localhost:3000/solucoes';
const ARTE = '/images/carimbo-disruptiva-ticket-outline-0757c7.png';

const semear = (ctx, valor) =>
  ctx.addInitScript((v) => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', v);
  }, valor);

async function rampa(page, seletor) {
  const y = await page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? el.getBoundingClientRect().top + window.scrollY - 200 : 0;
  }, seletor);
  for (let s = 0; s < y; s += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), s);
    await page.waitForTimeout(70);
  }
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(1400);
}

const ler = (page, arte) =>
  page.evaluate((caminho) => {
    const secao = document.getElementById('tecnologia-disruptiva');
    if (!secao) return null;
    const cabeca = secao.querySelector('.accel-cabeca');
    const carimbo = secao.querySelector('.carimbo-batida');
    const img = carimbo?.querySelector('img') ?? null;
    const h2 = [...secao.querySelectorAll('h2')].find((n) => n.textContent.trim() === 'Soluções');
    const texto = secao.textContent.replace(/\s+/g, ' ');
    const caixa = carimbo?.getBoundingClientRect();
    const eh2 = h2 ? getComputedStyle(h2) : null;
    const colunaDeTexto = cabeca ? Math.round(cabeca.getBoundingClientRect().width) : null;
    return {
      /* PORTÃO 1 */
      tagTextualPresente: texto.includes('Tecnologia Disruptiva'),
      tagSectionNaSecao: secao.querySelectorAll('.tag-section').length,
      carimboMontado: !!carimbo,
      arteEsperada: caminho,
      arteServida: img ? decodeURIComponent(img.currentSrc || img.src).replace(location.origin, '') : null,
      arteCarregada: img ? img.naturalWidth > 0 : false,
      arteIntrinseca: img ? [img.naturalWidth, img.naturalHeight] : null,
      alt: img ? img.getAttribute('alt') : null,
      carimboCaixa: caixa
        ? { w: Math.round(caixa.width), h: Math.round(caixa.height) }
        : null,
      carimboLarguraVar: carimbo
        ? getComputedStyle(carimbo).getPropertyValue('--carimbo-batida-w').trim()
        : null,
      carimboSombra: carimbo ? getComputedStyle(carimbo).boxShadow : null,
      /* Fração da coluna de texto — a leitura de «sem dominar o h2». */
      fracaoDaColuna:
        caixa && colunaDeTexto ? Number((caixa.width / colunaDeTexto).toFixed(3)) : null,
      colunaDeTexto,
      /* PORTÃO 2 */
      seloDeContagem: /\d+\s+aceleradores/i.test(texto),
      ocorrenciasDeAceleradores: (texto.match(/aceleradores/gi) ?? []).length,
      trechoDeTexto: texto.slice(0, 160),
      /* PORTÃO 3 */
      h2Presente: !!h2,
      h2Peso: eh2?.fontWeight ?? null,
      h2Familia: eh2?.fontFamily ?? null,
      h2Tamanho: eh2 ? parseFloat(eh2.fontSize) : null,
      h2Sintese: h2 ? getComputedStyle(document.documentElement).fontSynthesis : null,
    };
  }, arte);

/* A BATIDA: dois quadros na janela da entrada. O `transform` do carimbo tem de MUDAR
   entre eles (a peça chega 1,85× e assenta), senão não há batida — só peça parada. */
async function batida(browser, largura) {
  const ctx = await browser.newContext({ viewport: { width: largura, height: 900 } });
  await semear(ctx, 'full');
  const page = await ctx.newPage();
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(1500);
  const alvo = await page.evaluate(() => {
    const el = document.querySelector('#tecnologia-disruptiva .carimbo-batida');
    return el ? el.getBoundingClientRect().top + window.scrollY - 400 : null;
  });
  if (alvo === null) {
    await ctx.close();
    return null;
  }
  await page.evaluate((v) => window.scrollTo(0, v), alvo);
  const ler2 = () =>
    page.evaluate(() => {
      const el = document.querySelector('#tecnologia-disruptiva .carimbo-batida');
      const e = getComputedStyle(el);
      return { transform: e.transform, opacidade: e.opacity };
    });
  const amostras = [];
  for (const espera of [80, 120, 200, 900]) {
    await page.waitForTimeout(espera);
    amostras.push(await ler2());
  }
  await ctx.close();
  return {
    amostras,
    transformsDistintos: new Set(amostras.map((a) => a.transform)).size,
    assentou: amostras[amostras.length - 1].transform === 'matrix(1, 0, 0, 1, 0, 0)',
    opacidadeFinal: amostras[amostras.length - 1].opacidade,
  };
}

const browser = await chromium.launch();
const saida = { rota: ROTA, quando: new Date().toISOString(), larguras: {}, reduce: {} };

for (const largura of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1 });
  await semear(ctx, 'full');
  const page = await ctx.newPage();
  const erros = [];
  const faltando = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  page.on('response', (r) => {
    if (r.status() >= 400 && r.url().includes('carimbo')) faltando.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(2500);
  await rampa(page, '#tecnologia-disruptiva');
  const estado = await ler(page, ARTE);
  mkdirSync('docs/capturas', { recursive: true });
  await page.screenshot({ path: `docs/capturas/sis280-accel-carimbo-${largura}.png`, fullPage: false });
  saida.larguras[largura] = { estado, arte404: faltando, errosDeConsole: erros };
  await ctx.close();
}

saida.batida = { 1440: await batida(browser, 1440) };

/* Movimento reduzido nos DOIS canais: a peça não anima, mas tem de nascer no estado
   final — nunca presa em `opacity: 0`, que é como animação morta esconde conteúdo. */
for (const canal of ['sistema', 'chave']) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ...(canal === 'sistema' ? { reducedMotion: 'reduce' } : {}),
  });
  await semear(ctx, canal === 'sistema' ? 'reduce' : 'full');
  const page = await ctx.newPage();
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  if (canal === 'chave')
    await page.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
  await page.waitForTimeout(1200);
  await rampa(page, '#tecnologia-disruptiva');
  saida.reduce[canal] = await page.evaluate(() => {
    const el = document.querySelector('#tecnologia-disruptiva .carimbo-batida');
    if (!el) return null;
    const e = getComputedStyle(el);
    const img = el.querySelector('img');
    const r = el.getBoundingClientRect();
    return {
      transform: e.transform,
      opacidade: e.opacity,
      visivel: r.width > 0 && r.height > 0,
      caixa: { w: Math.round(r.width), h: Math.round(r.height) },
      arteCarregada: img ? img.naturalWidth > 0 : false,
    };
  });
  await ctx.close();
}

await browser.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/sis280-accel-carimbo.json', JSON.stringify(saida, null, 2));
console.log(JSON.stringify(saida, null, 2));
