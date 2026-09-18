import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

await mkdir('docs/capturas/sis280-programa', { recursive: true });
const nav = await chromium.launch();
const p = await nav.newPage({ viewport: { width: 1440, height: 900 } });
await p.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
await p.goto('http://localhost:3000/sistran-university', { waitUntil: 'domcontentloaded', timeout: 180_000 });
await p.waitForSelector('#university-programa', { timeout: 180_000 });
await p.addStyleTag({
  content:
    'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[class*=motion-banner],[class*=motion-dialog]{display:none!important}',
});
await p.waitForTimeout(1500);

for (const [nome, alvo, recuo] of [
  ['emenda-capa', '#university-programa', 220],
  ['emenda-unidep', '#university-unidep', 220],
]) {
  await p.evaluate(
    ([s, r]) => {
      const e = document.querySelector(s);
      window.scrollTo({ top: Math.round(e.getBoundingClientRect().top + window.scrollY - r), behavior: 'instant' });
    },
    [alvo, recuo],
  );
  await p.waitForTimeout(1200);
  await p.screenshot({
    path: `docs/capturas/sis280-programa/${nome}-1440.png`,
    clip: { x: 0, y: recuo - 180, width: 1440, height: 360 },
  });
  console.log(nome);
}
await nav.close();
