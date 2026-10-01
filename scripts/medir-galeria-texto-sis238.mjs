/* SIS-238 — contraste de TODO texto da galeria, nas duas superfícies.

   Dois números por elemento, como a casa exige: a razão DECLARADA (cor computada
   contra o pixel de fundo local) e a razão de PIOR PIXEL (o pixel de tinta mais
   escuro do glifo contra o pixel de fundo mais claro na mesma caixa). O segundo é
   sempre pior em texto pequeno, porque a franja de antialiasing entra na conta —
   raster subestima texto pequeno, e por isso os dois vão para o relatório.

   Os títulos são medidos DUAS vezes: no painel fechado (papel claro) e no painel
   aberto (marinho). São dois pares cor/fundo diferentes com o mesmo seletor.

     node scripts/medir-galeria-texto-sis238.mjs
*/
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROTA = 'http://localhost:3000/quem-somos';

const relLum = (c) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
};
const razao = (a, b) => {
  const [x, y] = [relLum(a), relLum(b)].sort((m, n) => n - m);
  return +((x + 0.05) / (y + 0.05)).toFixed(2);
};

const nav = await chromium.launch({ executablePath: EXE });
const sharp = (await import('sharp')).default;
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await ctx.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference', 'full');
  localStorage.setItem('sistran-motion-preference-seen', '1');
  sessionStorage.setItem('sistran:intro-visto', 'true');
});
const pag = await ctx.newPage();
await pag.goto(ROTA, { waitUntil: 'domcontentloaded' });
await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
await pag.addStyleTag({
  content:
    'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[href="#conteudo"]{display:none!important}',
});
if (!(await pag.evaluate(() => !!document.querySelector('.rgal-secao')))) {
  throw new Error('a galeria não está montada — nada a medir');
}

const ALVOS = [
  ['.rgal-eyebrow', 'eyebrow'],
  ['.rgal-h2', 'titulo da seção'],
  ['.rgal-apoio', 'linha de apoio'],
  ['.rgal-dica', 'dica de interação'],
  ['.rgal-painel[data-ativo="false"] .rgal-titulo', 'título do painel FECHADO'],
  ['.rgal-painel[data-ativo="true"] .rgal-titulo', 'título do painel ABERTO'],
  ['.rgal-notas p', 'nota de rodapé'],
];

const medir = async () => {
  const leituras = [];
  for (const [sel, nome] of ALVOS) {
    const info0 = await pag.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return null;
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
        cor: cs.color,
        tamanho: cs.fontSize,
        peso: cs.fontWeight,
        texto: (el.textContent || '').slice(0, 42),
      };
    }, sel);
    /* Nada de plano B: se o alvo não existe, o critério não está cumprido e o
       relatório tem de dizer isso, não medir outra coisa parecida. */
    if (!info0) {
      leituras.push({ seletor: sel, nome, ausente: true });
      continue;
    }
    await pag.waitForTimeout(500);
    const info = await pag.evaluate((s) => {
      const r = document.querySelector(s).getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    }, sel);
    const png = await pag.screenshot();
    const { data, meta } = await sharp(png)
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then((o) => ({ data: o.data, meta: o.info }));
    const px = (x, y) => {
      const k = (y * meta.width + x) * meta.channels;
      return [data[k], data[k + 1], data[k + 2]];
    };
    let tinta = null;
    let fundo = null;
    for (let dy = 0; dy < info.h; dy++) {
      for (let dx = 0; dx < info.w; dx++) {
        const x = info.x + dx;
        const y = info.y + dy;
        if (x < 0 || y < 0 || x >= meta.width || y >= meta.height) continue;
        const c = px(x, y);
        const L = relLum(c);
        if (!tinta || L < relLum(tinta)) tinta = c;
        if (!fundo || L > relLum(fundo)) fundo = c;
      }
    }
    /* A razão DECLARADA usa a cor computada do texto contra o pixel de fundo
       predominante — e o predominante é o mais claro numa seção de papel, o mais
       escuro num painel marinho. Aqui o par é escolhido pelo extremo oposto ao da
       tinta declarada, o que dá o mesmo resultado nas duas superfícies. */
    const declarada = info0.cor.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
    const fundoDeclarado = relLum(declarada) < 0.5 ? fundo : tinta;
    leituras.push({
      seletor: sel,
      nome,
      texto: info0.texto,
      tamanho: info0.tamanho,
      peso: info0.peso,
      corDeclarada: info0.cor,
      fundoLido: fundoDeclarado.join(','),
      razaoDeclarada: razao(declarada, fundoDeclarado),
      piorTinta: tinta.join(','),
      melhorFundo: fundo.join(','),
      razaoPiorPixel: razao(tinta, fundo),
    });
  }
  return leituras;
};

const out = { rota: ROTA, quando: new Date().toISOString(), largura: 1440 };
out.leituras = await medir();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/galeria-texto-sis238.json', JSON.stringify(out, null, 2));
await ctx.close();
await nav.close();
console.log('gravado docs/medidas/galeria-texto-sis238.json');
