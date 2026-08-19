"use client"

import "./legacy.css"
import { useMotionValueEvent, useScroll } from "motion/react"
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { roadmapIntro, roadmapStops, stageLabel } from "@/data/legacy"
import { useReducedMotion } from "@/lib/motion"
import { STOP_SPACING, TRAIL_WIDTH, buildTrail, stopVisual } from "@/lib/legacyRoadmap"
import { RoadmapCardArt } from "./RoadmapCardArt"
import { RoadmapStopDialog } from "./RoadmapStopDialog"

const trail = buildTrail(roadmapStops.length)

/**
 * Margem de chegada, em unidades do viewBox: metade da distância entre paradas.
 *
 * O offset do scroll mantém a marca sempre no centro da viewport, então quem
 * decide a altura do card em destaque é esta régua. Com uma margem pequena o
 * destaque só trocava quando a marca já tinha passado o nó, e o card ficava
 * acendendo no centro para depois subir uma tela inteira ainda em destaque —
 * era por isso que o card aceso aparecia no topo, e a última parada só acendia
 * quando o leitor já estava no FAQ.
 *
 * Com metade do vão, o destaque é a parada MAIS PRÓXIMA da marca, não a última
 * já passada: cada card acende meio vão antes de chegar ao centro e apaga meio
 * vão depois, o que o deixa em média na altura do olhar.
 */
const NODE_REACH = STOP_SPACING / 2


/**
 * Trilha do roadmap: rota tracejada serpenteando entre as paradas, com
 * a marca da Sistran percorrendo o caminho conforme o scroll avança e o
 * trecho já percorrido sendo pintado atrás dela.
 *
 * A rota é decoração; o conteúdo é a lista ordenada de paradas, que existe no
 * HTML servido e permanece legível sem JS. Abaixo de 64rem o CSS descarta a
 * curva e a marca, e a mesma lista vira uma linha do tempo vertical — nenhuma
 * parada depende do movimento para ser alcançada.
 *
 * Cada card resume a frente e abre `RoadmapStopDialog` com o detalhe completo.
 * O resumo do card não depende do modal: sem JS o texto essencial continua na
 * página, e o modal é o aprofundamento.
 */
