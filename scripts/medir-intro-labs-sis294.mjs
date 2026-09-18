/* SIS-294 — mede a intro fundida de `/sistran-labs`: três fileiras
   «parágrafo | foto» em zigzag, sobre a folha clara.

   O que a issue pede provar, item por item:
   • item 1 — cada parágrafo tem A SUA foto ao lado, e os lados ALTERNAM. Medido
     pela geometria: o `x` do texto e o `x` da figura por fileira. Ler a classe
     `--espelhada` provaria que o modificador está escrito, não que a grade
     inverteu as colunas;
   • item 2 — quais arquivos ENTRARAM (`currentSrc`, não o `src` escrito), os
     `alt`, o raio e a sombra da figura;
   • item 3 — NENHUMA imagem duplicada na página: a lista de `currentSrc` de
     todas as `img` da rota, para que «uma foto por parágrafo e nada de galeria»
     seja contagem e não promessa. E a âncora morta: `#labs-ambiente` não pode
     mais existir no DOM;
   • item 4 — a superfície é CLARA e a tipografia navy: o fundo computado da
     seção e a razão de contraste do parágrafo sobre ele;
   • item 5 — a entrada por fileira, medida numa RAMPA de scroll (o `y` em que
     cada escopo acende), o empilhado a 390 (texto ACIMA da foto) e os dois
     canais de reduce;
   • item 6 — ausência de barra horizontal nas duas larguras.

   O contraste sai da folha de estilo e não do raster, ao contrário da SIS-291:
   aqui as duas cores são declaradas (não há `drop-shadow` no meio), então a
   conta é exata e o raster só acrescentaria ruído de antialiasing. */
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
import sharp from 'sharp';

const EXEC =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const URL = 'http://localhost:3000/sistran-labs';

const navegador = await chromium.launch({ executablePath: EXEC });

async function abrir({ largura = 1440, altura = 900, reduce = false, motion = 'full' } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 1,
    reducedMotion: reduce ? 'reduce' : 'no-preference',
  });
  await ctx.addInitScript(
    (m) => {
      localStorage.setItem('sistran-motion-preference', m);
      localStorage.setItem('sistran-motion-preference-seen', '1');
      sessionStorage.setItem('sistran:intro-visto', 'true');
    },
    motion,
  );
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 20000 }).catch(() => {});
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  return { ctx, p };
}

/* Rola até o fim da intro e espera as três fileiras acenderem, para que a
   geometria medida seja a do estado final e não a do deslocamento de entrada. */
async function assentar(p) {
  await p.evaluate(() => document.querySelector('#labs-o-que-e').closest('section').scrollIntoView());
  await p.waitForTimeout(600);
  await p.evaluate(() => {
    const fs = [...document.querySelectorAll('.labs-intro-fileira')];
    fs[fs.length - 1].scrollIntoView({ block: 'center' });
  });
  await p.waitForTimeout(1600);
}

function lum(rgb) {
  const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map(Number);
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function fileiras() {
  const caixa = (el) => {
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x),
      largura: Math.round(r.width),
      topo: Math.round(r.y),
      altura: Math.round(r.height),
    };
  };
  return [...document.querySelectorAll('.labs-intro-fileira')].map((fl, i) => {
    const texto = fl.querySelector('.labs-intro-texto');
    const palco = fl.querySelector('.labs-intro-palco');
    const fig = fl.querySelector('.labs-intro-figura');
    const img = fig.querySelector('img');
    const ef = getComputedStyle(fig);
    const ep = getComputedStyle(palco);
    const ct = caixa(texto);
    const cf = caixa(fig);
    return {
      indice: i + 1,
      nome: fl.getAttribute('data-reveal-nome'),
      espelhada: fl.classList.contains('labs-intro-fileira--espelhada'),
      colunas: getComputedStyle(fl).gridTemplateColumns,
      /* O veredito do zigzag: quem está mais à esquerda nesta fileira. */
      ladoDaFoto: cf.x < ct.x ? 'esquerda' : 'direita',
      /* Empilhado quando as duas caixas partem do mesmo x (uma coluna só). */
      empilhado: Math.abs(cf.x - ct.x) < 2,
      textoAcimaDaFoto: ct.topo < cf.topo,
      texto: ct,
      figura: cf,
      /* O preset lateral MUDOU DE NÓ com o ajuste das ações: ele mora no palco,
         não mais na figura, para não disputar `transform` com o hover. Ler os
         dois lugares é o que prova isso. */
      presetDaFoto: palco.getAttribute('data-reveal'),
      presetAindaNaFigura: fig.getAttribute('data-reveal'),
      presetDoTexto: texto.getAttribute('data-reveal'),
      aceso: fl.getAttribute('data-in'),
      /* Alinhamento do parágrafo: `right` nas fileiras cuja foto está à direita,
         `left` na espelhada — é o pedido «a escrita voltada para a imagem». */
      alinhamentoDoTexto: getComputedStyle(texto).textAlign,
      raio: ef.borderRadius,
      sombra: ef.boxShadow,
      /* As ações herdadas de `.labs-principais-*`, no repouso. */
      bordaDoQuadro: ef.border,
      anelDoQuadro: `${ef.outline} / offset ${ef.outlineOffset}`,
      filtroDoQuadro: ef.filter,
      placaDeSombra: getComputedStyle(palco, '::before').transform,
      quadradinhoCiano: getComputedStyle(palco, '::after').backgroundColor,
      duracao: ep.getPropertyValue('--reveal-dur').trim(),
      margemDoPalco: ep.marginTop,
      arquivo: new URL(img.currentSrc || img.src).pathname,
      alt: img.getAttribute('alt'),
      naturais: `${img.naturalWidth}x${img.naturalHeight}`,
      atributos: `${img.getAttribute('width')}x${img.getAttribute('height')}`,
      renderizada: caixa(img),
    };
  });
}

