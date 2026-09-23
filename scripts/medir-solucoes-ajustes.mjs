/**
 * PORTÕES dos seis ajustes pedidos em chat para `/solucoes`.
 *
 * Um por item, todos no DOM computado da rota:
 *   1. o `h1` está em NEGRITO (peso computado, não classe) e em TRÊS LINHAS com a
 *      divisão pedida — as linhas são medidas por `getClientRects()` do nó de texto,
 *      que é o que o navegador realmente quebrou, e o TEXTO do `h1` continua sendo a
 *      mesma frase (portão de cópia: o `<br>` não pode ter mudado a string);
 *   2. a emenda entre `#beyond-technology` e `#tecnologia-disruptiva` ENCURTOU —
 *      medida como a distância vertical entre o fim da última tinta da primeira
 *      seção e o começo da primeira tinta da segunda, comparada contra o valor de
 *      antes registrado na chamada;
 *   3. o carimbo e o `h2` «Soluções» estão NA MESMA LINHA, com o carimbo à ESQUERDA:
 *      geometria, não intenção — o `h2` começa depois do fim do carimbo no eixo X e
 *      as duas faixas verticais se sobrepõem;
 *   4. o CTA «Quero um serviço exclusivo» está LOGO ABAIXO dos indicadores: mede-se
 *      o vão entre a base do `<dl>` e o topo do botão, e confere-se que os dois têm
 *      o MESMO pai de coluna (senão «abaixo» seria só coincidência de scroll);
 *   5. o selo «Estratégia sob medida» SE MOVE: quatro quadros de `transform` na
 *      janela do laço, e o portão é a MUDANÇA de valor — laço de 4,2s amostrado
 *      dentro do curso, nunca depois (a lição do risco da SIS-279);
 *   6. os rótulos do navegador lateral são LEGÍVEIS em cada seção: para cada item
 *      da coluna, rola até a seção, lê a cor do rótulo ativo e o pixel COMPOSTO do
 *      fundo na margem esquerda, e calcula o contraste.
 *
 * Receita de navegador da casa (Playwright do cache do `npx`, :3000, preferência de
 * movimento semeada, canal `reduce` em CONTEXTO NOVO).
 *
 *   node scripts/medir-solucoes-ajustes.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const { chromium } = await import(
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
);

const ROTA = 'http://localhost:3000/solucoes';
const TITULO = 'Soluções, Serviços e Consultoria';
const SECOES = ['topo', 'tecnologia-disruptiva', 'servicos-diferenciais', 'consultoria'];

const semear = (ctx, valor) =>
  ctx.addInitScript((v) => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', v);
  }, valor);

async function rampa(page, alvoY) {
  for (let s = 0; s < alvoY; s += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), s);
    await page.waitForTimeout(60);
  }
  await page.evaluate((v) => window.scrollTo(0, v), alvoY);
  await page.waitForTimeout(1400);
}

/* Pixel COMPOSTO: recorte 1×1 decodificado na própria página. É o único jeito de ler
   a cor que a pessoa vê quando o fundo é o plano ancorado na janela — `backgroundColor`
   devolveria `transparent` nesta rota (SIS-204). */
