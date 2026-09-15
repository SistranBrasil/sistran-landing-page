/**
 * SIS-265 — sonda do selo do «Fale com a Gente!» de `/esg` depois da troca do
 * logo para a arte de alta definição. Uma medida por linha do aceite:
 *
 *   1. o `<img>` do selo aponta para a derivada WebP, o arquivo responde 200 e o
 *      navegador o decodifica (`naturalWidth`/`naturalHeight` reais);
 *   2. NÃO há caixa preta no cartão: a área do selo é fotografada e cada pixel
 *      classificado. Uma caixa preta apareceria como um bloco escuro cobrindo a
 *      caixa retangular do `<img>`; o que deve haver é o símbolo BRANCO sobre o
 *      azul do blob;
 *   3. o símbolo LÊ como na referência: contraste medido entre o branco do
 *      símbolo e o azul do blob logo ao lado dele;
 *   4. as outras rotas com `ContactCTA` seguem sem nenhuma referência à derivada
 *      nova.
 *
 * Reaproveita um servidor JÁ DE PÉ (não sobe nem derruba nada):
 *   URL_BASE=http://localhost:3000 node scripts/medir-selo-cta-esg-sis265.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const CAPTURAS = 'docs/capturas';
const MEDIDAS = 'docs/medidas';
await mkdir(CAPTURAS, { recursive: true });
await mkdir(MEDIDAS, { recursive: true });

const ESCONDER = `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
                  header.fixed{display:none!important}`;

const luminancia = ({ r, g, b }) => {
  const c = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const razao = (a, b) => {
  const [x, y] = [luminancia(a) + 0.05, luminancia(b) + 0.05].sort((p, q) => q - p);
  return Number((x / y).toFixed(2));
};

const navegador = await chromium.launch();
const relatorio = { quando: new Date().toISOString(), issue: 'SIS-265', base: URL_BASE };

const contexto = await navegador.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  // congela o `cta-ref-flutua`: o selo precisa ficar parado para ser medido
  reducedMotion: 'reduce',
});
await contexto.addInitScript(() => {
  try {
    localStorage.setItem('sistran-motion-preference', 'reduce');
  } catch {}
});
const pagina = await contexto.newPage();

/* Rede: quem pediu o quê. Serve para provar 200 na derivada e ausência de 404. */
const respostas = [];
pagina.on('response', (r) => {
  const u = r.url();
  if (/logo-sistran-cta|sistranaltadefinicao|sistran-logo/.test(u)) {
    respostas.push({ url: u.replace(URL_BASE, ''), status: r.status() });
  }
});

await pagina.goto(`${URL_BASE}/esg`, { waitUntil: 'domcontentloaded', timeout: 120000 });
await pagina.addStyleTag({ content: ESCONDER });
await pagina.waitForSelector('.cta-ref-selo img', { timeout: 120000 });
await pagina.locator('.cta-ref-selo').scrollIntoViewIfNeeded();
await pagina.waitForTimeout(2500);

// ── 1. o que o navegador realmente carregou ───────────────────────────────────
relatorio.imagem = await pagina.evaluate(() => {
  const img = document.querySelector('.cta-ref-selo img');
  const cs = getComputedStyle(img);
  const caixa = img.getBoundingClientRect();
  return {
    srcAtributo: img.getAttribute('src'),
    srcResolvido: new URL(img.currentSrc || img.src, location.href).pathname,
    completa: img.complete,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    attrWidth: img.getAttribute('width'),
    attrHeight: img.getAttribute('height'),
    renderizado: {
      largura: Math.round(caixa.width * 10) / 10,
      altura: Math.round(caixa.height * 10) / 10,
    },
    css: {
      objectFit: cs.objectFit,
      mixBlendMode: cs.mixBlendMode,
      filter: cs.filter,
      opacity: cs.opacity,
    },
  };
});
relatorio.rede = respostas;

// ── 2 e 3. a foto do selo, pixel por pixel ────────────────────────────────────
const caixaSelo = await pagina.locator('.cta-ref-selo').boundingBox();
const caixaArte = await pagina.locator('.cta-ref-arte').boundingBox();
/* Captura por ELEMENTO, e não por `clip` de viewport: a rolagem da página é
   controlada por script (smooth scroll), então a caixa da seção pode ficar fora
   da janela mesmo depois de `scrollIntoViewIfNeeded` — foi o que quebrou a
   primeira versão desta sonda. `locator.screenshot()` resolve o enquadramento. */
const fotoSecao = `${CAPTURAS}/selo-cta-esg-sis265-1440.png`;
await pagina.locator('.cta-ref-arte').evaluate((el) => el.closest('section').scrollIntoView({ block: 'center' }));
await pagina.waitForTimeout(900);
await pagina
  .locator('section')
  .filter({ has: pagina.locator('.cta-ref-arte') })
  .first()
  .screenshot({ path: fotoSecao });

