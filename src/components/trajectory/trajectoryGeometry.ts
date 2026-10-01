/**
 * SIS-202 — a geometria do fluxo detalhado, num lugar só.
 *
 * Por que um módulo e não números no JSX de cada peça: o caminho ciano e os cards
 * têm de coincidir. O card é CENTRADO no nó (a linha passa ATRÁS dele, como nos
 * mocks), e o marcador viajante tem de deslizar sobre o traço e não ao lado dele.
 * Com as coordenadas escritas em dois arquivos, a primeira vez que alguém ajustar
 * uma altura desencaixa a linha dos cards e ninguém descobre por que.
 *
 * As unidades são pixels de layout, sem escala: a `<svg>` do caminho é desenhada em
 * 1:1 (largura e altura em px iguais à `viewBox`), então a espessura do traço é a
 * mesma da miniatura da preview — que é como o §2 constrói a continuidade entre as
 * duas estruturas.
 *
 * ══ O EIXO É VERTICAL, e isto é a mudança de 30/09 ═══════════════════════════
 *
 * Antes a fila andava para o LADO: `x = (i + .5) × PASSO` e a altura alternava em
 * três faixas. A área pediu o contrário, apontando o scrollytelling do Método
 * Luminna: «invés quando escrolla ele vai para o lado deve ir para baixo».
 *
 * A troca é uma transposição, não uma reescrita: quem avança agora é `y`, e é `x`
 * que alterna entre dois lados. Duas consequências que NÃO são cosméticas e que o
 * resto do módulo depende de manter:
 *
 *   1. As alças da cúbica descem (metade do vão de cada trecho) e são VERTICAIS. A
 *      `BARRIGA` em x que a SIS-205 introduziu saiu em 01/10 (noite) porque era ela que
 *      formava um bico em cada nó — a conta está arquivada junto da constante.
 *   2. O deslize do palco passou a ser em `translate3d(0, …, 0)`. Quem consome é o
 *      CSS; aqui só é preciso saber que o eixo de progresso é `y`.
 *
 * ⚠️ NÃO EXISTE MAIS ALTURA ALTA/BAIXA/EIXO. As três faixas de altura eram o
 * zigue-zague do eixo horizontal; no vertical o zigue-zague é lateral e vive em
 * `X_ESQUERDA`/`X_DIREITA`. Quem procurar `ALTURA_ALTA` para "consertar" um card
 * desalinhado está no arquivo certo e no conceito errado.
 */

import {
  TRAJECTORY_WAYPOINTS,
  type MilestoneCategory,
  type TrajectoryItem,
} from '@/data/trajectory';

