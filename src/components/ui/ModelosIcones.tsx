/**
 * Icones dos modelos de atuacao (SIS-99).
 *
 * Quatro desenhos com a MESMA gramatica: viewBox 24, traco de 1.5, ponta e junta
 * redondas, nenhum preenchimento. É o que faz os quatro lerem como um conjunto e
 * nao como icones vindos de bibliotecas diferentes — o projeto usa `lucide-react`
 * em outros lugares, mas nenhum par do Lucide dizia "consultoria" e "outsourcing"
 * de forma distinguivel a 44px, e o Lucide nao tem o compasso de desenho.
 *
 * `vectorEffect="non-scaling-stroke"` NAO é usado aqui de proposito: o icone muda
 * de tamanho entre celular e desktop, e o traco precisa acompanhar.
 *
 * A cor vem de `currentColor`, e quem a troca é o CSS da estacao — assim o estado
 * ativo é uma regra de CSS, e nao um `prop` que obrigaria o React a re-renderizar
 * os quatro icones a cada hover.
 */

import type { IconeModelo } from '@/data/modelosAtuacao';

type Props = { className?: string };

const COMUM = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  focusable: 'false',
  'aria-hidden': true,
} as const;

/* Compasso de desenho sobre o arco que ele traca: analise antes da execucao. */
function IconeConsultoria({ className }: Props) {
  return (
    <svg {...COMUM} className={className}>
      <circle cx="12" cy="4.5" r="1.75" />
      <path d="M10.9 6.1 6.4 20" />
      <path d="M13.1 6.1 17.6 20" />
      <path d="M4.6 15.4a11 11 0 0 0 14.8 0" />
    </svg>
  );
}

/* Quadro de projeto com marcos ligados: planejamento e execucao ponta a ponta. */
function IconeProjetos({ className }: Props) {
  return (
    <svg {...COMUM} className={className}>
      <rect x="2.75" y="4.25" width="18.5" height="15" rx="2.25" />
      <path d="M2.75 8.25h18.5" />
      <path d="M6.5 15.5 10 12.25l3 2.25 4.5-4.25" />
      <circle cx="6.5" cy="15.5" r="1.1" />
      <circle cx="17.5" cy="10.25" r="1.1" />
    </svg>
  );
}

/* Grupo de pessoas — uma a frente, duas atras: o time montado por perfil. */
function IconeEspecialistas({ className }: Props) {
  return (
    <svg {...COMUM} className={className}>
      <circle cx="9.25" cy="8" r="3.1" />
      <path d="M3.5 19.25a5.75 5.75 0 0 1 11.5 0" />
      <path d="M16.25 5.4a3.1 3.1 0 0 1 0 5.2" />
      <path d="M17.5 14.1a5.75 5.75 0 0 1 3 5.15" />
    </svg>
  );
}

/* Ciclo fechado em volta de uma operacao: continuidade, nao entrega pontual. */
function IconeOutsourcing({ className }: Props) {
  return (
    <svg {...COMUM} className={className}>
      <path d="M12 2.75A9.25 9.25 0 0 1 21.25 12" />
      <path d="M12 21.25A9.25 9.25 0 0 1 2.75 12" />
      <path d="M18.4 3.1v3.6h-3.6" />
      <path d="M5.6 20.9v-3.6h3.6" />
      <rect x="8.75" y="8.75" width="6.5" height="6.5" rx="1.75" />
    </svg>
  );
}

export const ICONES_MODELOS: Record<IconeModelo, React.ComponentType<Props>> = {
  consultoria: IconeConsultoria,
  projetos: IconeProjetos,
  especialistas: IconeEspecialistas,
  outsourcing: IconeOutsourcing,
};
