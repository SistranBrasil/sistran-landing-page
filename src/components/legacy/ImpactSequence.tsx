"use client"

import "./legacy.css"
import { motion, useScroll, useSpring, useTransform } from "motion/react"
import { useRef } from "react"
import { ScrollVideo } from "@/components/primitives/ScrollVideo"
import { useReducedMotion } from "@/lib/motion"
import { useVisibilityGate } from "@/lib/useVisibilityGate"
import { impactSequence } from "@/data/legacy"

/**
 * Sequência de montagem presa ao scroll — portada de `ImpactSequence.tsx` da
 * apresentação de legado (`apresentação/site`).
 *
 * A seção fica sticky e o gesto do leitor controla o `currentTime` do vídeo,
 * quadro a quadro, nos dois sentidos. A suavidade não vem do vídeo: o progresso
 * passa por uma mola (`useSpring`) antes de virar tempo, porque ligar o seek
 * direto ao scroll copia a granularidade do dispositivo — roda de mouse anda em
 * degraus de dezenas de pixels e a montagem sai aos saltos.
 *
 * Duas diferenças em relação à fonte, para seguir o que este projeto já usa:
 *
 * 1. O seek é do `ScrollVideo`, que acelera pelo próprio `seeking` em vez de um
 *    laço de `requestAnimationFrame`. Mesmo efeito, um mecanismo só no projeto.
 * 2. O quadro preto que o `<video>` pinta antes do primeiro quadro decodificado
 *    é coberto pelo `poster` (montagem concluída), no lugar do estado `ready`.
 *
 * O vídeo é decoração — nunca a única via para a informação. O texto está no
 * HTML servido, fora do vídeo, e continua legível sem JS, sem o arquivo e com
 * movimento reduzido (aí o percurso de scroll sai pelo CSS e o pôster assume).
 */

/**
 * Trecho final do scroll em que a cena encolhe e vira card pequeno, centrado
 * sobre o fundo da seção — mesmo mecanismo do hero, só sem o `drop`: aqui o card
 * não precisa emendar em nada, só terminar parado.
 */
const SHRINK = [0.72, 0.97] as const

export function ImpactSequence() {
  const section = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] })

  // Amortecedor do gesto. `damping` alto o bastante para não passar do ponto e
  // voltar: num vídeo, overshoot é a montagem desmontando por um instante.
  const eased = useSpring(scrollYProgress, { stiffness: 70, damping: 26, mass: 0.35 })

  // Encolhimento em card: montagem terminada, a cena full bleed recua até o
  // centro da tela e ganha raio, revelando o fundo da seção ao redor.
  const scale = useTransform(scrollYProgress, [SHRINK[0], SHRINK[1]], [1, 0.42])
  const radius = useTransform(scrollYProgress, [SHRINK[0], SHRINK[1]], [0, 28])
  // Texto e véu saem assim que o recuo começa: legenda sobrando fora de um card
  // pequeno não lê, e o gradiente escuro mancharia o fundo claro da seção.
  const copyFade = useTransform(scrollYProgress, [SHRINK[0], SHRINK[0] + 0.12], [1, 0])
  // `opacity: 0` ainda recebe seleção e foco: some de verdade ao chegar no fim.
  const copy = useVisibilityGate<HTMLDivElement>(copyFade, !reduced)

  return (
    <section
      id="impacto"
      ref={section}
      className="sequence lp-section--cream"
      data-static={reduced ? "true" : undefined}
      aria-labelledby="impacto-title"
    >
      <div className="sequence-sticky">
        <motion.div
          className="sequence-visual"
          style={reduced ? undefined : { scale, borderRadius: radius }}
        >
          <ScrollVideo
            className="sequence-video"
            src={impactSequence.src}
            poster={impactSequence.poster}
            progress={eased}
          />

          {/* Dentro do card, não do sticky: quando a cena recua o gradiente
              recua com ela, em vez de sobrar escurecendo o fundo da seção. */}
          <motion.div
            className="sequence-veil"
            aria-hidden="true"
            style={reduced ? undefined : { opacity: copyFade }}
          />
        </motion.div>

        <motion.div
          ref={copy}
          className="lp-container sequence-copy"
          style={reduced ? undefined : { opacity: copyFade }}
        >
          <p className="lp-eyebrow lp-tag">{impactSequence.kicker}</p>
          <h2 id="impacto-title" className="lp-display lp-display--lg">
            {impactSequence.title}
          </h2>
          <p className="lp-lead">{impactSequence.text}</p>
        </motion.div>
      </div>
    </section>
  )
}
