/* SIS-218 — sonda do palco fixo dos parceiros (`#parceiros` / PartnerTerminalCards).
 *
 * POR QUE ESTA SONDA MORA EM `docs/medidas/` E NÃO EM `scripts/`.
 * O `.gitignore` desta base ignora `sonda*.mjs` (linha 23) e `docs/capturas/`
 * (linha 24) — a política escrita ali é que sonda e captura são SAÍDA DE
 * INSTRUMENTO, não fonte. A consequência prática é que uma sonda em
 * `scripts/sondar-*.mjs` fica invisível para qualquer busca que respeite o
 * ignore (foi exatamente o que aconteceu na primeira volta desta issue: os
 * arquivos existiam no disco e o `Glob` devolvia zero). `docs/medidas/` NÃO é
 * ignorado, e já é onde as sondas das issues vizinhas moram
 * (`sis203/auditar.mjs`, `sis209/auditar.mjs`, `sis191/evidencias.mjs`).
 *
 * AS CAPTURAS SÃO GRAVADAS DUAS VEZES, e é de propósito:
 *   • `docs/capturas/sis218/…` — os nomes exatos pedidos pela conferência;
 *     este diretório continua ignorado pela política acima.
 *   • `docs/medidas/sis218/…`  — o espelho VISÍVEL, que sobrevive ao ignore.
 *
 * ── COMO A CAPTURA "ANTES" É PRODUZIDA ─────────────────────────────────────
 * O código da SIS-218 NÃO é revertido para fotografar o estado anterior. A
 * sonda abre um contexto extra e injeta, antes do primeiro paint, a folha
 * `CSS_ANTES` abaixo, que neutraliza — só naquela aba — as três regras do bloco
 * `@media (min-width: 1024px) and (prefers-reduced-motion: no-preference)` de
 * `partner-terminal-cards.css`: a altura de percurso e o `overflow: clip` da
 * seção, o `position: sticky` do palco e o `translate3d` da trilha. O resultado
 * é o layout que a rota tinha antes desta issue: seção em fluxo, palco estático
 * e trilha com `overflow-x: auto` nativo.
 *
 * O QUE O OVERRIDE NÃO FAZ, e a sonda registra isso em vez de esconder: ele é
 * CSS puro, então o JS continua no modo desktop e `data-pinned` permanece
 * `"true"` no DOM (`pinnedAttr` no resultado). Desligar o relógio pediria mexer
 * no componente. O que a captura precisa provar é o ENQUADRAMENTO anterior, e
 * o `stagePosition: static` + `trackOverflowX: auto` medidos ao lado da imagem
 * são a prova de que é ele que está na foto.
 *
 * Uso:  node docs/medidas/sis218/auditar.mjs
 *       SIS218_BASE_URL=http://localhost:3000 node docs/medidas/sis218/auditar.mjs
 */

import { chromium } from 'playwright';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.SIS218_BASE_URL ?? 'http://localhost:3998';
const route = `${baseURL}/parceiros-e-implementacoes`;

const DIR_CAPTURAS = 'docs/capturas/sis218';
const DIR_MEDIDAS = 'docs/medidas/sis218';

/* Neutraliza as regras da SIS-218 nesta aba. `!important` porque é
   instrumentação de uma sessão, não estilo de produção: o alvo é vencer o
   bloco de media query sem depender da ordem das folhas. */
const CSS_ANTES = `
  .partner-terminal {
    height: auto !important;
    padding-block: 1.5rem 5rem !important;
    overflow: visible !important;
  }
  .partner-terminal__stage {
    position: static !important;
    display: block !important;
    height: auto !important;
    padding-top: 0 !important;
    overflow: visible !important;
  }
  .partner-terminal__track {
    overflow-x: auto !important;
    transform: none !important;
    margin-top: 1.5rem !important;
  }
`;

const capturas = [];
const falhas = [];

function assert(condicao, mensagem) {
  if (!condicao) falhas.push(mensagem);
  return Boolean(condicao);
}

