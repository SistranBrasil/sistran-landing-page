/**
 * SIS-282 — «/sistran-university · negrito em Formar especialistas + Em parceria com o Unidep».
 *
 * `node scripts/medir-negrito-university-sis282.mjs [antes|depois]`  (`next dev` em :3000)
 *
 * O que cada critério exige para virar número:
 *
 *  • «Os dois títulos leem claramente em negrito» — o número é o `font-weight`
 *    COMPUTADO dos dois `h2`, e ele sozinho não basta: o projeto declara
 *    `font-synthesis: none` em `html` (`globals.css`, SIS-155), então um peso pedido
 *    SEM corte carregado não engorda nada — o texto continuaria fino e o CSS
 *    mentiria. Por isso mede-se também a LARGURA do texto renderizado: negrito real
 *    ocupa mais avanço horizontal que 400. Sem o "antes" não existe a palavra
 *    "mais".
 *    A largura é lida por `Range.getBoundingClientRect()` sobre o nó de texto, e
 *    não pela caixa do `h2` (que é a coluna inteira da grade e não mudaria de
 *    largura nunca). Mede-se por LINHA, porque o título quebra em duas.
 *  • O REALCE («tecnologia de ponta») é medido à parte: ele é um `<span>` dentro do
 *    primeiro `h2` e o ponto 1 da issue pede que ele venha junto. Só herda o peso
 *    se nada o fixar — `.section-light .university-programa-realce` fixa `color`
 *    com `!important`, e é preciso confirmar que peso não entrou na carona.
 *  • «Copy intacta» — o texto dos dois títulos e do parágrafo do programa, na
 *    íntegra, para comparar caractere a caractere entre antes e depois. A issue
 *    proíbe mexer em copy, e trocar peso é exatamente o tipo de edição em que uma
 *    palavra se perde sem ninguém notar.
 *  • «Não mudar layout (SIS-280)» — contagem de LINHAS de cada título (pela altura
 *    da caixa dividida pelo `line-height`) e a caixa dos dois. Negrito alarga o
 *    avanço: se o título passar de duas para três linhas, a composição que a
 *    SIS-280 mediu quebrou, e isso é regressão mesmo com o peso correto.
 */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = 'http://localhost:3000';
const ROTA = '/sistran-university';
const MOMENTO = process.argv[2] === 'depois' ? 'depois' : 'antes';
const LARGURAS = [1440, 1024];

await mkdir('docs/capturas', { recursive: true });
await mkdir('docs/medidas', { recursive: true });

const nav = await chromium.launch();
const res = { issue: 'SIS-282', momento: MOMENTO, rota: ROTA, erros: [], porLargura: {} };

