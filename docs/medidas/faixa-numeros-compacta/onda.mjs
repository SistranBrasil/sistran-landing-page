/**
 * Régua da onda e do hover dos cartões de números de `/contato` (pedido de 11/09).
 *
 * Cinco perguntas, e cada uma existe porque o defeito correspondente é invisível
 * numa captura estática:
 *
 *  1 · A ONDA ANDA? Amostra `transform` de cada cartão em 24 instantes e mede a
 *      amplitude (o maior menos o menor `m42`). Alvo: ~14px, que é o ±7px do CSS.
 *      ⚠️ Lê-se a MATRIZ, e não `getPropertyValue('--…')`: propriedade
 *      personalizada não registrada devolve o texto do token, não um número — a
 *      armadilha que já fez uma sonda desta faixa medir zero em todo quadro.
 *  2 · É ONDA OU TREMOR? Num MESMO instante, os sete `m42` têm de ser distintos.
 *      Sete cartões em fase idêntica é o defeito que o `--ind-fase` evita, e ele
 *      passaria como "animando" em qualquer medida por cartão isolado.
 *  3 · O PONTEIRO PARA A ONDA? `animationPlayState` com o mouse sobre o cartão —
 *      é o mecanismo de parada que a WCAG 2.2.2 exige para movimento infinito.
 *  4 · O HOVER PINTA E CONTRASTA? Lê as tintas computadas no estado de hover e
 *      compõe cada uma (com o alfa dela) sobre as DUAS paradas do degradê navy do
 *      cartão, relatando o pior dos dois. Texto pequeno (rótulo 13,7px, contador
 *      0,72rem) não tem isenção: o piso é 4,5:1.
 *  5 · OS DOIS CANAIS DE MOVIMENTO REDUZIDO PARAM A ONDA? A preferência do
 *      sistema e o botão da interface (`html[data-motion='reduce']`), medidos
 *      separadamente — uma `@media` não é interceptável por JavaScript, então um
 *      canal não prova o outro.
 *
 * Rodar com o dev de pé:  node docs/medidas/faixa-numeros-compacta/onda.mjs
 */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE ?? 'http://localhost:3999';

/* Luminância relativa e razão de contraste da WCAG, com o texto composto sobre o
   fundo pelo alfa dele (a tinta do rótulo é branco a 88%, não branco). */
const canal = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const compor = ([r, g, b, a], fundo) => [
  r * a + fundo[0] * (1 - a),
  g * a + fundo[1] * (1 - a),
  b * a + fundo[2] * (1 - a),
];
const razao = (frente, fundo) => {
  const [a, b] = [lum(compor(frente, fundo)), lum(fundo)].sort((x, y) => y - x);
  return Number(((a + 0.05) / (b + 0.05)).toFixed(2));
};
const tinta = (css) => {
  const n = css.match(/[\d.]+/g).map(Number);
  return [n[0], n[1], n[2], n[3] ?? 1];
};

const navegador = await chromium.launch();

async function abrir({ reduce = false, botao = false } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduce ? 'reduce' : 'no-preference',
  });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const page = await ctx.newPage();
  await page.goto(`${BASE}/contato`, { waitUntil: 'networkidle' });
  if (botao) await page.evaluate(() => (document.documentElement.dataset.motion = 'reduce'));
  await page.locator('.contato-indicadores').scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  return { ctx, page };
}

/** `m42` de cada cartão, num instante. */
const alturas = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('.contato-indicador')].map(
      (c) =>
        Math.round(
          new DOMMatrixReadOnly(getComputedStyle(c).transform).m42 * 100,
        ) / 100,
    ),
  );

const resultado = {};

// ── 1 e 2 · a onda ────────────────────────────────────────────────────────────
{
  const { ctx, page } = await abrir();
  const quadros = [];
  for (let i = 0; i < 24; i += 1) {
    quadros.push(await alturas(page));
    await page.waitForTimeout(200);
  }
  const porCartao = quadros[0].map((_, c) => quadros.map((q) => q[c]));
  resultado.onda = {
    amplitudePorCartao: porCartao.map(
      (serie) => Math.round((Math.max(...serie) - Math.min(...serie)) * 10) / 10,
    ),
    fasesDistintasNoMesmoInstante: new Set(quadros[3].map((v) => Math.round(v))).size,
    instanteDeExemplo: quadros[3],
    animacao: await page.evaluate(() => {
      const cs = getComputedStyle(document.querySelector('.contato-indicador'));
      return { nome: cs.animationName, duracao: cs.animationDuration, estado: cs.animationPlayState };
    }),
  };
  await ctx.close();
}

