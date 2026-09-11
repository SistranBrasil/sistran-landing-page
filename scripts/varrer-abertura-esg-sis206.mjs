/**
 * SIS-206 — varredura do arranjo escolhido (continuação NA MESMA linha em que o
 * título termina), para escolher o corpo da continuação com número medido.
 *
 * Com a coluna da continuação em `max-content` e sem quebra, o corpo dela decide
 * quanta largura sobra para o título — e portanto em quantas linhas a manchete
 * fecha. Para cada candidato de corpo, mede em 1280/1366/1440/1600/1920:
 *   - linhas do título e da continuação;
 *   - se a continuação começa na mesma linha em que o título termina;
 *   - a FOLGA entre o fim da continuação e a borda do conteúdo (a margem de
 *     segurança do `nowrap`: se ela for pequena, uma métrica de fonte diferente
 *     empurra a frase para fora e devolve barra lateral);
 *   - `scrollWidth` do documento contra a janela, que é a prova do transbordo.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3999';
const CORPOS = [
  'clamp(1.5rem, 2.5vw, 2.25rem)',
  'clamp(1.5rem, 2.2vw, 2rem)',
  'clamp(1.375rem, 2vw, 1.875rem)',
  'clamp(1.25rem, 1.8vw, 1.75rem)',
];
const LARGURAS = [1280, 1366, 1440, 1600, 1920];

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

for (const corpo of CORPOS) {
  await pagina.addStyleTag({
    content: `@media (min-width: 1280px) {
      .hero-backdrop--esg .pagehero-entrada > .container-lp > div {
        grid-template-columns: minmax(0, 1fr) max-content !important;
      }
      .hero-backdrop--esg .pagehero-entrada h1 { max-width: none !important; }
      .hero-backdrop--esg .pagehero-entrada h1 + div {
        max-width: none !important;
        white-space: nowrap !important;
        font-size: ${corpo} !important;
      }
    }`,
  });
  console.log(`\n--- continuação em ${corpo} ---`);
  for (const w of LARGURAS) {
    await pagina.setViewportSize({ width: w, height: 900 });
    await pagina.waitForTimeout(400);
    const m = await pagina.evaluate(() => {
      const secao = document.querySelector('.hero-backdrop--esg .pagehero-entrada');
      const h1 = secao.querySelector('h1');
      const cont = h1.nextElementSibling;
      const miolo = h1.parentElement;
      const linhas = (el) => {
        const r = document.createRange();
        r.selectNodeContents(el);
        return Array.from(r.getClientRects())
          .filter((b) => b.width > 1 && b.height > 4)
          .reduce((acc, b) => {
            const l = acc.find((x) => Math.abs(x.top - b.top) < 6);
            if (l) {
              l.left = Math.min(l.left, Math.round(b.left));
              l.right = Math.max(l.right, Math.round(b.right));
            } else
              acc.push({
                top: Math.round(b.top),
                left: Math.round(b.left),
                right: Math.round(b.right),
              });
            return acc;
          }, [])
          .sort((a, b) => a.top - b.top);
      };
      const lh = linhas(h1);
      const lc = linhas(cont);
      return {
        corpoCont: getComputedStyle(cont).fontSize,
        h1L: lh.length,
        contL: lc.length,
        ultimaH1: lh.at(-1),
        primeiraCont: lc[0],
        bordaConteudo: Math.round(miolo.getBoundingClientRect().right),
        scrollW: document.documentElement.scrollWidth,
        janela: innerWidth,
      };
    });
    console.log(
      `${w}: título ${m.h1L}L · cont ${m.contL}L em ${m.corpoCont} · última do título y=${m.ultimaH1.top} · cont y=${m.primeiraCont.top} x ${m.primeiraCont.left}→${m.primeiraCont.right} · folga até a borda ${m.bordaConteudo - m.primeiraCont.right}px · mesma linha: ${Math.abs(m.primeiraCont.top - m.ultimaH1.top) < 26} · scrollW ${m.scrollW}/${m.janela}`,
    );
  }
}
await navegador.close();
