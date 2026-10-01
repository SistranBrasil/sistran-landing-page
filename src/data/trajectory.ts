/**
 * SIS-202 — A trajetória como SEQUÊNCIA, e é isso que o §13 de
 * `docs/implantacoes.md` pede: «posicionar competências entre os projetos sem
 * criar condições fixas espalhadas no JSX».
 *
 * ⚠️ NADA AQUI É CONTEÚDO NOVO. Os 24 marcos são `TIMELINE_EVENTS` de
 * `src/data/timeline.ts`, campo por campo — `company` vira título, `detail` vira
 * descrição, `generation` vira a etiqueta da geração. O critério 12/13 do doc
 * («dados atuais preservados», «nenhuma informação real inventada») é o motivo de
 * este arquivo DERIVAR e não copiar: quem editar a timeline edita os dois lugares
 * de uma vez, e não há chance de as duas listas divergirem.
 *
 * As quatro competências são as do §7, com os textos palavra por palavra.
 */

import { logoDaMarca, monogramaDaMarca } from '@/lib/logoDeMarca';
import { TIMELINE_CATEGORY_META, TIMELINE_EVENTS, type TimelineCategory } from './timeline';

/** Os nomes do doc (§5). Traduzem 1:1 as chaves de `TimelineCategory`. */
export type MilestoneCategory = 'large-company' | 'sme' | 'solution';

export interface MilestoneCardData {
  id: string;
  /** O doc prevê `year?`, mas `timeline.ts` NÃO guarda ano por evento — e
   *  inventar um seria quebrar o critério 13. Fica opcional e vazio; o tempo é
   *  dado pela geração e pelo capítulo. */
  year?: number;
  title: string;
  description?: string;
  category: MilestoneCategory;
  tags?: string[];
  /**
   * Arte de marca da placa do card. DERIVADA do nome que `company` já escreve
   * (`src/lib/logoDeMarca.ts`), nunca escrita à mão: `timeline.ts` não guarda
   * arquivo de marca, e inventar um seria quebrar o critério 13.
   *
   * Ausente é resposta legítima — 5 dos 24 marcos nomeiam só marcas sem arte no
   * acervo. Ali a placa mostra `monogram`, que é o ramo de reserva.
   */
  logo?: string;
  /** Iniciais da marca, para a placa quando não há `logo`. */
  monogram: string;
}

