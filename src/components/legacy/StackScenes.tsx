"use client"

import "./legacy.css"
import { motion, useScroll, useSpring, useTransform } from "motion/react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ScrollVideo } from "@/components/primitives/ScrollVideo"
import { SectionIntro } from "./SectionIntro"
import { TechnicalBackdrop } from "./TechnicalBackdrop"
import { useActiveStep } from "@/lib/useActiveStep"
import { useReducedMotion } from "@/lib/motion"
import { mosaicIntro, mosaicTiles, scenes, scenesIntro } from "@/data/legacy"

/** Tile da Stack que desce e se torna o card 01 das Frentes. */
const CARRIER = "microservicos"

/**
 * Vídeo que o tile viajante carrega e o card 01 continua exibindo.
 *
 * Não é o `process.mp4` original: aquele tem **um único keyframe** em oito segundos,
 * então cada seek obrigava o decodificador a recomeçar do quadro zero e o scrub
 * engasgava. Este é o mesmo material reencodado all-intra (todo quadro é
 * keyframe), o que torna o seek imediato. Custa 3,7 MB no lugar de 2,2 MB —
 * barato pelo que resolve.
 *
 *   ffmpeg -i process.mp4 -an -c:v libx264 -preset slow -crf 30 -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart process-scroll.mp4
 */
const CARRIER_VIDEO = "/videos/process-scroll.mp4"

/** Deslocamento acumulado de um nó até `root`, em valores de layout. */
function offsetIn(node: HTMLElement, root: HTMLElement) {
  let x = 0
  let y = 0
  let el: HTMLElement | null = node
  while (el && el !== root) {
    x += el.offsetLeft
    y += el.offsetTop
    el = el.offsetParent as HTMLElement | null
  }
  return { x, y }
}

/**
 * Stack e Frentes num bloco só, para um tile poder atravessar a emenda.
 *
 * O tile "Microserviços" é o elemento de ligação: ele sai do mosaico da Stack,
 * desce e se expande até ocupar exatamente a caixa do card 01 das Frentes, onde
 * cede lugar ao card real numa troca curta de opacidade. Por isso ele é
 * renderizado FORA do `.mosaic` — dentro dele o `overflow: hidden` cortaria o
 * percurso na primeira borda.
 *
 * A geometria é medida (não estimada) e o `transform-origin` é o canto superior
 * esquerdo: assim `dx/dy` e `scaleX/scaleY` fazem as duas caixas coincidirem
 * pixel a pixel no pouso, sem correção de centro.
 *
 * Tudo é transform e opacidade sobre o layout final do CSS. Abaixo de 64rem, ou
 * com reduced motion, `travel` fica nulo, o tile viajante não é renderizado e o
 * card aparece direto no lugar — o tile é decorativo, nada se perde.
 */
type Travel = { dx: number; dy: number; sx: number; sy: number }

