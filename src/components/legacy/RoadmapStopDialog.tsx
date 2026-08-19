"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { stageLabel, type RoadmapStop } from "@/data/legacy"
import { stageVisualLabel, stopVisual } from "@/lib/legacyRoadmap"
import { pauseSmoothScroll, resumeSmoothScroll, syncSmoothScroll } from "@/lib/smoothScroll"
import { RoadmapStopMedia } from "./RoadmapStopMedia"

/**
 * Rótulo padrão do botão de link externo do modal. Uma parada só precisa
 * informar `label` quando quiser nomear o destino ("Explore o SDS"); sem ele,
 * o botão cai aqui — nenhuma parada futura fica sem texto.
 */
const LINK_LABEL_FALLBACK = "Explore o site"

type Props = {
  stop: RoadmapStop
  /** Índice zero-based na trilha; a numeração visível soma 1. */
  index: number
  total: number
  onClose: () => void
}

/**
 * Detalhe de uma parada do roadmap em `<dialog>` nativo.
 *
 * `showModal()` traz foco preso no diálogo, fechamento por Esc, `aria-modal` e
 * inércia do resto da página sem uma linha de JS extra — é justamente essa
 * parte que costuma quebrar quando o modal é uma div com `position: fixed`.
 * O que o nativo não faz é travar o scroll do documento, então isso entra à
 * mão: classe em `documentElement` mais `stop()` no Lenis, que escuta a roda no
 * window.
 *
 * Renderizado em `document.body` por portal, e não apenas fora da `<ol>`: o pai
 * já o mantinha fora da lista, mas ainda dentro de `.roadmap`, que tem
 * `overflow-x: clip`. O `position: fixed` que faz o diálogo cobrir a tela vem da
 * regra `dialog:modal` do navegador — não do CSS do projeto —, então basta um
 * ancestral com `transform`, `filter` ou `clip` para conter o modal na seção. No
 * body não há ancestral nenhum a conter.
 */
