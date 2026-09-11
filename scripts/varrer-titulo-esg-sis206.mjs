/**
 * SIS-206 — segundo passo da varredura: com a continuação já resolvida (uma linha
 * só, na MESMA linha em que o título termina), sobra escolher o corpo do TÍTULO.
 *
 * A coluna do título encolhe, porque a continuação passou a reservar a largura de
 * que precisa. Com o corpo atual (`3.6vw`, teto 3,2rem) a manchete fecha em 4
 * linhas a 1440 e 5 a 1280 — e a de 1280 nasce com "A Sistran" órfão na primeira.
 * Menos corpo cabe mais caracteres por linha; esta varredura mede quanto.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const URL_BASE = process.env.URL_BASE ?? 'http://localhost:3997';
const CORPOS = [
  'clamp(2rem, 3.6vw, 3.2rem)',
  'clamp(2rem, 3.3vw, 3rem)',
  'clamp(2rem, 3.1vw, 2.75rem)',
  'clamp(1.875rem, 2.9vw, 2.5rem)',
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

/* Arranjo escolhido, comum a todos os candidatos. */
await pagina.addStyleTag({
  content: `@media (min-width: 1280px) {
    .hero-backdrop--esg .pagehero-entrada > .container-lp > div {
      grid-template-columns: minmax(0, 1fr) max-content !important;
    }
    .hero-backdrop--esg .pagehero-entrada h1 { max-width: none !important; }
    .hero-backdrop--esg .pagehero-entrada h1 + div {
      max-width: none !important;
      white-space: nowrap !important;
    }
  }`,
});

for (const corpo of CORPOS) {
  await pagina.addStyleTag({
    content: `.hero-backdrop--esg .pagehero-entrada h1 { font-size: ${corpo} !important; }`,
  });
  console.log(`\n--- título em ${corpo} ---`);
  for (const w of LARGURAS) {
    await pagina.setViewportSize({ width: w, height: 900 });
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
      const r = document.createRange();
      r.selectNodeContents(h1);
      return {
        corpoH1: getComputedStyle(h1).fontSize,
        corpoCont: getComputedStyle(cont).fontSize,
        h1L: lh.length,
        contL: lc.length,
        primeiraLinhaH1: `${lh[0].right - lh[0].left}px de largura`,
        ultimaH1: lh.at(-1),
        primeiraCont: lc[0],
        alturaSecao: Math.round(secao.getBoundingClientRect().height),
        scrollW: document.documentElement.scrollWidth,
        janela: innerWidth,
      };
    });
    console.log(
      `${w}: título ${m.h1L}L em ${m.corpoH1} (1ª linha ${m.primeiraLinhaH1}) · cont ${m.contL}L em ${m.corpoCont} · Δy última do título → cont: ${m.primeiraCont.top - m.ultimaH1.top}px · cont x ${m.primeiraCont.left}→${m.primeiraCont.right} · seção ${m.alturaSecao}px · scrollW ${m.scrollW}/${m.janela}`,
    );
  }
}
await navegador.close();
