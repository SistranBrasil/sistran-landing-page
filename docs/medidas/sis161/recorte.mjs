/* SIS-161 (conferencia) — o mapa estava sendo recortado pela coluna.
   Mede, para cada aba e em varias larguras, se o desenho do Brasil cabe DENTRO da
   caixa do SVG e se a caixa invade a coluna de leitura ao lado.
   Le rect real (`getBoundingClientRect`), nunca `offsetTop`/`offsetWidth`, que sao
   relativos ao `offsetParent` e ja produziram medicao falsa neste projeto. */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const LARGURAS = [1024, 1366, 1440, 1670];
const nav = await chromium.launch();

for (const largura of LARGURAS) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 900 } });
  const pg = await ctx.newPage();
  await pg.goto('http://localhost:3000/quem-somos', { waitUntil: 'domcontentloaded' });
  await pg.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],header.fixed{display:none!important}',
  });
  await pg.waitForTimeout(2500);

  const alvo = await pg.$('.os-palco');
  if (alvo) await alvo.scrollIntoViewIfNeeded();
  await pg.waitForTimeout(2000);

  for (const aba of ['pr', 'sp']) {
    const btn = await pg.$(`#os-aba-${aba}`);
    if (btn) {
      await btn.click();
      await pg.waitForTimeout(1400);
    }
    const r = await pg.evaluate(() => {
      const svg = document.querySelector('.bm-mapa');
      const coluna = document.querySelector('.os-coluna');
      const caixaMapa = document.querySelector('.os-mapa');
      if (!svg || !caixaMapa) return null;
      const cx = svg.getBoundingClientRect();
      const cc = coluna?.getBoundingClientRect() ?? null;
      const cm = caixaMapa.getBoundingClientRect();
      /* Rect do desenho pintado, em pixels de tela: o bbox do grupo da camera,
         convertido pela matriz do SVG. */
      const g = document.querySelector('.bm-camera');
      let desenho = null;
      if (g) {
        const b = g.getBoundingClientRect();
        desenho = { left: +b.left.toFixed(1), right: +b.right.toFixed(1), top: +b.top.toFixed(1), bottom: +b.bottom.toFixed(1) };
      }
      const folga = (a, b) => +(a - b).toFixed(1);
      return {
        modo: document.querySelector('.os-palco')?.dataset.modo ?? '(sem modo)',
        ativa: document.querySelector('.os-palco')?.dataset.ativa ?? '(sem ativa)',
        svg: { left: +cx.left.toFixed(1), right: +cx.right.toFixed(1) },
        desenho,
        /* Positivo = o desenho cabe dentro da caixa do SVG. */
        sobraEsq: desenho ? folga(desenho.left, cx.left) : null,
        sobraDir: desenho ? folga(cx.right, desenho.right) : null,
        /* Positivo = a caixa do mapa comeca DEPOIS do fim da coluna de leitura. */
        folgaColuna: cc ? folga(cm.left, cc.right) : null,
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    console.log(`${largura}px aba=${aba}`, JSON.stringify(r, null, 1));
  }
  await ctx.close();
}
await nav.close();
