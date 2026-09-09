import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const LARGURAS = [320, 768, 1024, 1280, 1440, 1670];
const b = await chromium.launch();
for (const w of LARGURAS) {
  const pg = await b.newPage({ viewport: { width: w, height: 900 } });
  await pg.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await pg.addStyleTag({ content: 'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],header.fixed{display:none!important}' });
  await pg.waitForTimeout(2500);
  await pg.locator('.impact-lista').scrollIntoViewIfNeeded().catch(() => {});
  await pg.waitForTimeout(1500);
  const r = await pg.evaluate(() => {
    const lista = document.querySelector('.impact-lista');
    const itens = [...document.querySelectorAll('.impact-item')];
    const cs = getComputedStyle(lista);
    const rot = itens.map((n) => {
      const p = n.querySelector('.impact-rotulo');
      const s = getComputedStyle(p);
      return { fs: s.fontSize, lin: Math.round(p.getBoundingClientRect().height / parseFloat(s.lineHeight)), txt: p.textContent.slice(0, 18) };
    });
    const val = itens.map((n) => {
      const v = n.querySelector('.impact-valor');
      return { w: Math.round(v.getBoundingClientRect().width), col: Math.round(n.getBoundingClientRect().width), fs: getComputedStyle(v).fontSize, txt: v.textContent };
    });
    return {
      cols: cs.gridTemplateColumns.split(' ').length,
      observando: lista.dataset.observando ?? '(ausente)',
      acesos: itens.filter((n) => n.dataset.aceso === 'sim').length,
      apagados: itens.filter((n) => n.dataset.aceso === 'nao').length,
      rot, val,
      curvas: !!document.querySelector('.impact-curvas'),
      role: document.querySelector('.impact-role')?.textContent?.trim(),
      destaque: document.querySelector('.impact-titulo-destaque')?.textContent,
      destaqueFF: document.querySelector('.impact-titulo-destaque') ? getComputedStyle(document.querySelector('.impact-titulo-destaque')).fontFamily.split(',')[0] : null,
      destaquePeso: document.querySelector('.impact-titulo-destaque') ? getComputedStyle(document.querySelector('.impact-titulo-destaque')).fontWeight : null,
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
      marcador: !!document.querySelector('.impact-marcador'),
      atalhos: !!document.querySelector('.impact-atalhos'),
    };
  });
  console.log('=== ' + w + 'px ===');
  console.log(JSON.stringify(r, null, 1));
  await pg.close();
}
await b.close();
