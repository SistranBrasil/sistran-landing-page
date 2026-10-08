/**
 * Tom do fundo SOB UM PONTO DA TELA, para elementos `fixed` que a cascata do CSS
 * não alcança (o `ScrollSpy` é o caso).
 *
 * ⚠️ POR QUE NÃO BASTA DECLARAR O TOM POR SEÇÃO. O `ScrollSpy` decidia a cor da
 * letra por um campo `tom` escrito por seção em `pageSections.ts`. Medido em
 * `/parceiros-e-implementacoes`, esse modelo não cabe no que a página faz:
 * `#parceiros` é UMA seção de 16.680px cujo fundo, na margem onde a coluna vive,
 * alterna entre branco e azul-marinho quatro vezes. Qualquer tom declarado fica
 * errado em parte do percurso — e o sintoma é o rótulo branco a 1,1:1 sobre
 * trecho claro. O tom é propriedade do PONTO, não da seção.
 *
 * O que esta função faz: olha a pilha de elementos sob o ponto, acha a primeira
 * superfície que realmente PINTA e classifica. O que ela não faz: adivinhar. Sobre
 * RASTER (foto, vídeo, canvas, `url(...)`) ela responde `'midia'` em vez de escolher
 * uma tinta — ver a nota do `'midia'` abaixo.
 *
 * ⚠️ GRADIENTE NÃO É RASTER, e confundir os dois era um defeito: ver `pintaRaster` e
 * `corDoGradiente`. Um gradiente tem paradas de cor legíveis no valor computado, e
 * tratá-lo como fotografia fazia o rótulo sair BRANCO sobre superfície clara.
 */

/** Tons que o chamador sabe pintar. `'midia'` é "não há cor, há RASTER" — e depois da
 *  correção de 08/10/2026 ela é rara: gradiente e malha, que antes caíam aqui, agora
 *  são classificados pela cor das paradas. */
export type TomDoFundo = 'claro' | 'medio' | 'escuro' | 'midia';

type RGB = readonly [number, number, number];

/* As três tintas que o `ScrollSpy` já usava, com o tom a que cada uma pertence.
   A ORDEM É A PREFERÊNCIA DE DESENHO, e é ela que faz esta função reproduzir as
   escolhas que foram feitas à mão antes (ver `escolherTom`): navy nas superfícies
   claras, branco nas escuras, e o quase-preto só onde nenhuma das duas fecha —
   que é exatamente o caso que a SIS-181 documentou para o azul intermediário
   rgb(21,125,196). */
const TINTAS: readonly { tom: TomDoFundo; rgb: RGB }[] = [
  { tom: 'claro', rgb: [10, 31, 68] }, // #0a1f44
  { tom: 'escuro', rgb: [255, 255, 255] },
  { tom: 'medio', rgb: [2, 7, 14] }, // #02070e
];

/** Mínimo da WCAG 1.4.3 para texto pequeno — o rótulo tem 11px. */
const CONTRASTE_MINIMO = 4.5;

