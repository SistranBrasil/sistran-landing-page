/* Sonda permanente do gate global de rotas.
 * Uso: LOADING_GLOBAL_BASE_URL=http://localhost:3998 node docs/medidas/loading-global/auditar.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.LOADING_GLOBAL_BASE_URL ?? 'http://localhost:3998';
const outputDir = 'docs/medidas/loading-global';
const failures = [];
const results = {};

function assert(condition, message) {
  if (!condition) failures.push(message);
}

async function state(page) {
  return page.locator('[data-route-content]').evaluate((content) => ({
    path: content.getAttribute('data-route-path'),
    busy: content.getAttribute('aria-busy'),
    inert: content.hasAttribute('inert'),
    openingReady: content.getAttribute('data-route-opening-ready'),
    mapReady: content.getAttribute('data-route-map-ready'),
    timedOut: content.getAttribute('data-route-timeout'),
    overlays: document.querySelectorAll('[data-route-loading]').length,
    contactOverlays: document.querySelectorAll('[data-contact-loading]').length,
    scrollLocked: getComputedStyle(document.documentElement).overflow === 'hidden',
  }));
}

async function enter(page, route, name, capture = false) {
  await page.goto(`${baseURL}${route}`, { waitUntil: 'domcontentloaded' });
  const overlay = page.locator('[data-route-loading]');
  await overlay.waitFor({ state: 'visible' });
  const initial = await state(page);
  if (capture) await page.screenshot({ path: path.join(outputDir, `${name}-inicio.png`) });
  await overlay.waitFor({ state: 'detached', timeout: 12_000 });
  const reveal = await state(page);
  if (capture) await page.screenshot({ path: path.join(outputDir, `${name}-reveal.png`) });
  assert(initial.busy === 'true' && initial.inert, `${name}: não iniciou busy/inert`);
  assert(initial.overlays === 1, `${name}: quantidade inicial de overlays = ${initial.overlays}`);
  assert(initial.scrollLocked, `${name}: scroll não travou`);
  assert(reveal.busy === 'false' && !reveal.inert, `${name}: não liberou busy/inert`);
  assert(reveal.overlays === 0 && !reveal.scrollLocked, `${name}: overlay/scroll lock não limpou`);
  return { initial, reveal };
}

async function context(browser, viewport, reducedMotion = 'no-preference', preference = 'full') {
  const value = await browser.newContext({ viewport, reducedMotion });
  await value.addInitScript((motionPreference) => {
    localStorage.setItem('sistran-motion-preference', motionPreference);
    localStorage.setItem('sistran-motion-preference-seen', '1');
  }, preference);
  return value;
}

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch();

try {
  const hardContext = await context(browser, { width: 1440, height: 900 });
  for (const [route, name, capture] of [
    ['/', 'home-1440', true],
    ['/sistran-labs', 'hero-image', false],
    ['/solucoes', 'hero-video', false],
    ['/blog', 'texto', false],
    ['/contato', 'contato-1440', true],
    ['/admin/entrar', 'admin', false],
  ]) {
    const page = await hardContext.newPage();
    results[`hard:${route}`] = await enter(page, route, name, capture);
    if (route === '/') {
      results.homeIntroVisibleAfterReveal = await page.locator('.mmi-root:not([hidden])').count();
      assert(results.homeIntroVisibleAfterReveal === 0, 'home: intro apareceu como segundo splash');
    }
    if (route === '/contato') {
      assert(results[`hard:${route}`].initial.mapReady === 'false', 'contato: não esperou mapa');
      assert(
        results[`hard:${route}`].reveal.mapReady === 'true' ||
          results[`hard:${route}`].reveal.timedOut === 'true',
        'contato: liberou sem mapReady nem timeout',
      );
      assert(results[`hard:${route}`].initial.contactOverlays === 0, 'contato: overlay legado duplicado');
    }
    await page.close();
  }
  await hardContext.close();

  const delayContext = await context(browser, { width: 1440, height: 900 });
  await delayContext.route('**/images/sistran-labs/labs-hero.webp', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 4_000));
    await route.continue();
  });
  const delayed = await delayContext.newPage();
  await delayed.goto(`${baseURL}/sistran-labs`, { waitUntil: 'domcontentloaded' });
  await delayed.locator('[data-route-loading]').waitFor({ state: 'visible' });
  await delayed.waitForTimeout(200);
  results.delayedMedia = await state(delayed);
  assert(results.delayedMedia.openingReady === 'false', 'mídia atrasada: gate não aguardou hero');
  await delayed.locator('[data-route-loading]').waitFor({ state: 'detached', timeout: 7_000 });
  results.delayedMediaReveal = await state(delayed);
  assert(results.delayedMediaReveal.timedOut === 'false', 'mídia atrasada: caiu no timeout');
  await delayContext.close();

  const softContext = await context(browser, { width: 1440, height: 900 });
  const soft = await softContext.newPage();
  await soft.goto(`${baseURL}/blog`, { waitUntil: 'domcontentloaded' });
  await soft.locator('[data-route-loading]').waitFor({ state: 'detached', timeout: 5_000 });
  await soft.locator('a[href="/solucoes"]').first().click();
  await soft.locator('[data-route-loading]').waitFor({ state: 'visible' });
  results.soft = await state(soft);
  await soft.locator('[data-route-loading]').waitFor({ state: 'detached', timeout: 5_000 });
  await soft.locator('a[href="/solucoes/match-ai"]').first().click();
  await soft.locator('[data-route-loading]').waitFor({ state: 'visible' });
  await soft.locator('[data-route-loading]').waitFor({ state: 'detached', timeout: 5_000 });
  await soft.locator('a[href="/solucoes/fast"]').first().click();
  await soft.locator('[data-route-loading]').waitFor({ state: 'visible' });
  results.dynamicSameSegment = await state(soft);
  assert(results.soft.path === '/solucoes' && results.soft.busy === 'true', 'soft: ciclo não remontou');
  assert(
    results.dynamicSameSegment.path === '/solucoes/fast' && results.dynamicSameSegment.busy === 'true',
    'dinâmica: ciclo não remontou entre slugs do mesmo segmento',
  );
  await soft.locator('[data-route-loading]').waitFor({ state: 'detached', timeout: 5_000 });
  await soft.goBack();
  await soft.locator('[data-route-loading]').waitFor({ state: 'visible' });
  results.softReturn = await state(soft);
  assert(results.softReturn.busy === 'true', 'retorno: ciclo não remontou');
  await softContext.close();

  const mobileContext = await context(browser, { width: 390, height: 844 });
  const mobile = await mobileContext.newPage();
  results.mobileNonContact = await enter(
    mobile,
    '/sistran-labs',
    'hero-image-390',
    true,
  );
  await mobileContext.close();

  for (const variant of [
    { name: 'sistema', reducedMotion: 'reduce', preference: 'system' },
    { name: 'manual', reducedMotion: 'no-preference', preference: 'reduce' },
  ]) {
    const reducedContext = await context(
      browser,
      { width: 390, height: 844 },
      variant.reducedMotion,
      variant.preference,
    );
    const page = await reducedContext.newPage();
    await page.goto(`${baseURL}/contato`, { waitUntil: 'domcontentloaded' });
    const overlay = page.locator('[data-route-loading]');
    await overlay.waitFor({ state: 'visible' });
    results[`reduce:${variant.name}`] = {
      ...(await state(page)),
      transitionDuration: await overlay.evaluate((node) => getComputedStyle(node).transitionDuration),
      signalAnimation: await overlay
        .locator('span')
        .last()
        .evaluate((node) => getComputedStyle(node, '::after').animationName),
    };
    await page.screenshot({ path: path.join(outputDir, `contato-reduce-${variant.name}-390.png`) });
    assert(
      Number.parseFloat(results[`reduce:${variant.name}`].transitionDuration) <= 0.00001,
      `reduce ${variant.name}: fade não foi removido`,
    );
    assert(
      results[`reduce:${variant.name}`].signalAnimation === 'none',
      `reduce ${variant.name}: sinal ainda anima`,
    );
    await overlay.waitFor({ state: 'detached', timeout: 12_000 });
    if (variant.name === 'sistema') {
      await page.screenshot({ path: path.join(outputDir, 'contato-reveal-390.png') });
    }
    await reducedContext.close();
  }

  const timeoutContext = await context(browser, { width: 1440, height: 900 });
  await timeoutContext.addInitScript(() => {
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = (handler, delay, ...args) =>
      nativeSetTimeout(handler, delay === 10_000 ? 300 : delay, ...args);
  });
  await timeoutContext.route(/\/images\/.*\.(?:webp|png|jpe?g)(?:\?.*)?$/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2_000));
    await route.continue();
  });
  const timeout = await timeoutContext.newPage();
  await timeout.goto(`${baseURL}/sistran-labs`, { waitUntil: 'domcontentloaded' });
  await timeout.locator('[data-route-loading]').waitFor({ state: 'detached', timeout: 3_000 });
  results.timeoutAccelerated = await state(timeout);
  assert(results.timeoutAccelerated.timedOut === 'true', 'timeout acelerado: não liberou pelo teto');
  await timeoutContext.close();
} finally {
  await browser.close();
}

const output = { baseURL, failures, results };
await writeFile(path.join(outputDir, 'resultado.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
console.log(failures.length ? `REPROVADO: ${failures.length} falha(s)` : 'APROVADO: nenhuma falha');
process.exitCode = failures.length ? 1 : 0;