const saida = { rota: '/sistran-labs', secao: '#labs-o-que-e' };

/* ── 1440: zigzag, arquivos, superfície, contraste ─────────────────────────── */
{
  const { ctx, p } = await abrir();
  await assentar(p);
  saida.fileiras1440 = await p.evaluate(fileiras);

  saida.superficie = await p.evaluate(() => {
    const sec = document.querySelector('#labs-o-que-e').closest('section');
    const par = document.querySelector('.labs-intro-texto p');
    return {
      classesDaSecao: sec.className,
      fundoDaSecao: getComputedStyle(sec).backgroundColor,
      fundoDoTrilho: getComputedStyle(document.querySelector('.labs-intro-pilha')).backgroundColor,
      corDoParagrafo: getComputedStyle(par).color,
      linhaDeFronteira: getComputedStyle(document.querySelector('.labs-intro')).borderBottom,
      overflowXDoTrilho: getComputedStyle(document.querySelector('.labs-intro-pilha')).overflowX,
      /* AJUSTE — a contenção lateral subiu da pilha para a SEÇÃO, porque na
         pilha a borda de recorte ficava a poucos pixels da foto e cortava o halo
         ciano numa reta vertical. `folgaAteORecorte` é o número que prova que o
         corte não alcança mais nenhuma peça: distância da borda da figura até a
         borda da caixa que recorta, contra o pior caso de ~44px (placa desfocada
         a ~39px + halo de 28px + anel de 7px, medidos no repouso e no hover). */
      overflowXDaSecao: getComputedStyle(sec).overflowX,
      folgaAteORecorte: (() => {
        const cs = sec.getBoundingClientRect();
        return [...document.querySelectorAll('.labs-intro-figura')].map((f) => {
          const r = f.getBoundingClientRect();
          return { esquerda: Math.round(r.x - cs.x), direita: Math.round(cs.right - r.right) };
        });
      })(),
    };
  });
  {
    const s = saida.superficie;
    /* `background-color` computado NÃO serve aqui: a `.section-light` pinta por
       `background-image` (folha + grade sutil), então a seção e o trilho devolvem
       `rgba(0,0,0,0)` e subir na árvore procurando cor opaca acaba no azul do
       `<body>` — que não é o que está atrás do parágrafo. O número vem do RASTER:
       um retalho da margem da seção, ao lado da coluna de texto, sem tinta de
       conteúdo dentro. */
    const ponto = await p.evaluate(() => {
      /* A ÚLTIMA fileira, e não a primeira: o `assentar` acima centraliza a
         última, então a primeira está acima da dobra e o retalho sairia com `y`
         negativo — `clip` de `page.screenshot` é em coordenadas de VIEWPORT e
         recusa área fora dela (foi o erro da 1ª volta desta sonda). */
      const t = [...document.querySelectorAll('.labs-intro-texto')].pop().getBoundingClientRect();
      return { x: Math.max(4, Math.round(t.x) - 40), y: Math.round(t.y + t.height / 2) };
    });
    const retalho = await p.screenshot({ clip: { x: ponto.x, y: ponto.y, width: 8, height: 8 } });
    const { data } = await sharp(retalho).raw().toBuffer({ resolveWithObject: true });
    const fundo = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    s.fundoNoRaster = { cor: fundo, amostradoEm: ponto };
    const a = lum(s.corDoParagrafo);
    const b = lum(fundo);
    s.contrasteDoParagrafo =
      Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100;
  }

  /* Item 3: nada duplicado, e a casca antiga não existe mais. */
  saida.imagensDaPagina = await p.evaluate(() => {
    const todas = [...document.querySelectorAll('img')].map((i) => new URL(i.currentSrc || i.src).pathname);
    const conta = {};
    for (const a of todas) conta[a] = (conta[a] ?? 0) + 1;
    return {
      total: todas.length,
      repetidas: Object.entries(conta).filter(([, n]) => n > 1),
      abas: todas.filter((a) => /aba-sistran-labs/.test(a)),
    };
  });
  saida.ancoraAmbienteAindaExiste = await p.evaluate(() => !!document.getElementById('labs-ambiente'));
  saida.paradasDoScrollSpy = await p.evaluate(() =>
    [...document.querySelectorAll('nav a[href^="#"]')].map((a) => ({
      href: a.getAttribute('href'),
      existe: !!document.getElementById(a.getAttribute('href').slice(1)),
    })),
  );

  saida.barraHorizontal1440 = await p.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  /* AJUSTE (a) — o grafismo do fundo existe, é o MESMO da `/sistran-university`
     e está ATRÁS do conteúdo. Comparar valor por valor com a referência é o que
     prova «igual» em vez de «parecido». */
  saida.acentos1440 = await p.evaluate(() => {
    const a = document.querySelector('.labs-intro-acentos');
    const e = getComputedStyle(a);
    const antes = getComputedStyle(a, '::before');
    const depois = getComputedStyle(a, '::after');
    const conteudo = document.querySelector('.labs-intro > .container-lp');
    return {
      existe: !!a,
      ariaHidden: a.getAttribute('aria-hidden'),
      display: e.display,
      posicao: e.position,
      z: e.zIndex,
      eventos: e.pointerEvents,
      malha: { imagem: antes.backgroundImage, modulo: antes.backgroundSize, mascara: antes.maskImage },
      quadrado: {
        largura: depois.width,
        raio: depois.borderRadius,
        fundo: depois.backgroundImage,
        topo: depois.top,
        esquerda: depois.left,
      },
      zDoConteudo: getComputedStyle(conteudo).zIndex,
      /* Nenhum ponto de texto por cima da malha: as duas manchas caem sob as
         fotos, conferido pela interseção das caixas. */
      manchasSobTexto: [...document.querySelectorAll('.labs-intro-texto')].map((t) => {
        const r = t.getBoundingClientRect();
        const ra = a.getBoundingClientRect();
        const fx = (r.x - ra.x) / ra.width;
        return { fracaoX: Math.round(fx * 100) / 100, larguraFracao: Math.round((r.width / ra.width) * 100) / 100 };
      }),
    };
  });

  /* A MESMA LEITURA na referência, para a comparação ser de números e não de
     memória. */
  {
    const q = await ctx.newPage();
    await q.goto('http://localhost:3000/sistran-university', { waitUntil: 'networkidle' });
    await q.waitForSelector('.university-programa-acentos', { timeout: 20000 }).catch(() => {});
    saida.acentosDaReferencia = await q.evaluate(() => {
      const a = document.querySelector('.university-programa-acentos');
      if (!a) return null;
      const antes = getComputedStyle(a, '::before');
      const depois = getComputedStyle(a, '::after');
      return {
        malha: { imagem: antes.backgroundImage, modulo: antes.backgroundSize, mascara: antes.maskImage },
        quadrado: {
          largura: depois.width,
          raio: depois.borderRadius,
          fundo: depois.backgroundImage,
          topo: depois.top,
          esquerda: depois.left,
        },
      };
    });
    await q.close();
  }

  /* AJUSTE (b) — o hover. `force: true` porque o alvo pode estar em transição, e
     a leitura é do QUADRO (que sobe) e da PLACA (que desce e desfoca mais), os
     dois nós que a arte de «Principais Soluções» move. */
  {
    const palco = p.locator('.labs-intro-palco').first();
    const repouso = await p.evaluate(() => {
      const el = document.querySelector('.labs-intro-figura');
      return { quadro: getComputedStyle(el).transform, borda: getComputedStyle(el).borderColor };
    });
    await palco.hover({ force: true });
    await p.waitForTimeout(900);
    const sobre = await p.evaluate(() => {
      const pl = document.querySelector('.labs-intro-palco');
      const el = document.querySelector('.labs-intro-figura');
      const im = document.querySelector('.labs-intro-imagem');
      return {
        quadro: getComputedStyle(el).transform,
        borda: getComputedStyle(el).borderColor,
        anel: getComputedStyle(el).outlineColor,
        imagem: getComputedStyle(im).transform,
        placa: getComputedStyle(pl, '::before').filter,
        placaTransform: getComputedStyle(pl, '::before').transform,
      };
    });
    saida.hover1440 = { repouso, sobre };
    saida.barraHorizontalNoHover = await p.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    await p.mouse.move(0, 0);
    await p.waitForTimeout(900);
  }

  await p.screenshot({ path: 'docs/capturas/sis294-1440-intro.png' });
  await p.evaluate(() => document.querySelector('#labs-o-que-e').closest('section').scrollIntoView());
  await p.waitForTimeout(800);
  await p.screenshot({ path: 'docs/capturas/sis294-1440-topo-da-intro.png' });
  await ctx.close();
}

