/**
 * Régua das DUAS seções de números depois do pedido de 11/09: a faixa de
 * `/contato` volta a mostrar os sete de uma vez (sem percurso preso) e o painel
 * da home passa a ter a largura do `.container-lp`.
 *
 * O que ela responde, e por que cada medida está aqui:
 *  · os sete cabem MESMO? Não basta contar cartões — a pergunta é quantas FILEIRAS
 *    eles formam, e isso se lê agrupando os `y` de topo. Sete cartões numa fileira
 *    só é o critério do pedido.
 *  · sobra rolagem lateral? `scrollWidth > clientWidth` na grade denunciaria o
 *    cartão de largura fixa que a grade deixou de ter.
 *  · a seção encolheu? Altura da `<section>` das duas, lado a lado. O alvo é
 *    "uma tela", e a referência é a home.
 *  · as duas têm a mesma largura? Compara a caixa do painel da home com a do
 *    conteúdo do `.container-lp` de `/contato`.
 *  · o pior rótulo virou escada? Conta LINHAS por `getClientRects()` do nó de
 *    texto — o número de linhas é o que denuncia a coluna estreita demais, não a
 *    altura em pixels.
 *
 * Rodar com o dev na 3999:  node docs/medidas/faixa-numeros-compacta/auditar.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE ?? 'http://localhost:3999';
const VIEWPORTS = [
  { w: 1440, h: 900 },
  { w: 1280, h: 900 },
  { w: 1024, h: 900 },
];

/* A contagem de linhas (`window.__linhas`) é injetada por `addInitScript` mais
   abaixo, e não declarada aqui: ela roda DENTRO da página, e uma função deste
   módulo não atravessa a fronteira do `evaluate`. */

async function medirContato(page) {
  return page.evaluate(() => {
    const secao = document.querySelector('.contato-indicadores');
    const grade = document.querySelector('.contato-indicadores-grade');
    const cartoes = [...document.querySelectorAll('.contato-indicador')];
    if (!secao || !grade || !cartoes.length) return null;

    const topos = new Set(cartoes.map((c) => Math.round(c.getBoundingClientRect().top)));
    const primeiro = cartoes[0].getBoundingClientRect();
    const container = document.querySelector('.contato-indicadores .container-lp');
    const pior = cartoes
      .map((c) => c.querySelector('.contato-indicador-rotulo'))
      .filter(Boolean)
      .map((r) => ({ texto: r.textContent, linhas: window.__linhas(r) }))
      .sort((a, b) => b.linhas - a.linhas)[0];

    return {
      alturaSecao: Math.round(secao.getBoundingClientRect().height),
      larguraConteudo: container ? Math.round(container.clientWidth - 64) : null,
      fileiras: topos.size,
      cartoesNaPrimeiraFileira: cartoes.filter(
        (c) => Math.round(c.getBoundingClientRect().top) === Math.min(...topos),
      ).length,
      larguraCartao: Math.round(primeiro.width),
      alturaCartao: Math.round(primeiro.height),
      rolagemLateral: grade.scrollWidth > grade.clientWidth + 1,
      corpoNumero: getComputedStyle(
        cartoes[0].querySelector('.contato-indicador-valor'),
      ).fontSize,
      piorRotulo: pior,
      // O espaçador do percurso não pode ter sobrado no documento.
      percursoNoDom: Boolean(document.querySelector('.mb-percurso')),
    };
  });
}

async function medirHome(page) {
  return page.evaluate(() => {
    const secao = document.querySelector('.impact-scroll');
    const painel = document.querySelector('.impact-track');
    const itens = [...document.querySelectorAll('.impact-item')];
    if (!secao || !painel || !itens.length) return null;

    const topos = new Set(itens.map((i) => Math.round(i.getBoundingClientRect().top)));
    const pior = itens
      .map((i) => i.querySelector('.impact-rotulo'))
      .filter(Boolean)
      .map((r) => ({ texto: r.textContent, linhas: window.__linhas(r) }))
      .sort((a, b) => b.linhas - a.linhas)[0];

    return {
      alturaSecao: Math.round(secao.getBoundingClientRect().height),
      larguraPainel: Math.round(painel.getBoundingClientRect().width),
      fileiras: topos.size,
      larguraColuna: Math.round(itens[0].getBoundingClientRect().width),
      corpoNumero: getComputedStyle(itens[0].querySelector('.impact-valor')).fontSize,
      piorRotulo: pior,
    };
  });
}

const navegador = await chromium.launch();
const resultado = {};

for (const { w, h } of VIEWPORTS) {
  const ctx = await navegador.newContext({ viewport: { width: w, height: h } });
  // O diálogo de preferência de movimento cobriria a cena na primeira visita.
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    window.__linhas = (el) => {
      const faixa = document.createRange();
      faixa.selectNodeContents(el);
      const topos = new Set();
      for (const r of faixa.getClientRects()) topos.add(Math.round(r.top));
      return topos.size || 1;
    };
  });
  const page = await ctx.newPage();

  await page.goto(`${BASE}/contato`, { waitUntil: 'networkidle' });
  await page.locator('.contato-indicadores').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const contato = await medirContato(page);
  await page.screenshot({ path: join(AQUI, `contato-${w}x${h}.png`) });

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.locator('.impact-track').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const home = await medirHome(page);
  await page.screenshot({ path: join(AQUI, `home-${w}x${h}.png`) });

  resultado[`${w}x${h}`] = { contato, home };
  await ctx.close();
}

await navegador.close();
mkdirSync(AQUI, { recursive: true });
writeFileSync(join(AQUI, 'resultado.json'), JSON.stringify(resultado, null, 2));
console.log(JSON.stringify(resultado, null, 2));
