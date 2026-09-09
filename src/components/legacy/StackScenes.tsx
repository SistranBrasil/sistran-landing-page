"use client"

import "./legacy.css"
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react"
import Image from "next/image"
import { useEffect, useRef } from "react"
// Imports comentados junto com o consumo (abertura do Método, os quatro
// movimentos, o vídeo e o tile viajante, mais abaixo): ativos, quebrariam o lint
// por import não utilizado, e o `ScrollVideo` puxaria um componente para o bundle
// sem ninguém para renderizá-lo. Removidos, apagariam a pista de como religar —
// os módulos seguem intactos.
// import { ScrollVideo } from "@/components/primitives/ScrollVideo"
// import { SectionIntro } from "./SectionIntro"
// import { TechnicalBackdrop } from "./TechnicalBackdrop"
// import { useActiveStep } from "@/lib/useActiveStep"
import { useReducedMotion } from "@/lib/motion"
// `scenes` e `scenesIntro` saíram do import junto com o JSX que os consumia.
import { mosaicIntro, mosaicIntroHome, mosaicTiles } from "@/data/legacy"
// SIS-68: os quatro pilares saem de `DIFFERENTIALS`, a MESMA fonte da seção
// `Differentials` (hoje comentada na home). Um array novo aqui criaria duas
// fontes para os mesmos quatro rótulos, e elas divergiriam na primeira revisão.
import { DIFFERENTIALS } from "@/data/differentials"
import { getIcon } from "@/lib/icons"

/* As três declarações abaixo (`CARRIER`, `CARRIER_VIDEO` e `offsetIn`) ficaram
   sem consumidor com o tile viajante e o vídeo comentados, e são mantidas de
   propósito: guardam a receita do reencode all-intra e a medição de layout que
   qualquer religamento precisa. */

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

/* Havia aqui um `GRUPO_TILE` que dividia os dez cartões em três grupos de
   leitura e deixava só um grupo visível por trecho da rolagem. Saiu junto com o
   portão de visibilidade em `legacy.css`: com três de dez em cena as goteiras
   ficavam praticamente vazias. Os grupos que sobraram são os do palco de fotos,
   derivados direto do progresso em `aplicarGrupo`. */

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

/**
 * SIS-68 — duas variantes do MESMO teatro.
 *
 * `legado` (padrão) é o que sempre existiu: kicker "Arquitetura", título
 * "destino adequado ao contexto". É o cabeçalho certo em
 * `/transformacao-legado`, onde a seção abre a página.
 *
 * `home` troca a abertura por "Entrega com Alta Performance e Comprometimento"
 * e acrescenta os quatro pilares. O padrão continua sendo `legado` de
 * propósito: quem religar a seção em outra rota herda o texto antigo, que é o
 * neutro, em vez da escrita específica da home.
 */
type Variante = "legado" | "home"

/**
 * SIS-90 — o palco da home é UMA foto: a do time (`escritoriosp.jpg`).
 *
 * Eram três, trocando por grupo de leitura ao lado do texto, em duas colunas.
 * Duas coisas derrubaram esse arranjo: a foto ao lado do título competia com ele
 * (e o prédio visto de baixo, `sistransphist.jpg`, não é o assunto que o texto
 * afirma), e a composição pedida é a de `/transformacao-legado` — texto centrado,
 * cartões nas duas goteiras, a imagem CENTRADA ABAIXO, no lugar que lá é do
 * cartão "Arquitetura modular e escalável".
 *
 * Com uma foto só, não há mais troca: o `data-grupo-ativo` deixou de ter
 * consumidor e não é mais escrito. O que sobra do relógio é `data-em-cena`, o
 * portão da entrada.
 *
 * `escritoriosp.jpg` não é escolha estética: é a foto que o viajante do
 * `MosaicHandoff` carrega até o card 01 de "Soluções de Negócios". A que está no
 * palco tem de ser exatamente a que viaja — trocar aqui quebra a emenda.
 */