/**
 * ⚠️ HISTÓRIA DO `PASSO` UNIFORME, que deixou de existir em 01/10 (noite). O comentário
 * fica porque é o inventário de quem dependia da uniformidade — ver o último parágrafo.
 *
 * Passo VERTICAL entre itens — a distância de um card ao seguinte descendo.
 * Espelhado em CSS.
 *
 * ⚠️ ESTE NÚMERO É O «AUMENTE OS ESPAÇAMENTOS» DO PEDIDO DE 30/09, e ele tem um
 * piso que não é estético: o card ativo mede ~200px de altura e cresce ~5% quando
 * acende, o que dá ~210px desenhados. Com passo de 260 (a transposição direta do
 * 500 horizontal, que valia para a LARGURA de um card de 400) os vizinhos
 * encostariam — e o ativo é justamente o que precisa respirar. 380 deixava ~170px
 * de vão. SIS-205 sobe para 420: o ativo escala acima de 1,05 e a sombra precisa
 * caber na viewport sem encostar no vizinho.
 *
 * ⚠️ 420 → 620 EM 01/10 (NOITE) — «quando um card fica em destaque e tem icones para fora
 * talvez tenha que deixar mais espaço entre os cards desses casos apenas».
 *
 * Quem passou a pedir espaço foi a lista de competências dentro do card ativo (ver
 * `MilestoneCard`): com quatro linhas o card aceso vai a ~460px de altura e, escalado em
 * 1,08, a ~497 — meia altura de ~249px. A conta do limite, medida e não estimada:
 *
 *   249 (meia altura do card aceso)  +  52 (meia placa do selo, 104px)  +  9 de respiro
 *   = 310px do nó até o CENTRO do vão  →  PASSO = 620
 *
 * ⚠️ E O APERTO NÃO É ENTRE DOIS CARDS, é entre o card aceso e o SELO pendurado no vão —
 * o que a captura mostra tapado são as placas de ícone da linha, não o card vizinho. De
 * card a card bastariam 358px (249 + ~100 de meio card em repouso + respiro), que os 420
 * antigos já davam. Quem for reduzir este número tem de olhar o selo, não o vizinho.
 *
 * ⚠️ POR QUE É GLOBAL E NÃO «DESSES CASOS APENAS». O pedido diz o certo sobre o sintoma, e
 * o espaçamento por caso não existe nesta estrutura: `y = (i + 1) × PASSO` é assumido
 * UNIFORME em quatro lugares que têm de concordar — o deslize da trilha
 * (`-(--p + 1) × --passo` no CSS), a equivalência entre `p` contínuo e índice em
 * `pontoDaTrilha`, o `p` fracionário dos selos e o `--percurso` de `alturaDaTrilha`. Com
 * passo variável, `p = 3.5` deixaria de ser «o meio do vão 3→4» e os selos sairiam da
 * linha. Então a folga é dimensionada pelo PIOR caso (quatro competências), que é
 * justamente o caso que o pedido nomeia.
 *
 * ⚠️ E ISTO NÃO ALONGA A ROLAGEM. A duração do percurso é a altura de `.trajetoria-scroll`,
 * que sai de `--itens` na folha — `PASSO` não entra nela. O que muda é a velocidade do
 * deslize: a trilha passa a andar 620px por parada em vez de 420, no mesmo curso de
 * rolagem. Mais movimento por parada, nenhuma tela a mais para rolar.
 *
 * ⚠️ 620 DEIXOU DE SER GLOBAL EM 01/10 (NOITE) — «diminua os espaçamento entre os cards
 * que nao possui icones no meio». A nota do parágrafo «POR QUE É GLOBAL» acima explica a
 * razão de ter sido global, e ela CADUCOU junto com a uniformidade: ver `VAO`,
 * `VAO_COM_SELO` e `vaoAteONo` logo abaixo, mais o `--trilha-y` que substituiu
 * `(--p + 1) × --passo` no deslize. Fica como história porque é o inventário dos quatro
 * lugares que precisavam concordar — e dos quatro, três sobreviveram sem tocar
 * (`pontoDaTrilha`, o `p` fracionário dos selos e `alturaDaTrilha`, que passou a somar os
 * nós em vez de multiplicar). Só o deslize do CSS mudou.
 *
 * ⚠️ NÃO EXISTE MAIS `PASSO`. Quem procurar o nome para ajustar espaçamento quer `VAO`
 * (o vão comum) ou `VAO_COM_SELO` (os quatro vãos que penduram selo de ícone).
 */

/**
 * O vão comum entre dois nós — os 20 vãos que não penduram selo.
 *
 * ⚠️ É O 420 DE VOLTA, e a conta que o sustenta é a de card a card, que a nota antiga de
 * `PASSO` já media e descartava por não ser o pior caso: card aceso com meia altura de
 * ~252px + meio card em repouso (~127px) + 9 de respiro = 388px de necessidade. 420 deixa
 * 32px de folga. O que NÃO cabe em 420 é o selo pendurado no meio do vão — e é só nos
 * quatro vãos que têm selo que isso importa.
 */
export const VAO = 420;

/**
 * O vão dos quatro trechos que penduram um selo de ícone.
 *
 * A conta é a da nota antiga de `PASSO`, intacta, e agora aplicada só onde vale: do nó ao
 * CENTRO do vão são 252 (meia altura do card aceso, com a lista de competências aberta) +
 * 52 (meia placa do selo, 104px) + 9 de respiro = 313px, logo o vão inteiro ≥ 626.
 */
