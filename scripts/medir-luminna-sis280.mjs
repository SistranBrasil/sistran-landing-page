/**
 * SIS-280 — /solucoes/lumina-ai · Lumina -> Luminna (dois n)
 *
 * Portoes medidos (nao declarados):
 *  1. TEXTO VISIVEL da rota: zero ocorrencias de "Lumina" com UM n
 *     (`/Lumina(?!n)/`), e >= 1 de "Luminna". O texto vem de
 *     `document.body.innerText`, que ja e o texto RENDERIZADO — nao inclui
 *     comentarios de codigo nem atributos, que a issue poe fora de escopo.
 *  2. O mesmo par de contagens no `<title>` (a metadata deriva de `page.name`).
 *  3. O MESMO par em /solucoes, restrito ao cartao do produto (o <article>/<li>
 *     que contem o link para /solucoes/lumina-ai) — a issue pede o cartao e o
 *     "Conheca tambem".
 *  4. `alt` e `aria-label` de toda a rota: nenhum com "Lumina" de um n.
 *  5. A rota continua de pe: h1 presente e com texto.
 *  6. Capturas: o h1 e o bloco "Integracao Versatil" (que contem o nome no
 *     intro), mais o cartao em /solucoes.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'http://localhost:3000';
const CAPTURAS = 'docs/capturas';
mkdirSync(CAPTURAS, { recursive: true });

/* Um n, e nao dois: lookahead negativo isola a grafia errada da correta. */
const contar = (texto) => ({
  erradas: (texto.match(/Lumina(?!n)/g) || []).length,
  certas: (texto.match(/Luminna/g) || []).length,
});

const navegador = await chromium.launch();
const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
await contexto.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference-seen', '1');
  localStorage.setItem('sistran-motion-preference', 'full');
});

const abrir = async (rota) => {
  const page = await contexto.newPage();
  await page.goto(`${BASE}${rota}`, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(2500);
  return page;
};

const medida = {};

// ---- rota do produto -------------------------------------------------------
const rota = await abrir('/solucoes/lumina-ai');
const dadosRota = await rota.evaluate(() => ({
  titulo: document.title,
  texto: document.body.innerText,
  h1: document.querySelector('h1')?.textContent?.trim() || null,
  atributos: [...document.querySelectorAll('[alt], [aria-label]')]
    .map((n) => `${n.getAttribute('alt') || ''}|${n.getAttribute('aria-label') || ''}`)
    .join('\n'),
  temIntegracao: document.body.innerText.includes('Integração Versátil'),
  /* A grafia tambem pode aparecer DESENHADA num raster. Isso nao e string e a
     issue poe o arquivo fora de escopo, mas precisa ficar medido: um logotipo
     visivel com um n contraria o critério lido ao pé da letra. */
  rasters: [...document.querySelectorAll('img')]
    .filter((n) => /lumina(?!n)/i.test(n.currentSrc || n.src))
    .map((n) => {
      const r = n.getBoundingClientRect();
      return { src: new URL(n.currentSrc || n.src).pathname, largura: Math.round(r.width), altura: Math.round(r.height) };
    }),
}));
medida.rota = {
  h1: dadosRota.h1,
  titulo: dadosRota.titulo,
  textoVisivel: contar(dadosRota.texto),
  tituloDoDocumento: contar(dadosRota.titulo),
  atributos: contar(dadosRota.atributos),
  temBlocoIntegracaoVersatil: dadosRota.temIntegracao,
  rasteresComUmN: dadosRota.rasters,
  /* As frases que a issue nomeia, conferidas uma a uma no texto renderizado. */
  frases: {
    intro: dadosRota.texto.includes('O Luminna AI foi desenvolvido'),
    fechamento: dadosRota.texto.includes('O Luminna AI representa uma revolução'),
  },
};

const h1El = rota.locator('h1').first();
await h1El.scrollIntoViewIfNeeded();
await rota.waitForTimeout(600);
await h1El.screenshot({ path: `${CAPTURAS}/sis280-luminna-h1.png` });

const bloco = rota.locator('text=Integração Versátil').first();
await bloco.scrollIntoViewIfNeeded();
await rota.waitForTimeout(1200);
await rota.screenshot({ path: `${CAPTURAS}/sis280-luminna-integracao.png` });
await rota.close();

// ---- vitrine ---------------------------------------------------------------
const vitrine = await abrir('/solucoes');
const dadosCartao = await vitrine.evaluate(() => {
  const link = [...document.querySelectorAll('a[href*="/solucoes/lumina-ai"]')][0];
  if (!link) return { achou: false };
  const cartao = link.closest('article, li, [class*="card"], [class*="cartao"]') || link;
  return { achou: true, texto: cartao.innerText, marcador: cartao.tagName };
});
medida.vitrine = dadosCartao.achou
  ? { achouCartao: true, tag: dadosCartao.marcador, cartao: contar(dadosCartao.texto), textoDoCartao: dadosCartao.texto }
  : { achouCartao: false };
medida.vitrinePaginaInteira = contar(await vitrine.evaluate(() => document.body.innerText));
medida.vitrineRasteresComUmN = await vitrine.evaluate(() =>
  [...document.querySelectorAll('img')]
    .filter((n) => /lumina(?!n)/i.test(n.currentSrc || n.src))
    .map((n) => {
      const r = n.getBoundingClientRect();
      return { src: new URL(n.currentSrc || n.src).pathname, largura: Math.round(r.width), altura: Math.round(r.height) };
    }),
);

/* Os cartoes de /solucoes flutuam por decisao de design (loop infinito de
   translate), entao TODA acao do locator que espera estabilidade — inclusive
   `scrollIntoViewIfNeeded` — estoura o timeout. Rolagem e leitura da caixa vao
   por `evaluate`, e a captura sai do viewport recortado. */
await vitrine.evaluate(() =>
  document.querySelector('a[href*="/solucoes/lumina-ai"]').scrollIntoView({ block: 'center' }),
);
await vitrine.waitForTimeout(1200);
/* O primeiro `a` da rota e a pilula "Conheca a solucao", nao o cartao: subo os
   ancestrais ate achar a caixa larga, que e a do cartao com o <h3> do nome. */
const caixa = await vitrine.evaluate(() => {
  let no = document.querySelector('a[href*="/solucoes/lumina-ai"]');
  while (no.parentElement && no.getBoundingClientRect().width < 320) no = no.parentElement;
  const r = no.getBoundingClientRect();
  return { x: r.left, y: r.top, width: r.width, height: r.height };
});
await vitrine.screenshot({
  path: `${CAPTURAS}/sis280-luminna-cartao.png`,
  clip: { x: Math.max(0, caixa.x), y: Math.max(0, caixa.y), width: caixa.width, height: caixa.height },
});
await vitrine.close();

await navegador.close();

mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/sis280-luminna.json', JSON.stringify(medida, null, 2));
console.log(JSON.stringify(medida, null, 2));
