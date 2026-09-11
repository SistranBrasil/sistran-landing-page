/* SIS-237 — sonda dos 12 cartões escuros de /esg (ENVIRONMENT + GOVERNANCE):
   flutuação, hover e legibilidade.

   Uso: com um `npm run dev -- -p 3999` de pé,
   `ROTULO=antes node docs/medidas/sis237/auditar.mjs`
   (e depois `ROTULO=depois ...` para o par).

   O QUE ESTA SONDA MEDE E POR QUÊ CADA NÚMERO EXISTE

   1 · FLUTUAÇÃO — amplitude E velocidade. Amplitude sozinha não decide se o
       movimento é visível: `translateY` de ±6px numa ida de 6s percorre 12px em
       6s, e é a VELOCIDADE (px/s) que diz se a vista pega o deslocamento. Por
       isso a sonda amostra `m42` da matriz computada quadro a quadro por um ciclo
       inteiro e publica pico-a-pico, velocidade média da travessia e pico
       instantâneo entre quadros. O pico é lido do próprio raster do compositor,
       não calculado da curva.

   2 · DEFASAGEM — `m42` dos seis num mesmo instante. Se os seis andarem juntos,
       o conjunto lê como a página inteira tremendo; defasados, lê como onda.

   3 · FOLGA VERTICAL — menor distância entre a base de um cartão e o topo do
       vizinho de baixo ao longo de um ciclo. É o TETO da amplitude: a grade é
       `gap-4` (16px), então dois vizinhos em oposição de fase fecham o vão em
       2A·sen(Δφ/2) e podem se sobrepor. Número medido do `getBoundingClientRect`,
       que já inclui o `transform`.

   4 · HOVER — o deslocamento do FILHO (`.esg-superficie`), não do wrapper. É a
       separação de nós da SIS-208: o wrapper flutua e PAUSA no hover
       (`animation-play-state`), o filho é quem recebe o `translateY` do hover.
       Medir o retângulo absoluto misturaria o quadro em que a flutuação congelou
       com o levantamento — e é justamente por isso que o levantamento precisa ser
       maior que a amplitude da flutuação para ser percebido: o cartão pausa num
       quadro qualquer, e o que a vista registra é o salto A PARTIR dali.

   5 · COR DO HOVER — do RASTER, não do CSS. Amostra a mediana de uma faixa da
       superfície do cartão sem texto e sem disco, com e sem ponteiro, e publica a
       distância euclidiana em RGB. É o que separa "mudou no CSS" de "mudou à
       vista".

   6 · CONTRASTE — `docs/medidas/COMO-MEDIR-CONTRASTE.md`: tinta apagada com
       `color`/`-webkit-text-fill-color: transparent` (nunca `visibility`),
       retângulo dos GLIFOS via `Range`, PIOR pixel do recorte, alfa composto
       antes do cálculo, `header.fixed` e avisos do `next dev` escondidos. Sonda de
       FUNDO (todo pixel varrido é fundo, a tinta não está pintada), então o par
       raster/cálculo do §7 não se aplica — como em `medir-contraste-escritorios.mjs`.
       Mede nos dois estados, porque o banho azul do hover clareia a superfície e
       é ali que o piso pode cair.

   7 · MOVIMENTO REDUZIDO nos DOIS canais (media query e `html[data-motion]`):
       wrapper parado no eixo E o salto do hover naquele estado — reduzir movimento
       não é só parar o que anda sozinho.
*/
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:3999/esg';
const ROTULO = process.env.ROTULO ?? 'antes';
const pasta = new URL('./', import.meta.url);
const arq = (nome) => fileURLToPath(new URL(nome, pasta));

const SECOES = [
  { nome: 'ENVIRONMENT', secao: 'section[aria-labelledby="esg-environment"]', texto: 'p' },
  { nome: 'GOVERNANCE', secao: 'section[aria-labelledby="esg-governance"]', texto: 'dd' },
];
const num = (v) => Number(Number(v).toFixed(2));

/* --- contraste: as três funções do método, sem invenção nenhuma --- */
const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const compor = (fg, a, bg) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));

