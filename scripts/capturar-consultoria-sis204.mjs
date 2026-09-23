/**
 * SIS-204 — captura a seção «Consultoria» de `/solucoes` nas três larguras, para
 * comparar com a mock `public/imagensexemplo/consultoria.png` e com as capturas da
 * entrega perdida (`docs/medidas/sis204-consultoria-<largura>.png`).
 *
 * Só olho resolve «lê como a mock»; a sonda de números é
 * `scripts/medir-consultoria-sis204.mjs`.
 *
 * Uso: node scripts/capturar-consultoria-sis204.mjs [sufixo]   (padrão: regravado)
 */

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = 'http://localhost:3000';
const SUFIXO = process.argv[2] ?? 'regravado';
const LARGURAS = [390, 768, 1440];

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

for (const largura of LARGURAS) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 1000 } });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const pagina = await ctx.newPage();
  await pagina.goto(`${BASE}/solucoes`, { waitUntil: 'domcontentloaded' });
  await pagina.waitForSelector('[data-route-liberado="true"]', { timeout: 120000 });
  await pagina.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  const secao = pagina.locator('#consultoria');
  await secao.scrollIntoViewIfNeeded();
  /* Esperar o reveal acender E a foto chegar: capturar antes disso fotografaria o
     estado de entrada (16px deslocado) ou um buraco no lugar da imagem. */
  await pagina.waitForFunction(
    () => {
      const img = document.querySelector('.consultoria-foto-img');
      return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
    },
    null,
    { timeout: 60000 },
  );
  await pagina.waitForTimeout(1500);
  await secao.screenshot({ path: `docs/medidas/sis204-consultoria-${SUFIXO}-${largura}.png` });
  console.log(`capturado ${largura}`);
  await ctx.close();
}

await navegador.close();
