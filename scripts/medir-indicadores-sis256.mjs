/**
 * SIS-256 — a régua dos sete cartões de números de `/contato`: ANTES e DEPOIS.
 *
 * A issue tem dois critérios de aceite, e nenhum dos dois se confere de olho:
 *   1. «Nenhum cartão exibe «01 / 07»» — não basta olhar a foto, porque o contador
 *      é montado por `template literal` e um resto dele (o nó, o fio, ou um cartão
 *      só) passaria despercebido numa captura. Aqui a verificação é sobre o DOM:
 *      contam-se os `.contato-indicador-etapa`, `.contato-indicador-no` e
 *      `.contato-indicador-fio` (o alvo é ZERO nos três) e varre-se o texto da
 *      seção inteira procurando o padrão `NN / NN` — que pega o contador mesmo se
 *      ele reaparecer com outra classe.
 *   2. «Largura visual de cada card MENOR que o baseline atual a 1440» — é uma
 *      comparação, então a mesma sonda tem de rodar antes e depois. Ela grava
 *      `docs/medidas/indicadores-sis256-<fase>.json`, e a fase vem de `FASE=antes`
 *      ou `FASE=depois` no ambiente. Mede-se a largura dos SETE, não a do
 *      primeiro: com cartão de largura derivada do conteúdo (o desenho da
 *      referência que a autora mandou) as sete larguras passam a ser diferentes, e
 *      "cada card" no critério quer dizer cada um.
 *
 * Também se mede o que a mudança pode QUEBRAR de lado:
 *   · quantas fileiras e quantos cartões por fileira — sete numa grade que não
 *     estica não pode virar sete fileiras;
 *   · linhas do pior rótulo ("Mil horas de Capacidade Produtiva no Brasil"), que é
 *     a constante que todo comentário desta faixa usa como pior caso;
 *   · transbordo lateral da grade (`scrollWidth > clientWidth`), o defeito que um
 *     cartão de largura fixa numa fileira só produziria;
 *   · contraste AA do número e do rótulo sobre o cartão claro, pelo método de
 *     `docs/medidas/COMO-MEDIR-CONTRASTE.md` — a tinta do bloco inteiro é apagada
 *     e o pior pixel do retângulo é comparado com a tinta declarada. O piso é 3,0
 *     para o número (texto grande) e 4,5 para o rótulo (texto pequeno).
 *
 * Rodar com o dev de pé:
 *   FASE=antes  node scripts/medir-indicadores-sis256.mjs
 *   FASE=depois node scripts/medir-indicadores-sis256.mjs
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:3000';
/* ⚠️ O PADRÃO É `depois`, E O MOTIVO É UM ESTRAGO QUE JÁ ACONTECEU (4ª volta).
   Era `?? 'antes'`, e rodar a sonda sem variável de ambiente — o gesto natural
   depois de mudar o CSS — SOBRESCREVEU `indicadores-sis256-antes.json` com o estado
   NOVO. O arquivo do "antes" é irrecuperável por aqui (`git` não está acessível
   nesta máquina), e ele era a única linha de base do estado anterior em disco.
   O padrão certo é o que se usa toda hora: mede-se o "depois" muitas vezes, ao
   longo da implementação; o "antes" se mede UMA vez, de propósito, antes de tocar em
   nada — e aí passar `FASE=antes` explicitamente é o custo justo. Escolha invertida,
   quem esquece a variável destrói a linha de base em vez de reescrever o resultado
   que ele mesmo acabou de gerar. */
const FASE = process.env.FASE ?? 'depois';
const VIEWPORTS = [
  { w: 1440, h: 900 },
  { w: 390, h: 844 },
];

