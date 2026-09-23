/**
 * SIS-204 — mede o FUNDO de `/solucoes` **antes** de encostar no CSS. O pedido é
 * pôr uma camada de atmosfera clara (quadrados arredondados translúcidos, linhas
 * finas, arco azul, malha de pontos) ATRÁS DA PÁGINA INTEIRA, e os critérios da
 * issue são «legível a 1440 e mobile», «não compete com contraste do texto» e
 * «cards intactos». Nenhum dos três se responde de cabeça:
 *
 *   1. QUAIS FAIXAS DA PÁGINA MOSTRAM HOJE O AZUL DO `body`. É a lista que decide
 *      o escopo: onde o `body` aparece, a camada nova vai aparecer; onde a seção
 *      traz superfície própria opaca (`.section-light`, o fecho), a camada fica
 *      coberta e não muda nada. Só que `.section-light` pinta com
 *      `background: var(--fundo-claro-secao)` — um gradiente — então o
 *      `backgroundColor` COMPUTADO dela é transparente e caminhar pelo DOM cairia
 *      no `body` e mentiria. Por isso a resposta sai do PIXEL da captura, amostrado
 *      na calha lateral (fora do `.container-lp`), e o DOM entra só como cadastro.
 *   2. A TINTA DE CADA FAIXA contra esse pixel: é o número que a camada nova não
 *      pode piorar. Medido antes para haver contra o que comparar depois.
 *   3. ALTURA DO DOCUMENTO e TRANSBORDO a 1440 e a 390 — uma camada `fixed` não
 *      empurra layout, e é isso que o «depois» tem de repetir.
 *
 * Uso: node scripts/medir-fundo-solucoes-sis204.mjs [sufixo]
 *      (sem sufixo grava `-antes`; depois de montar, rodar com `depois`)
 */

import { writeFileSync, readFileSync } from 'node:fs';

const PLAYWRIGHT =
  'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';
const SHELL =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const BASE = 'http://localhost:3000';
const ROTA = '/solucoes';
const SUFIXO = process.argv[2] === 'depois' ? 'depois' : 'antes';
const SAIDA = `docs/medidas/sis204-fundo-${SUFIXO}.json`;

const { chromium } = await import(PLAYWRIGHT);
const navegador = await chromium.launch({ executablePath: SHELL });

async function abrir({ largura = 1440, motion = 'full', reduceSistema } = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    ...(reduceSistema ? { reducedMotion: 'reduce' } : {}),
  });
  /* Gravar `full` VENCE a media query do sistema — o canal do SISTEMA só se mede
     sem gravar preferência nenhuma. */
  await ctx.addInitScript(
    (pref) => {
      if (pref) {
        localStorage.setItem('sistran-motion-preference', pref);
        localStorage.setItem('sistran-motion-preference-seen', '1');
      }
      sessionStorage.setItem('sistran:intro-visto', 'true');
    },
    reduceSistema ? null : motion,
  );
  const p = await ctx.newPage();
  /* `domcontentloaded`: sob `next dev` o `networkidle` nunca chega (canal de HMR). */
  await p.goto(`${BASE}${ROTA}`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[data-route-liberado="true"]', { timeout: 90000 });
  await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
  /* O «ANTES» É RENDERIZADO, NÃO LEMBRADO. A primeira leitura de antes desta sonda
     foi tirada com `fullPage`, e ali o Chromium não resolve camada ancorada na
     janela contra a janela — ou seja aqueles números não comparam com os de agora,
     e comparar com eles inventaria uma regressão (ou esconderia uma). Como o código
     desta issue já está montado, o antes se obtém DESLIGANDO exatamente as regras
     que ela acrescentou, na própria página, com a mesma amostragem de janela:
       • o plano claro e a malha do `<main>`, e a camada de atmosfera;
       • o palco escuro de Serviços (a faixa volta a mostrar o `body` cru);
       • a superfície própria das duas seções claras, que voltam a pintar o MESMO
         valor de antes — hoje ele é o token `--fundo-claro-azul-secao`, movido
         verbatim, então devolvê-lo por aqui devolve o pixel, e a malha de 96px da
         seção volta com ele.
     Se um dia a folha mudar, esta lista caduca junto: ela é a lista do diff. */
  if (SUFIXO === 'antes') {
    await p.addStyleTag({
      content: `
        .solucoes-canvas { background: none !important; isolation: auto !important; }
        .solucoes-canvas::before { display: none !important; }
        .solucoes-atmosfera { display: none !important; }
        .solucoes-palco-servicos { background: none !important; isolation: auto !important; }
        .solucoes-canvas .section-light { background: var(--fundo-claro-secao) !important; }
        .solucoes-canvas .section-light.section-light-blue {
          background: var(--fundo-claro-azul-secao) !important;
        }
        .solucoes-canvas .section-light::before { display: block !important; }
      `,
    });
  }
  await p.waitForTimeout(1600);
  return { ctx, p };
}

