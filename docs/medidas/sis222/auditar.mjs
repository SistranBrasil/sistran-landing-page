/* SIS-222 — sonda permanente do gate exclusivo de /contato.
 *
 * Uso:
 *   SIS222_BASE_URL=http://localhost:3998 node docs/medidas/sis222/auditar.mjs
 *
 * As capturas são espelhadas em docs/medidas/sis222 porque docs/capturas é
 * ignorado pelo repositório.
 */
import { chromium } from 'playwright';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.SIS222_BASE_URL ?? 'http://localhost:3998';
const capturesDir = 'docs/capturas/sis222';
const measuresDir = 'docs/medidas/sis222';
const failures = [];
const results = {};

function assert(condition, message) {
  if (!condition) failures.push(message);
}

async function capture(page, name) {
  const source = path.join(capturesDir, `${name}.png`);
  await page.screenshot({ path: source });
  await copyFile(source, path.join(measuresDir, `${name}.png`));
}

async function gateState(page) {
  return page.locator('[data-contact-content]').evaluate((content) => ({
    busy: content.getAttribute('aria-busy'),
    inert: content.hasAttribute('inert'),
    heroReady: content.getAttribute('data-contact-hero-ready'),
    mapReady: content.getAttribute('data-contact-map-ready'),
    timedOut: content.getAttribute('data-contact-timeout'),
    scrollLocked: getComputedStyle(document.documentElement).overflow === 'hidden',
    provider: document.querySelector('[data-map-provider]')?.getAttribute('data-map-provider'),
  }));
}

async function delayedContactContext(browser, viewport, reducedMotion = 'no-preference', preference = 'full') {
  const context = await browser.newContext({ viewport, reducedMotion });
  await context.addInitScript((value) => {
    localStorage.setItem('sistran-motion-preference', value);
    localStorage.setItem('sistran-motion-preference-seen', '1');
  }, preference);
  await context.route('**/images/contato/contato-hero.webp', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2_500));
    await route.continue();
  });
  await context.route('https://tiles.openfreemap.org/planet', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1_200));
    await route.continue();
  });
  return context;
}

await mkdir(capturesDir, { recursive: true });
await mkdir(measuresDir, { recursive: true });

const browser = await chromium.launch();

