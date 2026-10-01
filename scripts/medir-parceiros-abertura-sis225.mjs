/* SIS-225 — os números da abertura de `/parceiros-e-implementacoes`.

   O que esta sonda tem de provar, item por item dos critérios:

   1. CAPA: o `h1` está em peso 700, e não há carimbo nem parágrafo dentro da
      abertura. «Não há» é medido por contagem de nós na caixa do hero, não por
      leitura de código.
   2. AS DUAS EMENDAS do campo claro. A de cima (capa navy → intro) e a de baixo
      (cards → Implementações navy) são fronteiras legítimas. A que NÃO pode
      existir é a INTERNA, entre a intro e `#parceiros`: com o fundo içado para o
      invólucro ela deve ser invisível. Medida como Δ de luminância por linha na
      coluna x=8, varrendo 24px para cada lado da borda — e o pior degrau interno
      é comparado com o degrau típico do próprio degradê, que é o piso do que um
      olho consegue ver aqui.
   3. CONTRASTE DO CARIMBO na tinta nova, em pixel e sobre o papel real: pior
      pixel de tinta contra o pixel de papel mais claro na mesma caixa. Previsão
      de mesa: 5,69:1. Se o pixel discordar, vale o pixel.
   4. GEOMETRIA DA INTRO em 1440 / 768 / 390: duas colunas onde a SIS-279 manda
      (>= 64rem) e uma coluna abaixo disso, sem transbordo horizontal.
   5. A BATIDA POR VIEWPORT: com a seção fora de tela o carimbo NÃO pode estar
      assentado. Provado por Δ de `transform` — estado antes de rolar, estado
      depois. Portão de efeito é valor, não existência de animação.
   6. MOVIMENTO REDUZIDO nos DOIS canais (media query do sistema e
      `html[data-motion='reduce']`): o carimbo tem de estar VISÍVEL e assentado
      sem nunca ter batido, e o `fade-up` da intro não pode ficar preso em
      `opacity: 0`.
   7. CONTRASTE DO TEXTO da intro, os dois números (declarado e pior pixel).

     node scripts/medir-parceiros-abertura-sis225.mjs
*/
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROTA = 'http://localhost:3000/parceiros-e-implementacoes';

const relLum = (c) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
};
const razao = (a, b) => {
  const [x, y] = [relLum(a), relLum(b)].sort((m, n) => n - m);
  return +((x + 0.05) / (y + 0.05)).toFixed(2);
};

const nav = await chromium.launch({ executablePath: EXE });
const sharp = (await import('sharp')).default;
const out = { rota: ROTA, quando: new Date().toISOString() };

async function abrir({ largura, reduzido = false, viaAtributo = false }) {
  const ctx = await nav.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: reduzido && !viaAtributo ? 'reduce' : 'no-preference',
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const pag = await ctx.newPage();
  await pag.goto(ROTA, { waitUntil: 'domcontentloaded' });
  await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  if (viaAtributo) {
    await pag.evaluate(() => {
      document.documentElement.dataset.motion = 'reduce';
    });
    await pag.waitForTimeout(400);
  }
  await pag.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],[href="#conteudo"]{display:none!important}',
  });
  /* Sem plano B: se o alvo desta issue não está montado, o relatório tem de dizer
     isso em vez de medir o que sobrou na página. */
  const montado = await pag.evaluate(() => ({
    intro: !!document.querySelector('#parcerias-intro .solucoes-intro'),
    carimbo: !!document.querySelector('#parceiros .carimbo-batida'),
    parceiros: !!document.querySelector('#parceiros'),
  }));
  if (!montado.intro || !montado.carimbo || !montado.parceiros) {
    throw new Error('alvo da SIS-225 ausente: ' + JSON.stringify(montado));
  }
  return { ctx, pag };
}

/* Amostrador de pixel sobre uma captura de PÁGINA INTEIRA — as emendas estão em
   alturas de documento diferentes e não caberiam numa janela só. */
