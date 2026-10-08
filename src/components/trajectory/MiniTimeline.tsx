import Image from 'next/image';
import {
  TRAJECTORY_ANO_INICIAL,
  TRAJECTORY_CATEGORY_META,
  TRAJECTORY_ITEMS,
} from '@/data/trajectory';

/**
 * SIS-202 — a miniatura da trajetória (§1 do doc): síntese do fluxo detalhado,
 * de um selo `1988` a um selo com o ano corrente.
 *
 * ⚠️ A SERPENTINA DO MOCK VENCE, e esta nota substitui a anterior.
 *
 * A versão anterior desenhava um S muito aberto DE PROPÓSITO, e a justificativa
 * estava escrita aqui: o doc, no mesmo assunto, pede «Formato horizontal com uma
 * única curva suave» e, nas restrições, «Evitar ângulos muito fechados» — e onde
 * texto e imagem discordam, o texto costuma valer. A área fechou o contrário em
 * 30/09: a curva da preview é a de `public/images/parceiros/exemplopreview.png`.
 * Decisão de quem é dono do conteúdo, então a serpentina entra.
 *
 * Fica registrado o que a troca custa, porque não é nada: o «ângulo muito fechado»
 * que a restrição temia não aparece: as duas voltas são SEMICÍRCULOS EXATOS (ver
 * abaixo), então a curvatura é constante e não há nenhum vértice. O espírito da
 * restrição — nada de bico — continua cumprido com a geometria do mock.
 *
 * ⚠️ NÃO CONFUNDIR COM O GANCHO REPROVADO. A linha antiga desta rota
 * (`RoadmapTrail`) também voltava sobre si mesma, e foi reprovada; o que se
 * reprovou ali era a trilha VERTICAL de 24 paradas, não a miniatura. São duas peças
 * e dois assuntos.
 *
 * SVG e não imagem: o §1 proíbe usar o infográfico como arte, e um traço vetorial é
 * o que permite a MESMA cor da linha do fluxo detalhado — que é como o §2 constrói a
 * continuidade entre as duas estruturas.
 */

/* ── A geometria, lida do mock ──────────────────────────────────────────────
   Medido em `exemplopreview.png` (1672×941) e normalizado para esta `viewBox`. O
   desenho é: perna reta para a direita → volta de 180° para baixo → perna reta para
   a esquerda → volta de 180° para baixo → perna reta para a direita.

   ⚠️ AS VOLTAS SÃO SEMICÍRCULOS, e é por isso que o raio NÃO é um número escolhido:
   um arco de 180° entre dois pontos na mesma vertical tem raio igual à METADE da
   distância entre eles. Escrever o raio à mão e depois mexer numa das alturas
   produziria um arco impossível, que o navegador silenciosamente amplia até caber —
   e o traço deixaria de encostar na perna seguinte. Derivado, isso não acontece. */
const LARGURA = 800;

/* Altura do DESENHO. Os `y` abaixo são coordenadas dentro desta faixa e não
   mudaram na SIS-205 — a serpentina é a mesma que a SIS-202 mediu no mock. */
const ALTURA_DESENHO = 240;

/* ⚠️ A `viewBox` GANHOU FOLGA EM CIMA E EMBAIXO, e não é enfeite: é onde a fileira
   de logos da SIS-205 mora. As logos ficam na ponta EXTERNA das hastes, ou seja
   acima da perna de cima e abaixo das outras duas — fora da faixa de 240. Sem a
   folga elas transbordariam a caixa: o `<svg>` é `overflow: visible`, então não
   seriam cortadas ali, mas invadiriam o título acima e a legenda abaixo, que é o
   mesmo defeito por outro caminho.

   A folga é dada por `min-y` NEGATIVO em vez de deslocar os `y` do desenho para
   baixo: assim nenhuma coordenada da serpentina muda, e o diff desta issue não
   toca a geometria que a 202 entregou. O preço é que toda posição de overlay em
   HTML precisa descontar o `min-y` — e é por isso que existe a função
   `posicaoNaCaixa`, uma só, em vez de cada selo fazer sua conta.

   ⚠️ E A CAIXA FICOU MAIS ALTA, não o desenho. Com `width: 100%; height: auto`, a
   escala do traço é `larguraRenderizada / 800` e não depende da altura da
   `viewBox`; o que a folga faz é reservar banda vazia. Trocar a folga por um
   `ALTURA_DESENHO` maior seria o oposto: encolheria a serpentina. */
const FOLGA_LOGOS = 40;
const VB_Y = -FOLGA_LOGOS;
const ALTURA = ALTURA_DESENHO + FOLGA_LOGOS * 2;

