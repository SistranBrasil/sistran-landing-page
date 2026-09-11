/* SIS-236 — DIAGNÓSTICO: de onde vem a tarja azul clara de
 * `/parceiros-e-implementacoes`.
 *
 * A issue lista cinco suspeitos (vão `mt-14` sobre o body, véu da capa,
 * `section-light-blue`, emenda implementações↔linha do tempo, sombra da variante
 * azul) e manda decidir NO PIXEL qual deles desenha a faixa. Esta sonda não
 * conserta nada: ela fotografa a página inteira em tiras de viewport, remonta a
 * coluna de pixels do documento e devolve as faixas de cor com o elemento que
 * pinta cada uma.
 *
 * POR QUE TIRAS DE VIEWPORT E NÃO `fullPage`. A rota tem palco `sticky`
 * (`.partner-terminal`, SIS-218) e reveals por rolagem: um `fullPage` estica o
 * viewport, o palco nunca prende e o que sai na foto não é o que o visitante vê.
 *
 * A COLUNA É x=8. É a margem esquerda, fora do `container-lp` em toda a página,
 * então o que ela atravessa é só superfície de seção — nenhum card, nenhuma
 * escrita. É onde uma tarja horizontal aparece limpa.
 *
 * Uso:  node docs/medidas/sis236/diagnostico.mjs
 *       SIS236_BASE_URL=http://localhost:3000 node docs/medidas/sis236/diagnostico.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const baseURL = process.env.SIS236_BASE_URL ?? 'http://localhost:3000';
const route = `${baseURL}/parceiros-e-implementacoes`;
const DIR = 'docs/medidas/sis236';
const LARGURA = Number(process.env.SIS236_LARGURA ?? 1440);
const ALTURA = Number(process.env.SIS236_ALTURA ?? 900);
const COLUNA_X = 8;

const hex = ([r, g, b]) => `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;

/* Rolagem sem inércia: a rota usa Lenis, e um `scrollTo` cru mediria a posição
   enquanto a biblioteca ainda interpola. */
async function rolarPara(page, y) {
  await page.evaluate((alvo) => {
    if (window.__lenis?.scrollTo) window.__lenis.scrollTo(alvo, { immediate: true, force: true });
    else window.scrollTo(0, alvo);
  }, y);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));
  await page.waitForTimeout(180);
}

await mkdir(DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: LARGURA, height: ALTURA } });
await context.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference', 'full');
  localStorage.setItem('sistran-motion-preference-seen', '1');
});
const page = await context.newPage();
await page.goto(route, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

/* Primeira passada: acorda os reveals de rolagem para a segunda passada
   fotografar o estado final, e não blocos em `opacity: 0`. */
const alturaDoc = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < alturaDoc; y += ALTURA) await rolarPara(page, y);
await rolarPara(page, 0);
await page.waitForTimeout(500);

/* A coluna do documento, remontada tira a tira. */
const coluna = new Map();
for (let y = 0; y < alturaDoc; y += ALTURA) {
  await rolarPara(page, y);
  const yReal = await page.evaluate(() => Math.round(window.scrollY));
  const png = await page.screenshot();
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let linha = 0; linha < info.height; linha += 1) {
    const i = (linha * info.width + COLUNA_X) * info.channels;
    coluna.set(yReal + linha, [data[i], data[i + 1], data[i + 2]]);
  }
  if (yReal + ALTURA >= alturaDoc) break;
}

/* Faixas: linhas vizinhas de cor praticamente igual viram uma banda só. O limiar
   de 6 por canal absorve o degradê lento de um `linear-gradient` sem fundir duas
   superfícies diferentes. */
const ys = [...coluna.keys()].sort((a, b) => a - b);
const faixas = [];
for (const y of ys) {
  const cor = coluna.get(y);
  const atual = faixas.at(-1);
  const perto = atual && cor.every((c, i) => Math.abs(c - atual.corFim[i]) <= 6);
  if (perto) {
    atual.fim = y;
    atual.corFim = cor;
  } else {
    faixas.push({ inicio: y, fim: y, corInicio: cor, corFim: cor });
  }
}

const relevantes = faixas
  .filter((f) => f.fim - f.inicio >= 6)
  .map((f) => ({
    inicio: f.inicio,
    fim: f.fim,
    altura: f.fim - f.inicio + 1,
    de: hex(f.corInicio),
    ate: hex(f.corFim),
  }));

/* Quem pinta cada faixa: o elemento sob o mesmo ponto, com a cadeia de
   ancestrais que têm fundo próprio. */
for (const faixa of relevantes) {
  const meio = Math.round((faixa.inicio + faixa.fim) / 2);
  await rolarPara(page, Math.max(0, meio - ALTURA / 2));
  faixa.pintaPor = await page.evaluate(
    ({ x, alvo }) => {
      const el = document.elementFromPoint(x, alvo - window.scrollY);
      if (!el) return null;
      const cadeia = [];
      for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
        const s = getComputedStyle(n);
        const temFundo =
          (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)') ||
          (s.backgroundImage && s.backgroundImage !== 'none');
        if (temFundo) {
          cadeia.push({
            no: `${n.tagName.toLowerCase()}${n.id ? `#${n.id}` : ''}${n.className && typeof n.className === 'string' ? `.${n.className.trim().split(/\s+/).join('.')}` : ''}`,
            cor: s.backgroundColor,
            imagem: s.backgroundImage.slice(0, 120),
            sombra: s.boxShadow === 'none' ? null : s.boxShadow.slice(0, 120),
            margemTopo: s.marginTop,
          });
        }
        if (cadeia.length >= 3) break;
      }
      return cadeia;
    },
    { x: COLUNA_X, alvo: meio },
  );
}

/* Geometria das juntas que a issue nomeia, em coordenada de documento. */
await rolarPara(page, 0);
const juntas = await page.evaluate(() => {
  const doc = (el) => {
    const r = el.getBoundingClientRect();
    return { topo: Math.round(r.top + scrollY), base: Math.round(r.bottom + scrollY), altura: Math.round(r.height) };
  };
  const pegar = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = getComputedStyle(el);
    return { seletor: sel, ...doc(el), marginTop: s.marginTop, background: s.backgroundImage.slice(0, 80), boxShadow: s.boxShadow.slice(0, 120) };
  };
  return {
    body: getComputedStyle(document.body).backgroundColor,
    hero: pegar('.hero-backdrop--parceiros'),
    parceiros: pegar('#parceiros'),
    implementacoes: pegar('#implementacoes'),
    faixaLogos: pegar('.implementacoes-faixa'),
    linhaDoTempo: pegar('#linha-do-tempo'),
  };
});

await context.close();
await browser.close();

const saida = { baseURL, viewport: { largura: LARGURA, altura: ALTURA }, alturaDoc, colunaX: COLUNA_X, juntas, faixas: relevantes };
await writeFile(path.join(DIR, `diagnostico-${LARGURA}.json`), `${JSON.stringify(saida, null, 2)}\n`);
console.log(JSON.stringify(saida, null, 2));
