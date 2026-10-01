/* PORTÃO do pedido «todos os backgrounds de /quem-somos que NÃO SEJAM AZUL ESCURO
   seguem o mesmo padrão do /solucoes … o mesmo fundo em todas as sessões».

   O pedido é sobre CONTINUIDADE, e continuidade só se prova em PIXEL, porque duas
   seções podem declarar `transparent` e ainda assim mostrar um degrau (grade
   dobrada, sombra de borda, `::before` sobrando). Então esta sonda:

     1) EMENDA — rola cada faixa até a fronteira com a anterior ficar no MEIO da
        janela e lê a linha 20px ACIMA e 20px ABAIXO da junta em 12 colunas. Δ por
        canal <= 3 significa que não há degrau (3 = franja de antialiasing do
        raster; ver a lição «raster subestima texto pequeno»).
     2) MESMO PIXEL NA MESMA ALTURA — o plano é ancorado na JANELA, logo o ponto
        (x, y) da janela tem de dar a MESMA cor em qualquer rolagem. Leio três
        pontos de plano puro em toda faixa clara; se o plano fosse por seção, esses
        números andariam.
     3) CONTRASTE nas faixas escuras (texto branco) e na fita `.sobre-metricas
        on-dark`, que é escura DENTRO de faixa clara — é onde um plano claro por
        baixo apareceria. Cor do texto vinda do CSS, fundo vindo do PIXEL ao lado.
     4) TRANSBORDO horizontal e erros de console.

   Captura é da JANELA, nunca `fullPage`: camada ancorada na janela não é resolvida
   contra a viewport em captura de página inteira.

     node scripts/medir-plano-quem-somos.mjs
*/
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
import sharp from 'sharp';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROTA = process.env.ROTA ?? 'http://localhost:3000/quem-somos';
const LARGURAS = [
  { w: 1440, h: 900 },
  { w: 768, h: 1024 },
  { w: 390, h: 844 },
];
const TMP = 'docs/capturas';
mkdirSync(TMP, { recursive: true });