// ── 3 e 4 · o ponteiro ────────────────────────────────────────────────────────
{
  const { ctx, page } = await abrir();
  /* ⚠️ NÃO SE USA `locator.hover()` AQUI, e o motivo é a própria onda: o
     Playwright exige que o alvo esteja ESTÁVEL (duas medidas iguais da caixa) antes
     de clicar ou apontar, e um cartão que sobe e desce para sempre nunca satisfaz
     isso — a primeira versão desta sonda estourou em timeout de 30s repetindo
     "element is not stable". Mover o mouse para o centro da caixa não passa por
     essa espera. O timeout, por si, já era prova de que a animação anda. */
  const caixa = await page.locator('.contato-indicador').nth(1).boundingBox();
  await page.mouse.move(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
  await page.waitForTimeout(600);
  const lido = await page.evaluate(() => {
    const c = document.querySelectorAll('.contato-indicador')[1];
    const cs = getComputedStyle(c);
    const num = c.querySelector('.contato-indicador-valor span:not(.contato-indicador-mais)');
    return {
      estado: cs.animationPlayState,
      fundo: cs.backgroundImage,
      borda: cs.borderTopColor,
      numero: getComputedStyle(num).color,
      mais: getComputedStyle(c.querySelector('.contato-indicador-mais')).color,
      rotulo: getComputedStyle(c.querySelector('.contato-indicador-rotulo')).color,
      etapa: getComputedStyle(c.querySelector('.contato-indicador-etapa')).color,
      no: getComputedStyle(c.querySelector('.contato-indicador-no')).backgroundColor,
    };
  });
  // As duas paradas do degradê navy do cartão em hover, tiradas do próprio valor lido.
  const paradas = [...lido.fundo.matchAll(/rgb\(([\d\s,]+)\)/g)]
    .map((m) => m[1].split(',').map((n) => Number(n.trim())))
    .slice(0, 2);
  resultado.hover = {
    animacaoPausada: lido.estado === 'paused',
    fundo: lido.fundo,
    tintas: { numero: lido.numero, mais: lido.mais, rotulo: lido.rotulo, etapa: lido.etapa, no: lido.no },
    contrastePiorParada: paradas.length
      ? {
          numero: Math.min(...paradas.map((p) => razao(tinta(lido.numero), p))),
          mais: Math.min(...paradas.map((p) => razao(tinta(lido.mais), p))),
          rotulo: Math.min(...paradas.map((p) => razao(tinta(lido.rotulo), p))),
          etapa: Math.min(...paradas.map((p) => razao(tinta(lido.etapa), p))),
        }
      : '(degradê não interpretado)',
  };
  await page.screenshot({ path: join(AQUI, 'hover-1440x900.png') });
  await ctx.close();
}

// ── 5 · os dois canais ────────────────────────────────────────────────────────
for (const [nome, opcoes] of [
  ['preferenciaDoSistema', { reduce: true }],
  ['botaoDaInterface', { botao: true }],
]) {
  const { ctx, page } = await abrir(opcoes);
  const a = await alturas(page);
  await page.waitForTimeout(1200);
  const b = await alturas(page);
  resultado[nome] = {
    animationName: await page.evaluate(
      () => getComputedStyle(document.querySelector('.contato-indicador')).animationName,
    ),
    deslocamentoMaximo: Math.max(...[...a, ...b].map((v) => Math.abs(v))),
    parado: a.every((v, i) => v === b[i]),
  };
  await ctx.close();
}

await navegador.close();
writeFileSync(join(AQUI, 'onda.json'), JSON.stringify(resultado, null, 2));
console.log(JSON.stringify(resultado, null, 2));
