import { chromium } from 'playwright';
const b = await chromium.launch();
// 1ª visita, sessão nova
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
const p = await ctx.newPage();
await p.goto('http://localhost:3011/', { waitUntil: 'commit', timeout: 60000 });
const linhas = [];
for (let i = 0; i < 26; i++) {
  await p.waitForTimeout(250);
  const s = await p.evaluate(() => {
    const mmi = document.querySelector('.mmi-root');
    const gate = document.querySelector('[class*="overlay"]');
    const vis = (n) => { if (!n) return 'ausente'; if (n.hasAttribute('hidden')) return 'hidden';
      const cs = getComputedStyle(n); return cs.display === 'none' ? 'none' : `visivel op=${Number(cs.opacity).toFixed(2)}`; };
    return `mmi=${vis(mmi)} data-intro=${document.documentElement.hasAttribute('data-intro')} gate=${vis(gate)}`;
  }).catch(() => null);
  if (s) linhas.push(s);
}
console.log('── 1ª VISITA ──');
console.log([...new Set(linhas)].join('\n'));
// 2. navegação entre páginas
await p.click('a[href="/quem-somos"]').catch(async () => { await p.goto('http://localhost:3011/quem-somos'); });
const nav = [];
for (let i = 0; i < 16; i++) {
  await p.waitForTimeout(220);
  const s = await p.evaluate(() => {
    const gate = document.querySelector('[class*="overlay"]');
    const mmi = document.querySelector('.mmi-root');
    return `gate=${gate ? (gate.hasAttribute('hidden') ? 'hidden' : 'visivel') : 'ausente'} mmiNoDom=${!!mmi}`;
  }).catch(() => null);
  if (s) nav.push(s);
}
console.log('── NAVEGAÇÃO ──');
console.log([...new Set(nav)].join('\n'), '| url:', p.url());
await b.close();
