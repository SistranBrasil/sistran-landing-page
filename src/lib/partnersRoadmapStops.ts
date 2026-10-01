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
 * evidências" abrindo um modal vazio) e sem `next`. `RoadmapTrail` omite cada um
 * desses blocos quando o campo falta — ver as guardas lá.
 *
 * ── `logo` PASSOU A EXISTIR (2ª volta da SIS-202) ──
 *
 * Esta lista nasceu SEM `logo`, e a razão escrita era boa na época: a fonte
 * (`timeline.ts`) não traz arquivo de marca, e inventar um seria conteúdo
 * fabricado. O que mudou não é a fonte — é o acervo: `public/logos-parceiros/`
 * tem 23 PNGs de marca, e a issue mandou LIGAR os que casam com as paradas.
 * Então o `logo` não é inventado: é DERIVADO por casamento de nome, e a parada
 * sem arquivo continua sem `logo` (cai no monograma, que é o ramo que já existia).
 *
 * O pedido é o da captura: a placa branca do canto mostrava o monograma «CC» e
 * passa a mostrar a marca. Quem decide isso é `RoadmapTrail` — ver
 * "O `logo` VAI NO SELO" lá.
 *
 * Este arquivo mora em `src/lib` e não em `src/data` de propósito: `copy-lock`
 * trava os literais de `src/data/**`, e aqui não há literal de conteúdo nenhum —
 * cada string exibida vem de `timeline.ts`, que já é a fonte travada.
 */
import { TIMELINE_CATEGORY_META, TIMELINE_EVENTS } from "@/data/timeline"
import { NEUTRAL_GRADIENT } from "@/lib/legacyRoadmap"
import { logoDaMarca, monogramaDaMarca } from "@/lib/logoDeMarca"
import type { TrailStop } from "@/components/legacy/RoadmapTrail"

/* A tabela de marcas, o monograma e o casamento por nome SAÍRAM deste arquivo para
   `src/lib/logoDeMarca.ts` quando o segundo consumidor apareceu: os cards do fluxo
   detalhado (`src/data/trajectory.ts`) precisam da MESMA resposta. Duas cópias
   divergiriam na primeira marca nova, e divergiriam em silêncio — o modo de falha é
   um card com monograma onde o outro mostra a logo. As notas de por que cada chave
   tem uma palavra só e de por que o casamento usa `\b` moram lá agora. */

export const partnersTrailStops: TrailStop[] = TIMELINE_EVENTS.map((evento) => {
  const meta = TIMELINE_CATEGORY_META[evento.category]

  return {
    id: String(evento.id),
    client: evento.generation,
    monogram: monogramaDaMarca(evento.company),
    /* O monograma CONTINUA sendo montado mesmo onde há logo: ele é o ramo de
       reserva do selo (parada sem arte) e o rótulo do cartão de marca, e custa
       duas letras. Calcular só na ausência de logo economizaria nada e daria ao
       tipo um campo opcional a mais para as guardas cobrirem. */
    logo: logoDaMarca(evento.company),
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