async function folha(pag) {
  const png = await pag.screenshot({ fullPage: true });
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  return {
    info,
    px(x, y) {
      const k = (y * info.width + x) * info.channels;
      return [data[k], data[k + 1], data[k + 2]];
    },
  };
}

/* ── 1440: capa, emendas, carimbo, texto ───────────────────────────────────── */
{
  const { ctx, pag } = await abrir({ largura: 1440 });

  /* 1. A capa. */
  out.capa1440 = await pag.evaluate(() => {
    const hero = document.querySelector('#topo');
    const h1 = hero.querySelector('h1');
    const cs = getComputedStyle(h1);
    return {
      textoDoH1: h1.textContent.trim(),
      peso: cs.fontWeight,
      tamanho: cs.fontSize,
      /* Os dois nós que a issue manda tirar da abertura. */
      carimbosNaCapa: hero.querySelectorAll('.carimbo-batida').length,
      paragrafosNaCapa: hero.querySelectorAll('p').length,
      destaqueEmNegrito: getComputedStyle(h1.querySelector('span') ?? h1).fontWeight,
    };
  });

  /* 4. Geometria da intro (a 1440 esperam-se duas colunas). */
  const geometria = (pag) =>
    pag.evaluate(() => {
      const grade = document.querySelector('#parcerias-intro .solucoes-intro');
      const texto = grade.querySelector('.solucoes-intro-texto');
      const arte = grade.querySelector('.solucoes-intro-arte');
      const r = (el) => {
        const b = el.getBoundingClientRect();
        return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
      };
      const cs = getComputedStyle(grade);
      return {
        colunas: cs.gridTemplateColumns,
        gap: cs.gap,
        grade: r(grade),
        texto: r(texto),
        arte: r(arte),
        /* Duas colunas = arte começa à direita de onde o texto termina. */
        ladoALado: r(arte).x >= r(texto).x + r(texto).w,
        transbordoHorizontal: Math.round(
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
      };
    });
  out.intro1440 = await geometria(pag);

  /* 2. As três emendas, na coluna x=8 (fora de qualquer conteúdo do
        `container-lp`, que a 1440 começa bem à direita disso). */
  const bordas = await pag.evaluate(() => {
    const doc = (el) => {
      const b = el.getBoundingClientRect();
      return { topo: Math.round(b.top + window.scrollY), pe: Math.round(b.bottom + window.scrollY) };
    };
    /* NÃO existe invólucro: a intro e `#parceiros` são irmãs diretas de `<main>`
       e cada uma carrega as suas próprias classes de fundo — foi a correção desta
       issue (um invólucro fazia `#parceiros` cair na alternância de painéis e
       virar navy). O «campo claro», então, é o intervalo das duas juntas, e não
       um elemento: de `#parcerias-intro` ao pé de `#parceiros`. */
    const intro = doc(document.querySelector('#parcerias-intro'));
    const parceiros = doc(document.querySelector('#parceiros'));
    return {
      campoClaro: { topo: intro.topo, pe: parceiros.pe, invólucro: null },
      intro,
      parceiros,
      implementacoes: doc(document.querySelector('#implementacoes')),
    };
  });
  const f = await folha(pag);
  const varrer = (yCentro) => {
    const linhas = [];
    for (let y = yCentro - 24; y <= yCentro + 24; y++) {
      if (y < 0 || y >= f.info.height) continue;
      linhas.push({ y, cor: f.px(8, y) });
    }
    let pior = null;
    for (let i = 1; i < linhas.length; i++) {
      const d = Math.abs(relLum(linhas[i].cor) - relLum(linhas[i - 1].cor));
      if (!pior || d > pior.delta) {
        pior = { delta: +d.toFixed(5), y: linhas[i].y, de: linhas[i - 1].cor.join(','), para: linhas[i].cor.join(',') };
      }
    }
    return { yCentro, piorDegrau: pior, razaoDoPiorDegrau: razao(pior.de.split(',').map(Number), pior.para.split(',').map(Number)) };
  };
  /* O piso de comparação: o degrau típico do PRÓPRIO degradê, medido longe de
     qualquer borda (100px para dentro do campo claro). Se o degrau da emenda
     interna ficar na ordem deste, não há degrau — há o degradê. */
  const refDelta = (() => {
    const y0 = bordas.intro.topo + 100;
    let soma = 0;
    let n = 0;
    for (let y = y0; y < y0 + 40; y++) {
      soma += Math.abs(relLum(f.px(8, y + 1)) - relLum(f.px(8, y)));
      n += 1;
    }
    return +(soma / n).toFixed(5);
  })();
  out.emendas1440 = {
    bordasNoDocumento: bordas,
    deltaTipicoDoDegradeInterno: refDelta,
    capaParaIntro: varrer(bordas.intro.topo),
    /* A INTERNA — a que esta issue cria e tem de ser invisível. */
    introParaParceiros: varrer(bordas.parceiros.topo),
    campoParaImplementacoes: varrer(bordas.implementacoes.topo),
    /* O PAINEL de Implementações, lido 160px DENTRO dele — longe da emenda, onde
       o brilho da SIS-93 já não clareia. É o número que denuncia a regressão de
       paridade: com um invólucro em volta da intro e de `#parceiros`, esta seção
       deixava de ser `nth-of-type` par, perdia `--fundo-marca` e caía para o azul
       médio do `body` (`#1273bc`, lido como 75,149,204) sob texto branco. */
    painelDeImplementacoes: (() => {
      const y = bordas.implementacoes.topo + 160;
      const p = f.px(8, y);
      /* O crivo é o VERMELHO, e vem dos dois valores que este ponto já leu nesta
         issue: `--fundo-marca` vai de #003F73 a #005C9E, r=0 nas duas pontas, e
         o azul do `body` que aparecia na regressão lia r=75. O azul não separa —
         158 do navy claro e 204 do body estão perto demais. */
      return { y, cor: p.join(','), ehNavy: p[0] < 40 };
    })(),
  };

  /* 3. O carimbo: contraste em pixel sobre o papel real. */
  /* A rolagem é para o CARIMBO, não para `#parceiros`: a seção inteira mede mais
     que a janela (os cartões vêm abaixo), e centrá-la deixa o carimbo acima de
     y=0 — a varredura de pixel não acharia um único pixel de tinta. */
  await pag.$eval('#parceiros .carimbo-batida', (el) =>
    el.scrollIntoView({ block: 'center', behavior: 'instant' }),
  );
  await pag.waitForTimeout(1500);
  {
    const caixa = await pag.evaluate(() => {
      const el = document.querySelector('#parceiros .carimbo-batida');
      const b = el.getBoundingClientRect();
      if (b.top < 0 || b.bottom > window.innerHeight) {
        throw new Error('o carimbo não está inteiro na janela — medição de contraste inválida');
      }
      const img = el.querySelector('img');
      return {
        x: Math.round(b.x),
        y: Math.round(b.y),
        w: Math.round(b.width),
        h: Math.round(b.height),
        arquivo: img?.getAttribute('src'),
        alt: img?.getAttribute('alt'),
        carregamento: img?.getAttribute('loading') ?? 'eager/priority',
      };
    });
    const png = await pag.screenshot();
    const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    const px = (x, y) => {
      const k = (y * info.width + x) * info.channels;
      return [data[k], data[k + 1], data[k + 2]];
    };
    let tinta = null;
    let papel = null;
    for (let dy = 0; dy < caixa.h; dy++) {
      for (let dx = 0; dx < caixa.w; dx++) {
        const x = caixa.x + dx;
        const y = caixa.y + dy;
        if (x < 0 || y < 0 || x >= info.width || y >= info.height) continue;
        const c = px(x, y);
        const L = relLum(c);
        if (!tinta || L < relLum(tinta)) tinta = c;
        if (!papel || L > relLum(papel)) papel = c;
      }
    }
    out.carimbo1440 = {
      ...caixa,
      piorTinta: tinta.join(','),
      papelMaisClaro: papel.join(','),
      razaoPiorPixel: razao(tinta, papel),
      pisoGraficoWCAG: 3,
      pisoDeTexto: 4.5,
    };
    /* 5. O nome acessível de `#parceiros` depois de perder a tag e o `h2`. */
    out.nomeAcessivel = await pag.evaluate(async () => {
      const sec = document.querySelector('#parceiros');
      return {
        ariaLabelledby: sec.getAttribute('aria-labelledby'),
        alvoExiste: !!document.getElementById(sec.getAttribute('aria-labelledby') || ''),
        textoDoAlvo: (document.getElementById(sec.getAttribute('aria-labelledby') || '')?.textContent || '').trim(),
        altDoCarimbo: sec.querySelector('.carimbo-batida img')?.getAttribute('alt'),
        tagsTextuaisRestantes: sec.querySelectorAll('.tag-section').length,
        h2Restantes: sec.querySelectorAll('h2').length,
      };
    });
    /* O nome acessível é lido da ÁRVORE, não do atributo: é o cálculo do
       navegador que importa aqui, porque o `aria-labelledby` aponta para uma
       `<div>` sem texto próprio e o nome tem de vir do `alt` da imagem dentro
       dela. `page.accessibility` não existe mais nesta versão do Playwright; o
       equivalente é `ariaSnapshot()`, que imprime `role "nome"`. */
    const arvore = await pag.locator('#parceiros').ariaSnapshot();
    out.nomeAcessivel.primeiraLinhaDaArvore = arvore.split('\n')[0].trim();
    out.nomeAcessivel.regiaoNomeada = /^-?\s*region\s+"Parceiros"/.test(arvore.split('\n')[0].trim());
  }

  /* 7. Contraste do texto da intro. */
  await pag.$eval('#parcerias-intro', (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await pag.waitForTimeout(900);
  {
    const leituras = [];
    for (const [sel, nome] of [
      ['#parcerias-intro .solucoes-intro-frase', 'frase de abertura'],
      ['#parcerias-intro .solucoes-intro-texto p:last-child', 'parágrafo de apoio'],
    ]) {
      /* Cada parágrafo é rolado ao centro POR SI: `#parcerias-intro` é mais alto
         que a janela (a arte tem 941px de fonte), então centrar a seção joga o
         texto acima de y=0 e a varredura de pixel não pegaria nada. */
      const info0 = await pag.evaluate((s) => {
        const el = document.querySelector(s);
        if (!el) return null;
        el.scrollIntoView({ block: 'center', behavior: 'instant' });
        const b = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          x: Math.round(b.x),
          y: Math.round(b.y),
          w: Math.round(b.width),
          h: Math.round(b.height),
          cor: cs.color,
          tamanho: cs.fontSize,
          peso: cs.fontWeight,
          texto: el.textContent.trim().slice(0, 48),
        };
      }, sel);
      if (!info0) {
        leituras.push({ seletor: sel, nome, ausente: true });
        continue;
      }
      /* A rolagem acima moveu a página: a caixa da medição é relida DEPOIS de ela
         assentar, senão os pixels amostrados são de outro lugar da tela. */
      await pag.waitForTimeout(600);
      Object.assign(
        info0,
        await pag.evaluate((s) => {
          const b = document.querySelector(s).getBoundingClientRect();
          return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
        }, sel),
      );
      if (info0.y < 0 || info0.y + info0.h > 900 || info0.w < 1) {
        throw new Error(`caixa de "${nome}" fora da janela (${JSON.stringify(info0)}) — medição inválida`);
      }
      /* A captura é POR PARÁGRAFO, depois da rolagem dele: uma folha tirada antes
         do laço mostraria outra parte da página. */
      const png = await pag.screenshot();
      const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
      const px = (x, y) => {
        const k = (y * info.width + x) * info.channels;
        return [data[k], data[k + 1], data[k + 2]];
      };
      let tinta = null;
      let fundo = null;
      for (let dy = 0; dy < info0.h; dy++) {
        for (let dx = 0; dx < info0.w; dx++) {
          const x = info0.x + dx;
          const y = info0.y + dy;
          if (x < 0 || y < 0 || x >= info.width || y >= info.height) continue;
          const c = px(x, y);
          const L = relLum(c);
          if (!tinta || L < relLum(tinta)) tinta = c;
          if (!fundo || L > relLum(fundo)) fundo = c;
        }
      }
      const declarada = info0.cor.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
      leituras.push({
        seletor: sel,
        nome,
        texto: info0.texto,
        tamanho: info0.tamanho,
        peso: info0.peso,
        corDeclarada: info0.cor,
        fundoLido: fundo.join(','),
        razaoDeclarada: razao(declarada, fundo),
        piorTinta: tinta.join(','),
        razaoPiorPixel: razao(tinta, fundo),
      });
    }
    out.textoDaIntro1440 = leituras;
  }

  /* CAPTURAS de 1440 pedidas pela issue: capa, intro, topo de `#parceiros`. */
  mkdirSync('docs/capturas', { recursive: true });
  await pag.evaluate(() => window.scrollTo(0, 0));
  await pag.waitForTimeout(700);
  await pag.screenshot({ path: 'docs/capturas/sis225-1440-capa.png' });
  await pag.$eval('#parcerias-intro', (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await pag.waitForTimeout(900);
  await pag.screenshot({ path: 'docs/capturas/sis225-1440-intro.png' });
  await pag.evaluate((y) => window.scrollTo(0, y), bordas.parceiros.topo - 40);
  await pag.waitForTimeout(1200);
  await pag.screenshot({ path: 'docs/capturas/sis225-1440-parceiros-topo.png' });
  await ctx.close();
}

/* ── 5. A batida do carimbo é por VIEWPORT, e isso é um Δ ───────────────────── */
{
  const { ctx, pag } = await abrir({ largura: 1440 });
  const ler = () =>
    pag.evaluate(() => {
      const el = document.querySelector('#parceiros .carimbo-batida');
      const cs = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      return {
        transform: cs.transform,
        opacity: +cs.opacity,
        dentroDaJanela: b.top < window.innerHeight && b.bottom > 0,
      };
    });
  const antes = await ler();
  /* A SEÇÃO tem ~16.000px: rolar `#parceiros` ao centro deixa o carimbo ACIMA de
     y=0, o observador nunca dispara e as duas leituras saem iguais («none»), que
     foi o resultado inconclusivo da primeira passada. Rola-se a PEÇA. E a batida
     dura 0,42s (`DURACAO` em `CarimboBatida`): a leitura do meio é a única que
     pode ver o overshoot: depois do assentamento o transform volta a ser
     indistinguível do repouso. */
  await pag.$eval('#parceiros .carimbo-batida', (el) =>
    el.scrollIntoView({ block: 'center', behavior: 'instant' }),
  );
  await pag.waitForTimeout(120);
  const noMeio = await ler();
  await pag.waitForTimeout(1500);
  const depois = await ler();
  /* `scale` sai da matriz: `matrix(a, b, c, d, e, f)` → escala ~= hypot(a, b). */
  const escala = (t) => {
    const n = t?.match(/-?[\d.]+/g)?.map(Number);
    return n && n.length >= 4 ? +Math.hypot(n[0], n[1]).toFixed(3) : null;
  };
  out.batidaPorViewport = {
    antesDeRolar: { ...antes, escala: escala(antes.transform) },
    aos120ms: { ...noMeio, escala: escala(noMeio.transform) },
    depoisDeRolar: { ...depois, escala: escala(depois.transform) },
    /* A peça entra a 1,85 e assenta em 1 (ver `CarimboBatida`): a prova de que a
       batida é POR VIEWPORT é o quadro do meio estar fora do repouso — sem GSAP
       escrito no estilo antes de rolar, e de volta ao repouso depois. */
    escalaDoMeioAcimaDoRepouso: (escala(noMeio.transform) ?? 1) > 1.02,
    semTransformAntesDeRolar: antes.transform === 'none',
    assentadoNoFim: (escala(depois.transform) ?? 1) <= 1.02,
    deltaDeEscala: +((escala(noMeio.transform) ?? 1) - (escala(depois.transform) ?? 1)).toFixed(3),
    deltaDeOpacidade: +(depois.opacity - noMeio.opacity).toFixed(3),
  };
  await ctx.close();
}

/* ── 6. Movimento reduzido nos dois canais ─────────────────────────────────── */
for (const [nome, opc] of [
  ['sistema', { largura: 1440, reduzido: true }],
  ['atributoDoSite', { largura: 1440, reduzido: true, viaAtributo: true }],
]) {
  const { ctx, pag } = await abrir(opc);
  await pag.$eval('#parceiros', (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await pag.waitForTimeout(1200);
  out[`movimentoReduzido_${nome}`] = await pag.evaluate(() => {
    const carimbo = document.querySelector('#parceiros .carimbo-batida');
    const cs = getComputedStyle(carimbo);
    const b = carimbo.getBoundingClientRect();
    const escopo = document.querySelector('#parcerias-intro [data-reveal-nome]');
    const alvos = [...document.querySelectorAll('#parcerias-intro [data-reveal="fade-up"]')].map((el) => {
      const c = getComputedStyle(el);
      return {
        opacity: +c.opacity,
        transform: c.transform,
        transicaoMs: Math.max(
          ...c.transitionDuration.split(',').map((d) => (d.trim().endsWith('ms') ? parseFloat(d) : parseFloat(d) * 1000)),
        ),
        alturaVisivel: Math.round(el.getBoundingClientRect().height),
      };
    });
    return {
      carimbo: {
        opacity: +cs.opacity,
        transform: cs.transform,
        visivel: b.height > 8 && +cs.opacity > 0.9,
        largura: Math.round(b.width),
        altura: Math.round(b.height),
      },
      escopoDoReveal: escopo?.getAttribute('data-in'),
      alvosDoReveal: alvos,
      nenhumPresoInvisivel: alvos.every((a) => a.opacity > 0.9),
    };
  });
  mkdirSync('docs/capturas', { recursive: true });
  await pag.screenshot({ path: `docs/capturas/sis225-reduzido-${nome}.png` });
  await ctx.close();
}

/* ── 4. Geometria da intro nas outras duas larguras ────────────────────────── */
for (const largura of [768, 390]) {
  const { ctx, pag } = await abrir({ largura });
  await pag.$eval('#parcerias-intro', (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await pag.waitForTimeout(900);
  out[`intro${largura}`] = await pag.evaluate(() => {
    const grade = document.querySelector('#parcerias-intro .solucoes-intro');
    const texto = grade.querySelector('.solucoes-intro-texto');
    const arte = grade.querySelector('.solucoes-intro-arte');
    const r = (el) => {
      const b = el.getBoundingClientRect();
      return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
    };
    const carimbo = document.querySelector('#parceiros .carimbo-batida').getBoundingClientRect();
    return {
      colunas: getComputedStyle(grade).gridTemplateColumns,
      texto: r(texto),
      arte: r(arte),
      empilhado: r(arte).y >= r(texto).y + r(texto).h,
      larguraDoCarimbo: Math.round(carimbo.width),
      transbordoHorizontal: Math.round(
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    };
  });
  await pag.screenshot({ path: `docs/capturas/sis225-${largura}-intro.png` });
  await ctx.close();
}

await nav.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/parceiros-abertura-sis225.json', JSON.stringify(out, null, 2));
console.log('gravado docs/medidas/parceiros-abertura-sis225.json');
