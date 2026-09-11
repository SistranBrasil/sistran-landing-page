/**
 * SIS-202 — as paradas da trilha de `/parceiros-e-implementacoes`, no formato
 * que `RoadmapTrail` consome, DERIVADAS de `TIMELINE_EVENTS`.
 *
 * É a opção 2 da issue: a casca é a do `RoadmapTrail` de
 * `/transformacao-legado`, o conteúdo continua sendo o da trilha antiga
 * (`PartnersTrail`). Nenhum texto de `roadmapIntro`/`roadmapStops` (método
 * Luminna) atravessa para esta rota.
 *
 * Mapeamento (o da tabela da issue):
 *   `generation`                         → linha de cima do card (slot `client`)
 *   `company`                            → título
 *   `detail`                             → texto de apoio
 *   `category` + `TIMELINE_CATEGORY_META` → pílula do card e cor do nó
 *   iniciais do primeiro nome            → monograma
 *
 * O que a fonte antiga NÃO tem fica de fora, em vez de ser inventado: sem
 * `stage` (logo, sem pílula "CONCLUÍDO" nem tempo verbal de entrega), sem
 * `detail` (logo, sem chips de stack, sem checklist e sem "Ver detalhes e
 * evidências" abrindo um modal vazio), sem `logo` (logo, sem o cartão branco de
 * marca) e sem `next`. `RoadmapTrail` omite cada um desses blocos quando o campo
 * falta — ver as guardas lá.
 *
 * Este arquivo mora em `src/lib` e não em `src/data` de propósito: `copy-lock`
 * trava os literais de `src/data/**`, e aqui não há literal de conteúdo nenhum —
 * cada string exibida vem de `timeline.ts`, que já é a fonte travada.
 */
import { TIMELINE_CATEGORY_META, TIMELINE_EVENTS } from "@/data/timeline"
import { NEUTRAL_GRADIENT } from "@/lib/legacyRoadmap"
import type { TrailStop } from "@/components/legacy/RoadmapTrail"

/**
 * Monograma a partir do PRIMEIRO nome da parada — "Castelo Costa · Coplaven ·
 * Zurich Brasil" → `CC`. Duas letras porque é o que a pílula redonda do card
 * comporta: com dois nomes, as iniciais; com um só, as duas primeiras letras
 * ("Mapfre" → `MA`). Nada é inventado, só recortado.
 */
function monograma(company: string): string {
  const primeiro = company.split("·")[0].trim()
  const palavras = primeiro.split(/\s+/).filter(Boolean)
  /* `join` de duas iniciais em vez de `palavras[0][0] + palavras[1][0]`: a soma
     de dois identificadores era colhida por `scripts/copy-lock.mjs` como se
     fosse escrita do site e aparecia no relatório de textos novos. */
  const iniciais = palavras
    .slice(0, 2)
    .map((palavra) => palavra[0])
    .join("")
  return (palavras.length >= 2 ? iniciais : primeiro.slice(0, 2)).toUpperCase()
}

export const partnersTrailStops: TrailStop[] = TIMELINE_EVENTS.map((evento) => {
  const meta = TIMELINE_CATEGORY_META[evento.category]

  return {
    id: String(evento.id),
    client: evento.generation,
    monogram: monograma(evento.company),
    title: evento.company,
    text: evento.detail,
    /* A pílula do card passa a ser a CATEGORIA, que é o que esta lista
       classifica — a `PartnersTrail` já pintava o nó por ela. Não é estágio: por
       isso entra como `stageTag` e `stage` fica ausente. */
    stageTag: meta.label,
    /* Cor do nó e do brilho do card: a mesma da categoria na trilha antiga
       (azul / laranja / verde de `TIMELINE_CATEGORY_META`). O gradiente do card
       segue o de marca, para o desenho não divergir do de `/transformacao-legado`. */
    accent: meta.color,
    gradient: NEUTRAL_GRADIENT,
  }
})