const sonda = (p) =>
  p.evaluate(() => {
    /* A largura REAL da tinta, linha por linha.
       ⚠️ `getClientRects()` de um Range NÃO devolve um retângulo por linha: devolve
       um por FRAGMENTO. A primeira leitura desta sonda deu 5 retângulos para o
       título do programa, que tem duas linhas — porque o `h2` é «texto + <span> +
       texto» e o `<span>` ainda aparece duas vezes (o elemento e o nó de texto
       dentro dele). Contar retângulos daria "5 linhas" e o critério de layout
       viraria ruído.
       Daí AGRUPAR POR `top`: cada grupo é uma linha visual, e a largura da linha é
       `maxRight − minLeft` do grupo. A deduplicação vem de graça no agrupamento. */
    const linhasDoTexto = (no) => {
      const r = document.createRange();
      r.selectNodeContents(no);
      const porTopo = new Map();
      for (const c of r.getClientRects()) {
        if (c.width <= 1) continue;
        const chave = Math.round(c.top);
        const g = porTopo.get(chave) ?? { esq: Infinity, dir: -Infinity, h: 0 };
        g.esq = Math.min(g.esq, c.left);
        g.dir = Math.max(g.dir, c.right);
        g.h = Math.max(g.h, c.height);
        porTopo.set(chave, g);
      }
      return Array.from(porTopo.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([topo, g]) => ({
          topo,
          w: Math.round((g.dir - g.esq) * 10) / 10,
          h: Math.round(g.h * 10) / 10,
        }));
    };

    const medir = (sel) => {
      const no = document.querySelector(sel);
      if (!no) return null;
      const e = getComputedStyle(no);
      const b = no.getBoundingClientRect();
      const linhas = linhasDoTexto(no);
      return {
        texto: no.textContent.trim(),
        pesoComputado: e.fontWeight,
        fontSize: e.fontSize,
        lineHeight: e.lineHeight,
        familia: e.fontFamily.split(',')[0],
        /* `font-synthesis: none` está em `html`; se um dia sair, o peso pedido
           passaria a ser sintetizado e este campo denunciaria. */
        fontSynthesis: getComputedStyle(document.documentElement).fontSynthesis || null,
        caixa: { w: Math.round(b.width * 10) / 10, h: Math.round(b.height * 10) / 10 },
        linhasDeTinta: linhas,
        quantasLinhas: linhas.length,
        /* Conferência independente da contagem por `top`, para o caso de duas
           linhas caírem no mesmo pixel arredondado. */
        linhasPorAltura: Math.round(b.height / parseFloat(e.lineHeight)),
        larguraDaLinhaMaisLarga: linhas.length ? Math.max(...linhas.map((l) => l.w)) : null,
        /* O NÚMERO SENSÍVEL AO PESO: o avanço horizontal total da tinta, somando as
           linhas. Ele cresce com o negrito mesmo se a quebra mudar de lugar, e é o
           que prova que o peso pedido virou glifo — com `font-synthesis: none`, um
           peso sem corte carregado deixaria este número IGUAL ao do "antes". */
        somaDaTinta: Math.round(linhas.reduce((s, l) => s + l.w, 0) * 10) / 10,
      };
    };

    return {
      programa: medir('#university-programa-titulo'),
      programaRealce: medir('#university-programa-titulo .university-programa-realce'),
      unidep: medir('#university-unidep-titulo'),
      /* Fora de escopo, medido como TESTEMUNHA: o parágrafo do programa já tem
         `<strong>` e não deve mudar de peso nem de texto. */
      paragrafoStrong: medir('#university-programa p strong'),
      copy: {
        programa: document.querySelector('#university-programa-titulo')?.textContent.trim() ?? null,
        unidep: document.querySelector('#university-unidep-titulo')?.textContent.trim() ?? null,
        paragrafo: document.querySelector('#university-programa p')?.textContent.trim() ?? null,
      },
      rolagemHorizontal: {
        vaza: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      },
    };
  });

for (const width of LARGURAS) {
  const ctx = await nav.newContext({ viewport: { width, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('sistran-motion-preference-seen', '1'));
  const p = await ctx.newPage();
  p.on('console', (m) => { if (m.type() === 'error') res.erros.push(`${width}: ${m.text()}`); });

  await p.goto(`${BASE}${ROTA}`, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-content][data-route-liberado="true"]', { timeout: 60000 }).catch(() => null);
  /* As fontes são `display: swap`: medir avanço horizontal antes de a Geist chegar
     mediria a Helvetica de queda, e a comparação antes/depois viraria ruído. */
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(600);

  /* Rolar até cada seção antes de capturar: as duas nascem abaixo da dobra e a
     rota tem reveal-on-scroll — capturar do topo devolveria duas faixas vazias. */
  for (const [nome, sel] of [['programa', '#university-programa'], ['unidep', '#university-unidep']]) {
    await p.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: 'center' }), sel);
    await p.waitForTimeout(1200);
    if (width === 1440) {
      await p.screenshot({ path: `docs/capturas/sis282-${nome}-1440-${MOMENTO}.png` });
      const no = await p.$(sel);
      if (no) await no.screenshot({ path: `docs/capturas/sis282-${nome}-secao-1440-${MOMENTO}.png` });
    }
  }
  res.porLargura[width] = await sonda(p);
  await ctx.close();
}

await nav.close();
await writeFile(`docs/medidas/sis282-${MOMENTO}.json`, `${JSON.stringify(res, null, 1)}\n`);
console.log(JSON.stringify(res, null, 1));
