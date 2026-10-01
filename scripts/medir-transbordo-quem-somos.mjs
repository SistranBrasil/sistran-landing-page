/**
 * Diagnóstico de TRANSBORDO HORIZONTAL em `/quem-somos` (29/09).
 *
 * Origem: captura da usuária em que a faixa Celent aparece deslocada para a
 * esquerda com uma tira vazia à direita. Esse é o desenho de uma página que
 * ROLA na horizontal e foi arrastada até o fim — não de uma arte recortada.
 *
 * O que ele faz: mede `scrollWidth - clientWidth` do documento e, quando há
 * sobra, varre TODO elemento cuja borda direita passa da largura da janela,
 * imprimindo o culpado mais externo primeiro (quem realmente empurra) junto com
 * a seção em que ele mora e os estilos que costumam ser a causa (`width`,
 * `min-width`, `margin`, `transform`, `position`).
 *
 * Uso: node scripts/medir-transbordo-quem-somos.mjs
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = 'http://localhost:3000';
const SAIDA = 'docs/medidas/transbordo-quem-somos.json';
const LARGURAS = [390, 768, 1024, 1110, 1280, 1422, 1440, 1600, 1920];

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

const LER = () => {
  const doc = document.documentElement;
  const janela = doc.clientWidth;
  const sobra = doc.scrollWidth - janela;

  const culpados = [];
  if (sobra > 0) {
    for (const n of document.querySelectorAll('body *')) {
      const r = n.getBoundingClientRect();
      /* Só o que passa da janela E tem área — nós de 0px não empurram nada. */
      if (r.width === 0 && r.height === 0) continue;
      const passaDireita = Math.round(r.right - janela);
      const passaEsquerda = Math.round(-r.left);
      if (passaDireita <= 1 && passaEsquerda <= 1) continue;
      const c = getComputedStyle(n);
      culpados.push({
        seletor:
          n.tagName.toLowerCase() +
          (n.id ? `#${n.id}` : '') +
          (typeof n.className === 'string' && n.className
            ? `.${n.className.trim().split(/\s+/).slice(0, 3).join('.')}`
            : ''),
        secao:
          n.closest('section')?.className?.toString?.().split(/\s+/)[0] ??
          n.closest('footer,header')?.tagName.toLowerCase() ??
          null,
        profundidade: (() => {
          let d = 0;
          for (let p = n; p; p = p.parentElement) d += 1;
          return d;
        })(),
        esquerda: Math.round(r.left),
        direita: Math.round(r.right),
        largura: Math.round(r.width),
        passaDireita,
        passaEsquerda,
        estilos: {
          position: c.position,
          width: c.width,
          minWidth: c.minWidth,
          maxWidth: c.maxWidth,
          marginLeft: c.marginLeft,
          marginRight: c.marginRight,
          transform: c.transform === 'none' ? 'none' : c.transform,
          overflowX: c.overflowX,
        },
      });
    }
    /* O mais EXTERNO primeiro: um filho que vaza dentro de pai com `overflow:
       clip` não empurra a página; quem empurra é o ancestral mais raso da lista. */
    culpados.sort((a, b) => a.profundidade - b.profundidade);
  }

  /* A faixa Celent, medida à parte — é a da captura. */
  const faixa = document.querySelector('.cel-faixa');
  const capa = document.querySelector('.cel-capa img');
  const cx = (n) => (n ? n.getBoundingClientRect() : null);
  const caixa = (r) =>
    r ? { x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) } : null;

  return {
    janela,
    scrollWidthDoDocumento: doc.scrollWidth,
    scrollWidthDoBody: document.body.scrollWidth,
    sobra,
    /* A página aceita ser arrastada na horizontal? É isso que produz a captura. */
    rolavelNaHorizontal: sobra > 0,
    celent: {
      faixa: caixa(cx(faixa)),
      capa: caixa(cx(capa)),
      colunaTexto: caixa(cx(document.querySelector('.cel-coluna'))),
      tituloVisivelDaEsquerda: (() => {
        const t = document.querySelector('.cel-titulo');
        return t ? Math.round(t.getBoundingClientRect().left) : null;
      })(),
    },
    culpados: culpados.slice(0, 12),
    totalCulpados: culpados.length,
  };
};

const resultado = { nota: 'gerado por scripts/medir-transbordo-quem-somos.mjs' };

for (const largura of LARGURAS) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 } });
  await ctx.addInitScript(() => sessionStorage.setItem('sistran:intro-visto', 'true'));
  const p = await ctx.newPage();
  await p.goto(`${BASE}/quem-somos`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.cel-faixa', { timeout: 90000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  /* Rolar a página inteira: seção que só monta ao entrar na janela não transborda
     enquanto não existir. */
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(800);
  resultado[largura] = await p.evaluate(LER);
  await ctx.close();
}

await navegador.close();
writeFileSync(SAIDA, `${JSON.stringify(resultado, null, 2)}\n`);
console.log(SAIDA);
for (const l of LARGURAS) {
  const r = resultado[l];
  console.log(
    `\n── ${l} ──  sobra=${r.sobra}  (doc=${r.scrollWidthDoDocumento} body=${r.scrollWidthDoBody})` +
      `  celent faixa=${JSON.stringify(r.celent.faixa)} capa=${JSON.stringify(r.celent.capa)}`,
  );
  for (const c of r.culpados.slice(0, 5)) {
    console.log(
      `   d${c.profundidade} ${c.seletor} [${c.secao}] x=${c.esquerda}..${c.direita} w=${c.largura}` +
        ` passa→${c.passaDireita} ←${c.passaEsquerda} | ${JSON.stringify(c.estilos)}`,
    );
  }
  if (r.totalCulpados > 5) console.log(`   … +${r.totalCulpados - 5}`);
}
