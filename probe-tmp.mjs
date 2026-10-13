import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
const p = await ctx.newPage();
const amostras = [];
await p.goto('http://localhost:3011/', { waitUntil: 'commit', timeout: 60000 });
for (let i = 0; i < 30; i++) {
  await p.waitForTimeout(250);
  const s = await p.evaluate(() => {
    const mmi = document.querySelector('.mmi-root');
    const gate = document.querySelector('[class*="overlay"], [class*="gate"]');
    const vis = (n) => { if (!n) return 'ausente'; if (n.hasAttribute('hidden')) return 'hidden';
      const cs = getComputedStyle(n); return cs.display === 'none' ? 'display:none' : `visivel op=${cs.opacity}`; };
    return { t: Math.round(performance.now()), mmi: vis(mmi), mmiEstado: mmi?.dataset.estado ?? null,
             gate: gate ? `${gate.className} ${vis(gate)}` : 'ausente', intro: document.documentElement.hasAttribute('data-intro') };
  }).catch(() => null);
  if (s) amostras.push(s);
}
console.log(amostras.map((a) => `${a.t}ms mmi=${a.mmi}/${a.mmiEstado} data-intro=${a.intro} gate=${a.gate}`).join('\n'));
await b.close();
