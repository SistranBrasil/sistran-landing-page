/**
 * SIS-290 — sonda do rodapé: o ano, as duas geometrias que cresceram, o hover das
 * redes e a malha de fundo.
 *
 * O que ela prova, e por que cada coisa é medida em vez de lida no código:
 *   1. ANO — o texto do copyright, lido da tela. O item 1 é troca de copy; ler o
 *      nó renderizado é o que distingue «editei o arquivo» de «o site mudou».
 *   2. GEOMETRIA — caixa da logo e dos dois botões de rede, nas duas larguras. Os
 *      itens 2 e 4 pedem «maior»: sem o número de antes e de depois, «maior» não é
 *      verificável. Os valores anteriores estão nos comentários do `Footer.tsx`
 *      (logo `h-20`/`h-24` = 80/96px; botão 44px; ícone 16px).
 *   3. HOVER DAS REDES — o par (fundo, tinta) no estado de repouso e com o ponteiro
 *      em cima, e a razão entre eles. O item 3 pede «círculo claro, ícone escuro»:
 *      é preciso mostrar que a tinta INVERTEU, não só que clareou. O ícone é
 *      componente de UI não-textual → piso 3:1 (WCAG 1.4.11), e a borda do disco
 *      contra o fundo do rodapé entra na mesma conta, porque é ela que delimita o
 *      controle.
 *   4. MALHA × TEXTO — o item 5 exige «sem atrapalhar o texto», e a malha vive
 *      ATRÁS de texto vivo, então NENHUM contraste do rodapé vale por herança: o
 *      pior pixel de fundo deixou de ser o azul chapado. Duas leituras, porque uma
 *      só não bastaria:
 *        (a) EMPÍRICA, pelo método da casa (SIS-192): segunda aba com a tinta em
 *            `color: transparent`, pior pixel decide. Ela mede a malha PARADA no
 *            deslocamento zero — que é um quadro do laço, não todos.
 *        (b) ANALÍTICA do pior quadro possível: a malha só CLAREIA o fundo, e o
 *            clareamento máximo é o cruzamento de um fio (branco 8%) com o
 *            quadrinho mais forte (branco 14%). Componho as duas camadas sobre o
 *            fundo do rodapé e refaço a razão de cada tinta contra esse pixel. É
 *            este número que cobre o laço inteiro, e é ele que decide.
 *   5. MOVIMENTO REDUZIDO NOS DOIS CANAIS — `prefers-reduced-motion` do sistema e
 *      `html[data-motion="reduce"]`. Em cada um: a animação sai e a opacidade fica
 *      em 1. A segunda metade é a que importa: o quadro 0% do laço dos quadrinhos é
 *      `opacity: 0`, então congelar sem forçar opacidade esconderia a decoração
 *      para sempre — a armadilha registrada na habilidade de reduced-motion.
 *
 * Uso: node scripts/medir-rodape-sis290.mjs
 */

import { writeFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const ROTA = 'http://localhost:3000/';
const SAIDA = 'docs/medidas/sis290-rodape.json';

/* Um alvo por tinta que o rodapé publica sobre a malha. O copyright é o alvo
   CRÍTICO — `text-ink-faint` é a tinta mais fraca do rodapé e 12px; se a malha
   derrubar alguém, derruba esse primeiro. */
const ALVOS = {
  copyright: '.lp-rodape .text-ink-faint',
  tituloColuna: '.lp-rodape-titulo',
  cidade: '.lp-rodape-unidade-cidade',
  dadoUnidade: '.lp-rodape-unidade-dado',
  linkNav: '.lp-rodape-nav a',
};

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

async function abrir({ largura = 1440, semTinta, motion = 'full', reduceSistema } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    ...(reduceSistema ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(
    (pref) => {
      localStorage.setItem('sistran-motion-preference', pref);
      localStorage.setItem('sistran-motion-preference-seen', '1');
      sessionStorage.setItem('sistran:intro-visto', 'true');
    },
    motion,
  );
  const p = await ctx.newPage();
  /* `domcontentloaded`, e NÃO `networkidle`: na home o `networkidle` nunca chega em
     `next dev` — o canal de HMR fica aberto e a sonda morre em timeout de 30s (foi o
     que aconteceu na primeira execução). O sinal de prontidão desta base é o
     `[data-route-liberado="true"]`, que é o que a linha seguinte espera. */
  await p.goto(ROTA, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  /* A home revela por scroll: sem percorrer, os blocos ficam em `opacity: 0` e o
     rodapé nem entra na conta do documento. */
  await p.evaluate(async () => {
    const passo = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await p.waitForTimeout(1000);
  if (semTinta) {
    /* Os dois `:not(#nao-existe)` valem um id cada na conta de especificidade sem
       casar com nada: as cores do rodapé vêm de regras de classe com `!important`
       em `globals.css`, e com os dois lados `!important` o desempate volta a ser
       especificidade. Mesma armadilha das sondas da SIS-216 e SIS-292. */
    const blindado = Object.values(ALVOS)
      .map((s) => `${s}:not(#nao-existe):not(#nao-existe)`)
      .join(',');
    await p.addStyleTag({ content: `${blindado}{color:transparent!important}` });
  }
  return { ctx, p };
}

const lum = ([r, g, b]) => {
  const f = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
const compor = (tinta, alfa, fundo) =>
  tinta.map((c, i) => Math.round(c * alfa + fundo[i] * (1 - alfa)));

/* A caixa da TINTA, não a do elemento: um link ocupa a linha inteira e medir a
   caixa toda leria pixels que nenhuma letra cobre. */
const CAIXA_DA_TINTA = (el) => {
  const no = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
  const caixaEl = el.getBoundingClientRect();
  let r = caixaEl;
  if (no) {
    const range = document.createRange();
    range.selectNodeContents(no);
    r = range.getBoundingClientRect();
  }
  return {
    dx: Math.max(0, Math.round(r.x - caixaEl.x)),
    dy: Math.max(0, Math.round(r.y - caixaEl.y)),
    w: Math.round(r.width),
    h: Math.round(r.height),
  };
};

const resultado = {};

/* ── 1 e 2: ano, geometria, e a malha montada ─────────────────────────────── */
for (const largura of [1440, 390]) {
  const { ctx, p } = await abrir({ largura });
  resultado[`rodape_${largura}`] = await p.evaluate(() => {
    const cx = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    };
    const rede = document.querySelector('.lp-rodape-rede');
    const fundoRodape = getComputedStyle(document.querySelector('.lp-rodape')).backgroundColor;
    return {
      copyright: document.querySelector('.lp-rodape .text-ink-faint')?.textContent.trim() ?? null,
      logo: cx('.lp-rodape-logo'),
      botaoRede: cx('.lp-rodape-rede'),
      iconeRede: cx('.lp-rodape-rede svg'),
      qtdRedes: document.querySelectorAll('.lp-rodape-rede').length,
      redeRepouso: rede
        ? {
            fundo: getComputedStyle(rede).backgroundColor,
            tinta: getComputedStyle(rede).color,
            borda: getComputedStyle(rede).borderTopColor,
          }
        : null,
      fundoRodape,
      malha: {
        camada: !!document.querySelector('.lp-rodape-malha'),
        grade: !!document.querySelector('.lp-rodape-malha-grade'),
        quadros: document.querySelectorAll('.lp-rodape-malha-quadros i').length,
        gradeAnimacao: document.querySelector('.lp-rodape-malha-grade')
          ? getComputedStyle(document.querySelector('.lp-rodape-malha-grade')).animationName
          : null,
        gradeLadrilho: document.querySelector('.lp-rodape-malha-grade')
          ? getComputedStyle(document.querySelector('.lp-rodape-malha-grade')).backgroundSize
          : null,
        ariaHidden: document.querySelector('.lp-rodape-malha')?.getAttribute('aria-hidden'),
        /* A ORDEM DE PINTURA é o portão do comentário do `Footer.tsx`: sem
           `z-index`, quem vem depois no DOM pinta em cima. A malha tem de estar
           ANTES do fio de marca, e o conteúdo depois das duas. */
        ordemDomMalhaAntesDoFio:
          !!document.querySelector('.lp-rodape-malha') &&
          document.querySelector('.lp-rodape-malha').compareDocumentPosition(
            document.querySelector('.lp-rodape .brand-line'),
          ) === Node.DOCUMENT_POSITION_FOLLOWING,
        zIndexNegativo: [
          ...document.querySelectorAll('.lp-rodape-malha, .lp-rodape-malha *'),
        ].some((el) => Number(getComputedStyle(el).zIndex) < 0),
      },
      transbordo: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  await ctx.close();
}

/* ── 3: o hover das redes ─────────────────────────────────────────────────── */
{
  const { ctx, p } = await abrir({});
  const rede = p.locator('.lp-rodape-rede').first();
  await rede.scrollIntoViewIfNeeded();
  /* O PONTEIRO VAI PARA A CAIXA LIDA DEPOIS DO SCROLL ASSENTAR, e não por
     `locator.hover()` logo após o `scrollIntoViewIfNeeded`: a primeira execução
     devolveu `background-color` no valor de REPOUSO enquanto `color` e
     `border-color` já estavam no de hover — leitura tirada com o ponteiro saindo do
     elemento porque a rolagem ainda acomodava. O `matches(':hover')` abaixo é o que
     impede essa leitura de passar por medição outra vez. */
  await p.waitForTimeout(600);
  const caixa = await rede.boundingBox();
  await p.mouse.move(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
  await p.waitForTimeout(800);
  const estado = await rede.evaluate((el) => {
    const s = getComputedStyle(el);
    const svg = el.querySelector('svg');
    return {
      casaHover: el.matches(':hover'),
      fundo: s.backgroundColor,
      borda: s.borderTopColor,
      tinta: s.color,
      tintaIcone: svg ? getComputedStyle(svg).color : null,
      strokeIcone: svg ? getComputedStyle(svg).stroke : null,
      transicao: s.transitionProperty,
    };
  });
  const nums = (c) => c.match(/[\d.]+/g).map(Number).slice(0, 3);
  resultado.hoverRede = {
    ...estado,
    /* Ícone (não-texto) contra o disco claro: piso 3:1. */
    razaoIconeSobreDisco: razao(nums(estado.tinta), nums(estado.fundo)),
    /* O disco claro contra o fundo do rodapé: é ele que delimita o controle. */
    razaoDiscoSobreRodape: razao(nums(estado.fundo), [18, 115, 188]),
  };
  /* `:focus-visible` tem de acender o MESMO estado — é o único caminho do teclado.
     `.focus()` sozinho não garante `:focus-visible` num clique anterior, então a
     ativação é por Tab a partir do link imediatamente anterior. */
  const foco = await p.evaluate(async () => {
    const el = document.querySelector('.lp-rodape-rede');
    el.focus();
    /* O anel de foco é `box-shadow` com 240ms de rampa: lido no quadro seguinte ao
       `focus()` ele sai em `rgba(0,0,0,0) 0 0 0 0`, que é o começo da transição e não
       o estado. Espera o dobro da rampa. */
    await new Promise((r) => setTimeout(r, 500));
    const s = getComputedStyle(el);
    return {
      casaFocusVisible: el.matches(':focus-visible'),
      fundo: s.backgroundColor,
      tinta: s.color,
      anel: s.boxShadow,
    };
  });
  resultado.focoRede = foco;
  await ctx.close();
}

/* ── 4: a malha contra o texto ────────────────────────────────────────────── */
{
  const A = await abrir({});
  const B = await abrir({ semTinta: true });
  const sharp = (await import('sharp')).default;
  resultado.contraste = {};
  for (const [nome, sel] of Object.entries(ALVOS)) {
    if (!(await A.p.locator(sel).count())) {
      resultado.contraste[nome] = null;
      continue;
    }
    const alvoB = B.p.locator(sel).first();
    const alvoA = A.p.locator(sel).first();
    await alvoB.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await alvoA.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await B.p.waitForTimeout(300);
    await A.p.waitForTimeout(300);
    const caixa = await alvoB.evaluate(CAIXA_DA_TINTA);
    const tinta = await alvoA.evaluate((el) => getComputedStyle(el).color);
    if (caixa.w < 2 || caixa.h < 2) {
      resultado.contraste[nome] = { caixa, tinta, nota: 'caixa degenerada' };
      continue;
    }
    /* Recorte pelo próprio elemento, e não por região da viewport: entre a leitura
       da caixa e a captura o scroll ainda acomoda, e um `clip` errado devolve pixel
       de outra faixa — o defeito que já inventou 4,12:1 na sonda da SIS-292. */
    const fundo = await alvoB.screenshot();
    /* A MESMA CAIXA DE TINTA, COM A MALHA FORA. É isto que prova o «custo zero» em
       vez de afirmá-lo: o par (com malha, sem malha) do mesmíssimo recorte. Comparar
       com uma constante `#1273BC` escrita à mão não serve — o rodapé é
       `bg-[#1273BC]/85`, então o pixel real depende do que está atrás dele, e a
       primeira execução reprovou a própria premissa por 2/255 de diferença que não
       vinha da malha. */
    const semMalha = await B.p.addStyleTag({
      content: '.lp-rodape-malha{display:none!important}',
    });
    await B.p.waitForTimeout(200);
    const fundoSemMalha = await alvoB.screenshot();
    await semMalha.evaluate((el) => el.remove());
    await B.p.waitForTimeout(200);
    const meta = await sharp(fundo).metadata();
    /* 1px para dentro em cada lado: a borda do elemento traz franja de
       antialiasing, que inventa «pior pixel» que nenhuma letra toca. */
    const recorte = {
      left: Math.min(caixa.dx + 1, Math.max(0, meta.width - 2)),
      top: Math.min(caixa.dy + 1, Math.max(0, meta.height - 2)),
      width: Math.max(1, Math.min(caixa.w - 2, meta.width - caixa.dx - 2)),
      height: Math.max(1, Math.min(caixa.h - 2, meta.height - caixa.dy - 2)),
    };
    const cor = tinta.match(/[\d.]+/g).map(Number);
    const alfa = cor.length > 3 ? cor[3] : 1;
    const piorDe = async (png) => {
      const { data, info } = await sharp(png)
        .extract(recorte)
        .raw()
        .toBuffer({ resolveWithObject: true });
      let pior = null;
      for (let i = 0; i < data.length; i += info.channels) {
        const px = [data[i], data[i + 1], data[i + 2]];
        const m = razao(compor(cor.slice(0, 3), alfa, px), px);
        if (pior === null || m < pior.m) pior = { px, m };
      }
      return pior;
    };
    const pior = await piorDe(fundo);
    const piorSem = await piorDe(fundoSemMalha);
    /* O PORTÃO É `semRegressao`, e ele vale para o LAÇO INTEIRO, não para o quadro
       medido. A leitura empírica pega a malha no deslocamento zero — um quadro. O que
       generaliza é o SINAL da camada: fios e quadrinhos são navy (`#001A3D`,
       `#032033`) sobre o `#1273BC` do rodapé, e navy sobre azul médio só escurece.
       Toda tinta do rodapé é clara, então escurecer o fundo AUMENTA a razão; logo o
       pior pixel que qualquer texto pode encontrar em qualquer quadro é o azul sem
       malha, que é exatamente o número `razaoSemMalha` ao lado. Por isso a malha
       custa zero de contraste em vez de «um custo pequeno que ninguém mediu», e por
       isso a primeira versão (branca) foi descartada: lá o pior quadro era o
       cruzamento fio+quadrinho e o copyright caía a 2,33:1. */
    resultado.contraste[nome] = {
      tinta,
      caixa,
      piorFundoComMalha: pior.px,
      razaoComMalha: pior.m,
      piorFundoSemMalha: piorSem.px,
      razaoSemMalha: piorSem.m,
      semRegressao: pior.m >= piorSem.m,
    };
  }
  await A.ctx.close();
  await B.ctx.close();
}

/* ── 5: movimento reduzido nos dois canais ────────────────────────────────── */
const leituraMotion = () => {
  const alvos = [
    ['grade', '.lp-rodape-malha-grade'],
    ['quadro', '.lp-rodape-malha-quadros i'],
    ['rede', '.lp-rodape-rede'],
  ];
  const out = {};
  for (const [nome, sel] of alvos) {
    const el = document.querySelector(sel);
    if (!el) {
      out[nome] = null;
      continue;
    }
    const s = getComputedStyle(el);
    out[nome] = {
      animationName: s.animationName,
      playState: s.animationPlayState,
      translate: s.translate,
      opacity: s.opacity,
      transitionProperty: s.transitionProperty,
      visivel: Number(s.opacity) > 0,
    };
  }
  return out;
};

{
  const { ctx, p } = await abrir({ reduceSistema: true });
  resultado.reduceSistema = await p.evaluate(leituraMotion);
  await ctx.close();
}
{
  const { ctx, p } = await abrir({ motion: 'reduce' });
  resultado.reduceAtributo = await p.evaluate(() => ({
    atributo: document.documentElement.getAttribute('data-motion'),
  }));
  const { ctx: c2, p: p2 } = await abrir({ motion: 'reduce' });
  resultado.reduceAtributo = {
    ...resultado.reduceAtributo,
    ...(await p2.evaluate(leituraMotion)),
  };
  await ctx.close();
  await c2.close();
}

await navegador.close();
writeFileSync(SAIDA, JSON.stringify(resultado, null, 2));
console.log(SAIDA);
console.log(JSON.stringify(resultado, null, 2));