async function fotografar(page, nome) {
  const destino = path.join(DIR_CAPTURAS, `${nome}.png`);
  await page.screenshot({ path: destino });
  await copyFile(destino, path.join(DIR_MEDIDAS, `${nome}.png`));
  capturas.push(destino);
}

async function abrir(browser, viewport, { preferencia = 'full', reducedMotion = 'no-preference', cssAntes = false } = {}) {
  const context = await browser.newContext({ viewport, reducedMotion });
  await context.addInitScript((valor) => {
    localStorage.setItem('sistran-motion-preference', valor);
    localStorage.setItem('sistran-motion-preference-seen', '1');
  }, preferencia);
  if (cssAntes) {
    await context.addInitScript((css) => {
      addEventListener('DOMContentLoaded', () => {
        const folha = document.createElement('style');
        folha.dataset.sis218 = 'override-antes';
        folha.textContent = css;
        document.head.append(folha);
      });
    }, CSS_ANTES);
  }
  const page = await context.newPage();
  await page.goto(route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  return { context, page };
}

/* Rolagem sem inércia: a rota usa Lenis, e um `window.scrollTo` cru mediria a
   posição enquanto a biblioteca ainda está interpolando. */
async function rolarPara(page, y) {
  await page.evaluate((alvo) => {
    if (window.__lenis?.scrollTo) window.__lenis.scrollTo(alvo, { immediate: true, force: true });
    else window.scrollTo(0, alvo);
  }, y);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));
  await page.waitForTimeout(120);
}

async function medir(page) {
  return page.locator('.partner-terminal').evaluate((secao) => {
    const palco = secao.querySelector('.partner-terminal__stage');
    const trilha = secao.querySelector('.partner-terminal__track');
    const cards = Array.from(secao.querySelectorAll('.partner-terminal__card'));
    const primeiro = cards[0]?.getBoundingClientRect();
    const ultimo = cards.at(-1)?.getBoundingClientRect();
    const arredondar = (n) => (n === null ? null : Math.round(n * 100) / 100);
    return {
      pinnedAttr: secao.dataset.pinned,
      cards: cards.length,
      secaoTop: arredondar(secao.getBoundingClientRect().top),
      secaoAltura: arredondar(secao.getBoundingClientRect().height),
      palcoTop: arredondar(palco.getBoundingClientRect().top),
      stagePosition: getComputedStyle(palco).position,
      trackOverflowX: getComputedStyle(trilha).overflowX,
      trackTransformX: arredondar(new DOMMatrixReadOnly(getComputedStyle(trilha).transform).m41),
      percurso: arredondar(Number.parseFloat(getComputedStyle(secao).getPropertyValue('--partner-travel')) || 0),
      centroPrimeiro: arredondar(primeiro ? primeiro.left + primeiro.width / 2 : null),
      centroUltimo: arredondar(ultimo ? ultimo.left + ultimo.width / 2 : null),
      centroJanela: innerWidth / 2,
      scrollWidth: trilha.scrollWidth,
      clientWidth: trilha.clientWidth,
    };
  });
}

const topoDaSecao = (page) =>
  page.locator('.partner-terminal').evaluate((n) => scrollY + n.getBoundingClientRect().top);

await mkdir(DIR_CAPTURAS, { recursive: true });
await mkdir(DIR_MEDIDAS, { recursive: true });

const browser = await chromium.launch();
const r = {};

