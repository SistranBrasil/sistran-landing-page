/**
 * Secao 8 — Modelos de atuacao (SIS-99).
 *
 * Substitui a antiga constante `ABORDAGEM` de `aSistran.ts`, que era so uma
 * lista de quatro rotulos numerados de 01 a 04. Os quatro NAO sao etapas de um
 * processo: sao formas de contratacao que orbitam a mesma capacidade, e por isso
 * perderam a numeracao. Ver `components/CircularEngagementModel.tsx`.
 *
 * As descricoes nasceram aqui — o conteudo original do site nao tinha texto de
 * apoio para as quatro, apenas os rotulos.
 *
 * SIS-165 (29/09) — a lista publicada tem TRÊS itens: Outsourcing saiu por pedido
 * e está comentado no lugar, no fim do array. Onde este cabeçalho diz "quatro",
 * leia "os modelos": o argumento (não são etapas, não há ordem) não mudou, e passou
 * a ser desenhado como fluxo horizontal de anéis em `components/ModelosFluxo.tsx`.
 *
 * ⚠️ SIS-98 (29/09) — o parágrafo ACIMA é HISTÓRIA: a issue manda RELIGAR Outsourcing
 * («hoje comentado em `modelosAtuacao.ts` após SIS-165»), então voltaram a ser QUATRO
 * e o cabeçalho original vale outra vez ao pé da letra. A frase de apoio de cada um
 * continua aqui em `description`, mas DEIXOU DE SER DESENHADA: a issue pede «rótulos
 * only — retirar as descriptions do painel/UI». O dado fica porque é o único registro
 * da copy aprovada e porque `CircularEngagementModel` (fora da rota, íntegro no
 * repositório) ainda a consome — ver `ModelosFluxo.tsx`.
 *
 * `posicao` nao é decoracao: é o quadrante do palco, e o CSS le esse valor em
 * `data-pos` para colocar a estacao, girar a linha radial e escolher o lado em
 * que o painel abre. Cada quadrante aparece uma unica vez.
 */

export type PosicaoModelo = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

/** Chave do icone em `ui/ModelosIcones.tsx`. Os dados ficam sem JSX de proposito:
    todo o resto de `src/data` é `.ts` puro. */
export type IconeModelo = 'consultoria' | 'projetos' | 'especialistas' | 'outsourcing';

export type ModeloAtuacao = {
  id: string;
  label: string;
  /** Usado só quando o rotulo cheio nao cabe (celular). O nome completo continua
      no `aria-label` do botao e no painel. */
  shortLabel?: string;
  description: string;
  icone: IconeModelo;
  posicao: PosicaoModelo;
};

export const MODELOS_ATUACAO: readonly ModeloAtuacao[] = [
  {
    id: 'consultoria',
    label: 'Consultoria',
    description: 'Estratégia e direcionamento para decisões mais seguras.',
    icone: 'consultoria',
    posicao: 'top-left',
  },
  {
    id: 'projetos',
    label: 'Projetos',
    description: 'Planejamento e execução ponta a ponta.',
    icone: 'projetos',
    posicao: 'top-right',
  },
  {
    id: 'especialistas',
    label: 'Alocação de Especialistas',
    shortLabel: 'Especialistas',
    description: 'Profissionais adequados para cada desafio do negócio.',
    icone: 'especialistas',
    posicao: 'bottom-right',
  },
  /* ⚠️ SIS-98 (29/09) — RELIGADO. Este bloco estava comentado desde a SIS-165
     («Outsourcing saiu por pedido»); a SIS-98 manda o contrário, com estas palavras:
     «Outsourcing — religar (hoje comentado em `modelosAtuacao.ts` após SIS-165)».
     A `description` abaixo é a MESMA que estava guardada no comentário, sem uma
     vírgula de diferença — era exatamente para isto que ela não foi apagada. */
  {
    id: 'outsourcing',
    label: 'Outsourcing',
    description: 'Operação contínua com eficiência, qualidade e escala.',
    icone: 'outsourcing',
    posicao: 'bottom-left',
  },
] as const;

/** Qual nasce ativo. Pedido explicitamente: "Projetos" ja destacado na entrada,
    para o visitante ver o estado ativo antes de interagir. */
export const MODELO_INICIAL = 'projetos';