const PALCO_HOME = ["/images/home/escritoriosp.jpg"] as const

export function StackScenes({ variante = "legado" }: { variante?: Variante } = {}) {
  const naHome = variante === "home"
  /* Índice ativo das etapas comentado junto com os quatro movimentos (ver o
     bloco `.scene-steps` no JSX abaixo): sem os botões, `active`, `setActive` e
     `register` ficariam sem uso e o lint quebraria. Religar é descomentar aqui e
     lá.
  const { active, setActive, register } = useActiveStep(scenes.length)
  */
  const wrap = useRef<HTMLDivElement>(null)
  const stack = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  /* Refs e estado da travessia comentados junto com o vídeo e o tile viajante:
     `media` e `carrier` eram as duas pontas medidas do percurso, `travel` guardava
     a geometria e `landingY`/`sceneEndY` eram os dois extremos do relógio do
     vídeo. Sem tile e sem caixa de destino nada disso tem consumidor, e o lint
     quebra com variável não utilizada.

  const media = useRef<HTMLDivElement>(null)
  const carrier = useRef<HTMLDivElement>(null)
  const [travel, setTravel] = useState<Travel | null>(null)
  const [landingY, setLandingY] = useState<number | null>(null)
  const [sceneEndY, setSceneEndY] = useState<number | null>(null)
  */

  /* Duas medições comentadas junto com o tile viajante e o vídeo: a primeira
     media o percurso do tile até a caixa do card, a segunda o topo da última
     etapa (extremo final do relógio do vídeo). A segunda ficou procurando um
     `.scene-step` que não é mais renderizado, então nunca chegava a um valor.

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
  */

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

  /* ── Os dez cartões em cena ─────────────────────────────────────────────────
     Por um tempo os tiles foram divididos em três grupos de leitura e só um
     grupo ficava visível por trecho da rolagem. O efeito em tela era o oposto do
     pretendido: as duas goteiras têm altura de várias telas e passavam quase
     vazias, com um cartão de cada lado ou nenhum. Voltaram todos, que já era o
     estado sem JS e com movimento reduzido — e por isso a camada de tiles não
     recebe mais atributo de grupo. */
  /* SIS-90 — o palco da home tem uma foto só, então não há mais grupo de leitura
     para escrever: `data-grupo-ativo` saiu daqui e do CSS junto com as outras
     duas fotos. O que resta do relógio é o portão da entrada. */
  const palco = useRef<HTMLDivElement>(null)
  const aplicarGrupo = (p: number) => {
    if (reduced) return
    /* SIS-90 — `em-cena` é o portão da entrada do palco: só existe enquanto o
       mosaico está de facto no enquadramento. Sem ele a animação de entrada
       dispararia no mount, com a seção telas abaixo do fold, e o visitante
       chegaria à foto já parada. As pontas (0 e 1) acontecem com a seção fora do
       enquadramento — o relógio é `start end`→`end start`. */
    const emCena = p > 0.02 && p < 0.98
    const no = palco.current
    if (!no) return
    if (emCena) {
      if (no.dataset.emCena === undefined) no.dataset.emCena = ""
    } else if (no.dataset.emCena !== undefined) {
      delete no.dataset.emCena
    }
  }
  useMotionValueEvent(stackProgress, "change", aplicarGrupo)
  /* `useMotionValueEvent` só dispara na MUDANÇA: quem chega pelo meio da página
     (link com hash, recarregamento com a rolagem restaurada) não veria evento
     nenhum e o palco não saberia que já está em cena. Uma leitura no mount
     resolve. Sob movimento reduzido `aplicarGrupo` não escreve nada — e sem
     `data-em-cena` a foto já está no lugar, parada, que é o estado final. */
  useEffect(() => {
    aplicarGrupo(stackProgress.get())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  /* Relógio do vídeo e travessia do tile, comentados junto com os dois.
     `handoff` media o percurso pela caixa de destino (`media`), que não existe
     mais; `cx`/`cy`/`csx`/`csy` aplicavam a geometria medida, `label` apagava o
     rótulo antes de a escala distorcê-lo, `carrierOut`/`mediaIn` faziam a troca
     final e `reel` era o tempo do vídeo. Sem consumidor, o lint quebra.
     Religar é descomentar aqui, os refs e estados acima, as duas medições e os
     blocos de JSX correspondentes.

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
  */

  return (
    <div ref={wrap} className="stack-scenes">
      <section
        id="sinais"
        ref={stack}
        className="mosaic"
        /* SIS-90 — o atributo é o portão de TODA a mudança de layout desta issue.
           `/transformacao-legado` monta o mesmo componente sem `variante`, não
           recebe o atributo e continua com o texto centrado e o cartão dominante
           no meio, exatamente como antes. */
        data-variante={naHome ? "home" : undefined}
        aria-labelledby="sinais-title"
      >
        {/* SIS-90 — `.mosaic-duo` existe nas duas variantes e é inerte no legado
            (uma grade de uma coluna centrada, que era o que o `.mosaic` já fazia
            com o texto). Envolver sempre, em vez de só na home, evita duas
            árvores diferentes para o mesmo componente — e é o que permite ao CSS
            virar duas colunas com um seletor só. */}
        <div className="mosaic-duo">
          {/* ── Palco da foto, só na home ──────────────────────────────────────
              A foto do time era o cartão dominante (`left: 50%`, `top: 56%`, até
              34rem), centrado e sobreposto ao texto — a sobreposição que a SIS-90
              reportou. Passou então a ser a coluna da esquerda de uma linha de
              duas colunas, e aí competia com o título.
              Agora é o que a composição de `/transformacao-legado` faz: célula
              seguinte da MESMA coluna, portanto centrada ABAIXO do texto, no
              lugar que lá é do cartão "Arquitetura modular e escalável". Duas
              células de grade, nunca duas camadas — sobreposição continua
              impossível por construção.
              `aria-hidden`: a foto ilustra o texto e não acrescenta informação —
              o mesmo critério dos tiles do mosaico, que também vão com
              `alt=""`. */}
          {naHome ? (
            <div
              ref={palco}
              className="mosaic-palco"
              aria-hidden="true"
              /* Ponta de origem da travessia até a foto do card 01 de Soluções
                 (`ui/MosaicHandoff`). Migrou para cá do cartão dominante, que
                 nesta variante não é renderizado: o viajante mede
                 `[data-carrier-origem]` por `getBoundingClientRect`, então basta
                 a marca estar na caixa que o visitante está de facto vendo. */
              data-carrier-origem=""
            >
              {/* Camada só da entrada. Separada da caixa porque a caixa já tem a
                  opacidade tomada pelo handoff (`--carrier-fonte`, regra global
                  `[data-carrier-origem]`) — duas animações de opacidade no mesmo
                  nó e uma anula a outra. */}
              <div className="mosaic-palco-entrada">
                {PALCO_HOME.map((foto) => (
                  <span key={foto} className="mosaic-palco-quadro">
                    {/* `sizes` acompanha a caixa: 28vw no desktop (ver
                        `.mosaic-palco` em `legacy.css`), largura útil no
                        telefone. Errar aqui faz o Next servir um arquivo maior
                        do que a caixa jamais mostra. */}
                    <Image src={foto} alt="" fill sizes="(max-width: 64rem) 92vw, 30vw" />
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          <motion.div className="mosaic-copy" style={reduced ? undefined : { y: copyY }}>
          {/* Sem kicker na home: a tag foi removida a pedido. A seção não fica
              sem nome acessível — o `aria-labelledby` aponta para o próprio
              `<h2 id="sinais-title">`, que continua aqui nas duas variantes. */}
          {naHome ? null : <p className="lp-eyebrow lp-tag">{mosaicIntro.kicker}</p>}
          <h2 id="sinais-title" className="lp-display lp-display--lg">
            {naHome ? (
              <>
                {mosaicIntroHome.tituloAntes}
                {/* Classe própria, e NÃO `.text-gradient-brand`: aquela é
                    clara-sobre-escuro (#a5f3fc → #fff → #e9d5ff) e o mosaico é
                    bloco claro (`--paper: #ffffff`) fora de `.section-light`,
                    onde vive a única variante escura do gradiente. Reusar a
                    classe deixaria o realce quase invisível — branco sobre
                    branco. Ver `.mosaic-realce` em `legacy.css`. */}
                <span className="mosaic-realce">{mosaicIntroHome.tituloRealce}</span>
                {mosaicIntroHome.tituloDepois}
              </>
            ) : (
              mosaicIntro.title
            )}
          </h2>
          <p className="lp-lead">{naHome ? mosaicIntroHome.text : mosaicIntro.text}</p>

          {/* Os quatro pilares, só na home. Título apenas: `DIFFERENTIALS`
              carrega `description`, mas as caixas do site são só rótulo — e uma
              das descrições ainda diz "mais de 150 clientes" (o número correto
              é 130), erro que não é desta issue e que não vale trazer para a
              tela. Ícones decorativos: o texto ao lado já é o nome. */}
          {naHome ? (
            <ul className="mosaic-pilares">
              {DIFFERENTIALS.map((pilar) => {
                const Icone = getIcon(pilar.icon)
                return (
                  <li key={pilar.id} className="mosaic-pilar">
                    <span className="mosaic-pilar-marca" aria-hidden="true" style={{ color: pilar.color }}>
                      <Icone />
                    </span>
                    <span className="mosaic-pilar-nome">{pilar.title}</span>
                  </li>
                )
              })}
            </ul>
          ) : null}
          </motion.div>
        </div>

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
              data-dominante={tile.id === CARRIER ? "" : undefined}
              aria-hidden={tile.href ? undefined : true}
              // O tile viajante é renderizado fora desta camada (o `overflow`
              // daqui cortaria o percurso), mas continua ocupando a vaga:
              // removê-lo da lista deslocaria todos os `:nth-child` seguintes e
              // dois tiles cairiam na mesma posição.
              // O `visibility: hidden` do tile viajante saiu junto com ele: a vaga
              // só ficava escondida porque um clone fazia a travessia por cima.
              // Sem o clone, esconder deixaria um buraco no mosaico.
              // visibility: tile.id === CARRIER ? "hidden" : undefined,
              style={{ y: tile.layer === "fast" ? fast : slow }}
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
                  /* Ponta de origem da travessia até a foto do card 01 de
                     "Soluções de Negócios" (`ui/MosaicHandoff`): é a face que o
                     viajante mede e substitui. Marca de medição apenas — sem o
                     efeito o tile continua aqui, parado e visível.

                     SIS-90 — na home a marca migrou para o `.mosaic-palco`: o
                     cartão dominante não é renderizado nessa variante, e
                     `MosaicHandoff` usa `querySelector`, que pararia no primeiro
                     nó marcado do documento — um cartão de largura zero, o que
                     desliga a travessia inteira. */
                  data-carrier-origem={tile.id === CARRIER && !naHome ? '' : undefined}
                  className={`mosaic-face${tile.video || tile.image ? " mosaic-face--media" : ""}${
                    tile.href ? " mosaic-face--link" : ""
                  }`}
                >
                  {/* Ilustração decorativa: o rótulo já nomeia o tile, então o
                      `alt` fica vazio para o leitor de tela não repetir.

                      SIS-70 — o comentário que estava aqui dizia que "o
                      otimizador entra aqui". Não entra: o projeto roda com
                      `images: { unoptimized: true }` (`next.config.mjs`), então
                      o `next/image` serve o arquivo do disco como ele está. O
                      diagnóstico do comentário estava certo (PNG de ~1,8 MB num
                      cartão de no máximo 176px, 10× os pixels necessários) e a
                      conclusão errada — ninguém estava consertando isso.

                      Agora os cinco tiles apontam para WebP de 440px gerados por
                      `scripts/otimizar-tiles-mosaico.mjs`: 10,9 MB → 226 kB. O
                      `<Image>` fica pelo `fill` e pelo `sizes`, não pela
                      compressão. */}
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

      {/* Tile de ligação comentado junto com o vídeo, e não por escolha estética:
          ele nascia no mosaico e aterrissava EXATAMENTE na `.scene-media` — a
          viagem (`x`, `y`, `scaleX`, `scaleY`) é medida entre os refs `carrier` e
          `media`. Sem a caixa de destino ele viajaria para uma posição
          indefinida. Com ele fora, o tile "Arquitetura modular e escalável"
          volta a aparecer parado no próprio mosaico (ver o `visibility` na camada
          de tiles acima). Religar é descomentar este bloco, a plumbing de
          medição no corpo do componente e a caixa de vídeo abaixo.
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
      */}

      {/* Seção do Método comentada por inteiro. Depois da SIS-26 (texto e os
          quatro movimentos) e da SIS-27 (vídeo e tile viajante) ela não tinha
          mais conteúdo: sobrava uma faixa escura com grafismo de fundo e um
          container vazio. O lugar dela na página passou a ser ocupado pelo teatro
          de "Soluções de Negócios", renderizado logo depois deste componente em
          `src/app/page.tsx`.

          A âncora `#sistema` sai com ela. Ninguém aponta para lá — nem o menu
          (`src/data/nav.ts`), nem o `ScrollSpy`, nem link interno algum; só um
          comentário de referência no `MetricsStrip`.

          Um comentário só, e não vários aninhados: em JSX o primeiro fechamento
          de bloco encerra tudo, então os marcadores internos foram achatados em
          texto. Religar é restaurar este bloco (e, dentro dele, o `SectionIntro`
          e a `.scene-story`), mais a plumbing e os imports no topo do arquivo.
          `aria-label` no lugar de `aria-labelledby="sistema-title"`: o título que
          carregava esse `id` foi comentado, e apontar para um nó inexistente
          deixaria a seção sem nome acessível. Ao religar o `SectionIntro`, voltar
          para o `aria-labelledby`.    
      <section id="sistema" className="lp-section lp-section--dark" aria-label="Método">
        <TechnicalBackdrop density={12} />
        <div className="lp-container" style={{ position: "relative" }}>
              Abertura do Método comentada a pedido — o kicker "Método | quatro
              movimentos", o título "A transformação começa quando o legado se
              torna explicável." e o parágrafo "Quatro movimentos organizam a
              transformação...". Comentada, e não removida: `scenesIntro`
              continua em `src/data/legacy.ts` e o `SectionIntro` continua
              existindo, então religar é descomentar este bloco e o import no
              topo do arquivo.
          <SectionIntro
            id="sistema-title"
            kicker={scenesIntro.kicker}
            title={scenesIntro.title}
            text={scenesIntro.text}
            progressive
          />
             

              `.scene-story` inteira comentada: a caixa de vídeo (SIS-27) e os
              quatro movimentos (SIS-26) eram as duas colunas dela, e uma grade de
              duas colunas sem conteúdo em nenhuma delas só reservaria altura
              vazia.

              O vídeo saiu a pedido. Nem o componente `ScrollVideo`, nem o CSS
              `.scene-media` / `.scene-video` / `.scene-steps`, nem os dados em
              `src/data/legacy.ts`, nem o arquivo `/videos/process-scroll.mp4`
              foram removidos — religar é descomentar este bloco, a plumbing de
              medição no corpo do componente, o `useActiveStep` e os imports no
              topo do arquivo.

              Um comentário só, e não três aninhados: em JSX o primeiro fechamento
              de bloco encerra tudo, então um marcador interno terminaria o
              comentário no meio e o resto da árvore voltaria a ser código.

          <div className="scene-story">
            <motion.div
              ref={media}
              className="scene-media"
              aria-hidden="true"
              style={travel ? { opacity: mediaIn } : undefined}
            >
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
      */}
    </div>
  )
}