export function StackScenes() {
  const { active, setActive, register } = useActiveStep(scenes.length)
  const wrap = useRef<HTMLDivElement>(null)
  const stack = useRef<HTMLElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const carrier = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [travel, setTravel] = useState<Travel | null>(null)
  // Posição do card (`to.y` da medição abaixo), em pixels a partir do topo de
  // `wrap`. É o gatilho do relógio do vídeo (`reel`, abaixo): o vídeo só deve
  // começar a andar quando o tile pousar alinhado com a cena 1.
  const [landingY, setLandingY] = useState<number | null>(null)
  // Topo da última etapa (`scenes.length - 1`), em pixels a partir do topo de
  // `wrap`. É o outro extremo do relógio do vídeo: o vídeo deve terminar
  // exatamente quando a cena 4 chega, não quando o bloco inteiro sai de tela.
  const [sceneEndY, setSceneEndY] = useState<number | null>(null)

  // Mede o percurso do tile até a caixa do card. Só valores de layout
  // (offsetTop/offsetWidth) — `getBoundingClientRect` já viria com o transform
  // aplicado e a medida se realimentaria a cada frame.
  useEffect(() => {
    const frame = wrap.current
    const block = stack.current
    const card = media.current
    if (!frame || !block || !card) return

    const measure = () => {
      const wide = window.matchMedia("(min-width: 64rem)").matches
      if (reduced || !wide) {
        setTravel(null)
        setLandingY(null)
        return
      }

      const start = carrier.current
      // Largura zero = tile escondido pelo CSS (reduced motion ou tela estreita).
      if (!start || start.offsetWidth === 0) {
        setTravel(null)
        setLandingY(null)
        return
      }

      // Parte da faixa de rodapé do mosaico, onde fica a vaga do tile
      // (`:nth-child(9)`, escondida): perto do fim da Stack, o percurso até o
      // card ainda cabe numa janela. Um pouco acima dos 87% da vaga original
      // porque este tile é bem maior que os vizinhos e, na altura dela,
      // transbordaria para dentro da seção seguinte.
      frame.style.setProperty("--carrier-top", `${block.offsetTop + block.offsetHeight * 0.74}px`)
      const from = offsetIn(start, frame)
      const to = offsetIn(card, frame)
      const next: Travel = {
        dx: to.x - from.x,
        dy: to.y - from.y,
        sx: card.offsetWidth / start.offsetWidth,
        sy: card.offsetHeight / start.offsetHeight,
      }
      setTravel((previous) =>
        previous &&
        Math.abs(previous.dx - next.dx) < 0.5 &&
        Math.abs(previous.dy - next.dy) < 0.5 &&
        Math.abs(previous.sx - next.sx) < 0.01 &&
        Math.abs(previous.sy - next.sy) < 0.01
          ? previous
          : next,
      )

      setLandingY((previous) => (previous !== null && Math.abs(previous - to.y) < 0.5 ? previous : to.y))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    observer.observe(block)
    // Altura do bloco depende da fonte carregada: remede quando ela chega.
    document.fonts?.ready.then(measure).catch(() => undefined)

    return () => observer.disconnect()
  }, [reduced])

  // Mede o topo da última etapa, independente da medição do tile viajante
  // acima: ela roda em toda largura de tela e com reduced motion, porque o
  // vídeo continua correndo com o scroll nesses casos — só o tile que soma o
  // Stack às Frentes é que desliga.
  useEffect(() => {
    const frame = wrap.current
    if (!frame) return

    const measure = () => {
      const last = frame.querySelector<HTMLElement>(`.scene-step[data-index="${scenes.length - 1}"]`)
      if (!last) return
      const next = offsetIn(last, frame).y
      setSceneEndY((previous) => (previous !== null && Math.abs(previous - next) < 0.5 ? previous : next))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    document.fonts?.ready.then(measure).catch(() => undefined)

    return () => observer.disconnect()
  }, [])

  // Parallax dos tiles da Stack.
  const { scrollYProgress: stackProgress } = useScroll({
    target: stack,
    offset: ["start end", "end start"],
  })
  const slow = useTransform(stackProgress, [0, 1], [110, -110])
  const fast = useTransform(stackProgress, [0, 1], [230, -230])

  // Amortece o texto do mosaico. O `position: sticky` sozinho engata e desengata
  // de um frame para o outro; um deslocamento pequeno com mola dá inércia à
  // entrada e à saída, e o bloco parece desacelerar até parar em vez de travar.
  // Anulado com reduced motion — aqui é puro efeito.
  const copyDrift = useTransform(stackProgress, [0, 0.5, 1], [56, 0, -56])
  const copyY = useSpring(copyDrift, { stiffness: 90, damping: 26, mass: 0.6 })

  // Percurso medido pela caixa de destino, não pelo bloco da Stack.
  //
  // Termina em `start 45%`: o pouso acontece com o topo do card a 45% da janela,
  // ainda longe dos 6.5rem em que o `position: sticky` dele engata. É isso que
  // garante "o mesmo card" — enquanto não está preso, a posição pintada do card
  // é a posição de layout que a medição usou, e as duas caixas coincidem no
  // instante da troca. Terminando mais tarde, o card já estaria grudado no topo
  // enquanto o tile continuaria descendo até a posição estática, bem mais abaixo:
  // era esse descolamento que fazia o tile "ir longe demais para baixo".
  const { scrollYProgress: handoff } = useScroll({
    target: media,
    offset: ["start 92%", "start 45%"],
  })
  // O trajeto acaba em 0.88, não em 1: sobra folga de scroll para a troca de
  // opacidade acontecer com o tile já parado no lugar exato do card.
  const cx = useTransform(handoff, [0.08, 0.88], [0, travel?.dx ?? 0])
  const cy = useTransform(handoff, [0.08, 0.88], [0, travel?.dy ?? 0])
  const csx = useTransform(handoff, [0.08, 0.88], [1, travel?.sx ?? 1])
  const csy = useTransform(handoff, [0.08, 0.88], [1, travel?.sy ?? 1])
  // O rótulo sai cedo: esticado pela escala ele ficaria distorcido.
  const label = useTransform(handoff, [0.08, 0.28], [1, 0])
  // Fica visível a travessia inteira, inclusive por cima do título da seção
  // ("A transformação começa..."): com `z-index: 3` (`.stack-carrier`) contra o
  // `z-index: auto` do `#sistema`, o tile já pinta acima do texto sem precisar
  // desaparecer no meio do caminho. Só cai na troca final (0.88–0.98, mesmo
  // intervalo do `mediaIn`, abaixo), quando cede lugar ao card.
  const carrierOut = useTransform(handoff, [0.88, 0.98], [1, 0])
  const mediaIn = useTransform(handoff, [0.88, 0.98], [0, 1])

  // Relógio do vídeo. Medido no bloco inteiro (Stack + Frentes), não na coluna
  // de etapas, pelo mesmo motivo do `reel` original: `.scene-media` é sticky,
  // presa no topo, e o retângulo dela não se move — o progresso congelaria
  // durante a leitura das quatro etapas.
  //
  // O mesmo valor alimenta as duas telas, então na troca de opacidade ambas
  // mostram o mesmo quadro e o corte é invisível.
  //
  // Começa no pouso do tile (`landingY`, a posição do card medida em
  // `to.y`), não antes: o vídeo fica parado no quadro zero enquanto o tile
  // ainda está no mosaico, e só passa a andar quando ele alinha com a cena 1.
  // `50.64%` é o mesmo ponto de tela em que o handoff acima termina de aplicar
  // `dx/dy` (92% − 0.88 × (92% − 45%)) — sem essa conta, o relógio do vídeo e
  // o pouso do tile ficam fora de sincronia. Sem medida ainda (`landingY`
  // nulo — primeiro frame, tela estreita ou reduced motion), cai de volta no
  // topo do bloco.
  //
  // Termina em `${sceneEndY}px 55%`: 55% da tela é o mesmo limiar em que o
  // `useActiveStep` (rootMargin -45%/-45%) marca uma etapa como ativa, então o
  // vídeo bate o quadro final no instante exato em que a cena 4 assume — não
  // antes (ainda em transição) nem depois (só quando o bloco inteiro já saiu
  // de tela, o que deixava o vídeo preso a meio caminho enquanto a cena 4
  // ainda estava sendo lida). Sem medida ainda, cai de volta em `end start`.
  const { scrollYProgress: reel } = useScroll({
    target: wrap,
    offset: [
      landingY !== null ? `${landingY}px 50.64%` : "start center",
      sceneEndY !== null ? `${sceneEndY}px 55%` : "end start",
    ],
  })

  return (
    <div ref={wrap} className="stack-scenes">
      <section id="sinais" ref={stack} className="mosaic" aria-labelledby="sinais-title">
        <motion.div className="mosaic-copy" style={reduced ? undefined : { y: copyY }}>
          <p className="lp-eyebrow lp-tag">{mosaicIntro.kicker}</p>
          <h2 id="sinais-title" className="lp-display lp-display--lg">
            {mosaicIntro.title}
          </h2>
          <p className="lp-lead">{mosaicIntro.text}</p>
        </motion.div>

        {/* O `aria-hidden` saiu da camada e passou a ser por tile: três deles são
            links para a LP da frente, e conteúdo focável dentro de uma subárvore
            escondida é um beco sem saída para leitor de tela e teclado.
            `aria-hidden` não se desfaz num descendente, então tinha de sair
            daqui. Os sete tiles decorativos continuam escondidos, um a um. */}
        <div className="mosaic-layer">
          {mosaicTiles.map((tile) => (
            <motion.div
              key={tile.id}
              className="mosaic-tile mosaic-tile--3d"
              aria-hidden={tile.href ? undefined : true}
              // O tile viajante é renderizado fora desta camada (o `overflow`
              // daqui cortaria o percurso), mas continua ocupando a vaga:
              // removê-lo da lista deslocaria todos os `:nth-child` seguintes e
              // dois tiles cairiam na mesma posição.
              style={{
                y: tile.layer === "fast" ? fast : slow,
                visibility: tile.id === CARRIER ? "hidden" : undefined,
              }}
            >
              {/* Três camadas, três transforms independentes — cada efeito precisa
                  do seu, porque `transform` é uma propriedade só:
                    tile   → parallax (escrito inline pelo Motion)
                    float  → flutuação contínua (@keyframes)
                    face   → tilt de repouso e hover (transition)
                  Juntar float e face num elemento faria a animação vencer o hover
                  no cascade, e o cartão nunca vinha para frente. */}
              <span className="mosaic-float">
                <span
                  className={`mosaic-face${tile.video || tile.image ? " mosaic-face--media" : ""}${
                    tile.href ? " mosaic-face--link" : ""
                  }`}
                >
                  {/* Ilustração decorativa: o rótulo já nomeia o tile, então o
                      `alt` fica vazio para o leitor de tela não repetir. O
                      otimizador entra aqui — ao contrário do logo do header, este
                      é um PNG de ~1,8 MB num cartão de no máximo 176px, e sem
                      redimensionar seriam 10× os pixels necessários. */}
                  {tile.image ? (
                    <Image
                      className="mosaic-image"
                      src={tile.image}
                      alt=""
                      fill
                      sizes="(max-width: 64rem) 45vw, 11rem"
                    />
                  ) : null}
                  {/* Loop solto, não dirigido pelo scroll: este tile é vitrine,
                      não peça da narrativa. `muted` é obrigatório para o
                      autoplay, e `playsInline` impede o fullscreen forçado no
                      iOS. Com movimento reduzido não toca — fica o primeiro
                      quadro, que já é imagem suficiente. */}
                  {tile.video ? (
                    <video
                      className="mosaic-video"
                      src={tile.video}
                      autoPlay={!reduced}
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : null}
                  <span className="mosaic-label">{tile.label}</span>
                  {/* A âncora cobre a face inteira: o alvo de toque é o cartão,
                      não a seta. O nome acessível vem do `sr-only` porque o
                      rótulo visível está fora do link — mantê-lo fora é o que
                      preserva o layout e o contraste do texto sobre a mídia. */}
                  {tile.href ? (
                    <a
                      className="mosaic-link"
                      href={tile.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="sr-only">
                        {tile.label} (abre em outra aba)
                      </span>
                      <span className="mosaic-link-mark" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  ) : null}
                </span>
                {/* Tooltip FORA da face, e por um motivo mecânico: a face tem
                    `overflow: hidden` para recortar a mídia no raio do cartão, e
                    qualquer balão nascido lá dentro seria cortado na borda. Aqui
                    ele flutua acima do tile. Decorativo: quem já ouve o nome do
                    link é o `sr-only` da âncora. */}
                {tile.href ? (
                  <span className="mosaic-tip" aria-hidden="true">
                    Abrir a apresentação
                  </span>
                ) : null}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tile de ligação: nasce no mosaico e termina como a caixa do card 01. */}
      <motion.div
        ref={carrier}
        className="mosaic-tile stack-carrier"
        aria-hidden="true"
        style={travel ? { x: cx, y: cy, scaleX: csx, scaleY: csy, opacity: carrierOut } : undefined}
      >
        <ScrollVideo className="carrier-video" src={CARRIER_VIDEO} progress={reel} />
        <motion.span style={travel ? { opacity: label } : undefined}>
          {mosaicTiles.find((tile) => tile.id === CARRIER)?.label}
        </motion.span>
      </motion.div>

      <section id="sistema" className="lp-section lp-section--dark" aria-labelledby="sistema-title">
        <TechnicalBackdrop density={12} />
        <div className="lp-container" style={{ position: "relative" }}>
          <SectionIntro
            id="sistema-title"
            kicker={scenesIntro.kicker}
            title={scenesIntro.title}
            text={scenesIntro.text}
            progressive
          />

          <div className="scene-story">
            <motion.div
              ref={media}
              className="scene-media"
              aria-hidden="true"
              style={travel ? { opacity: mediaIn } : undefined}
            >
              {/* A caixa é só o vídeo durante as quatro etapas. O tempo dele é
                  a posição de scroll, então ele continua correndo enquanto a
                  caixa fica presa no topo e o leitor percorre os passos. */}
              <ScrollVideo className="scene-video" src={CARRIER_VIDEO} progress={reel} />
            </motion.div>

            <div className="scene-steps">
              {scenes.map((scene, index) => (
                <button
                  key={scene.id}
                  type="button"
                  ref={register(index)}
                  data-index={index}
                  className={index === active ? "scene-step is-active" : "scene-step"}
                  aria-current={index === active}
                  onClick={() => setActive(index)}
                  onFocus={() => setActive(index)}
                >
                  <span className="scene-step-index lp-numeric">{scene.step}</span>
                  <h3>{scene.title}</h3>
                  <p>{scene.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