/* ── RAMPA: em que `y` cada fileira acende ─────────────────────────────────
   A pilha fundida passa de 2000px a 1440 — mais alta que a viewport. Um escopo
   único terminaria a animação da última foto bem abaixo da dobra, e é por isso
   que há um `RevealScope` por fileira. A rampa é o que mostra três ignições em
   três posições, e não uma só.

   EM CONTEXTO NOVO, e não no de cima: o reveal LATCHA (`data-in` fica `true` e
   não volta), então medir a rampa depois de já ter rolado até o fim da intro
   devolveria y=0 para as três — foi o que a primeira volta desta sonda devolveu,
   e é leitura do medidor, não da página. */
{
  const { ctx, p } = await abrir();
  const PASSO = 60;
  await p.waitForTimeout(500);
  const altura = await p.evaluate(() => document.documentElement.scrollHeight);
  const ignicao = {};
  const quantas = await p.evaluate(() => document.querySelectorAll('.labs-intro-fileira').length);
  for (let y = 0; y < Math.min(altura, 4200); y += PASSO) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(90);
    const estados = await p.evaluate(() =>
      [...document.querySelectorAll('.labs-intro-fileira')].map((f) => ({
        nome: f.getAttribute('data-reveal-nome'),
        aceso: f.getAttribute('data-in') === 'true',
      })),
    );
    for (const e of estados) if (e.aceso && ignicao[e.nome] === undefined) ignicao[e.nome] = y;
    if (Object.keys(ignicao).length === quantas) break;
  }
  saida.ignicaoPorFileira1440 = { passo: PASSO, y: ignicao };
  await ctx.close();
}

