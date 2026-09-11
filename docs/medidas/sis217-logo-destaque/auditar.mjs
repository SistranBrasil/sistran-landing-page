/* Régua do ajuste de 11/09 na SIS-217: logo em destaque e título fora da tela.

   Quatro perguntas, e nenhuma delas se responde por captura:
    · a placa cresceu de fato? (caixa medida nos sete cards)
    · o título sumiu DA TELA sem sumir do documento? Mede-se a caixa do `<h3>`
      (`sr-only` tem 1×1px e fica fora do fluxo) E a presença dele no DOM, com o
      texto dentro. Um dos dois sozinho passaria com o defeito.
    · a logo ainda cabe ao lado do ordinal? Compara a borda direita da placa com
      a borda esquerda do número — encostar é o modo de falhar do teto de 76%.
    · o hover ainda reage, e o movimento reduzido ainda desliga?

   Rodar com o dev de pé:  node docs/medidas/sis217-logo-destaque/auditar.mjs */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE ?? 'http://localhost:3997';

const navegador = await chromium.launch();

async function abrir({ reduce = false } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduce ? 'reduce' : 'no-preference',
  });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const page = await ctx.newPage();
  await page.goto(`${BASE}/solucoes`, { waitUntil: 'networkidle' });
  await page.locator('#tecnologia-disruptiva').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  return { ctx, page };
}

const resultado = {};

{
  const { ctx, page } = await abrir();
  resultado.repouso = await page.evaluate(() =>
    [...document.querySelectorAll('.accel-card')].map((card) => {
      const placa = card.querySelector('.accel-logo').getBoundingClientRect();
      const arte = card.querySelector('.accel-logo__img').getBoundingClientRect();
      const ordinal = card.querySelector('.font-mono').getBoundingClientRect();
      const h3 = card.querySelector('h3');
      const cx = h3.getBoundingClientRect();
      return {
        nomeNoDocumento: h3.textContent,
        tituloVisivel: cx.width > 2 && cx.height > 2,
        placa: [Math.round(placa.width), Math.round(placa.height)],
        arte: [Math.round(arte.width), Math.round(arte.height)],
        folgaAteOrdinal: Math.round(ordinal.left - placa.right),
      };
    }),
  );
  await page.screenshot({ path: join(AQUI, 'solucoes-1440x900.png') });
  /* A grade recortada, e não só a janela: os cards têm 300px de altura mínima e
     a janela de 900px corta a terceira fileira ao meio — o que se quer julgar
     aqui é o card inteiro, do topo da placa ao link. */
  await page
    .locator('#tecnologia-disruptiva .grid')
    .screenshot({ path: join(AQUI, 'grade-1440.png') });

  // Hover no segundo card, pelo mouse (o tilt move o alvo e atrapalha `hover()`).
  const caixa = await page.locator('.accel-card').nth(1).boundingBox();
  await page.mouse.move(caixa.x + caixa.width / 2, caixa.y + 40);
  await page.waitForTimeout(600);
  resultado.hover = await page.evaluate(() => {
    const card = document.querySelectorAll('.accel-card')[1];
    return {
      arte: getComputedStyle(card.querySelector('.accel-logo__img')).transform,
      placa: getComputedStyle(card.querySelector('.accel-logo')).transform,
      ecoOpacidade: getComputedStyle(card.querySelector('.accel-logo__eco')).opacity,
    };
  });
  await page.screenshot({ path: join(AQUI, 'hover-1440x900.png') });
  await ctx.close();
}

for (const [nome, opcoes] of [
  ['preferenciaDoSistema', { reduce: true }],
  ['botaoDaInterface', {}],
]) {
  const { ctx, page } = await abrir(opcoes);
  if (nome === 'botaoDaInterface') {
    await page.evaluate(() => (document.documentElement.dataset.motion = 'reduce'));
  }
  const caixa = await page.locator('.accel-card').nth(1).boundingBox();
  await page.mouse.move(caixa.x + caixa.width / 2, caixa.y + 40);
  await page.waitForTimeout(500);
  resultado[nome] = await page.evaluate(() => {
    const card = document.querySelectorAll('.accel-card')[1];
    return {
      arte: getComputedStyle(card.querySelector('.accel-logo__img')).transform,
      placa: getComputedStyle(card.querySelector('.accel-logo')).transform,
      ecoDisplay: getComputedStyle(card.querySelector('.accel-logo__eco')).display,
    };
  });
  await ctx.close();
}

await navegador.close();
writeFileSync(join(AQUI, 'resultado.json'), JSON.stringify(resultado, null, 2));
console.log(JSON.stringify(resultado, null, 2));
