/**
 * SIS-224 — capturas da abertura de /trabalhe-conosco em 390/1440/1920.
 *
 * Uso (com o site no ar):
 *   MARCA=antes node scripts/capturar-abertura-carreira-sis224.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const MARCA = process.env.MARCA ?? 'antes';
const LARGURAS = [390, 1440, 1920];
const PASTA = 'docs/capturas';
await mkdir(PASTA, { recursive: true });

const navegador = await chromium.launch();
for (const w of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: w, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  await contexto.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/trabalhe-conosco`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  });
  await pagina.waitForSelector('.hero-backdrop--carreira h1', { timeout: 180_000 });
  /* O laço tem 192 quadros e no `next dev` ele ainda está sendo baixado no
     primeiro acesso: fotografar antes disso mede o pôster, não o take. E o quadro
     é PARADO num instante do laço — por isso o vídeo é travado num tempo fixo,
     senão duas capturas nunca comparam o mesmo quadro. */
  await pagina.waitForTimeout(3500);
  await pagina.evaluate(() => {
    const v = document.querySelector('.hero-backdrop--carreira video');
    if (v) {
      v.pause();
      v.currentTime = 2;
    }
  });
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}`,
  });
  await pagina.waitForTimeout(400);
  await pagina.screenshot({ path: `${PASTA}/sis224-${MARCA}-${w}.png` });
  /* A emenda com a `Social`: o pé do véu contra o topo da seção de baixo. Ela cai
     fora da primeira tela, então a página rola até lá — clipe fora da imagem é
     erro, não recorte vazio. */
  const emenda = await pagina.evaluate(() => {
    const veu = document.querySelector('.hero-backdrop--carreira .hero-backdrop-veu');
    if (!veu) return null;
    const abs = veu.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo(0, Math.max(0, abs - 160));
    return Math.round(abs - window.scrollY);
  });
  await pagina.waitForTimeout(500);
  if (emenda !== null) {
    await pagina.screenshot({
      path: `${PASTA}/sis224-${MARCA}-${w}-emenda.png`,
      clip: { x: 0, y: Math.max(0, emenda - 160), width: w, height: 320 },
    });
  }
  console.log(`${w}: capturado · pé do véu em y=${emenda}`);
  await contexto.close();
}
await navegador.close();
