import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = 'http://localhost:3000';
const dir = 'docs/capturas/herdadas';
await mkdir(dir, { recursive: true });

const ROTAS = [
  { rota: '/quem-somos', nome: 'quem-somos', alvo: '#resultados',
    fracoes: [0.18, 0.55, 0.92],
    medir: { 'numeros:secao': '#resultados', 'numeros:lente': '.impact-lente',
             'numeros:item-ativo': '.impact-item[data-estado="ativo"]',
             'numeros:numero': '.impact-valor', 'numeros:titulo': '.impact-titulo' } },
  { rota: '/transformacao-legado', nome: 'legado', alvo: '.mosaic',
    fracoes: [0.2, 0.5, 0.9],
    medir: { 'mosaico:secao': '.mosaic', 'mosaico:card': '.mosaic-tile' } },
];

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const navegador = await chromium.launch();
const erros = [];
const relatorio = {};

for (const vp of [{ n: '1440x900', w: 1440, h: 900 }, { n: '390x844', w: 390, h: 844 }]) {
  for (const r of ROTAS) {
    const ctx = await navegador.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
    await ctx.addInitScript(() => {
      sessionStorage.setItem('sistran:intro-visto', '1');
      localStorage.setItem('sistran-motion-preference-seen', '1');
      localStorage.setItem('sistran-motion-preference', 'full');
    });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') erros.push(`[${vp.n}${r.rota}] ${m.text()}`); });
    page.on('pageerror', (e) => erros.push(`[${vp.n}${r.rota}] ${e.message}`));
    await page.goto(BASE + r.rota, { waitUntil: 'load' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise((s) => setTimeout(s, 90)); }
      scrollTo(0, 0);
    });
    await dormir(1200);

    for (const f of r.fracoes) {
      const y = await page.evaluate(([sel, frac]) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const topo = el.getBoundingClientRect().top + scrollY;
        const perc = Math.max(0, el.offsetHeight - innerHeight);
        return perc === 0 ? topo - (innerHeight - el.offsetHeight) / 2 : topo + perc * frac;
      }, [r.alvo, f]);
      if (y === null) { erros.push(`[${vp.n}${r.rota}] alvo ausente: ${r.alvo}`); continue; }
      await page.evaluate((d) => { const l = window.__lenis; l?.scrollTo ? l.scrollTo(d, { immediate: true }) : scrollTo(0, d); }, y);
      await dormir(1800);
      await page.screenshot({ path: `${dir}/${vp.n}-${r.nome}-f${String(Math.round(f * 100)).padStart(2, '0')}.png` });
    }

    relatorio[`${vp.n} ${r.rota}`] = await page.evaluate((mapa) => {
      const out = {};
      for (const [k, sel] of Object.entries(mapa)) {
        const el = document.querySelector(sel);
        out[k] = el
          ? { w: +el.getBoundingClientRect().width.toFixed(1), h: +el.getBoundingClientRect().height.toFixed(1),
              alturaTrilha: el.offsetHeight, fontSize: getComputedStyle(el).fontSize,
              fracaoLargura: +(el.getBoundingClientRect().width / innerWidth).toFixed(3) }
          : 'ausente';
      }
      return out;
    }, r.medir);
    await ctx.close();
  }
}
await navegador.close();
await writeFile('docs/medidas/medidas-herdadas.json', JSON.stringify(relatorio, null, 2));
console.log(JSON.stringify(relatorio, null, 2));
console.log('erros:', erros.length);
for (const e of erros.slice(0, 15)) console.log('  ' + e);
