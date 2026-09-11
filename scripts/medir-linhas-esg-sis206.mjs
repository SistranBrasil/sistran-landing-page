/**
 * SIS-206 — quantas linhas cada metade da frase fecha, de 1280 a 1920.
 *
 * A grade da SIS-138 tem como premissa escrita "o título fecha em DUAS linhas em
 * 749px a 1440". Esta sonda mede a premissa em vez de acreditar nela: conta as
 * linhas de VERDADE (retângulos de um Range sobre o texto, não a altura dividida
 * pela entrelinha) e devolve, para cada largura, onde termina a última linha do
 * título e onde começa a primeira da continuação.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3997';
const LARGURAS = [1280, 1366, 1440, 1600, 1728, 1920];

const navegador = await chromium.launch();
const contexto = await navegador.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});
await contexto.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference-seen', '1');
});
const pagina = await contexto.newPage();
await pagina.goto(`${URL_BASE}/esg`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
await pagina.waitForSelector('.hero-backdrop--esg h1', { timeout: 180_000 });
await pagina.waitForTimeout(1500);

for (const w of LARGURAS) {
  await pagina.setViewportSize({ width: w, height: 900 });
  await pagina.waitForTimeout(500);
  const m = await pagina.evaluate(() => {
    const secao = document.querySelector('.hero-backdrop--esg .pagehero-entrada');
    const h1 = secao.querySelector('h1');
    const cont = h1.nextElementSibling;
    const linhas = (el) => {
      const r = document.createRange();
      r.selectNodeContents(el);
      return Array.from(r.getClientRects())
        .filter((b) => b.width > 1 && b.height > 1)
        /* Um Range devolve um retângulo por nó de texto: os pedaços da MESMA
           linha visual têm o mesmo topo (o `<span>` do highlight parte a linha
           em dois). Agrupo por topo arredondado. */
        .reduce((acc, b) => {
          const chave = Math.round(b.top);
          const linha = acc.find((l) => Math.abs(l.top - chave) < 4);
          if (linha) {
            linha.left = Math.min(linha.left, Math.round(b.left));
            linha.right = Math.max(linha.right, Math.round(b.right));
          } else {
            acc.push({ top: chave, left: Math.round(b.left), right: Math.round(b.right) });
          }
          return acc;
        }, []);
    };
    const lh1 = linhas(h1);
    const lc = linhas(cont);
    return {
      corpoH1: getComputedStyle(h1).fontSize,
      corpoCont: getComputedStyle(cont).fontSize,
      colunas: getComputedStyle(h1.parentElement).gridTemplateColumns,
      h1: lh1,
      cont: lc,
    };
  });
  console.log(
    `${w}: h1 ${m.h1.length} linhas (${m.corpoH1}) · cont ${m.cont.length} linhas (${m.corpoCont}) · colunas ${m.colunas}`,
  );
  console.log(
    `      última linha do h1: y=${m.h1.at(-1).top} x ${m.h1.at(-1).left}→${m.h1.at(-1).right} · 1ª da cont: y=${m.cont[0].top} x ${m.cont[0].left}→${m.cont[0].right} · última da cont: y=${m.cont.at(-1).top}`,
  );
}

await navegador.close();