export const VAO_COM_SELO = 640;

/**
 * Os índices de nó cujo vão de ENTRADA pendura um selo.
 *
 * ⚠️ DERIVADO DOS SELOS, E NÃO ESCRITO À MÃO — é a mesma regra de `competenciasAcumuladas`
 * em `src/data/trajectory.ts`: uma tabela paralela de «os vãos 4, 10, 14 e 15 são largos»
 * apodrece no primeiro ajuste de âncora, e o defeito seria um selo tapado pelo card, que é
 * exatamente o que estes números existem para evitar.
 *
 * `Math.ceil` porque `p = 3.5` mora no vão ENTRE os nós 3 e 4, que é o vão de entrada do
 * nó 4. Selo com `p` INTEIRO não existe (o próprio tipo avisa que seria coberto pelo card)
 * e, se um aparecer, esta conta alarga o vão errado — alargar o vão de quem não precisa é
 * inofensivo, cobrir um selo não é, então o erro cai para o lado seguro.
 */
const NOS_COM_SELO_NO_VAO = new Set(TRAJECTORY_WAYPOINTS.map((selo) => Math.ceil(selo.p)));

/** O vão que precede o nó `indice` — do nó anterior, ou da `ORIGEM` quando `indice` é 0. */
export function vaoAteONo(indice: number): number {
  return NOS_COM_SELO_NO_VAO.has(indice) ? VAO_COM_SELO : VAO;
}

/**
 * Largura da faixa em que a linha serpenteia — o que era `FAIXA` de altura, agora
 * de largura. Tem de comportar um card inteiro em cada um dos dois lados.
 */
export const FAIXA = 900;

/**
 * Alça na vertical, no teto que ainda desce sem laço: metade do vão. Maior que isso, os
 * controles cruzam o meio e a curva volta para trás.
 *
 * ⚠️ DESDE 01/10 (NOITE) ISTO É SÓ A CONTA DO CASO UNIFORME, e quem a usa é
 * `controlesDaCurva` por conta própria, a partir do vão de cada trecho. Ficou exportada
 * porque é a documentação do teto; não é mais lida por ninguém.
 */
export const ALCA = VAO * 0.5;

/* ⚠️ A `BARRIGA` SAIU EM 01/10 (NOITE), E ELA ERA A CAUSA DO «ponto quebrado» —
   «aqui quero que seja uma curva nao um ponto quebrado entre as linhas».

   Ela era o deslocamento HORIZONTAL das alças para fora da coluna (180 na SIS-205, 260 no
   ajuste de 01/10 pedido como «aqui no meio puxar mais para o lado uma linha»), e o que ela
   produzia no NÓ é um bico, por geometria e não por ajuste fino:

     direção de CHEGADA ao nó:  no − c2  =  (+sentido × BARRIGA,  +alca)
     direção de SAÍDA   do nó:  c1 − no  =  (−sentido × BARRIGA,  +alca)

   As duas são espelhadas em x, logo formam um V — e como `sentido` TROCA a cada nó (as
   colunas alternam), não há valor de barriga diferente de zero que as alinhe. O bico da
   captura não é o trecho mal ajustado: é todo nó da trilha, visível onde a linha passa ao
   lado do card em vez de por trás dele.

   Com as alças verticais (barriga zero) chegada e saída são as duas `(0, +alca)`:
   colineares, tangente contínua, curva lisa em todos os 25 nós. O vão pode variar de
   trecho para trecho sem reabrir o bico, porque o que importa é a DIREÇÃO, não o tamanho.

   ⚠️ E ISTO REVERTE O «puxar mais para o lado», de propósito: o mesmo mecanismo que
   engordava a volta era o que quebrava o nó, e o pedido mais recente escolhe o nó. Quem
   quiser a barriga de volta tem de pagá-la fora do nó — barriga máxima no MEIO do trecho
   e zero nas pontas, o que exige dois segmentos cúbicos por vão em vez de um.

// export const BARRIGA = 260;
*/