/* A foto do SELO sozinho, exatamente na caixa do `<img>`: é o recorte onde uma
   caixa preta seria inescapável. */
const fotoSelo = `${CAPTURAS}/selo-cta-esg-sis265-recorte.png`;
await pagina.locator('.cta-ref-selo').screenshot({ path: fotoSelo });

const { data, info } = await sharp(fotoSelo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const em = (x, y) => {
  const o = (y * info.width + x) * info.channels;
  return { r: data[o], g: data[o + 1], b: data[o + 2] };
};

let escuros = 0;
let claros = 0;
let azuis = 0;
let somaLum = 0;
const total = info.width * info.height;
for (let o = 0; o < data.length; o += info.channels) {
  const r = data[o];
  const g = data[o + 1];
  const b = data[o + 2];
  const lum = (r + g + b) / 3;
  somaLum += lum;
  if (lum < 40) escuros += 1;
  if (lum > 225) claros += 1;
  if (b > r + 25 && b > 80) azuis += 1;
}
const pct = (n) => Number(((100 * n) / total).toFixed(2));
relatorio.recorteDoSelo = {
  arquivo: fotoSelo,
  tamanho: `${info.width}x${info.height}`,
  /* `pctEscuro` é o veredito do critério «sem caixa preta visível»: se um PNG de
     fundo preto tivesse entrado cru, este número passaria de 70%. */
  pctEscuro: pct(escuros),
  pctClaro: pct(claros),
  pctAzul: pct(azuis),
  lumMedia: Number((somaLum / total).toFixed(1)),
  cantos: {
    superiorEsquerdo: em(0, 0),
    superiorDireito: em(info.width - 1, 0),
    inferiorEsquerdo: em(0, info.height - 1),
    inferiorDireito: em(info.width - 1, info.height - 1),
  },
};

/* Contraste do traço branco do símbolo contra o azul do blob. O ponto do símbolo
   é o pixel MAIS CLARO do recorte; o do blob, o mais azul — os dois medidos, não
   escolhidos por coordenada fixa, porque a silhueta mudou de tamanho. */
let maisClaro = { lum: -1 };
let maisAzul = { d: -1 };
for (let y = 0; y < info.height; y += 1) {
  for (let x = 0; x < info.width; x += 1) {
    const p = em(x, y);
    const lum = (p.r + p.g + p.b) / 3;
    if (lum > maisClaro.lum) maisClaro = { lum, x, y, cor: p };
    const d = p.b - p.r;
    if (d > maisAzul.d) maisAzul = { d, x, y, cor: p };
  }
}
relatorio.contrasteSimboloSobreBlob = {
  simbolo: { ...maisClaro.cor, em: [maisClaro.x, maisClaro.y] },
  blob: { ...maisAzul.cor, em: [maisAzul.x, maisAzul.y] },
  razao: razao(maisClaro.cor, maisAzul.cor),
};

relatorio.caixas = {
  selo: caixaSelo && {
    largura: Math.round(caixaSelo.width * 10) / 10,
    altura: Math.round(caixaSelo.height * 10) / 10,
  },
  arte: caixaArte && {
    largura: Math.round(caixaArte.width * 10) / 10,
    altura: Math.round(caixaArte.height * 10) / 10,
  },
  pctDaArte:
    caixaSelo && caixaArte
      ? Number(((100 * caixaSelo.width) / caixaArte.width).toFixed(1))
      : null,
};

// ── 4. as outras rotas com ContactCTA seguem intactas ─────────────────────────
relatorio.outrasRotas = {};
for (const rota of ['/contato', '/trabalhe-conosco', '/sistran-university']) {
  const p2 = await contexto.newPage();
  const vistas = [];
  p2.on('response', (r) => {
    if (/logo-sistran-cta/.test(r.url())) vistas.push(r.url());
  });
  try {
    await p2.goto(`${URL_BASE}${rota}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p2.waitForTimeout(1200);
    relatorio.outrasRotas[rota] = await p2.evaluate(() => ({
      temSeloReferencia: Boolean(document.querySelector('.cta-ref-selo')),
      temSecaoContato: Boolean(document.querySelector('a[href*="contato"], button')),
    }));
    relatorio.outrasRotas[rota].pediuDerivadaNova = vistas.length;
  } catch (e) {
    relatorio.outrasRotas[rota] = { erro: String(e.message).slice(0, 160) };
  }
  await p2.close();
}

await navegador.close();
relatorio.capturas = { secao: fotoSecao, selo: fotoSelo };
await writeFile(`${MEDIDAS}/selo-cta-esg-sis265.json`, `${JSON.stringify(relatorio, null, 2)}\n`);
console.log(JSON.stringify(relatorio, null, 2));