const Y_TOPO = 52;
const Y_MEIO = 122;
const Y_BAIXO = 189;

const X_INICIO = 60;
const X_VOLTA_DIREITA = 541;
const X_VOLTA_ESQUERDA = 248;
const X_FIM = 740;

/** Raio de cada volta: metade do degrau vertical que ela vence. Ver a nota acima. */
const RAIO_ALTO = (Y_MEIO - Y_TOPO) / 2;
const RAIO_BAIXO = (Y_BAIXO - Y_MEIO) / 2;

/* `sweep-flag` 1 na volta da direita e 0 na da esquerda: uma abaula para FORA à
   direita, a outra para fora à esquerda. Trocar os dois faria os arcos cruzarem as
   pernas em vez de fechá-las. */
const CAMINHO = [
  `M ${X_INICIO} ${Y_TOPO}`,
  `L ${X_VOLTA_DIREITA} ${Y_TOPO}`,
  `A ${RAIO_ALTO} ${RAIO_ALTO} 0 0 1 ${X_VOLTA_DIREITA} ${Y_MEIO}`,
  `L ${X_VOLTA_ESQUERDA} ${Y_MEIO}`,
  `A ${RAIO_BAIXO} ${RAIO_BAIXO} 0 0 0 ${X_VOLTA_ESQUERDA} ${Y_BAIXO}`,
  `L ${X_FIM} ${Y_BAIXO}`,
].join(' ');

/* As três pernas retas, nomeadas. Os pontos de categoria se posicionam por FRAÇÃO
   da perna em que estão, nunca por um `x` absoluto.

   ⚠️ E ISSO É O QUE IMPEDE UMA BOLINHA DE SAIR DA LINHA. A versão anterior avaliava
   a cúbica para achar o ponto exato do traço — precisão necessária ali, porque a
   curva passava por todo lado. Aqui a garantia é mais forte e mais barata: num
   segmento HORIZONTAL, qualquer ponto interpolado entre as duas pontas está sobre o
   traço por construção. O risco que sobra é outro — um `t` fora de 0–1 cairia dentro
   do arco, onde não há perna —, e é justamente esse que a fração elimina. */
const PERNAS = {
  topo: { de: X_INICIO, para: X_VOLTA_DIREITA, y: Y_TOPO },
  meio: { de: X_VOLTA_DIREITA, para: X_VOLTA_ESQUERDA, y: Y_MEIO },
  baixo: { de: X_VOLTA_ESQUERDA, para: X_FIM, y: Y_BAIXO },
} as const;

type NomeDaPerna = keyof typeof PERNAS;

function pontoNaPerna(perna: NomeDaPerna, t: number): readonly [number, number] {
  const { de, para, y } = PERNAS[perna];
  return [de + (para - de) * t, y];
}

/* Todas as paradas que já têm arte no acervo — a mesma lista dos cards, na mesma
   ordem. Pedido de 05/10: a miniatura mostrava cinco logos e o resto da trajetória
   ficava só nos cards. Marco sem arquivo continua de fora: monograma de duas letras
   neste desenho seria texto miúdo.

   A ordem ao longo do traço é a dos dados. A perna do meio corre da direita para a
   esquerda, então `t` maior ali é mais à esquerda — o primeiro marco da fatia fica
   no `t` menor. As faixas deixam folga nas pontas para o selo de 1988, as duas
   voltas e o selo do ano corrente. */
const FAIXAS: readonly { perna: NomeDaPerna; de: number; ate: number; vao: number }[] = [
  { perna: 'topo', de: 0.1, ate: 0.9, vao: 0.8 * (X_VOLTA_DIREITA - X_INICIO) },
  { perna: 'meio', de: 0.16, ate: 0.84, vao: 0.68 * (X_VOLTA_DIREITA - X_VOLTA_ESQUERDA) },
  { perna: 'baixo', de: 0.08, ate: 0.84, vao: 0.76 * (X_FIM - X_VOLTA_ESQUERDA) },
];

const MARCOS_COM_LOGO = TRAJECTORY_ITEMS.flatMap((item) =>
  item.type === 'milestone' && item.data.logo ? [item.data] : [],
);

function quotasPorPerna(total: number): number[] {
  const soma = FAIXAS.reduce((acc, faixa) => acc + faixa.vao, 0);
  const bases = FAIXAS.map((faixa) => Math.floor((faixa.vao / soma) * total));
  let resto = total - bases.reduce((acc, n) => acc + n, 0);
  const ordem = FAIXAS.map((faixa, i) => ({
    i,
    frac: (faixa.vao / soma) * total - bases[i],
  })).sort((a, b) => b.frac - a.frac);
  for (const { i } of ordem) {
    if (resto === 0) break;
    bases[i] += 1;
    resto -= 1;
  }
  return bases;
}