/* Duas colunas só, e alternadas: o §6 pede «curvas suaves» e «evitar ângulos muito
   fechados», e o mock do Método Luminna desce alternando lado a lado. Os valores são
   medidos contra a largura do card (400px): centrado em 300, o card ocupa 100–500;
   centrado em 600, ocupa 400–800. Os dois cabem na faixa de 900 sem estourar, e é por
   isso que estes três números não são livres.

   ⚠️ ERAM 250 E 650, E APROXIMARAM-SE DO CENTRO em 30/09 («muito para os lados:
   aproximar do centro»). Os 50px que cada lado cedeu fazem duas coisas de uma vez:
   sobra folga entre o card e a borda da faixa, e a SERPENTINA FICA MAIS MANSA — a
   amplitude lateral caiu de 400 para 300 com o passo vertical intacto em 380, então
   cada S desce mais reto. Vai na direção do §6, não contra.

   A `FAIXA` continua 900 de propósito: ela é a banda que o `<svg>` desenha e que o
   CSS centra com `translateX(-50%)`. Estreitá-la junto não mudaria nada de visível
   (centrada, ela encolhe pelos dois lados) e ainda apertaria os selos de ícone, que
   se afastam do traço no eixo horizontal. As faixas de 100px que sobram nas pontas
   são vazias e é onde a curva respira.

   ⚠️ E AS DUAS COLUNAS SE SOBREPÕEM EM X AGORA (400–500 é comum às duas), o que é
   inofensivo e vale dizer antes que alguém "conserte": cards vizinhos estão a um
   `PASSO` de distância no eixo VERTICAL, que é o eixo do percurso. Sobreposição em x só
   importaria se dois cards compartilhassem `y`, e nenhum compartilha. */
const X_ESQUERDA = 300;
const X_DIREITA = 600;