try {
  /* Hard load: o hero atrasado mantém o gate visível e prova o acoplamento ao
     sinal real. Depois, mapReady só nasce do idle do provedor ou do limiar raster. */
  const hardContext = await delayedContactContext(browser, { width: 1440, height: 900 });
  const hard = await hardContext.newPage();
  await hard.goto(`${baseURL}/contato`, { waitUntil: 'domcontentloaded' });
  await hard.locator('[data-contact-loading]').waitFor({ state: 'visible' });
  await hard.waitForFunction(() => getComputedStyle(document.documentElement).overflow === 'hidden');
  results.hardInitial = await gateState(hard);
  results.hardInitial.overlay = await hard.locator('[data-contact-loading]').isVisible();
  assert(results.hardInitial.busy === 'true', 'hard: conteúdo não começou aria-busy');
  assert(results.hardInitial.inert, 'hard: conteúdo não começou inert');
  assert(results.hardInitial.scrollLocked, 'hard: scroll não foi travado');
  assert(results.hardInitial.mapReady === 'false', 'hard: gate não esperou o mapa atrasado');
  await capture(hard, 'hard-inicio-1440');

  await hard.locator('[data-contact-loading]').waitFor({ state: 'detached', timeout: 12_000 });
  results.hardReveal = await gateState(hard);
  results.hardReveal.canvas = await hard.locator('.mapa-cartao canvas').count();
  assert(results.hardReveal.busy === 'false', 'hard: aria-busy não foi removido');
  assert(!results.hardReveal.inert, 'hard: inert não foi removido');
  assert(results.hardReveal.heroReady === 'true', 'hard: revelou sem hero pronto');
  assert(results.hardReveal.mapReady === 'true', 'hard: revelou sem mapa pronto');
  assert(results.hardReveal.timedOut === 'false', 'hard: sinais reais só chegaram após timeout');
  assert(results.hardReveal.canvas > 0 || results.hardReveal.provider === 'mosaico', 'hard: mapa não foi pintado');
  await capture(hard, 'hard-reveal-1440');
  await hard.locator('[data-map-provider]').scrollIntoViewIfNeeded();
  await capture(hard, 'hard-mapa-pronto-1440');
  await hardContext.close();

  /* Soft navigation nasce em outra rota para não aproveitar uma montagem de
     /contato. O route handler também desliga o cache HTTP do contexto. */
  const softContext = await delayedContactContext(browser, { width: 1440, height: 900 });
  const soft = await softContext.newPage();
  await soft.goto(`${baseURL}/quem-somos`, { waitUntil: 'domcontentloaded' });
  await soft.locator('a[href="/contato"]').first().click();
  await soft.locator('[data-contact-loading]').waitFor({ state: 'visible' });
  results.softInitial = await gateState(soft);
  assert(results.softInitial.busy === 'true' && results.softInitial.inert, 'soft: gate não reiniciou busy/inert');
  assert(results.softInitial.mapReady === 'false', 'soft: gate não esperou o mapa atrasado');
  await capture(soft, 'soft-inicio-1440');
  await soft.locator('[data-contact-loading]').waitFor({ state: 'detached', timeout: 12_000 });
  results.softReveal = await gateState(soft);
  assert(results.softReveal.mapReady === 'true', 'soft: revelou sem mapa pronto');
  assert(results.softReveal.heroReady === 'true', 'soft: revelou sem hero pronto');
  assert(results.softReveal.timedOut === 'false', 'soft: sinais reais só chegaram após timeout');
  await capture(soft, 'soft-reveal-1440');

  /* Sai de /contato e volta no mesmo contexto: o estado anterior não pode
     sobreviver no cache do App Router nem suprimir o gate da nova entrada. */
  await soft.locator('a[href="/quem-somos"]').first().click();
  await soft.waitForURL('**/quem-somos');
  await soft.locator('a[href="/contato"]').first().click();
  await soft.locator('[data-contact-loading]').waitFor({ state: 'visible' });
  results.softReturnInitial = await gateState(soft);
  assert(
    results.softReturnInitial.busy === 'true' && results.softReturnInitial.inert,
    'soft retorno: gate não remontou busy/inert',
  );
  await capture(soft, 'soft-retorno-inicio-1440');
  await soft.locator('[data-contact-loading]').waitFor({ state: 'detached', timeout: 12_000 });
  results.softReturnReveal = await gateState(soft);
  assert(
    results.softReturnReveal.heroReady === 'true' &&
      results.softReturnReveal.mapReady === 'true' &&
      results.softReturnReveal.timedOut === 'false',
    'soft retorno: revelou sem os dois sinais reais',
  );
  await capture(soft, 'soft-retorno-reveal-1440');
  await softContext.close();

  /* Timeout real: sem chave/query/backdoor de produção. A sonda paga os 10 s
     uma vez para também medir a janela prescrita. */
  const timeoutContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await timeoutContext.route('**/images/contato/contato-hero.webp', (route) => route.abort());
  await timeoutContext.route('**/tiles.openfreemap.org/**', (route) => route.abort());
  const timeoutPage = await timeoutContext.newPage();
  await timeoutPage.goto(`${baseURL}/contato`, { waitUntil: 'domcontentloaded' });
  await timeoutPage.locator('[data-contact-loading]').waitFor({ state: 'visible' });
  const timeoutStartedAt = Date.now();
  await timeoutPage.locator('[data-contact-loading]').waitFor({ state: 'detached', timeout: 12_000 });
  results.timeout = await gateState(timeoutPage);
  results.timeout.elapsedMs = Date.now() - timeoutStartedAt;
  assert(results.timeout.timedOut === 'true', 'timeout: rota não registrou expiração');
  assert(results.timeout.busy === 'false' && !results.timeout.inert, 'timeout: rota permaneceu presa');
  assert(
    results.timeout.elapsedMs >= 8_000 && results.timeout.elapsedMs <= 12_000,
    `timeout: duração fora de 8–12 s (${results.timeout.elapsedMs} ms)`,
  );
  await capture(timeoutPage, 'timeout-liberado-1440');
  await timeoutContext.close();

  for (const variant of [
    { name: 'sistema', reducedMotion: 'reduce', preference: 'system' },
    { name: 'manual', reducedMotion: 'no-preference', preference: 'reduce' },
  ]) {
    const context = await delayedContactContext(
      browser,
      { width: 390, height: 844 },
      variant.reducedMotion,
      variant.preference,
    );
    const page = await context.newPage();
    await page.goto(`${baseURL}/contato`, { waitUntil: 'domcontentloaded' });
    const overlay = page.locator('[data-contact-loading]');
    await overlay.waitFor({ state: 'visible' });
    await page.waitForFunction(() => getComputedStyle(document.documentElement).overflow === 'hidden');
    results[`reduce-${variant.name}`] = {
      ...(await gateState(page)),
      transitionDuration: await overlay.evaluate((node) => getComputedStyle(node).transitionDuration),
      signalAnimation: await overlay
        .locator('span')
        .last()
        .evaluate((node) => getComputedStyle(node, '::after').animationName),
    };
    assert(
      results[`reduce-${variant.name}`].mapReady === 'false',
      `reduce ${variant.name}: gate deixou de esperar o mapa atrasado`,
    );
    assert(
      Number.parseFloat(results[`reduce-${variant.name}`].transitionDuration) <= 0.00001,
      `reduce ${variant.name}: saída ainda tem transição perceptível`,
    );
    assert(
      results[`reduce-${variant.name}`].signalAnimation === 'none',
      `reduce ${variant.name}: sinal ainda anima`,
    );
    await capture(page, `reduce-${variant.name}-390`);
    await overlay.waitFor({ state: 'detached', timeout: 12_000 });
    if (variant.name === 'sistema') {
      await capture(page, 'reduce-sistema-reveal-390');
      await page.locator('[data-map-provider]').scrollIntoViewIfNeeded();
      await capture(page, 'reduce-sistema-mapa-pronto-390');
    }
    await context.close();
  }

  const isolatedContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const isolated = await isolatedContext.newPage();
  await isolated.goto(`${baseURL}/quem-somos`, { waitUntil: 'domcontentloaded' });
  results.isolation = { overlays: await isolated.locator('[data-contact-loading]').count() };
  assert(results.isolation.overlays === 0, 'isolamento: overlay apareceu fora de /contato');
  await isolatedContext.close();
} finally {
  await browser.close();
}

const output = { baseURL, failures, results };
await writeFile(path.join(measuresDir, 'resultado.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
console.log(failures.length ? `REPROVADO: ${failures.length} falha(s)` : 'APROVADO: nenhuma falha');
process.exitCode = failures.length ? 1 : 0;