export function RoadmapStopDialog({ stop, index, total, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  // O efeito de abertura roda uma única vez; a referência mantém o callback
  // atual sem religar o listener a cada render do pai.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  // O portal só existe no cliente. Sem esta guarda o primeiro render no servidor
  // teria uma árvore diferente da hidratação.
  const [montado, setMontado] = useState(false)
  useEffect(() => setMontado(true), [])

  // O `close` nativo é ouvido à mão, e o aviso ao pai só sai se o diálogo
  // estiver de fato fechado. O motivo é o remonte do StrictMode: a limpeza
  // chama `dialog.close()`, o evento `close` que isso emite é assíncrono e
  // chega depois do `showModal()` do segundo efeito — ou seja, com o modal já
  // aberto de novo. Sem a guarda, esse eco avisava o pai, que voltava
  // `opened` para null e desmontava o modal recém-aberto: clicar no card não
  // abria nada. Conferir `dialog.open` distingue o eco do fechamento real.
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    const avisar = () => {
      if (!dialog.open) onCloseRef.current()
    }
    dialog.addEventListener("close", avisar)

    // A posição é lida ANTES de abrir, e essa ordem é a correção.
    //
    // Antes, `window.scrollY` era lido depois do `showModal()`. Só que abrir um
    // diálogo modal move o foco para o primeiro elemento focável dentro dele, e
    // o navegador rola a página para trazer esse elemento à vista — o salto para
    // o topo acontecia aí. A leitura posterior fotografava a posição JÁ
    // quebrada, a limpeza a restaurava, e `syncSmoothScroll` ensinava ao Lenis
    // que aquele valor errado era o certo: por isso fechar o modal não devolvia
    // o leitor para a Jornada.
    const top = window.scrollY

    if (!dialog.open) {
      dialog.showModal()

      // Foco explícito e sem rolagem: `preventScroll` impede o navegador de
      // trazer o botão à vista arrastando a página.
      const primeiro = dialog.querySelector<HTMLElement>(".stop-dialog-close")
      primeiro?.focus({ preventScroll: true })

      // Rede de segurança, independente da causa: se qualquer coisa na abertura
      // ainda mexeu no scroll, ele volta imediatamente — antes do primeiro
      // quadro pintado, então não se vê o salto.
      if (window.scrollY !== top) window.scrollTo({ top, behavior: "instant" })
    }

    // A trava é por evento, não por `overflow: hidden`: mudar o overflow do
    // html (ou do body, que propaga para a viewport) torna a viewport não
    // rolável e o navegador grampeia o offset em zero.
    //
    // Só o que nasce fora do miolo do diálogo é barrado; dentro dele a rolagem
    // nativa segue funcionando, como o `data-lenis-prevent` já garante para o
    // Lenis. Esta trava não protege da abertura: ela cancela gestos do usuário,
    // e o salto vinha de uma rolagem programática do navegador, que nenhum
    // `preventDefault` alcança.
    const dentroDoDialogo = (alvo: EventTarget | null) =>
      alvo instanceof Node && dialog.contains(alvo)

    const travarRolagem = (event: Event) => {
      if (event.cancelable && !dentroDoDialogo(event.target)) event.preventDefault()
    }

    // `passive: false` é obrigatório: sem isso o navegador assume que ninguém
    // vai cancelar wheel/touchmove e o `preventDefault` é ignorado.
    const opcoes = { passive: false } as const
    window.addEventListener("wheel", travarRolagem, opcoes)
    window.addEventListener("touchmove", travarRolagem, opcoes)

    document.documentElement.classList.add("has-dialog")
    pauseSmoothScroll()

    return () => {
      dialog.removeEventListener("close", avisar)
      window.removeEventListener("wheel", travarRolagem)
      window.removeEventListener("touchmove", travarRolagem)
      document.documentElement.classList.remove("has-dialog")

      // Ordem importa: primeiro devolver a rolagem ao documento, depois a
      // posição, e só então religar o Lenis já na altura certa.
      window.scrollTo({ top, behavior: "instant" })
      resumeSmoothScroll()
      syncSmoothScroll(top)

      if (dialog.open) dialog.close()
    }
    // `montado` na lista porque o diálogo só entra no DOM depois do portal: no
    // primeiro passe `ref.current` ainda é null e o efeito sai pela guarda.
  }, [montado])

  const { detail } = stop
  const visual = stopVisual(stop.stage)
  const accent = {
    "--stop-accent": visual.accent,
    "--stop-gradient": visual.gradient,
  } as CSSProperties

  if (!montado) return null

  return createPortal(
    <dialog
      ref={ref}
      className="stop-dialog"
      aria-labelledby="stop-dialog-title"
      /* Clique no backdrop: o alvo só é o próprio <dialog> quando o ponteiro
         cai fora do conteúdo, que é um elemento filho. */
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
    >
      {/* Duas colunas no molde da vitrine (§12.2): à esquerda a leitura —
          quem, o quê, o checklist e o valor gerado; à direita a peça visual,
          o acesso, as tecnologias e o próximo passo. O contador e o fechar
          ficam sobre as duas, por isso o padding-top folgado do grid. */}
      <div className="stop-dialog-inner" data-stage={stop.stage} style={accent} data-lenis-prevent>
        {/* Contador e fechar na mesma barra, que é `sticky`: o miolo é o que
            rola, e em parada com muitos itens o botão de fechar precisa
            continuar à mão. */}
        <div className="stop-dialog-bar">
          <p className="stop-dialog-counter lp-numeric">
            <b>{String(index + 1).padStart(2, "0")}</b> / {total}
          </p>

          <button type="button" className="stop-dialog-close" onClick={onClose}>
            <span className="sr-only">Fechar detalhes</span>
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="stop-dialog-grid">
          <div className="stop-dialog-main">
            <header className="stop-dialog-head">
              <span className="roadmap-badge" aria-hidden="true">
                {stop.logo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={stop.logo} alt="" decoding="async" />
                ) : (
                  <b>{stop.monogram}</b>
                )}
              </span>
              <p className="stop-dialog-client">{stop.client}</p>
              <p className="stop-dialog-stage">{stop.stageTag ?? stageLabel[stop.stage]}</p>
            </header>

            <h2 id="stop-dialog-title" className="stop-dialog-title">
              {stop.title}
            </h2>

            <p className="stop-dialog-summary">{detail.summary}</p>

            {/* Checklist completo: o card da trilha mostra três itens, aqui
                estão todos — é o aprofundamento que justifica abrir o modal. */}
            <section className="stop-dialog-block stop-dialog-block--flush">
              <h3 className="sr-only">Entregas comprovadas</h3>
              <ul className="stop-dialog-checks">
                {detail.done.map((item) => (
                  <li key={item}>
                    <span className="stop-dialog-check" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Rodapé do painel: `margin-top: auto` no CSS o cola na base,
                como o bloco Valor Gerado da vitrine (§12.4). */}
            <section className="stop-dialog-value">
              <h3>Por que importa</h3>
              <p>{detail.value}</p>
            </section>
          </div>

          <div className="stop-dialog-side">
            {/* Com rótulo próprio, o título da coluna acompanha: deixar
                "Plano em negociação" acima de uma etiqueta "Modernização"
                devolveria ao modal a palavra que saiu dele. */}
            <p className="stop-dialog-side-label">
              {stop.stageTag ? `${stop.stageTag} em destaque` : stageVisualLabel(stop.stage)}
            </p>

            {/* Onde a frente traz rótulo próprio, ele entra sozinho: era aqui que
                saía "Assurant · Aguardando negociação". */}
            <RoadmapStopMedia
              stop={stop}
              tag={stop.stageTag ?? `${stop.client} · ${stageLabel[stop.stage]}`}
              href={detail.link?.href}
            />

            {detail.link ? (
              <a
                className="lp-button lp-button--primary stop-dialog-link"
                href={detail.link.href}
                target="_blank"
                rel="noreferrer"
              >
                {detail.link.label ?? LINK_LABEL_FALLBACK}
              </a>
            ) : null}

            <section className="stop-dialog-block">
              <h3>Arquitetura e ferramentas</h3>
              <ul className="stop-dialog-chips">
                {detail.stack.map((item) => (
                  <li key={item} className="lp-chip">
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Faixa de números, logo abaixo dos chips. Só existe onde a parada
                declara `figures` — nenhuma grade meio vazia. `<dl>` porque cada
                item é par valor/legenda; o `<div>` intermediário é o que a
                especificação exige para agrupar dt+dd num cartão. */}
            {detail.figures?.length ? (
              <section className="stop-dialog-block">
                <h3 className="sr-only">Evidências numéricas</h3>
                <dl className="stop-dialog-figures">
                  {detail.figures.map((figure) => (
                    <div key={figure.label} className="stop-figure">
                      <dt className="stop-figure-value lp-numeric">{figure.value}</dt>
                      <dd className="stop-figure-label">{figure.label}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {stop.next ? (
              <p className="stop-dialog-next">
                <b>Próxima decisão:</b> {stop.next}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </dialog>,
    document.body,
  )
}