/* ── Cadastro da pilha: os filhos diretos do `<main>`, em ordem ──────────────── */
const LER_PILHA = () => {
  const main = document.getElementById('conteudo');
  const doc = document.documentElement;
  /* A pilha visível não é só o filho direto: `HeroVideoBackdrop` embrulha o hero,
     então descemos um nível quando o filho não tem caixa de seção própria. */
  const faixas = [];
  const empilhar = (no, nivel) => {
    const r = no.getBoundingClientRect();
    const cs = getComputedStyle(no);
    faixas.push({
      nivel,
      tag: no.tagName.toLowerCase(),
      id: no.id || null,
      classes: no.className?.toString?.().slice(0, 140) ?? null,
      topoNoDocumento: Math.round(r.top + window.scrollY),
      altura: Math.round(r.height),
      corDeFundo: cs.backgroundColor,
      /* `none` aqui com `backgroundColor` transparente = a faixa NÃO pinta nada e
         o que se vê é o `body`. */
      imagemDeFundo: cs.backgroundImage === 'none' ? 'none' : 'sim',
      zIndex: cs.zIndex,
      posicao: cs.position,
    });
  };
  for (const filho of Array.from(main?.children ?? [])) {
    empilhar(filho, 1);
    /* Um nível para dentro só quando o filho é embrulho (sem fundo próprio e com
       mais de um filho de seção). */
    if (getComputedStyle(filho).backgroundImage === 'none') {
      for (const neto of Array.from(filho.children)) {
        if (neto.tagName === 'SECTION' || neto.tagName === 'DIV') empilhar(neto, 2);
      }
    }
  }
  return {
    alturaDoDocumento: doc.scrollHeight,
    transbordoPx: doc.scrollWidth - window.innerWidth,
    larguraDaJanela: window.innerWidth,
    corDoBody: getComputedStyle(document.body).backgroundColor,
    classesDoMain: document.getElementById('conteudo')?.className ?? null,
    faixas,
  };
};

/* ── As tintas: cada texto visível com a sua cor e a sua altura no documento ──── */
const LER_TINTAS = () => {
  const alvos = [
    ['hero-h1', '#topo h1, main h1'],
    ['hero-lead', 'main h1 ~ p, #topo p'],
    ['aceleradores-h2', '#tecnologia-disruptiva h2'],
    ['aceleradores-p', '#tecnologia-disruptiva p'],
    ['servicos-h2', '#servicos-diferenciais h2'],
    ['servicos-p', '#servicos-diferenciais p'],
    ['servicos-cta', '#servicos-diferenciais .btn-primary'],
    ['consultoria-h2', '#consultoria h2'],
    ['consultoria-p', '#consultoria p'],
  ];
  const saida = {};
  for (const [nome, sel] of alvos) {
    const no = Array.from(document.querySelectorAll(sel)).find((n) => n.offsetParent !== null);
    if (!no) {
      saida[nome] = null;
      continue;
    }
    const r = no.getBoundingClientRect();
    const cs = getComputedStyle(no);
    saida[nome] = {
      seletor: sel,
      cor: cs.color,
      tamanho: cs.fontSize,
      peso: cs.fontWeight,
      /* Ponto de amostragem do FUNDO: à esquerda do primeiro caractere, dentro da
         mesma linha — é ali que a tinta assenta. */
      retangulo: [
        Math.round(r.left),
        Math.round(r.top + window.scrollY),
        Math.round(r.width),
        Math.round(r.height),
      ],
    };
  }
  return saida;
};

/* ── Os cards, para o portão «cards intactos» ────────────────────────────────── */
const LER_CARDS = () => {
  const lista = Array.from(document.querySelectorAll('.acelerador-card, [class*="card"]'))
    .filter((n) => n.offsetParent !== null)
    .slice(0, 12);
  return {
    quantos: lista.length,
    amostra: lista.slice(0, 6).map((n) => {
      const r = n.getBoundingClientRect();
      const cs = getComputedStyle(n);
      return {
        classes: n.className.toString().slice(0, 90),
        caixa: [Math.round(r.width), Math.round(r.height)],
        corDeFundo: cs.backgroundColor,
        raio: cs.borderRadius,
        borda: cs.borderTopColor,
      };
    }),
  };
};