const lum = (r, g, b) => {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contraste = (a, b) => {
  const l1 = lum(...a);
  const l2 = lum(...b);
  return +((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2);
};

const nav = await chromium.launch({ executablePath: EXE });
const saida = { rota: ROTA, quando: new Date().toISOString(), larguras: [] };

for (const { w, h } of LARGURAS) {
  const ctx = await nav.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const pag = await ctx.newPage();
  const erros = [];
  pag.on('console', (m) => {
    if (m.type() === 'error') erros.push(m.text().slice(0, 200));
  });
  pag.on('pageerror', (e) => erros.push(`pageerror: ${String(e).slice(0, 200)}`));

  await pag.goto(ROTA, { waitUntil: 'domcontentloaded' });
  await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  /* Esconder o que é do ambiente de dev e o header fixo (ele cobriria a janta). */
  await pag.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],header,[href="#conteudo"]{display:none!important}',
  });
  for (let i = 0; i < 16; i++) {
    await pag.mouse.wheel(0, h * 0.9);
    await pag.waitForTimeout(200);
  }
  await pag.waitForTimeout(1000);

  const faixas = await pag.evaluate(() =>
    [...document.querySelector('main').children]
      .filter((el) => !el.classList.contains('quem-somos-atmosfera'))
      .map((el, i) => {
        const b = el.getBoundingClientRect();
        el.dataset.sondaFaixa = String(i);
        return {
          i,
          classe: (el.className?.toString?.() ?? '').slice(0, 70),
          topoDoc: Math.round(b.top + scrollY),
          altura: Math.round(b.height),
        };
      }),
  );

  const meio = Math.round(h / 2);
  const emendas = [];
  const planoPontos = [];

  for (const f of faixas) {
    if (f.i === 0) continue; /* a primeira não tem junta acima */
    await pag.evaluate((y) => window.scrollTo(0, y), Math.max(0, f.topoDoc - meio));
    await pag.waitForTimeout(500);
    /* A junta pode ter andado (reveal muda altura): reler onde ela está AGORA. */
    const yJunta = await pag.evaluate(
      (i) => Math.round(document.querySelector(`[data-sonda-faixa="${i}"]`).getBoundingClientRect().top),
      f.i,
    );
    const arq = `${TMP}/qs-plano-${w}-${f.i}.png`;
    await pag.screenshot({ path: arq });
    const img = sharp(arq);
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    const px = (x, y) => {
      const o = (y * info.width + x) * info.channels;
      return [data[o], data[o + 1], data[o + 2]];
    };
    const yA = yJunta - 20;
    const yB = yJunta + 20;
    let pior = -1;
    let onde = null;
    if (yA >= 0 && yB < info.height) {
      for (let k = 0; k < 12; k++) {
        const x = Math.round(((k + 0.5) / 12) * (info.width - 2)) + 1;
        const a = px(x, yA);
        const b = px(x, yB);
        const d = Math.max(...a.map((v, j) => Math.abs(v - b[j])));
        if (d > pior) {
          pior = d;
          onde = { x, acima: a, abaixo: b };
        }
      }
    }
    emendas.push({ faixa: f.i, classe: f.classe, yJunta, piorDelta: pior, onde });

    /* Plano puro: colunas de 6px das duas bordas, três alturas. Margem lateral não
       recebe conteúdo em nenhuma faixa desta rota (medido no inventário). */
    planoPontos.push({
      faixa: f.i,
      pontos: [
        px(6, 60),
        px(6, Math.round(h / 2)),
        px(info.width - 7, h - 60),
      ],
    });
  }

  /* CONTRASTE — texto claro sobre as faixas escuras e sobre a fita on-dark. */
  const alvos = await pag.evaluate(() => {
    const sel = [
      '.hero-backdrop h1',
      '.perfil-secao h2',
      '.impact-scroll h2',
      '.agimos-secao h2',
      '#por-que-sistran',
      '.sobre-metricas.on-dark, .sobre-metricas .on-dark, .on-dark',
    ];
    const vistos = new Set();
    const saida = [];
    for (const s of sel) {
      for (const el of document.querySelectorAll(s)) {
        if (!(el.textContent ?? '').trim() || vistos.has(el)) continue;
        vistos.add(el);
        saida.push({ sel: s, cor: getComputedStyle(el).color, docTop: Math.round(el.getBoundingClientRect().top + scrollY) });
        break;
      }
    }
    return saida;
  });

  const contrastes = [];
  for (const a of alvos) {
    await pag.evaluate((y) => window.scrollTo(0, y), Math.max(0, a.docTop - meio));
    await pag.waitForTimeout(400);
    const caixa = await pag.evaluate((sel) => {
      const el = [...document.querySelectorAll(sel)].find((e) => (e.textContent ?? '').trim());
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: Math.round(b.left), y: Math.round(b.top + b.height / 2), w: Math.round(b.width) };
    }, a.sel);
    if (!caixa) continue;
    const arq = `${TMP}/qs-contraste-${w}-${contrastes.length}.png`;
    await pag.screenshot({ path: arq });
    const { data, info } = await sharp(arq).raw().toBuffer({ resolveWithObject: true });
    const px = (x, y) => {
      const o = (y * info.width + x) * info.channels;
      return [data[o], data[o + 1], data[o + 2]];
    };
    const y = Math.min(Math.max(caixa.y, 1), info.height - 2);
    /* Fundo: 8px à esquerda do texto — dentro da faixa, fora do glifo. */
    const x = Math.min(Math.max(caixa.x - 8, 1), info.width - 2);
    const fundo = px(x, y);
    const m = a.cor.match(/[\d.]+/g).map(Number);
    contrastes.push({
      sel: a.sel,
      corTexto: a.cor,
      fundoLido: `rgb(${fundo.join(', ')})`,
      razao: contraste([m[0], m[1], m[2]], fundo),
    });
  }

  const transbordo = await pag.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));

  saida.larguras.push({
    largura: w,
    altura: h,
    faixas: faixas.length,
    emendas,
    planoPontos,
    contrastes,
    transbordoPx: transbordo.scrollW - transbordo.clientW,
    erros,
  });
  await ctx.close();
}

await nav.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/plano-quem-somos.json', `${JSON.stringify(saida, null, 2)}\n`);

for (const L of saida.larguras) {
  console.log(`\n=== ${L.largura}x${L.altura} — faixas ${L.faixas} ===`);
  const pior = L.emendas.reduce((m, e) => (e.piorDelta > m.piorDelta ? e : m), L.emendas[0]);
  for (const e of L.emendas) {
    console.log(
      `  emenda f${String(e.faixa).padStart(2)} y=${String(e.yJunta).padStart(4)} Δ=${String(e.piorDelta).padStart(4)} .${e.classe.slice(0, 44)}`,
    );
  }
  console.log(`  PIOR EMENDA: Δ=${pior.piorDelta} na faixa ${pior.faixa} (${pior.classe.slice(0, 40)})`);
  const chaves = L.planoPontos.map((p) => p.pontos.map((c) => c.join(',')).join(' | '));
  const distintas = [...new Set(chaves)];
  console.log(`  plano na mesma altura: ${distintas.length} leitura(s) distinta(s) em ${chaves.length} faixas`);
  for (const d of distintas.slice(0, 6)) console.log(`    ${d}`);
  for (const c of L.contrastes) {
    console.log(`  contraste ${c.razao.toFixed(2)}:1  ${c.corTexto} sobre ${c.fundoLido}  ${c.sel.slice(0, 40)}`);
  }
  console.log(`  transbordo horizontal: ${L.transbordoPx}px | erros de console: ${L.erros.length}`);
  for (const e of L.erros.slice(0, 4)) console.log(`    ${e}`);
}
rmSync(TMP, { recursive: true, force: true });
