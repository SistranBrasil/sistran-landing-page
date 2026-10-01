import type { CSSProperties } from 'react';
import { TRAJECTORY_CATEGORY_META } from '@/data/trajectory';
import { FAIXA, alturaDaTrilha, caminhoDaTrilha, type NoDaTrilha } from './trajectoryGeometry';

/**
 * SIS-202 — a linha ciano do fluxo detalhado (§6 do doc).
 *
 * ⚠️ `pathLength={1}` É O TRUQUE QUE FAZ O DESENHO PROGRESSIVO SER CSS PURO. Com
 * ele, `stroke-dasharray` e `stroke-dashoffset` passam a valer na escala 0–1, em vez
 * de na medida real do caminho — e a medida real só se obtém com
 * `path.getTotalLength()`, que é DOM e mudaria a cada vez que a lista crescesse.
 * Assim o CSS escreve `stroke-dashoffset: calc(1 - var(--percorrido))` e o único
 * trabalho por quadro é atualizar uma variável (ver `TrajectoryScrollytelling`). Sem
 * medição, sem `useEffect`, sem layout recalculado a cada evento de rolagem, que é o
 * que o §12 pede.
 *
 * A linha vem em duas camadas: um traço de base apagado (o percurso inteiro, para a
 * pessoa ver que há caminho adiante) e o traço ciano por cima, revelado. Os nós
 * circulares ficam na camada de cima e acendem por proximidade do ativo.
 *
 * `aria-hidden`: é a representação gráfica de uma sequência que já está escrita nos
 * cards, um por um. Anunciá-la seria ler a lista duas vezes.
 */
export function TimelinePath({ nos, ativo }: { nos: readonly NoDaTrilha[]; ativo: number }) {
  /* ⚠️ OS DOIS EIXOS TROCARAM DE PAPEL em 30/09: quem cresce com a quantidade de
     paradas é a ALTURA, e a largura é a faixa fixa em que a linha serpenteia. Antes
     era o contrário (`larguraDaTrilha`, altura `FAIXA`). Se um dos dois ficar no
     lugar antigo, a `viewBox` recorta a curva em vez de contê-la — e o corte só
     aparece nas últimas paradas, que é onde ninguém testa. */
  const altura = alturaDaTrilha(nos);
  const caminho = caminhoDaTrilha(nos);

  return (
    <svg
      className="trajetoria-linha"
      /* Largura e altura em px IGUAIS à `viewBox`: 1:1, sem escala. É isso que
         mantém a espessura do traço idêntica à da miniatura da preview — se o SVG
         esticasse, a linha engordaria junto e a continuidade do §2 se perderia. */
      width={FAIXA}
      height={altura}
      viewBox={`0 0 ${FAIXA} ${altura}`}
      aria-hidden
      focusable="false"
    >
      <path className="trajetoria-linha-base" d={caminho} pathLength={1} />
      <path className="trajetoria-linha-ativa" d={caminho} pathLength={1} />
      {nos.map((no, i) => (
        <circle
          key={`no-${i}`}
          className="trajetoria-linha-no"
          data-estado={i === ativo ? 'ativo' : i < ativo ? 'vencido' : 'adiante'}
          cx={no.x}
          cy={no.y}
          r={7}
          style={
            no.categoria
              ? ({ fill: TRAJECTORY_CATEGORY_META[no.categoria].color } as CSSProperties)
              : undefined
          }
        />
      ))}
    </svg>
  );
}