function luminancia([r, g, b]: RGB): number {
  const canal = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

export function contraste(a: RGB, b: RGB): number {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

/** `rgb()` / `rgba()` do `getComputedStyle` → canais + alfa. Só este formato
 *  aparece em valor COMPUTADO; `getComputedStyle` nunca devolve hex nem nome. */
function lerCor(valor: string): { rgb: RGB; alfa: number } | null {
  const n = valor.match(/[\d.]+/g);
  if (!n || n.length < 3) return null;
  return {
    rgb: [Number(n[0]), Number(n[1]), Number(n[2])] as const,
    alfa: n.length > 3 ? Number(n[3]) : 1,
  };
}

/**
 * A tinta de melhor desenho que ainda fecha 4,5:1 — e, se nenhuma fechar, a de
 * maior contraste possível.
 *
 * ⚠️ É ESTE CRITÉRIO QUE PRESERVA O DESENHO em vez de só maximizar número. Numa
 * superfície creme (rgb 226,239,250) o quase-preto dá 17,3:1 contra 13,9:1 do
 * navy; maximizar escolheria o quase-preto e trocaria a cor que a rota usa hoje
 * sem necessidade. Preferindo a primeira que PASSA, o navy ganha — e o
 * quase-preto fica reservado para onde ele é a única saída, que é como ele
 * entrou na paleta.
 */
function escolherTom(fundo: RGB): TomDoFundo {
  return escolherTomParaTodas([fundo]);
}

/**
 * A mesma escolha, mas contra VÁRIAS superfícies ao mesmo tempo: a primeira tinta que
 * fecha 4,5:1 em TODAS, e se nenhuma fechar a que tem o melhor PIOR caso.
 *
 * ⚠️ Por que várias e não uma: o rótulo tem ~130px de largura e o que está atrás dele
 * muda DENTRO dessa faixa (emenda de seção, borda de cartão, faixa de cor). Medir um
 * ponto só e pintar os 130px com a resposta dele é como a conferência de 08/10/2026
 * reprovou «Integração» a 3,34:1: o ponto medido era claro, o pedaço onde a palavra
 * pousa era o azul da marca. Quem decide a tinta tem de ver tudo o que a palavra cobre.
 */
export function escolherTomParaTodas(
  fundos: readonly RGB[],
  /**
   * A superfície do MEIO da palavra, quando o chamador sabe qual é. Só entra em jogo
   * no caso em que NENHUMA tinta fecha o piso em todos os pontos — ver abaixo.
   */
  principal?: RGB,
): TomDoFundo {
  if (fundos.length === 0) return 'escuro';
  const pior = (t: RGB) => Math.min(...fundos.map((f) => contraste(t, f)));
  for (const t of TINTAS) if (pior(t.rgb) >= CONTRASTE_MINIMO) return t.tom;

  /* ⚠️ A PALAVRA ATRAVESSANDO UMA EMENDA é o caso em que não existe resposta boa: de
     um lado da emenda a superfície é clara, do outro é o azul da marca, e nenhuma das
     três tintas fecha 4,5:1 nos dois. Medido em 08/10/2026: «Contacto» em `/latam`
     ficava com navy a 2,71:1 e «Onde usar» em `/solucoes/smart-miner` com o
     quase-preto a 1,20:1 — os dois escolhidos por «menos pior na média», que é
     justamente o critério que produz tinta ilegível onde a maior parte dos glifos
     está.
     Então, perdido o piso, a decisão passa a ser pelo MEIO DA PALAVRA: é onde está a
     massa dos glifos, e é a leitura que o olho faz. As pontas (2px dentro de cada
     borda da caixa) muitas vezes caem em espaço entre letras, do outro lado da
     emenda. Com isso o `/latam` passa de 2,71:1 (navy sobre azul) para branco sobre o
     mesmo azul.
     ⚠️ Isto NÃO é desistir do piso: o laço acima continua sendo a primeira tentativa,
     e ele só não acha resposta quando o fundo é de fato contraditório. Se o piso
     voltar a ser obrigatório nessa situação, a saída não é outra tinta — é véu local
     atrás do rótulo (ver a nota do véu retirado em `globals.css`). */
  if (principal) {
    for (const t of TINTAS) if (contraste(t.rgb, principal) >= CONTRASTE_MINIMO) return t.tom;
    return TINTAS.reduce((melhor, t) =>
      contraste(t.rgb, principal) > contraste(melhor.rgb, principal) ? t : melhor,
    ).tom;
  }
  return TINTAS.reduce((melhor, t) => (pior(t.rgb) > pior(melhor.rgb) ? t : melhor)).tom;
}

/**
 * Elemento que pinta RASTER — foto, vídeo, canvas, `url(...)`. Só aqui a pergunta
 * «claro ou escuro?» realmente não tem resposta sem olhar o pixel.
 *
 * ⚠️ GRADIENTE SAIU DAQUI, e é a correção de 08/10/2026. Esta função devolvia `true`
 * para QUALQUER `background-image !== 'none'`, ou seja gradiente e malha decorativa
 * contavam como fotografia. Como `'midia'` cai no ramo branco+ciano do `ScrollSpy`,
 * o rótulo ficava BRANCO sobre superfícies claras que por acaso tinham um gradiente —
 * e isso só não aparecia porque havia um véu escuro atrás da coluna. Com o véu
 * retirado (pedido), o defeito ficou visível: «PILARES» apagado sobre o azul claro da
 * faixa «Três pilares». Gradiente TEM cor legível — ver `corDoGradiente`.
 */
function pintaRaster(el: Element, estilo: CSSStyleDeclaration): boolean {
  if (el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.tagName === 'CANVAS') return true;
  return estilo.backgroundImage.includes('url(');
}

/**
 * A cor média das paradas OPACAS de um `background-image` de gradiente.
 *
 * O valor COMPUTADO de um gradiente traz as paradas como `rgb()`/`rgba()`, então dá
 * para ler a tinta sem rasterizar nada. Paradas com alfa ≤ 0,5 são descartadas pelo
 * mesmo critério do `backgroundColor` logo abaixo: translúcido não é a superfície, é
 * o que está atrás — e nesse caso a busca continua descendo a pilha, que é o
 * comportamento certo.
 *
 * MÉDIA SIMPLES, e não a parada mais próxima da coluna: a posição de cada parada
 * depende do tamanho e do ângulo da caixa, e reconstruir isso em JS seria refazer o
 * trabalho do compositor para ganhar precisão que o piso de 4,5:1 não pede. O que
 * importa é não errar o LADO da escala — e para isso a média das paradas basta: num
 * gradiente claro todas as paradas são claras.
 *
 * Devolve `null` quando o gradiente não tem nenhuma parada opaca (véus, fades).
 */
function corDoGradiente(backgroundImage: string): RGB | null {
  const paradas = backgroundImage.match(/rgba?\([^)]*\)/g);
  if (!paradas) return null;
  const opacas = paradas
    .map(lerCor)
    .filter((c): c is { rgb: RGB; alfa: number } => c !== null && c.alfa > 0.5);
  if (opacas.length === 0) return null;
  const soma = opacas.reduce<[number, number, number]>(
    (acc, c) => [acc[0] + c.rgb[0], acc[1] + c.rgb[1], acc[2] + c.rgb[2]],
    [0, 0, 0],
  );
  return [
    Math.round(soma[0] / opacas.length),
    Math.round(soma[1] / opacas.length),
    Math.round(soma[2] / opacas.length),
  ] as const;
}

/**
 * A cor MÉDIA de um raster já pintado (foto, vídeo, canvas), por `drawImage` num canvas
 * de 1×1 — o próprio navegador faz a redução.
 *
 * ⚠️ MÉDIA DO QUADRO INTEIRO, e não o pixel exato sob a coluna. Mapear a janela para
 * coordenadas da fonte exigiria refazer `object-fit`/`object-position`/`background-size`
 * em JS, e o que o piso de 4,5:1 pede é não errar o LADO da escala. A média acerta o
 * lado: a foto branca de parceiro dá média clara, a foto velada em marinho dá escura.
 *
 * ⚠️ COM CACHE, e isto não é otimização prematura: `getImageData` é leitura
 * síncrona da GPU para a CPU, e esta função é chamada na rolagem. A chave é a fonte
 * (mais o instante quantizado em meio segundo, para vídeo, que muda de conteúdo).
 * Sem cache, cada quadro de rolagem pagaria uma parada de pipeline.
 *
 * Devolve `null` quando não dá para ler (canvas contaminado por imagem de outra
 * origem, mídia ainda sem quadro) — e aí o chamador volta para `'midia'`.
 */
const MEDIAS_DE_RASTER = new Map<string, RGB | null>();

function corMediaDeRaster(el: Element): RGB | null {
  let chave = '';
  if (el instanceof HTMLImageElement) {
    if (!el.complete || el.naturalWidth === 0) return null;
    chave = el.currentSrc || el.src;
  } else if (el instanceof HTMLVideoElement) {
    if (el.readyState < 2) return null;
    chave = `${el.currentSrc || el.src}@${Math.floor(el.currentTime * 2)}`;
  } else if (el instanceof HTMLCanvasElement) {
    /* O canvas do hero repinta a cada quadro; o `data-quadro` que ele publica é
       exatamente o identificador do conteúdo atual. Sem ele, mede uma vez só. */
    chave = `canvas:${el.dataset.quadro ?? '0'}`;
  } else {
    return null;
  }
  chave += '|faixa-esq';
  const emCache = MEDIAS_DE_RASTER.get(chave);
  if (emCache !== undefined) return emCache;

  let media: RGB | null = null;
  try {
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const g = c.getContext('2d', { willReadFrequently: true });
    if (g) {
      /* ⚠️ A FAIXA ESQUERDA DA FONTE, e não o quadro inteiro. A coluna do `ScrollSpy`
         vive entre x≈12 e x≈170 de uma janela de 1920 — os primeiros ~9%. A média do
         quadro todo mistura o centro, que nestas peças é o assunto claro, com a borda
         escura onde a palavra de fato pousa: medido em 08/10/2026, «Números» em `/`
         (vídeo `impacto-assembly-scroll`) dava média clara → navy sobre
         `rgb(25,66,100)`, 1,55:1.
         20% e não 9%: `object-fit: cover` recorta a fonte antes de pintar, então a
         borda visível não é exatamente a borda da fonte. A faixa mais larga absorve
         esse deslocamento sem voltar a puxar o centro para a conta. */
      const largura =
        (el as HTMLImageElement).naturalWidth ||
        (el as HTMLVideoElement).videoWidth ||
        (el as HTMLCanvasElement).width ||
        0;
      const altura =
        (el as HTMLImageElement).naturalHeight ||
        (el as HTMLVideoElement).videoHeight ||
        (el as HTMLCanvasElement).height ||
        0;
      if (largura > 0 && altura > 0) {
        g.drawImage(el as CanvasImageSource, 0, 0, Math.max(1, Math.round(largura * 0.2)), altura, 0, 0, 1, 1);
      } else {
        g.drawImage(el as CanvasImageSource, 0, 0, 1, 1);
      }
      const d = g.getImageData(0, 0, 1, 1).data;
      /* Alfa baixo = o raster não cobre o ponto; quem manda é o que está atrás. */
      if (d[3] > 127) media = [d[0], d[1], d[2]] as const;
    }
  } catch {
    media = null;
  }
  MEDIAS_DE_RASTER.set(chave, media);
  /* Teto do cache: a chave de vídeo cresce com o tempo de reprodução. */
  if (MEDIAS_DE_RASTER.size > 64) {
    const primeira = MEDIAS_DE_RASTER.keys().next().value;
    if (primeira !== undefined) MEDIAS_DE_RASTER.delete(primeira);
  }
  return media;
}

/**
 * A SUPERFÍCIE sob (`x`, `y`) da janela: a cor que o olho vê ali, ou `'raster'` quando
 * há imagem e não foi possível amostrá-la.
 */
/** O que um elemento pinta no ponto, ou `null` se ele não pinta nada ali. */
function tintaDe(el: Element, estilo: CSSStyleDeclaration): RGB | 'raster' | null {
  if (estilo.visibility === 'hidden' || estilo.opacity === '0') return null;
  /* ⚠️ TESTADO E DESCARTADO em 08/10/2026: quando o raster não pode ser amostrado,
     CONTINUAR a busca para baixo (devolver `null` aqui) em vez de parar em `'raster'`.
     A ideia era aproveitar a cor do palco atrás da mídia, que nestas faixas costuma
     casar com ela. Medido: resolveu `/` «Números» e FEZ `/parceiros-e-implementacoes`
     regredir de 13,9:1 para 1:1 — porque ali o que está atrás das fotos é o navy do
     palco e a foto em cima é CLARA, então a resposta passou a ser a do que o olho não
     vê. É a armadilha do «answer of what's hidden» que o docblock desta função já
     advertia. Parar em `'raster'` (→ o chamador mantém o tom anterior) é o menos
     errado dos dois, e foi o que ficou. */
  if (pintaRaster(el, estilo)) return corMediaDeRaster(el) ?? 'raster';
  if (estilo.backgroundImage !== 'none') {
    const gradiente = corDoGradiente(estilo.backgroundImage);
    if (gradiente) return gradiente;
  }
  const cor = lerCor(estilo.backgroundColor);
  /* Alfa > 0,5: abaixo disso a superfície não é dela, é do que está atrás, e
     classificar por uma camada translúcida erraria por composição. */
  return cor && cor.alfa > 0.5 ? cor.rgb : null;
}

/**
 * ⚠️ O PONTO CEGO DO `elementsFromPoint`: ele NÃO DEVOLVE elemento com
 * `pointer-events: none`. E é exatamente assim que a arte dos heros desta LP é
 * montada — camada decorativa que não deve comer o clique. Resultado medido em
 * 08/10/2026: no topo de `/quem-somos`, `/solucoes` e `/parceiros-e-implementacoes` a
 * pilha devolvia o gradiente CLARO da seção (que pinta por baixo) enquanto o olho via
 * a arte ESCURA por cima — tinta navy a 1,01:1.
 *
 * Então, antes de aceitar a resposta de um candidato, varre os DESCENDENTES dele que
 * a pilha escondeu: os que têm `pointer-events: none`, cujo retângulo contém o ponto e
 * que de fato pintam. O ÚLTIMO em ordem de documento ganha — é a aproximação da ordem
 * de pintura, e é suficiente porque estas camadas são irmãs empilhadas na mesma caixa.
 *
 * Limite de nós para a varredura não virar custo de rolagem: a arte de hero fica nos
 * primeiros níveis, e um teto protege de uma seção com milhares de nós.
 */
const TETO_DA_VARREDURA = 300;

function tintaEscondidaEm(
  raiz: Element,
  x: number,
  y: number,
  ignorar?: Element | null,
): RGB | 'raster' | null {
  const nos = raiz.querySelectorAll('*');
  if (nos.length > TETO_DA_VARREDURA) return null;
  let achada: RGB | 'raster' | null = null;
  for (const el of nos) {
    if (ignorar?.contains(el)) continue;
    const estilo = getComputedStyle(el);
    if (estilo.pointerEvents !== 'none') continue;
    const r = el.getBoundingClientRect();
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
    const t = tintaDe(el, estilo);
    if (t !== null) achada = t;
  }
  return achada;
}

export function superficieEm(x: number, y: number, ignorar?: Element | null): RGB | 'raster' | null {
  if (typeof document === 'undefined') return null;
  const pilha = document.elementsFromPoint(x, y);
  if (pilha.length === 0) return null;

  for (const el of pilha) {
    if (ignorar?.contains(el)) continue;
    const estilo = getComputedStyle(el);
    if (estilo.visibility === 'hidden' || estilo.opacity === '0') continue;

    /* A camada decorativa invisível à pilha vem ANTES da própria superfície do
       candidato: ela pinta em cima dele. */
    const escondida = tintaEscondidaEm(el, x, y, ignorar);
    if (escondida !== null) return escondida;

    const t = tintaDe(el, estilo);
    if (t !== null) return t;
  }
  return null;
}

/**
 * Classifica o fundo sob (`x`, `y`) da JANELA, ignorando a subárvore de `ignorar`
 * (o próprio elemento que pergunta — senão ele se mede a si mesmo).
 *
 * Devolve `null` quando a pilha veio vazia (ponto fora da janela), para o chamador
 * manter o tom anterior em vez de piscar.
 */
export function tomDoFundoEm(x: number, y: number, ignorar?: Element | null): TomDoFundo | null {
  return tomDoFundoEmPontos([{ x, y }], ignorar);
}

/**
 * O tom que serve para TODOS os pontos — a forma que o `ScrollSpy` usa, porque o que
 * ele precisa pintar é uma palavra de ~130px e não um ponto.
 *
 * ⚠️ A ORDEM DAS PRIORIDADES, lida de dentro para fora:
 *   • `null` em todos os pontos → `null`, e o chamador MANTÉM o tom anterior. Trocar de
 *     cor num quadro sem informação é piscada, não correção.
 *   • pelo menos uma cor conhecida → decide por `escolherTomParaTodas`, que exige o
 *     piso contra o PIOR ponto.
 *   • só raster não amostrável → `'midia'`, a resposta de «não há cor aqui».
 *   Raster que FOI amostrado não chega a `'midia'`: ele entra como cor, igual às
 *   outras. É isso que dá tinta legível sobre fotografia sem véu atrás da coluna.
 */
export function tomDoFundoEmPontos(
  pontos: readonly { x: number; y: number; principal?: boolean }[],
  ignorar?: Element | null,
): TomDoFundo | null {
  if (typeof document === 'undefined') return null;
  const cores: RGB[] = [];
  let principal: RGB | undefined;
  let houveRaster = false;
  let houveLeitura = false;
  for (const ponto of pontos) {
    const s = superficieEm(Math.round(ponto.x), Math.round(ponto.y), ignorar);
    if (s === null) continue;
    houveLeitura = true;
    if (s === 'raster') houveRaster = true;
    else {
      cores.push(s);
      if (ponto.principal) principal = s;
    }
  }
  if (!houveLeitura) return null;
  if (cores.length > 0) return escolherTomParaTodas(cores, principal);
  /* ⚠️ RASTER QUE NÃO DEU PARA AMOSTRAR DEVOLVE `null`, E NÃO `'midia'`.
     `null` significa «mantenha o tom anterior», e é a resposta certa aqui: o tom
     anterior veio de uma medição que FUNCIONOU a alguns pixels de distância, e isso é
     muito melhor do que uma aposta. Enquanto `'midia'` era devolvido, o `ScrollSpy`
     caía no ramo branco — que era legível por causa do véu e, sem ele, dava
     branco-sobre-branco: medido 1:1 sobre as fotos claras de
     `/parceiros-e-implementacoes`, que é o pior número de toda a conferência.
     Isto deixa `'midia'` praticamente sem emissor. O tipo fica porque o `data-tom` do
     `<nav>` ainda é lido em diagnóstico, e porque o dia em que uma foto de outra
     origem contaminar o canvas ele volta a ser a resposta honesta — mas aí o caminho
     é véu local no rótulo, não escolher tinta no escuro. */
  return null;
}