export interface CapabilityCheckpointData {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export type TrajectoryItem =
  | { type: 'milestone'; data: MilestoneCardData }
  | { type: 'capability'; data: CapabilityCheckpointData };

const CATEGORIA_EQUIVALENTE: Record<TimelineCategory, MilestoneCategory> = {
  grandes: 'large-company',
  pme: 'sme',
  solucoes: 'solution',
};

/**
 * Rótulo e cor por categoria. A COR vem de `TIMELINE_CATEGORY_META` e não da
 * paleta de referência do doc, porque o §9 manda não criar paleta paralela quando
 * o projeto já tem cor equivalente — e tem: `#9fc5ff` / `#ff8a3d` / `#7ad450`
 * contra `#8cc8ff` / `#ff8a34` / `#71c84b`, que são a mesma decisão visual.
 * O RÓTULO é o do doc (§1 pede `Empresas Grandes` com maiúscula), que é o que
 * aparece na legenda e no chip dos cards.
 */
export const TRAJECTORY_CATEGORY_META: Record<
  MilestoneCategory,
  { label: string; color: string }
> = {
  'large-company': { label: 'Empresas Grandes', color: TIMELINE_CATEGORY_META.grandes.color },
  sme: { label: 'Empresas PME', color: TIMELINE_CATEGORY_META.pme.color },
  solution: { label: 'Soluções', color: TIMELINE_CATEGORY_META.solucoes.color },
};

export const TRAJECTORY_CAPABILITIES: readonly CapabilityCheckpointData[] = [
  {
    id: 'expertise-seguros',
    title: 'Expertise em Seguros',
    description: 'Conhecimento construído em décadas de projetos e operações críticas.',
    icon: '/images/parceiros/expertisefino.png',
  },
  {
    id: 'aceleradores-escalaveis',
    title: 'Aceleradores Escaláveis',
    description:
      'Componentes e práticas que reduzem o tempo de implantação e ampliam a escala.',
    icon: '/images/parceiros/aceladoresfino.png',
  },
  {
    id: 'transformacao-digital-ti',
    title: 'Transformação Digital e TI',
    description: 'Tecnologia aplicada à evolução de jornadas, processos e integrações.',
    icon: '/images/parceiros/transformacaofino.png',
  },
  {
    id: 'governanca-metodologia-gestao',
    title: 'Governança, Metodologia e Gestão',
    description: 'Método, qualidade e gestão para sustentar evoluções com segurança.',
    icon: '/images/parceiros/governacafino.png',
  },
] as const;

/**
 * ⚠️ OS NOMES DOS ARQUIVOS DE ÍCONE TÊM ERRO DE DIGITAÇÃO NA ORIGEM
 * (`aceladoresfino`, `governacafino`, sem o "e" e sem o "n") e ficam ASSIM.
 * A issue é explícita: os arquivos já estão em `/images/parceiros/` e devem ser
 * usados de lá, com o nome que têm — renomear seria uma mudança de asset fora do
 * escopo, e a pasta `timeline/competencias` que o §1 sugere não existe.
 * As variantes `fino` são as de traço fino, que é o desenho dos mocks.
 */

/* ⚠️ AS COMPETÊNCIAS SAÍRAM DA FILA DE CARDS — 30/09. Ficam comentadas, não
   apagadas, porque a tabela de posições é a leitura do §7 e não se reconstrói de
   memória se um dia a decisão voltar atrás.

   Elas eram CARDS intercalados entre os marcos: `TRAJECTORY_ITEMS` tinha 28 itens
   (24 + 4) e cada competência ocupava uma parada inteira do palco. A área pediu o
   contrário, apontando a linha: «na linha mesmo puxar um ponto do qual deve
   aparecer», com os ícones acumulando ao longo do percurso. Viraram
   `TRAJECTORY_WAYPOINTS`, logo abaixo.

   Por que isso NÃO perde conteúdo: o título e a descrição das quatro competências
   continuam publicados por extenso no painel `.trajetoria-competencias` da preview,
   acima do palco, na mesma seção — que é, aliás, a própria captura que a área
   mandou como referência dos ícones. O que se removeu foi a SEGUNDA exibição do
   mesmo texto, não a única.

   E por que as POSIÇÕES mudaram junto: as âncoras abaixo são as do §7, lidas do
   doc; as dos waypoints são as que a área nomeou marco por marco (Total Life/QBE,
   Notre Dame/Bradesco Vida, AIG/Bradesco Seguros). Só a primeira coincide. Quem é
   dono do conteúdo escolheu, então valem as novas.

// const POSICAO_DAS_COMPETENCIAS: Record<number, string> = {
//   // §7 «Após o primeiro grupo de clientes» — fim da 1ª geração.
//   3: 'expertise-seguros',
//   // §7 «Durante a fase de expansão» — último marco de 2ª geração da lista.
//   11: 'aceleradores-escalaveis',
//   // §7 «Durante a modernização dos projetos» — a 4ª geração, que é onde as
//   // plataformas de vida entram.
//   15: 'transformacao-digital-ti',
//   // §7 «Próximo da fase atual» — logo depois de EY, cujo próprio detalhe é
//   // "Governança e transformação".
//   19: 'governanca-metodologia-gestao',
// };
*/

function marcoDoEvento(evento: (typeof TIMELINE_EVENTS)[number]): MilestoneCardData {
  return {
    id: `marco-${evento.id}`,
    title: evento.company,
    description: evento.detail,
    category: CATEGORIA_EQUIVALENTE[evento.category],
    /* A geração é a única marca de tempo que os dados têm. Vai como tag e não
       como `year` justamente por não ser ano. */
    tags: [evento.generation],
    /* Mesma regra e mesma tabela que as paradas de `partnersTrailStops` usam —
       um módulo só, para as duas montagens não divergirem numa marca nova. */
    logo: logoDaMarca(evento.company),
    monogram: monogramaDaMarca(evento.company),
  };
}

/**
 * A fila do palco: os 24 marcos, um por parada, sem intercalação.
 *
 * O `type: 'milestone'` continua no formato porque `TrajectoryItem` é uma união e
 * os consumidores discriminam por ele — e porque a união é o que deixa a volta das
 * competências à fila ser uma linha, se a decisão de 30/09 for revista.
 */
export const TRAJECTORY_ITEMS: readonly TrajectoryItem[] = TIMELINE_EVENTS.map((evento) => ({
  type: 'milestone' as const,
  data: marcoDoEvento(evento),
}));

/* ─── OS SELOS DE ÍCONE SOBRE A LINHA ──────────────────────────────────────────
   Pedido de 30/09, e a parte dele que não é geometria. */

export interface TrajectoryWaypoint {
  id: string;
  /**
   * Posição CONTÍNUA na fila — a mesma coordenada `p` que o palco escreve em `--p`
   * e que `pontoDaTrilha` sabe avaliar. `3.5` é o meio do caminho entre a quarta e
   * a quinta parada, ou seja o vão entre dois cards.
   *
   * ⚠️ FRACIONÁRIO DE PROPÓSITO, e não por descuido: em valor inteiro o selo cairia
   * exatamente sobre um card, que o cobriria. O vão entre duas paradas é o único
   * lugar da trilha onde há traço visível e nada em cima dele.
   */
  p: number;
  /** Rótulo curto. Vazio onde o selo é só o ícone. */
  rotulo?: string;
  /** Ícones, na ordem de leitura. Ver a nota de ACUMULAÇÃO abaixo. */
  icones: readonly { src: string; titulo: string }[];
}

/* Índice das competências por id, para os selos citarem sem repetir caminho de
   arquivo — o mesmo motivo de `TRAJECTORY_CAPABILITIES` existir. */
const COMPETENCIA = new Map(TRAJECTORY_CAPABILITIES.map((c) => [c.id, c]));

function icone(id: string) {
  const c = COMPETENCIA.get(id);
  /* Igual ao `filter` da miniatura: id que deixe de existir sairia como `src`
     vazio, ou seja um ícone quebrado e silencioso. Melhor um ícone de menos. */
  return c ? [{ src: c.icon, titulo: c.title }] : [];
}

/**
 * ⚠️ OS ÍCONES ACUMULAM — 1, 2, 3, 4 —, e isso é decisão da área, não implementação.
 *
 * Cada selo repete os anteriores e soma o seu. A alternativa era trocar o ícone a
 * cada ponto, e o que a acumulação diz que a troca não diria: as competências não se
 * sucedem, elas se somam — a Sistran de 2026 tem as quatro, não só a última. O custo
 * é o quarto selo carregar quatro ícones, e é o que fixa o vão mínimo entre cards em
 * `PASSO` (ver `trajectoryGeometry.ts`).
 *
 * As ÂNCORAS são os marcos que a área nomeou. Como os pares citados não são sempre
 * adjacentes (Total Life é o marco 3 e QBE o 6), o `p` é o MEIO entre os dois
 * índices — que é o que «entre A e B» quer dizer quando há paradas no caminho.
 * Lembrar que índice = id − 1: os ids de `timeline.ts` são 1..24 e a fila agora não
 * tem mais nada intercalado, então a conta é direta.
 */
export const TRAJECTORY_WAYPOINTS: readonly TrajectoryWaypoint[] = [
  /* ⚠️ O PRIMEIRO SELO SAIU EM 01/10 (noite) — «retire esse que esta entre eles». Fica
     comentado e não apagado porque é o único registro do pedido de 30/09 que o criou («na
     linha mesmo puxar um ponto do qual deve aparecer de 1988»), e do `p: 0.5` que o punha
     no primeiro vão.

     ⚠️ E O MOTIVO DE SAIR NÃO É ESTÉTICO: ele ficou REDUNDANTE quando a pílula de 1988
     voltou para a origem do traço, horas antes. O selo repetia as duas coisas que a origem
     já diz — o rótulo «1988» E o ícone de `expertise-seguros`, que é o mesmo glifo da placa
     branca —, a meio passo de distância dela. Eram três anúncios do mesmo ano no mesmo
     trecho de linha: a pílula, a placa e este selo. A captura mostra o selo encavalado na
     própria placa.

     ⚠️ QUEM O DEVOLVER TEM DE TIRAR A PÍLULA DA ORIGEM, ou repetir o problema. Os dois
     ocupam o mesmo papel em lugares diferentes da mesma curva.

     ⚠️ E A ACUMULAÇÃO DE ÍCONES NÃO SE PERDEU: a nota acima descreve 1, 2, 3, 4 ícones, e o
     que saiu era o «1». Os três selos restantes seguem com 2, 3 e 4 — a leitura de «as
     competências se somam» continua de pé, começando no segundo vão em vez do primeiro,
     porque o primeiro ícone está na placa da origem, que é onde a trajetória começa.
  {
    id: 'selo-1988',
    p: 0.5,
    rotulo: String(1988),
    icones: icone('expertise-seguros'),
  },
  */
  {
    /* Entre Total Life (marco 3 → índice 2) e QBE Brasil (marco 6 → índice 5). */
    id: 'selo-total-life-qbe',
    p: 3.5,
    icones: [...icone('expertise-seguros'), ...icone('aceleradores-escalaveis')],
  },
  {
    /* Entre Notre Dame (marco 9 → índice 8) e Bradesco Vida (marco 12 → índice 11). */
    id: 'selo-notre-dame-bradesco-vida',
    p: 9.5,
    icones: [
      ...icone('expertise-seguros'),
      ...icone('aceleradores-escalaveis'),
      ...icone('transformacao-digital-ti'),
    ],
  },
  {
    /* Entre AIG (marco 14 → índice 13) e Bradesco Seguros (marco 15 → índice 14):
       o único par adjacente da lista, então o meio é o vão entre os dois cards. */
    id: 'selo-aig-bradesco-seguros',
    p: 13.5,
    icones: [
      ...icone('expertise-seguros'),
      ...icone('aceleradores-escalaveis'),
      ...icone('transformacao-digital-ti'),
      ...icone('governanca-metodologia-gestao'),
    ],
  },
  {
    /* «logo após a esse coloque o icone de ia» — o vão seguinte.
       SOZINHO, e não como quinto ícone do selo anterior: cinco artes em fila não se
       leem no vão, e a IA não é uma quinta competência da lista do §7 — é o que vem
       DEPOIS delas. Selo próprio é o que diz isso. */
    id: 'selo-ia',
    p: 14.5,
    icones: [{ src: '/iconerobo.png', titulo: 'Inteligência artificial aplicada' }],
  },
] as const;

/**
 * O selo acende quando a rolagem CHEGA nele.
 *
 * O palco só tem o índice ativo em estado (inteiro, ~24 mudanças no percurso); `--p`
 * é contínuo mas vive fora do React. Então a revelação é por índice: o selo de
 * `p = 3.5` acende quando o ativo alcança 4. Arredondar para cima e não para baixo é
 * o que garante que o selo nunca apareça ANTES de o traço passar por ele.
 */
export function seloRevelado(selo: TrajectoryWaypoint, ativo: number): boolean {
  return ativo >= Math.ceil(selo.p);
}

/** Uma competência já acumulada, do jeito que o card a desenha. */
export interface TrajectoryCompetenciaAcumulada {
  src: string;
  titulo: string;
  /** A «breve explicação do que é o ícone». Vazia só se a arte não for de competência. */
  explicacao: string;
}

/* Explicação dos ícones que NÃO são uma das quatro competências do §7. Hoje só o robô
   do `selo-ia`, cujo `titulo` nos dados é a frase inteira — aqui ele ganha um rótulo
   curto e a explicação separada, que é o que a linha do card pede. */
const EXPLICACAO_AVULSA: Record<string, { titulo: string; explicacao: string }> = {
  '/iconerobo.png': {
    titulo: 'Inteligência Artificial',
    explicacao: 'Inteligência artificial aplicada aos produtos e à operação.',
  },
};

/** Índice inverso: do caminho do arquivo para a competência. */
const COMPETENCIA_POR_ICONE = new Map(TRAJECTORY_CAPABILITIES.map((c) => [c.icon, c]));

/**
 * AS COMPETÊNCIAS JÁ ACUMULADAS QUANDO A PARADA `indice` ACENDE — 01/10 (noite):
 * «quero que os icones seja colocados sendo respectiva a quantidade de qual icone tem
 * antes na linha do tempo dentro dos cards [...] e uma breve explicação do que é o
 * icone».
 *
 * ⚠️ A FONTE É A PRÓPRIA TRILHA, e isso é o ponto: a lista sai de `TRAJECTORY_WAYPOINTS`
 * filtrado por `seloRevelado`, a MESMA função que decide se o selo pendurado na linha
 * está aceso. Então o card nunca mostra um ícone que a linha ainda não mostrou, e nunca
 * deixa de mostrar um que ela já mostrou — não há duas tabelas para desencontrar quando
 * alguém mudar um `p`. Era a alternativa óbvia (escrever à mão «do card 4 ao 9 são
 * dois») e é a que apodrece no primeiro ajuste de âncora.
 *
 * ⚠️ E A SEMENTE É A PLACA DA ORIGEM. `expertise-seguros` não está em nenhum selo aceso
 * antes do índice 4, mas ESTÁ em cena desde o começo: é o glifo da placa branca sobre a
 * origem do traço (ver `TimelineOrigin`), que foi justamente para onde o «1» da
 * acumulação 1→2→3→4 se mudou quando o `selo-1988` saiu, acima. Sem a semente o
 * primeiro card diria zero competências com uma competência desenhada à vista.
 *
 * Deduplica por `src` porque os selos já acumulam entre si (o de `p: 13.5` repete os três
 * anteriores); a união é o que torna a conta indiferente a isso.
 */
export function competenciasAcumuladas(
  indice: number,
): readonly TrajectoryCompetenciaAcumulada[] {
  const vistas = new Map<string, TrajectoryCompetenciaAcumulada>();

  const somar = (ic: { src: string; titulo: string }) => {
    if (vistas.has(ic.src)) return;
    const competencia = COMPETENCIA_POR_ICONE.get(ic.src);
    const avulsa = EXPLICACAO_AVULSA[ic.src];
    vistas.set(ic.src, {
      src: ic.src,
      titulo: competencia?.title ?? avulsa?.titulo ?? ic.titulo,
      explicacao: competencia?.description ?? avulsa?.explicacao ?? '',
    });
  };

  const daOrigem = TRAJECTORY_CAPABILITIES[0];
  if (daOrigem) somar({ src: daOrigem.icon, titulo: daOrigem.title });

  for (const selo of TRAJECTORY_WAYPOINTS) {
    if (!seloRevelado(selo, indice)) continue;
    selo.icones.forEach(somar);
  }

  return [...vistas.values()];
}

/**
 * Os quatro capítulos da barra de progresso (§4). Cada um declara as gerações que
 * o compõem — assim o capítulo de um item se lê dos DADOS, e não de um índice
 * escrito à mão que quebra quando a timeline ganhar uma linha.
 */
export const TRAJECTORY_CHAPTERS = [
  { id: 'inicio', label: '1988', geracoes: ['1ª geração'] },
  { id: 'expansao', label: 'Expansão', geracoes: ['2ª geração', '3ª geração'] },
  {
    id: 'transformacao',
    label: 'Transformação',
    geracoes: ['4ª geração', 'Ecossistema', 'Nova geração'],
  },
  { id: 'hoje', label: 'Hoje', geracoes: ['Parceria', 'Plataforma', 'Implantação'] },
] as const;

export type TrajectoryChapterId = (typeof TRAJECTORY_CHAPTERS)[number]['id'];

/**
 * Capítulo de cada posição da sequência. Competência HERDA o capítulo do marco
 * anterior — ela não é um tempo próprio, é algo conquistado naquele trecho.
 */
export const CAPITULO_POR_INDICE: readonly TrajectoryChapterId[] = (() => {
  const mapa: TrajectoryChapterId[] = [];
  let corrente: TrajectoryChapterId = 'inicio';
  for (const item of TRAJECTORY_ITEMS) {
    if (item.type === 'milestone') {
      const geracao = item.data.tags?.[0];
      const capitulo = TRAJECTORY_CHAPTERS.find((c) =>
        (c.geracoes as readonly string[]).includes(geracao ?? ''),
      );
      if (capitulo) corrente = capitulo.id;
    }
    mapa.push(corrente);
  }
  return mapa;
})();

/**
 * Indicadores. Os dois números são os do doc (§1 e §8) e também os que a preview
 * do mock mostra. Não são derivados da lista de propósito: `TIMELINE_EVENTS` tem
 * 24 LINHAS, e várias trazem mais de uma seguradora — contar linhas daria 24 e
 * contradiria o 40 que a área pediu.
 */
export const TRAJECTORY_METRICS = [
  { valor: 40, rotulo: 'Seguradoras' },
  { valor: 26, rotulo: 'Implantações de Sinistros' },
] as const;

export const TRAJECTORY_ANO_INICIAL = 1988;

/** Ano atual, para o selo final da miniatura e o marcador do fim da linha (§8). */
export function anoAtual(): number {
  return new Date().getFullYear();
}
