/**
 * Sonda de «Como Agimos» (`/quem-somos`), a seção refeita sobre o carimbo
 * `carimbo-agimos-ticket-outline-ffffff.png` e a tipografia de `docs/fonte2.md`.
 *
 * Molde: `scripts/medir-conheca-tambem-sis253.mjs`. As armadilhas herdadas dele,
 * todas já pagas com defeito medido:
 *   · a ESCALA se lê em `getComputedStyle(el).scale`, propriedade INDEPENDENTE, e
 *     nunca na matriz de `transform` — aqui a que importa é `rotate`, pela mesma
 *     razão (o reveal é dono do `transform`);
 *   · contraste se amostra em ponto de fundo LIVRE DE TINTA, passado pelo chamador;
 *     centrar a janela no texto compara a cor com ela mesma e devolve 1,00;
 *   · rolar até a seção TRÊS VEZES: o layout acima ainda se acomoda depois da
 *     primeira, e uma passada só deixa a seção fora do quadro, então `whileInView`
 *     nunca dispara.
 *
 *   node scripts/medir-como-agimos.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'file:///C:/Users/maria.martinelli/AppData/Local/npm-cache/_npx/361ceb562f3b3235/node_modules/playwright/index.mjs';

const EXE =
  process.env.LOCALAPPDATA +
  '/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const URL_ROTA = 'http://localhost:3000/quem-somos';
const SECAO = 'section[aria-labelledby="como-agimos"]';
const LARGURAS = [1440, 768, 390];

/* O texto que TEM de estar na tela, palavra por palavra. A primeira frase é a
   manuscrita, a segunda a prosa, e os oito valores são `COMO_AGIMOS`. */
const TEXTOS = [
  'Nossos valores são a base da nossa cultura organizacional.',
  'Respeitando as individualidades, prezamos pela:',
  'Ética',
  'Transparência',
  'Valorização Humana',
  'Integração',
  'Inovação',
  'Qualidade',
  'Comprometimento',
  'Profissionalismo',
];

/* Medidas do carimbo lidas com `sharp`, para conferir que o `<Image>` serve o
   arquivo certo e com as intrínsecas certas. */
const CARIMBO = { arquivo: 'carimbo-agimos-ticket-outline-ffffff.png', largura: 801, altura: 339 };

const num = (v) => Math.round(v * 100) / 100;