const navegador = await chromium.launch();
await mkdir(pasta, { recursive: true });

async function abrir({ width = 1440, height = 900, reducedMotion = 'no-preference' } = {}) {
  const contexto = await navegador.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion,
  });
  await contexto.addInitScript(() => {
    sessionStorage.setItem('sistran:intro-visto', '1');
    localStorage.setItem('sistran-motion-preference', 'system');
    localStorage.setItem('sistran-motion-preference-seen', '1');
  });
  const pagina = await contexto.newPage();
  await pagina.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 120_000 });
  /* Avisos do `next dev` e cabeçalho fixo saem: os dois entram no recorte e o
     azul do cabeçalho vence qualquer varredura de pior pixel (método §5). */
  await pagina.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-tools-button],
      [class*=motion-banner],[class*=motion-dialog]{display:none!important}
      header.fixed{display:none!important}`,
  });
  await pagina.locator('.esg-cartao-flutua').first().waitFor({ state: 'visible' });
  await pagina.waitForTimeout(600);
  return { contexto, pagina };
}

/* O alvo anima sem parar, então a actionability do Playwright nunca o considera
   estável: rolagem e ponteiro usam caixa instantânea de propósito. */
async function rolarAte(pagina, seletor) {
  await pagina.locator(seletor).first().evaluate((el) => {
    window.__lenis?.stop();
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
  });
  await pagina.waitForTimeout(400);
}

/** Amostra `m42` (translateY da matriz computada) de todos os wrappers, quadro a
 *  quadro, por `ms`. Feito dentro da página para não perder quadro no protocolo. */
const amostrarMovimento = (pagina, seletor, ms) =>
  pagina.evaluate(
    ([sel, dur]) =>
      new Promise((resolve) => {
        const els = [...document.querySelectorAll(sel)];
        const trilhas = els.map(() => []);
        const t0 = performance.now();
        const passo = (t) => {
          els.forEach((el, i) => {
            const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
            trilhas[i].push([Number((t - t0).toFixed(1)), Number(m.m42.toFixed(3))]);
          });
          if (t - t0 < dur) requestAnimationFrame(passo);
          else resolve(trilhas);
        };
        requestAnimationFrame(passo);
      }),
    [seletor, ms],
  );

/** Menor folga vertical entre cartões vizinhos ao longo de `ms`. */
const amostrarFolga = (pagina, seletor, ms) =>
  pagina.evaluate(
    ([sel, dur]) =>
      new Promise((resolve) => {
        const els = [...document.querySelectorAll(sel)];
        let pior = Infinity;
        let par = null;
        const t0 = performance.now();
        const passo = (t) => {
          const caixas = els.map((el) => el.getBoundingClientRect());
          for (let a = 0; a < caixas.length; a += 1) {
            for (let b = 0; b < caixas.length; b += 1) {
              if (a === b) continue;
              /* Só vizinhos que compartilham faixa horizontal: cartões de colunas
                 diferentes não disputam vão vertical nenhum. */
              const cruzaX =
                caixas[a].left < caixas[b].right - 4 && caixas[a].right > caixas[b].left + 4;
              if (!cruzaX) continue;
              const folga = caixas[b].top - caixas[a].bottom;
              if (folga >= -50 && folga < pior) {
                pior = folga;
                par = [a, b];
              }
            }
          }
          if (t - t0 < dur) requestAnimationFrame(passo);
          else resolve({ folgaMinima: Number(pior.toFixed(2)), par });
        };
        requestAnimationFrame(passo);
      }),
    [seletor, ms],
  );

const lerEstado = (pagina, seletor) =>
  pagina.locator(seletor).evaluateAll((els) =>
    els.map((el) => {
      const c = getComputedStyle(el);
      const filho = el.querySelector('.esg-superficie');
      const f = getComputedStyle(filho);
      const mf = new DOMMatrixReadOnly(f.transform);
      return {
        wrapper: {
          animationName: c.animationName,
          animationDuration: c.animationDuration,
          animationDelay: c.animationDelay,
          animationPlayState: c.animationPlayState,
          animationDirection: c.animationDirection,
          transform: c.transform,
        },
        filho: {
          transform: f.transform,
          translateY: Number(mf.m42.toFixed(2)),
          escala: Number(mf.m11.toFixed(4)),
          borderColor: f.borderTopColor,
          boxShadow: f.boxShadow,
          transitionDuration: f.transitionDuration,
        },
      };
    }),
  );

/** Mediana RGB de um recorte do raster. */
async function medianaDoRaster(pagina, caixa) {
  const buf = await pagina.screenshot({ clip: caixa });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const canais = [[], [], []];
  for (let p = 0; p < info.width * info.height; p += 1) {
    for (let ch = 0; ch < 3; ch += 1) canais[ch].push(data[p * info.channels + ch]);
  }
  return canais.map((v) => v.sort((a, b) => a - b)[Math.floor(v.length / 2)]);
}

/** Mediana RGB de uma faixa da superfície do cartão, do raster. A faixa é o
 *  trecho entre o fim do disco e o começo do texto — sem tinta e sem arte. */
async function corDaSuperficie(pagina, seletorCartao, indice) {
  const caixa = await pagina.locator(seletorCartao).nth(indice).evaluate((el) => {
    const cartao = el.getBoundingClientRect();
    const disco = el.querySelector('.esg-cartao-retrato')?.getBoundingClientRect();
    const y = disco ? disco.bottom + 4 : cartao.top + 8;
    return {
      x: Math.round(cartao.left + cartao.width * 0.12),
      y: Math.round(y),
      width: Math.round(cartao.width * 0.2),
      height: 10,
    };
  });
  return medianaDoRaster(pagina, caixa);
}

/** O cartão LÊ como cartão? Mede a superfície do cartão contra a faixa azul da
 *  seção ao lado dele, das duas medianas do raster. É o número do item 1 do
 *  pedido ("ficar claros"): cartão e faixa perto demais em tom fazem os seis
 *  sumirem no fundo, e nenhuma flutuação salva um objeto que não se distingue do
 *  que está atrás. Sem tinta e sem arte nos dois recortes. */
async function separacaoDaFaixa(pagina, seletorCartao) {
  const caixas = await pagina.locator(seletorCartao).first().evaluate((el) => {
    const cartao = el.querySelector('.esg-superficie').getBoundingClientRect();
    const disco = el.querySelector('.esg-cartao-retrato')?.getBoundingClientRect();
    const y = Math.round(disco ? disco.bottom + 4 : cartao.top + 8);
    return {
      dentro: {
        x: Math.round(cartao.left + cartao.width * 0.12),
        y,
        width: Math.round(cartao.width * 0.2),
        height: 10,
      },
      /* Faixa da seção à ESQUERDA do cartão, fora da pluma (`inset: -18px`) para
         não medir a sombra do próprio cartão. */
      fora: { x: Math.round(cartao.left - 46), y, width: 22, height: 10 },
    };
  });
  const dentro = await medianaDoRaster(pagina, caixas.dentro);
  const fora = await medianaDoRaster(pagina, caixas.fora);
  return {
    superficieCartao: `rgb(${dentro.join(',')})`,
    faixaDaSecao: `rgb(${fora.join(',')})`,
    razao: num(razao(dentro, fora)),
    distanciaRgb: num(Math.hypot(...dentro.map((c, i) => c - fora[i]))),
  };
}

/** Luminância mediana do disco de arte: guarda de que a superfície mais densa
 *  não escureceu a ilustração (critério "texto e arte legíveis"). */
async function luzDoDisco(pagina, seletorCartao) {
  const caixa = await pagina.locator(seletorCartao).first().evaluate((el) => {
    const d = el.querySelector('.esg-cartao-retrato').getBoundingClientRect();
    return {
      x: Math.round(d.left + d.width * 0.3),
      y: Math.round(d.top + d.height * 0.3),
      width: Math.round(d.width * 0.4),
      height: Math.round(d.height * 0.4),
    };
  });
  const cor = await medianaDoRaster(pagina, caixa);
  return { cor: `rgb(${cor.join(',')})`, luminancia: num(lum(cor)) };
}

/** Folga vertical com o ponteiro POUSADO num cartão da segunda fileira: o
 *  levantamento do hover soma-se ao quadro em que a flutuação do vizinho de cima
 *  estiver, e é aqui que uma sobreposição apareceria. */
/** Com o ponteiro no cartão `indice`, a menor distância entre o topo dele e a
 *  ÚLTIMA LINHA DE TEXTO do cartão de cima (índice − 3, o vizinho de coluna em
 *  `lg:grid-cols-3`). É a prova da afirmação escrita no CSS: o cruzamento do
 *  levantamento cai sobre o `p-7` do vizinho, nunca sobre a escrita dele. */
async function invasaoDaEscrita(pagina, cfg, indice, ms) {
  const sel = `${cfg.secao} .esg-superficie`;
  const centro = await pagina.locator(sel).nth(indice).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await pagina.mouse.move(centro.x, centro.y);
  await pagina.waitForTimeout(700);
  const medida = await pagina.evaluate(
    ([seletor, i, seletorTexto, dur]) =>
      new Promise((resolve) => {
        const cartoes = [...document.querySelectorAll(seletor)];
        const erguido = cartoes[i];
        const acima = cartoes[i - 3];
        const texto = acima.querySelector(seletorTexto);
        let pior = Infinity;
        const t0 = performance.now();
        const passo = (t) => {
          const d = erguido.getBoundingClientRect().top - texto.getBoundingClientRect().bottom;
          if (d < pior) pior = d;
          if (t - t0 < dur) requestAnimationFrame(passo);
          else resolve(Number(pior.toFixed(2)));
        };
        requestAnimationFrame(passo);
      }),
    [sel, indice, cfg.texto, ms],
  );
  await pagina.mouse.move(5, 5);
  await pagina.waitForTimeout(300);
  return { cartaoApontado: indice, vizinhoDeCima: indice - 3, folgaAteOTextoPx: medida };
}

async function folgaComHover(pagina, seletor, indice, ms) {
  const centro = await pagina.locator(seletor).nth(indice).evaluate((el) => {
    const cartao = el.matches('.esg-superficie') ? el : el.querySelector('.esg-superficie');
    const r = cartao.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await pagina.mouse.move(centro.x, centro.y);
  await pagina.waitForTimeout(700);
  const folga = await amostrarFolga(pagina, seletor, ms);
  await pagina.mouse.move(5, 5);
  await pagina.waitForTimeout(300);
  return { cartaoApontado: indice, ...folga };
}

/** Pior (mais claro) pixel de fundo sob os glifos, com a tinta apagada. */
async function contraste(pagina, cfg, comHover) {
  const sel = `${cfg.secao} .esg-cartao-flutua`;
  /* Congela a flutuação só para esta passagem: o retângulo é lido antes da
     captura e um cartão em movimento sai do lugar entre as duas. Posição não
     muda cor de superfície nenhuma — os gradientes são relativos ao cartão. */
  const congelar = await pagina.addStyleTag({
    content: '.esg-cartao-flutua{animation:none!important;transform:none!important}',
  });
  const apagar = await pagina.addStyleTag({
    content: `${cfg.secao} .esg-superficie ${cfg.texto},
      ${cfg.secao} .esg-superficie dt span
      {color:transparent!important;-webkit-text-fill-color:transparent!important}`,
  });
  await pagina.waitForTimeout(200);

  const alvos = [];
  const total = await pagina.locator(sel).count();
  for (let i = 0; i < total; i += 1) {
    const cartao = pagina.locator(sel).nth(i);
    await cartao.evaluate((el) => {
      window.__lenis?.stop();
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
    });
    await pagina.waitForTimeout(250);
    if (comHover) {
      const centro = await cartao.evaluate((el) => {
        const r = el.querySelector('.esg-superficie').getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      await pagina.mouse.move(centro.x, centro.y);
      await pagina.waitForTimeout(600);
    } else {
      await pagina.mouse.move(5, 5);
      await pagina.waitForTimeout(200);
    }
    /* Retângulo dos GLIFOS, não do elemento (método §1 e nota 1 da
       `medir-contraste-escritorios`): a caixa do `<p>` tem padding e centralização,
       e o vão lateral dela cai sobre a borda do cartão. */
    const dados = await cartao.evaluate(
      (el, seletorTexto) => {
        const alvo = el.querySelector(seletorTexto);
        const faixa = document.createRange();
        faixa.selectNodeContents(alvo);
        const rs = [...faixa.getClientRects()];
        if (!rs.length) return null;
        const caixa = {
          left: Math.min(...rs.map((r) => r.left)),
          right: Math.max(...rs.map((r) => r.right)),
          top: Math.min(...rs.map((r) => r.top)),
          bottom: Math.max(...rs.map((r) => r.bottom)),
        };
        const c = getComputedStyle(alvo);
        const tam = Number.parseFloat(c.fontSize);
        return {
          caixa: {
            x: Math.round(caixa.left),
            y: Math.round(caixa.top),
            width: Math.max(2, Math.round(caixa.right - caixa.left)),
            height: Math.max(2, Math.round(caixa.bottom - caixa.top)),
          },
          fontSize: tam,
          /* A tinta VEM DO CSS DE PRODUÇÃO, não do estado apagado: a folha que
             apaga é da sonda. `text-white/85` é `rgb(255 255 255 / 0.85)`. */
          tinta: [255, 255, 255],
          alfa: 0.85,
        };
      },
      cfg.texto,
    );
    if (!dados) continue;

    /* Três quadros, pior pixel entre eles (método §3 e §6). */
    let pior = null;
    for (let q = 0; q < 3; q += 1) {
      const buf = await pagina.screenshot({ clip: dados.caixa });
      const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
      for (let p = 0; p < info.width * info.height; p += 1) {
        const px = [0, 1, 2].map((ch) => data[p * info.channels + ch]);
        if (!pior || lum(px) > lum(pior)) pior = px;
      }
      await pagina.waitForTimeout(90);
    }
    const composta = compor(dados.tinta, dados.alfa, pior);
    alvos.push({
      cartao: i,
      fontSize: num(dados.fontSize),
      piorFundo: `rgb(${pior.join(',')})`,
      tintaComposta: `rgb(${composta.join(',')})`,
      razao: num(razao(composta, pior)),
      piso: dados.fontSize >= 24 ? 3 : 4.5,
    });
  }
  await congelar.evaluate((n) => n.remove());
  await apagar.evaluate((n) => n.remove());
  return alvos;
}

async function medirSecao(pagina, cfg) {
  const sel = `${cfg.secao} .esg-cartao-flutua`;
  /* O RETÂNGULO DA FOLGA SAI DO FILHO, não do wrapper: `getBoundingClientRect`
     do filho já carrega o `transform` do ancestral E o levantamento do hover, que
     mora no filho. Medir o wrapper daria folga cega ao hover. */
  const selVisivel = `${cfg.secao} .esg-superficie`;
  await rolarAte(pagina, sel);
  /* Ponteiro para o canto ANTES de amostrar. Na primeira rodada o ponteiro ficou
     onde a captura da seção anterior o deixou, caiu sobre um cartão de GOVERNANCE
     depois da rolagem e pausou a animação dele: o cartão 0 saiu com pico-a-pico
     0px, defeito da sonda lido como cartão parado. */
  await pagina.mouse.move(5, 5);
  await pagina.waitForTimeout(300);

  const estadoIdle = await lerEstado(pagina, sel);
  const duracao = Number.parseFloat(estadoIdle[0].wrapper.animationDuration) * 1000;
  const trilhas = await amostrarMovimento(pagina, sel, duracao * 2 + 300);
  const folga = await amostrarFolga(pagina, selVisivel, duracao * 2 + 300);
  const separacao = await separacaoDaFaixa(pagina, sel);
  const disco = await luzDoDisco(pagina, sel);
  /* Cartão 3 é o primeiro da segunda fileira em `lg:grid-cols-3`: é ele que
     levanta na direção do vizinho de cima. */
  const folgaHover = await folgaComHover(pagina, selVisivel, 3, duracao * 2 + 300);
  const invasao = await invasaoDaEscrita(pagina, cfg, 3, duracao * 2 + 300);

  const movimento = trilhas.map((trilha, i) => {
    const ys = trilha.map(([, y]) => y);
    const minimo = Math.min(...ys);
    const maximo = Math.max(...ys);
    let picoPorSegundo = 0;
    for (let k = 1; k < trilha.length; k += 1) {
      const dt = (trilha[k][0] - trilha[k - 1][0]) / 1000;
      if (dt <= 0) continue;
      picoPorSegundo = Math.max(picoPorSegundo, Math.abs(trilha[k][1] - trilha[k - 1][1]) / dt);
    }
    return {
      cartao: i,
      atraso: estadoIdle[i].wrapper.animationDelay,
      picoAPico: num(maximo - minimo),
      minimo: num(minimo),
      maximo: num(maximo),
      velocidadeMediaTravessia: num((maximo - minimo) / (duracao / 1000)),
      velocidadePicoMedida: num(picoPorSegundo),
      quadros: trilha.length,
    };
  });

  const instante = trilhas.map((t) => t[0][1]);
  const atrasos = estadoIdle.map((e) => e.wrapper.animationDelay);
  const defasagem = {
    /* A DEFASAGEM É PROPRIEDADE DOS ATRASOS, não de um instante. Com `alternate`
       a curva é simétrica, então dois cartões de fases diferentes se CRUZAM na
       mesma altura algumas vezes por ciclo, indo em sentidos opostos — a primeira
       versão desta sonda chamava isso de "fases iguais" e acusava um falso
       alinhamento dependendo do quadro em que a amostragem caísse. O instante
       continua publicado, mas como evidência de que os seis não andam juntos
       (espalhamento > 0), não como teste de unicidade. */
    atrasos,
    atrasosDistintos: new Set(atrasos).size === atrasos.length,
    translateYNoMesmoInstante: instante.map(num),
    espalhamento: num(Math.max(...instante) - Math.min(...instante)),
  };

  /* HOVER no primeiro cartão: cor do raster antes, ponteiro, cor do raster
     depois, e o transform do FILHO nos dois momentos. */
  const seletorCartao = `${sel}`;
  await pagina.mouse.move(5, 5);
  await pagina.waitForTimeout(300);
  const corIdle = await corDaSuperficie(pagina, seletorCartao, 0);
  const filhoIdle = (await lerEstado(pagina, sel))[0].filho;

  const centro = await pagina.locator(sel).nth(0).evaluate((el) => {
    const r = el.querySelector('.esg-superficie').getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await pagina.mouse.move(centro.x, centro.y);
  await pagina.waitForTimeout(700);
  const corHover = await corDaSuperficie(pagina, seletorCartao, 0);
  const estadoHover = (await lerEstado(pagina, sel))[0];
  await pagina.mouse.move(5, 5);
  await pagina.waitForTimeout(300);

  const distancia = Math.hypot(...corIdle.map((c, i) => c - corHover[i]));
  const hover = {
    wrapperPausado: estadoHover.wrapper.animationPlayState,
    levantamentoPx: num(estadoHover.filho.translateY - filhoIdle.translateY),
    escalaIdle: filhoIdle.escala,
    escalaHover: estadoHover.filho.escala,
    bordaIdle: filhoIdle.borderColor,
    bordaHover: estadoHover.filho.borderColor,
    razaoBorda: num(
      razao(
        filhoIdle.borderColor.match(/[\d.]+/g).slice(0, 3).map(Number),
        estadoHover.filho.borderColor.match(/[\d.]+/g).slice(0, 3).map(Number),
      ),
    ),
    sombraIdle: filhoIdle.boxShadow,
    sombraHover: estadoHover.filho.boxShadow,
    transicao: filhoIdle.transitionDuration,
    corSuperficieIdle: `rgb(${corIdle.join(',')})`,
    corSuperficieHover: `rgb(${corHover.join(',')})`,
    distanciaRgbMedida: num(distancia),
    deltaPorCanal: corHover.map((c, i) => c - corIdle[i]),
  };

  return {
    secao: cfg.nome,
    cartoes: trilhas.length,
    animacao: {
      nome: estadoIdle[0].wrapper.animationName,
      duracao: estadoIdle[0].wrapper.animationDuration,
      direcao: estadoIdle[0].wrapper.animationDirection,
      playState: estadoIdle[0].wrapper.animationPlayState,
    },
    movimento,
    defasagem,
    folgaVertical: folga,
    folgaVerticalComHover: folgaHover,
    escritaDoVizinhoComHover: invasao,
    separacaoDoFundo: separacao,
    arte: disco,
    hover,
    contrasteIdle: await contraste(pagina, cfg, false),
    contrasteHover: await contraste(pagina, cfg, true),
  };
}

async function capturar(pagina, cfg, comHover, indice = 0) {
  const sel = `${cfg.secao} .esg-cartao-flutua`;
  await rolarAte(pagina, sel);
  if (comHover) {
    const centro = await pagina.locator(sel).nth(indice).evaluate((el) => {
      const r = el.querySelector('.esg-superficie').getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    await pagina.mouse.move(centro.x, centro.y);
    await pagina.waitForTimeout(700);
  } else {
    await pagina.mouse.move(5, 5);
    await pagina.waitForTimeout(300);
  }
  const sufixo = comHover ? `-hover${indice ? `-cartao${indice}` : ''}` : '';
  await pagina.screenshot({
    path: arq(`${ROTULO}-${cfg.nome.toLowerCase()}-1440${sufixo}.png`),
  });
}

async function medirReduzido(canal) {
  const { contexto, pagina } = await abrir({
    reducedMotion: canal === 'media-query' ? 'reduce' : 'no-preference',
  });
  if (canal === 'data-motion') {
    await pagina.evaluate(() => {
      document.documentElement.dataset.motion = 'reduce';
    });
  }
  await pagina.waitForTimeout(300);
  const saida = {};
  for (const cfg of SECOES) {
    const sel = `${cfg.secao} .esg-cartao-flutua`;
    await rolarAte(pagina, sel);
    const idle = await lerEstado(pagina, sel);
    const centro = await pagina.locator(sel).nth(0).evaluate((el) => {
      const r = el.querySelector('.esg-superficie').getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    await pagina.mouse.move(centro.x, centro.y);
    await pagina.waitForTimeout(600);
    const hover = (await lerEstado(pagina, sel))[0];
    await pagina.mouse.move(5, 5);
    saida[cfg.nome] = {
      wrapperParado: idle.every(
        (e) => e.wrapper.animationName === 'none' && e.wrapper.transform === 'none',
      ),
      animationName: idle[0].wrapper.animationName,
      transformWrapper: idle[0].wrapper.transform,
      /* Deslocamento do wrapper ao longo de meio segundo: prova que está imóvel
         de fato, não só que a declaração diz `none`. */
      saltoHoverPx: num(hover.filho.translateY - idle[0].filho.translateY),
      escalaHover: hover.filho.escala,
      bordaMudouNoHover: hover.filho.borderColor !== idle[0].filho.borderColor,
      sombraMudouNoHover: hover.filho.boxShadow !== idle[0].filho.boxShadow,
    };
  }
  if (canal === 'media-query') {
    await rolarAte(pagina, `${SECOES[0].secao} .esg-cartao-flutua`);
    await pagina.screenshot({ path: arq(`${ROTULO}-environment-1440-reduce.png`) });
  }
  await contexto.close();
  return saida;
}

const { contexto, pagina } = await abrir();
const resultado = {
  rotulo: ROTULO,
  quando: new Date().toISOString(),
  url: BASE,
  viewport: '1440x900',
  motionGlobal: await pagina.evaluate(() => ({
    dataMotion: document.documentElement.dataset.motion ?? null,
    prefereReduzir: matchMedia('(prefers-reduced-motion: reduce)').matches,
    animacoesNaPagina: document.getAnimations().length,
  })),
  secoes: [],
  reduzido: {},
};
for (const cfg of SECOES) {
  resultado.secoes.push(await medirSecao(pagina, cfg));
  await capturar(pagina, cfg, false);
  await capturar(pagina, cfg, true);
  /* Cartão 3 — o que levanta CONTRA o vizinho de cima. A captura existe para a
     folga negativa medida em `folgaVerticalComHover` poder ser julgada à vista:
     o cruzamento cai sobre o respiro do vizinho, e o `z-index: 2` põe o cartão
     erguido na frente. */
  await capturar(pagina, cfg, true, 3);
}
/* Mobile só como conferência de que a mesma regra não estoura a coluna estreita. */
await contexto.close();
{
  const m = await abrir({ width: 390, height: 844 });
  await rolarAte(m.pagina, `${SECOES[0].secao} .esg-cartao-flutua`);
  resultado.mobile390 = {
    folgaVertical: await amostrarFolga(m.pagina, `${SECOES[0].secao} .esg-superficie`, 6500),
    semRolagemLateral: await m.pagina.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  };
  await m.pagina.screenshot({ path: arq(`${ROTULO}-environment-390.png`) });
  await m.contexto.close();
}
resultado.reduzido['media-query'] = await medirReduzido('media-query');
resultado.reduzido['data-motion'] = await medirReduzido('data-motion');

await writeFile(arq(`resultado-${ROTULO}.json`), `${JSON.stringify(resultado, null, 2)}\n`);
await navegador.close();

for (const s of resultado.secoes) {
  const pp = s.movimento.map((m) => m.picoAPico);
  const vm = s.movimento.map((m) => m.velocidadeMediaTravessia);
  console.log(`\n=== ${s.secao} · ${s.cartoes} cartões · ${s.animacao.duracao} ===`);
  console.log(
    `flutuação pico-a-pico ${Math.min(...pp)}–${Math.max(...pp)}px · ` +
      `velocidade média ${Math.min(...vm)}–${Math.max(...vm)}px/s · ` +
      `pico medido ${Math.max(...s.movimento.map((m) => m.velocidadePicoMedida))}px/s`,
  );
  console.log(
    `defasagem: atrasos ${s.defasagem.atrasos.join(' ')} · distintos ` +
      `${s.defasagem.atrasosDistintos} · espalhamento num instante ${s.defasagem.espalhamento}px`,
  );
  console.log(
    `folga vertical mínima ${s.folgaVertical.folgaMinima}px · ` +
      `com hover no cartão 3: ${s.folgaVerticalComHover.folgaMinima}px · ` +
      `até a escrita do vizinho de cima: ${s.escritaDoVizinhoComHover.folgaAteOTextoPx}px`,
  );
  console.log(
    `separação do fundo: cartão ${s.separacaoDoFundo.superficieCartao} contra faixa ` +
      `${s.separacaoDoFundo.faixaDaSecao} · razão ${s.separacaoDoFundo.razao}:1 · ` +
      `ΔRGB ${s.separacaoDoFundo.distanciaRgb} · arte ${s.arte.cor}`,
  );
  console.log(
    `hover: levantamento ${s.hover.levantamentoPx}px · escala ${s.hover.escalaIdle}→${s.hover.escalaHover} · ` +
      `ΔRGB medido ${s.hover.distanciaRgbMedida} (${s.hover.deltaPorCanal.join('/')}) · ` +
      `wrapper ${s.hover.wrapperPausado}`,
  );
  const pior = (lista) => Math.min(...lista.map((a) => a.razao));
  console.log(
    `contraste texto: idle pior ${pior(s.contrasteIdle)}:1 · hover pior ${pior(s.contrasteHover)}:1 ` +
      `(piso ${s.contrasteIdle[0]?.piso}:1)`,
  );
}
console.log('\nreduzido:', JSON.stringify(resultado.reduzido, null, 2));
console.log(`\nresultado-${ROTULO}.json escrito.`);