/**
 * O NÓ DE ORIGEM — 01/10: «mas isso deve estar ligada a linha».
 *
 * A pílula de 1988 era um rótulo flutuante no canto do palco, com um nó ciano
 * desenhado em CSS e NENHUMA linha chegando nele. A captura mostra o defeito inteiro:
 * pílula cortada na borda esquerda da tela e o traço começando longe dela, no primeiro
 * card. O conserto não é de estilo — é dar ao traço um ponto de partida ANTES do
 * primeiro marco, e pôr a pílula exatamente nele.
 *
 * ⚠️ POR QUE NÃO ENTRA EM `nosDaTrilha`. A tentação é acrescentar a origem à lista de
 * nós. Isso deslocaria TODOS os índices em 1, e o índice é o que casa card ↔ nó ↔ selo
 * ↔ marcador viajante: `pontoDaTrilha(NOS, p)` com `p` vindo da rolagem passaria a
 * apontar um nó adiante do card aceso. A origem entra só no `d` do caminho, em
 * `caminhoDaTrilha`, onde é um segmento a MAIS no começo e não um índice a mais.
 *
 * ⚠️ E ISSO MANTÉM O INVARIANTE `caminhoDaTrilha` ≡ `pontoDaTrilha`: os segmentos a
 * partir do nó 0 são bit a bit os mesmos de antes — o que mudou foi um trecho
 * PRECEDENTE. `pontoDaTrilha(NOS, p)` para `p` em [0, último] continua caindo sobre o
 * traço. O que mudou de verdade é o COMPRIMENTO do caminho: são 28 segmentos onde
 * havia 27, e é por isso que `--passos` passou a ser `último + 1` e o
 * `stroke-dashoffset` passou a contar `(--p + 1)`. Ver a nota em `trajectory.css`.
 *
 * ── DE ONDE SAEM AS DUAS COORDENADAS ─────────────────────────────────────────
 * `x: 620` é a coluna da DIREITA (um pouco à frente de `X_DIREITA`), e não a esquerda,
 * por um motivo medido no desenho: o primeiro card é centrado em `X_ESQUERDA` (300) e
 * ocupa 100–500. Com a origem à esquerda, a pílula e o ícone de 180px caíam sobre ele.
 * À direita, o grupo ocupa ~440–620 e não cruza os 500 do card.
 *
 * `y` é o teto de duas restrições ao mesmo tempo, e nenhuma é estética:
 *   · O ícone tem de TERMINAR acima do topo do primeiro card. O nó 0 está em
 *     `y = vaoAteONo(0)` e o card mede ~254 em repouso, logo o topo dele é `vão − 127`.
 *     Pílula (~72) + vão (14) + ícone (180) a partir de `y − 36` ocupam ~266px.
 *   · O grupo tem de CABER na metade de cima do palco. O nó 0 é desenhado em
 *     `top: calc(50% + 2.25rem)`, então a distância do grupo ao alto da tela é
 *     `nó 0 − y`, e ela tem de ficar DENTRO da meia viewport — ~436px numa tela de
 *     800px, descontada a barra de capítulos. Em telas mais baixas o bloco
 *     `@media (max-height: 760px)` encolhe o ícone.
 *
 * ⚠️ `y: 80` → `280` → `80` DE NOVO, NA MESMA NOITE DE 01/10, e as duas viradas são a MESMA
 * conta lida duas vezes. A segunda restrição não depende de `y` sozinho: depende da
 * DIFERENÇA entre a altura do nó 0 e `y`. Com o passo em 620 essa diferença virou 540px e o
 * grupo da origem subiu 200px além da meia viewport de ~436 — saiu pela barra de capítulos,
 * que é o «foi para cima e quebrou». 280 devolveu a diferença aos 340 que enquadravam.
 *
 * Agora que o vão comum voltou a 420 (ver `VAO`), o nó 0 está em 420 e a diferença com
 * `y: 280` seria de só 140px: a origem colaria no primeiro card, o defeito oposto. Com 80 a
 * diferença é 340 outra vez, que é o número que enquadra — e a primeira restrição fica
 * folgada: o grupo termina em ~236 e o topo do primeiro card está em ~293, 57px abaixo.
 *
 * ⚠️ O LAÇO DA PRIMEIRA CURVA NÃO VOLTA COM ISTO, e é o que torna o 80 seguro de novo: a
 * alça passou a ser metade do vão DESTE trecho (ver `controlesDaCurva`), em vez da constante
 * `ALCA`. Era a constante maior que o próprio vão que cruzava os controles. Proporcional, o
 * trecho da origem pode ser tão curto quanto se queira.
 *
 * Quem aumentar o ícone, mexer em `VAO` ou alargar o card revisa ESTES dois números — e
 * `VAO` em particular move os dois lados da segunda conta.
 */
export const ORIGEM = { x: 620, y: 80 } as const;

export type NoDaTrilha = {
  x: number;
  y: number;
  /**
   * De que lado da faixa o nó caiu. O card é centrado no nó nos dois, então isto
   * NÃO é deslocamento: serve ao CSS para variar acabamento por lado (de onde nasce
   * a sombra, para que lado o card entra) e, no modo estático, para saber de que
   * lado da linha vertical o item se alinha.
   */
  ancora: 'esquerda' | 'direita';
  /** Categoria do marco, quando o item é um. Pinta o nó; competência não tem. */
  categoria?: MilestoneCategory;
};