async function pixel(page, x, y) {
  const buf = await page.screenshot({ clip: { x, y, width: 1, height: 1 } });
  return page.evaluate(async (dados) => {
    const img = new Image();
    img.src = `data:image/png;base64,${dados}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  }, buf.toString('base64'));
}

const canal = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const contraste = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Number(((x + 0.05) / (y + 0.05)).toFixed(2));
};
const rgbPara = (s) => (s.match(/\d+/g) ?? []).slice(0, 3).map(Number);

/* ITENS 1 A 4, medidos no topo e com rampa onde a seção nasce abaixo da dobra. */
const lerCapa = (page, titulo) =>
  page.evaluate((esperado) => {
    const h1 = document.querySelector('#topo h1');
    if (!h1) return null;
    const e = getComputedStyle(h1);
    /* AS LINHAS REAIS: `getClientRects()` de um Range sobre o `h1` devolve um
       retângulo por linha VISUAL — é o que o navegador quebrou, e não o que eu
       escrevi. Agrupo por `top` arredondado porque cada `<span>`/`<br>` gera
       retângulos próprios na mesma linha. */
    const faixa = document.createRange();
    faixa.selectNodeContents(h1);
    const tops = [...faixa.getClientRects()]
      .filter((r) => r.width > 0 && r.height > 0)
      .map((r) => Math.round(r.top));
    const linhas = [...new Set(tops)].sort((a, b) => a - b);
    /* O texto por linha: junta o conteúdo de cada `<span>` de linha, se houver. */
    const spans = [...h1.children].filter((n) => n.tagName === 'SPAN');
    return {
      texto: h1.textContent.replace(/\s+/g, ' ').trim(),
      textoEsperado: esperado,
      textoIntacto: h1.textContent.replace(/\s+/g, ' ').trim() === esperado,
      peso: e.fontWeight,
      tamanho: Number(parseFloat(e.fontSize).toFixed(1)),
      familia: e.fontFamily,
      linhasVisuais: linhas.length,
      topoDasLinhas: linhas,
      linhasEscritas: spans.map((s) => s.textContent.trim()),
      quebras: h1.querySelectorAll('br').length,
    };
  }, titulo);

const lerEmenda = (page) =>
  page.evaluate(() => {
    const intro = document.getElementById('beyond-technology');
    const cards = document.getElementById('tecnologia-disruptiva');
    if (!intro || !cards) return null;
    const ei = getComputedStyle(intro);
    const ec = getComputedStyle(cards);
    /* A última tinta da introdução é o fundo do miolo dela; a primeira tinta dos
       cards é o topo do cabeçalho. O vão é a soma dos dois paddings mais qualquer
       margem entre as seções — medido, não somado à mão. */
    const miolo = intro.querySelector('.solucoes-intro');
    const cabeca = cards.querySelector('.accel-cabeca');
    const vao =
      miolo && cabeca
        ? Math.round(
            cabeca.getBoundingClientRect().top - miolo.getBoundingClientRect().bottom,
          )
        : null;
    return {
      introPaddingBaixo: Math.round(parseFloat(ei.paddingBottom)),
      cardsPaddingTopo: Math.round(parseFloat(ec.paddingTop)),
      somaDaEmenda:
        Math.round(parseFloat(ei.paddingBottom)) + Math.round(parseFloat(ec.paddingTop)),
      vaoMedidoEntreTintas: vao,
    };
  });

const lerCabecaAccel = (page) =>
  page.evaluate(() => {
    const secao = document.getElementById('tecnologia-disruptiva');
    const carimbo = secao?.querySelector('.carimbo-batida') ?? null;
    const h2 = [...(secao?.querySelectorAll('h2') ?? [])].find(
      (n) => n.textContent.trim() === 'Soluções',
    );
    if (!carimbo || !h2) return null;
    const a = carimbo.getBoundingClientRect();
    const b = h2.getBoundingClientRect();
    return {
      carimbo: { x: Math.round(a.x), y: Math.round(a.y), w: Math.round(a.width), h: Math.round(a.height) },
      h2: { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) },
      /* «AO LADO, à direita»: o `h2` começa depois do fim do carimbo no eixo X e as
         duas faixas verticais se sobrepõem. */
      tituloADireita: b.left >= a.right - 1,
      mesmaLinha: b.top < a.bottom && b.bottom > a.top,
      /* Sobreposição vertical em fração da altura do `h2` — «na mesma linha» de
         verdade, e não dois pixels de encosto. */
      sobreposicao: Number(
        ((Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)) / b.height).toFixed(3),
      ),
      vaoHorizontal: Math.round(b.left - a.right),
      mesmoPai: carimbo.parentElement === h2.parentElement,
      larguraDaLinha: Math.round(
        (carimbo.closest('.accel-cabeca-linha')?.getBoundingClientRect().width ?? 0),
      ),
      h2Peso: getComputedStyle(h2).fontWeight,
    };
  });

const lerCta = (page) =>
  page.evaluate(() => {
    const secao = document.getElementById('servicos-diferenciais');
    const dl = secao?.querySelector('.svc-palco-indicadores') ?? null;
    const botao = [...(secao?.querySelectorAll('a') ?? [])].find((n) =>
      n.textContent.includes('Quero um serviço exclusivo'),
    );
    if (!dl || !botao) return null;
    const a = dl.getBoundingClientRect();
    const b = botao.getBoundingClientRect();
    const coluna = secao.querySelector('.svc-palco-abertura');
    return {
      indicadores: { y: Math.round(a.y), base: Math.round(a.bottom) },
      botao: { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width) },
      /* O número do pedido: quantos pixels entre o fim dos números e o topo do
         botão. Antes ele estava em OUTRO bloco, depois do palco inteiro. */
      vaoAbaixoDosNumeros: Math.round(b.top - a.bottom),
      /* «Logo abaixo» só é estrutural se os dois estiverem na MESMA coluna. */
      naColunaDaAbertura: !!coluna && coluna.contains(botao),
      dentroDoEscopoDeReveal:
        botao.closest('[data-reveal-nome]')?.getAttribute('data-reveal-nome') ?? null,
      /* A lição da SIS-271: a marca de reveal não pode estar NO botão. */
      revealNoBotao: botao.hasAttribute('data-reveal'),
      revealNoInvolucro: botao.parentElement?.hasAttribute('data-reveal') ?? null,
      faixaAntigaAindaExiste: !!secao.querySelector('[data-reveal-nome="servicos-cta"]'),
    };
  });

/* ITEM 5 — O SELO FLUTUA: quatro quadros dentro do curso do laço. O portão é a
   MUDANÇA do `transform`, não «existe animação»: laço declarado e congelado por
   qualquer regra a jusante passaria num portão de presença. */
async function flutuacao(browser, largura) {
  const ctx = await browser.newContext({ viewport: { width: largura, height: 900 } });
  await semear(ctx, 'full');
  const page = await ctx.newPage();
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(2500);
  const y = await page.evaluate(() => {
    const el = document.getElementById('consultoria');
    return el ? el.getBoundingClientRect().top + window.scrollY - 100 : null;
  });
  if (y === null) {
    await ctx.close();
    return null;
  }
  await rampa(page, y);
  const amostras = [];
  /* Esperas curtas e desiguais dentro de um laço de 4,2s: em 1,05s (um quarto) o
     valor já andou de ponta a meio. Quatro quadros cobrem mais de meio ciclo. */
  for (const espera of [0, 500, 600, 700]) {
    if (espera) await page.waitForTimeout(espera);
    amostras.push(
      await page.evaluate(() => {
        const el = document.querySelector('figcaption');
        if (!el) return null;
        const e = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          transform: e.transform,
          animacao: e.animationName,
          duracao: e.animationDuration,
          iteracoes: e.animationIterationCount,
          topo: Number(r.top.toFixed(2)),
          texto: el.textContent.trim(),
        };
      }),
    );
  }
  await ctx.close();
  const tops = amostras.map((a) => a?.topo).filter((v) => typeof v === 'number');
  return {
    amostras,
    transformsDistintos: new Set(amostras.map((a) => a?.transform)).size,
    amplitudeMedida: tops.length ? Number((Math.max(...tops) - Math.min(...tops)).toFixed(2)) : null,
  };
}

/* ITEM 6 — LEGIBILIDADE DO NAVEGADOR LATERAL, seção por seção. */
async function navegador(page) {
  const saida = [];
  for (const id of SECOES) {
    const y = await page.evaluate((s) => {
      const el = document.getElementById(s);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      /* O MEIO da seção: a faixa do `IntersectionObserver` é `-40% / -55%`, ou seja
         a linha de leitura no meio da tela. Parar no topo da seção marcaria a
         anterior. */
      return Math.max(0, r.top + window.scrollY + r.height / 2 - 450);
    }, id);
    if (y === null) continue;
    await rampa(page, y);
    const estado = await page.evaluate(() => {
      /* A COLUNA é o `<nav>` que tem item marcado — e não «o nav cujo `aria-label`
         não é 'Nesta página'», que foi a primeira tentativa e devolveu «nenhum item
         ativo» nas quatro seções: `navIdiomaForPath` dá à coluna o MESMO rótulo da
         barra de âncoras da página em pt-BR, então o filtro excluía justamente o
         alvo. Marcação é o que distingue os dois, e a barra da página não marca. */
      const nav = [...document.querySelectorAll('nav')].find((n) =>
        n.querySelector('a[aria-current="true"]'),
      );
      const ativo = nav?.querySelector('a[aria-current="true"]') ?? null;
      if (!nav || !ativo) return null;
      const rotulo = ativo.querySelector('span:last-child');
      const traco = ativo.querySelector('span:first-child');
      const r = rotulo.getBoundingClientRect();
      return {
        destino: ativo.getAttribute('href'),
        rotulo: rotulo.textContent.trim(),
        cor: getComputedStyle(rotulo).color,
        opacidade: getComputedStyle(rotulo).opacity,
        corDoTraco: getComputedStyle(traco).backgroundColor,
        caixa: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      };
    });
    if (!estado) {
      saida.push({ secao: id, erro: 'nenhum item ativo' });
      continue;
    }
    /* O FUNDO na margem esquerda, no PIOR pixel de uma varredura curta ao redor do
       rótulo: um ponto fixo pode cair numa camada mais escura ou mais clara que a
       média e daria um contraste que não é o que se lê. E a tinta é o pior pixel
       DENTRO do glifo — em rótulo de 11px o raster tem franja de antialiasing, então
       reporto os dois números (a lição registrada em memória). */
    const c = estado.caixa;
    let fundoPior = null;
    for (let dx = -6; dx < c.w + 6; dx += 8) {
      for (const dy of [-6, c.h + 4]) {
        const p = await pixel(page, Math.max(0, c.x + dx), Math.max(0, c.y + dy));
        if (!fundoPior || Math.abs(lum(p) - lum(rgbPara(estado.cor))) < Math.abs(lum(fundoPior) - lum(rgbPara(estado.cor)))) {
          fundoPior = p;
        }
      }
    }
    let tintaPior = null;
    for (let dx = 1; dx < Math.min(c.w, 60); dx += 1) {
      const p = await pixel(page, c.x + dx, c.y + Math.round(c.h * 0.55));
      if (!tintaPior || Math.abs(lum(p) - lum(fundoPior)) < Math.abs(lum(tintaPior) - lum(fundoPior))) {
        tintaPior = p;
      }
    }
    saida.push({
      secao: id,
      ...estado,
      fundoNaMargem: fundoPior,
      /* DECLARADA: a cor do rótulo contra o fundo medido — o número do pedido
         («a cor contrária da seção para que seja possível visualizar»). */
      contrasteDeclarado: contraste(rgbPara(estado.cor), fundoPior),
      /* RASTERIZADA: o pior pixel do glifo contra o mesmo fundo. Subestima de
         propósito — é o piso, não a média. */
      tintaRasterizada: tintaPior,
      contrasteRasterizado: contraste(tintaPior, fundoPior),
    });
  }
  return saida;
}

const browser = await chromium.launch();
const saida = { rota: ROTA, quando: new Date().toISOString(), larguras: {}, reduce: {} };

for (const largura of [1440, 390]) {
  const ctx = await browser.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
  });
  await semear(ctx, 'full');
  const page = await ctx.newPage();
  const erros = [];
  const faltando = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  page.on('response', (r) => {
    if (r.status() >= 400) faltando.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(2500);

  mkdirSync('docs/capturas', { recursive: true });
  /* A capa ANTES de rolar: o item 1 é sobre o que se vê na abertura. */
  const capa = await lerCapa(page, TITULO);
  await page.screenshot({ path: `docs/capturas/ajustes-capa-${largura}.png` });

  const yAccel = await page.evaluate(() => {
    const el = document.getElementById('tecnologia-disruptiva');
    return el ? el.getBoundingClientRect().top + window.scrollY - 200 : 0;
  });
  await rampa(page, yAccel);
  const emenda = await lerEmenda(page);
  const cabeca = await lerCabecaAccel(page);
  await page.screenshot({ path: `docs/capturas/ajustes-emenda-${largura}.png` });

  const yServicos = await page.evaluate(() => {
    const el = document.getElementById('servicos-diferenciais');
    return el ? el.getBoundingClientRect().top + window.scrollY - 100 : 0;
  });
  await rampa(page, yServicos);
  const cta = await lerCta(page);
  await page.screenshot({ path: `docs/capturas/ajustes-cta-${largura}.png` });

  const yConsult = await page.evaluate(() => {
    const el = document.getElementById('consultoria');
    return el ? el.getBoundingClientRect().top + window.scrollY - 100 : 0;
  });
  await rampa(page, yConsult);
  await page.screenshot({ path: `docs/capturas/ajustes-selo-${largura}.png` });

  /* O navegador lateral só monta de 1280 para cima (o `matchMedia` do ScrollSpy). */
  const nav = largura >= 1280 ? await navegador(page) : 'coluna não monta abaixo de 1280px';

  saida.larguras[largura] = {
    item1Capa: capa,
    item2Emenda: emenda,
    item3CabecaAccel: cabeca,
    item4Cta: cta,
    item6Navegador: nav,
    respostas400: faltando,
    errosDeConsole: erros,
  };
  await ctx.close();
}

saida.item5Flutuacao = { 1440: await flutuacao(browser, 1440) };

/* MOVIMENTO REDUZIDO nos DOIS canais: o selo tem de parar E ficar no repouso
   legível — nunca preso num quadro do laço nem com `opacity: 0`. */
for (const nome of ['sistema', 'chave']) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ...(nome === 'sistema' ? { reducedMotion: 'reduce' } : {}),
  });
  await semear(ctx, nome === 'sistema' ? 'reduce' : 'full');
  const page = await ctx.newPage();
  await page.goto(ROTA, { waitUntil: 'load', timeout: 90000 });
  if (nome === 'chave')
    await page.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
  await page.waitForTimeout(1200);
  const y = await page.evaluate(() => {
    const el = document.getElementById('consultoria');
    return el ? el.getBoundingClientRect().top + window.scrollY - 100 : 0;
  });
  await rampa(page, y);
  saida.reduce[nome] = await page.evaluate(() => {
    const selo = document.querySelector('figcaption');
    const botao = [...document.querySelectorAll('a')].find((n) =>
      n.textContent.includes('Quero um serviço exclusivo'),
    );
    if (!selo) return null;
    const e = getComputedStyle(selo);
    const r = selo.getBoundingClientRect();
    return {
      seloAnimacao: e.animationName,
      seloTransform: e.transform,
      seloOpacidade: e.opacity,
      seloVisivel: r.width > 0 && r.height > 0,
      seloTexto: selo.textContent.trim(),
      botaoVisivel: !!botao && botao.getBoundingClientRect().width > 0,
      botaoOpacidade: botao ? getComputedStyle(botao).opacity : null,
      h1Linhas: document.querySelectorAll('#topo h1 br').length + 1,
    };
  });
  await ctx.close();
}

await browser.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/solucoes-ajustes.json', JSON.stringify(saida, null, 2));
console.log(JSON.stringify(saida, null, 2));
