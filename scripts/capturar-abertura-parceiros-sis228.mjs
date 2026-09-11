/**
 * SIS-228 — capturas da abertura de /parceiros-e-implementacoes em 390/1440/1920.
 *
 * Uso (com o site no ar):
 *   MARCA=antes URL_BASE=http://localhost:3999 node scripts/capturar-abertura-parceiros-sis228.mjs
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
  await pagina.goto(`${URL_BASE}/parceiros-e-implementacoes`, {
    waitUntil: 'domcontentloaded',
    timeout: 180_000,
  });
  await pagina.waitForSelector('.hero-backdrop--parceiros h1', { timeout: 180_000 });
  /* A capa é `priority`, mas no `next dev` ela ainda está sendo baixada no
     primeiro acesso; e a entrada tem animação de aparição. Fotografar antes disso
     mostra o fundo, não a capa. */
  await pagina.waitForTimeout(3000);
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}`,
  });
  await pagina.waitForTimeout(300);
  await pagina.screenshot({ path: `${PASTA}/sis228-${MARCA}-${w}.png` });
  console.log(`${w}: capturado`);
  await contexto.close();
}
await navegador.close();
