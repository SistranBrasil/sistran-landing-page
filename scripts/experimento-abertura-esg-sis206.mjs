/**
 * SIS-206 — experimento: três arranjos candidatos para a frase da abertura.
 *
 * O defeito medido não é "sumiu metade": é que a continuação nasce numa linha
 * ACIMA da última linha do título (1440: cont em y=491, última do título em
 * y=509), então lendo da esquerda para a direita a frase sai fora de ordem
 * ("compromisso com o ESG, em suas operações e"). Os três candidatos atacam isso
 * de formas diferentes; este script injeta cada um e fotografa, para a escolha
 * ser feita sobre pixels e não sobre suposição.
 *
 * A) mesma fileira, mas a continuação em UMA linha: coluna do título encolhe e a
 *    continuação recebe a largura que precisa. A frase termina na MESMA linha em
 *    que o título termina.
 * B) diagonal: título na coluna 1 / fileira 1, continuação na coluna 2 /
 *    fileira 2 — ordem de leitura estritamente de cima para baixo.
 * C) nada (estado atual), para comparação.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3997';
const DESTINO = 'docs/capturas/sis206-experimento';
await mkdir(DESTINO, { recursive: true });

const CANDIDATOS = {
  A: `@media (min-width: 1280px) {
        .hero-backdrop--esg .pagehero-entrada > .container-lp > div {
          grid-template-columns: minmax(0, 1fr) max-content;
        }
        .hero-backdrop--esg .pagehero-entrada h1 { max-width: none; }
        .hero-backdrop--esg .pagehero-entrada h1 + div { max-width: none; white-space: nowrap; }
      }`,
  B: `@media (min-width: 1280px) {
        .hero-backdrop--esg .pagehero-entrada > .container-lp > div {
          grid-template-columns: minmax(0, 52vw) minmax(0, 1fr);
          grid-template-areas: "titulo ." ". cont";
          align-items: start;
        }
        .hero-backdrop--esg .pagehero-entrada h1 { grid-area: titulo; }
        .hero-backdrop--esg .pagehero-entrada h1 + div { grid-area: cont; }
      }`,
  C: '',
};

const navegador = await chromium.launch();
for (const [nome, css] of Object.entries(CANDIDATOS)) {
  for (const w of [1280, 1440, 1920]) {
    const contexto = await navegador.newContext({
      viewport: { width: w, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
    });
    await contexto.addInitScript(() => {
      localStorage.setItem('sistran-motion-preference-seen', '1');
    });
    const pagina = await contexto.newPage();
    await pagina.goto(`${URL_BASE}/esg`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
    await pagina.waitForSelector('.hero-backdrop--esg h1', { timeout: 180_000 });
    await pagina.waitForTimeout(1400);
    await pagina.addStyleTag({
      content:
        'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}',
    });
    if (css) await pagina.addStyleTag({ content: css });
    await pagina.waitForTimeout(400);

    const m = await pagina.evaluate(() => {
      const secao = document.querySelector('.hero-backdrop--esg .pagehero-entrada');
      const h1 = secao.querySelector('h1');
      const cont = h1.nextElementSibling;
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
            } else acc.push({ top: Math.round(b.top), left: Math.round(b.left), right: Math.round(b.right) });
            return acc;
          }, [])
          .sort((a, b) => a.top - b.top);
      };
      const lh = linhas(h1);
      const lc = linhas(cont);
      return {
        h1Linhas: lh.length,
        contLinhas: lc.length,
        ultimaH1: lh.at(-1),
        primeiraCont: lc[0],
        alturaSecao: Math.round(secao.getBoundingClientRect().height),
        scrollW: document.documentElement.scrollWidth,
        janela: innerWidth,
      };
    });
    const ordemOk = m.primeiraCont.top >= m.ultimaH1.top - 4;
    console.log(
      `${nome} @${w}: h1 ${m.h1Linhas}L cont ${m.contLinhas}L · última h1 y=${m.ultimaH1.top} (x até ${m.ultimaH1.right}) · 1ª cont y=${m.primeiraCont.top} (x ${m.primeiraCont.left}→${m.primeiraCont.right}) · ordem ok: ${ordemOk} · seção ${m.alturaSecao}px · scrollW ${m.scrollW}/${m.janela}`,
    );
    await pagina
      .locator('.hero-backdrop--esg')
      .screenshot({ path: `${DESTINO}/${nome}-${w}.png` });
    await contexto.close();
  }
}
await navegador.close();
