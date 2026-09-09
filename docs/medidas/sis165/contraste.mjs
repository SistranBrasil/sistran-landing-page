import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [L(...a), L(...b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const ALVOS = [
  ['.impact-eyebrow', 'sobretitulo 12px'],
  ['.impact-titulo-destaque', 'seguros (ciano, serifa)'],
  ['.impact-role', 'ROLE PARA REVELAR 11px'],
  ['.impact-item:nth-child(4) .impact-rotulo', 'rotulo 41 chars 16px'],
  ['.impact-item:nth-child(1) .impact-numero-vivo', 'numero (texto grande)', '#7fe6ff'],
  ['.impact-item:nth-child(1) .impact-mais', 'sinal + (texto grande)', '#7fe6ff'],
];

const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
const prep = async () => {
  await pg.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await pg.addStyleTag({ content: 'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],header.fixed{display:none!important}' });
  await pg.waitForTimeout(2500);
  await pg.locator('.impact-lista').scrollIntoViewIfNeeded();
  await pg.waitForTimeout(1600);
};
await prep();

for (const [sel, nome, forcado] of ALVOS) {
  const el = pg.locator(sel).first();
  if (!(await el.count())) { console.log(nome + ': AUSENTE'); continue; }
  const cor = await el.evaluate((n) => getComputedStyle(n).color);
  const opac = await el.evaluate((n) => { let o = 1, p = n; while (p && p !== document.body) { o *= parseFloat(getComputedStyle(p).opacity); p = p.parentElement; } return o; });
  /* Esconde a tinta do BLOCO inteiro (metodo de docs/medidas/COMO-MEDIR-CONTRASTE.md)
     e fotografa o retangulo do proprio alvo: o que sobra na foto é so o fundo. */
  await pg.addStyleTag({ content: `
    .impact-topo,.impact-topo *,.impact-lista,.impact-lista *{color:transparent!important;-webkit-text-fill-color:transparent!important}
    /* O numero nao usa \`color\`: a tinta dele é um degrade recortado em texto. Sem
       apagar o \`background-image\` e o \`filter\`, o "fundo" fotografado seriam as
       proprias glifas — foi o que deu 1,00:1 na primeira leitura. */
    .impact-valor{background-image:none!important;filter:none!important}
    /* O fio decorativo vive DENTRO da caixa do \`.impact-role\`, e o ciano dele
       aparecia como pior pixel de um fundo onde o texto nunca pisa. */
    .impact-role-fio{visibility:hidden!important}
  ` });
  await pg.waitForTimeout(250);
  const b64 = (await el.screenshot()).toString('base64');
  const pior = await pg.evaluate(async (d) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + d;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    const px = x.getImageData(0, 0, c.width, c.height).data;
    const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    let melhor = null, maxL = -1;
    for (let i = 0; i < px.length; i += 4) {
      const l = 0.2126 * lin(px[i]) + 0.7152 * lin(px[i + 1]) + 0.0722 * lin(px[i + 2]);
      if (l > maxL) { maxL = l; melhor = [px[i], px[i + 1], px[i + 2]]; }
    }
    return melhor;
  }, b64);
  await prep();

  const m = cor.match(/[\d.]+/g).map(Number);
  let fg = forcado
    ? [1, 3, 5].map((k) => parseInt(forcado.slice(k, k + 2), 16))
    : m.slice(0, 3);
  const alfa = forcado ? opac : (m.length > 3 ? m[3] : 1) * opac;
  if (alfa < 1) fg = [0, 1, 2].map((k) => Math.round(fg[k] * alfa + pior[k] * (1 - alfa)));
  console.log(`${nome}\n   cor=${forcado ? forcado + ' (ponta mais escura do degrade)' : cor} alfa-efetivo=${alfa.toFixed(2)} -> rgb(${fg})\n   pior pixel de fundo=rgb(${pior})\n   CONTRASTE = ${ratio(fg, pior).toFixed(2)}:1`);
}
await b.close();