/* ── contraste ───────────────────────────────────────────────────────────────── */
const lum = (r, g, b) => {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const razao = (a, b) => {
  const [x, y] = [lum(...a), lum(...b)];
  return num((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05));
};

async function abrir(navegador, largura) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const pag = await ctx.newPage();
  await pag.goto(URL_ROTA, { waitUntil: 'domcontentloaded' });
  await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  await pag.addStyleTag({
    content:
      'nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}',
  });
  /* TRÊS passadas — a razão está no docblock. */
  for (let i = 0; i < 3; i++) {
    await pag.$eval(SECAO, (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await pag.waitForTimeout(700);
  }
  await pag.waitForTimeout(1200);
  return { ctx, pag };
}

/* UM argumento só: `page.evaluate` aceita exatamente um, e três soltos abortam a
   sonda antes da primeira medida. */
const LER = ({ SECAO, TEXTOS, CARIMBO }) => {
  const secao = document.querySelector(SECAO);
  const cs = (el) => (el ? getComputedStyle(el) : null);
  const n = (v) => Math.round(parseFloat(v) * 100) / 100;

  const h2 = secao.querySelector('h2#como-agimos');
  const img = h2?.querySelector('img');
  const mao = secao.querySelector('.agimos-manuscrito');
  const risco = secao.querySelector('.agimos-risco-traco');
  const prosa = secao.querySelector('.agimos-prosa');
  const rolo = secao.querySelector('.agimos-rolo');
  const taloes = [...secao.querySelectorAll('.agimos-talao')];
  const escopo = secao.querySelector('[data-in]');

  const caixa = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { x: n(b.left), y: n(b.top), w: n(b.width), h: n(b.height) };
  };

  /* Pontos de amostragem LIVRES DE TINTA, um por texto medido: logo abaixo da
     caixa, onde só há fundo. */
  const fundoDe = (el) => {
    const b = el.getBoundingClientRect();
    return { x: n(b.left + b.width / 2), y: n(b.bottom + 6) };
  };

  const csMao = cs(mao);
  const csProsa = cs(prosa);
  const csRolo = cs(rolo);
  const csRisco = cs(risco);

  return {
    /* ── O CARIMBO COMO `h2` ───────────────────────────────────────────────── */
    carimbo: {
      h2ehH2: h2?.tagName === 'H2',
      idNoH2: h2?.id === 'como-agimos',
      /* O texto acessível do heading — é ele que `aria-labelledby` resolve. */
      textoAcessivel: (h2?.textContent || '').trim() || img?.getAttribute('alt') || null,
      alt: img?.getAttribute('alt') ?? null,
      /* O arquivo servido: o `src` do Next traz o caminho codificado. */
      arquivoCerto: decodeURIComponent(img?.currentSrc || img?.src || '').includes(CARIMBO.arquivo),
      carregou: img?.complete === true && img?.naturalWidth > 0,
      intrinseca: img ? { w: img.naturalWidth, h: img.naturalHeight } : null,
      intrinsecaCasaComSharp:
        img?.naturalWidth === CARIMBO.largura && img?.naturalHeight === CARIMBO.altura,
      caixa: caixa(h2),
      /* A proporção renderizada tem de ser a do arquivo: 801/339 = 2,3628. Se
         divergir, a arte está esmagada. */
      proporcao: h2 ? n(h2.getBoundingClientRect().width / h2.getBoundingClientRect().height) : null,
      proporcaoArquivo: n(CARIMBO.largura / CARIMBO.altura),
      /* NÃO deve haver tombo em CSS: a inclinação já vem desenhada no arquivo. */
      rotateCss: cs(h2)?.rotate ?? null,
      /* `TituloAceso` não pode ter sobrado: seria o nome da seção duas vezes. */
      semTituloAceso: secao.querySelector('.titulo-aceso') === null,
    },

    /* ── A FRASE MANUSCRITA, contra `docs/fonte2.md` ─────────────────────────── */
    manuscrito: {
      familia: csMao?.fontFamily ?? null,
      usaKalam: (csMao?.fontFamily || '').toLowerCase().includes('kalam'),
      peso: csMao?.fontWeight ?? null,
      corpoPx: csMao ? n(csMao.fontSize) : null,
      alturaLinha: csMao ? n(csMao.lineHeight) / n(csMao.fontSize) : null,
      cor: csMao?.color ?? null,
      /* `rotate` e NÃO `transform`: o documento pede -4deg e o reveal é dono do
         `transform`. Ler a matriz aqui devolveria `none` e reprovaria um gesto que
         funciona — foi o defeito 1 da sonda da SIS-253. */
      rotate: csMao?.rotate ?? null,
      transform: csMao?.transform ?? null,
      caixa: caixa(mao),
      pontoFundo: mao ? fundoDe(mao) : null,
      /* Exigência do documento: texto HTML editável, nunca embutido em imagem. */
      ehTextoHtml: (mao?.textContent || '').includes('Nossos valores'),
      semImagemDentro: mao?.querySelector('img') === null,
    },

    /* ── O TRAÇO CIANO ──────────────────────────────────────────────────────── */
    risco: {
      existe: !!risco,
      stroke: csRisco?.stroke ?? null,
      larguraTraco: csRisco?.strokeWidth ?? null,
      /* O gesto é `stroke-dashoffset` de 1 a 0. Depois da entrada tem de estar em
         0 — se ficar em 1, a frase acabou sublinhada por nada. */
      dashoffset: csRisco ? n(csRisco.strokeDashoffset) : null,
      desenhado: csRisco ? n(csRisco.strokeDashoffset) === 0 : null,
      caixaSvg: caixa(secao.querySelector('.agimos-risco')),
      /* O gatilho: `data-in` escrito pelo `RevealScope`. */
      escopoAcendeu: escopo?.getAttribute('data-in') ?? null,
    },

    /* ── O ROLO DE BILHETES ─────────────────────────────────────────────────── */
    rolo: {
      ehLista: rolo?.tagName === 'OL',
      taloes: taloes.length,
      colunas: csRolo?.gridTemplateColumns?.split(' ').length ?? null,
      /* `gap: 0` é o que faz disto um rolo e não uma grade. */
      gap: csRolo ? n(csRolo.rowGap) : null,
      raio: csRolo?.borderRadius ?? null,
      borda: csRolo?.borderTopWidth ? `${csRolo.borderTopWidth} ${csRolo.borderTopColor}` : null,
      /* As duas perfurações laterais. Sem `mask-composite: intersect` o rolo
         inteiro desaparece — então medir a máscara E a área visível. */
      mask: (csRolo?.maskImage || 'none').slice(0, 120),
      maskComposite: csRolo?.maskComposite ?? null,
      roloVisivel: rolo ? rolo.getBoundingClientRect().height > 40 : null,
      caixa: caixa(rolo),
      /* As COSTURAS picotadas: quantos talões têm fio à esquerda e quantos em cima.
         Numa faixa de 4 colunas o esperado é 6 à esquerda (os que não abrem linha)
         e 4 em cima (a segunda linha). */
      comFioEsquerda: taloes.filter((t) => cs(t).borderLeftStyle === 'dashed').length,
      comFioTopo: taloes.filter((t) => cs(t).borderTopStyle === 'dashed').length,
      /* Nenhum talão pode ter sobrado com a gramática de cartão. */
      semGlassCard: secao.querySelector('.glass-card, .glass-card-hover, .notch-card') === null,
      semBarraSinal: secao.querySelector('.barra-sinal') === null,
      semNumMonumental: secao.querySelector('.num-monumental') === null,
      /* Os talões se TOCAM: a distância entre o fim de um e o começo do vizinho na
         mesma linha tem de ser 0. É o que distingue rolo de grade. */
      emendaHorizontal:
        taloes.length > 1
          ? n(
              taloes[1].getBoundingClientRect().left - taloes[0].getBoundingClientRect().right,
            )
          : null,
    },

    /* ── A SÉRIE e o VALOR de cada talão ────────────────────────────────────── */
    talao: (() => {
      const serie = secao.querySelector('.agimos-serie');
      const valor = secao.querySelector('.agimos-valor');
      const csS = cs(serie);
      const csV = cs(valor);
      return {
        serieCorpoPx: csS ? n(csS.fontSize) : null,
        serieCor: csS?.color ?? null,
        serieTexto: serie?.textContent?.trim() ?? null,
        /* `tabular-nums` para os oito números terem a mesma largura. */
        serieTabular: (csS?.fontVariantNumeric || '').includes('tabular-nums'),
        serieCaixa: caixa(serie),
        seriePontoFundo: serie ? fundoDe(serie) : null,
        valorCorpoPx: csV ? n(csV.fontSize) : null,
        valorCor: csV?.color ?? null,
        valorEhH3: valor?.tagName === 'H3',
        valorCaixa: caixa(valor),
        valorPontoFundo: valor ? fundoDe(valor) : null,
      };
    })(),

    prosa: {
      corpoPx: csProsa ? n(csProsa.fontSize) : null,
      cor: csProsa?.color ?? null,
      caixa: caixa(prosa),
      pontoFundo: prosa ? fundoDe(prosa) : null,
    },

    /* ── A seção e o fundo ──────────────────────────────────────────────────── */
    secaoInfo: {
      temGradeTecnica: !!secao.querySelector('.grade-tecnica'),
      /* A seção NÃO é clara: é isso que dispensa `.on-dark` e dá papel ao carimbo
         branco. */
      ehSectionLight: secao.classList.contains('section-light'),
      rotulada: secao.getAttribute('aria-labelledby') === 'como-agimos',
      largura: n(secao.getBoundingClientRect().width),
      /* Estouro horizontal: a página não pode ganhar barra por causa do tombo da
         frase manuscrita nem do carimbo. */
      estouro: n(document.documentElement.scrollWidth - document.documentElement.clientWidth),
    },

    textosPresentes: TEXTOS.map((t) => ({ t, presente: secao.textContent.includes(t) })),
  };
};

/* UM retrato da JANELA, indexado depois por coordenada de janela. Foi assim, e não
   por `clip`, por um defeito medido: na primeira volta cada leitura tirava seu
   próprio `page.screenshot({clip})`, e o texto branco desta seção media 1,71:1
   contra um «fundo» `rgb(0, 80, 140)` que não é o dela. Um retrato só, lido com as
   MESMAS coordenadas que `getBoundingClientRect` devolveu no mesmo quadro, elimina
   a chance de a geometria e os pixels virem de instantes ou espaços diferentes. */
async function retrato(pag) {
  const sharp = (await import('sharp')).default;
  const png = await pag.screenshot();
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const pixel = (x, y) => {
    const px = Math.round(x);
    const py = Math.round(y);
    if (px < 0 || py < 0 || px >= info.width || py >= info.height) return null;
    const i = (py * info.width + px) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  return { largura: info.width, altura: info.height, pixel };
}

/* Lê a cor média e o PIOR pixel da TINTA de uma caixa, contra o fundo daquela mesma
   altura. Duas correções, ambas de defeito medido nesta seção:
   1. O FUNDO É POR LINHA, e não um ponto único. O fundo desta faixa de `/quem-somos`
      é um GRADIENTE — a amostra de referência 6px abaixo da caixa dava
      `rgb(0, 84, 146)` enquanto o topo da mesma caixa é bem mais escuro. Comparado a
      um ponto só, quase todo pixel «difere do fundo» e entra como tinta: 25.745 dos
      32.000 pixels da janela a 1440, isto é, 80% do retângulo contado como letra.
      Daí a «tinta média» sair `rgb(36, 119, 173)` para texto cujo `color` é branco, e
      daí os 1,71:1 impossíveis. Aqui cada LINHA traz o seu próprio piso: o pixel mais
      escuro da linha, que numa seção de tinta clara sobre fundo escuro é fundo por
      definição.
   2. O PIOR PIXEL SÓ VALE SOBRE TINTA CHEIA. Varrer todo pixel mais claro que o piso
      faz o pior cair sempre na FRANJA de antialiasing — a borda do glifo, que é uma
      mistura e não a cor do texto — e devolve ~1,14 para qualquer coisa. O corte de
      cobertura de 50% separa corpo de letra de borda. Os dois números continuam
      saindo, porque em texto pequeno é o par que importa, não a média sozinha.
      O PICO QUE DEFINE ESSE CORTE É DA CAIXA INTEIRA, e não da linha: uma linha que
      só pega a aba superior de um glifo tem pico fraco, e metade de um pico fraco
      ainda é franja. Foi esse o resto do defeito — a mesma `.agimos-valor` que a
      1440 media 6,03:1 caía para 1,77:1 a 768, onde o nome do valor reparte em duas
      linhas e sobram linhas de aba. Conferido a olho nu na linha do meio da caixa:
      a tinta é `rgb(255, 255, 255)` cheia sobre `rgb(10, 98, 157)`, 6,47:1. */
function contraste(foto, caixa) {
  if (!caixa) return null;
  /* A janela recortada ao que está DENTRO da janela do navegador: se a caixa nasce
     acima da dobra (o carimbo a 390 nasce em y = -124), medir o pedaço visível é
     honesto, medir o invisível é medir fora do quadro. */
  const x0 = Math.max(0, Math.round(caixa.x));
  const y0 = Math.max(0, Math.round(caixa.y));
  const x1 = Math.min(foto.largura, Math.round(caixa.x + Math.min(caixa.w, 400)));
  const y1 = Math.min(foto.altura, Math.round(caixa.y + Math.min(caixa.h, 80)));
  if (x1 <= x0 || y1 <= y0) return { aviso: 'caixa fora da janela', caixa };

  /* Passada 1: as linhas, com o piso de cada uma, e o PICO da caixa inteira. */
  const grade = [];
  let pico = -Infinity;
  for (let y = y0; y < y1; y++) {
    const linha = [];
    for (let x = x0; x < x1; x++) {
      const px = foto.pixel(x, y);
      if (px) linha.push(px);
    }
    if (!linha.length) continue;
    const lums = linha.map((p) => lum(...p));
    const piso = Math.min(...lums);
    const alto = Math.max(...lums);
    if (alto > pico) pico = alto;
    grade.push({ linha, lums, piso, fundoLinha: linha[lums.indexOf(piso)] });
  }
  if (!grade.length) return { aviso: 'caixa sem pixels', caixa };

  /* Passada 2: só o que passa de metade do caminho entre o fundo DA LINHA e o pico DA
     CAIXA é corpo de letra. */
  let soma = [0, 0, 0];
  let somaFundo = [0, 0, 0];
  let contados = 0;
  let linhas = 0;
  let pior = Infinity;
  for (const { linha, lums, piso, fundoLinha } of grade) {
    const limite = piso + (pico - piso) * 0.5;
    let naLinha = 0;
    for (let i = 0; i < linha.length; i++) {
      if (lums[i] < limite) continue;
      soma = [soma[0] + linha[i][0], soma[1] + linha[i][1], soma[2] + linha[i][2]];
      contados++;
      naLinha++;
      const r = razao(linha[i], fundoLinha);
      if (r < pior) pior = r;
    }
    if (naLinha) {
      somaFundo = [
        somaFundo[0] + fundoLinha[0],
        somaFundo[1] + fundoLinha[1],
        somaFundo[2] + fundoLinha[2],
      ];
      linhas++;
    }
  }
  if (!contados || !linhas) return { aviso: 'nenhum pixel de tinta na janela', caixa };
  const medio = soma.map((s) => Math.round(s / contados));
  const fundo = somaFundo.map((s) => Math.round(s / linhas));
  return {
    fundoMedio: `rgb(${fundo.join(', ')})`,
    tintaMedia: `rgb(${medio.join(', ')})`,
    pixelsDeTinta: contados,
    medio: razao(medio, fundo),
    pior: pior === Infinity ? null : num(pior),
  };
}

const saida = { rota: URL_ROTA, quando: new Date().toISOString(), larguras: {} };
const navegador = await chromium.launch({ executablePath: EXE });

for (const largura of LARGURAS) {
  const { ctx, pag } = await abrir(navegador, largura);
  const bloco = await pag.evaluate(LER, { SECAO, TEXTOS, CARIMBO });

  /* O retrato é tirado ANTES do hover, no mesmo quadro parado em que `LER` colheu a
     geometria — e as quatro leituras saem todas dele. */
  const foto = await retrato(pag);
  bloco.contraste = {
    janela: { largura: foto.largura, altura: foto.altura },
    manuscrito: contraste(foto, bloco.manuscrito.caixa),
    prosa: contraste(foto, bloco.prosa.caixa),
    serie: contraste(foto, bloco.talao.serieCaixa),
    valor: contraste(foto, bloco.talao.valorCaixa),
  };

  /* HOVER do talão: o preenchimento é `opacity` do `::before`. Lê-se no
     pseudo-elemento, e registra-se se o ambiente TEM ponteiro fino — sem isso um
     ambiente sem ponteiro se confunde com regra que falhou (defeito 1 da SIS-253). */
  bloco.hover = await (async () => {
    const ponteiroFino = await pag.evaluate(
      () => matchMedia('(hover: hover) and (pointer: fine)').matches,
    );
    const antes = await pag.evaluate(() =>
      getComputedStyle(document.querySelector('.agimos-talao'), '::before').opacity,
    );
    await pag.hover('.agimos-talao');
    await pag.waitForTimeout(700);
    const depois = await pag.evaluate(() =>
      getComputedStyle(document.querySelector('.agimos-talao'), '::before').opacity,
    );
    return { ponteiroFino, antes: num(Number(antes)), depois: num(Number(depois)) };
  })();

  mkdirSync('docs/capturas', { recursive: true });
  await pag.$eval(SECAO, (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await pag.waitForTimeout(500);
  await pag.locator(SECAO).screenshot({ path: `docs/capturas/como-agimos-${largura}.png` });

  saida.larguras[largura] = bloco;
  await ctx.close();
}

/* ── OS DOIS CANAIS DE MOVIMENTO REDUZIDO ─────────────────────────────────────
   O risco tem de terminar DESENHADO (`stroke-dashoffset: 0`) nos dois: `animation:
   none` sem o estado final deixaria a frase sublinhada por nada — o modo de falha
   que a skill de movimento reduzido chama de «conteúdo invisível para sempre». */
saida.movimentoReduzido = {};
for (const canal of ['preferencia', 'atributo']) {
  const ctx = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    ...(canal === 'preferencia' ? { reducedMotion: 'reduce' } : {}),
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference', 'full');
    localStorage.setItem('sistran-motion-preference-seen', '1');
    sessionStorage.setItem('sistran:intro-visto', 'true');
  });
  const pag = await ctx.newPage();
  await pag.goto(URL_ROTA, { waitUntil: 'domcontentloaded' });
  await pag.waitForSelector('[data-route-liberado="true"]', { timeout: 30000 });
  if (canal === 'atributo') {
    await pag.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
  }
  for (let i = 0; i < 3; i++) {
    await pag.$eval(SECAO, (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await pag.waitForTimeout(600);
  }
  await pag.waitForTimeout(1000);
  saida.movimentoReduzido[canal] = await pag.evaluate(() => {
    const n = (v) => Math.round(parseFloat(v) * 100) / 100;
    const risco = document.querySelector('.agimos-risco-traco');
    const talao = document.querySelector('.agimos-talao');
    const csR = getComputedStyle(risco);
    return {
      riscoAnimacao: csR.animationName,
      riscoDashoffset: n(csR.strokeDashoffset),
      riscoDesenhado: n(csR.strokeDashoffset) === 0,
      talaoTransicao: getComputedStyle(talao, '::before').transitionDuration,
      /* Os oito valores continuam na tela: nada depende de animação para existir. */
      oitoValores: document.querySelectorAll('.agimos-valor').length,
      textoManuscritoVisivel: n(getComputedStyle(document.querySelector('.agimos-manuscrito')).opacity),
    };
  });
  await ctx.close();
}

await navegador.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync('docs/medidas/como-agimos.json', JSON.stringify(saida, null, 2));
console.log('gravado docs/medidas/como-agimos.json');