export function nosDaTrilha(itens: readonly TrajectoryItem[]): NoDaTrilha[] {
  /* ⚠️ ACUMULADO, E NÃO `(i + 1) × PASSO` — 01/10 (noite). O vão deixou de ser uniforme
     (ver `vaoAteONo`), então a altura de um nó é a SOMA dos vãos até ele e não um produto.
     Quem consome `y` já o lia como número pronto (`--celula-y`, `pontoDaTrilha`, os selos),
     então a troca é local a este laço. A única exceção era o deslize da trilha no CSS, que
     refazia o produto por conta própria; passou a consumir `--trilha-y`, calculado por
     `deslocamentoDaTrilha` a partir destes mesmos nós. */
  let acumulado = 0;
  return itens.map((item, i) => {
    acumulado += vaoAteONo(i);
    /* Alterna por ÍNDICE, e agora isso é correto: desde 30/09 a fila é só de
       marcos — as competências saíram dela e viraram selos sobre a linha. Enquanto
       havia dois tipos de item, alternar por índice fazia a competência consumir um
       turno do zigue-zague e dois marcos seguidos caírem no mesmo lado, achatando a
       curva; era por isso que a versão anterior contava marcos. Sem o segundo tipo,
       contar índices e contar marcos é a mesma conta, e a mais simples fica. */
    const esquerda = i % 2 === 0;
    return {
      x: esquerda ? X_ESQUERDA : X_DIREITA,
      /* ⚠️ ERA `(i + 0.5)`, E O `+ 1` É A ABERTURA DE 01/10 — «mas isso deve estar
         ligada a linha». A pílula de 1988 virou a ORIGEM do traço (ver `ORIGEM`
         abaixo), e para o nó de origem caber ACIMA do primeiro card a folga de meio
         passo não bastava: o grupo pílula + ícone mede ~250px e a meia folga dava 210.
         Com `+ 1` a folga é um passo inteiro (420px).
         ⚠️ QUEM CONSOME ISTO NO CSS É O DESLIZE DA TRILHA, que desde 01/10 (noite) lê
         `--trilha-y` em vez de refazer o produto. Ver `deslocamentoDaTrilha`: é a mesma
         lista de nós interpolada linearmente, então não há dois números para desencontrar
         como havia quando o CSS multiplicava `--passo` por conta própria. */
      y: acumulado,
      ancora: esquerda ? ('esquerda' as const) : ('direita' as const),
      categoria: item.type === 'milestone' ? item.data.category : undefined,
    };
  });
}

/**
 * Os quatro pontos de controle da cúbica, os mesmos no `d` e no marcador.
 *
 * ⚠️ A ALÇA É METADE DO VÃO DESTE TRECHO, e não a constante `ALCA` — 01/10 (noite). Para
 * os 24 trechos entre nós as duas contas dão o MESMO número (o vão é sempre `PASSO`, e
 * `ALCA` é `PASSO × 0.5`), então nada do percurso muda. O que muda é o trecho da `ORIGEM`,
 * que é o único curto da trilha: com a alça fixa em `PASSO × 0.5` as duas alças dele se
 * cruzavam (`c1y` caía ABAIXO de `c2y`) e a curva voltava para trás antes de chegar ao
 * primeiro card — é o laço que a nota de `ALCA` avisa, e foi ele que apareceu quando
 * `PASSO` subiu para 620 e o trecho da origem ficou com 340 de vão para uma alça de 310.
 *
 * Proporcional, o laço é impossível por construção em qualquer vão: as alças somam
 * exatamente o vão e nunca o atravessam.
 */
export function controlesDaCurva(
  de: { x: number; y: number },
  para: { x: number; y: number },
) {
  const alca = (para.y - de.y) * 0.5;
  return {
    /* ⚠️ ALÇAS VERTICAIS — `c1x` é o x do nó de saída e `c2x` o do nó de chegada, sem
       deslocamento lateral. É o conserto do «ponto quebrado»: ver a nota da `BARRIGA`
       arquivada acima para a conta de por que qualquer valor lateral reabre o bico. */
    c1x: de.x,
    c1y: de.y + alca,
    c2x: para.x,
    c2y: para.y - alca,
  };
}

/**
 * Caminho cúbico pelos nós. Cada segmento sai para baixo e chega por cima, com a
 * alça empurrada para fora da coluna (`controlesDaCurva`) — o S desce, e a volta
 * se aproxima do semicírculo. A trilha não vira a miniatura horizontal.
 */