const resultado = { nota: `gerado por scripts/medir-fundo-solucoes-sis204.mjs (${SUFIXO})` };

for (const largura of [1440, 390]) {
  const { ctx, p } = await abrir({ largura });
  const pilha = await p.evaluate(LER_PILHA);
  pilha.tintas = await p.evaluate(LER_TINTAS);
  pilha.cards = await p.evaluate(LER_CARDS);
  /* ⚠️ NADA DE `fullPage`. A camada desta issue é ancorada na JANELA
     (`background-attachment: fixed` e `position: fixed`), e o Chromium NÃO pinta
     camada ancorada na janela ao longo de uma captura de página inteira: ela sai
     só na primeira dobra e o resto do arquivo vem sem ela. Medido nesta issue —
     a primeira rodada da sonda leu `rgb(18, 115, 188)` (o azul cru do `body`) em
     todas as faixas claras e pareceu um defeito do CSS, quando era artefato da
     captura. Então cada amostra é ROLADA até a janela e capturada na janela, que
     é também o que a pessoa vê. */
  pilha.capturaPorFaixa = {};
  for (const f of pilha.faixas) {
    if (f.altura < 40 || f.nivel !== 1) continue;
    const nome = (f.id ?? `${f.tag}-${(f.classes ?? '').split(' ')[0]}`).replace(/[^\w-]/g, '');
    const alvoY = Math.round(f.topoNoDocumento + f.altura * 0.5);
    /* O meio da faixa no meio da janela: a calha lateral naquela linha é o que
       responde «qual superfície esta faixa mostra». */
    await p.evaluate((y) => window.scrollTo(0, Math.max(0, y - window.innerHeight / 2)), alvoY);
    await p.waitForTimeout(350);
    const arquivo = `docs/capturas/sis204-${nome}-${largura}-${SUFIXO}.png`;
    await p.screenshot({ path: arquivo });
    pilha.capturaPorFaixa[nome] = {
      arquivo,
      faixa: f.id ?? f.classes,
      topoNoDocumento: f.topoNoDocumento,
      altura: f.altura,
      rolagem: await p.evaluate(() => Math.round(window.scrollY)),
    };
  }
  /* As tintas, cada uma medida com a seção rolada para a janela — o retângulo
     guardado acima é do documento, então aqui se relê o de TELA. */
  pilha.tintaNaJanela = {};
  for (const [nome, t] of Object.entries(pilha.tintas)) {
    if (!t) continue;
    const [, docY, , h] = t.retangulo;
    await p.evaluate((y) => window.scrollTo(0, Math.max(0, y - window.innerHeight / 2)), docY);
    await p.waitForTimeout(350);
    const arquivo = `docs/capturas/sis204-tinta-${nome}-${largura}-${SUFIXO}.png`;
    await p.screenshot({ path: arquivo });
    const naTela = await p.evaluate(
      ([alvo, altura]) => {
        const no = Array.from(document.querySelectorAll(alvo)).find(
          (n) => n.offsetParent !== null && Math.abs(n.getBoundingClientRect().height - altura) < 2,
        );
        const r = (no ?? document.body).getBoundingClientRect();
        return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];
      },
      [t.seletor, h],
    );
    pilha.tintaNaJanela[nome] = { arquivo, retangulo: naTela, cor: t.cor };
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(350);
  const capa = `docs/capturas/sis204-solucoes-${largura}-${SUFIXO}-topo.png`;
  await p.screenshot({ path: capa });
  pilha.capturaDoTopo = capa;
  resultado[largura] = pilha;
  await ctx.close();
}

/* ── Movimento reduzido: a camada nova não pode animar nem desaparecer ────────── */
const lerReduce = (p) =>
  p.evaluate(() => {
    const no = document.querySelector('.solucoes-atmosfera');
    return {
      atributoMotion: document.documentElement.getAttribute('data-motion'),
      existe: Boolean(no),
      opacidade: no ? Number(getComputedStyle(no).opacity) : null,
      animacoesCorrendo: no
        ? no.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length
        : null,
      animacoesNaPagina: document
        .getAnimations()
        .filter((a) => a.playState === 'running').length,
    };
  });
{
  const s = await abrir({ reduceSistema: true });
  resultado.reducePorSistema = await lerReduce(s.p);
  await s.ctx.close();
  const a = await abrir({ motion: 'reduce' });
  resultado.reducePorAtributo = await lerReduce(a.p);
  await a.ctx.close();
}

