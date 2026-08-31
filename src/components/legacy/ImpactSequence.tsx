"use client"

import "./legacy.css"
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react"
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
 * 2. A revelação da fonte (estado `ready` + `opacity`) existe, mas mora no
 *    `ScrollVideo`, atrás da prop `revelarQuandoPronto`, porque o hero usa o
 *    mesmo componente e não deve abrir vazio. Enquanto não há quadro
 *    decodificado o `<video>` fica em `opacity: 0` e o que se vê é o FUNDO da
 *    seção — não o `poster`, que é a montagem já concluída e faria a sequência
 *    começar pelo fim. O pôster segue no lugar para o modo de movimento
 *    reduzido, onde não há seek.
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

/**
 * Meia-vida de um capítulo: quanto do percurso ele leva para entrar e para sair.
 * Os capítulos estão a 0.24 de distância (ver `impactSequence.chapters`), então
 * 0.07 deixa cada um parado e legível na maior parte da sua vez, com uma
 * passagem curta em que o que sai e o que entra se cruzam — em vez de um corte
 * seco ou de dois textos sobrepostos por muito tempo.
 */
const CAP_BORDA = 0.07

/**
 * Um capítulo. Componente próprio, e não um `useTransform` dentro de `.map`:
 * hooks em laço só são legítimos com comprimento garantido, e "garantido por
 * enquanto" é o tipo de invariante que a próxima edição de `legacy.ts` quebra em
 * silêncio. Aqui a regra é estrutural — um capítulo, um componente, seus hooks.
 *
 * Sob movimento reduzido não recebe `style` nenhum: os três ficam visíveis,
 * empilhados pelo CSS, e a seção lê como um bloco de texto com três subtítulos.
 * É a mesma política do resto da página (estado final é o default).
 */
function SequenceChapter({
  progress,
  at,
  title,
  text,
  reduced,
}: {
  progress: MotionValue<number>
  at: number
  title: string
  text: string
  reduced: boolean
}) {
  /* Vai de 0.28 a 1, NÃO de 0 a 1 — e isso é decisão de acessibilidade, não de
     estética. Se os capítulos desaparecessem por completo, os três teriam de
     dividir o mesmo lugar na tela (senão a coluna cresceria com dois blocos
     invisíveis), e aí a legibilidade de dois terços do texto passaria a depender
     da animação: sem JavaScript, ou se o gesto parasse no meio, o leitor ficaria
     com um capítulo e dois fantasmas empilhados.

     Ficando os três em fluxo normal e sempre presentes, o percurso muda a
     ÊNFASE — o capítulo da vez acende, os outros recuam para um cinza legível —
     e o pior caso possível é ler os três com o mesmo peso. Que é exatamente o
     que a seção entrega sob movimento reduzido. */
  const opacity = useTransform(
    progress,
    [at - CAP_BORDA, at, at + 0.24 - CAP_BORDA, at + 0.24],
    [0.28, 1, 1, 0.28],
  )
  /* Sobe pouco: 10px. A cena atrás já se move, e um texto que viaja junto com
     ela compete com o vídeo em vez de comentá-lo. Como os três ficam em fluxo,
     o deslocamento tem de ser pequeno o suficiente para não parecer que o bloco
     saiu do lugar em relação aos vizinhos. */
  const y = useTransform(progress, [at - CAP_BORDA, at], [10, 0])

  return (
    <motion.div
      className="sequence-chapter"
      style={reduced ? undefined : { opacity, y }}
    >
      <h3 className="sequence-chapter-title">{title}</h3>
      <p className="sequence-chapter-text">{text}</p>
    </motion.div>
  )
}

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
            /* A seção abre no fundo e a montagem surge com o scroll: sem isto o
               pôster (quadro final) é o que se vê ao entrar. As saídas de
               emergência da `opacity: 0` estão em `legacy.css` (movimento
               reduzido) e no próprio `ScrollVideo` (falha de carregamento). */
            revelarQuandoPronto
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

          {/* Três capítulos que se sucedem no percurso (Prioridade 4). O
              cabeçalho acima fica: ele nomeia a seção, e os capítulos contam o
              que a montagem do vídeo está mostrando em cada trecho.

              A ordem no DOM é a ordem de leitura, e é a mesma dos `at`: sem
              JavaScript, com movimento reduzido ou com o vídeo indisponível, os
              três aparecem juntos, em sequência, e o texto continua completo. */}
          <div className="sequence-chapters">
            {impactSequence.chapters.map((cap) => (
              <SequenceChapter
                key={cap.id}
                progress={scrollYProgress}
                at={cap.at}
                title={cap.title}
                text={cap.text}
                reduced={reduced}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