export function caminhoDaTrilha(nos: readonly NoDaTrilha[]): string {
  if (nos.length === 0) return '';
  /* A MESMA conta que `pontoDaTrilha` avalia — uma função só, senão o marcador
     viajante desliza ao lado da linha em vez de sobre ela. */
  /* ⚠️ O CAMINHO COMEÇA NA `ORIGEM`, não no nó 0 — 01/10. É este segmento a mais que
     LIGA a pílula de 1988 ao primeiro card; sem ele a pílula era um adorno solto.
     Usa `controlesDaCurva` como qualquer outro trecho, então a volta tem a mesma
     barriga das demais e não se lê como emenda. */
  const partes = [`M ${ORIGEM.x} ${ORIGEM.y}`];
  {
    const { c1x, c1y, c2x, c2y } = controlesDaCurva(ORIGEM, nos[0]);
    partes.push(`C ${c1x} ${c1y} ${c2x} ${c2y} ${nos[0].x} ${nos[0].y}`);
  }
  for (let i = 1; i < nos.length; i += 1) {
    const { c1x, c1y, c2x, c2y } = controlesDaCurva(nos[i - 1], nos[i]);
    const para = nos[i];
    partes.push(`C ${c1x} ${c1y} ${c2x} ${c2y} ${para.x} ${para.y}`);
  }
  return partes.join(' ');
}

/** Altura total da trilha — era `larguraDaTrilha` antes da transposição do eixo.
 *  ⚠️ RECEBE OS NÓS, e não a quantidade, desde que o vão deixou de ser uniforme (01/10,
 *  noite): com vãos diferentes não há produto que dê a altura, só a soma que `nosDaTrilha`
 *  já acumulou. O vão extra no fim continua sendo o respiro de que o marcador «Em evolução»
 *  precisa — sem ele a caixa termina NO último nó e tudo o que mora abaixo é recortado. */
export function alturaDaTrilha(nos: readonly NoDaTrilha[]): number {
  const ultimo = nos[nos.length - 1];
  return (ultimo ? ultimo.y : 0) + VAO;
}

/**
 * O DESLOCAMENTO VERTICAL DA TRILHA para a posição contínua `p` — o que o CSS aplica em
 * `translate3d(…, -var(--trilha-y), …)` para enquadrar o nó ativo.
 *
 * ⚠️ LINEAR, E NÃO A CURVA. É de propósito que isto não seja `pontoDaTrilha(...).y`: o
 * deslize é o movimento do PALCO, e o `y` da cúbica acelera e desacelera dentro de cada
 * trecho (as alças seguram a curva perto dos nós). Aplicado ao palco, isso se leria como a
 * página travando e arrancando a cada card. Interpolar reto entre as alturas dos nós dá
 * velocidade constante e chega ao mesmo lugar em todo `p` inteiro, que é a única
 * coincidência que o enquadramento exige.
 *
 * ⚠️ ERA `(--p + 1) × --passo` NO PRÓPRIO CSS, e é por isso que mudou de lado: aquela conta
 * só fechava com vão uniforme. Agora o número vem de `nosDaTrilha`, a mesma lista que
 * posiciona os cards — não há duas contas para desencontrar.
 */
export function deslocamentoDaTrilha(nos: readonly NoDaTrilha[], p: number): number {
  if (nos.length === 0) return 0;
  const limite = nos.length - 1;
  const preso = Math.min(Math.max(p, 0), limite);
  const i = Math.min(Math.floor(preso), Math.max(limite - 1, 0));
  const de = nos[i];
  const para = nos[i + 1] ?? de;
  return de.y + (para.y - de.y) * (preso - i);
}

/**
 * Ponto da curva na posição CONTÍNUA `p` da fila (3,42 = 42% do caminho entre o
 * quarto e o quinto nó). É o que põe o marcador viajante sobre a linha, e também o
 * que ancora os selos de ícone em posições fracionárias entre dois marcos.
 *
 * ⚠️ MATEMÁTICA, NÃO DOM. A tentação é `path.getPointAtLength()`, que é o que a
 * trilha antiga usava — mas ali o cálculo acontecia uma vez por evento de rolagem,
 * e o §12 proíbe leitura de layout por quadro. Esta função avalia a MESMA cúbica que
 * `caminhoDaTrilha` emite, com as mesmas alças, em ~20 operações e sem
 * tocar no documento. As duas não podem divergir: se as alças mudarem lá, mudam
 * aqui, e é por isso que os controles estão numa função só, acima.
 *
 * Não confundir com progresso por COMPRIMENTO DE ARCO: `t` é o parâmetro da curva,
 * não a distância percorrida, então o marcador anda um pouco mais rápido nos trechos
 * curvos. Para um marcador decorativo que acompanha o card ativo isso é invisível —
 * e casar arco exigiria justamente a medição que o §12 recusa.
 */
