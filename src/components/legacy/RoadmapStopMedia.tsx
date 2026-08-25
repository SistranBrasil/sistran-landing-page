import type { RoadmapStop } from "@/data/legacy"

/**
 * Cartão de mídia da coluna direita do modal — o molde `isSDSSinistro` de
 * `ProjectModalVisual` (vitrine, §12.6 A): faixa de mídia branca em cima,
 * rodapé falso de player embaixo, pílula de legenda fora do cartão.
 *
 * Três decisões que vêm do original e não são estéticas:
 *
 * 1. **Fundo branco com a logo em `inset: 22`** em vez de `padding`. Logo de
 *    marca vem desenhada para fundo claro, e é o contraste com o azul do modal
 *    que faz o cartão existir. `object-fit: contain` — `cover` cortaria a logo.
 * 2. **Véu só na base.** Existe para dar contraste ao selo; escurecer a imagem
 *    inteira sujaria a logo.
 * 3. **Sem botão de play.** No original ele é condicional a `v.configured`, e
 *    esta apresentação não tem config de vídeo — em vez de exibir o estado
 *    "VÍDEO NÃO CONFIGURADO", que não informa nada a quem assiste, o cartão é
 *    estático. Quando houver vídeo, o play e o lightbox entram aqui.
 *
 * A flutuação e a `drop-shadow` no accent ficam no CSS. `drop-shadow`, não
 * `box-shadow`: ela segue o alpha do cartão.
 */
export function RoadmapStopMedia({
  stop,
  tag,
  href,
}: {
  stop: RoadmapStop
  tag: string
  /** Endereço público da frente. Onde existe, o cartão inteiro passa a ser o
   *  link — é a peça que o visitante tenta clicar antes de procurar o botão. */
  href?: string
}) {
  /* Âncora só onde há destino: um <a> sem `href` não recebe foco nem entra na
     navegação por teclado, e um cartão clicável que não leva a lugar nenhum é
     pior do que um cartão estático. O rótulo é obrigatório porque o conteúdo do
     cartão é todo decorativo — sem ele, o leitor de tela anunciaria um link sem
     nome. `noopener` para não entregar o `window.opener` ao destino. */
  const Card = href ? "a" : "div"
  const cardProps = href
    ? ({
        href,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `Abrir ${stop.title} em outra aba`,
      } as const)
    : {}

  return (
    <figure className="stop-media">
      <Card className="stop-media-card" data-link={href ? "true" : undefined} {...cardProps}>
        <div className="stop-media-frame">
          {stop.logo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={stop.logo} alt={`Marca de ${stop.client}`} loading="lazy" decoding="async" />
          ) : (
            <b aria-hidden="true">{stop.monogram}</b>
          )}
          <span className="stop-media-veil" aria-hidden="true" />
        </div>

        {/* Rodapé de player: decoração que dá escala e leitura de "peça de
            mídia" ao cartão. Inteiro aria-hidden — as barrinhas não são
            conteúdo, e o nome já está no título do modal. */}
        <div className="stop-media-foot" aria-hidden="true">
          <span className="stop-media-sigla">{stop.monogram}</span>
          <span className="stop-media-bars">
            <i />
            <i />
          </span>
          <p className="stop-media-name">{stop.title}</p>
        </div>
      </Card>

      <figcaption className="stop-media-tag">{tag}</figcaption>
    </figure>
  )
}