const luminancia = ({ r, g, b }) => {
  const c = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const razao = (a, b) => {
  const [x, y] = [luminancia(a) + 0.05, luminancia(b) + 0.05].sort((p, q) => q - p);
  return x / y;
};
/* A tinta declarada pode ter alfa (o rótulo é `rgb(10 31 68 / 88%)`): compõe-se
   sobre o pixel de fundo, senão o número sai otimista. */
const compor = (tinta, fundo) => ({
  r: tinta.r * tinta.a + fundo.r * (1 - tinta.a),
  g: tinta.g * tinta.a + fundo.g * (1 - tinta.a),
  b: tinta.b * tinta.a + fundo.b * (1 - tinta.a),
});
const lerTinta = (css) => {
  const n = css.match(/[\d.]+/g).map(Number);
  return { r: n[0], g: n[1], b: n[2], a: n[3] ?? 1 };
};

/* ── A ROLAGEM TEM DE PARAR ANTES DE QUALQUER FOTO ─────────────────────────────
   Medido nesta sonda: com um `scrollIntoViewIfNeeded` e uma espera fixa, o
   retângulo do número era lido num instante e a foto saía alguns milissegundos
   depois — já com a página deslizando (o Lenis assume o eixo e continua o
   movimento). O recorte caía no cartão ESCURO do mapa logo abaixo, e o contraste
   do número vinha 1,04:1 com zero pixel de glifo.

   ⚠️ QUEM ROLA É O `scrollIntoViewIfNeeded`, e não um `window.scrollBy` daqui.
   Também medido: com `scrollBy` a foto saía escura mesmo depois de o retângulo
   estabilizar em 120px do topo — o Lenis não acompanha um deslocamento escrito por
   fora dele, então o que o `getBoundingClientRect` diz e o que a página PINTA
   deixam de ser a mesma coisa. Este laço, portanto, não move nada: ele só espera o
   topo da faixa repetir o mesmo valor em dois quadros seguidos. */
async function assentar(page, seletor) {
  await page.locator(seletor).scrollIntoViewIfNeeded();
  let anterior = null;
  for (let tentativa = 0; tentativa < 40; tentativa += 1) {
    const topo = await page.evaluate(async (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
      return Math.round(el.getBoundingClientRect().top);
    }, seletor);
    if (topo !== null && topo === anterior) return true;
    anterior = topo;
    await page.waitForTimeout(120);
  }
  return false;
}

/* ⚠️ A CORTINA DE ROTA VOLTA A CADA CARGA — e portanto TAMBÉM DEPOIS DE `reload()`.
   `RouteLoadGate` cobre a página com um véu navy (`[data-route-loading]`) enquanto a
   rota carrega, e ele é a causa medida do recorte escuro que esta sonda produziu
   quatro vezes: o `getBoundingClientRect` do número estava CERTO (x 179, y 720), só
   que o que a página pintava naquele retângulo era o véu. Provado lado a lado: sem
   esperar, a média do recorte é navy; com esta espera, rgb(186,193,204) — antes e
   depois do reload. Por isso é uma função, chamada em TODA carga: quando a espera
   morava solta depois do `goto`, o `reload()` do fim do laço de contraste reabria o
   véu e envenenava o alvo seguinte e a captura final.
   `[data-route-liberado="true"]` é o próprio componente dizendo que liberou
   (`RouteLoadGate.tsx:218`). */
async function liberarRota(page) {
  await page.waitForSelector('.contato-indicador', { timeout: 180_000 });
  await page.waitForSelector('[data-route-liberado="true"]', { timeout: 180_000 });
  await page.waitForSelector('[data-route-loading]', { state: 'detached', timeout: 180_000 });
}

const navegador = await chromium.launch();
const relatorio = { fase: FASE, base: BASE, quando: new Date().toISOString(), viewports: {} };

for (const { w, h } of VIEWPORTS) {
  const ctx = await navegador.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(() => {
    localStorage.setItem('sistran-motion-preference-seen', '1');
    localStorage.setItem('sistran-motion-preference', 'system');
    window.__linhas = (el) => {
      const faixa = document.createRange();
      faixa.selectNodeContents(el);
      const topos = new Set();
      for (const r of faixa.getClientRects()) topos.add(Math.round(r.top));
      return topos.size || 1;
    };
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/contato`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await liberarRota(page);
  await page.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
      header.fixed{display:none!important}`,
  });
  await page.evaluate(() => document.fonts.ready);
  /* A onda desloca o cartão em ±7px; a LARGURA não muda com ela, mas o `y` de topo
     (que agrupa as fileiras) precisa ser lido com a onda parada — senão sete
     cartões de uma fileira só aparecem em sete `y` diferentes.
     ⚠️ A PREFERÊNCIA É DECLARADA ANTES DE ASSENTAR, e a ordem foi medida: ligá-la
     depois remexia a rolagem (a página remede e a posição muda), então o retângulo
     lido valia para um quadro e a foto saía de outro — recorte escuro do hero. */
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await assentar(page, '.contato-indicadores');
  await page.waitForTimeout(900);

  const geo = await page.evaluate(() => {
    const secao = document.querySelector('.contato-indicadores');
    const grade = document.querySelector('.contato-indicadores-grade');
    const cartoes = [...document.querySelectorAll('.contato-indicador')];
    const topos = cartoes.map((c) => Math.round(c.getBoundingClientRect().top));
    const fileiras = [...new Set(topos)].sort((a, b) => a - b);
    const pior = cartoes
      .map((c) => c.querySelector('.contato-indicador-rotulo'))
      .filter(Boolean)
      .map((r) => ({ texto: r.textContent, linhas: window.__linhas(r) }))
      .sort((a, b) => b.linhas - a.linhas)[0];
    const primeiroCorpo = cartoes[0].querySelector('.contato-indicador-corpo');
    return {
      cartoes: cartoes.length,
      larguras: cartoes.map((c) => Number(c.getBoundingClientRect().width.toFixed(1))),
      alturas: cartoes.map((c) => Number(c.getBoundingClientRect().height.toFixed(1))),
      /* ── 3ª VOLTA · «todos os cards do mesmo tamanho» ─────────────────────────
         O critério é uma IGUALDADE, então quem decide é a diferença entre o maior e
         o menor, não a lista de sete números — a lista prova, este par aprova.
         Tolerância de 0,5px porque `getBoundingClientRect` devolve float e uma
         grade de 8 colunas divide 1116 em pedaços que não fecham em inteiro; meio
         pixel não é "tamanho diferente", é arredondamento de subpixel. */
      deltaLargura: Number(
        (
          Math.max(...cartoes.map((c) => c.getBoundingClientRect().width)) -
          Math.min(...cartoes.map((c) => c.getBoundingClientRect().width))
        ).toFixed(2),
      ),
      deltaAltura: Number(
        (
          Math.max(...cartoes.map((c) => c.getBoundingClientRect().height)) -
          Math.min(...cartoes.map((c) => c.getBoundingClientRect().height))
        ).toFixed(2),
      ),
      fileiras: fileiras.length,
      porFileira: fileiras.map((t) => topos.filter((y) => y === t).length),
      alturaSecao: Math.round(secao.getBoundingClientRect().height),
      larguraGrade: Math.round(grade.getBoundingClientRect().width),
      transbordoLateral: grade.scrollWidth > grade.clientWidth + 1,
      /* Critério 1, sobre o DOM e não sobre a foto. */
      etapas: document.querySelectorAll('.contato-indicador-etapa').length,
      nos: document.querySelectorAll('.contato-indicador-no').length,
      fios: document.querySelectorAll('.contato-indicador-fio').length,
      /* SEM `\b` NAS PONTAS, e isto foi um falso negativo medido: o texto do cartão
         sai concatenado como "01 / 07850+489+Membros…" (o contador cola no número),
         então o `\b` depois de `07` batia no `8` — que é caractere de palavra — e o
         padrão falhava com os SETE contadores em tela. Uma verificação de critério de
         aceite que aprova sozinha é pior que nenhuma. */
      contadorNoTexto: /\d{2}\s*\/\s*\d{2}/.test(secao.textContent ?? ''),
      /* O par número/rótulo continua LADO A LADO? É o que a autora mandou como
         estrutura, e em `column` a foto engana. */
      direcaoDoCorpo: getComputedStyle(primeiroCorpo).flexDirection,
      corpoNumero: getComputedStyle(cartoes[0].querySelector('.contato-indicador-valor')).fontSize,
      corpoRotulo: getComputedStyle(cartoes[0].querySelector('.contato-indicador-rotulo')).fontSize,
      /* Os sete números e rótulos estão em quadro? */
      todosEmQuadro: cartoes.every((c) => {
        const r = c.getBoundingClientRect();
        return r.left >= -1 && r.right <= window.innerWidth + 1 && r.width > 0 && r.height > 0;
      }),
      textos: cartoes.map((c) => c.textContent.replace(/\s+/g, ' ').trim()),
    };
  });

  /* ── 2ª VOLTA · O CARTÃO ESCURO E O HOVER QUE "VEM PARA A FRENTE" ────────────
     Três coisas que a foto não prova:
       · a superfície de repouso é escura? (o pedido é «já escuro»);
       · o hover ESCALA de verdade? Este é o ponto que precisa de sonda, e não de
         olho: `transform: scale()` aqui seria engolido pela animação da onda, e a
         saída foi a propriedade individual `scale`. Se a composição não funcionasse,
         a largura pintada não mudaria — então mede-se a caixa antes e durante o
         hover, e não só o valor computado;
       · com movimento reduzido a escala volta a 1 e a SOMBRA continua mudando.
     O hover é do PONTEIRO real do Chromium, não uma classe fingida.

     ⚠️ `page.mouse.move`, E NÃO `locator.hover()` — isto foi medido e custou uma
     rodada: `locator.hover()` espera o elemento ficar ESTÁVEL antes de agir, e com a
     onda ligada (que é justamente o estado que precisa ser medido) o cartão nunca
     fica: 55 tentativas e `TimeoutError: element is not stable`. O ponteiro movido à
     mão não pede estabilidade. O centro é calculado uma vez, com a onda parada, e
     serve para as três leituras: a onda desloca ±7px num cartão de ~160px de altura,
     então o ponto continua dentro dele em qualquer quadro. */
  const alvoHover = page.locator('.contato-indicador').first();
  const centro = await alvoHover.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  const apontarParaOCartao = async () => {
    await page.mouse.move(5, 5);
    await page.mouse.move(centro.x, centro.y);
    await page.waitForTimeout(500);
  };
  const antesHover = await alvoHover.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      fundo: s.backgroundImage,
      corNumero: getComputedStyle(el.querySelector('.contato-indicador-valor span:not(.sr-only)')).color,
      corMais: getComputedStyle(el.querySelector('.contato-indicador-mais')).color,
      corRotulo: getComputedStyle(el.querySelector('.contato-indicador-rotulo')).color,
      escala: s.scale,
      sombra: s.boxShadow,
      largura: Number(el.getBoundingClientRect().width.toFixed(2)),
    };
  });
  await apontarParaOCartao();
  const duranteHover = await alvoHover.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      escala: s.scale,
      sombra: s.boxShadow,
      largura: Number(el.getBoundingClientRect().width.toFixed(2)),
      animacao: s.animationPlayState,
    };
  });
  /* ORDEM DAS TRÊS LEITURAS, e ela não é arbitrária: `reducedMotion: 'reduce'` está
     ligado desde o início desta viewport (a onda tem de estar parada para as
     larguras e fileiras serem lidas num quadro estável), então `duranteHover` acima
     é o ESPELHO 1 — o hover de quem pediu menos movimento. Para ler o hover VIVO a
     emulação é desligada abaixo; depois liga-se o ESPELHO 2 (`data-motion="reduce"`,
     o botão da interface) com o ponteiro ainda sobre o cartão; e no fim tudo volta
     ao estado em que o resto da sonda espera encontrar a página. */
  await page.emulateMedia({ reducedMotion: null });
  await apontarParaOCartao();
  const hoverComMovimento = await alvoHover.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      escala: s.scale,
      sombra: s.boxShadow,
      largura: Number(el.getBoundingClientRect().width.toFixed(2)),
    };
  });
  await page.evaluate(() => document.documentElement.setAttribute('data-motion', 'reduce'));
  await page.waitForTimeout(400);
  const hoverBotaoReduz = await alvoHover.evaluate((el) => {
    const s = getComputedStyle(el);
    return { escala: s.scale, sombra: s.boxShadow, largura: Number(el.getBoundingClientRect().width.toFixed(2)) };
  });
  await page.evaluate(() => document.documentElement.removeAttribute('data-motion'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.mouse.move(5, 5);
  await page.waitForTimeout(300);
  const hover = { repouso: antesHover, comMovimentoReduzido: duranteHover, comMovimento: hoverComMovimento, botaoDeMovimentoReduz: hoverBotaoReduz };

  /* ── CONTRASTE, pelo método da casa: tinta declarada + pior pixel de fundo ──
     Apaga-se a tinta do BLOCO inteiro (não só do alvo) para o fundo aparecer sem
     franja de antialiasing, e mede-se o retângulo do alvo com `page.screenshot`
     recortado — `locator.screenshot` rola a página e muda o fundo sob o texto. */
  /* SIS-256 (4ª volta) — O `+` ENTROU COMO TERCEIRO ALVO, e a falta dele era um
     buraco de verdade nesta sonda, não zelo extra: ele é a única tinta da faixa que
     NÃO é branca (ciano da marca), então é justamente a que muda de veredito quando
     a superfície muda — e a superfície mudou por pedido (`#1273bc`). Enquanto o
     cartão era navy quase preto, qualquer tinta clara passava com folga e a omissão
     não custava nada; sobre azul médio o ciano é o caso limítrofe.
     ⚠️ O ALVO 1 NÃO SERVIA PARA ISSO, e é fácil achar que servia: o seletor dele
     casa também com o `+` (o `+` é um `span` dentro de `.contato-indicador-valor` e
     não é `.sr-only`), mas quem lê é `querySelector`, que devolve o PRIMEIRO — o
     invólucro do `CountUp`. Ou seja, o ciano nunca foi medido aqui.
     Piso 3,0 porque o `+` herda o tipo do número (36px a 1440, muito acima dos 24px
     da isenção de texto grande). `aria-hidden` não o dispensa do piso: ele é texto
     VISÍVEL e quem lê com os olhos lê "850+". O `aria-hidden` existe só para o
     leitor de tela não dizer "850+ mais", porque o `.sr-only` do `CountUp` já
     anuncia o sufixo. */
  const alvos = [
    { nome: 'número (piso 3,0 · texto grande)', sel: '.contato-indicador-valor span:not(.sr-only)', piso: 3, arquivo: 'numero' },
    { nome: 'rótulo (piso 4,5 · texto pequeno)', sel: '.contato-indicador-rotulo', piso: 4.5, arquivo: 'rotulo' },
    { nome: '+ (piso 3,0 · texto grande)', sel: '.contato-indicador-mais', piso: 3, arquivo: 'mais' },
  ];
  const contraste = [];
  for (const alvo of alvos) {
    /* Reassentar ANTES DE CADA ALVO, e não uma vez no começo: a 1440 a faixa mede
       292px e cabe inteira na janela, então qualquer remedida da página a
       desloca sem que nada aqui peça — e o retângulo lido num quadro com a foto
       tirada de outro é exatamente o recorte escuro que já se pagou duas vezes
       nesta sonda. Reassentar custa milissegundos e fecha o buraco. */
    await assentar(page, '.contato-indicadores');
    const dados = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cor = getComputedStyle(el).color;
      const r = el.getBoundingClientRect();
      return { cor, caixa: { x: r.x, y: r.y, w: r.width, h: r.height } };
    }, alvo.sel);
    if (!dados) {
      contraste.push({ ...alvo, erro: 'alvo não encontrado' });
      continue;
    }
    const clip = {
      x: Math.max(0, Math.floor(dados.caixa.x)),
      y: Math.max(0, Math.floor(dados.caixa.y)),
      width: Math.max(1, Math.min(Math.ceil(dados.caixa.w), w - Math.floor(dados.caixa.x))),
      height: Math.max(1, Math.min(Math.ceil(dados.caixa.h), h - Math.floor(dados.caixa.y))),
    };
    const fotoTinta = await page.screenshot({ clip });
    /* O apagamento é ESTILO EM LINHA com `important`, e não uma folha injetada.
       Medido: com `addStyleTag` a tinta do número NÃO apagava — a regra da faixa
       (`.contato-indicadores.section-light .contato-indicador
       .contato-indicador-valor span:not(.contato-indicador-mais)`) soma (0,5,1) e
       também é `!important`, então entre dois `!important` quem decide é a
       especificidade e a folha da sonda perdia. O pior pixel "de fundo" saía
       rgb(7,38,66), que é o miolo do glifo, e o número vinha 1,06:1 — reprovação
       falsa. Declaração em linha com `important` não tem quem a vença. */
    await page.evaluate(() => {
      document.querySelectorAll('.contato-indicador, .contato-indicador *').forEach((el) => {
        el.style.setProperty('color', 'transparent', 'important');
        el.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
      });
    });
    await page.waitForTimeout(250);
    const fotoFundo = await page.screenshot({ clip });
    /* A foto de fundo vai para o disco: é a prova do número de contraste, e é o que
       permitiu ver que o recorte escuro era véu e não geometria. */
    mkdirSync('docs/capturas', { recursive: true });
    writeFileSync(
      /* SIS-256 (4ª volta) — nome EXPLÍCITO por alvo. Era
         `alvo.sel.includes('valor') ? 'numero' : 'rotulo'`, que com o terceiro alvo
         passaria a gravar o `+` sobre a foto do rótulo (o seletor dele não contém
         "valor"), isto é: duas medições e uma prova só, a errada. */
      `docs/capturas/sis256-${FASE}-${w}-fundo-${alvo.arquivo}.png`,
      fotoFundo,
    );

    const px = async (buf) => {
      const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      return { data, info };
    };
    const tinta = lerTinta(dados.cor);
    const { data: dFundo, info } = await px(fotoFundo);
    const { data: dTinta } = await px(fotoTinta);
    let piorCalculada = Infinity;
    let piorRaster = Infinity;
    let pixelFundo = null;
    let pixeisDeGlifo = 0;
    for (let i = 0; i < dFundo.length; i += info.channels) {
      const fundo = { r: dFundo[i], g: dFundo[i + 1], b: dFundo[i + 2] };
      const c = razao(compor(tinta, fundo), fundo);
      if (c < piorCalculada) {
        piorCalculada = c;
        pixelFundo = fundo;
      }
      /* O raster só faz sentido SOBRE O GLIFO. Tomar o mínimo de todos os pixels
         do retângulo daria 1,00 sempre, porque a maior parte dele é fundo puro e
         ali as duas fotos são idênticas. Um pixel é de glifo quando as duas fotos
         diferem — e o limiar de 8 por canal é relativo, não absoluto: ele separa
         glifo de ruído de compressão sem cortar a franja de antialiasing, que é
         justamente o que faz o raster subestimar texto pequeno. */
      const tintaPx = { r: dTinta[i], g: dTinta[i + 1], b: dTinta[i + 2] };
      const diferente =
        Math.abs(tintaPx.r - fundo.r) > 8 ||
        Math.abs(tintaPx.g - fundo.g) > 8 ||
        Math.abs(tintaPx.b - fundo.b) > 8;
      if (diferente) {
        pixeisDeGlifo += 1;
        const r = razao(tintaPx, fundo);
        if (r < piorRaster) piorRaster = r;
      }
    }
    if (!Number.isFinite(piorRaster)) piorRaster = 0;
    contraste.push({
      alvo: alvo.nome,
      piso: alvo.piso,
      tintaDeclarada: dados.cor,
      piorPixelDeFundo: `rgb(${pixelFundo.r},${pixelFundo.g},${pixelFundo.b})`,
      pixeisDeGlifo,
      raster: Number(piorRaster.toFixed(2)),
      calculada: Number(piorCalculada.toFixed(2)),
      delta: Number((piorCalculada - piorRaster).toFixed(2)),
      passa: piorCalculada >= alvo.piso,
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await liberarRota(page);
    await page.addStyleTag({
      content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button]{display:none!important}
        header.fixed{display:none!important}`,
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await assentar(page, '.contato-indicadores');
    await page.waitForTimeout(700);
  }

  mkdirSync('docs/capturas', { recursive: true });
  const caixa = await page.evaluate(() => {
    const s = document.querySelector('.contato-indicadores').getBoundingClientRect();
    return { x: Math.max(0, s.x), y: Math.max(0, s.y), width: s.width, height: s.height };
  });
  await page.screenshot({
    path: `docs/capturas/sis256-${FASE}-${w}.png`,
    clip: {
      x: Math.floor(caixa.x),
      y: Math.max(0, Math.floor(caixa.y)),
      width: Math.min(Math.ceil(caixa.width), w),
      height: Math.min(Math.ceil(caixa.height), h - Math.max(0, Math.floor(caixa.y))),
    },
  });

  relatorio.viewports[`${w}x${h}`] = { ...geo, hover, contraste };
  await ctx.close();
}

/* ══════════════════════════════════════════════════════════════════════════════
   3ª VOLTA · A CONTAGEM SÓ COMEÇA COM A PÁGINA CARREGADA
   ══════════════════════════════════════════════════════════════════════════════
   Pedido: «os numeros so devem fazer a contagem quando terminar de carregar a
   pagina». Isto é um evento no TEMPO, e nem foto nem valor computado o pegam — o
   estado final é idêntico nos dois casos (o número no valor certo, parado). O que
   distingue é QUANDO os dígitos intermediários apareceram.

   Por isso a leitura é um amostrador instalado ANTES de a página existir
   (`addInitScript`), que a cada 40ms grava o texto do número junto com o estado do
   portão de rota naquele instante. 40ms numa contagem de 1,4s dão ~35 amostras —
   folga suficiente para pegar dígitos do meio, e é a existência deles que prova a
   contagem. O veredito sai de duas perguntas sobre as amostras:
     · com o véu AINDA de pé (`data-route-liberado="false"`), apareceu algum valor
       diferente do final? Se sim, a contagem correu escondida — é o defeito.
     · depois de liberado, apareceram valores intermediários? Se não, a contagem
       não aconteceu nunca, o que também reprova (o número tem de contar).

   Contexto NOVO de propósito: as páginas do laço acima já carregaram e recarregaram
   várias vezes, e o instante que interessa aqui é o da PRIMEIRA carga.
   Movimento reduzido fica DESLIGADO nesta parte, e é obrigatório: sob movimento
   reduzido o número aparece pronto por decisão de acessibilidade (está escrito em
   `CountUp.tsx`), então a emulação usada no resto da sonda esconderia justamente o
   que se quer medir. */
const ctxContagem = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
await ctxContagem.addInitScript(() => {
  localStorage.setItem('sistran-motion-preference-seen', '1');
  localStorage.setItem('sistran-motion-preference', 'system');
  window.__amostras = [];
  window.setInterval(() => {
    const el = document.querySelector('.contato-indicador-valor span[aria-hidden="true"]');
    if (!el) return;
    const portao = document.querySelector('[data-route-liberado]');
    window.__amostras.push({
      t: Math.round(performance.now()),
      valor: (el.textContent ?? '').trim(),
      liberado: portao ? portao.getAttribute('data-route-liberado') : 'sem-portao',
      documento: document.readyState,
    });
  }, 40);
});
const pageContagem = await ctxContagem.newPage();
await pageContagem.goto(`${BASE}/contato`, { waitUntil: 'commit', timeout: 180_000 });
await pageContagem.waitForSelector('[data-route-liberado="true"]', { timeout: 180_000 });
/* Depois de liberar, dar à contagem mais que a duração dela (1,4s) para terminar. */
await pageContagem.waitForTimeout(3000);
const amostras = await pageContagem.evaluate(() => window.__amostras);
const finalEsperado = await pageContagem.evaluate(() => {
  const el = document.querySelector('.contato-indicador-valor span[aria-hidden="true"]');
  return (el?.textContent ?? '').trim();
});
const antesDeLiberar = amostras.filter((a) => a.liberado === 'false');
const depoisDeLiberar = amostras.filter((a) => a.liberado === 'true');
const contagem = {
  finalEsperado,
  amostras: amostras.length,
  amostrasAntesDeLiberar: antesDeLiberar.length,
  /* O único valor tolerado antes de liberar é o FINAL: é ele que o servidor manda
     no HTML, e é ele que fica na tela enquanto se espera. */
  valoresAntesDeLiberar: [...new Set(antesDeLiberar.map((a) => a.valor))],
  valoresDepoisDeLiberar: [...new Set(depoisDeLiberar.map((a) => a.valor))],
  contouAntesDeLiberar: antesDeLiberar.some((a) => a.valor !== finalEsperado),
  contouDepoisDeLiberar:
    new Set(depoisDeLiberar.map((a) => a.valor)).size > 1 &&
    depoisDeLiberar.some((a) => a.valor !== finalEsperado),
  primeiraAmostraDepois: depoisDeLiberar[0] ?? null,
};
contagem.passa = contagem.contouAntesDeLiberar === false && contagem.contouDepoisDeLiberar === true;
relatorio.contagem = contagem;
await ctxContagem.close();

await navegador.close();
mkdirSync('docs/medidas', { recursive: true });
writeFileSync(`docs/medidas/indicadores-sis256-${FASE}.json`, JSON.stringify(relatorio, null, 2));
console.log(JSON.stringify(relatorio, null, 2));