export function pontoDaTrilha(nos: readonly NoDaTrilha[], p: number): { x: number; y: number } {
  if (nos.length === 0) return { x: 0, y: 0 };
  const limite = nos.length - 1;
  const preso = Math.min(Math.max(p, 0), limite);
  const i = Math.min(Math.floor(preso), Math.max(limite - 1, 0));
  return pontoDoTrecho(nos[i], nos[i + 1] ?? nos[i], preso - i);
}

/**
 * Um trecho só, avaliado em `t` ∈ [0, 1]. Extraído de `pontoDaTrilha` em 01/10 (noite)
 * porque o trecho da `ORIGEM` passou a precisar da mesma conta sem ter índice de nó — ver
 * `pontoDoViajante`. É a MESMA cúbica que `caminhoDaTrilha` escreve no `d`, pelos mesmos
 * controles, e é esse o invariante que mantém o marcador sobre a linha e não ao lado dela.
 */
function pontoDoTrecho(
  de: { x: number; y: number },
  para: { x: number; y: number },
  t: number,
): { x: number; y: number } {
  const { c1x, c1y, c2x, c2y } = controlesDaCurva(de, para);
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;

  return {
    x: a * de.x + b * c1x + c * c2x + d * para.x,
    y: a * de.y + b * c1y + c * c2y + d * para.y,
  };
}

/**
 * ONDE O MARCADOR VIAJANTE ESTÁ — 01/10 (noite): «esse eu quero que inicie desdo 1988 nao
 * do primeiro card».
 *
 * A pílula da Luminna começava sobre o nó 0, porque lia `pontoDaTrilha(NOS, 0)`, e a lista
 * de nós não contém a origem (ver a nota de `ORIGEM`: pôr a origem na lista deslocaria todos
 * os índices e desencaixaria card ↔ selo ↔ marcador). O trecho de 1988 existe no `d` do
 * caminho mas não tem índice, então o marcador não tinha como estar nele.
 *
 * ⚠️ A SOLUÇÃO É UM MAPEAMENTO, NÃO UM NÓ A MAIS. A primeira metade da primeira parada
 * (`p` em [0, 0.5)) é gasta no trecho `ORIGEM → nó 0`; a segunda metade (`p` em [0.5, 1))
 * percorre o trecho `nó 0 → nó 1` inteiro; de `p` ≥ 1 em diante nada muda.
 *
 * É CONTÍNUO nas duas emendas, e é isso que o torna invisível: em `p = 0.5` os dois ramos
 * dão o nó 0, e em `p = 1` os dois dão o nó 1. O preço é o marcador andar em dobro durante a
 * primeira parada — para uma pílula decorativa que acompanha o card aceso, não se lê.
 *
 * ⚠️ E SÓ O MARCADOR USA ISTO. Os selos de ícone e o «Em evolução» continuam em
 * `pontoDaTrilha`, porque o `p` deles é uma âncora de CONTEÚDO (3,5 é «entre o quarto e o
 * quinto card») e não a posição de quem percorre. Misturar os dois faria os selos do primeiro
 * vão saltarem de lugar.
 */
export function pontoDoViajante(
  nos: readonly NoDaTrilha[],
  p: number,
): { x: number; y: number } {
  if (nos.length === 0) return { x: ORIGEM.x, y: ORIGEM.y };
  if (p <= 0) return { x: ORIGEM.x, y: ORIGEM.y };
  if (p < 0.5) return pontoDoTrecho(ORIGEM, nos[0], p / 0.5);
  if (p < 1 && nos.length > 1) return pontoDoTrecho(nos[0], nos[1], (p - 0.5) * 2);
  return pontoDaTrilha(nos, p);
}
