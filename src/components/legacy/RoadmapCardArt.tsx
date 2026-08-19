/**
 * Traços do card da parada — o mesmo desenho do card da vitrine
 * (`docs/modal-vitrine.md` §10.5): cinco curvas tracejadas marchando, nós
 * pulsando nas interseções e, só no card em foco, uma varredura horizontal.
 *
 * `preserveAspectRatio="xMidYMid slice"` é o que permite reusar um único
 * viewBox 300×440 em cards de alturas diferentes sem distorcer o desenho.
 *
 * Decoração pura: `aria-hidden`, e as animações são todas de opacidade e
 * `stroke-dashoffset`. Congeladas por reduced motion, o card não perde nada.
 */
export function RoadmapCardArt() {
  return (
    <svg
      className="roadmap-card-lines"
      viewBox="0 0 300 440"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <path className="rc-line rc-line--a" d="M -40 80 Q 80 20 200 100 Q 280 150 340 120" />
      <path className="rc-line rc-line--b" d="M -20 200 Q 100 160 220 210 Q 290 240 340 210" />
      <path className="rc-line rc-line--c" d="M -20 320 Q 120 280 240 340 Q 300 370 340 350" />
      <path className="rc-line rc-line--d" d="M 60 -20 Q 20 120 50 240 Q 80 340 40 440" />
      <path className="rc-line rc-line--e" d="M 240 -20 Q 280 130 250 250 Q 220 360 260 440" />

      <circle className="rc-node" cx="200" cy="100" r="2.5" />
      <circle className="rc-node rc-node--2" cx="50" cy="240" r="2" />
      <circle className="rc-node rc-node--3" cx="220" cy="210" r="2" />
      <circle className="rc-node rc-node--4" cx="240" cy="340" r="2.5" />

      {/* Varredura: o CSS a mostra apenas na parada em foco. */}
      <line className="rc-scan" x1="0" y1="0" x2="300" y2="0" />
    </svg>
  )
}
