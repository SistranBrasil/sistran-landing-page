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
