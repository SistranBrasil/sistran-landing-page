/* O núcleo do pedido: «de seguir o MESMO FUNDO em todas as sessões».

   A prova é esta — o plano está ancorado na JANELA, então um ponto (x, y) da janela
   tem de devolver a MESMA cor em qualquer rolagem. Se o fundo fosse por seção (como
   era antes), cada faixa daria um número diferente nesse mesmo ponto.

   A primeira versão desta sonda lia as margens da janela com a página inteira
   visível, e as margens NÃO são plano puro: a fita `.sobre-metricas on-dark` e os
   painéis do Escritórios sangram até a borda, então o número lido era conteúdo. A
   leitura só isola o plano com o conteúdo escondido — `visibility: hidden` em todo
   filho do `<main>` MENOS a camada de atmosfera. O que sobra na janela é exatamente
   o plano da rota: cor do `<main>`, a malha do `::before` e o SVG.

   O QUE ESTA SONDA PROVA E O QUE NÃO PROVA: `visibility: hidden` também apagaria o
   fundo de uma faixa que ainda declarasse superfície própria, então a amplitude
   zero aqui prova só que O PLANO não varia com a rolagem (é ancorado na janela).
   A outra metade da afirmação — que nenhuma faixa clara declara mais fundo próprio
   — é medida na segunda parte, por estilo computado das nove superfícies. As duas
   juntas são «o mesmo fundo em todas as sessões»; uma sozinha não é.

   A rolagem de cada faixa é a mesma da sonda de emenda (topo + 40), e só entram as
   faixas mais altas que a janela para que o ponto lido pertença àquela faixa.

     node scripts/medir-plano-mesma-altura.mjs
*/
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
import sharp from 'sharp';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROTA = process.env.ROTA ?? 'http://localhost:3000/quem-somos';
/* As faixas CLARAS, na ordem dos filhos do `<main>` (inventário medido). */
const CLARAS = [1, 3, 4, 5, 8, 9, 11];
const TMP = 'docs/capturas';
mkdirSync(TMP, { recursive: true });

const nav = await chromium.launch({ executablePath: EXE });
const saida = { rota: ROTA, quando: new Date().toISOString(), larguras: [] };

for (const { w, h } of [
  { w: 1440, h: 900 },
  { w: 768, h: 1024 },
  { w: 390, h: 844 },
]) {
  const ctx = await nav.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const pag = await ctx.newPage();
  await pag.goto(ROTA, { waitUntil: 'domcontentloaded' });
  await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await pag.addStyleTag({
    content: 'nextjs-portal,[data-nextjs-toast],header,[href="#conteudo"]{display:none!important}',
  });
  for (let i = 0; i < 16; i++) {
    await pag.mouse.wheel(0, h * 0.9);
    await pag.waitForTimeout(200);
  }
  await pag.waitForTimeout(1000);

  /* SUPERFÍCIES — antes de esconder nada: nenhuma das nove pode pintar mais. */
  const superficies = await pag.evaluate(() => {
    const alvos = [
      '.section-light',
      '.sobre-secao',
      '.tec-secao',
      '.dif-secao',
      '.ne-secao',
      '.cem-secao',
      '.rgal-secao',
      '.section-light.isg-secao',
      '#mais-quem-somos',
    ];
    const fora = [];
    for (const s of alvos) {
      for (const el of document.querySelectorAll(s)) {
        const cs = getComputedStyle(el);
        const m = cs.backgroundColor.match(/[\d.]+/g);
        const alfa = m ? (m[3] === undefined ? 1 : +m[3]) : 0;
        if (alfa > 0.02 || cs.backgroundImage !== 'none') {
          fora.push({ sel: s, cor: cs.backgroundColor, imagem: cs.backgroundImage.slice(0, 80) });
        }
      }
    }
    return { alvos: alvos.length, aindaPintam: fora };
  });

  await pag.addStyleTag({
    content: 'main > *:not(.quem-somos-atmosfera){visibility:hidden!important}',
  });
  await pag.waitForTimeout(300);

  await pag.evaluate(() =>
    [...document.querySelector('main').children]
      .filter((el) => !el.classList.contains('quem-somos-atmosfera'))
      .forEach((el, i) => {
        el.dataset.sondaFaixa = String(i);
      }),
  );

  const leituras = [];
  for (const i of CLARAS) {
    const cx = await pag.evaluate((k) => {
      const el = document.querySelector(`[data-sonda-faixa="${k}"]`);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { topo: Math.round(b.top + scrollY), altura: Math.round(b.height) };
    }, i);
    if (!cx) continue;
    /* Com o conteúdo escondido não é mais preciso que a faixa cubra a janela: o que
       se compara são POSIÇÕES DE ROLAGEM distintas, e a de cada faixa clara é uma
       delas. Só faixa curta demais para gerar rolagem própria sai. */
    if (cx.altura < 200) {
      leituras.push({ faixa: i, pulada: `altura ${cx.altura} < 200` });
      continue;
    }
    await pag.evaluate((y) => window.scrollTo(0, y), cx.topo + 40);
    await pag.waitForTimeout(500);
    const arq = `${TMP}/qs-altura-${w}-${i}.png`;
    await pag.screenshot({ path: arq });
    const { data, info } = await sharp(arq).raw().toBuffer({ resolveWithObject: true });
    const px = (x, y) => {
      const o = (y * info.width + x) * info.channels;
      return [data[o], data[o + 1], data[o + 2]];
    };
    leituras.push({
      faixa: i,
      altura: cx.altura,
      pontos: {
        'esq y=120': px(6, 120),
        'esq y=meio': px(6, Math.round(h / 2)),
        'dir y=meio': px(info.width - 7, Math.round(h / 2)),
        'dir y=h-60': px(info.width - 7, h - 60),
      },
    });
  }

  const validas = leituras.filter((l) => l.pontos);
  const nomes = validas.length ? Object.keys(validas[0].pontos) : [];
  const espalhamento = nomes.map((n) => {
    const vs = validas.map((l) => l.pontos[n]);
    const d = [0, 1, 2].map((c) => Math.max(...vs.map((v) => v[c])) - Math.min(...vs.map((v) => v[c])));
    return { ponto: n, amplitudePorCanal: d, pior: Math.max(...d) };
  });

  saida.larguras.push({ largura: w, altura: h, superficies, leituras, espalhamento });
  console.log(`\n=== ${w}x${h} — faixas claras lidas: ${validas.length}/${CLARAS.length} ===`);
  console.log(
    `  superfícies próprias que ainda pintam: ${superficies.aindaPintam.length} (de ${superficies.alvos} seletores)`,
  );
  for (const s of superficies.aindaPintam) console.log(`    ${s.sel} ${s.cor} ${s.imagem}`);
  for (const l of leituras) {
    if (l.pulada) {
      console.log(`  faixa ${String(l.faixa).padStart(2)}: PULADA (${l.pulada})`);
      continue;
    }
    console.log(
      `  faixa ${String(l.faixa).padStart(2)}: ${Object.entries(l.pontos)
        .map(([k, v]) => `${k}=${v.join(',')}`)
        .join('  ')}`,
    );
  }
  for (const e of espalhamento) {
    console.log(`  AMPLITUDE ${e.ponto.padEnd(10)} rgb ${e.amplitudePorCanal.join('/')} → pior ${e.pior}`);
  }
  await ctx.close();
}

await nav.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/plano-mesma-altura-quem-somos.json', `${JSON.stringify(saida, null, 2)}\n`);
rmSync(TMP, { recursive: true, force: true });
