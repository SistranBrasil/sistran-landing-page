/* SIS-291 (2ª volta) — mede a seção «Já desenvolvemos…» de `/sistran-labs` depois
   da troca de tipografia/`lucide` pelos arquivos de
   `public/images/sistran-labs/icones/`.

   O que a issue pede provar, item por item:
   • quais arquivos ENTRARAM de fato (`currentSrc`, não o `src` escrito) — itens 1,
     2 e 3, e o único jeito de mostrar que o WebP derivado é o que o navegador
     baixou;
   • que os quatro ícones saem do MESMO tamanho óptico dentro das plaquinhas
     (a razão de existir o recorte por caixa de tinta no script de derivação);
   • a caixa do letreiro;
   • CONTRASTE do «de seguros» BRANCO sobre a cápsula clara — o item 4 («contraste
     OK no fundo claro») e o número que o comentário de `.labs-guru-letreiro`
     promete. É medido no RASTER, não na folha de estilo: a separação vem de um
     `drop-shadow`, que não é cor declarada em lugar nenhum e só existe em pixel.
   • hover (a dinâmica que a issue manda preservar) e os dois canais de reduce.

   A leitura do contraste usa o pior pixel, e não a média: é a franja de
   antialiasing da letra que decide se ela se lê, e média esconde franja. */
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
  await p.evaluate(() => document.querySelector('#labs-solucoes').closest('section').scrollIntoView());
  await p.waitForTimeout(1600);
  return { ctx, p };
}

function imagens() {
  const ler = (el) => {
    const r = el.getBoundingClientRect();
    return {
      arquivo: new URL(el.currentSrc || el.src).pathname,
      alt: el.getAttribute('alt'),
      naturais: `${el.naturalWidth}x${el.naturalHeight}`,
      renderizado: `${Math.round(r.width * 10) / 10}x${Math.round(r.height * 10) / 10}`,
      objectFit: getComputedStyle(el).objectFit,
      filtro: getComputedStyle(el).filter,
    };
  };
  return {
    letreiro: ler(document.querySelector('.labs-guru-letreiro')),
    arte: ler(document.querySelector('.labs-guru-arte')),
    icones: [...document.querySelectorAll('.labs-solucao-icone')].map(ler),
    selo: ler(document.querySelector('.labs-desenvolvemos-selo-icone')),
    /* O botão da barra segue `lucide`, de propósito: o motivo está na `page.tsx`.
       Medido aqui para que a escolha fique provada e não afirmada. */
    botaoDaBarra: (() => {
      const svg = document.querySelector('.labs-desenvolvemos-barra-botao svg');
      if (!svg) return null;
      return { tag: 'svg (lucide)', cor: getComputedStyle(svg).color };
    })(),
    tituloAcessivel: (() => {
      const h = document.querySelector('.labs-guru-nome');
      const e = getComputedStyle(h);
      return {
        texto: h.textContent,
        classe: h.className,
        largura: Math.round(h.getBoundingClientRect().width),
        posicao: e.position,
        clip: e.clipPath,
      };
    })(),
  };
}

/* Nos dois canais de reduce, a flutuação tem de estar MORTA e no lugar: `animation:
   none` sozinho congelaria a peça no quadro corrente (podia ficar 6px acima para
   sempre), então o `translate: 0` é medido junto — é ele que prova o repouso. */
function leituraDaFlutuacaoParada() {
  const ler = (sel) => {
    const s = getComputedStyle(document.querySelector(sel));
    return { animacao: s.animationName, translate: s.translate };
  };
  return { grade: ler('.labs-desenvolvemos-grade'), barra: ler('.labs-desenvolvemos-barra') };
}

const saida = { rota: '/sistran-labs', secao: '#labs-solucoes' };