try {
  /* ── ANTES (override em runtime, ver o cabeçalho) ────────────────────── */
  const antes = await abrir(browser, { width: 1440, height: 900 }, { cssAntes: true });
  await rolarPara(antes.page, await topoDaSecao(antes.page));
  r.antes1440 = await medir(antes.page);
  r.antes1440.observacao =
    'override de CSS injetado pela sonda; data-pinned segue "true" porque o JS não foi tocado';
  assert(r.antes1440.stagePosition === 'static', 'ANTES: override não devolveu o palco ao fluxo');
  assert(r.antes1440.trackOverflowX === 'auto', 'ANTES: override não devolveu o overflow nativo');
  await fotografar(antes.page, 'antes-1440');
  await antes.context.close();

  /* ── DEPOIS, 1440: início, meio, fim, soltura, filtro, seta ──────────── */
  const desktop = await abrir(browser, { width: 1440, height: 900 });
  const { page } = desktop;
  const y0 = await topoDaSecao(page);

  await rolarPara(page, y0);
  r.depoisInicio = await medir(page);
  assert(r.depoisInicio.pinnedAttr === 'true', 'INÍCIO: desktop não ativou o modo fixo');
  assert(r.depoisInicio.stagePosition === 'sticky', 'INÍCIO: palco não está sticky');
  assert(r.depoisInicio.palcoTop <= 1, 'INÍCIO: palco não encostou no topo');
  assert(
    Math.abs(r.depoisInicio.centroPrimeiro - r.depoisInicio.centroJanela) <= 2,
    'INÍCIO: primeiro card não está centralizado',
  );
  await fotografar(page, 'depois-inicio-1440');

  const percurso = r.depoisInicio.percurso;
  await rolarPara(page, y0 + percurso / 2);
  r.depoisMeio = await medir(page);
  assert(r.depoisMeio.stagePosition === 'sticky', 'MEIO: palco soltou antes da hora');
  assert(r.depoisMeio.palcoTop <= 1, 'MEIO: palco não continuou preso no topo');
  assert(
    Math.abs(Math.abs(r.depoisMeio.trackTransformX) - percurso / 2) <= 3,
    'MEIO: trilha não avançou metade do percurso',
  );
  await fotografar(page, 'depois-meio-1440');

  await rolarPara(page, y0 + percurso);
  r.depoisFinal = await medir(page);
  assert(r.depoisFinal.stagePosition === 'sticky', 'FINAL: palco soltou antes do último card');
  assert(
    Math.abs(r.depoisFinal.centroUltimo - r.depoisFinal.centroJanela) <= 3,
    'FINAL: último card não terminou centralizado',
  );
  await fotografar(page, 'depois-final-1440');

  await rolarPara(page, y0 + percurso + 400);
  r.depoisSoltura = await medir(page);
  assert(r.depoisSoltura.palcoTop < -300, 'SOLTURA: palco não subiu depois do fim do percurso');
  assert(
    Math.abs(Math.abs(r.depoisSoltura.trackTransformX) - percurso) <= 3,
    'SOLTURA: trilha não ficou travada no último card',
  );

  await rolarPara(page, y0);
  await page.getByRole('button', { name: /Cloud e desenvolvimento/i }).click();
  await page.waitForTimeout(400);
  r.filtroCloud = await medir(page);
  assert(r.filtroCloud.cards > 0 && r.filtroCloud.cards < r.depoisInicio.cards, 'FILTRO: fila não encolheu');
  assert(r.filtroCloud.percurso < percurso, 'FILTRO: percurso não foi recalculado');
  assert(
    Math.abs(r.filtroCloud.centroPrimeiro - r.filtroCloud.centroJanela) <= 2,
    'FILTRO: fila filtrada não reiniciou no primeiro card',
  );

  const yAntesDaSeta = await page.evaluate(() => scrollY);
  await page.getByRole('button', { name: 'Próximo parceiro' }).click();
  await page.waitForTimeout(1000);
  r.aposSeta = await medir(page);
  r.aposSeta.deltaScroll = Math.round((await page.evaluate(() => scrollY)) - yAntesDaSeta);
  assert(r.aposSeta.deltaScroll > 0, 'SETA: não avançou a rolagem vertical no modo fixo');
  assert(
    Math.abs(r.aposSeta.deltaScroll - r.filtroCloud.percurso / (r.filtroCloud.cards - 1)) <= 3,
    'SETA: avanço não corresponde a um card',
  );
  assert(
    await page.getByRole('button', { name: 'Parceiro anterior' }).isEnabled(),
    'SETA: índice ativo não foi atualizado',
  );
  await desktop.context.close();

  /* ── MOBILE 390: sem pin, trilha nativa ──────────────────────────────── */
  const mobile = await abrir(browser, { width: 390, height: 844 });
  r.mobile390 = await medir(mobile.page);
  assert(r.mobile390.pinnedAttr === 'false', 'MOBILE: ativou o modo fixo');
  assert(r.mobile390.stagePosition === 'static', 'MOBILE: palco ficou sticky');
  assert(r.mobile390.trackOverflowX === 'auto', 'MOBILE: perdeu a trilha nativa');
  assert(r.mobile390.scrollWidth > r.mobile390.clientWidth, 'MOBILE: conteúdo horizontal inalcançável');
  await rolarPara(mobile.page, await topoDaSecao(mobile.page));
  await fotografar(mobile.page, 'mobile-390');
  await mobile.context.close();

  /* ── A FRONTEIRA DE 1024, nos dois lados ─────────────────────────────── */
  const abaixo = await abrir(browser, { width: 1023, height: 768 });
  r.largura1023 = await medir(abaixo.page);
  assert(r.largura1023.pinnedAttr === 'false', '1023px: ativou o modo fixo');
  assert(r.largura1023.stagePosition === 'static', '1023px: palco ficou sticky');
  await rolarPara(abaixo.page, await topoDaSecao(abaixo.page));
  await fotografar(abaixo.page, 'breakpoint-1023');
  await abaixo.context.close();

  const acima = await abrir(browser, { width: 1024, height: 768 });
  await acima.page
    .waitForFunction(() => document.querySelector('.partner-terminal')?.dataset.pinned === 'true')
    .catch(() => {});
  r.largura1024 = await medir(acima.page);
  assert(r.largura1024.pinnedAttr === 'true', '1024px: não ativou o modo fixo');
  assert(r.largura1024.stagePosition === 'sticky', '1024px: palco não ficou sticky');
  await fotografar(acima.page, 'breakpoint-1024');
  await acima.context.close();

  /* ── OS DOIS CANAIS DE MOVIMENTO REDUZIDO ────────────────────────────── */
  const reduceSistema = await abrir(browser, { width: 1440, height: 900 }, {
    preferencia: 'system',
    reducedMotion: 'reduce',
  });
  r.reduceSistema = await medir(reduceSistema.page);
  assert(r.reduceSistema.pinnedAttr === 'false', 'REDUCE (sistema): manteve o modo fixo');
  assert(r.reduceSistema.stagePosition === 'static', 'REDUCE (sistema): palco ficou sticky');
  assert(r.reduceSistema.trackOverflowX === 'auto', 'REDUCE (sistema): perdeu a trilha nativa');
  await reduceSistema.context.close();

  const reduceManual = await abrir(browser, { width: 1440, height: 900 }, { preferencia: 'reduce' });
  r.reduceManual = await medir(reduceManual.page);
  r.reduceManual.htmlDataMotion = await reduceManual.page.locator('html').getAttribute('data-motion');
  assert(r.reduceManual.htmlDataMotion === 'reduce', 'REDUCE (botão): atributo não foi gravado');
  assert(r.reduceManual.pinnedAttr === 'false', 'REDUCE (botão): manteve o modo fixo');
  assert(r.reduceManual.stagePosition === 'static', 'REDUCE (botão): palco ficou sticky');
  assert(r.reduceManual.trackOverflowX === 'auto', 'REDUCE (botão): perdeu a trilha nativa');
  await reduceManual.context.close();
} finally {
  await browser.close();
}

const saida = { baseURL, capturas, falhas, medidas: r };
await writeFile(path.join(DIR_MEDIDAS, 'resultado.json'), `${JSON.stringify(saida, null, 2)}\n`);
console.log(JSON.stringify(saida, null, 2));
console.log(falhas.length ? `\nREPROVADO: ${falhas.length} falha(s)` : '\nAPROVADO: nenhuma falha');
process.exitCode = falhas.length ? 1 : 0;
