/**
 * SIS-230 — abertura da seção Premiações em /quem-somos, antes e depois do bloco
 * Celent. Duas larguras: 1440 (a pedida na issue) e 390, porque o critério de
 * mobile é "troféu + logo + texto empilhados sem estouro" e isso não se vê no
 * desktop. Cada foto põe o topo de `#premiacoes` no alto da janela.
 *
 * Uso: MARCA=antes URL_BASE=http://localhost:3999 node scripts/capturar-premiacoes-sis230.mjs
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3000';
const MARCA = process.env.MARCA ?? 'antes';
const PASTA = 'docs/capturas';
await mkdir(PASTA, { recursive: true });

const navegador = await chromium.launch();
for (const largura of [1440, 390]) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}/quem-somos`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await pagina.waitForSelector('#premiacoes', { timeout: 180_000 });
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}`,
  });
  await pagina.waitForTimeout(2500);

  /* O diálogo "Preferências de movimento" abre na primeira visita e cobre o
     meio da tela — na primeira rodada ele tapou justamente o bloco a conferir.
     Aceitar o padrão (movimento normal) é o estado que a issue quer medir. */
  const continuar = pagina.getByRole('button', { name: 'Continuar' });
  if (await continuar.count()) {
    await continuar.first().click();
    await pagina.waitForTimeout(600);
  }

  /* Duas fotos: a abertura (título + Celent) e a continuação (arte LATAM), que
     não cabem na mesma janela de 900px. */
  const topo = await pagina.evaluate(
    () => document.querySelector('#premiacoes').getBoundingClientRect().top + window.scrollY,
  );
  for (const [nome, y] of [
    ['abertura', Math.max(0, topo - 120)],
    ['continuacao', Math.max(0, topo + 620)],
  ]) {
    await pagina.evaluate((alvo) => window.scrollTo(0, alvo), y);
    await pagina.waitForTimeout(1200);
    await pagina.screenshot({ path: `${PASTA}/sis230-${MARCA}-${nome}-${largura}.png` });
    console.log(`${largura} ${nome}: y=${Math.round(y)}`);
  }

  /* Estouro horizontal: o critério de mobile em número. */
  const estouro = await pagina.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  console.log(`  ${largura} scrollWidth=${estouro.scrollW} clientWidth=${estouro.clientW}`);
  await contexto.close();
}
await navegador.close();