/* ── 1440: arquivos, geometria e contraste ─────────────────────────────────── */
{
  const { ctx, p } = await abrir();
  saida.imagens1440 = await p.evaluate(imagens);

  /* Caixa do letreiro em coordenadas de página, com margem, para o recorte. */
  const caixa = await p.evaluate(() => {
    const r = document.querySelector('.labs-guru-letreiro').getBoundingClientRect();
    return { x: Math.floor(r.x), y: Math.floor(r.y), w: Math.ceil(r.width), h: Math.ceil(r.height) };
  });
  const M = 12; // margem para pegar a cápsula em volta
  const tira = await p.screenshot({
    clip: { x: caixa.x - M, y: caixa.y - M, width: caixa.w + M * 2, height: caixa.h + M * 2 },
  });

  const { data, info } = await sharp(tira).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const lum = (r, g, b) => {
    const c = [r, g, b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const razao = (a, b) => Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100;
  const px = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return lum(data[i], data[i + 1], data[i + 2]);
  };

  /* Fundo: o anel de margem, que é cápsula pura. Mediana, porque a cápsula é um
     degradê e média puxaria para a parada errada. */
  const anel = [];
  for (let x = 0; x < info.width; x += 1) {
    for (let y = 0; y < M; y += 1) anel.push(px(x, y), px(x, info.height - 1 - y));
  }
  anel.sort((a, b) => a - b);
  const fundo = anel[Math.floor(anel.length / 2)];

  /* «de seguros» é a segunda linha do letreiro: faixa de baixo da arte. O corte
     é por FRAÇÃO da altura da imagem, não por pixel medido à mão. */
  const faixa = (de, ate) => {
    let claro = -1;
    let escuro = 2;
    for (let y = Math.round(M + caixa.h * de); y < Math.round(M + caixa.h * ate); y += 1) {
      for (let x = M; x < info.width - M; x += 1) {
        const l = px(x, y);
        if (l > claro) claro = l;
        if (l < escuro) escuro = l;
      }
    }
    return { claro, escuro };
  };
  const baixo = faixa(0.6, 1);
  const alto = faixa(0, 0.55);

  saida.contrasteDoLetreiro1440 = {
    comoFoiMedido:
      'recorte raster da caixa do letreiro + 12px de margem; fundo = mediana do anel de margem; pior pixel por faixa',
    fundoDaCapsula: Math.round(fundo * 1000) / 1000,
    faixaDeSeguros: {
      pixelMaisClaro: Math.round(baixo.claro * 1000) / 1000,
      pixelMaisEscuro: Math.round(baixo.escuro * 1000) / 1000,
      /* É ESTA a razão que interessa: a letra é branca (quase igual ao fundo), e
         quem a separa é o contorno escuro do `drop-shadow`. */
      brancoContraContorno: razao(baixo.claro, baixo.escuro),
      brancoContraCapsula: razao(baixo.claro, fundo),
      contornoContraCapsula: razao(baixo.escuro, fundo),
    },
    faixaGuru: {
      pixelMaisEscuro: Math.round(alto.escuro * 1000) / 1000,
      azulContraCapsula: razao(alto.escuro, fundo),
    },
  };

  /* ── A FLUTUAÇÃO CONTÍNUA (pedido do chat) ──────────────────────────────
     Medida por AMOSTRAGEM, e não pela folha: o que interessa é que o `translate`
     computado MUDA de valor com o tempo (a peça está mesmo se movendo) e que as
     duas cadências estão em fases diferentes. Ler só `animation-name` provaria
     que a regra existe, não que ela anda. */
  const amostrar = async (ms, n) => {
    const linhas = [];
    for (let i = 0; i < n; i += 1) {
      linhas.push(
        await p.evaluate(() => ({
          grade: getComputedStyle(document.querySelector('.labs-desenvolvemos-grade')).translate,
          barra: getComputedStyle(document.querySelector('.labs-desenvolvemos-barra')).translate,
        })),
      );
      await p.waitForTimeout(ms);
    }
    return linhas;
  };
  saida.flutuacao1440 = {
    regra: await p.evaluate(() => {
      const g = getComputedStyle(document.querySelector('.labs-desenvolvemos-grade'));
      const b = getComputedStyle(document.querySelector('.labs-desenvolvemos-barra'));
      return {
        grade: `${g.animationName} ${g.animationDuration} ${g.animationDelay} ${g.animationIterationCount}`,
        barra: `${b.animationName} ${b.animationDuration} ${b.animationDelay} ${b.animationIterationCount}`,
        /* O fio e os cartões NÃO têm animação própria: eles viajam dentro da
           grade, que é o que mantém a linha colada nos nós. */
        fio: getComputedStyle(document.querySelector('.labs-desenvolvemos-fio')).animationName,
        cartao: getComputedStyle(document.querySelector('.labs-solucao-cartao')).animationName,
      };
    }),
    amostras: await amostrar(500, 8),
  };

  /* Pausa sob o ponteiro: duas leituras com 900ms de intervalo têm de ser IGUAIS. */
  await p.hover('.labs-solucao-cartao', { force: true });
  await p.waitForTimeout(300);
  const pausa1 = await p.evaluate(
    () => getComputedStyle(document.querySelector('.labs-desenvolvemos-grade')).translate,
  );
  await p.waitForTimeout(900);
  const pausa2 = await p.evaluate(
    () => getComputedStyle(document.querySelector('.labs-desenvolvemos-grade')).translate,
  );
  saida.flutuacaoPausaNoHover = { primeira: pausa1, segunda: pausa2, parou: pausa1 === pausa2 };
  await p.mouse.move(0, 0);
  await p.waitForTimeout(300);

  saida.barraHorizontal1440 = await p.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  await p.screenshot({ path: 'docs/capturas/sis291-2volta-1440-secao.png' });
  await p.screenshot({
    path: 'docs/capturas/sis291-2volta-1440-letreiro.png',
    clip: { x: caixa.x - M, y: caixa.y - M, width: caixa.w + M * 2, height: caixa.h + M * 2 },
  });

  /* Hover: a dinâmica que a issue manda preservar. */
  await p.hover('.labs-guru', { force: true });
  await p.waitForTimeout(700);
  saida.hoverGuru = await p.evaluate(() => {
    const c = document.querySelector('.labs-guru');
    const a = document.querySelector('.labs-guru-arte');
    return {
      cartao: getComputedStyle(c).transform,
      arte: getComputedStyle(a).transform,
      sombra: getComputedStyle(c).boxShadow,
    };
  });
  await p.hover('.labs-solucao-cartao', { force: true });
  await p.waitForTimeout(700);
  saida.hoverCartao = await p.evaluate(() => {
    const li = document.querySelector('.labs-solucao-cartao');
    return {
      cartao: getComputedStyle(li).transform,
      plaqueta: getComputedStyle(li.querySelector('.labs-solucao-plaqueta')).backgroundColor,
      icone: getComputedStyle(li.querySelector('.labs-solucao-icone')).transform,
    };
  });
  await p.screenshot({ path: 'docs/capturas/sis291-2volta-1440-hover.png' });
  await ctx.close();
}

/* ── 390: a pilha ─────────────────────────────────────────────────────────── */
{
  const { ctx, p } = await abrir({ largura: 390, altura: 844 });
  saida.imagens390 = await p.evaluate(imagens);
  saida.barraHorizontal390 = await p.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  await p.screenshot({ path: 'docs/capturas/sis291-2volta-390-secao.png' });
  await ctx.close();
}

/* ── reduce canal 1: prefers-reduced-motion ───────────────────────────────── */
{
  const { ctx, p } = await abrir({ reduce: true });
  saida.reduceMidia = await p.evaluate(() =>
    [...document.querySelectorAll('[data-reveal]')]
      .filter((e) => e.closest('#labs-solucoes, .labs-desenvolvemos-grade, .labs-desenvolvemos-barra'))
      .map((e) => {
        const s = getComputedStyle(e);
        return {
          preset: e.getAttribute('data-reveal'),
          opacidade: s.opacity,
          transform: s.transform,
          duracao: s.transitionDuration,
        };
      }),
  );
  saida.flutuacaoReduceMidia = await p.evaluate(leituraDaFlutuacaoParada);
  await ctx.close();
}

/* ── reduce canal 2: html[data-motion="reduce"] ───────────────────────────── */
{
  const { ctx, p } = await abrir({ motion: 'reduce' });
  saida.motionAtributo = await p.evaluate(() => document.documentElement.getAttribute('data-motion'));
  saida.reduceAtributo = await p.evaluate(() =>
    [...document.querySelectorAll('[data-reveal]')]
      .filter((e) => e.closest('#labs-solucoes, .labs-desenvolvemos-grade, .labs-desenvolvemos-barra'))
      .map((e) => {
        const s = getComputedStyle(e);
        return {
          preset: e.getAttribute('data-reveal'),
          opacidade: s.opacity,
          transform: s.transform,
          duracao: s.transitionDuration,
        };
      }),
  );
  saida.flutuacaoReduceAtributo = await p.evaluate(leituraDaFlutuacaoParada);
  await ctx.close();
}

await navegador.close();
console.log(JSON.stringify(saida, null, 2));
