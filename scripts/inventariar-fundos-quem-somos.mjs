/* INVENTÁRIO — quem pinta fundo na rota `/quem-somos`.
   Serve ao pedido «todos os backgrounds que NÃO SEJAM AZUL ESCURO seguem o padrão
   do /solucoes»: antes de portar o plano da rota (`.solucoes-canvas`), preciso da
   lista MEDIDA de superfícies e do tom de cada uma — porque o pedido separa as
   faixas por TOM, e o tom de várias delas está em CSS que não declara cor de
   seção (gradiente, ::before, box-shadow).

   Só entram elementos que realmente pintam: `background-color` com alfa > 0.02 ou
   `background-image` != none, com caixa maior que 1% da área da janela. Cada um sai
   com luminância do fundo calculado e a classificação escuro/claro (limiar 90 de
   luminância, o mesmo usado nas sondas de junta desta rota).

     node scripts/inventariar-fundos-quem-somos.mjs
*/
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROTA = process.env.ROTA ?? 'http://localhost:3000/quem-somos';

const nav = await chromium.launch({ executablePath: EXE });
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await ctx.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference', 'full');
  localStorage.setItem('sistran-motion-preference-seen', '1');
  sessionStorage.setItem('sistran:intro-visto', 'true');
});
const pag = await ctx.newPage();
await pag.goto(ROTA, { waitUntil: 'domcontentloaded' });
await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
/* Rolar a rota inteira: seções com reveal só montam fundo depois de entrar. */
for (let i = 0; i < 12; i++) {
  await pag.mouse.wheel(0, 900);
  await pag.waitForTimeout(250);
}
await pag.waitForTimeout(1200);

const dados = await pag.evaluate(() => {
  const main = document.querySelector('main');
  const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const rgba = (s) => {
    const m = s.match(/[\d.]+/g);
    if (!m) return null;
    return { r: +m[0], g: +m[1], b: +m[2], a: m[3] === undefined ? 1 : +m[3] };
  };
  const areaJanela = innerWidth * innerHeight;
  const itens = [];
  const varrer = (raiz, ondeEsta) => {
    for (const el of [raiz, ...raiz.querySelectorAll('*')]) {
      const cs = getComputedStyle(el);
      const c = rgba(cs.backgroundColor);
      const temCor = c && c.a > 0.02;
      const temImg = cs.backgroundImage !== 'none';
      if (!temCor && !temImg) continue;
      const b = el.getBoundingClientRect();
      if (b.width * b.height < areaJanela * 0.01) continue;
      itens.push({
        onde: ondeEsta,
        tag: el.tagName.toLowerCase(),
        classe: (el.className?.toString?.() ?? '').slice(0, 120),
        id: el.id || null,
        w: Math.round(b.width),
        h: Math.round(b.height),
        cor: cs.backgroundColor,
        lum: temCor ? +lum(c.r, c.g, c.b).toFixed(1) : null,
        tom: temCor ? (lum(c.r, c.g, c.b) < 90 ? 'ESCURO' : 'CLARO') : 'só imagem',
        imagem: temImg ? cs.backgroundImage.slice(0, 160) : null,
        anexo: cs.backgroundAttachment,
      });
    }
  };
  varrer(main, 'main');

  /* Ancestrais do <main> com transform/filter/perspective — matam o plano fixo. */
  const bloqueios = [];
  for (let p = main.parentElement; p; p = p.parentElement) {
    const cs = getComputedStyle(p);
    if (cs.transform !== 'none' || cs.filter !== 'none' || cs.perspective !== 'none') {
      bloqueios.push({
        tag: p.tagName.toLowerCase(),
        classe: (p.className?.toString?.() ?? '').slice(0, 80),
        transform: cs.transform,
        filter: cs.filter,
        perspective: cs.perspective,
      });
    }
  }

  /* Filhos diretos do <main>, na ordem, com o tom do fundo EFETIVO no topo/meio/base
     — é a leitura que diz quais faixas o pedido inclui. */
  const faixas = [...main.children].map((el) => {
    const b = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      classe: (el.className?.toString?.() ?? '').slice(0, 120),
      altura: Math.round(b.height),
      corPropria: cs.backgroundColor,
      imagemPropria: cs.backgroundImage === 'none' ? null : cs.backgroundImage.slice(0, 120),
      primeiraSecao: (() => {
        const s = el.matches('section') ? el : el.querySelector('section');
        if (!s) return null;
        const c = getComputedStyle(s);
        return {
          classe: (s.className?.toString?.() ?? '').slice(0, 120),
          cor: c.backgroundColor,
          imagem: c.backgroundImage === 'none' ? null : c.backgroundImage.slice(0, 120),
        };
      })(),
    };
  });

  return { itens, bloqueios, faixas, mainClasse: main.className };
});

await nav.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync(
  'docs/medidas/inventario-fundos-quem-somos.json',
  `${JSON.stringify({ rota: ROTA, quando: new Date().toISOString(), ...dados }, null, 2)}\n`,
);

console.log(`main: "${dados.mainClasse}"`);
console.log(`ancestrais com transform/filter/perspective: ${dados.bloqueios.length}`);
for (const b of dados.bloqueios) console.log(`  ${b.tag}.${b.classe} ${b.transform} ${b.filter}`);
console.log(`\nFAIXAS (filhos diretos do main): ${dados.faixas.length}`);
for (const f of dados.faixas) {
  console.log(
    `  ${f.tag}.${f.classe.padEnd(40)} h=${String(f.altura).padStart(5)} cor=${f.corPropria}` +
      `${f.imagemPropria ? ' +img' : ''}` +
      `${f.primeiraSecao ? ` | sec .${f.primeiraSecao.classe.slice(0, 40)} ${f.primeiraSecao.cor}${f.primeiraSecao.imagem ? ' +img' : ''}` : ''}`,
  );
}
console.log(`\nQUEM PINTA (${dados.itens.length}):`);
for (const i of dados.itens) {
  console.log(
    `  ${i.tom.padEnd(9)} lum=${String(i.lum ?? '-').padStart(6)} ${i.w}x${i.h} ${i.tag}.${i.classe.slice(0, 60)} ${i.cor}${i.imagem ? ` img:${i.imagem.slice(0, 60)}` : ''}`,
  );
}
