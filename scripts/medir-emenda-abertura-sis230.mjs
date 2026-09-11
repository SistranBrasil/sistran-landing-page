/**
 * SIS-230 — a emenda entre a faixa nova (`.rec-abertura`) e o percurso fixo
 * (`.rec-scroll`), e o contraste dos dois textos do bloco Celent.
 *
 * A abertura é uma faixa nova com fundo próprio: se a tinta com que ela termina
 * não for a mesma com que o palco começa, aparece um degrau — foi por isso que
 * o degradê fecha em `--palco-fundo`. Aqui isso vira número.
 *
 * Uso: URL_BASE=http://localhost:3000 node scripts/medir-emenda-abertura-sis230.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import sharp from 'sharp';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';

const lum = (r, g, b) => {
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const razao = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const navegador = await chromium.launch();
const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
const pagina = await contexto.newPage();
await pagina.goto(`${URL_BASE}/quem-somos`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
await pagina.waitForSelector('.rec-abertura', { timeout: 180_000 });
await pagina.addStyleTag({
  content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
    header{display:none!important}`,
});
const continuar = pagina.getByRole('button', { name: 'Continuar' });
if (await continuar.count()) await continuar.first().click();
await pagina.waitForTimeout(2000);

const base = await pagina.evaluate(() => {
  const r = document.querySelector('.rec-abertura').getBoundingClientRect();
  return r.bottom + window.scrollY;
});
await pagina.evaluate((y) => window.scrollTo(0, y - 450), base);
await pagina.waitForTimeout(1200);
const linha = await pagina.evaluate(() =>
  Math.round(document.querySelector('.rec-abertura').getBoundingClientRect().bottom),
);
const foto = await pagina.screenshot();
const { data, info } = await sharp(foto).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, channels } = info;
const ler = (y) => {
  let r = 0;
  let g = 0;
  let b = 0;
  for (let x = 620; x < 820; x += 1) {
    const i = (y * width + x) * channels;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  return [r, g, b].map((v) => Math.round(v / 200));
};
console.log(`emenda .rec-abertura → .rec-scroll em y=${linha}`);
for (const d of [-120, -40, -6, 6, 40, 120]) {
  const [r, g, b] = ler(linha + d);
  console.log(`  ${d > 0 ? '+' : ''}${d}px\trgb(${r} ${g} ${b})\tL=${lum(r, g, b).toFixed(4)}`);
}

/* Contraste das duas linhas do bloco Celent contra o fundo imediatamente ao
   lado delas — a cor do texto é declarada, o fundo é degradê, então o par tem de
   ser medido no lugar. */
await pagina.evaluate(() =>
  document.querySelector('.rec-celent').scrollIntoView({ block: 'center' }),
);
await pagina.waitForTimeout(1000);
const foto2 = await pagina.screenshot();
const m2 = await sharp(foto2).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const px = (x, y) => {
  const i = (y * m2.info.width + x) * m2.info.channels;
  return [m2.data[i], m2.data[i + 1], m2.data[i + 2]];
};
for (const sel of ['.rec-celent-linha1', '.rec-celent-linha2']) {
  const cx = await pagina.evaluate((s) => {
    const r = document.querySelector(s).getBoundingClientRect();
    const est = getComputedStyle(document.querySelector(s));
    return { x: Math.round(r.left), y: Math.round(r.top + r.height / 2), cor: est.color };
  }, sel);
  /* Fundo lido 40px à esquerda do início do texto, na mesma altura. */
  const [fr, fg, fb] = px(Math.max(0, cx.x - 40), cx.y);
  const [tr, tg, tb] = cx.cor.match(/[\d.]+/g).map(Number);
  const rz = razao(lum(tr, tg, tb), lum(fr, fg, fb));
  console.log(`${sel}\ttexto ${cx.cor}\tfundo rgb(${fr} ${fg} ${fb})\tcontraste ${rz.toFixed(2)}:1`);
}
await navegador.close();