const PONTOS: readonly { perna: NomeDaPerna; t: number; marco: string }[] = (() => {
  const quotas = quotasPorPerna(MARCOS_COM_LOGO.length);
  let cursor = 0;
  return FAIXAS.flatMap((faixa, indice) => {
    const n = quotas[indice];
    const fatia = MARCOS_COM_LOGO.slice(cursor, cursor + n);
    cursor += n;
    return fatia.map((marco, i) => ({
      perna: faixa.perna,
      t: n === 1 ? (faixa.de + faixa.ate) / 2 : faixa.de + ((faixa.ate - faixa.de) * i) / (n - 1),
      marco: marco.id,
    }));
  });
})();

/* Índice dos marcos por id, montado uma vez na carga do módulo. `TRAJECTORY_ITEMS`
   traz marcos E competências intercaladas; só os marcos têm marca. */
const MARCO_POR_ID = new Map(
  TRAJECTORY_ITEMS.flatMap((item) => (item.type === 'milestone' ? [[item.data.id, item.data]] : [])),
);

/**
 * Os pontos já resolvidos: coordenada, categoria e arte.
 *
 * ⚠️ O `filter` NÃO É DEFENSIVIDADE VAZIA. `PONTOS` cita ids à mão, e um id que
 * deixasse de existir (marco renomeado, timeline reordenada) daria `undefined` —
 * que em JSX vira um `<circle>` sem cor e um chip com `src` vazio, ou seja um
 * defeito visual silencioso. Filtrado, o desenho perde UM ponto e continua
 * correto. Preferir errar para menos num desenho que a própria legenda declara
 * como «identificação visual, não contagem».
 */
const NOS_DA_PREVIA = PONTOS.flatMap(({ perna, t, marco }) => {
  const dados = MARCO_POR_ID.get(marco);
  if (!dados) return [];
  const [x, y] = pontoNaPerna(perna, t);
  /* Para cima só na perna de cima, como no mock: nas outras duas a haste subiria
     por dentro da serpentina e cruzaria o próprio traço. */
  const sentido = perna === 'topo' ? -1 : 1;
  return [{ id: marco, x, y, sentido, categoria: dados.category, logo: dados.logo }];
});

/* A haste e o chip, em unidades da `viewBox`. A haste vai da borda do nó até quase
   o chip, e o chip é centrado no fim dela — os três números são um só desenho, e é
   por isso que estão juntos aqui em vez de espalhados pelo JSX. */
const HASTE_DE = 18;
const HASTE_ATE = 40;
const LOGO_CENTRO = 52;

/**
 * Coordenada da `viewBox` → posição em PORCENTAGEM da caixa, para os overlays em
 * HTML (selos de ano e chips de marca).
 *
 * ⚠️ O `- VB_Y` É O PONTO DA FUNÇÃO. A `viewBox` começa em y negativo desde a
 * SIS-205, então `y / ALTURA` deixou de ser a fração da caixa — o erro seria de
 * 40/320, ou 12,5% da altura, e apareceria como selo descolado do nó. Existe uma
 * função só, usada pelos dois tipos de overlay, justamente para não haver duas
 * contas para manter iguais.
 */
function posicaoNaCaixa(x: number, y: number) {
  return {
    left: `${(x / LARGURA) * 100}%`,
    top: `${((y - VB_Y) / ALTURA) * 100}%`,
  };
}

