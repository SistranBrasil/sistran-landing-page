/**
 * Geometria da trilha serpenteante.
 *
 * O path e as paradas nascem do mesmo cálculo para não divergirem: se o desenho
 * da curva mudar, os cards acompanham. As coordenadas vivem no espaço do
 * viewBox e são convertidas em porcentagem pelo componente, porque o SVG escala
 * com a largura do container.
 */

/** Largura do espaço de coordenadas. Não é pixel — o SVG escala. */
export const TRAIL_WIDTH = 1200;

const MARGIN_Y = 150;

/**
 * Distância vertical entre duas paradas consecutivas, no espaço do viewBox.
 *
 * A LP de origem usa 300 para 12 paradas. Aqui são 24: com 300 a trilha teria
 * ~7.240 unidades de altura (6× a largura) e a seção viraria seis telas de
 * rolagem. 200 mantém a proporção total próxima da original sem apertar os
 * cards, que aqui são compactos (geração + empresa + frente).
 */
export const STOP_SPACING = 200;

const STEP_Y = STOP_SPACING;
const LEFT_X = 215;
const RIGHT_X = 985;

export type TrailPoint = { x: number; y: number };

export type TrailGeometry = {
  points: TrailPoint[];
  width: number;
  height: number;
  /** `d` do path serpenteante que liga todas as paradas. */
  d: string;
  viewBox: string;
};

export function buildTrail(count: number): TrailGeometry {
  const total = Math.max(count, 2);

  const points: TrailPoint[] = Array.from({ length: total }, (_, index) => ({
    x: index % 2 === 0 ? LEFT_X : RIGHT_X,
    y: MARGIN_Y + index * STEP_Y,
  }));

  const height = MARGIN_Y * 2 + STEP_Y * (total - 1);

  // Curva em S entre paradas consecutivas: os pontos de controle ficam na
  // vertical de cada ponta, o que garante tangente vertical na chegada e uma
  // emenda suave sem precisar de arcos.
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < total; index += 1) {
    const from = points[index - 1];
    const to = points[index];
    const half = (to.y - from.y) / 2;
    d += ` C ${from.x} ${from.y + half}, ${to.x} ${to.y - half}, ${to.x} ${to.y}`;
  }

  return { points, width: TRAIL_WIDTH, height, d, viewBox: `0 0 ${TRAIL_WIDTH} ${height}` };
}
