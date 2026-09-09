import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const b = await chromium.launch();

for (const rm of [false, true]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: rm ? 'reduce' : 'no-preference' });
  const pg = await ctx.newPage();
  await pg.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await pg.addStyleTag({ content: 'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}' });
  await pg.waitForTimeout(2500);
  /* SALTO para DEPOIS da fileira: o pior caso, e o unico que expoe o limite do
     `IntersectionObserver` (ele avisa MUDANCA de intersecao, e num salto o item vai
     de "abaixo" a "acima" sem nunca intersectar).

     `offsetTop` NAO serve para achar a fileira: ele é relativo ao `offsetParent`, e
     numa pagina com secoes posicionadas dá um numero que nao é posicao no documento
     — foi assim que a primeira versao desta sonda "reprovou" o codigo com a fileira
     ainda a 2954px abaixo da dobra. A posicao real é `rect.top + scrollY`. */
  const destino = await pg.evaluate(() => {
    const r = document.querySelector('.impact-lista').getBoundingClientRect();
    return Math.round(r.bottom + window.scrollY + 200);
  });
  await pg.evaluate((y) => window.scrollTo(0, y), destino);
  await pg.waitForTimeout(2500);
  const onde = await pg.evaluate(() => ({
    scrollY: Math.round(window.scrollY),
    fileiraTop: Math.round(document.querySelector('.impact-lista').getBoundingClientRect().top),
  }));
  const r = await pg.evaluate(() => {
    const itens = [...document.querySelectorAll('.impact-item')];
    return {
      observando: document.querySelector('.impact-lista').dataset.observando ?? '(ausente)',
      apagados: itens.filter((n) => n.dataset.aceso === 'nao').map((n) => n.dataset.indicadorI),
      invisiveis: itens.filter((n) => parseFloat(getComputedStyle(n).opacity) < 0.9).length,
      numeros: itens.map((n) => n.querySelector('.impact-numero-vivo').textContent),
      zeros: itens.filter((n) => n.querySelector('.impact-numero-vivo').textContent.trim() === '0').length,
    };
  });
  console.log((rm ? 'MOVIMENTO REDUZIDO' : 'PADRAO') + ' [destino=' + destino + ' ' + JSON.stringify(onde) + ']: ' + JSON.stringify(r));
  await ctx.close();
}

/* Arvore de acessibilidade: o gabarito de largura duplica o numero no textContent
   (`919850+`). `visibility: hidden` deve mante-lo fora do que o leitor anuncia. */
const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
await pg.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await pg.waitForTimeout(2500);
const dup = await pg.evaluate(() => [...document.querySelectorAll('.impact-numero')].map((n) => ({
  /* `textContent` inclui o gabarito escondido; `innerText` respeita
     `visibility: hidden` e é o que se aproxima do que o leitor de tela anuncia. */
  textContent: n.textContent,
  innerText: n.innerText,
  gabaritoVisibility: getComputedStyle(n.querySelector('.impact-numero-gabarito')).visibility,
})));
console.log('--- duplicacao do numero (gabarito de largura) ---');
dup.forEach((d) => console.log('  textContent=' + JSON.stringify(d.textContent) + ' innerText=' + JSON.stringify(d.innerText) + ' gabarito=' + d.gabaritoVisibility));
/* Teclado: nada da fileira é focavel, e nao precisa ser — é texto. O que importa
   é que a faixa de atalhos, que ERA o canal de teclado, nao deixou vazio. */
const focaveis = await pg.evaluate(() => document.querySelectorAll('.impact-scroll a,.impact-scroll button,.impact-scroll [tabindex]').length);
console.log('focaveis dentro da secao: ' + focaveis);
await b.close();