export function RoadmapTrail() {
  const stage = useRef<HTMLDivElement>(null)
  const route = useRef<SVGPathElement>(null)
  const painted = useRef<SVGPathElement>(null)
  const traveler = useRef<HTMLDivElement>(null)
  const [reached, setReached] = useState(0)
  const [opened, setOpened] = useState<number | null>(null)
  const reduced = useReducedMotion()

  // Alvo é o palco, não a seção, e a âncora é o centro da viewport: assim a
  // marca fica sempre na altura que o leitor está olhando — medir pelo topo da
  // seção a jogava uma tela adiante, com a rota já pintada e a logo fora de vista.
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start center", "end center"] })

  const place = useCallback((value: number) => {
    const progress = Math.min(Math.max(value, 0), 1)

    // `pathLength={1}` normaliza o comprimento, então o offset é o próprio
    // complemento do progresso — sem depender de getTotalLength para pintar.
    painted.current?.style.setProperty("stroke-dashoffset", String(1 - progress))

    const line = route.current
    const mark = traveler.current

    // A altura da marca vem do comprimento de arco da curva, que não avança em
    // proporção ao progresso: nos trechos curvos ela sobe menos por unidade de
    // scroll. Medir as paradas por `progress * height` fazia o destaque atrasar
    // — a logo já estava na bolinha e o card seguia apagado. Então a régua é o
    // `y` real da marca, e só cai no linear se o path ainda não foi medido.
    let markY = progress * trail.height

    if (line && mark) {
      const point = line.getPointAtLength(line.getTotalLength() * progress)
      markY = point.y
      mark.style.setProperty("--x", `${(point.x / TRAIL_WIDTH) * 100}%`)
      mark.style.setProperty("--y", `${(point.y / trail.height) * 100}%`)
    }

    // Meio vão de tolerância: o destaque é a parada mais próxima da marca, o
    // que a mantém na altura do olhar em vez de já no topo da tela.
    const passed = trail.points.filter((point) => point.y <= markY + NODE_REACH).length
    setReached(Math.max(passed - 1, 0))
  }, [])

  useEffect(() => {
    // Com menos movimento, a rota nasce inteira e a marca fica no destino:
    // o estado final é o legível, e nada fica preso em opacity 0.
    place(reduced ? 1 : 0)
  }, [place, reduced])

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (reduced) return
    place(value)
  })

  return (
    <section id="roadmap" className="lp-section lp-section--cream roadmap" aria-labelledby="roadmap-title">
      <div className="lp-container">
        <div className="roadmap-head">
          <p className="lp-eyebrow lp-tag">{roadmapIntro.kicker}</p>
          <h2 id="roadmap-title" className="lp-display lp-display--lg">
            {roadmapIntro.title}
          </h2>
          <p className="lp-lead">{roadmapIntro.text}</p>
        </div>
      </div>

      {/* Fora do .container de propósito: a trilha usa quase toda a largura. */}
      <div ref={stage} className="roadmap-stage">
        <svg className="roadmap-svg" viewBox={trail.viewBox} aria-hidden="true">
          <path ref={route} className="roadmap-route" d={trail.d} />
          <path ref={painted} className="roadmap-route-done" d={trail.d} pathLength={1} />
        </svg>

        <ol className="roadmap-stops">
          {roadmapStops.map((stop, index) => {
            const point = trail.points[index]
            const visual = stopVisual(stop.stage)
            const position = {
              "--x": `${(point.x / TRAIL_WIDTH) * 100}%`,
              "--y": `${(point.y / trail.height) * 100}%`,
              "--stop-accent": visual.accent,
              "--stop-gradient": visual.gradient,
            } as CSSProperties

            return (
              <li
                key={stop.id}
                className={[
                  "roadmap-stop",
                  index % 2 === 0 ? "roadmap-stop--left" : "roadmap-stop--right",
                  index <= reached ? "is-reached" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={position}
                aria-current={index === reached ? "step" : undefined}
              >
                <span className="roadmap-node" aria-hidden="true" />

                {/* Camadas na ordem da vitrine (§10.5): gradiente, traços,
                    véu escuro, brilho de canto, conteúdo — e o véu de
                    profundidade por ÚLTIMO, para escurecer inclusive o texto
                    das paradas que ainda não foram alcançadas. */}
                <article className="roadmap-card" data-stage={stop.stage}>
                  <span className="roadmap-card-bg" aria-hidden="true" />
                  <RoadmapCardArt />
                  <span className="roadmap-card-veil" aria-hidden="true" />
                  <span className="roadmap-card-glow" aria-hidden="true" />

                  <div className="roadmap-card-body">
                    <header className="roadmap-card-head">
                      {/* Monograma, não a logo: quem carrega a marca é o
                          cartão branco abaixo, e repetir a logo aqui roubava
                          dele o papel. */}
                      <span className="roadmap-badge" aria-hidden="true">
                        <b>{stop.monogram}</b>
                      </span>
                      <div>
                        <p className="roadmap-client">{stop.client}</p>
                        <p className="roadmap-index lp-numeric">
                          Etapa {String(index + 1).padStart(2, "0")} / {roadmapStops.length}
                        </p>
                      </div>
                      <p className="roadmap-stage-tag">{stop.stageTag ?? stageLabel[stop.stage]}</p>
                    </header>

                    {/* Cartão branco com a marca, no mesmo molde do modal
                        (§12.6 A): é ele que dá ao card algo para "clicar".
                        Só aparece onde existe arquivo de logo — com monograma
                        ampliado o cartão viraria uma moldura vazia. Todo
                        decorativo: cliente, estágio e título já estão no texto. */}
                    {stop.logo ? (
                      <div className="roadmap-card-logo" aria-hidden="true">
                        <div className="roadmap-card-logo-frame">
                          {/* Logos são arquivos estáticos de proporções variadas;
                              o <img> simples evita otimização desnecessária. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={stop.logo} alt="" loading="lazy" decoding="async" />
                        </div>
                        <p className="roadmap-card-logo-tag">
                          {stop.stageTag ?? `${stop.monogram} · ${stageLabel[stop.stage]}`}
                        </p>
                      </div>
                    ) : null}

                    {/* Chips no accent, três no card e todos no modal — a mesma
                        divulgação progressiva da vitrine (§10.5). */}
                    <ul className="roadmap-chips" aria-hidden="true">
                      {stop.detail.stack.slice(0, 3).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    <h3>{stop.title}</h3>
                    <p className="roadmap-text">{stop.text}</p>

                    {/* Checklist: três itens no card, todos no modal. Fica no
                        HTML sempre — na linha do tempo vertical ele é o corpo
                        da parada; no desktop, o CSS o revela na parada em foco. */}
                    <ul className="roadmap-topics">
                      {stop.detail.done.slice(0, 3).map((item) => (
                        <li key={item}>
                          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" strokeLinecap="round" />
                            <path d="M22 4L12 14.01l-3-3" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {stop.next ? (
                      <p className="roadmap-next">
                        <b>Próxima decisão:</b> {stop.next}
                      </p>
                    ) : null}

                    {/* Botão real, e o ::after dele estica sobre o card inteiro:
                        o alvo de clique é o card todo, mas quem navega por teclado
                        recebe um único foco por parada — não doze áreas clicáveis
                        sobrepostas. O aria-label repete o título porque "Clique
                        para saber mais" doze vezes não diz sobre o quê. */}
                    <button
                      type="button"
                      className="roadmap-card-more"
                      aria-haspopup="dialog"
                      aria-label={`Saber mais sobre ${stop.title}`}
                      onClick={() => setOpened(index)}
                    >
                      <span aria-hidden="true">Ver detalhes e evidências</span>
                      <span className="roadmap-card-more-arrow" aria-hidden="true">
                        →
                      </span>
                    </button>
                  </div>

                  <span className="roadmap-card-depth" aria-hidden="true" />
                </article>
              </li>
            )
          })}
        </ol>

        <div ref={traveler} className="roadmap-traveler" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/imagens/luminna-latam.png" alt="" width={889} height={760} decoding="async" />
        </div>
      </div>

      {/* Um diálogo por vez, montado fora do palco: dentro da trilha ele
          herdaria os ancestrais transformados dos cards. */}
      {opened !== null ? (
        <RoadmapStopDialog
          key={roadmapStops[opened].id}
          stop={roadmapStops[opened]}
          index={opened}
          total={roadmapStops.length}
          onClose={() => setOpened(null)}
        />
      ) : null}
    </section>
  )
}
