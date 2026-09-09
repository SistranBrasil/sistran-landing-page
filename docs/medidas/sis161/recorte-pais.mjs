/* SIS-161 (conferencia) — refinamento de `recorte.mjs`.
   Medir o grupo inteiro da camera nao responde a pergunta: a America do Sul é
   decoracao e sangra por decisao de desenho (ver `.bm-latam-*`). O que nao pode
   ser cortado é o SUJEITO — a silhueta do Brasil, os dois pinos e os dois rotulos.
   Mede cada um contra o rect do `<svg>`, que é onde o viewport do SVG corta. */
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
  await pg.waitForTimeout(1800);

  for (const aba of ['pr', 'sp']) {
    const btn = await pg.$(`#os-aba-${aba}`);
    if (btn) { await btn.click(); await pg.waitForTimeout(1500); }
    const r = await pg.evaluate(() => {
      const svg = document.querySelector('.bm-mapa');
      if (!svg) return null;
      const v = svg.getBoundingClientRect();
      const medir = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return { ausente: true };
        const b = el.getBoundingClientRect();
        if (!b.width && !b.height) return { vazio: true };
        return {
          esq: +(b.left - v.left).toFixed(1),
          dir: +(v.right - b.right).toFixed(1),
          topo: +(b.top - v.top).toFixed(1),
          base: +(v.bottom - b.bottom).toFixed(1),
        };
      };
      const cortado = (m) =>
        !m || m.ausente || m.vazio ? '?' : [m.esq, m.dir, m.topo, m.base].some((n) => n < 0);
      const pais = medir('.bm-pais');
      const pinoPr = medir('.bm-ponto[data-cidade="pr"], .bm-pontos g:nth-child(1)');
      const rotPr = medir('.bm-rotulo[data-cidade="pr"]');
      const rotSp = medir('.bm-rotulo[data-cidade="sp"]');
      return {
        ativa: document.querySelector('.os-palco')?.dataset.ativa,
        pais, paisCortado: cortado(pais),
        pinoPr, rotPr, rotSp,
        rotPrCortado: cortado(rotPr), rotSpCortado: cortado(rotSp),
      };
    });
    console.log(`${largura}px aba=${aba}`, JSON.stringify(r));
  }
  await ctx.close();
}
await nav.close();