/* ── 390: empilha, texto acima da foto ────────────────────────────────────── */
{
  const { ctx, p } = await abrir({ largura: 390, altura: 844 });
  await assentar(p);
  saida.fileiras390 = await p.evaluate(fileiras);
  /* O grafismo NÃO aparece no empilhado (mesma regra das duas seções da
     `/sistran-university`), e o palco não sangra para os lados como o da arte. */
  saida.acentos390 = await p.evaluate(
    () => getComputedStyle(document.querySelector('.labs-intro-acentos')).display,
  );
  saida.palco390 = await p.evaluate(() => {
    const e = getComputedStyle(document.querySelector('.labs-intro-palco'));
    return { marginInline: `${e.marginLeft} ${e.marginRight}`, largura: e.width };
  });
  saida.barraHorizontal390 = await p.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  await p.screenshot({ path: 'docs/capturas/sis294-390-intro.png' });
  await ctx.close();
}

/* ── reduce canal 1: prefers-reduced-motion ───────────────────────────────── */
const leituraReduce = () =>
  [...document.querySelectorAll('.labs-intro-fileira [data-reveal]')].map((e) => {
    const s = getComputedStyle(e);
    return {
      preset: e.getAttribute('data-reveal'),
      opacidade: s.opacity,
      transform: s.transform,
      duracao: s.transitionDuration,
    };
  });
{
  const { ctx, p } = await abrir({ reduce: true });
  await assentar(p);
  saida.reduceMidia = await p.evaluate(leituraReduce);
  /* «O movimento para; o realce fica» — com reduce, o hover não pode deslocar
     quadro nem imagem, mas borda e anel continuam trocando. As regras que
     garantem isso são as da SIS-292, que estas fotos herdam junto com as classes. */
  await p.locator('.labs-intro-palco').first().hover({ force: true });
  await p.waitForTimeout(700);
  saida.reduceNoHover = await p.evaluate(() => {
    const el = document.querySelector('.labs-intro-figura');
    const im = document.querySelector('.labs-intro-imagem');
    return {
      quadro: getComputedStyle(el).transform,
      imagem: getComputedStyle(im).transform,
      borda: getComputedStyle(el).borderColor,
    };
  });
  await ctx.close();
}

/* ── reduce canal 2: html[data-motion="reduce"] ───────────────────────────── */
{
  const { ctx, p } = await abrir({ motion: 'reduce' });
  await assentar(p);
  saida.motionAtributo = await p.evaluate(() => document.documentElement.getAttribute('data-motion'));
  saida.reduceAtributo = await p.evaluate(leituraReduce);
  await ctx.close();
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