export function MiniTimeline({ anoFinal }: { anoFinal: number }) {
  const inicio = [X_INICIO, Y_TOPO] as const;
  const fim = [X_FIM, Y_BAIXO] as const;

  return (
    <div className="trajetoria-mini">
      {/* `role="img"` + `aria-label`: o desenho é uma síntese e não carrega
          informação que não esteja escrita no título e na legenda ao redor.
          Descrever ponto por ponto seria anunciar decoração. */}
      <svg
        className="trajetoria-mini-svg"
        viewBox={`0 ${VB_Y} ${LARGURA} ${ALTURA}`}
        role="img"
        aria-label={`Síntese da trajetória, de ${TRAJECTORY_ANO_INICIAL} a ${anoFinal}`}
        focusable="false"
      >
        {/* Hastes verticais pontilhadas, como no mock: sinalizam que cada ponto é
            uma parada do fluxo detalhado sem escrever texto pequeno (proibido
            pelo §1). Decorativas — e desde a SIS-205 elas LIGAM o nó ao chip da
            marca, que é o «hastes = ligação visual» do item 4 da issue. */}
        {NOS_DA_PREVIA.map(({ id, x, y, sentido }) => (
          <line
            key={`haste-${id}`}
            className="trajetoria-mini-haste"
            x1={x}
            x2={x}
            y1={y + sentido * HASTE_DE}
            y2={y + sentido * HASTE_ATE}
          />
        ))}

        <path className="trajetoria-mini-linha" d={CAMINHO} />

        {NOS_DA_PREVIA.map(({ id, x, y, categoria }) => (
          <circle
            key={`ponto-${id}`}
            className="trajetoria-mini-ponto"
            cx={x}
            cy={y}
            r={14}
            style={{ fill: TRAJECTORY_CATEGORY_META[categoria].color }}
          />
        ))}

        {/* Nós das pontas: anel branco sobre ciano com halo, o desenho da captura 3.
            Ficam DEPOIS dos selos na pilha visual (o selo é HTML, que vem depois do
            SVG no documento), então o `z-index` do selo é o que decide — ver o CSS. */}
        <circle className="trajetoria-mini-no" cx={inicio[0]} cy={inicio[1]} r={15} />
        <circle className="trajetoria-mini-no" cx={fim[0]} cy={fim[1]} r={15} />
      </svg>

      {/* Os selos são HTML e não `<text>` do SVG: são os dois únicos textos do
          desenho e precisam herdar a fonte, o peso e o tamanho do projeto —
          dentro do SVG eles escalariam com a `viewBox` e a 390px viriam ilegíveis,
          que é exatamente o que o §14 proíbe. Posicionados em porcentagem sobre a
          MESMA geometria, então acompanham a linha em qualquer largura.

          O deslocamento lateral (pílula à esquerda do nó no início, à direita no
          fim) é do CSS, não daqui: é acabamento, e em px — em % ele mudaria de
          tamanho junto com a largura da caixa e descolaria do nó. */}
      <span
        className="trajetoria-mini-selo trajetoria-mini-selo--inicio"
        style={posicaoNaCaixa(inicio[0], inicio[1])}
      >
        {TRAJECTORY_ANO_INICIAL}
      </span>
      <span
        className="trajetoria-mini-selo trajetoria-mini-selo--fim"
        style={posicaoNaCaixa(fim[0], fim[1])}
      >
        {anoFinal}
      </span>

      {/* SIS-205 — OS CHIPS DE MARCA, no fim de cada haste.

          HTML e não `<image>` dentro do SVG, pelo MESMO motivo dos selos de ano:
          dentro do SVG o chip escalaria com a `viewBox`, e a 390px de tela a caixa
          renderiza a ~0,49 da escala — uma logo de 36 unidades viria com 17px, onde
          não se reconhece marca nenhuma. Em HTML o tamanho é px, escrito uma vez no
          CSS com `clamp`, e a POSIÇÃO é a mesma geometria em porcentagem, então o
          chip acompanha a linha em qualquer largura sem encolher com ela.

          `aria-hidden` nos chips, e não `alt` com o nome da empresa: as marcas
          estão escritas por extenso nos cards do fluxo detalhado, logo abaixo na
          mesma seção, e o `aria-label` do `<svg>` já declara o desenho como
          síntese. Anunciá-las aqui seria ler como conteúdo novo o que é recorte
          visual de conteúdo que vem inteiro adiante — a mesma razão que
          `aria-hidden` a placa do `MilestoneCard`.

          Só entra chip onde há ARTE NO ACERVO (`logo` presente). Não há ramo de
          monograma aqui, ao contrário do card: duas letras num chip de 36px sobre a
          serpentina seriam texto miúdo, que o §1 proíbe — e o nó colorido já marca
          a parada sem o chip. */}
      {NOS_DA_PREVIA.map((no) =>
        /* Ternário e não `filter` antes do `map`: filtrado, o TypeScript continua
           vendo `logo?: string` no elemento e o `src` precisaria de uma asserção —
           que é exatamente a mentira que o tipo opcional existe para evitar. No
           ternário ele estreita para `string` sozinho. */
        no.logo ? (
          <span
            key={`marca-${no.id}`}
            className="trajetoria-mini-marca"
            style={posicaoNaCaixa(no.x, no.y + no.sentido * LOGO_CENTRO)}
            aria-hidden
          >
            <Image
              src={no.logo}
              alt=""
              /* Intrínsecos generosos, só para reservar a caixa: com
                 `images: { unoptimized: true }` (SIS-154) o que baixa é o arquivo
                 do disco, e o tamanho de desenho é do CSS. Mesmo par que a placa
                 do `MilestoneCard` usa para as mesmas artes. */
              width={240}
              height={80}
              loading="lazy"
              decoding="async"
            />
          </span>
        ) : null,
      )}
    </div>
  );
}
