"use client"

import "./legacy.css"
import { motion, useScroll, useSpring, useTransform } from "motion/react"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import { useRevealTrigger } from "@/components/motion/useRevealTrigger"
import { ScrollVideo } from "@/components/primitives/ScrollVideo"
import { useReducedMotion } from "@/lib/motion"
import { useVisibilityGate } from "@/lib/useVisibilityGate"
import { impactSequence } from "@/data/legacy"
import { criarConsultaDeMedia } from "@/lib/mediaStore"

/* SIS-182 — o mesmo 1024 dos outros palcos dirigidos, no formato da casa. */
const useSequenciaLarga = criarConsultaDeMedia("(min-width: 1024px)")

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

/* SIS-99 — os três capítulos (`Compreender`, `Transformar`, `Validar e evoluir`)
   saíram a pedido, e com eles todo o maquinário que os sustentava: o componente
   `SequenceChapter`, as constantes `CAP_PASSO` (0.24, distância entre os `at`) e
   `CAP_BORDA` (0.07, meia-vida de entrada/saída), a máscara de troca por
   `clipPath` e o portão de seleção que escondia de verdade os parágrafos em
   `opacity: 0`.

   Com isso SIS-92 — "textos sobrepostos entre etapas" — deixa de ter objeto: a
   sobreposição acontecia justamente na janela em que um capítulo saía e o
   seguinte entrava na mesma célula de grade. Sem etapas, não há troca.

   O que sobrou da seção é o cabeçalho: kicker "Desafios no desenvolvimento de
   software", o `<h2>` "Sobre o Luminna AI" e o parágrafo. O `data-dirigindo`
   CONTINUA sendo escrito, e não é resíduo das etapas: ele também é o portão da
   escala grande do título (`.sequence[data-dirigindo] .sequence-copy
   .lp-display`, em `legacy.css`), que é agora a única voz do sticky. */

