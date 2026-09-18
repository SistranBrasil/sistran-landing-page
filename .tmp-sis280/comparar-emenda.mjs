/* A emenda "capa escura → seção clara" desta issue contra o precedente da casa
   (`/parceiros-e-implementacoes`, SIS-236): mesma leitura de coluna, mesma
   largura, para dizer se o degrau é o da casa ou um pior. */
import { chromium } from 'playwright';
import sharp from 'sharp';

const BASE = 'http://localhost:3000';
const casos = [
  { rota: '/sistran-university', secao: '#university-programa' },
  { rota: '/parceiros-e-implementacoes', secao: '#parceiros' },
];
const nav = await chromium.launch();
for (const { rota, secao } of casos) {
  const p = await nav.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  await p.goto(`${BASE}${rota}`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await p.waitForSelector(secao, { timeout: 180_000 });
  await p.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[class*=motion-banner],[class*=motion-dialog]{display:none!important}',
  });
  await p.waitForTimeout(1500);
  const y = await p.evaluate((s) => {
    const e = document.querySelector(s);
    const t = e.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: Math.round(t), behavior: 'instant' });
    return Math.round(t);
  }, secao);
  await p.waitForTimeout(1200);
  const topo = await p.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().top), secao);
  const buf = await p.screenshot();
  const r = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = (x, yy) => {
    const k = (yy * r.info.width + x) * r.info.channels;
    return [r.data[k], r.data[k + 1], r.data[k + 2]];
  };
  const x = 43;
  const linha = [];
  for (let d = -28; d <= 12; d += 4) linha.push(`${d}:${px(x, topo + d).join(',')}`);
  const antes = px(x, topo - 1);
  const depois = px(x, topo + 1);
  const degrau = antes.reduce((a, c, i) => a + Math.abs(c - depois[i]), 0);
  console.log(`\n${rota} ${secao} · ancora ${y} · topo na janela ${topo}`);
  console.log('  ' + linha.join(' | '));
  console.log(`  degrau no pixel da borda (soma |ΔRGB|): ${degrau}`);
  await p.close();
}
await nav.close();