await navegador.close();

/* ── O PIXEL REAL: a calha lateral faixa por faixa, e o fundo de cada tinta ───── */
{
  const sharp = (await import('sharp')).default;
  const lum = ([r, g, b]) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const razao = (a, b) => {
    const [m, n] = [lum(a), lum(b)].sort((p, q) => q - p);
    return Number(((m + 0.05) / (n + 0.05)).toFixed(2));
  };
  const corDoTexto = (css) => {
    const m = css?.match(/rgba?\(([^)]+)\)/);
    return m ? m[1].split(',').slice(0, 3).map((v) => Number(v.trim())) : null;
  };

  const bloco = async (arquivo, x, y, lado = 6) => {
    const meta = await sharp(readFileSync(arquivo)).metadata();
    const left = Math.max(0, Math.min(Math.round(x), (meta.width ?? 1) - lado));
    const top = Math.max(0, Math.min(Math.round(y), (meta.height ?? 1) - lado));
    const { data, info } = await sharp(readFileSync(arquivo))
      .extract({ left, top, width: lado, height: lado })
      .raw()
      .toBuffer({ resolveWithObject: true });
    let [sr, sg, sb, n] = [0, 0, 0, 0];
    for (let i = 0; i < data.length; i += info.channels) {
      sr += data[i];
      sg += data[i + 1];
      sb += data[i + 2];
      n += 1;
    }
    return [sr / n, sg / n, sb / n].map((v) => Math.round(v));
  };

  for (const largura of [1440, 390]) {
    const bloco0 = resultado[largura];
    /* A CALHA: x fora do `.container-lp`. A 1440 o contêiner satura em 1180, então
       a calha vai de 0 a 130; a 390 o padding é 16/24. */
    const xCalha = largura === 1440 ? 40 : 6;
    /* Cada faixa tem a SUA captura de janela, e dentro dela o y é de TELA: a faixa
       foi rolada para o meio, então `topoNoDocumento - rolagem` é o topo na tela. */
    bloco0.pixelPorFaixa = [];
    for (const [nome, c] of Object.entries(bloco0.capturaPorFaixa ?? {})) {
      const topoNaTela = c.topoNoDocumento - c.rolagem;
      const cores = [];
      const amostrados = [];
      for (const k of [0.2, 0.5, 0.8]) {
        const y = Math.round(topoNaTela + c.altura * k);
        /* Fora da janela nesta rolagem: a faixa é mais alta que a tela e só o miolo
           está visível. Amostra só o que aparece — o resto sai noutra rolagem. */
        if (y < 0 || y > 900 - 6) continue;
        amostrados.push(k);
        cores.push(await bloco(c.arquivo, xCalha, y));
      }
      bloco0.pixelPorFaixa.push({
        faixa: c.faixa,
        arquivo: c.arquivo,
        topoNoDocumento: c.topoNoDocumento,
        altura: c.altura,
        rolagem: c.rolagem,
        calhaX: xCalha,
        fracoesAmostradas: amostrados,
        pixels: cores.map((x) => `rgb(${x.join(', ')})`),
        /* AZUL DO `body` = a faixa não traz superfície própria nem vê o plano claro. */
        pareceAzulDoBody:
          cores.length > 0 && cores.every((x) => x[2] > x[0] + 40 && x[2] > 120),
        nome,
      });
    }
    /* Contraste de cada tinta contra o pixel imediatamente à esquerda dela, na
       captura em que aquela tinta estava na janela. */
    bloco0.contrasteDasTintas = {};
    for (const [nome, t] of Object.entries(bloco0.tintas ?? {})) {
      const j = bloco0.tintaNaJanela?.[nome];
      if (!t || !j) {
        bloco0.contrasteDasTintas[nome] = null;
        continue;
      }
      const [x, y, , h] = j.retangulo;
      const tinta = corDoTexto(t.cor);
      const fundo = await bloco(j.arquivo, Math.max(0, x - 10), y + h / 2 - 3, 5);
      bloco0.contrasteDasTintas[nome] = {
        tinta: t.cor,
        fundo: `rgb(${fundo.join(', ')})`,
        amostraEm: [Math.max(0, x - 10), Math.round(y + h / 2 - 3)],
        arquivo: j.arquivo,
        contraste: tinta ? razao(tinta, fundo) : null,
      };
    }
  }
}

writeFileSync(SAIDA, `${JSON.stringify(resultado, null, 2)}\n`);
console.log(SAIDA);
console.log(JSON.stringify(resultado, null, 2));