export function ImpactSequence() {
  const section = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  /* `data-dirigindo` é o mesmo portão que `Solutions` e `Metrics` usam: escrito
     só pelo JS, só acima de 1024px, só sem movimento reduzido. Todo o CSS que
     empilha os três capítulos no MESMO lugar vive atrás dele, então o default
     servido — sem JS, em telas estreitas, com movimento reduzido — continua
     sendo os três em fluxo, legíveis, sem depender de animação.

     Nasce em `false` nos dois lados (servidor e primeiro render) para a árvore
     hidratar idêntica; converge depois de montar. */
  /* SIS-182 — as duas metades agora são store, e o efeito inteiro saiu. Este era o
     ÚNICO da família que o `react-hooks/set-state-in-effect` de fato acusava
     (`ImpactSequence.tsx:77`, o `setDirigindo(false)` do atalho de movimento
     reduzido); os outros escapavam do aviso por chamarem o `setState` através de
     uma função nomeada, com o mesmo defeito. O corpo antigo:

     const [dirigindo, setDirigindo] = useState(false)
     useEffect(() => {
       if (reduced) { setDirigindo(false); return }
       const mq = window.matchMedia("(min-width: 1024px)")
       const aplicar = () => setDirigindo(mq.matches)
       aplicar()
       mq.addEventListener("change", aplicar)
       return () => mq.removeEventListener("change", aplicar)
     }, [reduced]) */
  const largo = useSequenciaLarga()
  const dirigindo = largo && !reduced

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] })

  // Amortecedor do gesto. `damping` alto o bastante para não passar do ponto e
  // voltar: num vídeo, overshoot é a montagem desmontando por um instante.
  const eased = useSpring(scrollYProgress, { stiffness: 70, damping: 26, mass: 0.35 })

  // Encolhimento em card: montagem terminada, a cena full bleed recua até o
  // centro da tela e ganha raio, revelando o fundo da seção ao redor.
  /* Enquadramento. Antes de SIS-99 esta curva tinha cinco paradas casadas com as
     batidas dos capítulos (0.08 / 0.32 / 0.56): cada etapa recebia um recorte um
     pouco diferente, para o quadro reagir à troca de texto. Sem etapas, aquelas
     paradas não marcam mais nada — mantê-las seria um zoom que aperta e alivia em
     pontos que nenhum conteúdo justifica.

     No lugar, uma aproximação única e lenta ao longo de toda a montagem: 1.04 ->
     1.10, resolvida antes do recuo começar. Ela dá o mesmo que as cinco paradas
     davam de útil (o quadro não fica inerte durante duas telas de rolagem) sem
     fingir batidas.

     É multiplicado pelo `SHRINK` em vez de ser uma segunda transformação num
     segundo elemento: um só `scale` no `.sequence-visual`, um só relógio. Os
     fatores ficam >= 1 para o recorte nunca descolar das bordas e revelar o fundo
     da seção por dentro da moldura. */
  const enquadramento = useTransform(scrollYProgress, [0, SHRINK[0]], [1.04, 1.1])
  const recuo = useTransform(scrollYProgress, [SHRINK[0], SHRINK[1]], [1, 0.42])
  const scale = useTransform([recuo, enquadramento], ([r, e]: number[]) => r * e)
  /* `quadroX` saiu com SIS-99: o deslocamento lateral de 3% existia para o quadro
     abrir espaço à esquerda no capítulo do meio, o mais apertado dos três. Sem
     capítulos não há aperto, e um quadro que desliza sem motivo é só drift. */
  const radius = useTransform(scrollYProgress, [SHRINK[0], SHRINK[1]], [0, 28])
  // Texto e véu saem assim que o recuo começa: legenda sobrando fora de um card
  // pequeno não lê, e o gradiente escuro mancharia o fundo claro da seção.
  const copyFade = useTransform(scrollYProgress, [SHRINK[0], SHRINK[0] + 0.12], [1, 0])
  // `opacity: 0` ainda recebe seleção e foco: some de verdade ao chegar no fim.
  const copy = useVisibilityGate<HTMLDivElement>(copyFade, !reduced)

  /* SIS-197 — a legenda desta seção só sabia SAIR: `copyFade` a apaga quando o
     recuo começa (`SHRINK`), e nada nunca a trouxe. Ela aparecia pronta, no
     mesmo quadro em que a seção encosta na tela, e essa era a entrada ad-hoc
     inconsistente que o Efeito 4 vem uniformizar.
     O escopo é o `.sequence-sticky`, e não o `.sequence-copy`: este último já
     carrega `ref={copy}` do `useVisibilityGate`, e fundir dois refs num nó que
     também recebe `style` de `motion` é risco sem ganho — o pai serve igual.
     Marcar `transform` nos FILHOS do sticky é inócuo: só ancestrais do elemento
     preso viram contexto de contenção, e o `.sequence-sticky` continua sem
     nenhum ancestral transformado. */
  /* Desestruturado, e não `legenda.ref`: o `react-hooks/refs` lê o acesso à
     propriedade dentro do JSX como leitura de ref durante o render e acusa erro
     (o portão de lint da casa é 0 erros). O nome sai do hook já como ref. */
  const { ref: legendaRef } = useRevealTrigger<HTMLDivElement>()

  /* SIS-214, alvo 4 (spy/rótulos) — NÃO HÁ NADA A MUDAR em
     `src/data/pageSections.ts`, e fica escrito para a próxima pessoa não ir
     procurar: o spy da home lista `top`, `solucoes`, `resultados`, `contato` e
     `social` (`pageSections.ts:65-69`), e `impacto` NUNCA esteve lá. Nenhum link do
     projeto aponta para `#impacto` (`grep '#impacto' src` volta vazio). O `id`
     abaixo segue existindo porque é ele que casa com o `aria-labelledby` e serve de
     âncora de URL — não porque alguma navegação dependa dele.
     A hierarquia de títulos também não mudou: continua um `<h2>` só, e o que a
     inversão trocou de lugar foi um `<p>`, não um nível de cabeçalho. */
  return (
    <section
      id="impacto"
      ref={section}
      className="sequence lp-section--cream"
      data-static={reduced ? "true" : undefined}
      data-dirigindo={dirigindo ? "true" : undefined}
      aria-labelledby="impacto-title"
    >
      <div className="sequence-sticky" ref={legendaRef}>
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
          {/* SIS-214 — A ORDEM DE LEITURA DESTE BLOCO FOI INVERTIDA: o `kicker`
              ("Desafios no desenvolvimento de software") ficava AQUI, acima do
              `<h2>`, como sobretítulo. Agora ele é o último dos três, e o
              capítulo abre pelo "Sobre o Luminna AI".

              O pedido é de ORDEM na home — Números -> Sobre o Luminna AI ->
              Desafios —, e a ordem que o leitor percebe é a desta pilha, não a
              dos componentes em `src/app/page.tsx`: entre `<Metrics />` (id
              `resultados`) e `<ImpactSequence />` não há nenhuma seção ativa (o
              que há entre as duas no arquivo é comentário — `SolutionsToMetrics`,
              `MetricsStrip`, `NotchDivider`, `SignalMarquee`, `MosaicHandoff`,
              `About`). Ou seja: os dois títulos que a issue quer separar moram na
              MESMA seção, e era só aqui que "Desafios" aparecia antes.

              O QUE NÃO FOI FEITO, de propósito: nenhuma seção nova entre Números
              e esta, e nenhuma etapa de volta. A issue diz "o que restar de
              Desafios, se houver conteúdo além do kicker — não inventar etapas de
              volta", e não restou nada: a SIS-99 removeu os três capítulos
              (`Compreender`, `Transformar`, `Validar e evoluir`) e "Desafios" é
              literalmente uma linha de texto. Criar um bloco para hospedá-la
              seria inventar seção.

              `--reveal-i` acompanha a ordem nova (SIS-197: é a ordem de leitura,
              e o intervalo entre irmãos é `--motion-stagger-reveal`, 80ms) —
              deixá-los como estavam faria o chip entrar primeiro e o título
              depois, contra a leitura.

              A margem do chip é corrigida por CSS, não por classe nova: ver
              `.sequence-copy .lp-lead + .lp-eyebrow` em `legacy.css`. */}
          {/* Mesma fronteira anotada na `SolutionsStory`: SIS-194 cobre títulos
              por `RevealText`, e cobriu só `marcas-grade-titulo`. Este `<h2>` não
              estava no lote nem tem `RevealText`. Se a SIS-194 voltar para ele, o
              `data-reveal` daqui SAI — dois no mesmo nó seriam duas entradas
              disputando o mesmo elemento. */}
          <h2
            id="impacto-title"
            className="lp-display lp-display--lg"
            data-reveal="fade-up"
            style={{ "--reveal-i": 0 } as CSSProperties}
          >
            {impactSequence.title}
          </h2>
          <p
            className="lp-lead"
            data-reveal="fade-up"
            style={{ "--reveal-i": 1 } as CSSProperties}
          >
            {impactSequence.text}
          </p>
          {/* SIS-214 — o `kicker` desceu para cá (ver a nota longa acima). Segue
              sendo o texto de `src/data/legacy.ts`, palavra por palavra, e segue
              `lp-eyebrow lp-tag` — o chip é o mesmo, só mudou de lugar na pilha. */}
          <p
            className="lp-eyebrow lp-tag"
            data-reveal="fade-up"
            style={{ "--reveal-i": 2 } as CSSProperties}
          >
            {impactSequence.kicker}
          </p>
          {/* SIS-99 — os três capítulos (`<h3>` "Compreender", "Transformar" e
              "Validar e evoluir") ficavam aqui, num `.sequence-chapters`. Saíram
              a pedido: a seção termina no parágrafo sobre o Luminna AI.

              Com eles foi também o único `<h3>` da seção, então a hierarquia de
              títulos aqui passa a ser só o `<h2>` — não há salto de nível a
              corrigir. */}
        </motion.div>
      </div>
    </section>
  )
}
