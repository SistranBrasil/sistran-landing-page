/**
 * Geometria da trilha do roadmap.
 *
 * O path e as paradas nascem do mesmo cálculo para não divergirem: se o
 * desenho da curva mudar, os cards acompanham. As coordenadas vivem no
 * espaço do viewBox e são convertidas em porcentagem pelo componente,
 * porque o SVG escala com a largura do container.
 */

/** Largura do espaço de coordenadas. Não é pixel — o SVG escala. */
export const TRAIL_WIDTH = 1200

const MARGIN_Y = 170

/** Distância vertical entre duas paradas consecutivas, no espaço do viewBox. */
export const STOP_SPACING = 300

const STEP_Y = STOP_SPACING
const LEFT_X = 215
const RIGHT_X = 985

export type TrailPoint = { x: number; y: number }

export type TrailGeometry = {
  points: TrailPoint[]
  width: number
  height: number
  /** `d` do path serpenteante que liga todas as paradas. */
  d: string
  viewBox: string
}

export function buildTrail(count: number): TrailGeometry {
  const total = Math.max(count, 2)

  const points: TrailPoint[] = Array.from({ length: total }, (_, index) => ({
    x: index % 2 === 0 ? LEFT_X : RIGHT_X,
    y: MARGIN_Y + index * STEP_Y,
  }))

  const height = MARGIN_Y * 2 + STEP_Y * (total - 1)

  // Curva em S entre paradas consecutivas: os pontos de controle ficam na
  // vertical de cada ponta, o que garante tangente vertical na chegada e
  // uma emenda suave sem precisar de arcos.
  let d = `M ${points[0].x} ${points[0].y}`
  for (let index = 1; index < total; index += 1) {
    const from = points[index - 1]
    const to = points[index]
    const half = (to.y - from.y) / 2
    d += ` C ${from.x} ${from.y + half}, ${to.x} ${to.y - half}, ${to.x} ${to.y}`
  }

  return { points, width: TRAIL_WIDTH, height, d, viewBox: `0 0 ${TRAIL_WIDTH} ${height}` }
}

/**
 * Visual do card da parada, no molde da vitrine de entregas
 * (`docs/modal-vitrine.md` (projeto de origem) §2 e §10): gradiente de 145° com cinco paradas, do
 * quase-preto ao pastel, e o accent no stop de 82%. É essa progressão repetida
 * que dá unidade aos doze cards.
 *
 * A vitrine original troca de matiz por categoria (teal, vermelho, rosa). Aqui
 * a paleta é a da marca — branco e azuis, sem cor nova sem passar pelo
 * SKILL-Sistran (ver `legacy.css`) —, então o que varia por estágio é a
 * saturação e o quanto o gradiente clareia, não o matiz. Os hexes são
 * literais porque `linear-gradient` não aceita `var()` resolvido em tempo de
 * paint dentro de string montada aqui: são os mesmos valores de `legacy.css`.
 */
export type StopVisual = { gradient: string; accent: string }

const STAGE_VISUAL: Record<string, StopVisual> = {
  // Entregue: azul Sistran fechado, o mais sólido dos quatro.
  entregue: {
    gradient:
      "linear-gradient(145deg,#000c1c 0%,#002a52 30%,#00579b 60%,#0079cb 82%,#a5f0ff 100%)",
    accent: "#0079cb",
  },
  // Em evolução: ciano de sinal, o mais aceso — é o que está em movimento.
  evolucao: {
    gradient:
      "linear-gradient(145deg,#00101f 0%,#003a63 30%,#0091b8 60%,#0ed8f6 82%,#dff8ff 100%)",
    accent: "#0ed8f6",
  },
  // Plano aguardando decisão: gelo, deliberadamente menos saturado que entrega.
  negociacao: {
    gradient:
      "linear-gradient(145deg,#00101f 0%,#00304f 32%,#2f7fa0 62%,#a5f0ff 82%,#eafaff 100%)",
    accent: "#a5f0ff",
  },
  // Planejado: o mais apagado. Plano não pode parecer entrega feita.
  planejado: {
    gradient:
      "linear-gradient(145deg,#000c18 0%,#062338 32%,#2b5f80 62%,#7fb7cd 82%,#dcecf4 100%)",
    accent: "#7fb7cd",
  },
}

/**
 * Visual de uma parada, resolvido pelo estágio. Para diferenciar uma frente
 * específica, acrescente uma entrada por `stop.id` antes deste fallback — é o
 * mesmo papel de `PROJECT_VISUALS` na vitrine (§2).
 */
export function stopVisual(stage: string): StopVisual {
  return STAGE_VISUAL[stage] ?? STAGE_VISUAL.entregue
}

/**
 * Rótulo da coluna visual do modal — o equivalente de `VISUAL_SECTION_LABEL`
 * na vitrine (§12.5). Diz o que o leitor está vendo à direita, e é por estágio
 * porque é o estágio que muda o tempo verbal da parada.
 */
const STAGE_VISUAL_LABEL: Record<string, string> = {
  entregue: "Entrega em destaque",
  evolucao: "Frente em evolução",
  negociacao: "Plano em negociação",
  planejado: "Plano em desenho",
}

export function stageVisualLabel(stage: string) {
  return STAGE_VISUAL_LABEL[stage] ?? STAGE_VISUAL_LABEL.entregue
}

/** Converte coordenada do viewBox em porcentagem do container. */
export function toPercent(point: TrailPoint, height: number) {
  return { left: `${(point.x / TRAIL_WIDTH) * 100}%`, top: `${(point.y / height) * 100}%` }
}
